import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart } from "lucide-react";

export default function RecentlyViewed() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("30");

  const recentlyViewed = [
    { id: 1, price: "$89.99", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200", title: "Wireless Headphones", date: "2025-11-28" },
    { id: 2, price: "$199.99", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200", title: "Smart Watch", date: "2025-11-25" },
    { id: 3, price: "$59.99", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200", title: "Bluetooth Speaker", date: "2025-11-20" },
    { id: 4, price: "$24.99", image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=200", title: "Phone Case", date: "2025-11-15" },
    { id: 5, price: "$149.99", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200", title: "Running Shoes", date: "2025-11-10" },
    { id: 6, price: "$34.99", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200", title: "Backpack", date: "2025-10-28" },
  ];

  const filterOptions = [
    { value: "30", label: "Last 30 days" },
    { value: "90", label: "Last 90 days" },
    { value: "all", label: "All time" },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      <div className="px-6 pt-6 pb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5 text-[#1F2937]" />
        </button>
        <h1 className="text-lg font-bold text-[#1F2937]">Recently Viewed</h1>
      </div>

      {/* Filter */}
      <div className="px-6 mb-4 flex gap-2">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium ${
              filter === option.value
                ? 'bg-[#00A36C] text-white'
                : 'bg-white border border-[#E5E7EB] text-[#1F2937]'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="px-6 grid grid-cols-2 gap-3">
        {recentlyViewed.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-[#E5E7EB]">
            <div className="relative" style={{ height: '120px' }}>
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm rounded-md px-1.5 py-0.5">
                <span className="text-[10px] font-bold text-white">{item.price}</span>
              </div>
              <button className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-[#6B7280] flex items-center justify-center">
                <Heart className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
            <div className="p-2">
              <p className="text-xs font-medium text-[#1F2937] truncate">{item.title}</p>
              <p className="text-[10px] text-[#6B7280]">{item.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}