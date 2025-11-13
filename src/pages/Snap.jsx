import React, { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Camera, X, Loader2, Sparkles, ExternalLink, Bookmark, Share2, Scale, MessageCircle, Image as ImageIcon, RefreshCw, Zap, Scan, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Snap() {
  const navigate = useNavigate();
  const [cameraReady, setCameraReady] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [mode, setMode] = useState('identify');
  const [scanningPhrase, setScanningPhrase] = useState('Detecting your item...');
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isMobile] = useState(/iPhone|iPad|Pod|Android/i.test(navigator.userAgent));

  useEffect(() => {
    if (!result) {
      startCamera();
    }
    return () => stopCamera();
  }, [result]);

  // Scanning phrases animation
  useEffect(() => {
    if (scanning) {
      const phrases = [
        'Detecting your item...',
        'Finding prices...',
        'Comparing deals...',
        'Analyzing product...'
      ];
      let index = 0;
      const interval = setInterval(() => {
        index = (index + 1) % phrases.length;
        setScanningPhrase(phrases[index]);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [scanning]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: isMobile ? 'environment' : 'user', width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraReady(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraReady(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !cameraReady) return;

    setScanning(true);

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);

    canvas.toBlob(async (blob) => {
      const capturedFile = new File([blob], `snap-${Date.now()}.jpg`, { type: 'image/jpeg' });

      try {
        const { file_url } = await base44.integrations.Core.UploadFile({ file: capturedFile });

        const aiResult = await base44.integrations.Core.InvokeLLM({
          prompt: `Analyze this image and identify the item in a friendly, conversational way. Provide:
          1. Item name/title (be specific with brand and model if visible)
          2. A conversational greeting like "Here's what I found — this seems to be..."
          3. Detailed description (3-4 sentences, friendly tone)
          4. 3-5 relevant keywords
          5. If it's a product: brand, model, price range, similar items
          6. A helpful suggestion like "Want to see similar ones?" or "Interested in learning more?"`,
          file_urls: file_url,
          response_json_schema: {
            type: "object",
            properties: {
              title: { type: "string" },
              conversational_intro: { type: "string" },
              description: { type: "string" },
              keywords: { type: "array", items: { type: "string" } },
              brand: { type: "string" },
              model: { type: "string" },
              price_range: { type: "string" },
              similar_items: { type: "array", items: { type: "string" } },
              helpful_suggestion: { type: "string" }
            }
          }
        });

        setResult({ file_url, ...aiResult });
      } catch (error) {
        console.error("Error processing scan:", error);
        alert("Failed to process image. Please try again.");
      }

      setScanning(false);
    }, 'image/jpeg', 0.9);
  };

  const handleFileSelect = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setScanning(true);
    stopCamera();

    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file: selectedFile });

      const aiResult = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this image conversationally. Be friendly and helpful.`,
        file_urls: file_url,
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            conversational_intro: { type: "string" },
            description: { type: "string" },
            keywords: { type: "array", items: { type: "string" } },
            similar_items: { type: "array", items: { type: "string" } },
            helpful_suggestion: { type: "string" }
          }
        }
      });

      setResult({ file_url, ...aiResult });
    } catch (error) {
      console.error("Error processing file:", error);
      alert("Failed to process file. Please try again.");
    }

    setScanning(false);
  };

  const handleSave = async () => {
    try {
      await base44.entities.Capture.create({
        title: result.title || "Untitled Scan",
        content_type: "other",
        file_url: result.file_url,
        file_type: 'image',
        ai_summary: result.description || "",
        keywords: result.keywords || [],
        is_favorite: false
      });

      navigate(createPageUrl("Library"));
    } catch (error) {
      console.error("Error saving:", error);
    }
  };

  // Result View
  if (result) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] pb-32">
        {/* Image Preview */}
        <div className="relative h-80">
          <img
            src={result.file_url}
            alt="Scanned item"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#F9FAFB]" />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setResult(null);
              startCamera();
            }}
            className="absolute top-6 right-6 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="px-6 -mt-8 relative z-10 space-y-6">
          {/* AI Conversational Card */}
          <div className="bg-white rounded-3xl p-6 border border-[#E4E8ED] shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5EE177] to-[#FF8AC6] flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-[#2E2E38] italic text-sm mb-2">
                  "{result.conversational_intro || "Here's what I found..."}"
                </p>
                <h1 className="text-2xl font-bold text-[#2E2E38] mb-2">
                  {result.title}
                </h1>
                {result.brand && (
                  <p className="text-[#60656F] text-sm mb-2">
                    <span className="font-semibold">{result.brand}</span>
                    {result.model && ` • ${result.model}`}
                  </p>
                )}
                {result.price_range && (
                  <p className="text-[#5EE177] font-bold text-lg mb-3">
                    {result.price_range}
                  </p>
                )}
              </div>
            </div>

            <p className="text-[#60656F] text-sm leading-relaxed mb-4">
              {result.description}
            </p>

            {result.keywords && result.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {result.keywords.map((keyword, idx) => (
                  <Badge
                    key={idx}
                    className="bg-[#A8F3C1] text-[#2E2E38] border-0"
                  >
                    {keyword}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Helpful Suggestion */}
          {result.helpful_suggestion && (
            <div className="bg-white rounded-3xl p-5 border-l-4 border-[#5EE177]">
              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-[#5EE177] flex-shrink-0 mt-0.5" />
                <p className="text-[#2E2E38] text-sm italic">
                  {result.helpful_suggestion}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="fixed bottom-24 left-0 right-0 px-6 z-20">
          <div className="bg-white rounded-3xl p-4 shadow-2xl border border-[#E4E8ED]">
            <div className="grid grid-cols-3 gap-3">
              <Button
                onClick={() => navigate(createPageUrl("Compare"))}
                variant="outline"
                className="rounded-2xl flex flex-col items-center gap-1 h-auto py-3 border-2 text-[#2E2E38] hover:bg-[#F9FAFB]"
              >
                <Scale className="w-5 h-5" />
                <span className="text-xs font-semibold">Compare</span>
              </Button>
              <Button
                onClick={handleSave}
                className="rounded-2xl flex flex-col items-center gap-1 h-auto py-3 bg-gradient-to-br from-[#5EE177] to-[#FF8AC6] text-white"
              >
                <Bookmark className="w-5 h-5" />
                <span className="text-xs font-semibold">Save</span>
              </Button>
              <Button
                variant="outline"
                className="rounded-2xl flex flex-col items-center gap-1 h-auto py-3 border-2 text-[#2E2E38] hover:bg-[#F9FAFB]"
              >
                <Share2 className="w-5 h-5" />
                <span className="text-xs font-semibold">Share</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Camera View
  return (
    <div className="relative h-screen w-screen bg-black overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Identify Mode - Big Scan Icon in Center of black portion */}
      {mode === 'identify' && !scanning && (
        <div className="absolute top-0 left-0 right-0 bottom-32 flex items-center justify-center z-10 pointer-events-none">
          <Scan className="w-56 h-56 text-white opacity-40" strokeWidth={0.8} />
        </div>
      )}

      {/* Scan Mode - Barcode rectangular icon - bigger lengthwise, white color */}
      {mode === 'scan' && !scanning && (
        <div className="absolute top-0 left-0 right-0 bottom-32 flex items-center justify-center z-10">
          <div className="relative flex flex-col items-center">
            <p className="text-white text-sm font-medium mb-6">
              Align Barcode within Frame
            </p>
            <div className="relative" style={{ width: '280px', height: '140px' }}>
              <Scan className="w-full h-full text-white opacity-80" strokeWidth={0.5} style={{ transform: 'scaleX(1.4)' }} />
            </div>
          </div>
        </div>
      )}

      {/* Top Controls - Only Flash and Help */}
      <div className="absolute top-0 left-0 right-0 z-20 pt-12 px-6 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(createPageUrl("Home"))}
          className="rounded-full bg-black/30 backdrop-blur-md hover:bg-black/50 border border-white/20"
        >
          <X className="w-5 h-5 text-white" />
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-black/30 backdrop-blur-md hover:bg-black/50 border border-white/20"
          >
            <Zap className="w-5 h-5 text-white" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-black/30 backdrop-blur-md hover:bg-black/50 border border-white/20"
          >
            <HelpCircle className="w-5 h-5 text-white" />
          </Button>
        </div>
      </div>

      {/* Scanning Overlay with Animation */}
      {scanning && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center">
          <div className="relative mb-6">
            {/* Pulsing green circles */}
            <div className="w-40 h-40 rounded-lg border-2 border-[#5EE177] relative overflow-hidden">
              {/* Scanning line animation */}
              <div 
                className="absolute left-0 right-0 h-1 bg-[#5EE177] shadow-lg shadow-[#5EE177]"
                style={{
                  animation: 'scan 2s ease-in-out infinite',
                }}
              />
              <Scan className="w-full h-full text-[#5EE177] opacity-50 p-8" strokeWidth={1} />
            </div>
          </div>
          <p className="text-white text-xl font-semibold mb-2">Analyzing...</p>
          <p className="text-[#5EE177] text-sm font-medium">{scanningPhrase}</p>
        </div>
      )}

      {/* Bottom Controls */}
      {!scanning && (
        <div className="absolute bottom-0 left-0 right-0 z-20">
          {/* Mode Selection */}
          <div className="flex justify-center gap-6 mb-6">
            <button
              onClick={() => setMode('identify')}
              className={`text-sm font-semibold transition-colors ${
                mode === 'identify' ? 'text-[#5EE177]' : 'text-white/70'
              }`}
            >
              Identify
            </button>
            <button
              onClick={() => setMode('scan')}
              className={`text-sm font-semibold transition-colors ${
                mode === 'scan' ? 'text-[#5EE177]' : 'text-white/70'
              }`}
            >
              Scan
            </button>
            <button
              onClick={() => setMode('ar')}
              className={`text-sm font-semibold transition-colors ${
                mode === 'ar' ? 'text-[#5EE177]' : 'text-white/70'
              }`}
            >
              AR Mode
            </button>
          </div>

          {/* Grey Bar with Controls - Green button centered */}
          <div className="bg-gray-800/80 backdrop-blur-md py-6">
            <div className="flex items-center justify-center max-w-lg mx-auto px-8">
              {/* Gallery button - left */}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                ref={fileInputRef}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute left-8 transition-all hover:opacity-70 active:scale-90"
              >
                <ImageIcon className="w-6 h-6 text-white" />
              </button>

              {/* Green Circle Button - perfectly centered */}
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#5EE177] to-[#3ecf5e] blur-xl opacity-50" />
                <button
                  onClick={capturePhoto}
                  disabled={!cameraReady}
                  className="relative w-16 h-16 rounded-full bg-[#5EE177] border-4 border-white shadow-2xl transition-transform hover:scale-110 active:scale-95 disabled:opacity-50"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scan {
          0% { top: 0; }
          50% { top: calc(100% - 4px); }
          100% { top: 0; }
        }
      `}</style>
    </div>
  );
}