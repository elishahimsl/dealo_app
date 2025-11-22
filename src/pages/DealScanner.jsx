import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DealScanner() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = ["All Deals", "Electronics", "Home", "Clothing", "Beauty", "Automotive"];

  const mockDeals = [
    { 
      id: 1, 
      store: "Target", 
      discount: "40% OFF", 
      originalPrice: "$149.99", 
      salePrice: "$89.99",
      image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400",
      distance: "0.5 mi"
    },
    { 
      id: 2, 
      store: "Best Buy", 
      discount: "30% OFF", 
      originalPrice: "$199.99", 
      salePrice: "$139.99",
      image: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=400",
      distance: "1.2 mi"
    },
    { 
      id: 3, 
      store: "Walmart", 
      discount: "25% OFF", 
      originalPrice: "$79.99", 
      salePrice: "$59.99",
      image: "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=400",
      distance: "2.1 mi"
    },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      <div className="px-6 pt-8 pb-4">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6 text-[#1F2937]" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#1F2937]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              DealScanner
            </h1>
            <p className="text-sm text-[#6B7280]">Top deals online and near you</p>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-6">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setActiveCategory(cat.toLowerCase().replace(" ", ""))}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${
                activeCategory === cat.toLowerCase().replace(" ", "")
                  ? "bg-[#00A36C] text-white"
                  : "bg-white text-[#1F2937] border border-[#E5E7EB]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6">
        <h3 className="text-lg font-bold text-[#1F2937] mb-4">Today's Hottest Deals</h3>
        <div className="space-y-4">
          {mockDeals.map((deal) => (
            <div key={deal.id} className="bg-white rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-sm">
              <div className="relative h-48">
                <img src={deal.image} alt={deal.store} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  {deal.discount}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <h4 className="text-white font-bold text-lg mb-1">{deal.store}</h4>
                  <div className="flex items-center gap-2 text-white">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{deal.distance}</span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-sm text-[#6B7280] line-through">{deal.originalPrice}</span>
                    <span className="text-2xl font-bold text-[#00A36C] ml-2">{deal.salePrice}</span>
                  </div>
                </div>
                <Button className="w-full bg-[#00A36C] hover:bg-[#007E52] rounded-xl">
                  View Deal
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}