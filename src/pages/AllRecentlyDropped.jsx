import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Heart } from "lucide-react";

export default function AllRecentlyDropped() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);

  const recentlyDropped = [
    { id: 101, name: "Apple MacBook Pro", price: "$1,799", originalPrice: "$2,149", discount: "-16%", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300", brand: "Apple" },
    { id: 102, name: "iPhone 13 Pro", price: "$899", originalPrice: "$1,100", discount: "-20%", image: "https://images.unsplash.com/photo-1632661674596-df8be59a5ed3?w=300", brand: "Apple" },
    { id: 103, name: "Sony WH-1000XM4", price: "$248", originalPrice: "$349", discount: "-29%", image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=300", brand: "Sony" },
    { id: 104, name: "iPad Air", price: "$499", originalPrice: "$599", discount: "-17%", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300", brand: "Apple" },
    { id: 105, name: "Samsung Galaxy S21", price: "$699", originalPrice: "$899", discount: "-22%", image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=300", brand: "Samsung" },
    { id: 106, name: "AirPods Pro", price: "$199", originalPrice: "$249", discount: "-20%", image: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=300", brand: "Apple" },
    { id: 107, name: "Nike Air Max", price: "$119", originalPrice: "$159", discount: "-25%", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300", brand: "Nike" },
    { id: 108, name: "Dyson V11", price: "$449", originalPrice: "$599", discount: "-25%", image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=300", brand: "Dyson" },
  ];

  const toggleFavorite = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)}>
          <ChevronLeft className="w-5 h-5 text-[#1F2937]" />
        </button>
        <h1 className="text-base font-semibold text-[#1F2937]">Recently Dropped</h1>
        <div className="w-5" />
      </div>

      {/* Products Grid */}
      <div className="px-6">
        <div className="grid grid-cols-2 gap-3">
          {recentlyDropped.map((item) => (
            <div key={item.id}>
              <div className="aspect-square rounded-2xl overflow-hidden relative mb-2">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                <button 
                  onClick={() => toggleFavorite(item.id)}
                  className={`absolute bottom-2 right-2 w-6 h-6 rounded-full flex items-center justify-center ${
                    favorites.includes(item.id) ? 'bg-[#00A36C]' : 'bg-[#6B7280]/60'
                  }`}
                >
                  <Heart className={`w-3 h-3 ${favorites.includes(item.id) ? 'text-white fill-white' : 'text-white'}`} />
                </button>
              </div>
              <p className="text-xs font-medium text-[#1F2937] line-clamp-1">{item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}