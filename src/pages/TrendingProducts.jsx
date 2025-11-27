import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart } from "lucide-react";

export default function TrendingProducts() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);

  const products = [
    { id: 1, price: "$89.99", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400", title: "Wireless Headphones", badge: "Trending Now" },
    { id: 2, price: "$249.99", image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=400", title: "Gaming Chair" },
    { id: 3, price: "$699.99", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400", title: "4K Smart TV" },
    { id: 4, price: "$59.99", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400", title: "Bluetooth Speaker" },
    { id: 5, price: "$199.99", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400", title: "Smart Watch" },
    { id: 6, price: "$149.99", image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400", title: "Fitness Tracker" },
    { id: 7, price: "$299.99", image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400", title: "Noise Cancelling Buds" },
    { id: 8, price: "$449.99", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", title: "Wireless Speaker" },
  ];

  const toggleFavorite = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-center relative">
          <button onClick={() => navigate(-1)} className="absolute left-0">
            <ArrowLeft className="w-5 h-5 text-[#1F2937]" />
          </button>
          <h1 className="text-base text-[#1F2937]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
            Trending
          </h1>
        </div>
      </div>

      {/* Featured Product */}
      <div className="px-6 mb-4">
        <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-28 h-28 rounded-xl bg-[#F3F4F6] flex items-center justify-center overflow-hidden">
              <img src={products[0].image} alt="" className="w-full h-full object-contain p-2" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-[#1F2937] text-lg mb-1">{products[0].title}</h3>
              <p className="text-xl font-bold text-[#1F2937] mb-2">{products[0].price}</p>
              <span className="inline-block px-3 py-1 rounded-full bg-[#00A36C] text-white text-xs font-semibold">
                Trending Now
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-6">
        <div className="grid grid-cols-2 gap-3">
          {products.slice(1).map((product) => (
            <div key={product.id} className="bg-white rounded-2xl p-3 border border-[#E5E7EB] shadow-sm relative">
              <button 
                onClick={() => toggleFavorite(product.id)}
                className={`absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center z-10 ${favorites.includes(product.id) ? 'bg-[#00A36C]' : 'bg-white/80'}`}
              >
                <Heart className={`w-4 h-4 ${favorites.includes(product.id) ? 'text-white fill-white' : 'text-[#6B7280]'}`} />
              </button>
              <div className="w-full h-24 rounded-xl bg-[#F3F4F6] flex items-center justify-center mb-2 overflow-hidden">
                <img src={product.image} alt="" className="w-full h-full object-contain p-2" />
              </div>
              <h4 className="font-bold text-[#1F2937] text-sm text-center">{product.title}</h4>
              <p className="text-[#1F2937] text-sm font-bold text-center">{product.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}