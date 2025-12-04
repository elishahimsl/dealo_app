import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Camera, Heart, ThumbsUp, ThumbsDown, Tag } from "lucide-react";

export default function DealsNearYou() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [activeFilter, setActiveFilter] = useState("for-you");

  const toggleFavorite = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const filters = [
    { id: "for-you", name: "For You" },
    { id: "trending", name: "Trending" },
    { id: "hot-deals", name: "Hot Deals" },
    { id: "new-arrivals", name: "New Arrivals" },
    { id: "limited-time", name: "Limited Time" },
  ];

  const deals = [
    { id: 1, name: "75\" Samsung TV", brand: "Samsung", store: "Amazon", price: "$1,500", originalPrice: "$3,000", discount: "50% off", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400" },
    { id: 2, name: "Apple Macbook", brand: "Apple", store: "Best Buy", price: "$1,200", originalPrice: "$2,200", discount: "45% off", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400" },
    { id: 3, name: "Blue Headphones", brand: "Skull Candy", store: "Target", price: "$35", originalPrice: "$65", discount: "Save $30", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400" },
    { id: 4, name: "Brown Chair", brand: "IKEA", store: "Amazon", price: "$100", originalPrice: "$200", discount: "Save $100", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400" },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex items-center justify-between">
        {/* Back button - animated tag */}
        <button onClick={() => navigate(-1)} className="relative flex items-center justify-center group">
          <Tag className="w-5 h-5 text-[#00A36C] transform -rotate-45 group-hover:rotate-0 transition-transform duration-300 group-hover:scale-110" />
        </button>
        
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#00A36C] flex items-center justify-center">
            <Tag className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm font-light text-[#6B7280]">dealo</span>
          <span className="text-base font-semibold text-[#1F2937]">Deals</span>
        </div>
        
        <div className="w-5" />
      </div>

      <div className="px-6 space-y-4">
        {/* Search Bar */}
        <div className="flex items-center gap-2 bg-[#E5E7EB] rounded-2xl px-4 py-3">
          <Search className="w-4 h-4 text-[#6B7280]" />
          <input
            placeholder="Search Product"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#6B7280]"
          />
          <button>
            <Camera className="w-4 h-4 text-[#6B7280]" />
          </button>
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                activeFilter === filter.id 
                  ? 'bg-[#1F2937] text-white' 
                  : 'bg-white border border-[#E5E7EB] text-[#1F2937]'
              }`}
            >
              {filter.name}
            </button>
          ))}
        </div>

        {/* Deals based on interests */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#1F2937]">Deals based on your interests</h2>
          <button className="w-6 h-6 rounded-full bg-[#E5E7EB] flex items-center justify-center">
            <span className="text-xs">⚙️</span>
          </button>
        </div>

        {/* Deals Grid - 2 column */}
        <div className="grid grid-cols-2 gap-3">
          {deals.map((deal) => (
            <div key={deal.id}>
              {/* Product tile with gradient border */}
              <div 
                className="rounded-2xl p-[2px] mb-2"
                style={{
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(200,200,200,0.4) 50%, rgba(150,150,150,0.3) 100%)',
                }}
              >
                <div className="aspect-square rounded-2xl overflow-hidden relative bg-[#F3F4F6]">
                  <img src={deal.image} alt="" className="w-full h-full object-cover" />
                  {/* Discount badge - top left */}
                  <div className="absolute top-2 left-2 bg-black/40 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-1 rounded">
                    {deal.discount}
                  </div>
                  {/* Heart - bottom right */}
                  <button 
                    onClick={() => toggleFavorite(deal.id)}
                    className={`absolute bottom-2 right-2 w-7 h-7 rounded-full flex items-center justify-center ${
                      favorites.includes(deal.id) ? 'bg-[#00A36C]' : 'bg-[#6B7280]/60'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${favorites.includes(deal.id) ? 'text-white fill-white' : 'text-white'}`} />
                  </button>
                </div>
              </div>
              
              {/* Info underneath */}
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-sm font-bold text-[#1F2937]">{deal.price}</span>
                <span className="text-xs text-[#6B7280] line-through">{deal.originalPrice}</span>
              </div>
              <p className="text-xs font-medium text-[#1F2937] mb-0.5">{deal.name}</p>
              <p className="text-[10px] text-[#6B7280] mb-1">{deal.store}</p>
              
              {/* Thumbs up/down */}
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-0.5 text-[#6B7280]">
                  <ThumbsUp className="w-3 h-3" />
                </button>
                <button className="flex items-center gap-0.5 text-[#6B7280]">
                  <ThumbsDown className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}