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
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectingSlot, setSelectingSlot] = useState(false);

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
        prompt: `Compare these two products and determine which is better based on the user's weighted preferences.

Product 1: ${item1.title} - ${item1.price}
Product 2: ${item2.title} - ${item2.price}

User Preferences (0-100 scale, higher = more important):

Brand (${brandPreference[0]}/100): ${brandPreference[0] > 70 ? 'Heavily prioritize' : brandPreference[0] > 40 ? 'Consider' : 'Ignore'} well-known and trusted brands. ${brandPreference[0] > 70 ? 'Favor reputable brands even if more expensive.' : ''}

Price (${pricePreference[0]}/100): ${pricePreference[0] > 70 ? 'Heavily favor' : pricePreference[0] > 40 ? 'Consider' : 'Ignore'} the lowest price. ${pricePreference[0] > 70 ? 'Cost is the primary factor.' : ''}

Durability (${durabilityPreference[0]}/100): ${durabilityPreference[0] > 70 ? 'Heavily prioritize' : durabilityPreference[0] > 40 ? 'Consider' : 'Ignore'} build quality and product lifespan. ${durabilityPreference[0] > 70 ? 'Long-term quality matters most.' : ''}

Reviews (${reviewsPreference[0]}/100): ${reviewsPreference[0] > 70 ? 'Heavily prioritize' : reviewsPreference[0] > 40 ? 'Consider' : 'Ignore'} customer ratings and satisfaction. ${reviewsPreference[0] > 70 ? 'Customer feedback is critical.' : ''}

Discount (${qualityPreference[0]}/100): ${qualityPreference[0] > 70 ? 'Heavily prioritize' : qualityPreference[0] > 40 ? 'Consider' : 'Ignore'} current savings and price drops. ${qualityPreference[0] > 70 ? 'Biggest deal wins.' : ''}

Analyze both products considering these weighted priorities and determine the winner.`,
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

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setSearchResults([]);
    
    try {
      const aiResponse = await base44.integrations.Core.InvokeLLM({
        prompt: `Search for products matching: "${searchQuery}". Find 5 real products from online stores.
        For each product provide:
        - Product name/title
        - Current price (format: $XX.XX)
        - Store/brand name
        - Product image URL (real product images from retailers)`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            products: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  price: { type: "string" },
                  store: { type: "string" },
                  image_url: { type: "string" }
                }
              }
            }
          }
        }
      });
      
      if (aiResponse && Array.isArray(aiResponse.products)) {
        setSearchResults(aiResponse.products);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error searching:", error);
      setSearchResults([]);
    }
    
    setIsSearching(false);
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setSelectingSlot(true);
  };

  const handleAddToSlot = (slot) => {
    if (!selectedProduct) return;
    
    const itemData = {
      title: selectedProduct.title,
      price: selectedProduct.price,
      file_url: selectedProduct.image_url
    };
    
    if (slot === 1) setItem1(itemData);
    else setItem2(itemData);
    
    setSelectedProduct(null);
    setSelectingSlot(false);
    setSearchResults([]);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="px-6 pt-6 pb-2 flex items-center justify-center">
        <h1 className="text-base font-semibold text-[#1F2937]">Compare</h1>
      </div>
      
      {/* Search Bar */}
      <div className="px-4 pb-4">
        <div className="bg-[#F3F4F6] rounded-full px-4 py-2 flex items-center gap-2">
          <Search className="w-4 h-4 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search for a product to compare"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 bg-transparent outline-none text-sm text-[#1F2937] placeholder:text-[#9CA3AF]"
          />
          {searchQuery && (
            <button onClick={() => { setSearchQuery(""); setSearchResults([]); }}>
              <X className="w-4 h-4 text-[#9CA3AF]" />
            </button>
          )}
        </div>
        
        {/* Search Results */}
        {isSearching && (
          <div className="mt-2 text-center py-4">
            <Loader2 className="w-5 h-5 animate-spin mx-auto text-[#00A36C]" />
          </div>
        )}
        
        {Array.isArray(searchResults) && searchResults.length > 0 && (
          <div className="mt-2 bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
            {searchResults.map((product, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectProduct(product)}
                className="w-full flex items-center gap-3 p-3 hover:bg-[#F9FAFB] transition-colors border-b border-[#E5E7EB] last:border-b-0"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#F3F4F6] flex-shrink-0">
                  <img src={product?.image_url || ''} alt={product?.title || ''} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-[#1F2937] text-sm line-clamp-1">{product?.title || 'Unknown'}</h3>
                  <p className="text-xs text-[#6B7280]">{product?.store || 'Unknown Store'}</p>
                  <p className="text-sm font-bold text-[#00A36C] mt-0.5">{product?.price || '$0.00'}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="px-6 space-y-6">
        {/* Main Comparison Box */}
        <div className="bg-[#2D3748] rounded-3xl p-5 shadow-sm">
          {/* Add Products Label */}
          <h2 className="text-xs font-medium text-white mb-3">Add Products</h2>
          
          {/* Product Tiles */}
          <div className="flex gap-3 mb-6">
            {/* Item 1 Tile */}
            <div className="flex-1 relative">
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
              
              {/* Options popup for Item 1 */}
              {showUploadOptions === 1 && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowUploadOptions(null)} />
                  <div className="absolute left-full ml-2 top-0 bg-white rounded-xl shadow-lg py-2 z-50 whitespace-nowrap">
                    <button 
                      onClick={() => { navigate(createPageUrl("Snap") + `?from=Compare&slot=1`); setShowUploadOptions(null); }} 
                      className="w-full px-3 py-2 hover:bg-[#F9FAFB] flex items-center gap-2 text-left"
                    >
                      <Camera className="w-4 h-4 text-[#00A36C]" />
                      <span className="text-sm text-[#1F2937]">Take</span>
                    </button>
                    <button 
                      onClick={() => { fileInput1Ref.current?.click(); setShowUploadOptions(null); }} 
                      className="w-full px-3 py-2 hover:bg-[#F9FAFB] flex items-center gap-2 text-left"
                    >
                      <ImageIcon className="w-4 h-4 text-[#00A36C]" />
                      <span className="text-sm text-[#1F2937]">Upload</span>
                    </button>
                    <button 
                      onClick={() => { navigate(createPageUrl("MyCart")); setShowUploadOptions(null); }} 
                      className="w-full px-3 py-2 hover:bg-[#F9FAFB] flex items-center gap-2 text-left"
                    >
                      <svg className="w-4 h-4 text-[#00A36C]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                      <span className="text-sm text-[#1F2937]">Saved</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Item 2 Tile */}
            <div className="flex-1 relative">
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
              
              {/* Options popup for Item 2 */}
              {showUploadOptions === 2 && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowUploadOptions(null)} />
                  <div className="absolute right-full mr-2 top-0 bg-white rounded-xl shadow-lg py-2 z-50 whitespace-nowrap">
                    <button 
                      onClick={() => { navigate(createPageUrl("Snap") + `?from=Compare&slot=2`); setShowUploadOptions(null); }} 
                      className="w-full px-3 py-2 hover:bg-[#F9FAFB] flex items-center gap-2 text-left"
                    >
                      <Camera className="w-4 h-4 text-[#00A36C]" />
                      <span className="text-sm text-[#1F2937]">Take</span>
                    </button>
                    <button 
                      onClick={() => { fileInput2Ref.current?.click(); setShowUploadOptions(null); }} 
                      className="w-full px-3 py-2 hover:bg-[#F9FAFB] flex items-center gap-2 text-left"
                    >
                      <ImageIcon className="w-4 h-4 text-[#00A36C]" />
                      <span className="text-sm text-[#1F2937]">Upload</span>
                    </button>
                    <button 
                      onClick={() => { navigate(createPageUrl("MyCart")); setShowUploadOptions(null); }} 
                      className="w-full px-3 py-2 hover:bg-[#F9FAFB] flex items-center gap-2 text-left"
                    >
                      <svg className="w-4 h-4 text-[#00A36C]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                      <span className="text-sm text-[#1F2937]">Saved</span>
                    </button>
                  </div>
                </>
              )}
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
                  <label className="text-xs font-medium text-[#6B7280] mb-1 block">Brand</label>
                  <p className="text-[10px] text-[#9CA3AF] mb-3">Prioritize well-known and trusted brands</p>
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
                  <label className="text-xs font-medium text-[#6B7280] mb-1 block">Price</label>
                  <p className="text-[10px] text-[#9CA3AF] mb-3">Prioritize the lowest price</p>
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
                  <label className="text-xs font-medium text-[#6B7280] mb-1 block">Durability</label>
                  <p className="text-[10px] text-[#9CA3AF] mb-3">Prioritize build quality and product lifespan</p>
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
                  <label className="text-xs font-medium text-[#6B7280] mb-1 block">Reviews</label>
                  <p className="text-[10px] text-[#9CA3AF] mb-3">Prioritize higher customer ratings</p>
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
                  <label className="text-xs font-medium text-[#6B7280] mb-1 block">Discount</label>
                  <p className="text-[10px] text-[#9CA3AF] mb-3">Prioritize the biggest savings and price drops</p>
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

      {/* Select Slot Modal */}
      {selectingSlot && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setSelectingSlot(false)}>
          <div className="bg-white rounded-2xl p-6 mx-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-[#1F2937] mb-4 text-center">Add to which slot?</h3>
            <div className="flex gap-3">
              <button
                onClick={() => handleAddToSlot(1)}
                className="flex-1 py-3 rounded-xl bg-[#00A36C] text-white font-semibold hover:bg-[#007E52]"
              >
                Slot 1
              </button>
              <button
                onClick={() => handleAddToSlot(2)}
                className="flex-1 py-3 rounded-xl bg-[#00A36C] text-white font-semibold hover:bg-[#007E52]"
              >
                Slot 2
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}