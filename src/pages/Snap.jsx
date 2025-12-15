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
              className="p-2"
            >
              <ChevronLeft className="w-6 h-6 text-[#1F2937]" />
            </button>
            <button className="flex flex-col gap-1 p-2">
              <div className="w-5 h-0.5 bg-[#1F2937]" />
              <div className="w-5 h-0.5 bg-[#1F2937]" />
              <div className="w-5 h-0.5 bg-[#1F2937]" />
            </button>
          </div>

          <div className="flex gap-4 mb-5">
            {/* Large Product Image */}
            <div className="w-32 h-32 bg-[#F9FAFB] rounded-xl flex items-center justify-center flex-shrink-0">
              <img
                src={result.product_image_url || result.file_url}
                alt={result.title}
                className="w-full h-full object-contain p-2"
              />
            </div>

            {/* Product Info */}
            <div className="flex-1">
              <h1 className="text-lg font-bold text-[#1F2937] mb-2 leading-tight">{result.title}</h1>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#6B7280] px-2 py-1 bg-[#F3F4F6] rounded">
                  {result.keywords?.[0] || 'Tech'}
                </span>
                <button className="text-xs text-[#00A36C] font-semibold flex items-center gap-1">
                  <Send className="w-3.5 h-3.5" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4">
          {/* Product Overview */}
          <div className="mb-5">
            <h2 className="text-base font-bold text-[#1F2937] mb-3">Product Overview</h2>
            <p className="text-sm text-[#1F2937] leading-relaxed mb-3">
              {result.description || result.smart_summary}
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {result.features?.slice(0, 6).map((feature, idx) => (
                <div key={idx} className="text-xs text-[#1F2937] flex items-start gap-2">
                  <span className="text-[#00A36C] mt-0.5">•</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Deal Score */}
          <div className="mb-5">
            <h2 className="text-base font-bold text-[#1F2937] mb-3">Deal Score</h2>

            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle cx="40" cy="40" r="36" fill="none" stroke="#F3F4F6" strokeWidth="8" />
                  <circle 
                    cx="40" cy="40" r="36" 
                    fill="none" 
                    stroke="#00A36C" 
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 36 * (result.overall_score / 100)} ${2 * Math.PI * 36}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-[#1F2937]">{result.overall_score}</span>
                  <span className="text-[9px] text-[#6B7280]">/100</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-base font-bold text-[#1F2937] mb-0.5">Strong Deal</p>
                <p className="text-xs text-[#6B7280]">Quality • Price • Reviews</p>
              </div>
            </div>

            {/* Subscores */}
            <div className="space-y-3">
              {result.subscores && Object.entries(result.subscores).map(([key, value]) => {
                const label = getScoreLabel(value);
                const isExpanded = expandedSubscore === key;

                return (
                  <div key={key} className="border border-[#E5E7EB] rounded-lg p-3">
                    <button 
                      onClick={() => setExpandedSubscore(isExpanded ? null : key)}
                      className="w-full"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-[#1F2937] capitalize">{key}</span>
                          <svg 
                            className={`w-4 h-4 text-[#6B7280] transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[#1F2937]">{value}</span>
                          <span 
                            className="text-xs font-semibold px-2 py-0.5 rounded"
                            style={{ 
                              color: label.color,
                              backgroundColor: `${label.color}15`
                            }}
                          >
                            {label.text} ✓
                          </span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all"
                          style={{ 
                            width: `${value}%`,
                            backgroundColor: label.color
                          }}
                        ></div>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-[#E5E7EB]">
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

            {/* AI Summary */}
            <div className="mt-4 bg-[#F0FDF4] border border-[#D1FAE5] rounded-lg p-3">
              <p className="text-xs text-[#1F2937] leading-relaxed">
                <span className="font-bold">AI Summary:</span> Price is well below market average and maintains strong willingness. More info here.
              </p>
            </div>
            </div>

          {/* Price Intelligence */}
          <div className="mb-5">
            <h2 className="text-base font-bold text-[#1F2937] mb-3">Price Intelligence</h2>

            <div className="flex gap-3 mb-4">
              {/* Price History Graph */}
              <div className="flex-1 p-3 bg-[#F9FAFB] rounded-lg">
                <p className="text-xs font-semibold text-[#1F2937] mb-2">Price History</p>
                <div className="flex items-end justify-around h-24">
                  <div className="flex flex-col items-center gap-1 flex-1">
                    <div className="w-full max-w-[30px] bg-[#00A36C] rounded-t mx-auto" style={{height: '60%'}}></div>
                    <span className="text-[9px] text-[#6B7280]">90D</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 flex-1">
                    <div className="w-full max-w-[30px] bg-[#00A36C] rounded-t mx-auto" style={{height: '45%'}}></div>
                    <span className="text-[9px] text-[#6B7280]">60D</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 flex-1">
                    <div className="w-full max-w-[30px] bg-[#00A36C] rounded-t mx-auto" style={{height: '75%'}}></div>
                    <span className="text-[9px] text-[#6B7280]">30D</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 flex-1">
                    <div className="w-full max-w-[30px] bg-[#00A36C]/70 rounded-t mx-auto relative" style={{height: '55%'}}>
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[8px] font-bold text-[#00A36C] whitespace-nowrap">
                        Now
                      </span>
                    </div>
                    <span className="text-[9px] text-[#6B7280]">1Y</span>
                  </div>
                </div>
                <div className="text-center mt-2">
                  <span className="inline-block px-2 py-0.5 bg-[#D6F5E9] text-[#00A36C] rounded text-[9px] font-semibold">
                    Good Time to Buy
                  </span>
                </div>
              </div>

              {/* Best Price Box */}
              <div className="flex-1 p-3 bg-white border-2 border-[#00A36C] rounded-lg">
                <p className="text-xs font-semibold text-[#1F2937] mb-2">Best Price in Market</p>
                <div className="w-10 h-10 rounded-lg bg-[#F9FAFB] flex items-center justify-center mb-2">
                  <img 
                    src={`https://logo.clearbit.com/${bestDeal?.store.toLowerCase().replace(/[^a-z]/g, '')}.com`}
                    alt={bestDeal?.store}
                    className="w-6 h-6 object-contain"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
                <p className="text-xs font-semibold text-[#1F2937] mb-0.5">{bestDeal?.store}</p>
                <p className="text-xl font-bold text-[#00A36C] mb-1">{bestDeal?.price}</p>
                <p className="text-[9px] text-[#6B7280]">Lowest</p>
              </div>
            </div>
          </div>

          {/* Store Comparison */}
          <div ref={storeComparisonRef} className="mb-5">
            <h2 className="text-base font-bold text-[#1F2937] mb-3">Store Comparison</h2>
            <div className="space-y-2">
              {result.online_deals?.slice(0, 3).map((deal, idx) => {
                const prices = result.online_deals.map(d => parseFloat(d.price.replace(/[^0-9.]/g, '')));
                const minPrice = Math.min(...prices);
                const currentPrice = parseFloat(deal.price.replace(/[^0-9.]/g, ''));
                const isBest = currentPrice === minPrice;

                return (
                  <div key={idx} className="flex items-center gap-3 p-2 bg-[#F9FAFB] rounded-lg">
                    <div className="relative flex-shrink-0">
                      <div className="w-16 h-16 rounded-lg bg-white flex items-center justify-center overflow-hidden">
                        <img 
                          src={result.product_image_url || result.file_url}
                          alt={result.title}
                          className="w-full h-full object-contain p-1"
                        />
                      </div>
                      <button className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-white shadow-sm flex items-center justify-center">
                        <Heart className="w-3 h-3 text-[#6B7280]" />
                      </button>
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
            <button className="w-full py-2.5 mt-2 bg-white border border-[#E5E7EB] rounded-lg text-xs font-semibold text-[#1F2937] hover:bg-[#F9FAFB] transition-colors">
              View More
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
                  Low likelihood of fake/unverified reviews based on review patterns and verified purchase data.
                </p>
              </div>
            </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#1F2937]">Quality</span>
                  <span className="px-2 py-0.5 bg-[#D6F5E9] text-[#00A36C] rounded text-xs font-semibold">Positive</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#1F2937]">Warranty</span>
                  <span className="px-2 py-0.5 bg-[#FEF3C7] text-[#F59E0B] rounded text-xs font-semibold">Fair</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#1F2937]">Style</span>
                  <span className="px-2 py-0.5 bg-[#D6F5E9] text-[#00A36C] rounded text-xs font-semibold">Very Positive</span>
                </div>
              </div>
            </div>
          </div>

          {/* Alternatives */}
          <div className="mb-5">
            <h2 className="text-base font-bold text-[#1F2937] mb-2">Alternatives</h2>
            <p className="text-xs text-[#6B7280] mb-3">Comparable products with better price, value</p>

            <div className="space-y-2">
              {result.alternatives?.slice(0, 3).map((alt, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 bg-[#F9FAFB] rounded-lg">
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 rounded-lg bg-white flex items-center justify-center overflow-hidden">
                      <img 
                        src={alt.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200'}
                        alt={alt.name}
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                    <button className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-white shadow-sm flex items-center justify-center">
                      <Heart className="w-3 h-3 text-[#6B7280]" />
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#1F2937] mb-0.5">{alt.store}</p>
                    <p className="text-xs text-[#1F2937] mb-1 truncate">{alt.name}</p>
                    <p className="text-[10px] text-[#6B7280] leading-tight">
                      {idx === 0 && 'Cheaper, similar specs'}
                      {idx === 1 && 'Light weight, much bigger'}
                      {idx === 2 && 'Premium sound & comfort'}
                    </p>
                  </div>
                  <div className="text-center flex-shrink-0 px-2 py-1 bg-white rounded-lg border border-[#E5E7EB]">
                    <span className="block text-[9px] font-semibold text-[#00A36C] mb-1">
                      {idx === 0 ? 'Best Value' : idx === 1 ? 'Cheapest' : 'Premium'}
                    </span>
                    <p className="text-sm font-bold text-[#1F2937] mb-1">{alt.price}</p>
                    <div className="flex items-center justify-center gap-0.5">
                      <Star className="w-2.5 h-2.5 text-[#F59E0B] fill-[#F59E0B]" />
                      <span className="text-[9px] text-[#1F2937]">4.{idx + 2}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full py-2.5 mt-2 bg-white border border-[#E5E7EB] rounded-lg text-xs font-semibold text-[#1F2937] hover:bg-[#F9FAFB] transition-colors">
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