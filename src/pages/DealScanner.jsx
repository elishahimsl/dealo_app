import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Camera, Heart, Tag, Cpu, Store } from "lucide-react";

export default function DealScanner() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");

  const toggleFavorite = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const todaysBestDeals = [
    { id: 1, name: "Apple Watch", brand: "Amazon", price: "$149", originalPrice: "$199", save: "Save $50", image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300" },
    { id: 2, name: "Headphones", brand: "BET", price: "$39", originalPrice: "$99", save: "Save $20", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300" },
    { id: 3, name: "72\" TV", brand: "VIZIO", price: "$60", originalPrice: "$100", save: "50% OFF", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300" },
  ];

  const trendingCategories = [
    { id: "tech", name: "Tech", icon: "💻" },
    { id: "shoes", name: "Shoes", icon: "👟" },
    { id: "clothing", name: "Clothing", icon: "👕" },
    { id: "home", name: "Home", icon: "🏠" },
    { id: "beauty", name: "Beauty", icon: "💄" },
  ];

  const trendingPriceDrops = [
    { id: 101, name: "iPhone 15 Pro", brand: "Apple", price: "$800", originalPrice: "$1100", discount: "↓27%", images: ["https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300", "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=300"] },
    { id: 102, name: "Quarter-Zip", brand: "Banana Republic", price: "$75", originalPrice: "$100", discount: "↓40%", images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300", "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300"] },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex items-center justify-center">
        <h1 className="text-base font-semibold text-[#1F2937]">Deal Scanner</h1>
      </div>

      <div className="px-6 space-y-6">
        {/* Search Bar */}
        <div className="flex items-center gap-2 bg-[#E5E7EB] rounded-2xl px-4 py-3">
          <Search className="w-4 h-4 text-[#6B7280]" />
          <input
            placeholder="Search Products"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#6B7280]"
          />
          <button>
            <Camera className="w-4 h-4 text-[#6B7280]" />
          </button>
        </div>

        {/* Tool Buttons */}
        <div className="flex gap-3">
          <button className="flex-1 bg-white rounded-2xl p-3 border border-[#E5E7EB] flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#F3F4F6] flex items-center justify-center">
              <Cpu className="w-4 h-4 text-[#00A36C]" />
            </div>
            <span className="text-xs font-semibold text-[#1F2937]">AI Deal Finder</span>
          </button>
          <button className="flex-1 bg-white rounded-2xl p-3 border border-[#E5E7EB] flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#F3F4F6] flex items-center justify-center">
              <Store className="w-4 h-4 text-[#00A36C]" />
            </div>
            <span className="text-xs font-semibold text-[#1F2937]">Compare Stores</span>
          </button>
        </div>

        {/* Today's Best Deals */}
        <div>
          <h2 className="text-sm font-bold text-[#1F2937] mb-3">Today's Best Deals</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {todaysBestDeals.map((deal) => (
              <div key={deal.id} className="flex-shrink-0" style={{ width: '120px' }}>
                {/* Product tile */}
                <div className="aspect-square rounded-2xl overflow-hidden relative mb-2 bg-[#F3F4F6]">
                  <img src={deal.image} alt="" className="w-full h-full object-cover" />
                  {/* Save badge - top right */}
                  <div className="absolute top-2 right-2 bg-[#00A36C] text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                    {deal.save}
                  </div>
                  {/* Heart - bottom right */}
                  <button 
                    onClick={() => toggleFavorite(deal.id)}
                    className={`absolute bottom-2 right-2 w-6 h-6 rounded-full flex items-center justify-center ${
                      favorites.includes(deal.id) ? 'bg-[#00A36C]' : 'bg-[#6B7280]/60'
                    }`}
                  >
                    <Heart className={`w-3 h-3 ${favorites.includes(deal.id) ? 'text-white fill-white' : 'text-white'}`} />
                  </button>
                </div>
                {/* Info underneath */}
                <div className="flex items-center gap-1 mb-0.5">
                  <span className="text-xs font-bold text-[#1F2937]">{deal.price}</span>
                  <span className="text-[10px] text-[#6B7280] line-through">{deal.originalPrice}</span>
                </div>
                <p className="text-[10px] font-medium text-[#1F2937] mb-0.5">{deal.name}</p>
                <p className="text-[10px] text-[#6B7280]">{deal.brand}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Price Drops */}
        <div>
          <h2 className="text-sm font-bold text-[#1F2937] mb-3">Trending Price Drops</h2>
          
          {/* Category pills */}
          <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
            {trendingCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                  activeCategory === cat.id 
                    ? 'bg-[#1F2937] text-white' 
                    : 'bg-white border border-[#E5E7EB] text-[#1F2937]'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          <p className="text-xs text-[#6B7280] mb-3">All</p>

          {/* Price drop cards - 2 column grid */}
          <div className="grid grid-cols-2 gap-3">
            {trendingPriceDrops.map((item) => (
              <div key={item.id}>
                {/* Image carousel tile */}
                <div className="aspect-square rounded-2xl overflow-hidden relative mb-2 bg-[#F3F4F6]">
                  <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
                  {/* Discount badge - top left */}
                  <div className="absolute top-2 left-2 bg-[#00A36C] text-white text-[9px] font-bold px-2 py-0.5 rounded">
                    {item.discount}
                  </div>
                  {/* Heart - bottom right */}
                  <button 
                    onClick={() => toggleFavorite(item.id)}
                    className={`absolute bottom-2 right-2 w-6 h-6 rounded-full flex items-center justify-center ${
                      favorites.includes(item.id) ? 'bg-[#00A36C]' : 'bg-[#6B7280]/60'
                    }`}
                  >
                    <Heart className={`w-3 h-3 ${favorites.includes(item.id) ? 'text-white fill-white' : 'text-white'}`} />
                  </button>
                  {/* Dots */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                    {item.images.map((_, idx) => (
                      <div key={idx} className={`w-1 h-1 rounded-full ${idx === 0 ? 'bg-white' : 'bg-white/50'}`} />
                    ))}
                  </div>
                </div>
                {/* Info underneath */}
                <p className="text-[10px] text-[#6B7280] mb-0.5">{item.brand}</p>
                <p className="text-xs font-medium text-[#1F2937] mb-0.5">{item.name}</p>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-[#1F2937]">{item.price}</span>
                  <span className="text-[10px] text-[#6B7280] line-through">{item.originalPrice}</span>
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