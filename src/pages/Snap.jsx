import React, { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Camera, X, Loader2, Sparkles, ExternalLink, Bookmark, Share2, Scale, MessageCircle, Image as ImageIcon, RefreshCw, Zap, Scan, HelpCircle, Heart, ChevronRight, Star, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Snap() {
  const navigate = useNavigate();
  const [cameraReady, setCameraReady] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [mode, setMode] = useState('identify');
  const [scanningPhrase, setScanningPhrase] = useState('Detecting your item...');
  const [activeTab, setActiveTab] = useState('overview');
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
          prompt: `Analyze this product image and provide:
          1. Product name/title
          2. Brand
          3. Price (estimate if not visible)
          4. Star rating (out of 5)
          5. Description
          6. Key features (3-5 bullet points)
          7. Return policy summary
          8. 3 alternative products with names, prices, stores
          9. 3 best deal locations with store names, prices, availability`,
          file_urls: file_url,
          response_json_schema: {
            type: "object",
            properties: {
              title: { type: "string" },
              brand: { type: "string" },
              price: { type: "string" },
              rating: { type: "number" },
              description: { type: "string" },
              features: { type: "array", items: { type: "string" } },
              return_policy: { type: "string" },
              alternatives: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    price: { type: "string" },
                    store: { type: "string" }
                  }
                }
              },
              best_deals: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    store: { type: "string" },
                    price: { type: "string" },
                    availability: { type: "string" }
                  }
                }
              }
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
        prompt: `Analyze this product and provide comprehensive details.`,
        file_urls: file_url,
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            brand: { type: "string" },
            price: { type: "string" },
            rating: { type: "number" },
            description: { type: "string" },
            features: { type: "array", items: { type: "string" } },
            return_policy: { type: "string" },
            alternatives: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  price: { type: "string" },
                  store: { type: "string" }
                }
              }
            },
            best_deals: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  store: { type: "string" },
                  price: { type: "string" },
                  availability: { type: "string" }
                }
              }
            }
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

  // Result View with tabs
  if (result) {
    return (
      <div className="min-h-screen bg-[#F9FAFB]">
        {/* Header with back and bookmark */}
        <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-[#E4E8ED]">
          <button onClick={() => { setResult(null); startCamera(); }}>
            <ChevronRight className="w-6 h-6 text-[#2E2E38] rotate-180" />
          </button>
          <button>
            <Bookmark className="w-6 h-6 text-[#2E2E38]" />
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white px-6 py-3 flex gap-6 border-b border-[#E4E8ED]">
          {['overview', 'alternatives', 'smart insights'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm font-semibold pb-2 transition-colors ${
                activeTab === tab
                  ? 'text-[#2E2E38] border-b-2 border-[#5EE177]'
                  : 'text-[#60656F]'
              }`}
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content based on active tab */}
        <div className="px-6 py-6 pb-32">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="bg-white rounded-3xl p-6 border border-[#E4E8ED] shadow-sm">
                <div className="flex gap-4 mb-4">
                  <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                    <img src={result.file_url} alt={result.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-xl font-bold text-[#2E2E38] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {result.title}
                    </h1>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(result.rating || 0) ? 'text-[#FF8AC6] fill-[#FF8AC6]' : 'text-gray-300'}`}
                        />
                      ))}
                      <span className="text-sm text-[#60656F] ml-1">{result.rating} stars</span>
                    </div>
                    <p className="text-2xl font-bold text-[#5EE177] mb-3">{result.price}</p>
                  </div>
                </div>
                <Button className="w-full bg-white border-2 border-[#5EE177] text-[#5EE177] hover:bg-[#5EE177] hover:text-white font-bold rounded-2xl h-12">
                  <Plus className="w-5 h-5 mr-2" />
                  Add to Favorites
                </Button>
              </div>

              {/* Description */}
              <div className="bg-white rounded-3xl p-6 border border-[#E4E8ED] shadow-sm">
                <h3 className="font-bold text-[#2E2E38] mb-3 text-lg">Description</h3>
                <p className="text-[#60656F] text-sm leading-relaxed mb-4">{result.description}</p>
                <p className="text-xs text-[#60656F] mb-2">
                  <span className="font-semibold">Return Policy:</span> {result.return_policy || '30 days'}
                </p>
                <button className="text-[#5EE177] text-sm font-semibold">Ask AI</button>
              </div>

              {/* Key Features */}
              <div className="bg-white rounded-3xl p-6 border border-[#E4E8ED] shadow-sm">
                <h3 className="font-bold text-[#2E2E38] mb-3 text-lg">Key Features</h3>
                <ul className="space-y-2">
                  {result.features?.map((feature, idx) => (
                    <li key={idx} className="text-sm text-[#60656F] flex items-start gap-2">
                      <span className="text-[#5EE177] mt-1">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Comparison */}
              <div className="bg-white rounded-3xl p-6 border border-[#E4E8ED] shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-[#2E2E38] text-lg">Price Comparison</h3>
                  <button className="text-[#5EE177] text-sm font-semibold flex items-center gap-1">
                    View <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {result.best_deals?.slice(0, 3).map((deal, idx) => (
                    <div key={idx} className="border-2 border-[#E4E8ED] rounded-2xl p-3 text-center">
                      <p className="text-xs font-semibold text-[#2E2E38] mb-1">{deal.store}</p>
                      <p className="text-lg font-bold text-[#5EE177] mb-1">{deal.price}</p>
                      <p className="text-xs text-[#60656F]">{deal.availability}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'alternatives' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#2E2E38] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Alternatives for {result.brand}
              </h2>
              {result.alternatives?.map((alt, idx) => (
                <div key={idx} className="bg-white rounded-3xl p-4 border border-[#E4E8ED] shadow-sm flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl bg-gray-100" />
                  <div className="flex-1">
                    <h3 className="font-bold text-[#2E2E38] mb-1">{alt.name}</h3>
                    <p className="text-sm text-[#60656F] mb-2">{alt.store}</p>
                    <p className="text-lg font-bold text-[#5EE177]">{alt.price}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#60656F]" />
                </div>
              ))}

              {/* Best Deals and Best Matches sections */}
              <div className="mt-6">
                <h3 className="text-lg font-bold text-[#2E2E38] mb-3">Best Deals</h3>
                <div className="grid grid-cols-2 gap-3">
                  {result.best_deals?.slice(0, 2).map((deal, idx) => (
                    <div key={idx} className="bg-white border border-[#E4E8ED] rounded-2xl p-3">
                      <div className="w-full aspect-square bg-gray-100 rounded-xl mb-2" />
                      <p className="text-xs font-semibold text-[#2E2E38] mb-1">{deal.store}</p>
                      <p className="text-lg font-bold text-[#5EE177]">{deal.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'smart insights' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-[#E4E8ED] shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#5EE177] to-[#FF8AC6] flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-[#2E2E38]">AI Insights</h3>
                </div>
                <p className="text-[#60656F] text-sm leading-relaxed">
                  Based on your shopping history and preferences, this product offers excellent value. 
                  We recommend checking {result.best_deals?.[0]?.store} for the best price at {result.best_deals?.[0]?.price}.
                </p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-[#E4E8ED] shadow-sm">
                <h3 className="font-bold text-[#2E2E38] mb-3">Similar Items You Viewed</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="aspect-square rounded-xl bg-gray-100" />
                  ))}
                </div>
              </div>
            </div>
          )}
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

      {mode === 'identify' && !scanning && (
        <div className="absolute top-0 left-0 right-0 bottom-32 flex items-center justify-center z-10 pointer-events-none">
          <Scan className="w-56 h-56 text-white opacity-40" strokeWidth={0.8} />
        </div>
      )}

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

      {scanning && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center">
          <div className="relative mb-6">
            <div className="w-40 h-40 rounded-lg border-2 border-[#5EE177] relative overflow-hidden">
              <div 
                className="absolute left-0 right-0 h-1 bg-[#5EE177] shadow-lg shadow-[#5EE177]"
                style={{ animation: 'scan 2s ease-in-out infinite' }}
              />
              <Scan className="w-full h-full text-[#5EE177] opacity-50 p-8" strokeWidth={1} />
            </div>
          </div>
          <p className="text-white text-xl font-semibold mb-2">Analyzing...</p>
          <p className="text-[#5EE177] text-sm font-medium">{scanningPhrase}</p>
        </div>
      )}

      {!scanning && (
        <div className="absolute bottom-0 left-0 right-0 z-20">
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

          <div className="bg-gray-800/80 backdrop-blur-md py-6">
            <div className="flex items-center justify-center max-w-lg mx-auto px-8">
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