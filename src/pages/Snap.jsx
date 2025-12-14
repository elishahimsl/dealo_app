import React, { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Camera, X, Loader2, Sparkles, Bookmark, Send, Image as ImageIcon, Zap, Scan, HelpCircle, Star, Check, XIcon, ChevronLeft, Lock } from "lucide-react";

export default function Snap() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const fromPage = urlParams.get('from') || 'Home';
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

  const [capturedImage, setCapturedImage] = useState(null);
  const [showFlash, setShowFlash] = useState(false);

  const capturePhoto = async () => {
    if (!videoRef.current || !cameraReady) return;

    // Flash effect
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 150);

    // Capture the image
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);

    // Show preview first
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(imageDataUrl);
    stopCamera();
  };

  const processCapture = async () => {
    if (!capturedImage) return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const slot = urlParams.get('slot');
    
    setScanning(true);
    setCapturedImage(null);

    // Convert data URL to blob
    const response = await fetch(capturedImage);
    const blob = await response.blob();
    const capturedFile = new File([blob], `snap-${Date.now()}.jpg`, { type: 'image/jpeg' });

    try {
      const { file_url: user_photo_url } = await base44.integrations.Core.UploadFile({ file: capturedFile });

      const aiResult = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an expert product identifier. Analyze this image carefully and identify the EXACT product shown.

IMPORTANT INSTRUCTIONS:
1. Look at the image carefully and identify what product/item is shown
2. If it's a branded product, identify the exact brand and model if possible
3. If it's a generic item, describe it accurately
4. Provide realistic pricing based on current market values
5. Generate accurate product details

Provide the following information:
- Product name/title (be specific, include brand and model if visible)
- Brand (identify from logos, text, or recognizable design)
- Estimated retail price
- Star rating (realistic, 3.5-4.9 range)
- In stock status
- Detailed smart summary (2-3 sentences describing the product)
- Overall quality score out of 100
- Subscores: Quality, Value, Features, Design, Durability (each out of 100)
- 4-5 specific pros based on this type of product
- 4-5 specific cons based on this type of product
- 4-5 online deals with realistic store prices
- Detailed product description
- Key features (5-6 bullet points)
- Return policy estimate
- 3-4 alternative/competing products
- A relevant Unsplash product image URL

Be specific and accurate. If you cannot identify the exact product, provide your best educated guess based on visible characteristics.`,
          file_urls: user_photo_url,
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

        // Save to database with product showcase image
        await base44.entities.Capture.create({
          title: aiResult.title,
          content_type: 'other',
          file_url: aiResult.product_image_url || user_photo_url,
          file_type: 'image',
          ai_summary: aiResult.smart_summary,
          keywords: [aiResult.brand, aiResult.title]
        });

        // If coming from Compare page, return with product data
        if (fromPage === 'Compare' && slot) {
          navigate(createPageUrl("Compare"), {
            state: {
              selectedProduct: {
                title: aiResult.title,
                brand: aiResult.brand,
                price: aiResult.price,
                file_url: aiResult.product_image_url || user_photo_url
              },
              slot: slot
            }
          });
          return;
        }

        setResult({ file_url: user_photo_url, ...aiResult });
    } catch (error) {
      console.error("Error processing scan:", error);
      alert("Failed to process image. Please try again.");
    }

    setScanning(false);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleFileSelect = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setScanning(true);
    stopCamera();

    try {
      const { file_url: user_photo_url } = await base44.integrations.Core.UploadFile({ file: selectedFile });

      const aiResult = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this product image comprehensively and provide all details including a high-quality product showcase image URL from Unsplash. For product_image_url, provide a URL of the actual product type detected, not the user's photo. Be specific and generate realistic data.`,
        file_urls: user_photo_url,
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

      // Save to database with product showcase image
      await base44.entities.Capture.create({
        title: aiResult.title,
        content_type: 'other',
        file_url: aiResult.product_image_url || user_photo_url,
        file_type: 'image',
        ai_summary: aiResult.smart_summary,
        keywords: [aiResult.brand, aiResult.title]
      });

      setResult({ file_url: user_photo_url, ...aiResult });
    } catch (error) {
      console.error("Error processing file:", error);
      alert("Failed to process file. Please try again.");
    }

    setScanning(false);
  };

  // Result View - Premium App Store-ready design
  if (result) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header Section - Above the Fold */}
        <div className="relative">
          {/* Large Product Image */}
          <div className="h-72 bg-[#F9FAFB] flex items-center justify-center">
            <img
              src={result.product_image_url || result.file_url}
              alt={result.title}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Header Controls */}
          <div className="absolute top-0 left-0 right-0 px-4 py-3 flex items-center justify-between">
            <button 
              onClick={() => { setResult(null); startCamera(); }}
              className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm"
            >
              <ChevronLeft className="w-5 h-5 text-[#1F2937]" />
            </button>
            <button className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm">
              <Send className="w-5 h-5 text-[#1F2937]" />
            </button>
          </div>
        </div>

        {/* Product Info & Score */}
        <div className="px-5 pt-5 pb-4 border-b border-[#F3F4F6]">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1">
              <h1 className="text-xl font-bold text-[#1F2937] mb-1 leading-tight">
                {result.title}
              </h1>
              <p className="text-sm text-[#6B7280] mb-2">{result.brand}</p>
              <span className="inline-block px-2.5 py-1 bg-[#F3F4F6] rounded-full text-xs font-medium text-[#6B7280]">
                {result.keywords?.[0] || 'Product'}
              </span>
            </div>

            {/* DeaLo AI Score */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border-3 border-[#00A36C] flex flex-col items-center justify-center mb-1">
                <span className="text-2xl font-bold text-[#1F2937] leading-none">{result.overall_score}</span>
                <span className="text-[9px] text-[#6B7280]">/ 100</span>
              </div>
              <span className="text-[10px] text-[#6B7280] mb-0.5">DeaLo AI Score</span>
              <span className="text-xs font-semibold text-[#00A36C]">
                {result.overall_score >= 80 ? 'Great Value' : result.overall_score >= 60 ? 'Good Time to Buy' : 'Consider Alternatives'}
              </span>
            </div>
          </div>
        </div>

        {/* Primary Action Row */}
        <div className="px-5 py-4 border-b border-[#F3F4F6]">
          <div className="flex gap-2">
            <button className="flex-1 h-11 bg-[#00A36C] text-white rounded-full font-semibold text-sm hover:bg-[#007E52] transition-colors">
              Best Price
            </button>
            <button className="flex-1 h-11 bg-[#F3F4F6] text-[#1F2937] rounded-full font-semibold text-sm hover:bg-[#E5E7EB] transition-colors">
              Compare
            </button>
            <button className="w-11 h-11 bg-[#F3F4F6] rounded-full flex items-center justify-center hover:bg-[#E5E7EB] transition-colors">
              <Bookmark className="w-5 h-5 text-[#1F2937]" />
            </button>
            <button className="w-11 h-11 bg-[#F3F4F6] rounded-full flex items-center justify-center hover:bg-[#E5E7EB] transition-colors">
              <Send className="w-5 h-5 text-[#1F2937]" />
            </button>
          </div>
        </div>

        {/* Price Snapshot Section */}
        <div className="px-5 py-5 border-b border-[#F3F4F6]">
          <h2 className="text-base font-bold text-[#1F2937] mb-4">Price Snapshot</h2>

          {/* Simple Price Graph Placeholder */}
          <div className="h-32 bg-[#F9FAFB] rounded-2xl mb-4 flex items-end justify-around p-4">
            <div className="w-2 bg-[#00A36C] rounded-t" style={{height: '60%'}}></div>
            <div className="w-2 bg-[#00A36C] rounded-t" style={{height: '45%'}}></div>
            <div className="w-2 bg-[#00A36C] rounded-t" style={{height: '70%'}}></div>
            <div className="w-2 bg-[#00A36C] rounded-t" style={{height: '55%'}}></div>
            <div className="w-2 bg-[#00A36C] rounded-t" style={{height: '80%'}}></div>
            <div className="w-2 bg-[#00A36C] rounded-t" style={{height: '50%'}}></div>
            <div className="w-2 bg-[#00A36C] rounded-t" style={{height: '65%'}}></div>
          </div>

          {/* Price Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-xs text-[#6B7280] mb-1">Current Price</p>
              <p className="text-lg font-bold text-[#1F2937]">{result.price}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-[#6B7280] mb-1">Average Price</p>
              <p className="text-lg font-bold text-[#1F2937]">
                ${(parseFloat(result.price.replace(/[^0-9.]/g, '')) * 1.15).toFixed(0)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-[#6B7280] mb-1">Lowest Price</p>
              <p className="text-lg font-bold text-[#00A36C]">
                ${(parseFloat(result.price.replace(/[^0-9.]/g, '')) * 0.85).toFixed(0)}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="mt-4 text-center">
            <span className="inline-block px-4 py-2 bg-[#D6F5E9] text-[#00A36C] rounded-full text-sm font-semibold">
              Good time to buy
            </span>
          </div>
        </div>

        {/* Quality & Trust Breakdown */}
        <div className="px-5 py-5 border-b border-[#F3F4F6]">
          <h2 className="text-base font-bold text-[#1F2937] mb-4">Quality & Trust Breakdown</h2>

          <div className="space-y-4">
            {result.subscores && Object.entries(result.subscores).map(([key, value]) => (
              <div key={key}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[#1F2937] capitalize">{key}</span>
                  <span className="text-sm font-bold text-[#1F2937]">{value}</span>
                </div>
                <div className="h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#00A36C] rounded-full transition-all"
                    style={{width: `${value}%`}}
                  ></div>
                </div>
                <p className="text-xs text-[#6B7280] mt-1">
                  {value >= 80 ? 'Excellent performance in this category' : 
                   value >= 60 ? 'Good performance overall' : 
                   'Room for improvement'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Pros & Cons */}
        <div className="px-5 py-5 border-b border-[#F3F4F6]">
          <h2 className="text-base font-bold text-[#1F2937] mb-4">Pros & Cons</h2>

          <div className="grid grid-cols-2 gap-4">
            {/* Pros */}
            <div>
              <h3 className="text-sm font-semibold text-[#00A36C] mb-3">Pros</h3>
              <ul className="space-y-2">
                {result.pros?.slice(0, 4).map((pro, idx) => (
                  <li key={idx} className="text-xs text-[#1F2937] flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-[#00A36C] flex-shrink-0 mt-0.5" />
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cons */}
            <div>
              <h3 className="text-sm font-semibold text-[#EF4444] mb-3">Cons</h3>
              <ul className="space-y-2">
                {result.cons?.slice(0, 4).map((con, idx) => (
                  <li key={idx} className="text-xs text-[#1F2937] flex items-start gap-2">
                    <XIcon className="w-3.5 h-3.5 text-[#EF4444] flex-shrink-0 mt-0.5" />
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* DeaLo AI Insight */}
        <div className="px-5 py-5 border-b border-[#F3F4F6]">
          <h2 className="text-base font-bold text-[#1F2937] mb-3">DeaLo AI Insight</h2>
          <div className="bg-[#F9FAFB] rounded-2xl p-4">
            <p className="text-sm text-[#1F2937] leading-relaxed">
              {result.smart_summary}
            </p>
          </div>
        </div>

        {/* Overview */}
        <div className="px-5 py-5 border-b border-[#F3F4F6]">
          <h2 className="text-base font-bold text-[#1F2937] mb-3">Overview</h2>
          <p className="text-sm text-[#6B7280] leading-relaxed mb-4">
            {result.description}
          </p>

          {/* Key Features */}
          <h3 className="text-sm font-semibold text-[#1F2937] mb-2">Key Features</h3>
          <ul className="space-y-2">
            {result.features?.map((feature, idx) => (
              <li key={idx} className="text-sm text-[#6B7280] flex items-start gap-2">
                <span className="text-[#00A36C] mt-0.5">•</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Store Comparison */}
        <div className="px-5 py-5 border-b border-[#F3F4F6]">
          <h2 className="text-base font-bold text-[#1F2937] mb-4">Available At</h2>

          <div className="space-y-3">
            {result.online_deals?.map((deal, idx) => {
              const prices = result.online_deals.map(d => parseFloat(d.price.replace(/[^0-9.]/g, '')));
              const minPrice = Math.min(...prices);
              const currentPrice = parseFloat(deal.price.replace(/[^0-9.]/g, ''));
              const isBestPrice = currentPrice === minPrice;

              return (
                <div 
                  key={idx}
                  className={`flex items-center gap-3 p-3 rounded-2xl border ${
                    isBestPrice ? 'border-[#00A36C] bg-[#F0FDF4]' : 'border-[#E5E7EB]'
                  }`}
                >
                  <div className="w-12 h-12 bg-white rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                    <img 
                      src={`https://logo.clearbit.com/${deal.store.toLowerCase().replace(/[^a-z]/g, '')}.com`}
                      alt={deal.store}
                      className="w-8 h-8 object-contain"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#1F2937]">{deal.store}</p>
                    <p className="text-xs text-[#6B7280]">{result.in_stock ? 'In Stock' : 'Check Availability'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-[#1F2937]">{deal.price}</p>
                    {isBestPrice && (
                      <span className="text-[10px] font-semibold text-[#00A36C]">Best Price</span>
                    )}
                  </div>
                  <button className="px-4 py-2 bg-[#1F2937] text-white rounded-full text-xs font-semibold hover:bg-[#374151] transition-colors">
                    View
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reviews Summary */}
        <div className="px-5 py-5 border-b border-[#F3F4F6]">
          <h2 className="text-base font-bold text-[#1F2937] mb-4">Reviews</h2>

          <div className="flex items-center gap-4 mb-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#1F2937]">{result.rating}</div>
              <div className="flex mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-3 h-3 ${i < Math.floor(result.rating) ? 'text-[#F59E0B] fill-[#F59E0B]' : 'text-[#E5E7EB]'}`}
                  />
                ))}
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#1F2937] mb-2">4,231 reviews</p>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#6B7280] w-16">Positive</span>
                  <div className="flex-1 h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                    <div className="h-full bg-[#00A36C]" style={{width: '78%'}}></div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#6B7280] w-16">Negative</span>
                  <div className="flex-1 h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                    <div className="h-full bg-[#EF4444]" style={{width: '22%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="bg-[#F9FAFB] rounded-xl p-3">
              <p className="text-xs font-medium text-[#00A36C] mb-1">Common Praise</p>
              <p className="text-sm text-[#1F2937]">Great quality, excellent value, fast shipping</p>
            </div>
            <div className="bg-[#F9FAFB] rounded-xl p-3">
              <p className="text-xs font-medium text-[#EF4444] mb-1">Common Complaints</p>
              <p className="text-sm text-[#1F2937]">Sizing runs small, limited color options</p>
            </div>
          </div>
        </div>

        {/* Alternatives */}
        <div className="px-5 py-5 border-b border-[#F3F4F6]">
          <h2 className="text-base font-bold text-[#1F2937] mb-4">Alternatives / Best Matches</h2>

          <div className="space-y-3">
            {result.alternatives?.slice(0, 3).map((alt, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-[#F9FAFB] rounded-2xl">
                <div className="w-16 h-16 bg-white rounded-xl overflow-hidden flex-shrink-0">
                  <img 
                    src={alt.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200'} 
                    alt={alt.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#1F2937] mb-1">{alt.name}</p>
                  <p className="text-xs text-[#6B7280] mb-1">{alt.store}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#1F2937]">{alt.price}</span>
                    <span className="text-[10px] font-semibold text-[#00A36C] px-2 py-0.5 bg-[#D6F5E9] rounded-full">
                      {idx === 0 ? 'Cheaper' : idx === 1 ? 'Higher Quality' : 'Best Match'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Smart Insights - Expandable */}
        <div className="px-5 py-5 pb-8">
          <button 
            onClick={() => setActiveSection(activeSection === 'smart-insights' ? '' : 'smart-insights')}
            className="w-full flex items-center justify-between"
          >
            <h2 className="text-base font-bold text-[#1F2937]">Smart Insights</h2>
            <ChevronLeft className={`w-5 h-5 text-[#6B7280] transition-transform ${activeSection === 'smart-insights' ? '-rotate-90' : 'rotate-180'}`} />
          </button>

          {activeSection === 'smart-insights' && (
            <div className="mt-4 space-y-3">
              <div className="bg-[#F9FAFB] rounded-xl p-4">
                <p className="text-xs font-semibold text-[#1F2937] mb-1">Price Volatility</p>
                <p className="text-sm text-[#6B7280]">Low volatility - prices remain stable</p>
              </div>
              <div className="bg-[#F9FAFB] rounded-xl p-4">
                <p className="text-xs font-semibold text-[#1F2937] mb-1">Return Reasons</p>
                <p className="text-sm text-[#6B7280]">Size issues (12%), defects (3%)</p>
              </div>
              <div className="bg-[#F9FAFB] rounded-xl p-4">
                <p className="text-xs font-semibold text-[#1F2937] mb-1">Long-term Value</p>
                <p className="text-sm text-[#6B7280]">High predicted satisfaction over 12 months</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Captured Image Preview
  if (capturedImage) {
    return (
      <div className="relative h-screen w-screen bg-black overflow-hidden">
        <img src={capturedImage} alt="Captured" className="absolute inset-0 w-full h-full object-cover" />
        
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-20 pt-12 px-6 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={retakePhoto}
            className="rounded-full bg-black/30 backdrop-blur-md hover:bg-black/50 border border-white/20"
          >
            <X className="w-5 h-5 text-white" />
          </Button>
          <span className="text-white font-semibold">Preview</span>
          <div className="w-10" />
        </div>

        {/* Bottom controls */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <div className="bg-gray-800/80 backdrop-blur-md py-6 px-8">
            <div className="flex items-center justify-between max-w-lg mx-auto">
              <button
                onClick={retakePhoto}
                className="text-white font-semibold"
              >
                Retake
              </button>
              <button
                onClick={processCapture}
                className="bg-[#00A36C] text-white px-8 py-3 rounded-full font-semibold"
              >
                Use Photo
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Camera View
  return (
    <div className="relative h-screen w-screen bg-black overflow-hidden">
      {/* Flash effect */}
      {showFlash && (
        <div className="absolute inset-0 bg-white z-50 animate-flash" />
      )}
      
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
          onClick={() => navigate(createPageUrl(fromPage))}
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
            <div className="w-56 h-56 relative">
              <Scan className="w-full h-full text-[#00A36C] opacity-40" strokeWidth={0.5} />
              <div 
                className="absolute left-8 right-8 h-1 bg-[#00A36C]"
                style={{ 
                  animation: 'scan 2s ease-in-out infinite',
                  boxShadow: '0 0 20px 4px #00A36C, 0 0 40px 8px rgba(0, 163, 108, 0.5)'
                }}
              />
            </div>
          </div>
          <p className="text-white text-xl font-semibold mb-2">Analyzing...</p>
          <p className="text-[#00A36C] text-sm font-medium">{scanningPhrase}</p>
        </div>
      )}

      {!scanning && (
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <div className="flex justify-center gap-6 mb-6">
            <button
              onClick={() => setMode('identify')}
              className={`text-sm font-semibold transition-colors ${
                mode === 'identify' ? 'text-[#00A36C]' : 'text-white/70'
              }`}
            >
              Identify
            </button>
            <button
              onClick={() => setMode('scan')}
              className={`text-sm font-semibold transition-colors ${
                mode === 'scan' ? 'text-[#00A36C]' : 'text-white/70'
              }`}
            >
              Scan
            </button>
            <button
              onClick={() => setMode('ar')}
              className={`text-sm font-semibold transition-colors ${
                mode === 'ar' ? 'text-[#00A36C]' : 'text-white/70'
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
                <div className="absolute inset-0 rounded-full bg-[#00A36C] blur-xl opacity-50" />
                <button
                  onClick={capturePhoto}
                  disabled={!cameraReady}
                  className="relative w-16 h-16 rounded-full bg-[#00A36C] border-4 border-white shadow-2xl transition-transform hover:scale-110 active:scale-95 disabled:opacity-50"
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
        @keyframes flash {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        .animate-flash {
          animation: flash 0.15s ease-out;
        }
      `}</style>
    </div>
  );
}