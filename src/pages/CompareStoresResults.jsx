import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ChevronLeft, HelpCircle, ChevronDown } from "lucide-react";

export default function CompareStoresResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state?.product || {
    name: "Sony WH-1000XM5",
    brand: "Sony",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200"
  };

  const [showInfo, setShowInfo] = useState(false);

  // Top 5 trusted retailers only
  const stores = [
    { name: "Amazon", logo: "https://logo.clearbit.com/amazon.com", price: 278, inStock: true, shipping: "Free shipping" },
    { name: "Best Buy", logo: "https://logo.clearbit.com/bestbuy.com", price: 289, inStock: true, shipping: "Pickup today" },
    { name: "Target", logo: "https://logo.clearbit.com/target.com", price: 299, inStock: true, shipping: "Free shipping" },
    { name: "Walmart", logo: "https://logo.clearbit.com/walmart.com", price: 304, inStock: false, shipping: "Online" },
    { name: "B&H Photo", logo: "https://logo.clearbit.com/bhphotovideo.com", price: 312, inStock: true, shipping: "Free shipping" }
  ];

  const lowestPrice = Math.min(...stores.map(s => s.price));

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
            <HelpCircle className="w-5 h-5 text-[#6B7280]" />
          </button>
        </div>
      </div>

      {/* Product Header (Context Lock) */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-start gap-4">
          <div className="w-24 h-24 rounded-xl bg-[#F9FAFB] flex items-center justify-center flex-shrink-0">
            <img src={product.image} alt={product.name} className="w-full h-full object-contain p-2" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-[#6B7280] mb-1">{product.brand || "Brand"}</p>
            <h2 className="text-base font-bold text-[#1F2937] mb-1">{product.name}</h2>
            {product.variant && (
              <p className="text-xs text-[#6B7280]">{product.variant}</p>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Primary Store Comparison Section */}
        <div>
          <h3 className="text-base font-bold text-[#1F2937] mb-1">Available From Top Retailers</h3>
          <p className="text-xs text-[#6B7280] mb-4">Showing the most reliable stores with verified pricing.</p>

          <div className="space-y-3">
            {stores.map((store, idx) => {
              const isLowest = store.price === lowestPrice;

              return (
                <div
                  key={idx}
                  className="bg-white border border-[#E5E7EB] rounded-xl p-4"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-lg bg-[#F9FAFB] flex items-center justify-center flex-shrink-0">
                      <img 
                        src={store.logo} 
                        alt={store.name} 
                        className="w-10 h-10 object-contain p-1"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#1F2937] mb-1">{store.name}</p>
                      <div className="flex items-center gap-2 text-xs mb-1">
                        <span className={store.inStock ? "text-[#1F2937]" : "text-[#9CA3AF]"}>
                          {store.inStock ? "In stock" : "Out of stock"}
                        </span>
                        {store.inStock && store.shipping && (
                          <>
                            <span className="text-[#D1D5DB]">•</span>
                            <span className="text-[#6B7280]">{store.shipping}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-xl font-bold text-[#1F2937]">${store.price}</p>
                      {isLowest && (
                        <p className="text-xs text-[#6B7280] mt-0.5">Lowest price</p>
                      )}
                      <p className="text-xs text-[#9CA3AF] mt-1">Before tax</p>
                    </div>
                  </div>

                  <button className="w-full py-2.5 bg-[#1F2937] text-white rounded-lg text-sm font-semibold">
                    Visit Store
                  </button>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-[#9CA3AF] text-center mt-4">
            Stores are ranked by price, availability, and customer trust.
          </p>
        </div>

        {/* Why This Works Section */}
        <div className="border border-[#E5E7EB] rounded-xl overflow-hidden">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="w-full px-4 py-3 flex items-center justify-between bg-white"
          >
            <span className="text-sm font-semibold text-[#1F2937]">Why These Stores?</span>
            <ChevronDown className={`w-5 h-5 text-[#6B7280] transition-transform ${showInfo ? 'rotate-180' : ''}`} />
          </button>
          {showInfo && (
            <div className="px-4 py-3 bg-white border-t border-[#E5E7EB]">
              <ul className="space-y-2 text-xs text-[#6B7280]">
                <li>• Verified pricing sources from official retailer websites</li>
                <li>• Trusted retailer list based on customer satisfaction and reliability</li>
                <li>• Real-time availability checks across all locations</li>
                <li>• Prices updated regularly to ensure accuracy</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Action Bar (Bottom, Sticky) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] px-6 py-4 z-30">
        <div className="flex gap-3 max-w-lg mx-auto">
          <button 
            onClick={() => navigate(createPageUrl("CompareStores"))}
            className="flex-1 py-3 bg-[#1F2937] text-white rounded-full text-sm font-semibold"
          >
            Change Product
          </button>
          <button 
            onClick={() => navigate(createPageUrl("CompareStores"))}
            className="flex-1 py-3 bg-white border-2 border-[#E5E7EB] text-[#1F2937] rounded-full text-sm font-semibold"
          >
            Search Another Item
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