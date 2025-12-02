import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Heart, ChevronRight, MoreHorizontal } from "lucide-react";

export default function Following() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const followedStores = [
    {
      id: 1,
      name: "Nike",
      logo: "https://logo.clearbit.com/nike.com",
      checkmark: true,
      products: [
        { id: 101, price: "$79.99", originalPrice: "$149.99", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300" },
        { id: 102, price: "$46.99", image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300" },
        { id: 103, price: "$189.99", image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300" },
      ],
      deal: "Save $25 on shirts under $50"
    },
    {
      id: 2,
      name: "Adidas",
      logo: "https://logo.clearbit.com/adidas.com",
      checkmark: true,
      products: [
        { id: 201, price: "$86.99", image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=300" },
        { id: 202, price: "$110.99", image: "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=300" },
        { id: 203, price: "$57.99", image: "https://images.unsplash.com/photo-1562183241-b937e95585b6?w=300" },
      ],
      deal: "Save $10 on orders over $100"
    },
    {
      id: 3,
      name: "Target",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Target_logo.svg/1200px-Target_logo.svg.png",
      checkmark: false,
      products: [
        { id: 301, price: "$24.99", image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=300" },
        { id: 302, price: "$18.99", image: "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=300" },
        { id: 303, price: "$34.99", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300" },
      ],
      deal: "20% off home decor this week"
    },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5 text-[#1F2937]" />
          </button>
          <h1 className="text-lg font-bold text-[#1F2937]">Following</h1>
        </div>
        <button className="text-sm font-medium text-[#00A36C]">Manage</button>
      </div>

      {/* Store Cards */}
      <div className="px-6 space-y-4">
        {followedStores.map((store) => (
          <div key={store.id} className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
            {/* Store Header */}
            <div className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[#1F2937]">{store.name}</span>
                {store.checkmark && (
                  <span className="text-[#00A36C] text-xs">✓</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button>
                  <MoreHorizontal className="w-5 h-5 text-[#6B7280]" />
                </button>
                <Link to={createPageUrl("StoreDetail") + `?store=${encodeURIComponent(store.name)}`}>
                  <ChevronRight className="w-5 h-5 text-[#6B7280]" />
                </Link>
              </div>
            </div>

            {/* Products Grid - 3 in a row */}
            <div className="px-3 pb-3 grid grid-cols-3 gap-2">
              {store.products.map((product) => (
                <div key={product.id} className="rounded-xl overflow-hidden bg-[#F3F4F6] relative">
                  <div className="aspect-square relative">
                    <img src={product.image} alt="" className="w-full h-full object-cover" />
                    
                    {/* Price badge - top left */}
                    <div className="absolute top-1.5 left-1.5 bg-white/90 backdrop-blur-sm rounded px-1.5 py-0.5">
                      <span className="text-[9px] font-bold text-[#1F2937]">{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-[8px] text-[#6B7280] line-through ml-1">{product.originalPrice}</span>
                      )}
                    </div>

                    {/* Heart - bottom right */}
                    <button 
                      onClick={() => toggleFavorite(product.id)}
                      className={`absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center ${
                        favorites.includes(product.id) 
                          ? 'bg-[#00A36C]' 
                          : 'bg-[#6B7280]/60'
                      }`}
                    >
                      <Heart className={`w-3 h-3 ${favorites.includes(product.id) ? 'text-white fill-white' : 'text-white'}`} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Deal Banner */}
            <div className="bg-[#F3F4F6] px-3 py-2 text-center">
              <span className="text-[10px] font-medium text-[#1F2937]">{store.deal}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}