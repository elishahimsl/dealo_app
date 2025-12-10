import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Heart, SlidersHorizontal } from "lucide-react";

export default function StoreNewArrivals() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const storeName = urlParams.get("store") || "Target";
  
  const [favorites, setFavorites] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [sortBy, setSortBy] = useState("featured");

  const newArrivals = [
    { id: 1, title: "Modern Vase", price: "$34.99", image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=300", badge: "New" },
    { id: 2, title: "Decorative Bowl", price: "$24.99", image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=300", badge: "New" },
    { id: 3, title: "Wall Art", price: "$49.99", image: "https://images.unsplash.com/photo-1561337622-5a4f5e7e3e3e?w=300", badge: "New" },
    { id: 4, title: "Table Runner", price: "$19.99", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=300", badge: "New" },
    { id: 5, title: "Ceramic Plates", price: "$39.99", image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=300", badge: "New" },
    { id: 6, title: "Accent Chair", price: "$129.99", image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=300", badge: "New" },
  ];

  const toggleFavorite = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)}>
          <ChevronLeft className="w-5 h-5 text-[#1F2937]" />
        </button>
        <h1 className="text-base font-semibold text-[#1F2937]">{storeName} New Arrivals</h1>
        <button 
          onClick={() => setShowFilter(true)}
          className="w-8 h-8 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center"
        >
          <SlidersHorizontal className="w-4 h-4 text-[#6B7280]" />
        </button>
      </div>

      {/* Products Grid */}
      <div className="px-6">
        <div className="grid grid-cols-2 gap-3">
          {newArrivals.map((product) => (
            <div key={product.id}>
              <div className="aspect-square rounded-2xl overflow-hidden relative mb-2">
                <img src={product.image} alt={product.title} className="w-full h-full object-cover" />

                <button 
                  onClick={() => toggleFavorite(product.id)}
                  className={`absolute bottom-2 right-2 w-6 h-6 rounded-full flex items-center justify-center ${
                    favorites.includes(product.id) 
                      ? 'bg-[#00A36C]' 
                      : 'bg-[#6B7280]/60'
                  }`}
                >
                  <Heart className={`w-3 h-3 ${favorites.includes(product.id) ? 'text-white fill-white' : 'text-white'}`} />
                </button>
              </div>

              <h3 className="text-xs font-semibold text-[#1F2937] mb-0.5 truncate">{product.title}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Modal */}
      {showFilter && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center" onClick={() => setShowFilter(false)}>
          <div className="bg-white w-full rounded-t-3xl p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-[#1F2937] mb-4">Sort & Filter</h3>
            
            <div className="space-y-2">
              {[
                { value: "featured", label: "Recently Added" },
                { value: "price-low", label: "Price: Low to High" },
                { value: "price-high", label: "Price: High to Low" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => { setSortBy(option.value); setShowFilter(false); }}
                  className={`w-full p-3 rounded-xl text-left text-sm font-medium ${
                    sortBy === option.value 
                      ? 'bg-[#00A36C] text-white' 
                      : 'bg-[#F3F4F6] text-[#1F2937]'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}