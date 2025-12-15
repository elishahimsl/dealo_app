import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Search, Info, ChevronLeft } from "lucide-react";

export default function AIDealFinder() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", "Tech", "Home", "Fashion", "Reset"];

  const featuredDeal = {
    name: "Sony WH-1000XM5",
    price: "$278",
    discount: "22% below market average",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400",
    description: "Historically low price for a top-tier model with excellent reviews.",
    dealScore: true
  };

  const bestValueDeals = [
    {
      name: "Wireless Earbuds",
      price: "$35",
      discount: "12% below market average",
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200",
      badge: "Best Value"
    },
    {
      name: "Smart Watch Pro",
      price: "$189",
      discount: "18% below market average",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200",
      badge: "Best Value"
    },
    {
      name: "Bluetooth Speaker",
      price: "$45",
      discount: "15% below market average",
      image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200",
      badge: "Best Value"
    }
  ];

  const recentlyDropped = [
    {
      name: "Apple AirPods Pro",
      price: "$199",
      discount: "20% off",
      image: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=200"
    },
    {
      name: "Samsung Galaxy Buds",
      price: "$89",
      discount: "15% off",
      image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=200"
    },
    {
      name: "Mechanical Keyboard",
      price: "$79",
      discount: "25% off",
      image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=200"
    },
    {
      name: "Webcam HD Pro",
      price: "$59",
      discount: "30% off",
      image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=200"
    }
  ];

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)}>
            <ChevronLeft className="w-6 h-6 text-[#1F2937]" />
          </button>
          <button className="flex flex-col gap-0.5">
            <div className="w-4 h-0.5 bg-[#1F2937]" />
            <div className="w-4 h-0.5 bg-[#1F2937]" />
            <div className="w-4 h-0.5 bg-[#1F2937]" />
          </button>
        </div>

        <h1 className="text-2xl font-bold text-[#1F2937] mb-2">AI Deal Finder</h1>
        <p className="text-sm text-[#6B7280] mb-4">
          Personalized deals based on price trends, quality, and market value
        </p>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search for products"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F3F4F6] rounded-full pl-11 pr-4 py-2.5 text-sm text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#00A36C]"
          />
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Deal of the Day */}
        <div>
          <h2 className="text-base font-bold text-[#1F2937] mb-3">Deal of the Day</h2>
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-md">
            <div className="flex gap-4 mb-3">
              <div className="w-28 h-28 rounded-xl bg-[#F9FAFB] flex items-center justify-center flex-shrink-0">
                <img
                  src={featuredDeal.image}
                  alt={featuredDeal.name}
                  className="w-full h-full object-contain p-2"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-[#1F2937] mb-1">
                  {featuredDeal.name}
                </h3>
                <span className="inline-block px-3 py-1 bg-[#D1FAE5] text-[#065F46] text-xs font-semibold rounded-full mb-2">
                  Great Deal
                </span>
                <p className="text-2xl font-bold text-[#1F2937] mb-1">
                  {featuredDeal.price}
                </p>
                <p className="text-xs text-[#6B7280]">{featuredDeal.discount}</p>
              </div>
            </div>
            <p className="text-sm text-[#1F2937] mb-3">
              {featuredDeal.description}
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => navigate(createPageUrl("AIDealFinderAnalysis"), {
                  state: {
                    product: {
                      name: featuredDeal.name,
                      image: featuredDeal.image,
                      price: featuredDeal.price,
                      store: "Amazon",
                      storeLogo: "https://logo.clearbit.com/amazon.com",
                      availability: "In Stock"
                    }
                  }
                })}
                className="flex-1 py-2.5 bg-white border border-[#E5E7EB] rounded-full text-sm font-semibold text-[#1F2937]"
              >
                View Analysis
              </button>
              <button className="flex-1 py-2.5 bg-[#00A36C] text-white rounded-full text-sm font-semibold">
                Save Deal
              </button>
            </div>
          </div>
        </div>

        {/* Best Value Right Now */}
        <div>
          <h2 className="text-base font-bold text-[#1F2937] mb-3">
            Best Value Right Now
          </h2>
          <div className="space-y-3">
            {bestValueDeals.map((deal, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-20 h-20 rounded-lg bg-[#F9FAFB] flex items-center justify-center flex-shrink-0">
                  <img
                    src={deal.image}
                    alt={deal.name}
                    className="w-full h-full object-contain p-2"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xs font-semibold text-[#1F2937] mb-0.5">
                    {deal.name}
                  </h3>
                  <p className="text-sm font-bold text-[#1F2937] mb-0.5">
                    {deal.price}
                  </p>
                  <p className="text-xs text-[#6B7280]">{deal.discount}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Dropped in Price */}
        <div>
          <h2 className="text-base font-bold text-[#1F2937] mb-3">
            Recently Dropped in Price
          </h2>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {recentlyDropped.map((item, idx) => (
              <div key={idx} className="flex-shrink-0" style={{ width: '130px' }}>
                <div className="relative">
                  <div className="w-full h-32 rounded-xl bg-[#F9FAFB] flex items-center justify-center mb-2">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain p-3"
                    />
                    <span className="absolute top-2 left-2 px-2 py-1 bg-[#00A36C] text-white text-xs font-semibold rounded">
                      {item.discount}
                    </span>
                    <button className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#6B7280]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-xs font-semibold text-[#1F2937] mb-0.5 line-clamp-2">
                    {item.name}
                  </p>
                  <p className="text-sm font-bold text-[#1F2937] mb-0.5">
                    {item.price}
                  </p>
                  <p className="text-xs text-[#6B7280]">Brand Name</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}