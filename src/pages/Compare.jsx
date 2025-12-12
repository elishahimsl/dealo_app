import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Search, X, Folder, ChevronRight, Loader2 } from "lucide-react";

export default function Compare() {
  const navigate = useNavigate();
  const [item1, setItem1] = useState(null);
  const [item2, setItem2] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  const [pricePreference, setPricePreference] = useState([50]);
  const [qualityPreference, setQualityPreference] = useState([50]);
  const [brandPreference, setBrandPreference] = useState([50]);
  const [durabilityPreference, setDurabilityPreference] = useState([50]);
  const [reviewsPreference, setReviewsPreference] = useState([50]);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);

  const getSliderLabel = (value) => {
    if (value <= 15) return { text: 'Low', position: 'low' };
    if (value <= 35) return { text: 'Below Average', position: 'middle' };
    if (value <= 65) return { text: 'Fair', position: 'middle' };
    if (value <= 85) return { text: 'Above Average', position: 'middle' };
    return { text: 'High', position: 'high' };
  };

  const getSliderColor = (value) => {
    if (value <= 33) return '#EF4444';
    if (value <= 66) return '#F59E0B';
    return '#10B981';
  };

  // Fetch saved captures for search
  const { data: savedProducts = [] } = useQuery({
    queryKey: ['captures'],
    queryFn: () => base44.entities.Capture.list(),
  });

  // Filter products based on search
  const filteredProducts = searchQuery.trim() 
    ? savedProducts.filter(p => 
        p.title?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const trendingComparisons = [
    { 
      product1: { name: "iPhone 16", image: "https://images.unsplash.com/photo-1696446702592-006b59370cea?w=200" },
      product2: { name: "Samsung S24", image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=200" }
    },
    { 
      product1: { name: "HydroFlask", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=200" },
      product2: { name: "Stanley", image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=200" }
    },
    { 
      product1: { name: "AirPods Pro", image: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=200" },
      product2: { name: "Sony WF-1000XM5", image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200" }
    }
  ];

  const handleSelectProduct = (product, slot) => {
    const itemData = {
      title: product?.title || "Unknown Product",
      price: product?.ai_summary || "Unknown",
      brand: product?.keywords?.[0] || "Unknown Brand",
      file_url: product?.file_url || ""
    };
    
    if (slot === 1) setItem1(itemData);
    else setItem2(itemData);
    
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const handleRemoveProduct = (slot) => {
    if (slot === 1) setItem1(null);
    else setItem2(null);
  };

  const handleAnalyze = async () => {
    if (!item1 || !item2) return;
    setAnalyzing(true);
    
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Compare these two products and determine which is better based on the user's weighted preferences.

Product 1: ${item1?.title || 'Unknown'} - ${item1?.price || '$0'}
Product 2: ${item2?.title || 'Unknown'} - ${item2?.price || '$0'}

User Preferences (0-100 scale, higher = more important):
Brand (${brandPreference[0]}/100): ${brandPreference[0] > 70 ? 'Heavily prioritize' : brandPreference[0] > 40 ? 'Consider' : 'Ignore'} well-known and trusted brands.
Price (${pricePreference[0]}/100): ${pricePreference[0] > 70 ? 'Heavily favor' : pricePreference[0] > 40 ? 'Consider' : 'Ignore'} the lowest price.
Durability (${durabilityPreference[0]}/100): ${durabilityPreference[0] > 70 ? 'Heavily prioritize' : durabilityPreference[0] > 40 ? 'Consider' : 'Ignore'} build quality and product lifespan.
Reviews (${reviewsPreference[0]}/100): ${reviewsPreference[0] > 70 ? 'Heavily prioritize' : reviewsPreference[0] > 40 ? 'Consider' : 'Ignore'} customer ratings and satisfaction.
Discount (${qualityPreference[0]}/100): ${qualityPreference[0] > 70 ? 'Heavily prioritize' : qualityPreference[0] > 40 ? 'Consider' : 'Ignore'} current savings and price drops.

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

      if (result) {
        navigate(createPageUrl("ComparisonResults"), {
          state: { 
            item1, 
            item2, 
            result,
            preferences: { price: pricePreference, quality: qualityPreference, brand: brandPreference, durability: durabilityPreference }
          }
        });
      }
    } catch (error) {
      console.error("Error analyzing:", error);
    }
    
    setAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="px-6 pt-6 pb-3 text-center relative">
        <h1 className="text-lg font-bold text-[#1F2937] mb-1">Compare</h1>
        <p className="text-xs text-[#6B7280] mb-3">Find the best product for your needs</p>
        
        {/* Preferences Icon - Top Right */}
        <button 
          onClick={() => setShowPreferences(true)}
          className="absolute top-6 right-4 w-6 h-6 flex items-center justify-center"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" transform="rotate(20 17.5 17.5)" />
          </svg>
        </button>
        
        {/* Search Bar */}
        <div className="relative">
          <button
            onClick={() => navigate(createPageUrl("CompareSearch"))}
            className="w-full bg-[#F3F4F6] rounded-full px-4 py-2 flex items-center gap-3"
          >
            <Search className="w-5 h-5 text-[#9CA3AF]" />
            <span className="flex-1 text-left text-sm text-[#9CA3AF]">Search a product to compare...</span>
          </button>

        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Trending Comparisons */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-[#1F2937]">Trending Comparisons</h2>
            <button className="text-xs font-semibold text-[#00A36C]">View All</button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {trendingComparisons.map((comp, idx) => (
              <button 
                key={idx} 
                onClick={() => navigate(createPageUrl("ComparisonResults"), {
                  state: {
                    item1: { title: comp.product1.name, file_url: comp.product1.image, price: '$999', brand: 'Brand' },
                    item2: { title: comp.product2.name, file_url: comp.product2.image, price: '$899', brand: 'Brand' },
                    result: { winner: 'item1', confidence: 85, reasoning: 'Based on overall value and performance' },
                    preferences: { price: pricePreference, quality: qualityPreference, brand: brandPreference, durability: durabilityPreference }
                  }
                })}
                className="flex-shrink-0 bg-white border border-[#E5E7EB] rounded-2xl p-3 shadow-md hover:shadow-lg transition-shadow" 
                style={{ minWidth: '200px' }}
              >
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-20 h-24 rounded-xl overflow-hidden bg-[#F3F4F6] mb-1">
                      <img src={comp.product1.image} alt={comp.product1.name} className="w-full h-full object-cover" />
                    </div>
                    <p className="text-[10px] font-semibold text-[#1F2937] text-center line-clamp-2">{comp.product1.name}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#F3F4F6] flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-bold text-[#6B7280]">VS</span>
                  </div>
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-20 h-24 rounded-xl overflow-hidden bg-[#F3F4F6] mb-1">
                      <img src={comp.product2.image} alt={comp.product2.name} className="w-full h-full object-cover" />
                    </div>
                    <p className="text-[10px] font-semibold text-[#1F2937] text-center line-clamp-2">{comp.product2.name}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Saved Comparisons Tile */}
        <div>
          <h2 className="text-sm font-bold text-[#1F2937] mb-3">Saved Comparisons</h2>
          <button 
            onClick={() => navigate(createPageUrl("SavedComparisons"))}
            className="w-full bg-white border border-[#E5E7EB] rounded-2xl p-4 flex items-center gap-4 hover:bg-[#F9FAFB] transition-colors shadow-sm"
          >
            <div className="w-12 h-12 rounded-xl bg-[#00A36C]/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-[#00A36C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="2" fill="currentColor"/>
              </svg>
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-bold text-[#1F2937] text-sm mb-0.5">Saved Comparisons</h3>
              <p className="text-xs text-[#6B7280]">View your saved matchups</p>
            </div>
            <ChevronRight className="w-5 h-5 text-[#6B7280]" />
          </button>
        </div>

        {/* Add Products Section */}
        <div className="space-y-3">
          {/* Product 1 */}
          {item1 ? (
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#F3F4F6] flex-shrink-0">
                <img src={item1.file_url} alt={item1.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-[#1F2937] text-sm line-clamp-2 mb-0.5">{item1.title}</h3>
                <p className="text-xs text-[#6B7280]">{item1.brand}</p>
              </div>
              <button onClick={() => handleRemoveProduct(1)} className="flex-shrink-0">
                <X className="w-5 h-5 text-[#6B7280]" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => navigate(createPageUrl("Snap") + "?from=Compare&slot=1")}
              className="w-full border border-[#E5E7EB] rounded-xl p-3 flex items-center gap-3 hover:bg-[#F9FAFB] transition-colors"
            >
              <div className="text-[#00A36C] text-4xl font-light leading-none flex items-center">+</div>
              <span className="text-sm font-medium text-[#1F2937]">Add first product</span>
            </button>
          )}

          {/* Product 2 */}
          {item2 ? (
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#F3F4F6] flex-shrink-0">
                <img src={item2.file_url} alt={item2.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-[#1F2937] text-sm line-clamp-2 mb-0.5">{item2.title}</h3>
                <p className="text-xs text-[#6B7280]">{item2.brand}</p>
              </div>
              <button onClick={() => handleRemoveProduct(2)} className="flex-shrink-0">
                <X className="w-5 h-5 text-[#6B7280]" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => navigate(createPageUrl("Snap") + "?from=Compare&slot=2")}
              className="w-full border border-[#E5E7EB] rounded-xl p-3 flex items-center gap-3 hover:bg-[#F9FAFB] transition-colors"
            >
              <div className="text-[#00A36C] text-4xl font-light leading-none flex items-center">+</div>
              <span className="text-sm font-medium text-[#1F2937]">Add second product</span>
            </button>
          )}

          {/* Analyze Button */}
          <Button 
            onClick={handleAnalyze} 
            disabled={!item1 || !item2 || analyzing}
            className="w-full h-10 rounded-2xl bg-[#00A36C] hover:bg-[#007E52] text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze'
            )}
          </Button>
        </div>
      </div>

      {/* Preferences Bottom Sheet */}
      {showPreferences && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowPreferences(false)}>
          <div 
            className="bg-white rounded-t-3xl w-full overflow-hidden" 
            style={{ height: '85vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center py-3">
              <div className="w-10 h-1 bg-[#D1D5DB] rounded-full" />
            </div>

            <div className="px-6 pb-3 flex items-center justify-center relative">
              <h2 className="text-sm font-semibold text-[#1F2937]">Preferences</h2>
              
              {/* Menu Icon - Top Right */}
              <div className="absolute right-3">
                <button 
                  onClick={() => setShowMenuDropdown(!showMenuDropdown)}
                  className="flex flex-col gap-0.5 p-1"
                >
                  <div className="w-3.5 h-0.5 bg-[#1F2937]" />
                  <div className="w-3.5 h-0.5 bg-[#1F2937]" />
                  <div className="w-3.5 h-0.5 bg-[#1F2937]" />
                </button>
                
                {/* Dropdown Menu */}
                {showMenuDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowMenuDropdown(false)} />
                    <div className="absolute right-0 top-8 bg-white rounded-xl shadow-lg py-2 z-50 w-48">
                      <button className="w-full px-4 py-2 text-left text-sm text-[#1F2937] hover:bg-[#F9FAFB]">
                        Save Preferences
                      </button>
                      <button className="w-full px-4 py-2 text-left text-sm text-[#1F2937] hover:bg-[#F9FAFB]">
                        Help
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="overflow-y-auto px-6 pb-6" style={{ height: 'calc(85vh - 120px)' }}>
              <div className="space-y-4">
                {/* Brand */}
                <div>
                  <label className="text-xs font-semibold text-[#1F2937] mb-1 block">Brand</label>
                  <p className="text-[10px] text-[#6B7280] mb-2">Prioritize well-known and trusted brands</p>
                  <div className="relative px-3">
                    <div className="h-1.5 rounded-full overflow-hidden flex">
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
                      style={{ '--slider-color': getSliderColor(brandPreference[0]) }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] mt-1.5 px-3">
                    <span className={getSliderLabel(brandPreference[0]).position === 'low' ? 'text-[#1F2937] font-semibold' : 'text-[#6B7280]'}>Low</span>
                    {getSliderLabel(brandPreference[0]).position === 'middle' && (
                      <span className="text-[#1F2937] font-medium">{getSliderLabel(brandPreference[0]).text}</span>
                    )}
                    <span className={getSliderLabel(brandPreference[0]).position === 'high' ? 'text-[#1F2937] font-semibold' : 'text-[#6B7280]'}>High</span>
                  </div>
                </div>

                {/* Price */}
                <div>
                  <label className="text-xs font-semibold text-[#1F2937] mb-1 block">Price</label>
                  <p className="text-[10px] text-[#6B7280] mb-2">Prioritize the lowest price</p>
                  <div className="relative px-3">
                    <div className="h-1.5 rounded-full overflow-hidden flex">
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
                      style={{ '--slider-color': getSliderColor(pricePreference[0]) }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] mt-1.5 px-3">
                    <span className={getSliderLabel(pricePreference[0]).position === 'low' ? 'text-[#1F2937] font-semibold' : 'text-[#6B7280]'}>Low</span>
                    {getSliderLabel(pricePreference[0]).position === 'middle' && (
                      <span className="text-[#1F2937] font-medium">{getSliderLabel(pricePreference[0]).text}</span>
                    )}
                    <span className={getSliderLabel(pricePreference[0]).position === 'high' ? 'text-[#1F2937] font-semibold' : 'text-[#6B7280]'}>High</span>
                  </div>
                </div>

                {/* Durability */}
                <div>
                  <label className="text-xs font-semibold text-[#1F2937] mb-1 block">Durability</label>
                  <p className="text-[10px] text-[#6B7280] mb-2">Prioritize build quality and product lifespan</p>
                  <div className="relative px-3">
                    <div className="h-1.5 rounded-full overflow-hidden flex">
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
                      style={{ '--slider-color': getSliderColor(durabilityPreference[0]) }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] mt-1.5 px-3">
                    <span className={getSliderLabel(durabilityPreference[0]).position === 'low' ? 'text-[#1F2937] font-semibold' : 'text-[#6B7280]'}>Low</span>
                    {getSliderLabel(durabilityPreference[0]).position === 'middle' && (
                      <span className="text-[#1F2937] font-medium">{getSliderLabel(durabilityPreference[0]).text}</span>
                    )}
                    <span className={getSliderLabel(durabilityPreference[0]).position === 'high' ? 'text-[#1F2937] font-semibold' : 'text-[#6B7280]'}>High</span>
                  </div>
                </div>

                {/* Reviews */}
                <div>
                  <label className="text-xs font-semibold text-[#1F2937] mb-1 block">Reviews</label>
                  <p className="text-[10px] text-[#6B7280] mb-2">Prioritize higher customer ratings</p>
                  <div className="relative px-3">
                    <div className="h-1.5 rounded-full overflow-hidden flex">
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
                      style={{ '--slider-color': getSliderColor(reviewsPreference[0]) }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] mt-1.5 px-3">
                    <span className={getSliderLabel(reviewsPreference[0]).position === 'low' ? 'text-[#1F2937] font-semibold' : 'text-[#6B7280]'}>Low</span>
                    {getSliderLabel(reviewsPreference[0]).position === 'middle' && (
                      <span className="text-[#1F2937] font-medium">{getSliderLabel(reviewsPreference[0]).text}</span>
                    )}
                    <span className={getSliderLabel(reviewsPreference[0]).position === 'high' ? 'text-[#1F2937] font-semibold' : 'text-[#6B7280]'}>High</span>
                  </div>
                </div>

                {/* Discount */}
                <div>
                  <label className="text-xs font-semibold text-[#1F2937] mb-1 block">Discount</label>
                  <p className="text-[10px] text-[#6B7280] mb-2">Prioritize the biggest savings</p>
                  <div className="relative px-3">
                    <div className="h-1.5 rounded-full overflow-hidden flex">
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
                      style={{ '--slider-color': getSliderColor(qualityPreference[0]) }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] mt-1.5 px-3">
                    <span className={getSliderLabel(qualityPreference[0]).position === 'low' ? 'text-[#1F2937] font-semibold' : 'text-[#6B7280]'}>Low</span>
                    {getSliderLabel(qualityPreference[0]).position === 'middle' && (
                      <span className="text-[#1F2937] font-medium">{getSliderLabel(qualityPreference[0]).text}</span>
                    )}
                    <span className={getSliderLabel(qualityPreference[0]).position === 'high' ? 'text-[#1F2937] font-semibold' : 'text-[#6B7280]'}>High</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 pb-6 pt-2 border-t border-[#E5E7EB]">
              <Button 
                onClick={() => setShowPreferences(false)}
                className="w-full h-12 rounded-2xl bg-[#00A36C] hover:bg-[#007E52] text-white font-semibold"
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        
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
          width: 14px;
          height: 14px;
          background: white;
          border: 4px solid var(--slider-color, #00A36C);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          margin-top: -5px;
        }
        
        .slider-custom::-moz-range-thumb {
          width: 14px;
          height: 14px;
          background: white;
          border: 4px solid var(--slider-color, #00A36C);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}