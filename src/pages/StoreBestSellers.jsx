import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Heart, Star, SlidersHorizontal } from "lucide-react";

export default function StoreBestSellers() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const storeName = urlParams.get("store") || "Target";
  
  const [favorites, setFavorites] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [sortBy, setSortBy] = useState("featured");

  const bestSellers = [
    { id: 1, title: "Striped Pillow", price: "$24.99", rating: 4.8, reviews: 548, image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=300", badge: "#1 Best Seller" },
    { id: 2, title: "White Cups Set", price: "$34.99", rating: 4.7, reviews: 418, image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=300", badge: null },
    { id: 3, title: "Throw Blanket", price: "$29.99", rating: 4.9, reviews: 892, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300", badge: "#2 Best Seller" },
    { id: 4, title: "Scented Candles", price: "$18.99", rating: 4.6, reviews: 1256, image: "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=300", badge: null },
    { id: 5, title: "Kitchen Towels", price: "$12.99", rating: 4.5, reviews: 367, image: "https://images.unsplash.com/photo-1583845112203-29329902332e?w=300", badge: null },
    { id: 6, title: "Storage Basket", price: "$22.99", rating: 4.8, reviews: 703, image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300", badge: "#3 Best Seller" },
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
        <h1 className="text-base font-semibold text-[#1F2937]">{storeName} Best Sellers</h1>
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
          {bestSellers.map((product) => (
            <div key={product.id}>
              <div className="aspect-square rounded-2xl overflow-hidden relative mb-2">
                <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                
                {product.badge && (
                  <div className="absolute bottom-2 left-2 bg-black/40 backdrop-blur-sm text-white text-[8px] font-bold px-2 py-0.5 rounded">
                    {product.badge}
                  </div>
                )}

                <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm rounded px-1.5 py-0.5 inline-flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white leading-none">{product.price}</span>
                </div>

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
              
              <div className="flex items-center gap-0.5 mb-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-2.5 h-2.5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                  />
                ))}
                <span className="text-[9px] text-[#6B7280] ml-0.5">({product.reviews})</span>
              </div>
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
                { value: "featured", label: "Featured" },
                { value: "rating", label: "Highest Rated" },
                { value: "reviews", label: "Most Reviews" },
                { value: "price-low", label: "Price: Low to High" },
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