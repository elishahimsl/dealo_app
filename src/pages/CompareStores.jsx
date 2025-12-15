import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ChevronLeft, HelpCircle, Camera, Search, Bookmark, Clock, Scan } from "lucide-react";

export default function CompareStores() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [recentlyCompared] = useState([
    { id: 1, name: "Sony WH-1000XM5", image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200", priceRange: "$278", store: "Amazon", storeLogo: "https://logo.clearbit.com/amazon.com" },
    { id: 2, name: "Apple AirPods Pro", image: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=200", priceRange: "$199", store: "Target", storeLogo: "https://logo.clearbit.com/target.com" }
  ]);

  const popularCategories = [
    { id: 1, name: "Smartphones", icon: "📱", subtext: "Compare prices across stores" },
    { id: 2, name: "Headphones", icon: "🎧", subtext: "Compare prices across stores" },
    { id: 3, name: "Shoes", icon: "👟", subtext: "Compare prices across stores" },
    { id: 4, name: "Appliances", icon: "🏠", subtext: "Compare prices across stores" },
    { id: 5, name: "Gaming", icon: "🎮", subtext: "Compare prices across stores" }
  ];

  const trendingProducts = [
    { id: 1, name: "Sony WH-1000XM5", image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200", priceRange: "$278 – $349", storeCount: 12 },
    { id: 2, name: "Apple AirPods Pro", image: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=200", priceRange: "$199 – $249", storeCount: 15 },
    { id: 3, name: "Samsung Galaxy Buds", image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=200", priceRange: "$89 – $149", storeCount: 10 },
    { id: 4, name: "Bose QuietComfort", image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=200", priceRange: "$249 – $329", storeCount: 8 }
  ];

  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(createPageUrl("CompareStoresResults"), { state: { searchQuery: query } });
    }
  };

  const handleProductClick = (product) => {
    navigate(createPageUrl("CompareStoresResults"), { state: { product } });
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Top Navigation */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)}>
            <ChevronLeft className="w-6 h-6 text-[#1F2937]" />
          </button>
          <h1 className="text-base font-semibold text-[#1F2937]">Compare Stores</h1>
          <button>
            <HelpCircle className="w-6 h-6 text-[#6B7280]" />
          </button>
        </div>

        {/* Search Entry */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search for a product to compare prices"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
            className="w-full bg-[#F3F4F6] rounded-full pl-12 pr-12 py-3 text-sm text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#00A36C]"
          />
          <button 
            onClick={() => navigate(createPageUrl("Snap") + "?from=CompareStores")}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            <Camera className="w-5 h-5 text-[#6B7280]" />
          </button>
        </div>

        {/* Quick Entry Options */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          <button 
            onClick={() => navigate(createPageUrl("Snap") + "?from=CompareStores&mode=barcode")}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-full"
          >
            <Scan className="w-4 h-4 text-[#6B7280]" />
            <span className="text-sm font-medium text-[#1F2937]">Scan Barcode</span>
          </button>
          <button className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-full">
            <Bookmark className="w-4 h-4 text-[#6B7280]" />
            <span className="text-sm font-medium text-[#1F2937]">Saved Items</span>
          </button>
          <button className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-full">
            <Clock className="w-4 h-4 text-[#6B7280]" />
            <span className="text-sm font-medium text-[#1F2937]">Recently Viewed</span>
          </button>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Popular Price Comparisons */}
        <div>
          <h2 className="text-base font-bold text-[#1F2937] mb-4">Popular Price Comparisons</h2>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {popularCategories.map((category) => (
              <button
                key={category.id}
                className="flex-shrink-0 bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
                style={{ width: '140px' }}
              >
                <div className="text-3xl mb-2">{category.icon}</div>
                <p className="text-sm font-semibold text-[#1F2937] mb-1">{category.name}</p>
                <p className="text-xs text-[#6B7280]">{category.subtext}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Trending Products to Compare */}
        <div>
          <h2 className="text-base font-bold text-[#1F2937] mb-4">Trending Products to Compare</h2>
          <div className="space-y-3">
            {trendingProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => handleProductClick(product)}
                className="w-full bg-white border border-[#E5E7EB] rounded-xl p-4 flex items-center gap-3 hover:bg-[#F9FAFB] transition-colors shadow-sm"
              >
                <div className="w-16 h-16 rounded-lg bg-[#F9FAFB] flex items-center justify-center flex-shrink-0">
                  <img src={product.image} alt={product.name} className="w-full h-full object-contain p-2" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-[#1F2937] mb-1">{product.name}</p>
                  <p className="text-xs text-[#6B7280] mb-1">{product.priceRange}</p>
                  <p className="text-xs text-[#9CA3AF]">Available at {product.storeCount} stores</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recently Compared */}
        {recentlyCompared.length > 0 && (
          <div>
            <h2 className="text-base font-bold text-[#1F2937] mb-4">Recently Compared</h2>
            <div className="space-y-3">
              {recentlyCompared.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleProductClick(item)}
                  className="w-full bg-white border border-[#E5E7EB] rounded-xl p-4 flex items-center gap-3 hover:bg-[#F9FAFB] transition-colors shadow-sm"
                >
                  <div className="w-16 h-16 rounded-lg bg-[#F9FAFB] flex items-center justify-center flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-[#1F2937] mb-1">{item.name}</p>
                    <p className="text-xs text-[#00A36C] font-semibold mb-1">Cheapest: {item.priceRange}</p>
                    <div className="flex items-center gap-2">
                      <img 
                        src={item.storeLogo} 
                        alt={item.store} 
                        className="h-3 object-contain"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                      <span className="text-xs text-[#6B7280]">{item.store}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Empty State - Only shown if no history */}
        {recentlyCompared.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-24 h-24 rounded-full bg-[#F3F4F6] flex items-center justify-center mb-4">
              <Search className="w-12 h-12 text-[#9CA3AF]" />
            </div>
            <p className="text-sm text-[#6B7280] text-center max-w-xs">
              Search or scan a product to see which store has the best price.
            </p>
          </div>
        )}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}