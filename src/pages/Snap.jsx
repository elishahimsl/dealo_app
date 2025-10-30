import React, { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Settings, Loader2, Sparkles, ExternalLink, Bookmark, Share2, Scale } from "lucide-react";

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
          prompt: `Analyze this image and identify the item. Provide:
          1. Item name/title (be specific with brand and model if visible)
          2. Content type (product, homework, notes, diagram, idea, reminder, project, or other)
          3. Detailed description and key features (3-4 sentences)
          4. AI insights or smart tips about this item
          5. 3-5 relevant keywords
          6. If it's a product: brand, model, estimated price range, material, use case
          7. Similar items or alternatives (list 3)
          8. Any text visible in the image`,
          file_urls: file_url,
          response_json_schema: {
            type: "object",
            properties: {
              title: { type: "string" },
              content_type: { 
                type: "string",
                enum: ["product", "homework", "notes", "diagram", "idea", "reminder", "project", "other"]
              },
              description: { type: "string" },
              ai_insights: { type: "string" },
              keywords: { type: "array", items: { type: "string" } },
              brand: { type: "string" },
              model: { type: "string" },
              price_range: { type: "string" },
              material: { type: "string" },
              similar_items: { type: "array", items: { type: "string" } },
              extracted_text: { type: "string" }
            }
          }
        });

        setResult({
          file_url,
          ...aiResult
        });
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
        prompt: `Analyze this image and identify the item. Provide detailed information including name, description, AI insights, keywords, and similar items.`,
        file_urls: file_url,
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            content_type: { type: "string", enum: ["product", "homework", "notes", "diagram", "idea", "reminder", "project", "other"] },
            description: { type: "string" },
            ai_insights: { type: "string" },
            keywords: { type: "array", items: { type: "string" } },
            similar_items: { type: "array", items: { type: "string" } },
            extracted_text: { type: "string" }
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
      const capture = await base44.entities.Capture.create({
        title: result.title || "Untitled Scan",
        content_type: result.content_type || "other",
        file_url: result.file_url,
        file_type: 'image',
        ai_summary: result.description || result.ai_insights || "",
        extracted_text: result.extracted_text || "",
        keywords: result.keywords || [],
        has_due_date: false,
        is_favorite: false
      });

      navigate(createPageUrl("Library"));
    } catch (error) {
      console.error("Error saving:", error);
      alert("Failed to save. Please try again.");
    }
  };

  // Result View
  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-24">
        {/* Preview Image */}
        <div className="relative">
          <img 
            src={result.file_url} 
            alt="Scanned item"
            className="w-full h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white" />
        </div>

        <div className="px-6 -mt-12 relative z-10 space-y-6">
          {/* AI Label */}
          <div className="bg-white rounded-3xl p-6 card-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-[var(--smart-gray)] mb-2">
                  {result.title}
                </h1>
                {result.brand && (
                  <p className="text-[var(--secondary-gray)] text-sm mb-2">
                    Brand: <span className="font-semibold">{result.brand}</span>
                    {result.model && ` • ${result.model}`}
                  </p>
                )}
                {result.price_range && (
                  <p className="text-[var(--electric-blue)] font-bold text-lg">
                    {result.price_range}
                  </p>
                )}
              </div>
              <Sparkles className="w-6 h-6 text-[var(--teal-accent)] flex-shrink-0" />
            </div>
            <div className="flex flex-wrap gap-2">
              {result.keywords?.slice(0, 4).map((keyword, idx) => (
                <span 
                  key={idx}
                  className="bg-blue-50 text-[var(--electric-blue)] px-3 py-1 rounded-full text-xs font-semibold"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* 💡 AI Insights */}
          {result.ai_insights && (
            <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-3xl p-6 border border-blue-200 soft-shadow">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[var(--electric-blue)]" />
                </div>
                <h3 className="font-bold text-[var(--smart-gray)]">💡 AI Insights</h3>
              </div>
              <p className="text-[var(--secondary-gray)] text-sm leading-relaxed">
                {result.ai_insights || result.description}
              </p>
            </div>
          )}

          {/* 🌐 Product Links */}
          <div className="bg-white rounded-3xl p-6 border border-[var(--border-gray)] soft-shadow">
            <h3 className="font-bold text-[var(--smart-gray)] mb-4 flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-[var(--electric-blue)]" />
              🌐 Product Links
            </h3>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start rounded-xl"
                onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(result.title)}`, '_blank')}
              >
                <img src="https://www.google.com/favicon.ico" className="w-4 h-4 mr-2" />
                Search on Google
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start rounded-xl"
                onClick={() => window.open(`https://www.amazon.com/s?k=${encodeURIComponent(result.title)}`, '_blank')}
              >
                <img src="https://www.amazon.com/favicon.ico" className="w-4 h-4 mr-2" />
                Find on Amazon
              </Button>
            </div>
          </div>

          {/* 🧠 Similar Items */}
          {result.similar_items && result.similar_items.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border border-[var(--border-gray)] soft-shadow">
              <h3 className="font-bold text-[var(--smart-gray)] mb-4">🧠 Similar Items</h3>
              <ul className="space-y-2">
                {result.similar_items.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-[var(--secondary-gray)]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--electric-blue)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="fixed bottom-20 left-0 right-0 px-6 z-20">
          <div className="bg-white rounded-3xl p-4 border border-[var(--border-gray)] card-shadow">
            <div className="grid grid-cols-3 gap-3">
              <Button
                onClick={() => navigate(createPageUrl("Compare"))}
                variant="outline"
                className="rounded-2xl flex flex-col items-center gap-1 h-auto py-3"
              >
                <Scale className="w-5 h-5" />
                <span className="text-xs font-semibold">Compare</span>
              </Button>
              <Button
                onClick={handleSave}
                className="rounded-2xl flex flex-col items-center gap-1 h-auto py-3 bg-gradient-to-r from-[var(--electric-blue)] to-[var(--teal-accent)]"
              >
                <Bookmark className="w-5 h-5" />
                <span className="text-xs font-semibold">Save</span>
              </Button>
              <Button
                variant="outline"
                className="rounded-2xl flex flex-col items-center gap-1 h-auto py-3"
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

      {/* AI Overlay Text */}
      {!scanning && (
        <div className="absolute top-24 left-0 right-0 text-center z-10 px-6">
          <p className="text-white text-sm font-medium drop-shadow-lg">
            Point at an item to identify it
          </p>
        </div>
      )}

      {/* Top Icons */}
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
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(createPageUrl("Profile"))}
          className="rounded-full bg-black/30 backdrop-blur-md hover:bg-black/50 border border-white/20"
        >
          <Settings className="w-5 h-5 text-white" />
        </Button>
      </div>

      {/* Scanning Overlay */}
      {scanning && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-30 flex flex-col items-center justify-center">
          <Loader2 className="w-16 h-16 text-[var(--electric-blue)] animate-spin mb-4" />
          <p className="text-white text-lg font-semibold">Analyzing...</p>
          <p className="text-white/70 text-sm mt-2">AI is identifying your item</p>
        </div>
      )}

      {/* Main Capture Button */}
      {!scanning && (
        <div className="absolute bottom-12 left-0 right-0 px-6 z-20 flex justify-center">
          <button
            onClick={capturePhoto}
            disabled={!cameraReady}
            className="w-20 h-20 rounded-full bg-gradient-to-r from-[var(--electric-blue)] to-[var(--teal-accent)] shadow-2xl flex items-center justify-center smooth-transition hover:scale-110 active:scale-95 disabled:opacity-50"
          >
            <Camera className="w-10 h-10 text-white" strokeWidth={2.5} />
          </button>
        </div>
      )}
    </div>
  );
}