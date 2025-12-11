import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function SavedComparisons() {
  const navigate = useNavigate();

  const savedComparisons = [
    {
      id: 1,
      product1: { name: "M2 MacBook Air", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200" },
      product2: { name: "HP Envy", image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=200" },
      date: "2 days ago"
    },
    {
      id: 2,
      product1: { name: "iPhone 15 Pro", image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=200" },
      product2: { name: "Samsung S24 Ultra", image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=200" },
      date: "1 week ago"
    },
    {
      id: 3,
      product1: { name: "Sony WH-1000XM5", image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200" },
      product2: { name: "Bose QC45", image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=200" },
      date: "2 weeks ago"
    }
  ];

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="px-6 pt-8 pb-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)}>
          <ChevronLeft className="w-6 h-6 text-[#1F2937]" />
        </button>
        <h1 className="text-lg font-semibold text-[#1F2937]">Saved Comparisons</h1>
        <div className="w-6" />
      </div>

      <div className="px-6 space-y-3">
        {savedComparisons.map((comp) => (
          <div key={comp.id} className="bg-white border border-[#E5E7EB] rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center gap-2 flex-1">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#F3F4F6]">
                  <img src={comp.product1.image} alt={comp.product1.name} className="w-full h-full object-cover" />
                </div>
                <p className="text-xs font-semibold text-[#1F2937] flex-1">{comp.product1.name}</p>
              </div>
              <span className="text-xs font-bold text-[#6B7280]">vs</span>
              <div className="flex items-center gap-2 flex-1">
                <p className="text-xs font-semibold text-[#1F2937] flex-1 text-right">{comp.product2.name}</p>
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#F3F4F6]">
                  <img src={comp.product2.image} alt={comp.product2.name} className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
            <p className="text-xs text-[#6B7280] text-center">{comp.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}