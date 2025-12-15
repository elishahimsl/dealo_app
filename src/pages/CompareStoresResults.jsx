import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ChevronLeft, Share2, ChevronDown, MapPin } from "lucide-react";

export default function CompareStoresResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state?.product || {
    name: "Sony WH-1000XM5",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200"
  };

  const [sortBy, setSortBy] = useState("price");
  const [filterInStock, setFilterInStock] = useState(false);
  const [filterNearby, setFilterNearby] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const stores = [
    { name: "Amazon", logo: "https://logo.clearbit.com/amazon.com", price: 278, inStock: true, type: "Online", distance: null },
    { name: "Best Buy", logo: "https://logo.clearbit.com/bestbuy.com", price: 289, inStock: true, type: "In-store pickup", distance: "2.3 mi" },
    { name: "Target", logo: "https://logo.clearbit.com/target.com", price: 299, inStock: true, type: "Online", distance: null },
    { name: "Walmart", logo: "https://logo.clearbit.com/walmart.com", price: 304, inStock: false, type: "Online", distance: null },
    { name: "B&H Photo", logo: "https://logo.clearbit.com/bhphotovideo.com", price: 312, inStock: true, type: "Online", distance: null },
    { name: "Costco", logo: "https://logo.clearbit.com/costco.com", price: 329, inStock: true, type: "In-store pickup", distance: "5.8 mi" },
    { name: "Newegg", logo: "https://logo.clearbit.com/newegg.com", price: 339, inStock: true, type: "Online", distance: null }
  ];

  const sortedStores = [...stores]
    .filter(store => !filterInStock || store.inStock)
    .filter(store => !filterNearby || store.distance)
    .sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "distance") {
        if (!a.distance) return 1;
        if (!b.distance) return -1;
        return parseFloat(a.distance) - parseFloat(b.distance);
      }
      return 0;
    });

  const bestPrice = Math.min(...stores.map(s => s.price));
  const bestStore = stores.find(s => s.price === bestPrice);
  const priceRange = `$${bestPrice} – $${Math.max(...stores.map(s => s.price))}`;
  const avgPrice = Math.round(stores.reduce((sum, s) => sum + s.price, 0) / stores.length);

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Top Navigation */}
      <div className="sticky top-0 z-20 bg-white border-b border-[#E5E7EB] px-6 py-4">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)}>
            <ChevronLeft className="w-6 h-6 text-[#1F2937]" />
          </button>
          <h1 className="text-base font-semibold text-[#1F2937]">Compare Stores</h1>
          <button>
            <Share2 className="w-5 h-5 text-[#6B7280]" />
          </button>
        </div>
      </div>

      {/* Product Header (Sticky) */}
      <div className="sticky top-[57px] z-10 bg-white border-b border-[#E5E7EB] px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-[#F9FAFB] flex items-center justify-center flex-shrink-0">
            <img src={product.image} alt={product.name} className="w-full h-full object-contain p-1" />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-[#1F2937] line-clamp-2">{product.name}</h2>
            <p className="text-xs text-[#6B7280]">Prices from {stores.length} stores</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Best Price Summary */}
        <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs text-[#6B7280] mb-1">Lowest Price</p>
              <p className="text-3xl font-bold text-[#1F2937]">${bestPrice}</p>
            </div>
            <div className="flex items-center gap-2">
              <img 
                src={bestStore.logo} 
                alt={bestStore.name} 
                className="h-6 object-contain"
                onError={(e) => e.target.style.display = 'none'}
              />
            </div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#00A36C] font-semibold">In stock</span>
            <span className="text-[#6B7280]">{bestStore.type}</span>
          </div>
          <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
            <p className="text-xs text-[#6B7280]">Compared across {stores.length} stores • Updated moments ago</p>
          </div>
        </div>

        {/* Filters & Sorting */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-white border border-[#E5E7EB] rounded-full text-xs font-medium text-[#1F2937]"
          >
            <option value="price">Price</option>
            <option value="distance">Distance</option>
          </select>
          <button
            onClick={() => setFilterInStock(!filterInStock)}
            className={`px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap ${
              filterInStock
                ? "bg-[#1F2937] text-white"
                : "bg-white border border-[#E5E7EB] text-[#1F2937]"
            }`}
          >
            In stock only
          </button>
          <button
            onClick={() => setFilterNearby(!filterNearby)}
            className={`px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap ${
              filterNearby
                ? "bg-[#1F2937] text-white"
                : "bg-white border border-[#E5E7EB] text-[#1F2937]"
            }`}
          >
            Nearby stores
          </button>
        </div>

        {/* Store Comparison List */}
        <div className="space-y-3">
          {sortedStores.map((store, idx) => {
            const isLowest = store.price === bestPrice;
            const priceDiff = store.price - bestPrice;

            return (
              <div
                key={idx}
                className={`bg-white border rounded-xl p-4 ${
                  isLowest ? "border-[#1F2937] bg-[#F9FAFB]" : "border-[#E5E7EB]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center flex-shrink-0">
                    <img 
                      src={store.logo} 
                      alt={store.name} 
                      className="w-8 h-8 object-contain"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-[#1F2937]">{store.name}</p>
                      {isLowest && (
                        <span className="px-2 py-0.5 bg-[#1F2937] text-white text-xs font-semibold rounded">
                          Lowest Price
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                      <span className={store.inStock ? "text-[#00A36C]" : "text-[#EF4444]"}>
                        {store.inStock ? "In stock" : "Out of stock"}
                      </span>
                      <span>•</span>
                      <span>{store.type}</span>
                      {store.distance && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {store.distance}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-bold text-[#1F2937]">${store.price}</p>
                    {priceDiff > 0 && (
                      <p className="text-xs text-[#6B7280]">+${priceDiff}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Price Context */}
        <div className="bg-[#F9FAFB] rounded-xl p-4">
          <p className="text-xs text-[#6B7280] mb-1">Price range today: {priceRange}</p>
          <p className="text-xs text-[#6B7280]">Average price: ${avgPrice}</p>
        </div>

        {/* Store Trust & Info */}
        <div className="border border-[#E5E7EB] rounded-xl overflow-hidden">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="w-full px-4 py-3 flex items-center justify-between bg-white"
          >
            <span className="text-sm font-semibold text-[#1F2937]">How prices are compared</span>
            <ChevronDown className={`w-5 h-5 text-[#6B7280] transition-transform ${showInfo ? 'rotate-180' : ''}`} />
          </button>
          {showInfo && (
            <div className="px-4 py-3 bg-[#F9FAFB] border-t border-[#E5E7EB]">
              <ul className="space-y-2 text-xs text-[#6B7280]">
                <li>• Prices pulled from official store listings</li>
                <li>• Updated regularly throughout the day</li>
                <li>• Taxes and shipping may vary by location</li>
                <li>• Availability subject to change</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Action Bar (Bottom, Sticky) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] px-6 py-4 z-30">
        <div className="flex gap-3 max-w-lg mx-auto">
          <button className="flex-1 py-3 bg-[#1F2937] text-white rounded-full text-sm font-semibold">
            Go to Best Store
          </button>
          <button className="flex-1 py-3 bg-white border-2 border-[#E5E7EB] text-[#1F2937] rounded-full text-sm font-semibold">
            Save Comparison
          </button>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}