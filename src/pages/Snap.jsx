import React, { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Camera, X, Loader2, Sparkles, Bookmark, Send, Image as ImageIcon, Zap, Scan, HelpCircle, Star, Check, XIcon, ChevronLeft, Lock, Heart } from "lucide-react";

export default function Snap() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const fromPage = urlParams.get('from') || 'Home';
  const [cameraReady, setCameraReady] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [mode, setMode] = useState('identify');
  const [scanningPhrase, setScanningPhrase] = useState('Detecting your item...');
  const [expandedSubscore, setExpandedSubscore] = useState(null);
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
  const [showBestPriceSheet, setShowBestPriceSheet] = useState(false);
  const storeComparisonRef = useRef(null);

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

  // Result View - Mockup-based design
  if (result) {
    // Find best price
    const bestDeal = result.online_deals?.reduce((min, deal) => {
      const price = parseFloat(deal.price.replace(/[^0-9.]/g, ''));
      const minPrice = parseFloat(min.price.replace(/[^0-9.]/g, ''));
      return price < minPrice ? deal : min;
    }, result.online_deals[0]);

    const getScoreLabel = (score) => {
      if (score >= 80) return { text: 'Very Good', color: '#00A36C' };
      if (score >= 60) return { text: 'Good', color: '#00A36C' };
      if (score >= 40) return { text: 'Fair', color: '#F59E0B' };
      return { text: 'Poor', color: '#EF4444' };
    };

    return (
      <div className="min-h-screen bg-white pb-6">
        {/* Header with Product Info */}
        <div className="px-4 pt-3">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => { setResult(null); startCamera(); }}
            className="p-1"
          >
            <ChevronLeft className="w-5 h-5 text-[#1F2937]" />
          </button>
          <button className="flex flex-col gap-0.5 p-0.5">
            <div className="w-3 h-0.5 bg-[#1F2937]" />
            <div className="w-3 h-0.5 bg-[#1F2937]" />
            <div className="w-3 h-0.5 bg-[#1F2937]" />
          </button>
        </div>

          <div className="flex gap-3 mb-5">
            {/* Large Product Image */}
            <div className="w-40 h-40 bg-[#F9FAFB] rounded-xl flex items-center justify-center flex-shrink-0">
              <img
                src={result.product_image_url || result.file_url}
                alt={result.title}
                className="w-full h-full object-contain p-2"
              />
            </div>

            {/* Product Info */}
            <div className="flex-1">
              <p className="text-[10px] text-[#6B7280] mb-1">{result.brand}</p>
              <h1 className="text-sm font-bold text-[#1F2937] mb-0.5 leading-tight">{result.title}</h1>
              <p className="text-[9px] text-[#9CA3AF] mb-2">{result.keywords?.[0] || 'Electronics'}</p>
              <button className="text-[10px] text-[#1F2937] font-semibold px-2 py-1 bg-[#F3F4F6] rounded-full">
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4">
          {/* Product Overview */}
          <div className="mb-5">
            <h2 className="text-base font-bold text-[#1F2937] mb-3">Product Overview</h2>
            <p className="text-sm text-[#1F2937] leading-relaxed line-clamp-2 inline">
              {result.description || result.smart_summary}
            </p>
            <button className="text-[10px] text-[#6B7280] font-semibold ml-1">see more</button>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
              {result.features?.slice(0, 6).map((feature, idx) => (
                <div key={idx} className="text-xs text-[#1F2937] flex items-start gap-2">
                  <span className="text-[#00A36C] mt-0.5">•</span>
                  <span>{feature.split(' ').slice(0, 4).join(' ')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Deal Score */}
          <div className="mb-5 bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-md">
            <h2 className="text-base font-bold text-[#1F2937] mb-3">Deal Score</h2>

            <div className="flex gap-3 mb-4">
              <div className="flex flex-col items-center">
                <div className="relative mb-1">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle cx="32" cy="32" r="28" fill="none" stroke="#F3F4F6" strokeWidth="6" />
                    <circle 
                      cx="32" cy="32" r="28" 
                      fill="none" 
                      stroke="#00A36C" 
                      strokeWidth="6"
                      strokeDasharray={`${2 * Math.PI * 28 * (result.overall_score / 100)} ${2 * Math.PI * 28}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold text-[#1F2937]">{result.overall_score}</span>
                    <span className="text-[8px] text-[#6B7280]">/100</span>
                  </div>
                </div>
                <p className="text-xs font-bold text-[#1F2937]">Strong Deal</p>
              </div>

              <div className="flex-1 space-y-1.5 pr-2">
                {result.subscores && Object.entries(result.subscores).map(([key, value]) => {
                  const label = getScoreLabel(value);
                  const isExpanded = expandedSubscore === key;

                  return (
                    <div key={key}>
                      <button 
                        onClick={() => setExpandedSubscore(isExpanded ? null : key)}
                        className="w-full"
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-semibold text-[#1F2937] capitalize w-14">{key}</span>
                          <div className="h-1 bg-[#F3F4F6] rounded-full overflow-hidden flex-1">
                            <div 
                              className="h-full rounded-full"
                              style={{ 
                                width: `${value}%`,
                                backgroundColor: label.color
                              }}
                            ></div>
                          </div>
                          <span className="text-[10px] font-bold text-[#1F2937] w-6">{value}</span>
                          <span 
                            className="text-[8px] font-semibold px-1 py-0.5 rounded whitespace-nowrap"
                            style={{ 
                              color: label.color,
                              backgroundColor: `${label.color}15`
                            }}
                          >
                            {label.text}
                          </span>
                          <svg 
                            className={`w-2.5 h-2.5 text-[#6B7280] transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="mt-2 pt-2 border-t border-[#E5E7EB] ml-2">
                          <p className="text-xs text-[#6B7280] leading-relaxed">
                            {key === 'price' && 'Price is well below market average, offering excellent value for this product category.'}
                            {key === 'quality' && 'High-quality construction and materials based on verified customer reviews and manufacturer specifications.'}
                            {key === 'durability' && 'Built to last with premium components and solid build quality reported by long-term users.'}
                            {key === 'features' && 'Comprehensive feature set that matches or exceeds competitors in this price range.'}
                            {key === 'design' && 'Modern, ergonomic design praised by users for both aesthetics and functionality.'}
                            {key === 'value' && 'Outstanding value proposition considering price, quality, and feature set combined.'}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-[#E5E7EB] pt-3 mt-3">
              <p className="text-xs font-bold text-[#1F2937] mb-2">AI Summary</p>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Price is well below market average and maintains strong willingness. More info here.
              </p>
            </div>
          </div>

          {/* Price Intelligence */}
          <div className="mb-5">
            <h2 className="text-base font-bold text-[#1F2937] mb-3">Price Intelligence</h2>

            <div className="grid grid-cols-2 gap-3">
              {/* Market History */}
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-3 shadow-md">
                <h3 className="text-xs font-bold text-[#1F2937] mb-3">Market History</h3>
                
                {/* Time Period Selector */}
                <div className="flex justify-between mb-1">
                  <button className="text-[10px] font-semibold text-[#00A36C]">90D</button>
                  <button className="text-[10px] font-semibold text-[#6B7280]">3M</button>
                  <button className="text-[10px] font-semibold text-[#6B7280]">1Y</button>
                </div>
                <div className="relative mb-2">
                  <div className="h-0.5 bg-[#E5E7EB] rounded-full" />
                  <div className="absolute top-0 left-0 w-1/3 h-0.5 bg-[#00A36C] rounded-full" />
                </div>

                {/* Graph */}
                <div className="flex gap-2 mb-2">
                  <div className="flex flex-col justify-between text-[9px] text-[#6B7280] pt-1">
                    <span>60</span>
                    <span>40</span>
                    <span>20</span>
                  </div>
                  <div className="flex-1 relative">
                    <svg className="w-full h-24" viewBox="0 0 200 80" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="rgba(0, 163, 108, 0.3)" />
                          <stop offset="100%" stopColor="rgba(0, 163, 108, 0)" />
                        </linearGradient>
                      </defs>
                      <line x1="0" y1="13" x2="200" y2="13" stroke="#E5E7EB" strokeWidth="0.5" />
                      <line x1="0" y1="40" x2="200" y2="40" stroke="#E5E7EB" strokeWidth="0.5" />
                      <line x1="0" y1="67" x2="200" y2="67" stroke="#E5E7EB" strokeWidth="0.5" />
                      <polygon
                        fill="url(#gradient)"
                        points="0,80 0,60 50,45 100,55 150,30 200,40 200,80"
                      />
                      <polyline
                        fill="none"
                        stroke="#00A36C"
                        strokeWidth="2"
                        points="0,60 50,45 100,55 150,30 200,40"
                      />
                    </svg>
                    <div className="flex justify-between text-[8px] text-[#6B7280]">
                      <span>23</span>
                      <span>15</span>
                      <span>2</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mb-2">
                  <div className="flex-1 text-center">
                    <p className="text-xs font-bold text-[#1F2937]">${bestDeal?.price?.replace(/[^0-9.]/g, '') || '899'}</p>
                    <p className="text-[9px] text-[#6B7280]">current</p>
                  </div>
                  <div className="flex-1 text-center">
                    <p className="text-xs font-bold text-[#1F2937]">$999</p>
                    <p className="text-[9px] text-[#6B7280]">average</p>
                  </div>
                  <div className="flex-1 text-center">
                    <p className="text-xs font-bold text-[#1F2937]">$849</p>
                    <p className="text-[9px] text-[#6B7280]">lowest</p>
                  </div>
                </div>
                <p className="text-[10px] text-center px-2 py-1 bg-[#D6F5E9] text-[#00A36C] rounded-full font-semibold">
                  Good time to buy
                </p>
              </div>

              {/* Best Price Vs Market */}
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-3 shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-[#1F2937]">Best Price vs Market</h3>
                  <button>
                    <Bookmark className="w-4 h-4 text-[#6B7280]" />
                  </button>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-20 h-20 rounded-lg bg-[#F9FAFB] flex items-center justify-center flex-shrink-0">
                    <img 
                      src={result.product_image_url || result.file_url}
                      alt={result.title}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] text-[#6B7280] mb-0.5">{bestDeal?.store}</p>
                    <p className="text-xs font-semibold text-[#1F2937] mb-1 line-clamp-2">{result.title}</p>
                    <p className="text-sm font-bold text-[#1F2937] mb-1">{bestDeal?.price}</p>
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="w-2.5 h-2.5 text-[#F59E0B] fill-[#F59E0B]" />
                      <span className="text-[9px] text-[#1F2937]">{result.rating}</span>
                    </div>
                    <p className="text-[8px] text-[#6B7280]">(17.3k)</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-2 mb-2">
                  <span className="text-[9px] font-semibold px-2 py-0.5 bg-[#D6F5E9] text-[#00A36C] rounded-full">-$10 Ave Price</span>
                  <span className="text-[9px] text-[#00A36C]">In Stock</span>
                </div>
                <p className="text-[9px] text-[#6B7280] mb-2 line-clamp-2">Best value for premium quality and features in this category.</p>
                <button className="w-full py-1.5 bg-[#00A36C] text-white rounded-full text-[10px] font-semibold">
                  Visit Store
                </button>
              </div>
            </div>
          </div>

          {/* Store Comparison */}
          <div ref={storeComparisonRef} className="mb-5">
            <h2 className="text-base font-bold text-[#1F2937] mb-3">Store Comparison</h2>
            <div className="space-y-3">
              {result.online_deals?.slice(0, 3).map((deal, idx) => {
                const prices = result.online_deals.map(d => parseFloat(d.price.replace(/[^0-9.]/g, '')));
                const minPrice = Math.min(...prices);
                const currentPrice = parseFloat(deal.price.replace(/[^0-9.]/g, ''));
                const isBest = currentPrice === minPrice;

                return (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-20 h-20 rounded-lg bg-[#F9FAFB] flex items-center justify-center overflow-hidden flex-shrink-0">
                      <img 
                        src={result.product_image_url || result.file_url}
                        alt={result.title}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#1F2937] mb-0.5">{deal.store}</p>
                      <p className="text-xs text-[#1F2937] mb-1 truncate">{result.title}</p>
                      <p className="text-sm font-bold text-[#1F2937]">{deal.price}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {isBest && (
                        <span className="block text-[10px] font-semibold text-[#00A36C] px-2 py-0.5 bg-[#D6F5E9] rounded mb-1">
                          Best
                        </span>
                      )}
                      <p className="text-[9px] text-[#6B7280]">
                        {isBest ? 'Free Ship' : '$5 Ship'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <button className="w-full py-2.5 mt-3 bg-white border border-[#E5E7EB] rounded-lg text-xs font-semibold text-[#1F2937] hover:bg-[#F9FAFB] transition-colors">
              View More Stores
            </button>
          </div>

          {/* Review Summary */}
          <div className="mb-5">
            <h2 className="text-base font-bold text-[#1F2937] mb-3">Review Summary</h2>
            <p className="text-xs text-[#6B7280] mb-3">
              Based on 1,312 reviews across major retailers (Amazon, Bestbuy, Walmart...)
            </p>

            <div className="bg-[#F0FDF4] border border-[#D1FAE5] rounded-lg p-3 mb-3">
              <span className="inline-block px-2 py-1 bg-[#00A36C] text-white rounded text-xs font-semibold mb-2">
                Mostly Positive
              </span>
              <p className="text-xs text-[#1F2937] leading-relaxed">
                Most praised: sound quality & comfort compliance. Common battery aging after long term use.
              </p>
            </div>

            <div className="mb-3">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-[#1F2937] mb-2">Trust Check</p>
                  <p className="text-xs font-bold text-[#00A36C] mb-1">High Confidence</p>
                  <div className="h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-[#00A36C] rounded-full" style={{width: '85%'}}></div>
                  </div>
                </div>
                <p className="flex-1 text-[10px] text-[#6B7280] leading-relaxed">
                  Low likelihood of fake/unverified reviews.
                </p>
              </div>
            </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#1F2937]">Quality</span>
                  <span className="px-1.5 py-0.5 bg-[#D6F5E9] text-[#00A36C] rounded text-[10px] font-semibold">Positive</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#1F2937]">Warranty</span>
                  <span className="px-1.5 py-0.5 bg-[#FEF3C7] text-[#F59E0B] rounded text-[10px] font-semibold">Fair</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#1F2937]">Style</span>
                  <span className="px-1.5 py-0.5 bg-[#D6F5E9] text-[#00A36C] rounded text-[10px] font-semibold">Very Positive</span>
                </div>
              </div>
            </div>

          {/* Alternatives */}
          <div className="mb-5">
            <h2 className="text-base font-bold text-[#1F2937] mb-2">Alternatives</h2>
            <p className="text-xs text-[#6B7280] mb-3">Comparable products with better price, value</p>

            <div className="space-y-3">
              {result.alternatives?.slice(0, 3).map((alt, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-20 h-20 rounded-xl bg-[#F9FAFB] flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img 
                      src={alt.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200'}
                      alt={alt.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-[#6B7280] mb-0.5">{alt.store}</p>
                    <p className="text-xs font-semibold text-[#1F2937] mb-1 line-clamp-2">{alt.name}</p>
                    <p className="text-xs font-bold text-[#1F2937]">{alt.price}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="inline-block text-[10px] font-semibold text-[#00A36C] px-2 py-0.5 bg-[#D6F5E9] rounded mb-1">
                      {idx === 0 ? 'Best Value' : idx === 1 ? 'Cheapest' : 'Premium'}
                    </span>
                    <div className="flex items-center gap-1 justify-end mt-1">
                      <Star className="w-2.5 h-2.5 text-[#F59E0B] fill-[#F59E0B]" />
                      <span className="text-[9px] text-[#1F2937]">4.{idx + 2}</span>
                      <span className="text-[8px] text-[#6B7280]">(17.3k)</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full py-2.5 mt-3 bg-white border border-[#E5E7EB] rounded-lg text-xs font-semibold text-[#1F2937] hover:bg-[#F9FAFB] transition-colors">
              View all alternatives
            </button>
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="px-4 pt-4 pb-6">
          <div className="flex gap-3">
            <button 
              onClick={() => { setResult(null); startCamera(); }}
              className="flex-1 py-3 bg-[#00A36C] text-white rounded-full text-sm font-semibold hover:bg-[#007E52] transition-colors"
            >
              Scan Again
            </button>
            <button className="flex-1 py-3 bg-white border-2 border-[#00A36C] text-[#00A36C] rounded-full text-sm font-semibold hover:bg-[#F0FDF4] transition-colors">
              Fix Product
            </button>
          </div>
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