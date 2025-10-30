import React, { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Camera, Upload, X, Loader2, Sparkles, ExternalLink, Bookmark, Share2, Scale, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Snap() {
  const navigate = useNavigate();
  const [cameraReady, setCameraReady] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isMobile] = useState(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));

  useEffect(() => {
    if (!result) {
      startCamera();
    }
    return () => stopCamera();
  }, [result]);

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

  const handleFileUpload = () => {
    fileInputRef.current?.click();
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
        content_type: "product",
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
      <div className="min-h-screen bg-[#1F2421] pb-32">
        {/* Image Preview */}
        <div className="relative h-80">
          <img 
            src={result.file_url} 
            alt="Scanned item"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1F2421]" />
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

        <div className="px-6 -mt-8 relative z-10 space-y-6 slide-in">
          {/* AI Conversational Card */}
          <div className="glass-dark rounded-3xl p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--primary)] flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-[var(--light)] italic text-sm mb-2">
                  "{result.conversational_intro || "Here's what I found..."}"
                </p>
                <h1 className="text-2xl font-bold text-[var(--light)] mb-2">
                  {result.title}
                </h1>
                {result.brand && (
                  <p className="text-[var(--secondary)] text-sm mb-2">
                    <span className="font-semibold">{result.brand}</span>
                    {result.model && ` • ${result.model}`}
                  </p>
                )}
                {result.price_range && (
                  <p className="text-[var(--accent)] font-bold text-lg mb-3">
                    {result.price_range}
                  </p>
                )}
              </div>
            </div>
            
            <p className="text-[var(--secondary)] text-sm leading-relaxed mb-4">
              {result.description}
            </p>

            {result.keywords && result.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {result.keywords.map((keyword, idx) => (
                  <Badge 
                    key={idx}
                    className="bg-[var(--accent)]/20 text-[var(--accent)] border-[var(--accent)]/30"
                  >
                    {keyword}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Helpful Suggestion */}
          {result.helpful_suggestion && (
            <div className="glass-dark rounded-3xl p-5 border-l-4 border-[var(--accent)]">
              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-[var(--accent)] flex-shrink-0 mt-0.5" />
                <p className="text-[var(--light)] text-sm italic">
                  {result.helpful_suggestion}
                </p>
              </div>
            </div>
          )}

          {/* Similar Items */}
          {result.similar_items && result.similar_items.length > 0 && (
            <div className="glass-dark rounded-3xl p-6">
              <h3 className="font-bold text-[var(--light)] mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[var(--accent)]" />
                Similar Items
              </h3>
              <ul className="space-y-2">
                {result.similar_items.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-[var(--secondary)]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Product Links */}
          <div className="glass-dark rounded-3xl p-6">
            <h3 className="font-bold text-[var(--light)] mb-4 flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-[var(--accent)]" />
              Find Online
            </h3>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start rounded-2xl border-[var(--secondary)]/30 text-[var(--light)] hover:bg-[var(--accent)]/10"
                onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(result.title)}`, '_blank')}
              >
                <img src="https://www.google.com/favicon.ico" className="w-4 h-4 mr-2" />
                Search on Google
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start rounded-2xl border-[var(--secondary)]/30 text-[var(--light)] hover:bg-[var(--accent)]/10"
                onClick={() => window.open(`https://www.amazon.com/s?k=${encodeURIComponent(result.title)}`, '_blank')}
              >
                <img src="https://www.amazon.com/favicon.ico" className="w-4 h-4 mr-2" />
                Find on Amazon
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="fixed bottom-24 left-0 right-0 px-6 z-20">
          <div className="glass-dark rounded-3xl p-4 shadow-2xl">
            <div className="grid grid-cols-3 gap-3">
              <Button
                onClick={() => navigate(createPageUrl("Compare"))}
                variant="outline"
                className="rounded-2xl flex flex-col items-center gap-1 h-auto py-3 border-[var(--secondary)]/30 text-[var(--light)] hover:bg-[var(--accent)]/10"
              >
                <Scale className="w-5 h-5" />
                <span className="text-xs font-semibold">Compare</span>
              </Button>
              <Button
                onClick={handleSave}
                className="rounded-2xl flex flex-col items-center gap-1 h-auto py-3 bg-gradient-to-br from-[var(--accent)] to-[var(--primary)]"
              >
                <Bookmark className="w-5 h-5" />
                <span className="text-xs font-semibold">Save</span>
              </Button>
              <Button
                variant="outline"
                className="rounded-2xl flex flex-col items-center gap-1 h-auto py-3 border-[var(--secondary)]/30 text-[var(--light)] hover:bg-[var(--accent)]/10"
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

      {/* Overlay Instruction */}
      {!scanning && (
        <div className="absolute top-24 left-0 right-0 text-center z-10 px-6">
          <p className="text-white text-sm font-medium drop-shadow-2xl">
            Align your item within the frame
          </p>
        </div>
      )}

      {/* Top Actions */}
      <div className="absolute top-0 left-0 right-0 z-20 pt-12 px-6 flex items-center justify-between">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          ref={fileInputRef}
          className="hidden"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={handleFileUpload}
          className="rounded-full bg-black/30 backdrop-blur-md hover:bg-black/50 border border-white/20"
        >
          <Upload className="w-5 h-5 text-white" />
        </Button>
      </div>

      {/* Scanning Overlay */}
      {scanning && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center">
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-full border-4 border-[var(--accent)] animate-ping absolute" />
            <Loader2 className="w-24 h-24 text-[var(--accent)] animate-spin" />
          </div>
          <p className="text-white text-xl font-semibold mb-2">Analyzing... 🔍</p>
          <p className="text-white/70 text-sm">Got it — analyzing now...</p>
        </div>
      )}

      {/* Main Capture Button */}
      {!scanning && (
        <div className="absolute bottom-12 left-0 right-0 px-6 z-20 flex justify-center">
          <button
            onClick={capturePhoto}
            disabled={!cameraReady}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--primary)] shadow-2xl glow-pulse flex items-center justify-center smooth-transition hover:scale-110 active:scale-95 disabled:opacity-50"
          >
            <Camera className="w-10 h-10 text-white" strokeWidth={2.5} />
          </button>
        </div>
      )}
    </div>
  );
}