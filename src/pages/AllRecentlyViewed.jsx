import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Heart } from "lucide-react";

export default function AllRecentlyViewed() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);

  const recentlyViewed = [
    { id: 1, price: "$89.99", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300", title: "Wireless Headphones", brand: "Sony" },
    { id: 2, price: "$59.99", image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300", title: "Bluetooth Speaker", brand: "JBL" },
    { id: 3, price: "$149.99", image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300", title: "Smart Watch", brand: "Apple" },
    { id: 4, price: "$79.99", image: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=300", title: "Sneakers", brand: "Nike" },
    { id: 5, price: "$129.99", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300", title: "Smart Watch", brand: "Samsung" },
    { id: 6, price: "$199.99", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300", title: "Laptop", brand: "Apple" },
    { id: 7, price: "$39.99", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300", title: "Sunglasses", brand: "Ray-Ban" },
    { id: 8, price: "$299.99", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300", title: "Running Shoes", brand: "Nike" },
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
        <h1 className="text-base font-semibold text-[#1F2937]">Recently Viewed</h1>
        <div className="w-5" />
      </div>

      {/* Products Grid */}
      <div className="px-6">
        <div className="grid grid-cols-2 gap-3">
          {recentlyViewed.map((item) => (
            <div key={item.id}>
              <div className="aspect-square rounded-2xl overflow-hidden relative mb-2">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                <button 
                  onClick={() => toggleFavorite(item.id)}
                  className={`absolute bottom-2 right-2 w-6 h-6 rounded-full flex items-center justify-center ${
                    favorites.includes(item.id) ? 'bg-[#00A36C]' : 'bg-[#6B7280]/60'
                  }`}
                >
                  <Heart className={`w-3 h-3 ${favorites.includes(item.id) ? 'text-white fill-white' : 'text-white'}`} />
                </button>
              </div>
              <p className="text-xs font-medium text-[#1F2937] line-clamp-1">{item.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}