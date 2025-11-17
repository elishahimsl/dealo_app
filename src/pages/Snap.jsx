import React, { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Camera, X, Loader2, Sparkles, Bookmark, Send, Image as ImageIcon, Zap, Scan, HelpCircle, Star, Check, XIcon, ChevronLeft, Lock } from "lucide-react";

export default function Snap() {
  const navigate = useNavigate();
  const [cameraReady, setCameraReady] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [mode, setMode] = useState('identify');
  const [scanningPhrase, setScanningPhrase] = useState('Detecting your item...');
  const [activeSection, setActiveSection] = useState('overview');
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
          prompt: `Analyze this product image comprehensively and provide:
          1. Product name/title
          2. Brand
          3. Price (estimate)
          4. Star rating (out of 5, decimal like 4.6)
          5. In stock status (true/false)
          6. Smart summary (2-3 detailed sentences about the product)
          7. Overall score out of 100
          8. Subscores: Quality, Value, Features, Design, Durability (each out of 100)
          9. 4-5 specific pros (positive aspects)
          10. 4-5 specific cons (negative aspects)
          11. 4-5 online deals with store name, price, and if it's the smart buy
          12. Product description (3-4 sentences)
          13. Key features (5-6 bullet points)
          14. Return policy summary
          15. 3-4 alternative products with name, price, store, image URL (use Unsplash)
          16. URL to a high-quality product showcase image (use Unsplash or similar)
          
          Be specific and detailed. Generate realistic data.`,
          file_urls: file_url,
          response_json_schema: {
            type: "object",
            properties: {
              title: { type: "string" },
              brand: { type: "string" },
              price: { type: "string" },
              rating: { type: "number" },
              in_stock: { type: "boolean" },
              smart_summary: { type: "string" },
              overall_score: { type: "number" },
              subscores: {
                type: "object",
                properties: {
                  quality: { type: "number" },
                  value: { type: "number" },
                  features: { type: "number" },
                  design: { type: "number" },
                  durability: { type: "number" }
                }
              },
              pros: { type: "array", items: { type: "string" } },
              cons: { type: "array", items: { type: "string" } },
              online_deals: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    store: { type: "string" },
                    price: { type: "string" },
                    is_smart_buy: { type: "boolean" },
                    image_url: { type: "string" }
                  }
                }
              },
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
                    store: { type: "string" },
                    image_url: { type: "string" }
                  }
                }
              },
              product_image_url: { type: "string" }
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
        prompt: `Analyze this product comprehensively with all details. Be specific and generate realistic data.`,
        file_urls: file_url,
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            brand: { type: "string" },
            price: { type: "string" },
            rating: { type: "number" },
            in_stock: { type: "boolean" },
            smart_summary: { type: "string" },
            overall_score: { type: "number" },
            subscores: {
              type: "object",
              properties: {
                quality: { type: "number" },
                value: { type: "number" },
                features: { type: "number" },
                design: { type: "number" },
                durability: { type: "number" }
              }
            },
            pros: { type: "array", items: { type: "string" } },
            cons: { type: "array", items: { type: "string" } },
            online_deals: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  store: { type: "string" },
                  price: { type: "string" },
                  is_smart_buy: { type: "boolean" },
                  image_url: { type: "string" }
                }
              }
            },
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
                  store: { type: "string" },
                  image_url: { type: "string" }
                }
              }
            },
            product_image_url: { type: "string" }
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

  // Result View - completely redesigned
  if (result) {
    return (
      <div className="min-h-screen bg-[#F9FAFB]">
        {/* Product Image at Top with Header */}
        <div className="relative bg-white">
          <div className="h-80 overflow-hidden">
            <img
              src={result.product_image_url || result.file_url}
              alt={result.title}
              className="w-full h-full object-contain"
            />
          </div>
          {/* Header overlaid on image */}
          <div className="absolute top-0 left-0 right-0 px-6 py-4 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent">
            <button onClick={() => { setResult(null); startCamera(); }}>
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button>
              <Send className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <div className="px-6 py-6 space-y-4">
          {/* First Tile - Product Info + Smart Summary + Subscores + Pros/Cons */}
          <div className="bg-white rounded-3xl p-6 border border-[#E4E8ED] shadow-sm relative">
            {/* Save icon top right */}
            <button className="absolute top-4 right-4">
              <Bookmark className="w-6 h-6 text-[#60656F]" />
            </button>

            {/* Product Name - smaller font to fit one line */}
            <h1 className="text-lg font-bold text-[#2E2E38] mb-3 pr-10 line-clamp-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {result.title}
            </h1>

            {/* Star rating, price, in stock - in a row with small icons */}
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-[#F9FAFB] rounded-full px-3 py-1.5 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-[#FF8AC6] fill-[#FF8AC6]" />
                <span className="text-sm font-semibold text-[#2E2E38]">{result.rating}</span>
              </div>
              <div className="bg-[#F9FAFB] rounded-full px-3 py-1.5">
                <span className="text-sm font-bold text-[#5EE177]">{result.price}</span>
              </div>
              <div className={`rounded-full px-3 py-1.5 ${result.in_stock ? 'bg-[#5EE177]/10' : 'bg-red-500/10'}`}>
                <span className={`text-sm font-semibold ${result.in_stock ? 'text-[#5EE177]' : 'text-red-500'}`}>
                  {result.in_stock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Smart Summary with Score */}
            <div className="mb-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="font-bold text-[#2E2E38] text-lg">Smart Summary</h3>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full border-4 border-[#5EE177] flex items-center justify-center">
                    <span className="text-xl font-bold text-[#2E2E38]">{result.overall_score}</span>
                  </div>
                  <span className="text-xs text-[#60656F] mt-1">out of 100</span>
                </div>
              </div>
              <p className="text-[#60656F] text-sm leading-relaxed mb-4">
                {result.smart_summary}
              </p>

              {/* Subscores in a row */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6">
                {result.subscores && Object.entries(result.subscores).map(([key, value]) => (
                  <div key={key} className="flex-shrink-0 bg-[#F9FAFB] rounded-xl px-4 py-2 flex flex-col items-center min-w-[80px]">
                    <span className="text-lg font-bold text-[#5EE177]">{value}</span>
                    <span className="text-xs text-[#60656F] capitalize mt-0.5">{key}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Separator */}
            <div className="border-t border-[#E4E8ED] my-6" />

            {/* Pros and Cons */}
            <div className="grid grid-cols-2 gap-6">
              {/* Pros */}
              <div>
                <h4 className="font-semibold text-[#2E2E38] mb-3 flex items-center gap-2">
                  <Check className="w-5 h-5 text-[#5EE177]" />
                  Pros
                </h4>
                <ul className="space-y-2">
                  {result.pros?.map((pro, idx) => (
                    <li key={idx} className="text-sm text-[#60656F] flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#5EE177] flex-shrink-0 mt-0.5" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div>
                <h4 className="font-semibold text-[#2E2E38] mb-3 flex items-center gap-2">
                  <XIcon className="w-5 h-5 text-red-500" />
                  Cons
                </h4>
                <ul className="space-y-2">
                  {result.cons?.map((con, idx) => (
                    <li key={idx} className="text-sm text-[#60656F] flex items-start gap-2">
                      <XIcon className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Second Tile - Price Comparison with product images */}
          <div className="bg-white rounded-3xl p-6 border border-[#E4E8ED] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#2E2E38] text-lg">Price Comparison</h3>
              <span className="text-sm font-semibold text-[#5EE177]">Online Deals</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {result.online_deals?.map((deal, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl p-4 border-2 ${
                    deal.is_smart_buy
                      ? 'border-[#5EE177] bg-[#5EE177]/10'
                      : 'border-[#E4E8ED] bg-white'
                  }`}
                >
                  {deal.is_smart_buy && (
                    <div className="bg-[#5EE177] text-white text-xs font-bold px-2 py-1 rounded-full inline-block mb-2">
                      Smart Buy
                    </div>
                  )}
                  {/* Product image */}
                  <div className="w-full h-24 bg-gray-100 rounded-xl mb-3 overflow-hidden">
                    <img 
                      src={deal.image_url || result.product_image_url || result.file_url} 
                      alt={deal.store}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-sm font-semibold text-[#2E2E38] mb-2">{deal.store}</p>
                  <p className="text-xl font-bold text-[#5EE177]">{deal.price}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Full-width Scrollable Sections Bar */}
          <div className="bg-white rounded-t-3xl border border-[#E4E8ED] sticky top-0 z-10 -mx-6">
            <div className="flex px-6 py-3">
              <button
                onClick={() => setActiveSection('overview')}
                className={`flex-1 text-sm font-semibold pb-2 transition-colors ${
                  activeSection === 'overview'
                    ? 'text-[#2E2E38] border-b-2 border-[#5EE177]'
                    : 'text-[#60656F]'
                }`}
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveSection('alternatives')}
                className={`flex-1 text-sm font-semibold pb-2 transition-colors ${
                  activeSection === 'alternatives'
                    ? 'text-[#2E2E38] border-b-2 border-[#5EE177]'
                    : 'text-[#60656F]'
                }`}
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Alternatives
              </button>
              <button
                onClick={() => setActiveSection('smart-insights')}
                className={`flex-1 text-sm font-semibold pb-2 transition-colors flex items-center justify-center gap-1 ${
                  activeSection === 'smart-insights'
                    ? 'text-[#2E2E38] border-b-2 border-[#5EE177]'
                    : 'text-[#60656F]'
                }`}
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Smart Insights
                <Lock className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Section Content */}
          <div className="bg-white rounded-b-3xl border-x border-b border-[#E4E8ED] p-6 -mx-6">
            {activeSection === 'overview' && (
              <div className="space-y-6">
                {/* Basic Info Header */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-[#2E2E38]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Basic Info
                    </h2>
                    <button className="text-[#60656F]">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="5" r="1.5" fill="currentColor"/>
                        <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
                        <circle cx="12" cy="19" r="1.5" fill="currentColor"/>
                      </svg>
                    </button>
                  </div>

                  {/* Product image and details in a box */}
                  <div className="bg-[#F9FAFB] rounded-2xl p-4 flex gap-4 mb-6">
                    <div className="w-24 h-24 bg-white rounded-xl overflow-hidden flex-shrink-0">
                      <img 
                        src={result.product_image_url || result.file_url} 
                        alt={result.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-[#2E2E38] mb-2">{result.title}</h3>
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < Math.floor(result.rating || 0) ? 'text-[#FF8AC6] fill-[#FF8AC6]' : 'text-gray-300'}`}
                          />
                        ))}
                        <span className="text-xs text-[#60656F] ml-1">{result.rating} stars</span>
                      </div>
                      <p className="text-xl font-bold text-[#5EE177] mb-2">{result.price}</p>
                      <Button className="w-full bg-white border-2 border-[#5EE177] text-[#5EE177] hover:bg-[#5EE177] hover:text-white font-semibold rounded-2xl h-10 text-sm">
                        + Add to Favorites
                      </Button>
                    </div>
                  </div>

                  {/* Separator line */}
                  <div className="border-t border-[#E4E8ED] my-6" />

                  {/* Description */}
                  <div className="mb-6">
                    <h3 className="font-bold text-[#2E2E38] mb-3 text-lg">Description</h3>
                    <p className="text-[#60656F] text-sm leading-relaxed mb-3">
                      {result.description}
                    </p>
                    <p className="text-xs text-[#60656F] mb-2">
                      <span className="font-semibold">Return Policy:</span> {result.return_policy || '30 days'}
                    </p>
                    <button className="text-[#5EE177] text-sm font-semibold flex items-center gap-1">
                      Ask AI
                      <ChevronLeft className="w-4 h-4 rotate-180" />
                    </button>
                  </div>

                  {/* Separator line */}
                  <div className="border-t border-[#E4E8ED] my-6" />

                  {/* Key Features */}
                  <div>
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
                </div>

                {/* Reviews section placeholder */}
                <div className="border-t border-[#E4E8ED] pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-[#2E2E38] text-lg">Reviews</h3>
                    <button className="text-[#5EE177] text-sm font-semibold">View</button>
                  </div>
                  <p className="text-[#60656F] text-sm italic">- Runs slightly small</p>
                  <p className="text-[#60656F] text-sm italic">- Recommend size up</p>
                </div>
              </div>
            )}

            {activeSection === 'alternatives' && (
              <div className="space-y-6">
                {/* Top Picks */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-[#2E2E38]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Top Picks
                    </h2>
                    <ChevronLeft className="w-5 h-5 text-[#60656F] rotate-180" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {result.alternatives?.slice(0, 2).map((alt, idx) => (
                      <div key={idx} className="bg-[#F9FAFB] rounded-2xl p-4">
                        <div className="w-full h-32 bg-white rounded-xl mb-3 overflow-hidden">
                          <img 
                            src={alt.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300'} 
                            alt={alt.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h3 className="font-bold text-[#2E2E38] text-sm mb-1 line-clamp-1">{alt.name}</h3>
                        <p className="text-xs text-[#60656F] mb-2">{alt.store}</p>
                        <p className="text-lg font-bold text-[#5EE177]">{alt.price}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Best Deals */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-[#2E2E38]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Best Deals
                    </h2>
                    <ChevronLeft className="w-5 h-5 text-[#60656F] rotate-180" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {result.online_deals?.slice(0, 2).map((deal, idx) => (
                      <div key={idx} className="bg-[#F9FAFB] rounded-2xl p-4">
                        <div className="w-full h-32 bg-white rounded-xl mb-3 overflow-hidden">
                          <img 
                            src={deal.image_url || result.product_image_url || result.file_url} 
                            alt={deal.store}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h3 className="font-bold text-[#2E2E38] text-sm mb-1">{deal.store}</h3>
                        <p className="text-xs text-[#60656F] mb-2">{result.title}</p>
                        <p className="text-lg font-bold text-[#5EE177]">{deal.price}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Best Matches */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-[#2E2E38]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Best Matches
                    </h2>
                    <ChevronLeft className="w-5 h-5 text-[#60656F] rotate-180" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {result.alternatives?.slice(2, 4).map((alt, idx) => (
                      <div key={idx} className="bg-[#F9FAFB] rounded-2xl p-4">
                        <div className="w-full h-32 bg-white rounded-xl mb-3 overflow-hidden">
                          <img 
                            src={alt.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300'} 
                            alt={alt.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h3 className="font-bold text-[#2E2E38] text-sm mb-1 line-clamp-1">{alt.name}</h3>
                        <p className="text-xs text-[#60656F] mb-2">{alt.store}</p>
                        <p className="text-lg font-bold text-[#5EE177]">{alt.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'smart-insights' && (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#5EE177] to-[#FF8AC6] flex items-center justify-center mb-4">
                  <Lock className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#2E2E38] mb-2">Premium Feature</h3>
                <p className="text-[#60656F] text-sm text-center mb-6">
                  Unlock Smart Insights to get AI-powered recommendations
                </p>
                <Button className="bg-gradient-to-r from-[#5EE177] to-[#FF8AC6] text-white font-bold rounded-2xl px-8 h-12">
                  Upgrade to Premium
                </Button>
              </div>
            )}
          </div>
        </div>

        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
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