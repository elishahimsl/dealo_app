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
  webPages: { url: string; title: string }[];
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

const DEFAULT_BOUNDS: NormalizedBox = { x: 0.12, y: 0.15, width: 0.76, height: 0.70 };

const callVisionAPI = async (base64: string, apiKey: string): Promise<any> => {
  const url = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
  const body = {
    requests: [
      {
        image: { content: base64 },
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

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: controller.signal as any,
  });
  clearTimeout(timeout);

  if (!res.ok) {
    const errBody = await res.text().catch(() => '');
    throw new Error(`Vision API ${res.status}: ${errBody.slice(0, 200)}`);
  }
  return res.json();
};

// Terms that are NOT product names — filter these out aggressively
const GENERIC_BLOCKLIST = new Set([
  'product', 'signage', 'sign', 'electronics', 'technology', 'gadget', 'device',
  'brand', 'design', 'font', 'text', 'logo', 'label', 'packaging', 'advertising',
  'graphic design', 'banner', 'poster', 'display', 'photograph', 'image', 'picture',
  'computer', 'mobile phone', 'smartphone', 'tablet', 'laptop', 'camera', 'monitor',
  'hardware', 'software', 'accessory', 'equipment', 'tool', 'material', 'object',
  'item', 'thing', 'stuff', 'goods', 'merchandise', 'commodity', 'article',
  'plastic', 'metal', 'rubber', 'fabric', 'textile', 'glass', 'wood', 'paper',
  'rectangle', 'circle', 'square', 'shape', 'pattern', 'color', 'colour',
  'indoor', 'outdoor', 'room', 'table', 'desk', 'shelf', 'floor', 'wall',
  'close-up', 'macro', 'still life', 'automotive', 'vehicle',
  'electric blue', 'audio equipment', 'electronic device', 'multimedia',
  'communication device', 'personal computer', 'output device',
  // Colors — never a product name
  'tan', 'black', 'white', 'red', 'blue', 'green', 'yellow', 'orange', 'purple',
  'pink', 'brown', 'grey', 'gray', 'silver', 'gold', 'teal', 'navy', 'beige',
  'ivory', 'maroon', 'magenta', 'cyan', 'turquoise', 'coral', 'crimson',
  // Common nouns / measurement words
  'meter', 'metre', 'wire', 'cable', 'cord', 'charger', 'adapter', 'plug',
  'box', 'bag', 'case', 'cover', 'holder', 'stand', 'mount', 'bracket',
  'button', 'switch', 'knob', 'dial', 'handle', 'grip', 'strap', 'band',
  'light', 'lamp', 'bulb', 'led', 'screen', 'panel', 'board', 'surface',
  'top', 'bottom', 'side', 'front', 'back', 'left', 'right', 'center',
  'small', 'large', 'medium', 'big', 'tiny', 'mini', 'compact', 'portable',
  'new', 'old', 'modern', 'vintage', 'classic', 'original', 'premium',
  'photo', 'video', 'audio', 'sound', 'music', 'noise', 'speaker',
  'power', 'energy', 'electric', 'battery', 'charge', 'usb', 'bluetooth',
  'home', 'office', 'kitchen', 'bathroom', 'bedroom', 'garage', 'garden',
  'hand', 'finger', 'person', 'people', 'man', 'woman', 'child', 'face',
]);

// Known major brands — if we see these in any signal, boost them
const KNOWN_BRANDS = new Set([
  'jbl', 'sony', 'bose', 'apple', 'samsung', 'nike', 'adidas', 'beats', 'lg',
  'google', 'microsoft', 'dell', 'hp', 'lenovo', 'asus', 'acer', 'razer',
  'logitech', 'anker', 'skullcandy', 'sennheiser', 'harman', 'marshall',
  'bang & olufsen', 'b&o', 'ultimate ears', 'ue', 'jabra', 'audio-technica',
  'shure', 'beyerdynamic', 'plantronics', 'corsair', 'steelseries', 'hyperx',
  'nintendo', 'playstation', 'xbox', 'gopro', 'dji', 'canon', 'nikon', 'fujifilm',
  'dyson', 'kitchenaid', 'instant pot', 'ninja', 'breville', 'cuisinart',
  'north face', 'patagonia', 'under armour', 'new balance', 'puma', 'reebok',
  'columbia', 'lululemon', 'ray-ban', 'oakley', 'yeti', 'hydro flask',
  'crocs', 'birkenstock', 'vans', 'converse', 'dr. martens',
]);

const containsKnownBrand = (s: string): boolean => {
  const lower = s.toLowerCase();
  for (const brand of KNOWN_BRANDS) {
    if (lower.includes(brand)) return true;
  }
  return false;
};

const isGenericTerm = (s: string): boolean => {
  const lower = s.toLowerCase().trim();
  if (!lower || lower.length < 2) return true;
  if (GENERIC_BLOCKLIST.has(lower)) return true;
  // ALWAYS allow known brands, regardless of length (JBL=3, LG=2, HP=2, DJI=3)
  if (containsKnownBrand(lower)) return false;
  // Single word checks — only apply to non-brand terms
  const words = lower.split(/\s+/);
  if (words.length === 1 && lower.length <= 3) return true;
  if (words.length === 1 && lower.length <= 6 && !/\d/.test(lower)) return true;
  return false;
};

const parseVisionResponse = (json: any): DetectedObject => {
  const first = json?.responses?.[0];

  // Log raw response keys for debugging empty-candidate issues
  const rawWebEntities = first?.webDetection?.webEntities ?? [];
  const rawBestGuess = first?.webDetection?.bestGuessLabels ?? [];
  const rawLogos = first?.logoAnnotations ?? [];
  const rawLabels = first?.labelAnnotations ?? [];
  const rawObjects = first?.localizedObjectAnnotations ?? [];
  const rawPages = first?.webDetection?.pagesWithMatchingImages ?? [];
  console.log('[DeaLo] Vision RAW:', {
    webEntities: rawWebEntities.length,
    bestGuess: rawBestGuess.map((l: any) => l?.label),
    logos: rawLogos.map((l: any) => l?.description),
    labels: rawLabels.slice(0, 5).map((l: any) => l?.description),
    objects: rawObjects.map((o: any) => o?.name),
    pages: rawPages.length,
    hasError: !!first?.error,
    errorMsg: first?.error?.message,
  });

  // --- Collect ALL signals ---
  const bestGuessLabels: string[] = (first?.webDetection?.bestGuessLabels ?? [])
    .map((l: any) => (l?.label ?? '').trim())
    .filter(Boolean);

  const webEntities: { desc: string; score: number }[] = (first?.webDetection?.webEntities ?? [])
    .filter((e: any) => e?.description)
    .map((e: any) => ({ desc: (e.description as string).trim(), score: (e.score as number) || 0.5 }));

  const logoAnnotations: string[] = (first?.logoAnnotations ?? [])
    .filter((l: any) => l?.description)
    .map((l: any) => (l.description as string).trim());

  const topText = pickTopTextLine(first?.fullTextAnnotation?.text);

  const labelAnnotations: string[] = (first?.labelAnnotations ?? [])
    .map((l: any) => (l?.description ?? '').trim())
    .filter(Boolean);

  // Extract product names from pages with matching images
  const pagesWithMatchingImages: string[] = (first?.webDetection?.pagesWithMatchingImages ?? [])
    .map((p: any) => (p?.pageTitle ?? '').trim())
    .filter((t: string) => t.length > 3 && t.length < 120);

  // Extract names from visually similar image page titles
  const visuallySimilarTitles: string[] = (first?.webDetection?.visuallySimilarImages ?? [])
    .map((p: any) => (p?.url ?? ''))
    .filter(Boolean);

  // --- Helper: clean a page title into a potential product name ---
  const cleanPageTitle = (raw: string): string => {
    return raw
      .replace(/<[^>]*>/g, '')                         // Remove HTML tags
      .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
      .replace(/\s*[-|–—]\s*[^-|–—]*$/g, '')           // Remove trailing " - Store Name"
      .replace(/\s*[-|–—]\s*[^-|–—]*$/g, '')           // Second pass for double separators
      .replace(/^Buy\s+/i, '')                          // Remove "Buy " prefix
      .replace(/^Shop\s+/i, '')                         // Remove "Shop " prefix
      .replace(/\s*\(.*?\)\s*/g, ' ')                   // Remove parentheticals
      .replace(/,\s*\d+\s*pack\b/i, '')                 // Remove ", 2 pack" etc
      .replace(/\s+/g, ' ')
      .trim();
  };

  // --- Helper: score a candidate based on specificity ---
  const specificityScore = (name: string): number => {
    const words = name.split(/\s+/);
    let score = 0;
    // Multi-word is more specific
    if (words.length >= 2) score += 30;
    if (words.length >= 3) score += 20;
    if (words.length >= 4) score += 10;
    // Contains a known brand
    if (containsKnownBrand(name)) score += 40;
    // Contains a number (model numbers like "Clip 5", "S24", "AirPods Pro 2")
    if (/\d/.test(name)) score += 25;
    // Contains known model patterns (Pro, Max, Plus, Ultra, Mini, Gen, Series)
    if (/\b(pro|max|plus|ultra|mini|gen|series|edition|lite|air)\b/i.test(name)) score += 15;
    // Penalty for very long names (likely full page titles, not product names)
    if (words.length > 8) score -= 20;
    if (words.length > 12) score -= 30;
    return score;
  };

  // --- Build candidate product names, scored ---
  const candidates: { name: string; score: number; source: string }[] = [];

  // 1. Best guess labels — often the most accurate single signal
  for (const label of bestGuessLabels) {
    if (isGenericTerm(label)) continue;
    candidates.push({ name: label, score: 80 + specificityScore(label), source: 'bestGuess' });
  }

  // 2. Web entities (Google's knowledge graph)
  for (const we of webEntities) {
    if (isGenericTerm(we.desc)) continue;
    candidates.push({ name: we.desc, score: we.score * 80 + specificityScore(we.desc), source: 'webEntity' });
  }

  // 3. Page titles — use consensus: find the most common product name across retailer pages
  const cleanedTitles: string[] = [];
  for (const title of pagesWithMatchingImages) {
    const cleaned = cleanPageTitle(title);
    if (cleaned.length >= 3 && cleaned.length <= 80 && !isGenericTerm(cleaned)) {
      cleanedTitles.push(cleaned);
    }
  }

  // Find common substrings across page titles (consensus = exact model name)
  if (cleanedTitles.length >= 2) {
    const wordFreq = new Map<string, number>();
    for (const title of cleanedTitles) {
      const words = title.split(/\s+/);
      // Generate all 2-5 word phrases
      for (let len = 2; len <= Math.min(5, words.length); len++) {
        for (let start = 0; start <= words.length - len; start++) {
          const phrase = words.slice(start, start + len).join(' ');
          if (!isGenericTerm(phrase)) {
            wordFreq.set(phrase, (wordFreq.get(phrase) || 0) + 1);
          }
        }
      }
    }
    // Phrases appearing in multiple titles are likely the actual product name
    const sortedPhrases = [...wordFreq.entries()]
      .filter(([, count]) => count >= 2)
      .sort((a, b) => {
        // Sort by: count * specificity
        const scoreA = a[1] * 10 + specificityScore(a[0]);
        const scoreB = b[1] * 10 + specificityScore(b[0]);
        return scoreB - scoreA;
      });

    for (const [phrase, count] of sortedPhrases.slice(0, 5)) {
      const consensusBoost = count * 15;
      candidates.push({ name: phrase, score: 90 + consensusBoost + specificityScore(phrase), source: `consensus(${count})` });
    }
  }

  // Also add individual cleaned page titles
  for (const cleaned of cleanedTitles) {
    candidates.push({ name: cleaned, score: 50 + specificityScore(cleaned), source: 'pageTitle' });
  }

  // 4. Logo + text/OCR combination
  const topLogo = logoAnnotations[0] ?? '';
  if (topLogo) {
    // Logo alone (brand only, low priority)
    if (!isGenericTerm(topLogo)) {
      candidates.push({ name: topLogo, score: 30 + specificityScore(topLogo), source: 'logo' });
    }

    // Extract ALL text lines for model number detection
    const allTextLines = (first?.fullTextAnnotation?.text ?? '').split(/\r?\n/).map((l: string) => l.trim()).filter(Boolean);
    const modelPattern = /^[A-Za-z0-9][A-Za-z0-9 .\-/]{1,30}$/;
    for (const line of allTextLines) {
      if (line.length < 2 || line.length > 35) continue;
      if (!modelPattern.test(line)) continue;
      if (isGenericTerm(line) && !containsKnownBrand(line)) continue;
      const combined = joinBrandModel(topLogo, line);
      if (combined && combined !== topLogo && combined.split(/\s+/).length >= 2) {
        candidates.push({ name: combined, score: 85 + specificityScore(combined), source: 'logo+ocr' });
      }
    }

    // Combine logo with best guess labels
    for (const label of bestGuessLabels) {
      if (isGenericTerm(label)) continue;
      const combined = joinBrandModel(topLogo, label);
      if (combined && combined !== topLogo && combined !== label) {
        candidates.push({ name: combined, score: 75 + specificityScore(combined), source: 'logo+bestGuess' });
      }
    }
  }

  // 5. Text detection standalone (low priority)
  if (topText && !isGenericTerm(topText)) {
    candidates.push({ name: topText, score: 20 + specificityScore(topText), source: 'text' });
  }

  // 6. Object localization + logo
  const objectNames: string[] = (first?.localizedObjectAnnotations ?? [])
    .map((o: any) => (o?.name ?? '').trim())
    .filter(Boolean);
  for (const objName of objectNames) {
    if (isGenericTerm(objName)) continue;
    if (topLogo && !isGenericTerm(topLogo)) {
      const combined = joinBrandModel(topLogo, objName);
      if (combined && combined !== topLogo && combined !== objName) {
        candidates.push({ name: combined, score: 60 + specificityScore(combined), source: 'logo+object' });
      }
    }
  }

  // 7. Label annotations as last resort
  if (candidates.length === 0) {
    for (const label of labelAnnotations) {
      if (isGenericTerm(label)) continue;
      candidates.push({ name: label, score: 10 + specificityScore(label), source: 'label' });
    }
  }

  // --- Pick the best candidate ---
  candidates.sort((a, b) => b.score - a.score);

  // Log all candidates for debugging
  console.log('[DeaLo] Vision candidates:', candidates.slice(0, 8).map((c) => `${c.name} (${c.score.toFixed(0)}, ${c.source})`));

  const bestCandidate = candidates[0];
  const bestName = bestCandidate?.name || 'Unknown Product';

  // --- Category: use label annotations but skip generic ones ---
  const categoryLabel = labelAnnotations.find((l) => !isGenericTerm(l)) || labelAnnotations[0] || 'General';

  // --- Bounding box from object localization ---
  const obj = first?.localizedObjectAnnotations?.[0];
  const confidence =
    bestCandidate?.score
      ? clamp01(Math.min(1, bestCandidate.score / 100))
      : typeof obj?.score === 'number'
        ? obj.score
        : 0.7;

  const verts: VisionNormalizedVertex[] = obj?.boundingPoly?.normalizedVertices ?? [];
  const xs = verts.map((v: VisionVertex) => (typeof v.x === 'number' ? v.x : 0));
  const ys = verts.map((v: VisionVertex) => (typeof v.y === 'number' ? v.y : 0));
  const minX = xs.length ? Math.min(...xs) : DEFAULT_BOUNDS.x;
  const minY = ys.length ? Math.min(...ys) : DEFAULT_BOUNDS.y;
  const maxX = xs.length ? Math.max(...xs) : DEFAULT_BOUNDS.x + DEFAULT_BOUNDS.width;
  const maxY = ys.length ? Math.max(...ys) : DEFAULT_BOUNDS.y + DEFAULT_BOUNDS.height;

  // Extract web pages with matching images — these are often retailer pages with prices
  const webPages: { url: string; title: string }[] = (first?.webDetection?.pagesWithMatchingImages ?? [])
    .filter((p: any) => p?.url && p?.pageTitle)
    .map((p: any) => ({ url: p.url as string, title: (p.pageTitle as string).trim() }))
    .slice(0, 20);

  console.log('[DeaLo] Vision API: detected =>', bestName, '| confidence:', confidence.toFixed(2), '| logo:', topLogo, '| source:', bestCandidate?.source, '| webPages:', webPages.length);
  return {
    name: bestName,
    category: categoryLabel || 'Unknown',
    confidence: clamp01(confidence),
    bounds: normalizeBox({ x: minX, y: minY, width: maxX - minX, height: maxY - minY }),
    description: '',
    features: [],
    priceRange: '',
    alternatives: [],
    webPages,
  };
};

const detectObject = async (photo: { uri: string; base64: string }): Promise<DetectedObject> => {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_VISION_API_KEY;
  if (!apiKey) {
    console.warn('[DeaLo] No EXPO_PUBLIC_GOOGLE_VISION_API_KEY set');
    return { name: 'Unknown Product', category: 'Unknown', confidence: 0.5, bounds: normalizeBox(DEFAULT_BOUNDS), description: '', features: [], priceRange: '', alternatives: [], webPages: [] };
  }

  // Try up to 2 attempts
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      console.log(`[DeaLo] Vision API: attempt ${attempt}, base64 length = ${photo.base64?.length ?? 0}`);
      const json = await callVisionAPI(photo.base64, apiKey);
      return parseVisionResponse(json);
    } catch (e: any) {
      console.warn(`[DeaLo] Vision API attempt ${attempt} failed:`, e?.message || e);
      if (attempt < 2) {
        await new Promise((r) => setTimeout(r, 1000)); // wait 1s before retry
      }
    }
  }

  // All attempts failed — return fallback with default bounds so scanner still animates
  console.warn('[DeaLo] Vision API: all attempts failed, using fallback');
  return { name: 'Unknown Product', category: 'Unknown', confidence: 0.3, bounds: normalizeBox(DEFAULT_BOUNDS), description: '', features: [], priceRange: '', alternatives: [], webPages: [] };
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
  const [detectionFailed, setDetectionFailed] = useState(false);
  const isTakingPicture = useRef(false);
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
    setDetectionFailed(false);
    isTakingPicture.current = false;
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
                quality: 0.95,
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
                quality: 0.95,
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
      quality: 0.95,
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

      // Use AI detection — always returns a result (never null)
      const detected = await detectObject({ uri: capturedUri, base64: capturedBase64 });
      if (!alive) return;

      setDetectedObject(detected);

      // Check if detection actually found a product
      const isUnknown = detected.name === 'Unknown Product' || detected.confidence < 0.15;

      if (isUnknown) {
        // Detection failed — show "not found" overlay instead of navigating
        console.warn('[DeaLo] Detection failed, showing not-found overlay');
        setDetectionFailed(true);
        return;
      }

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
        router.push({
          pathname: '/camera/results',
          params: {
            objectName: detected.name,
            category: detected.category,
            confidence: detected.confidence.toString(),
            description: detected.description,
            features: JSON.stringify(detected.features),
            priceRange: detected.priceRange,
            alternatives: JSON.stringify(detected.alternatives),
            imageUri: capturedUri,
            webPages: JSON.stringify(detected.webPages),
          }
        });
      }, 1600);
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
    if (!cameraRef.current || isTakingPicture.current) return;
    isTakingPicture.current = true;

    try {
      const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.85, exif: false });
      if (!photo?.uri) {
        isTakingPicture.current = false;
        return;
      }
      setCapturedUri(photo.uri);
      setCapturedBase64(photo.base64 ?? null);
      setDetectionFailed(false);
      setIsScanning(true);
    } catch (err) {
      console.warn('Failed to take picture', err);
      isTakingPicture.current = false;
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

          {!detectionFailed && (
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
          )}

          {detectionFailed && (
            <View style={styles.notFoundOverlay}>
              <View style={styles.notFoundCard}>
                <Ionicons name="search-outline" size={48} color="#9CA3AF" />
                <Text style={styles.notFoundTitle}>Product Not Recognized</Text>
                <Text style={styles.notFoundSubtitle}>
                  We couldn't identify this product. Try the following:
                </Text>
                <View style={styles.notFoundTips}>
                  <Text style={styles.notFoundTip}>- Make sure the product label or logo is visible</Text>
                  <Text style={styles.notFoundTip}>- Get closer to the product</Text>
                  <Text style={styles.notFoundTip}>- Ensure good lighting</Text>
                  <Text style={styles.notFoundTip}>- Try a different angle</Text>
                </View>
                <TouchableOpacity style={styles.notFoundRetryBtn} onPress={resetToCamera} activeOpacity={0.9}>
                  <Ionicons name="camera-outline" size={20} color="#FFFFFF" />
                  <Text style={styles.notFoundRetryText}>Try Again</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
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
  notFoundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  notFoundCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    maxWidth: 360,
  },
  notFoundTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  notFoundSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  notFoundTips: {
    alignSelf: 'stretch',
    marginBottom: 24,
  },
  notFoundTip: {
    fontSize: 13,
    color: '#D1D5DB',
    lineHeight: 22,
    paddingLeft: 4,
  },
  notFoundRetryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BRAND_GREEN,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 28,
    gap: 8,
  },
  notFoundRetryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
