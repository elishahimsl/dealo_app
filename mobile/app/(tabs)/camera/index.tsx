import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Easing, Image, LayoutChangeEvent, StyleSheet, Text, View, TouchableOpacity, Modal, Dimensions, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const BRAND_GREEN = '#0E9F6E';

type NormalizedBox = { x: number; y: number; width: number; height: number };
type DetectedObject = {
  name: string;
  category: string;
  confidence: number;
  bounds: NormalizedBox;
  description: string;
  features: string[];
  priceRange: string;
  alternatives: string[];
};

type BarcodeLookupState = {
  status: 'idle' | 'loading' | 'done' | 'error';
  name: string;
  imageUri: string;
  error?: string;
};

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

const normalizeBox = (b: NormalizedBox): NormalizedBox => ({
  x: clamp01(b.x),
  y: clamp01(b.y),
  width: clamp01(b.width),
  height: clamp01(b.height),
});

type VisionVertex = { x?: number; y?: number };
type VisionNormalizedVertex = { x?: number; y?: number };

const pickFirstString = (candidates: Array<string | undefined | null>) => {
  for (const c of candidates) {
    const v = (c ?? '').trim();
    if (v) return v;
  }
  return '';
};

const joinBrandModel = (brand: string, model: string) => {
  const b = brand.trim();
  const m = model.trim();
  if (!b && !m) return '';
  if (!b) return m;
  if (!m) return b;
  if (m.toLowerCase().startsWith(b.toLowerCase())) return m;
  return `${b} ${m}`;
};

const pickTopTextLine = (text: unknown) => {
  if (typeof text !== 'string') return '';
  const lines = text
    .split(/\r?\n/g)
    .map((l) => l.trim())
    .filter(Boolean);
  // Prefer short-ish lines that look like a product/brand, not paragraphs
  const candidate = lines.find((l) => l.length >= 3 && l.length <= 40) ?? lines[0] ?? '';
  return candidate;
};

const detectObject = async (photo: { uri: string; base64: string }): Promise<DetectedObject | null> => {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_VISION_API_KEY;
  if (!apiKey) {
    return {
      name: 'Unknown Product',
      category: 'Unknown',
      confidence: 0.5,
      bounds: normalizeBox({ x: 0.22, y: 0.22, width: 0.56, height: 0.56 }),
      description: '',
      features: [],
      priceRange: '',
      alternatives: [],
    };
  }

  try {
    const url = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
    const body = {
      requests: [
        {
          image: { content: photo.base64 },
          features: [
            { type: 'WEB_DETECTION', maxResults: 20 },
            { type: 'LOGO_DETECTION', maxResults: 10 },
            { type: 'TEXT_DETECTION', maxResults: 5 },
            { type: 'OBJECT_LOCALIZATION', maxResults: 10 },
            { type: 'LABEL_DETECTION', maxResults: 12 },
          ],
        },
      ],
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) return null;
    const json: any = await res.json();
    const first = json?.responses?.[0];

    const bestGuessLabel = pickFirstString([
      first?.webDetection?.bestGuessLabels?.[0]?.label,
      first?.webDetection?.bestGuessLabels?.[1]?.label,
    ]);

    const topWebEntity = first?.webDetection?.webEntities?.find((e: any) => e?.description && (e?.score ?? 0) >= 0.2);
    const webEntityDesc = (topWebEntity?.description ?? '') as string;

    const topLogo = first?.logoAnnotations?.find((l: any) => l?.description)?.description as string | undefined;
    const topText = pickTopTextLine(first?.fullTextAnnotation?.text);

    const bestGuess = pickFirstString([
      joinBrandModel(topLogo ?? '', bestGuessLabel),
      joinBrandModel(topLogo ?? '', webEntityDesc),
      bestGuessLabel,
      webEntityDesc,
      topText,
      first?.labelAnnotations?.[0]?.description,
    ]);

    const category = pickFirstString([
      first?.labelAnnotations?.[0]?.description,
      first?.webDetection?.webEntities?.[0]?.description,
      topLogo,
      'Unknown',
    ]);

    const obj = first?.localizedObjectAnnotations?.[0];
    const score =
      typeof obj?.score === 'number'
        ? obj.score
        : typeof topWebEntity?.score === 'number'
          ? topWebEntity.score
          : typeof first?.labelAnnotations?.[0]?.score === 'number'
            ? first.labelAnnotations[0].score
            : 0.7;

    const verts: VisionNormalizedVertex[] = obj?.boundingPoly?.normalizedVertices ?? [];
    const xs = verts.map((v: VisionVertex) => (typeof v.x === 'number' ? v.x : 0));
    const ys = verts.map((v: VisionVertex) => (typeof v.y === 'number' ? v.y : 0));
    const minX = xs.length ? Math.min(...xs) : 0.18;
    const minY = ys.length ? Math.min(...ys) : 0.22;
    const maxX = xs.length ? Math.max(...xs) : 0.82;
    const maxY = ys.length ? Math.max(...ys) : 0.78;

    return {
      name: bestGuess || 'Unknown Product',
      category: category || 'Unknown',
      confidence: clamp01(score),
      bounds: normalizeBox({ x: minX, y: minY, width: maxX - minX, height: maxY - minY }),
      description: '',
      features: [],
      priceRange: '',
      alternatives: [],
    };
  } catch (_e) {
    return null;
  }
};

export default function CameraScreen() {
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();

  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [mode, setMode] = useState<'identify' | 'scan' | 'ar'>('identify');

  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  const [capturedBase64, setCapturedBase64] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [previewSize, setPreviewSize] = useState<{ width: number; height: number } | null>(null);
  const [detectedObject, setDetectedObject] = useState<DetectedObject | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [showARComingSoon, setShowARComingSoon] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState<{ type: string; data: string } | null>(null);
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const [barcodeLookup, setBarcodeLookup] = useState<BarcodeLookupState>({ status: 'idle', name: '', imageUri: '' });
  const lastBarcodeRef = useRef<string | null>(null);

  const reticleSize = 190;

  const initialBoxPx = useMemo(() => {
    const w = previewSize?.width ?? 0;
    const h = previewSize?.height ?? 0;
    const left = Math.max(0, (w - reticleSize) / 2);
    const top = Math.max(0, (h - reticleSize) / 2);
    return { left, top, width: reticleSize, height: reticleSize };
  }, [previewSize]);

  const boxLeft = useRef(new Animated.Value(0)).current;
  const boxTop = useRef(new Animated.Value(0)).current;
  const boxWidth = useRef(new Animated.Value(reticleSize)).current;
  const boxHeight = useRef(new Animated.Value(reticleSize)).current;
  const scanLineY = useRef(new Animated.Value(0)).current;
  const scanPulse = useRef(new Animated.Value(0)).current;
  const scanLoopRef = useRef<Animated.CompositeAnimation | null>(null);
  const scanPulseRef = useRef<Animated.CompositeAnimation | null>(null);
  const scanDoneTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetToCamera = () => {
    if (scanDoneTimeoutRef.current) {
      clearTimeout(scanDoneTimeoutRef.current);
      scanDoneTimeoutRef.current = null;
    }
    scanLoopRef.current?.stop();
    scanLoopRef.current = null;
    scanPulseRef.current?.stop();
    scanPulseRef.current = null;
    scanLineY.stopAnimation();
    scanLineY.setValue(0);
    scanPulse.stopAnimation();
    scanPulse.setValue(0);
    setIsScanning(false);
    setCapturedUri(null);
    setCapturedBase64(null);
  };

  const handleGalleryPress = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Photo Library Access',
        'This app needs access to your photos to select images for analysis.',
        [
          {
            text: 'Select Photos...',
            onPress: async () => {
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
                base64: true,
              });
              
              if (!result.canceled && result.assets[0]) {
                setCapturedUri(result.assets[0].uri);
                setCapturedBase64(result.assets[0].base64 ?? null);
                setIsScanning(true);
              }
            }
          },
          {
            text: 'Allow Full Access',
            onPress: async () => {
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
                base64: true,
              });
              
              if (!result.canceled && result.assets[0]) {
                setCapturedUri(result.assets[0].uri);
                setCapturedBase64(result.assets[0].base64 ?? null);
                setIsScanning(true);
              }
            }
          },
          {
            text: 'Don\'t Allow',
            style: 'cancel',
            onPress: () => {
              // User denied access
            }
          }
        ]
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      setCapturedUri(result.assets[0].uri);
      setCapturedBase64(result.assets[0].base64 ?? null);
      setIsScanning(true);
    }
  };

  const onPreviewLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (!width || !height) return;
    setPreviewSize({ width, height });
  };

  const animateBoxToPx = (target: { left: number; top: number; width: number; height: number }) =>
    new Promise<void>((resolve) => {
      Animated.parallel([
        Animated.timing(boxLeft, { toValue: target.left, duration: 420, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
        Animated.timing(boxTop, { toValue: target.top, duration: 420, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
        Animated.timing(boxWidth, { toValue: target.width, duration: 420, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
        Animated.timing(boxHeight, { toValue: target.height, duration: 420, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
      ]).start(() => resolve());
    });

  const startScanLine = (travelPx: number) => {
    scanLoopRef.current?.stop();
    scanPulseRef.current?.stop();
    scanLineY.setValue(0);
    scanPulse.setValue(0);

    const up = Animated.timing(scanLineY, {
      toValue: travelPx,
      duration: 1100,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
    });

    const down = Animated.timing(scanLineY, {
      toValue: 0,
      duration: 1100,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
    });

    scanLoopRef.current = Animated.loop(Animated.sequence([up, down]));
    scanLoopRef.current.start();

    scanPulseRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(scanPulse, { toValue: 1, duration: 520, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(scanPulse, { toValue: 0, duration: 520, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    );
    scanPulseRef.current.start();
  };

  useEffect(() => {
    if (!isScanning || !capturedUri || !previewSize || !capturedBase64) return;

    let alive = true;

    (async () => {
      if (scanDoneTimeoutRef.current) {
        clearTimeout(scanDoneTimeoutRef.current);
        scanDoneTimeoutRef.current = null;
      }
      scanLoopRef.current?.stop();
      scanLoopRef.current = null;
      scanPulseRef.current?.stop();
      scanPulseRef.current = null;
      scanLineY.setValue(0);
      scanPulse.setValue(0);

      boxLeft.setValue(initialBoxPx.left);
      boxTop.setValue(initialBoxPx.top);
      boxWidth.setValue(initialBoxPx.width);
      boxHeight.setValue(initialBoxPx.height);

      // Use AI detection instead of mock bounds
      const detected = await detectObject({ uri: capturedUri, base64: capturedBase64 });
      if (!alive) return;
      
      if (detected) {
        setDetectedObject(detected);
        
        const targetPx = {
          left: detected.bounds.x * previewSize.width,
          top: detected.bounds.y * previewSize.height,
          width: detected.bounds.width * previewSize.width,
          height: detected.bounds.height * previewSize.height,
        };

        const pad = 10;
        const clamped = {
          left: Math.max(pad, Math.min(previewSize.width - pad, targetPx.left)),
          top: Math.max(pad, Math.min(previewSize.height - pad, targetPx.top)),
          width: Math.max(90, Math.min(previewSize.width - pad * 2, targetPx.width)),
          height: Math.max(90, Math.min(previewSize.height - pad * 2, targetPx.height)),
        };

        await animateBoxToPx(clamped);
        if (!alive) return;

        const lineHeight = 4;
        const innerPad = 12;
        const travel = Math.max(0, clamped.height - innerPad * 2 - lineHeight);
        startScanLine(travel);

        scanDoneTimeoutRef.current = setTimeout(() => {
          if (!alive) return;
          // Pass detected object data to results page
          router.push({
            pathname: '/camera/results',
            params: {
              identifyOnly: '1',
              objectName: detected.name,
              category: detected.category,
              confidence: detected.confidence.toString(),
              description: detected.description,
              features: JSON.stringify(detected.features),
              priceRange: detected.priceRange,
              alternatives: JSON.stringify(detected.alternatives),
              imageUri: capturedUri,
            }
          });
        }, 1600);
      }
    })();

    return () => {
      alive = false;
      if (scanDoneTimeoutRef.current) {
        clearTimeout(scanDoneTimeoutRef.current);
        scanDoneTimeoutRef.current = null;
      }
    };
  }, [
    boxHeight,
    boxLeft,
    boxTop,
    boxWidth,
    capturedUri,
    capturedBase64,
    initialBoxPx.height,
    initialBoxPx.left,
    initialBoxPx.top,
    initialBoxPx.width,
    isScanning,
    previewSize,
    router,
    scanLineY,
  ]);

  useEffect(() => {
    if (mode !== 'scan') {
      setScannedBarcode(null);
      setShowBarcodeModal(false);
      setBarcodeLookup({ status: 'idle', name: '', imageUri: '' });
      lastBarcodeRef.current = null;
    }
  }, [mode]);

  const lookupBarcode = async (raw: string) => {
    const barcode = raw.trim();
    if (!barcode) return null;
    if (!/^[0-9]{8,14}$/.test(barcode)) {
      return { name: barcode, imageUri: '' };
    }

    try {
      const offRes = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const offJson: any = await offRes.json();
      const product = offJson?.status === 1 ? offJson?.product : null;
      if (product) {
        const name = (product?.product_name || product?.generic_name || '').trim();
        const brands = (product?.brands || '').trim();
        const mergedName = name ? (brands ? `${brands} ${name}` : name) : brands;
        const imageUri = (product?.image_url || product?.image_front_url || '').trim();
        if (mergedName || imageUri) return { name: mergedName || barcode, imageUri };
      }
    } catch (_e) {
      // ignore
    }

    try {
      const upcRes = await fetch(`https://api.upcitemdb.com/prod/trial/lookup?upc=${barcode}`);
      const upcJson: any = await upcRes.json();
      const first = upcJson?.items?.[0];
      const name = (first?.title || '').trim();
      const imageUri = (Array.isArray(first?.images) ? first.images[0] : '')?.trim?.() ?? '';
      if (name || imageUri) return { name: name || barcode, imageUri };
    } catch (_e) {
      // ignore
    }

    return { name: barcode, imageUri: '' };
  };

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text>Loading camera…</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>No access to camera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
          <Text style={styles.permissionText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 1 });
      if (!photo?.uri) return;
      setCapturedUri(photo.uri);
      setCapturedBase64(photo.base64 ?? null);
      setIsScanning(true);
    } catch (err) {
      console.warn('Failed to take picture', err);
    }
  };

  if (isScanning && capturedUri) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.previewRoot} onLayout={onPreviewLayout}>
          <Image source={{ uri: capturedUri }} style={styles.previewImage} resizeMode="cover" />
          <View style={styles.previewDim} pointerEvents="none" />

          <View style={styles.topControls} pointerEvents="box-none">
            <TouchableOpacity style={styles.backButton} onPress={resetToCamera}>
              <Ionicons name="close" size={22} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.topRightControls}>
              <TouchableOpacity style={styles.helpButton} onPress={() => setShowHelp(true)}>
                <Ionicons name="help-circle-outline" size={22} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.scanOverlay} pointerEvents="none">
            <Animated.View
              style={[
                styles.scanBox,
                {
                  left: boxLeft,
                  top: boxTop,
                  width: boxWidth,
                  height: boxHeight,
                },
              ]}
            >
              <View style={[styles.scanCorner, styles.scanCornerTL]} />
              <View style={[styles.scanCorner, styles.scanCornerTR]} />
              <View style={[styles.scanCorner, styles.scanCornerBL]} />
              <View style={[styles.scanCorner, styles.scanCornerBR]} />

              <Animated.View
                style={[
                  styles.scanLineGlow,
                  {
                    transform: [{ translateY: scanLineY }, { scaleY: scanPulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.35] }) }],
                    opacity: scanPulse.interpolate({ inputRange: [0, 1], outputRange: [0.38, 0.65] }),
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.scanLine,
                  {
                    transform: [{ translateY: scanLineY }],
                  },
                ]}
              />
            </Animated.View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cameraRoot}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
          flash={flash === 'on' ? 'on' : 'off'}
          enableTorch={flash === 'on'}
          barcodeScannerSettings={
            mode === 'scan'
              ? {
                  barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39', 'qr'],
                }
              : undefined
          }
          onBarcodeScanned={
            mode === 'scan' && !scannedBarcode
              ? (e) => {
                  if (!e?.data) return;
                  const data = String(e.data);
                  lastBarcodeRef.current = data;
                  setBarcodeLookup({ status: 'loading', name: '', imageUri: '' });
                  setScannedBarcode({ type: e.type, data });
                  setShowBarcodeModal(true);

                  lookupBarcode(data)
                    .then((r) => {
                      if (lastBarcodeRef.current !== data) return;
                      if (!r) {
                        setBarcodeLookup({ status: 'error', name: data, imageUri: '', error: 'No result' });
                        return;
                      }
                      setBarcodeLookup({ status: 'done', name: r.name || data, imageUri: r.imageUri || '' });
                    })
                    .catch(() => {
                      if (lastBarcodeRef.current !== data) return;
                      setBarcodeLookup({ status: 'error', name: data, imageUri: '', error: 'Lookup failed' });
                    });
                }
              : undefined
          }
        />

        {/* TOP CONTROLS WITH MODE TEXT */}
        <View style={styles.topControls} pointerEvents="box-none">
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="close" size={22} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.topRightControls}>
            <TouchableOpacity style={styles.flashButton} onPress={() => setFlash(flash === 'off' ? 'on' : 'off')}>
              <Ionicons name={flash === 'on' ? 'flash' : 'flash-off'} size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.helpButton} onPress={() => setShowHelp(true)}>
              <Ionicons name="help-circle-outline" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* MODE SELECTOR */}
        <View style={styles.modeRow} pointerEvents="box-none">
          <TouchableOpacity onPress={() => setMode('identify')} activeOpacity={0.9}>
            <Text style={[styles.modeText, mode === 'identify' && styles.modeTextActive]}>Identify</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMode('scan')} activeOpacity={0.9}>
            <Text style={[styles.modeText, mode === 'scan' && styles.modeTextActive]}>Bar-code</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            setMode('ar');
            setShowARComingSoon(true);
          }} activeOpacity={0.9}>
            <Text style={[styles.modeText, mode === 'ar' && styles.modeTextActive]}>AR Mode</Text>
          </TouchableOpacity>
        </View>

        {/* CENTER RETICLE - Different shapes based on mode */}
        <View style={styles.reticleWrap} pointerEvents="none">
          {mode === 'scan' ? (
            <View style={styles.barcodeReticle}>
              <View style={[styles.barcodeCorner, styles.barcodeCornerTL]} />
              <View style={[styles.barcodeCorner, styles.barcodeCornerTR]} />
              <View style={[styles.barcodeCorner, styles.barcodeCornerBL]} />
              <View style={[styles.barcodeCorner, styles.barcodeCornerBR]} />
              <View style={styles.barcodeLines}>
                <View style={styles.barcodeLine} />
                <View style={styles.barcodeLine} />
                <View style={styles.barcodeLine} />
                <View style={styles.barcodeLine} />
                <View style={styles.barcodeLine} />
              </View>
            </View>
          ) : (
            <View style={styles.reticle}>
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />
            </View>
          )}
        </View>

        {/* BOTTOM BAR */}
        <View style={styles.bottomBar} pointerEvents="box-none">
          <TouchableOpacity style={styles.galleryButton} activeOpacity={0.9} onPress={handleGalleryPress}>
            <Ionicons name="images-outline" size={26} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.captureButton} onPress={takePicture} activeOpacity={0.9}>
            <View style={styles.captureInner} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.flipButton} activeOpacity={0.9} onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}>
            <Ionicons name="camera-reverse-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Help Modal */}
      <Modal
        visible={showHelp}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowHelp(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>How to Take Pictures</Text>
            
            <View style={styles.helpImageContainer}>
              <Text style={styles.helpImagePlaceholder}>📷</Text>
            </View>
            
            <View style={styles.helpStepContainer}>
              <Text style={styles.helpStepNumber}>1</Text>
              <Text style={styles.helpStepText}>Center object in frame</Text>
            </View>
            
            <View style={styles.helpStepContainer}>
              <Text style={styles.helpStepNumber}>2</Text>
              <Text style={styles.helpStepText}>Tap capture button</Text>
            </View>
            
            <View style={styles.helpStepContainer}>
              <Text style={styles.helpStepNumber}>3</Text>
              <Text style={styles.helpStepText}>Wait for AI analysis</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setShowHelp(false)}
            >
              <Text style={styles.closeButtonText}>Got it!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showBarcodeModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowBarcodeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Barcode Found</Text>
            <View style={styles.helpImageContainer}>
              {barcodeLookup.status === 'loading' ? (
                <View style={{ alignItems: 'center', gap: 10 }}>
                  <ActivityIndicator color={BRAND_GREEN} />
                  <Text style={styles.helpImagePlaceholder}>Looking up product…</Text>
                </View>
              ) : barcodeLookup.imageUri ? (
                <Image source={{ uri: barcodeLookup.imageUri }} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
              ) : (
                <Text style={styles.helpImagePlaceholder}>{barcodeLookup.name || scannedBarcode?.data || ''}</Text>
              )}
            </View>

            {barcodeLookup.status === 'done' && barcodeLookup.name ? (
              <Text style={[styles.helpStepText, { marginTop: -6 }]} numberOfLines={2}>
                {barcodeLookup.name}
              </Text>
            ) : null}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                const name = barcodeLookup.name || scannedBarcode?.data || 'Unknown Product';
                const imageUri = barcodeLookup.imageUri || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80';
                setShowBarcodeModal(false);
                setScannedBarcode(null);
                lastBarcodeRef.current = null;
                router.push({
                  pathname: '/camera/results',
                  params: {
                    objectName: name,
                    category: 'General',
                    confidence: '1',
                    imageUri,
                  },
                });
              }}
              disabled={barcodeLookup.status === 'loading'}
            >
              <Text style={styles.closeButtonText}>View Results</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setShowBarcodeModal(false);
                setScannedBarcode(null);
                setBarcodeLookup({ status: 'idle', name: '', imageUri: '' });
                lastBarcodeRef.current = null;
              }}
            >
              <Text style={styles.closeButtonText}>Scan again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* AR Coming Soon Overlay */}
      {showARComingSoon && (
        <View style={styles.arOverlay}>
          <View style={styles.arContent}>
            <Text style={styles.arTitle}>AR Mode</Text>
            <Text style={styles.arText}>Coming Soon!</Text>
            <Text style={styles.arText}>Get ready for an amazing augmented reality experience.</Text>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setShowARComingSoon(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },

  cameraRoot: {
    flex: 1,
  },

  previewRoot: {
    flex: 1,
    backgroundColor: 'black',
  },

  previewImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },

  previewDim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },

  scanOverlay: {
    ...StyleSheet.absoluteFillObject,
  },

  scanBox: {
    position: 'absolute',
  },

  scanCorner: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderColor: BRAND_GREEN,
    opacity: 0.9,
  },

  scanCornerTL: {
    left: 0,
    top: 0,
    borderLeftWidth: 6,
    borderTopWidth: 6,
    borderTopLeftRadius: 14,
  },

  scanCornerTR: {
    right: 0,
    top: 0,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderTopRightRadius: 14,
  },

  scanCornerBL: {
    left: 0,
    bottom: 0,
    borderLeftWidth: 6,
    borderBottomWidth: 6,
    borderBottomLeftRadius: 14,
  },

  scanCornerBR: {
    right: 0,
    bottom: 0,
    borderRightWidth: 6,
    borderBottomWidth: 6,
    borderBottomRightRadius: 14,
  },

  scanLine: {
    position: 'absolute',
    left: 12,
    right: 12,
    top: 12,
    height: 4,
    backgroundColor: '#24D39A',
    shadowColor: '#24D39A',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 18,
    elevation: 10,
    borderRadius: 999,
    opacity: 0.95,
  },

  scanLineGlow: {
    position: 'absolute',
    left: 8,
    right: 8,
    top: 6,
    height: 22,
    backgroundColor: 'rgba(36,211,154,0.22)',
    borderRadius: 999,
  },

  camera: {
    ...StyleSheet.absoluteFillObject,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },

  permissionButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
  },

  permissionText: {
    color: 'white',
    fontWeight: '600',
  },

  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 8,
  },
  topRightControls: {
    flexDirection: 'row',
    gap: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flashButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topModeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 28,
    paddingTop: 8,
    paddingBottom: 16,
  },
  reticleWrap: {
    position: 'absolute',
    top: '35%',
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reticle: {
    width: 190,
    height: 190,
  },
  corner: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  cornerTL: {
    left: 0,
    top: 0,
    borderLeftWidth: 6,
    borderTopWidth: 6,
    borderTopLeftRadius: 14,
  },
  cornerTR: {
    right: 0,
    top: 0,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderTopRightRadius: 14,
  },
  cornerBL: {
    left: 0,
    bottom: 0,
    borderLeftWidth: 6,
    borderBottomWidth: 6,
    borderBottomLeftRadius: 14,
  },
  cornerBR: {
    right: 0,
    bottom: 0,
    borderRightWidth: 6,
    borderBottomWidth: 6,
    borderBottomRightRadius: 14,
  },
  modeRow: {
    position: 'absolute',
    bottom: 90,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 28,
  },
  modeText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontWeight: '700',
  },
  modeTextActive: {
    color: BRAND_GREEN,
  },
  bottomBar: {
    position: 'absolute',
    bottom: -40,
    left: 0,
    right: 0,
    top: undefined,
    height: 120,
    backgroundColor: 'rgba(17,24,39,0.92)',
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  galleryButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.92,
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: BRAND_GREEN,
    shadowColor: BRAND_GREEN,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  
  // Barcode reticle styles
  barcodeReticle: {
    width: 240,
    height: 120,
    position: 'relative',
  },
  barcodeCorner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: BRAND_GREEN,
    opacity: 0.9,
  },
  barcodeCornerTL: {
    left: 0,
    top: 0,
    borderLeftWidth: 4,
    borderTopWidth: 4,
    borderTopLeftRadius: 8,
  },
  barcodeCornerTR: {
    right: 0,
    top: 0,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderTopRightRadius: 8,
  },
  barcodeCornerBL: {
    left: 0,
    bottom: 0,
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    borderBottomLeftRadius: 8,
  },
  barcodeCornerBR: {
    right: 0,
    bottom: 0,
    borderRightWidth: 4,
    borderBottomWidth: 4,
    borderBottomRightRadius: 8,
  },
  barcodeLines: {
    position: 'absolute',
    left: 20,
    right: 20,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  barcodeLine: {
    width: 3,
    height: '80%',
    backgroundColor: BRAND_GREEN,
    opacity: 0.7,
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 30,
    margin: 20,
    maxWidth: 400,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  helpImageContainer: {
    width: 280,
    height: 200,
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpImagePlaceholder: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  helpStepContainer: {
    marginBottom: 15,
    alignItems: 'center',
  },
  helpStepNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: BRAND_GREEN,
    marginBottom: 5,
  },
  helpStepText: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 20,
  },
  closeButton: {
    backgroundColor: BRAND_GREEN,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  arOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 30,
    margin: 20,
    alignItems: 'center',
  },
  arTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: BRAND_GREEN,
    marginBottom: 15,
  },
  arText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 25,
  },
});
