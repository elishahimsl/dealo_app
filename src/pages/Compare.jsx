import React, { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Camera, Plus, Tag, Loader2, Sparkles, Image as ImageIcon, Search, X, Check, Trash2, ChevronRight } from "lucide-react";
import { Slider } from "@/components/ui/slider";

export default function Compare() {
  const navigate = useNavigate();
  const location = useLocation();
  const [item1, setItem1] = useState(location.state?.item1 || null);
  const [item2, setItem2] = useState(location.state?.item2 || null);
  const [analyzing, setAnalyzing] = useState(false);
  const [showUploadOptions, setShowUploadOptions] = useState(null); // null, 1, or 2
  const [deleteSlot, setDeleteSlot] = useState(null);
  const [showPreferences, setShowPreferences] = useState(false);
  const fileInput1Ref = useRef(null);
  const fileInput2Ref = useRef(null);

  const [pricePreference, setPricePreference] = useState(location.state?.preferences?.price || [50]);
  const [qualityPreference, setQualityPreference] = useState(location.state?.preferences?.quality || [50]);
  const [brandPreference, setBrandPreference] = useState(location.state?.preferences?.brand || [50]);
  const [durabilityPreference, setDurabilityPreference] = useState(location.state?.preferences?.durability || [50]);
  const [reviewsPreference, setReviewsPreference] = useState([50]);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const scrollRef = useRef(null);

  const handleFileSelect = async (file, itemNumber) => {
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this product briefly. Provide: title, price, image URL from Unsplash of the product type.`,
        file_urls: file_url,
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            price: { type: "string" },
            image_url: { type: "string" }
          }
        }
      });

      const itemData = { ...result, file_url: result.image_url || file_url };
      
      if (itemNumber === 1) setItem1(itemData);
      else setItem2(itemData);
      setShowUploadOptions(null);
    } catch (error) {
      console.error("Error processing file:", error);
    }
  };

  const handleAnalyze = async () => {
    if (!item1 || !item2) return;
    setAnalyzing(true);
    
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Compare these two products and determine which is better based on the user's preferences.
        
Product 1: ${item1.title} - ${item1.price}
Product 2: ${item2.title} - ${item2.price}

User Preferences (0-100 scale):
- Price importance: ${pricePreference[0]}
- Quality importance: ${qualityPreference[0]}
- Brand importance: ${brandPreference[0]}
- Durability importance: ${durabilityPreference[0]}

Provide a detailed comparison and recommendation.`,
        response_json_schema: {
          type: "object",
          properties: {
            winner: { type: "string", enum: ["item1", "item2"] },
            confidence: { type: "number" },
            reasoning: { type: "string" },
            price_comparison: { type: "string" },
            quality_comparison: { type: "string" },
            overall_verdict: { type: "string" }
          }
        }
      });

      navigate(createPageUrl("ComparisonResults"), {
        state: { 
          item1, 
          item2, 
          result,
          preferences: { price: pricePreference, quality: qualityPreference, brand: brandPreference, durability: durabilityPreference }
        }
      });
    } catch (error) {
      console.error("Error analyzing:", error);
    }
    
    setAnalyzing(false);
  };

  const handleDeleteItem = (slot) => {
    if (slot === 1) setItem1(null);
    else setItem2(null);
    setDeleteSlot(null);
  };

  const handleLongPress = (slot) => {
    if ((slot === 1 && item1) || (slot === 2 && item2)) {
      setDeleteSlot(slot);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex items-center justify-center">
        <h1 className="text-base font-semibold text-[#1F2937]">Compare</h1>
      </div>

      <div className="px-6 space-y-6">
        {/* Main Comparison Box */}
        <div className="bg-[#2D3748] rounded-3xl p-5 shadow-sm">
          {/* Add Products Label */}
          <h2 className="text-xs font-medium text-white mb-3">Add Products</h2>
          
          {/* Product Tiles */}
          <div className="flex gap-3 mb-6">
            {/* Item 1 Tile */}
            <div className="flex-1">
              <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], 1)} ref={fileInput1Ref} className="hidden" />
              <div
                onClick={() => !item1 && setShowUploadOptions(1)}
                onMouseDown={() => item1 && setTimeout(() => handleLongPress(1), 500)}
                onTouchStart={() => item1 && setTimeout(() => handleLongPress(1), 500)}
                className={`w-full rounded-2xl flex items-center justify-center overflow-hidden cursor-pointer ${
                  item1 ? 'bg-[#3D4856]' : 'bg-[#3D4856] border-2 border-[#4A5568]'
                }`}
                style={{ height: '140px' }}
              >
                {item1 ? (
                  <img src={item1.file_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Plus className="w-8 h-8 text-[#00A36C]" />
                )}
              </div>
              {item1 && <p className="text-xs font-semibold text-white mt-2 text-center">{item1.price}</p>}
            </div>

            {/* Item 2 Tile */}
            <div className="flex-1">
              <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], 2)} ref={fileInput2Ref} className="hidden" />
              <div
                onClick={() => !item2 && setShowUploadOptions(2)}
                onMouseDown={() => item2 && setTimeout(() => handleLongPress(2), 500)}
                onTouchStart={() => item2 && setTimeout(() => handleLongPress(2), 500)}
                className={`w-full rounded-2xl flex items-center justify-center overflow-hidden cursor-pointer ${
                  item2 ? 'bg-[#3D4856]' : 'bg-[#3D4856] border-2 border-[#4A5568]'
                }`}
                style={{ height: '140px' }}
              >
                {item2 ? (
                  <img src={item2.file_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Plus className="w-8 h-8 text-[#00A36C]" />
                )}
              </div>
              {item2 && <p className="text-xs font-semibold text-white mt-2 text-center">{item2.price}</p>}
            </div>
          </div>

          {/* Preferences Row */}
          <div className="w-full flex items-center justify-between">
            <span className="text-base font-semibold text-white">Preferences</span>
            <button 
              onClick={() => setShowPreferences(true)}
              className="w-6 h-6 rounded-full bg-[#6B7280] flex items-center justify-center hover:bg-[#4B5563] transition-colors"
            >
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Info Text */}
        <div className="px-2">
          <div className="flex items-start gap-2 mb-1">
            <svg className="w-5 h-5 text-[#1F2937] mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
            </svg>
            <h3 className="text-base font-semibold text-[#1F2937]">Add two products to compare</h3>
          </div>
          <p className="text-sm text-[#6B7280] ml-7">specs, price, reviews, and AI recommendations</p>
        </div>

        {/* Analyze Button */}
        <Button 
          onClick={handleAnalyze} 
          disabled={!item1 || !item2}
          className="w-full h-12 rounded-2xl bg-[#00A36C] hover:bg-[#007E52] text-white font-semibold disabled:opacity-50"
        >
          {analyzing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Analyzing...</> : 'Analyze'}
        </Button>
      </div>

      {/* Bottom Sheet for Add Product Options */}
      {showUploadOptions && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowUploadOptions(null)}>
          <div 
            className="bg-white rounded-t-3xl w-full pb-8 pt-4 animate-slide-up" 
            style={{ maxHeight: '80vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag Handle */}
            <div className="flex justify-center mb-4">
              <div className="w-10 h-1 bg-[#D1D5DB] rounded-full" />
            </div>

            {/* Options */}
            <div className="px-6 space-y-2">
              <button 
                onClick={() => { navigate(createPageUrl("Snap") + `?from=Compare&slot=${showUploadOptions}`); setShowUploadOptions(null); }} 
                className="w-full flex items-center justify-between py-4 hover:bg-[#F9FAFB] rounded-xl transition-colors px-4"
              >
                <div className="flex items-center gap-3">
                  <Camera className="w-5 h-5 text-[#00A36C]" />
                  <span className="text-base text-[#1F2937]">Take Photo</span>
                </div>
              </button>

              <button 
                onClick={() => { navigate(createPageUrl("SearchProducts") + `?slot=${showUploadOptions}`); setShowUploadOptions(null); }} 
                className="w-full flex items-center justify-between py-4 hover:bg-[#F9FAFB] rounded-xl transition-colors px-4"
              >
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-[#00A36C]" />
                  <span className="text-base text-[#1F2937]">Search Product</span>
                </div>
              </button>

              <button 
                onClick={() => { navigate(createPageUrl("MyCart")); setShowUploadOptions(null); }} 
                className="w-full flex items-center justify-between py-4 hover:bg-[#F9FAFB] rounded-xl transition-colors px-4"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#00A36C]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  <span className="text-base text-[#1F2937]">Choose From Saved Items</span>
                </div>
              </button>

              <button 
                onClick={() => { navigate(createPageUrl("ShopSenseTuner"), { state: { item1, item2, preferences: { price: pricePreference, quality: qualityPreference, brand: brandPreference, durability: durabilityPreference } } }); setShowUploadOptions(null); }} 
                className="w-full flex items-center justify-between py-4 hover:bg-[#F9FAFB] rounded-xl transition-colors px-4"
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-[#00A36C]" />
                  <span className="text-base text-[#1F2937]">Smart Pick</span>
                </div>
              </button>

              <button 
                onClick={() => { alert("Paste product URL (feature coming soon)"); setShowUploadOptions(null); }} 
                className="w-full flex items-center justify-between py-4 hover:bg-[#F9FAFB] rounded-xl transition-colors px-4"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#00A36C]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span className="text-base text-[#1F2937]">Import From Link</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Modal - Slide Up Sheet */}
      {showPreferences && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowPreferences(false)}>
          <div 
            className="bg-white rounded-t-3xl w-full overflow-hidden flex flex-col" 
            style={{ 
              height: '85vh',
              transform: `translateY(${dragOffset}px)`,
              transition: isDragging ? 'none' : 'transform 0.3s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag Handle */}
            <div 
              className="flex justify-center py-3 cursor-pointer"
              onTouchStart={(e) => {
                if (scrollRef.current && scrollRef.current.scrollTop === 0) {
                  setIsDragging(true);
                  const startY = e.touches[0].clientY;
                  const handleTouchMove = (moveEvent) => {
                    const currentY = moveEvent.touches[0].clientY;
                    const diff = currentY - startY;
                    if (diff > 0) {
                      setDragOffset(diff);
                    }
                  };
                  const handleTouchEnd = () => {
                    setIsDragging(false);
                    if (dragOffset > 150) {
                      setShowPreferences(false);
                    }
                    setDragOffset(0);
                    document.removeEventListener('touchmove', handleTouchMove);
                    document.removeEventListener('touchend', handleTouchEnd);
                  };
                  document.addEventListener('touchmove', handleTouchMove);
                  document.addEventListener('touchend', handleTouchEnd);
                }
              }}
            >
              <div className="w-10 h-1 bg-[#D1D5DB] rounded-full" />
            </div>

            {/* Header */}
            <div className="px-6 pb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#1F2937]">Product Priorities</h2>
              <div className="relative">
                <button 
                  onClick={() => setShowMenuDropdown(!showMenuDropdown)}
                  className="flex flex-col gap-0.5"
                >
                  <div className="w-4 h-0.5 bg-[#1F2937]" />
                  <div className="w-4 h-0.5 bg-[#1F2937]" />
                  <div className="w-4 h-0.5 bg-[#1F2937]" />
                </button>
                
                {/* Dropdown Menu */}
                {showMenuDropdown && (
                  <>
                    <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setShowMenuDropdown(false)} />
                    <div className="absolute right-0 top-8 bg-white rounded-xl shadow-lg py-2 z-50 w-48">
                      <button className="w-full px-4 py-2 text-left text-sm text-[#1F2937] hover:bg-[#F9FAFB] flex items-center gap-2">
                        <svg className="w-4 h-4 text-[#00A36C]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Save Preferences
                      </button>
                      <button className="w-full px-4 py-2 text-left text-sm text-[#1F2937] hover:bg-[#F9FAFB] flex items-center gap-2">
                        <svg className="w-4 h-4 text-[#00A36C]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Help
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-6 pb-32"
              onTouchStart={(e) => {
                const startScrollTop = e.currentTarget.scrollTop;
                const maxScroll = e.currentTarget.scrollHeight - e.currentTarget.clientHeight;

                setIsDragging(true);
                const startY = e.touches[0].clientY;
                const handleTouchMove = (moveEvent) => {
                  const currentY = moveEvent.touches[0].clientY;
                  const diff = currentY - startY;

                  // Allow drag down from top
                  if (startScrollTop === 0 && diff > 0) {
                    setDragOffset(diff);
                  }
                  // Allow drag down when at bottom (swipe-to-dismiss)
                  else if (e.currentTarget.scrollTop >= maxScroll - 5 && diff > 0) {
                    setDragOffset(diff);
                  }
                };
                const handleTouchEnd = () => {
                  setIsDragging(false);
                  if (dragOffset > 150) {
                    setShowPreferences(false);
                  }
                  setDragOffset(0);
                  document.removeEventListener('touchmove', handleTouchMove);
                  document.removeEventListener('touchend', handleTouchEnd);
                };
                document.addEventListener('touchmove', handleTouchMove);
                document.addEventListener('touchend', handleTouchEnd);
              }}
            >
              <div 
                className="rounded-2xl p-4 space-y-6 relative bg-white"
                style={{
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.06), inset 0 -2px 4px rgba(0, 0, 0, 0.05)'
                }}
              >
                {/* Brand */}
                <div>
                  <label className="text-xs font-medium text-[#6B7280] mb-3 block">Brand</label>
                  <div className="relative px-3">
                    <div className="h-2 rounded-full overflow-hidden flex">
                      <div className="flex-1 bg-[#EF4444]" />
                      <div className="flex-1 bg-[#F59E0B]" />
                      <div className="flex-1 bg-[#10B981]" />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={brandPreference[0]}
                      onChange={(e) => setBrandPreference([parseInt(e.target.value)])}
                      className="slider-custom w-full absolute top-0 left-0"
                      data-value={brandPreference[0]}
                    />
                  </div>
                  <div className="flex justify-between text-xs mt-3 px-3">
                    <span className={brandPreference[0] <= 20 ? 'text-[#1F2937] font-semibold' : 'text-[#9CA3AF]'}>Low</span>
                    {brandPreference[0] > 20 && brandPreference[0] < 80 && (
                      <span className="font-semibold text-[#1F2937]">
                        {brandPreference[0] <= 40 ? 'Below Average' : brandPreference[0] >= 60 ? 'Above Average' : 'Fair'}
                      </span>
                    )}
                    <span className={brandPreference[0] >= 80 ? 'text-[#1F2937] font-semibold' : 'text-[#9CA3AF]'}>High</span>
                  </div>
                </div>

                {/* Price */}
                <div>
                  <label className="text-xs font-medium text-[#6B7280] mb-3 block">Price</label>
                  <div className="relative px-3">
                    <div className="h-2 rounded-full overflow-hidden flex">
                      <div className="flex-1 bg-[#EF4444]" />
                      <div className="flex-1 bg-[#F59E0B]" />
                      <div className="flex-1 bg-[#10B981]" />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={pricePreference[0]}
                      onChange={(e) => setPricePreference([parseInt(e.target.value)])}
                      className="slider-custom w-full absolute top-0 left-0"
                      data-value={pricePreference[0]}
                    />
                  </div>
                  <div className="flex justify-between text-xs mt-3 px-3">
                    <span className={pricePreference[0] <= 20 ? 'text-[#1F2937] font-semibold' : 'text-[#9CA3AF]'}>Low</span>
                    {pricePreference[0] > 20 && pricePreference[0] < 80 && (
                      <span className="font-semibold text-[#1F2937]">
                        {pricePreference[0] <= 40 ? 'Below Average' : pricePreference[0] >= 60 ? 'Above Average' : 'Fair'}
                      </span>
                    )}
                    <span className={pricePreference[0] >= 80 ? 'text-[#1F2937] font-semibold' : 'text-[#9CA3AF]'}>High</span>
                  </div>
                </div>

                {/* Durability */}
                <div>
                  <label className="text-xs font-medium text-[#6B7280] mb-3 block">Durability</label>
                  <div className="relative px-3">
                    <div className="h-2 rounded-full overflow-hidden flex">
                      <div className="flex-1 bg-[#EF4444]" />
                      <div className="flex-1 bg-[#F59E0B]" />
                      <div className="flex-1 bg-[#10B981]" />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={durabilityPreference[0]}
                      onChange={(e) => setDurabilityPreference([parseInt(e.target.value)])}
                      className="slider-custom w-full absolute top-0 left-0"
                      data-value={durabilityPreference[0]}
                    />
                  </div>
                  <div className="flex justify-between text-xs mt-3 px-3">
                    <span className={durabilityPreference[0] <= 20 ? 'text-[#1F2937] font-semibold' : 'text-[#9CA3AF]'}>Low</span>
                    {durabilityPreference[0] > 20 && durabilityPreference[0] < 80 && (
                      <span className="font-semibold text-[#1F2937]">
                        {durabilityPreference[0] <= 40 ? 'Below Average' : durabilityPreference[0] >= 60 ? 'Above Average' : 'Fair'}
                      </span>
                    )}
                    <span className={durabilityPreference[0] >= 80 ? 'text-[#1F2937] font-semibold' : 'text-[#9CA3AF]'}>High</span>
                  </div>
                </div>

                {/* Reviews */}
                <div>
                  <label className="text-xs font-medium text-[#6B7280] mb-3 block">Reviews</label>
                  <div className="relative px-3">
                    <div className="h-2 rounded-full overflow-hidden flex">
                      <div className="flex-1 bg-[#EF4444]" />
                      <div className="flex-1 bg-[#F59E0B]" />
                      <div className="flex-1 bg-[#10B981]" />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={reviewsPreference[0]}
                      onChange={(e) => setReviewsPreference([parseInt(e.target.value)])}
                      className="slider-custom w-full absolute top-0 left-0"
                      data-value={reviewsPreference[0]}
                    />
                  </div>
                  <div className="flex justify-between text-xs mt-3 px-3">
                    <span className={reviewsPreference[0] <= 20 ? 'text-[#1F2937] font-semibold' : 'text-[#9CA3AF]'}>Low</span>
                    {reviewsPreference[0] > 20 && reviewsPreference[0] < 80 && (
                      <span className="font-semibold text-[#1F2937]">
                        {reviewsPreference[0] <= 40 ? 'Below Average' : reviewsPreference[0] >= 60 ? 'Above Average' : 'Fair'}
                      </span>
                    )}
                    <span className={reviewsPreference[0] >= 80 ? 'text-[#1F2937] font-semibold' : 'text-[#9CA3AF]'}>High</span>
                  </div>
                </div>

                {/* Discount */}
                <div>
                  <label className="text-xs font-medium text-[#6B7280] mb-3 block">Discount</label>
                  <div className="relative px-3">
                    <div className="h-2 rounded-full overflow-hidden flex">
                      <div className="flex-1 bg-[#EF4444]" />
                      <div className="flex-1 bg-[#F59E0B]" />
                      <div className="flex-1 bg-[#10B981]" />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={qualityPreference[0]}
                      onChange={(e) => setQualityPreference([parseInt(e.target.value)])}
                      className="slider-custom w-full absolute top-0 left-0"
                      data-value={qualityPreference[0]}
                    />
                  </div>
                  <div className="flex justify-between text-xs mt-3 px-3">
                    <span className={qualityPreference[0] <= 20 ? 'text-[#1F2937] font-semibold' : 'text-[#9CA3AF]'}>Low</span>
                    {qualityPreference[0] > 20 && qualityPreference[0] < 80 && (
                      <span className="font-semibold text-[#1F2937]">
                        {qualityPreference[0] <= 40 ? 'Below Average' : qualityPreference[0] >= 60 ? 'Above Average' : 'Fair'}
                      </span>
                    )}
                    <span className={qualityPreference[0] >= 80 ? 'text-[#1F2937] font-semibold' : 'text-[#9CA3AF]'}>High</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                  <Button 
                  onClick={() => setShowPreferences(false)}
                  className="w-full h-12 rounded-full bg-[#00A36C] hover:bg-[#007E52] text-white font-semibold"
                >
                  Analyze
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        
        /* Custom slider styling */
        .slider-custom {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          outline: none;
          height: 8px;
          cursor: pointer;
          padding: 0 12px;
        }
        
        .slider-custom::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          margin-top: -5px;
        }
        
        .slider-custom::-moz-range-thumb {
          width: 18px;
          height: 18px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider-custom[data-value="0"]::-webkit-slider-thumb,
        .slider-custom[data-value="1"]::-webkit-slider-thumb,
        .slider-custom[data-value="2"]::-webkit-slider-thumb,
        .slider-custom[data-value="3"]::-webkit-slider-thumb,
        .slider-custom[data-value="4"]::-webkit-slider-thumb,
        .slider-custom[data-value="5"]::-webkit-slider-thumb,
        .slider-custom[data-value="6"]::-webkit-slider-thumb,
        .slider-custom[data-value="7"]::-webkit-slider-thumb,
        .slider-custom[data-value="8"]::-webkit-slider-thumb,
        .slider-custom[data-value="9"]::-webkit-slider-thumb,
        .slider-custom[data-value="10"]::-webkit-slider-thumb,
        .slider-custom[data-value="11"]::-webkit-slider-thumb,
        .slider-custom[data-value="12"]::-webkit-slider-thumb,
        .slider-custom[data-value="13"]::-webkit-slider-thumb,
        .slider-custom[data-value="14"]::-webkit-slider-thumb,
        .slider-custom[data-value="15"]::-webkit-slider-thumb,
        .slider-custom[data-value="16"]::-webkit-slider-thumb,
        .slider-custom[data-value="17"]::-webkit-slider-thumb,
        .slider-custom[data-value="18"]::-webkit-slider-thumb,
        .slider-custom[data-value="19"]::-webkit-slider-thumb,
        .slider-custom[data-value="20"]::-webkit-slider-thumb,
        .slider-custom[data-value="21"]::-webkit-slider-thumb,
        .slider-custom[data-value="22"]::-webkit-slider-thumb,
        .slider-custom[data-value="23"]::-webkit-slider-thumb,
        .slider-custom[data-value="24"]::-webkit-slider-thumb,
        .slider-custom[data-value="25"]::-webkit-slider-thumb,
        .slider-custom[data-value="26"]::-webkit-slider-thumb,
        .slider-custom[data-value="27"]::-webkit-slider-thumb,
        .slider-custom[data-value="28"]::-webkit-slider-thumb,
        .slider-custom[data-value="29"]::-webkit-slider-thumb,
        .slider-custom[data-value="30"]::-webkit-slider-thumb,
        .slider-custom[data-value="31"]::-webkit-slider-thumb,
        .slider-custom[data-value="32"]::-webkit-slider-thumb {
          border: 4px solid #EF4444;
        }
        
        .slider-custom[data-value="33"]::-webkit-slider-thumb,
        .slider-custom[data-value="34"]::-webkit-slider-thumb,
        .slider-custom[data-value="35"]::-webkit-slider-thumb,
        .slider-custom[data-value="36"]::-webkit-slider-thumb,
        .slider-custom[data-value="37"]::-webkit-slider-thumb,
        .slider-custom[data-value="38"]::-webkit-slider-thumb,
        .slider-custom[data-value="39"]::-webkit-slider-thumb,
        .slider-custom[data-value="40"]::-webkit-slider-thumb,
        .slider-custom[data-value="41"]::-webkit-slider-thumb,
        .slider-custom[data-value="42"]::-webkit-slider-thumb,
        .slider-custom[data-value="43"]::-webkit-slider-thumb,
        .slider-custom[data-value="44"]::-webkit-slider-thumb,
        .slider-custom[data-value="45"]::-webkit-slider-thumb,
        .slider-custom[data-value="46"]::-webkit-slider-thumb,
        .slider-custom[data-value="47"]::-webkit-slider-thumb,
        .slider-custom[data-value="48"]::-webkit-slider-thumb,
        .slider-custom[data-value="49"]::-webkit-slider-thumb,
        .slider-custom[data-value="50"]::-webkit-slider-thumb,
        .slider-custom[data-value="51"]::-webkit-slider-thumb,
        .slider-custom[data-value="52"]::-webkit-slider-thumb,
        .slider-custom[data-value="53"]::-webkit-slider-thumb,
        .slider-custom[data-value="54"]::-webkit-slider-thumb,
        .slider-custom[data-value="55"]::-webkit-slider-thumb,
        .slider-custom[data-value="56"]::-webkit-slider-thumb,
        .slider-custom[data-value="57"]::-webkit-slider-thumb,
        .slider-custom[data-value="58"]::-webkit-slider-thumb,
        .slider-custom[data-value="59"]::-webkit-slider-thumb,
        .slider-custom[data-value="60"]::-webkit-slider-thumb,
        .slider-custom[data-value="61"]::-webkit-slider-thumb,
        .slider-custom[data-value="62"]::-webkit-slider-thumb,
        .slider-custom[data-value="63"]::-webkit-slider-thumb,
        .slider-custom[data-value="64"]::-webkit-slider-thumb,
        .slider-custom[data-value="65"]::-webkit-slider-thumb {
          border: 4px solid #F59E0B;
        }
        
        .slider-custom[data-value="66"]::-webkit-slider-thumb,
        .slider-custom[data-value="67"]::-webkit-slider-thumb,
        .slider-custom[data-value="68"]::-webkit-slider-thumb,
        .slider-custom[data-value="69"]::-webkit-slider-thumb,
        .slider-custom[data-value="70"]::-webkit-slider-thumb,
        .slider-custom[data-value="71"]::-webkit-slider-thumb,
        .slider-custom[data-value="72"]::-webkit-slider-thumb,
        .slider-custom[data-value="73"]::-webkit-slider-thumb,
        .slider-custom[data-value="74"]::-webkit-slider-thumb,
        .slider-custom[data-value="75"]::-webkit-slider-thumb,
        .slider-custom[data-value="76"]::-webkit-slider-thumb,
        .slider-custom[data-value="77"]::-webkit-slider-thumb,
        .slider-custom[data-value="78"]::-webkit-slider-thumb,
        .slider-custom[data-value="79"]::-webkit-slider-thumb,
        .slider-custom[data-value="80"]::-webkit-slider-thumb,
        .slider-custom[data-value="81"]::-webkit-slider-thumb,
        .slider-custom[data-value="82"]::-webkit-slider-thumb,
        .slider-custom[data-value="83"]::-webkit-slider-thumb,
        .slider-custom[data-value="84"]::-webkit-slider-thumb,
        .slider-custom[data-value="85"]::-webkit-slider-thumb,
        .slider-custom[data-value="86"]::-webkit-slider-thumb,
        .slider-custom[data-value="87"]::-webkit-slider-thumb,
        .slider-custom[data-value="88"]::-webkit-slider-thumb,
        .slider-custom[data-value="89"]::-webkit-slider-thumb,
        .slider-custom[data-value="90"]::-webkit-slider-thumb,
        .slider-custom[data-value="91"]::-webkit-slider-thumb,
        .slider-custom[data-value="92"]::-webkit-slider-thumb,
        .slider-custom[data-value="93"]::-webkit-slider-thumb,
        .slider-custom[data-value="94"]::-webkit-slider-thumb,
        .slider-custom[data-value="95"]::-webkit-slider-thumb,
        .slider-custom[data-value="96"]::-webkit-slider-thumb,
        .slider-custom[data-value="97"]::-webkit-slider-thumb,
        .slider-custom[data-value="98"]::-webkit-slider-thumb,
        .slider-custom[data-value="99"]::-webkit-slider-thumb,
        .slider-custom[data-value="100"]::-webkit-slider-thumb {
          border: 4px solid #10B981;
        }
      `}</style>

      {/* Delete Slot Modal */}
      {deleteSlot && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setDeleteSlot(null)}>
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <div className="w-32 h-32 rounded-2xl overflow-hidden bg-[#E5E7EB] mb-3 mx-auto" style={{ transform: deleteSlot === 1 ? 'perspective(800px) rotateY(8deg) rotateZ(2deg)' : 'perspective(800px) rotateY(-8deg) rotateZ(-2deg)' }}>
              <img src={deleteSlot === 1 ? item1?.file_url : item2?.file_url} alt="" className="w-full h-full object-cover" />
            </div>
            <button onClick={() => handleDeleteItem(deleteSlot)} className="w-16 mx-auto bg-red-500 text-white py-1.5 rounded-lg text-xs font-semibold hover:bg-red-600 transition-colors flex items-center justify-center">
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}