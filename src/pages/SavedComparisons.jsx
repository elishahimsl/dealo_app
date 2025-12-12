import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, SlidersHorizontal } from "lucide-react";

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
      <div className="px-6 pt-8 pb-2 flex items-center justify-between relative">
        <button onClick={() => navigate(-1)} className="absolute left-6">
          <ChevronLeft className="w-6 h-6 text-[#1F2937]" />
        </button>
        <h1 className="text-sm font-semibold text-[#1F2937] w-full text-center">Saved Comparisons</h1>
      </div>

      <div className="px-6 space-y-3 relative">
        <button className="absolute -top-6 right-6 z-10">
          <svg className="w-5 h-5 text-[#6B7280]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="8" x2="20" y2="8" strokeLinecap="round"/>
            <circle cx="8" cy="8" r="2" fill="currentColor"/>
            <line x1="4" y1="16" x2="20" y2="16" strokeLinecap="round"/>
            <circle cx="16" cy="16" r="2" fill="currentColor"/>
          </svg>
        </button>
        
        {savedComparisons.map((comp) => (
          <button 
            key={comp.id} 
            onClick={() => navigate('/comparison-results', { 
              state: { 
                item1: { title: comp.product1.name, file_url: comp.product1.image, price: '$999', brand: 'Brand' },
                item2: { title: comp.product2.name, file_url: comp.product2.image, price: '$899', brand: 'Brand' },
                result: { winner: 1, item1_scores: { quality: 85, value: 78, features: 90, design: 88, durability: 82 }, item2_scores: { quality: 80, value: 85, features: 85, design: 82, durability: 80 }, explanation: 'Based on your preferences, this product offers better overall value.' }
              }
            })}
            className="w-full bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-[#F3F4F6] mb-2">
                  <img src={comp.product1.image} alt={comp.product1.name} className="w-full h-full object-cover" />
                </div>
                <p className="text-xs font-semibold text-[#1F2937] text-center line-clamp-2">{comp.product1.name}</p>
              </div>
              
              <div className="w-10 h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-[#6B7280]">VS</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-[#F3F4F6] mb-2">
                  <img src={comp.product2.image} alt={comp.product2.name} className="w-full h-full object-cover" />
                </div>
                <p className="text-xs font-semibold text-[#1F2937] text-center line-clamp-2">{comp.product2.name}</p>
              </div>
            </div>
            <p className="text-xs text-[#6B7280] text-center mt-2">{comp.date}</p>
          </button>
        ))}
      </div>
    </div>
  );
}