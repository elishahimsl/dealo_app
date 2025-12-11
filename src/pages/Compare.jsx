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
          className="absolute top-6 right-6 w-7 h-7 flex items-center justify-center"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" transform="rotate(20 17.5 17.5)" />
          </svg>
        </button>
        
        {/* Search Bar */}
        <div className="relative">
          <div className="bg-[#F3F4F6] rounded-full px-4 py-2 flex items-center gap-3">
            <Search className="w-5 h-5 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search a product to compare..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(e.target.value.trim().length > 0);
              }}
              className="flex-1 bg-transparent outline-none text-sm text-[#1F2937] placeholder:text-[#9CA3AF]"
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(""); setShowSearchResults(false); }}>
                <X className="w-5 h-5 text-[#9CA3AF]" />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {showSearchResults && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-[#E5E7EB] shadow-lg z-50 max-h-64 overflow-y-auto">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div key={product.id} className="border-b border-[#E5E7EB] last:border-b-0">
                    <button
                      onClick={() => {
                        if (!item1) handleSelectProduct(product, 1);
                        else if (!item2) handleSelectProduct(product, 2);
                        else handleSelectProduct(product, 1);
                      }}
                      className="w-full flex items-center gap-3 p-3 hover:bg-[#F9FAFB] text-left"
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#F3F4F6] flex-shrink-0">
                        <img src={product.file_url} alt={product.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#1F2937] text-sm line-clamp-1">{product.title}</h3>
                        <p className="text-xs text-[#6B7280]">{product.keywords?.[0] || 'Product'}</p>
                      </div>
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center">
                  <p className="text-sm text-[#6B7280] mb-3">No results found</p>
                  <Button 
                    onClick={() => navigate(createPageUrl("Snap") + "?from=Compare")}
                    className="bg-[#00A36C] hover:bg-[#007E52] text-white"
                  >
                    Take a photo instead
                  </Button>
                </div>
              )}
            </div>
          )}
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
              <div key={idx} className="flex-shrink-0 bg-white border border-[#E5E7EB] rounded-2xl p-3" style={{ minWidth: '200px' }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-20 h-24 rounded-xl overflow-hidden bg-[#F3F4F6] mb-1">
                      <img src={comp.product1.image} alt={comp.product1.name} className="w-full h-full object-cover" />
                    </div>
                    <p className="text-[10px] font-semibold text-[#1F2937] text-center line-clamp-2">{comp.product1.name}</p>
                  </div>
                  <div className="bg-[#F3F4F6] rounded px-2 py-1">
                    <span className="text-[10px] font-bold text-[#6B7280]">VS</span>
                  </div>
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-20 h-24 rounded-xl overflow-hidden bg-[#F3F4F6] mb-1">
                      <img src={comp.product2.image} alt={comp.product2.name} className="w-full h-full object-cover" />
                    </div>
                    <p className="text-[10px] font-semibold text-[#1F2937] text-center line-clamp-2">{comp.product2.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Saved Comparisons Tile */}
        <div>
          <h2 className="text-sm font-bold text-[#1F2937] mb-3">Saved Comparisons</h2>
          <button 
            onClick={() => navigate(createPageUrl("SavedComparisons"))}
            className="w-full bg-[#00A36C]/5 border border-[#00A36C]/20 rounded-2xl p-4 flex items-center gap-4 hover:bg-[#00A36C]/10 transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-[#00A36C]/10 flex items-center justify-center flex-shrink-0">
              <Folder className="w-6 h-6 text-[#00A36C]" />
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
              className="w-full border border-[#E5E7EB] rounded-xl p-3 flex items-center justify-between hover:bg-[#F9FAFB] transition-colors"
            >
              <span className="text-sm font-medium text-[#1F2937]">Add first product</span>
              <div className="text-[#00A36C] text-2xl font-light">+</div>
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
              className="w-full border border-[#E5E7EB] rounded-xl p-3 flex items-center justify-between hover:bg-[#F9FAFB] transition-colors"
            >
              <span className="text-sm font-medium text-[#1F2937]">Add second product</span>
              <div className="text-[#00A36C] text-2xl font-light">+</div>
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
            style={{ height: '70vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center py-3">
              <div className="w-10 h-1 bg-[#D1D5DB] rounded-full" />
            </div>

            <div className="px-6 pb-4">
              <h2 className="text-lg font-bold text-[#1F2937]">Product Priorities</h2>
            </div>
            
            <div className="overflow-y-auto px-6 pb-6" style={{ height: 'calc(70vh - 120px)' }}>
              <div className="space-y-6">
                {/* Brand */}
                <div>
                  <label className="text-sm font-semibold text-[#1F2937] mb-1 block">Brand</label>
                  <p className="text-xs text-[#6B7280] mb-3">Prioritize well-known and trusted brands</p>
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
                    />
                  </div>
                  <div className="flex justify-between text-xs mt-2 px-3 text-[#6B7280]">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>

                {/* Price */}
                <div>
                  <label className="text-sm font-semibold text-[#1F2937] mb-1 block">Price</label>
                  <p className="text-xs text-[#6B7280] mb-3">Prioritize the lowest price</p>
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
                    />
                  </div>
                  <div className="flex justify-between text-xs mt-2 px-3 text-[#6B7280]">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>

                {/* Durability */}
                <div>
                  <label className="text-sm font-semibold text-[#1F2937] mb-1 block">Durability</label>
                  <p className="text-xs text-[#6B7280] mb-3">Prioritize build quality and product lifespan</p>
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
                    />
                  </div>
                  <div className="flex justify-between text-xs mt-2 px-3 text-[#6B7280]">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>

                {/* Reviews */}
                <div>
                  <label className="text-sm font-semibold text-[#1F2937] mb-1 block">Reviews</label>
                  <p className="text-xs text-[#6B7280] mb-3">Prioritize higher customer ratings</p>
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
                    />
                  </div>
                  <div className="flex justify-between text-xs mt-2 px-3 text-[#6B7280]">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>

                {/* Discount */}
                <div>
                  <label className="text-sm font-semibold text-[#1F2937] mb-1 block">Discount</label>
                  <p className="text-xs text-[#6B7280] mb-3">Prioritize the biggest savings</p>
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
                    />
                  </div>
                  <div className="flex justify-between text-xs mt-2 px-3 text-[#6B7280]">
                    <span>Low</span>
                    <span>High</span>
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
          width: 20px;
          height: 20px;
          background: white;
          border: 3px solid #00A36C;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          margin-top: -6px;
        }
        
        .slider-custom::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: white;
          border: 3px solid #00A36C;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}