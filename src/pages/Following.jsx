import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Heart, ChevronRight, MoreHorizontal, Star } from "lucide-react";

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
      rating: 4.8,
      reviews: "12.5k",
      newItems: 3,
      products: [
        { id: 101, price: "$79.99", originalPrice: "$149.99", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300" },
        { id: 102, price: "$46.99", image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300" },
        { id: 103, price: "$189.99", image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300" },
        { id: 104, price: "$129.99", image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=300" },
        { id: 105, price: "$89.99", image: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=300" },
      ],
      deal: "Save $25",
      dealText: "on shirts under $50"
    },
    {
      id: 2,
      name: "Adidas",
      logo: "https://logo.clearbit.com/adidas.com",
      rating: 4.6,
      reviews: "9.2k",
      newItems: 5,
      products: [
        { id: 201, price: "$86.99", image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=300" },
        { id: 202, price: "$110.99", image: "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=300" },
        { id: 203, price: "$57.99", image: "https://images.unsplash.com/photo-1562183241-b937e95585b6?w=300" },
        { id: 204, price: "$74.99", image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=300" },
      ],
      deal: "Save $10",
      dealText: "on orders over $100"
    },
    {
      id: 3,
      name: "Target",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Target_logo.svg/1200px-Target_logo.svg.png",
      rating: 4.5,
      reviews: "17.5k",
      newItems: 8,
      products: [
        { id: 301, price: "$24.99", image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=300" },
        { id: 302, price: "$18.99", image: "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=300" },
        { id: 303, price: "$34.99", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300" },
      ],
      deal: "20% off",
      dealText: "home decor this week"
    },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5 text-[#1F2937]" />
        </button>
        <h1 className="text-base font-bold text-[#1F2937]">Following</h1>
        <button className="text-xs font-medium text-[#6B7280]">Manage</button>
      </div>

      {/* Store Cards */}
      <div className="px-6 space-y-4">
        {followedStores.map((store) => (
          <div key={store.id} className="overflow-hidden">
            {/* Top Card - Products */}
            <div className="bg-white rounded-t-3xl border border-[#E5E7EB] border-b-0 p-4">
              {/* Store Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {/* Logo in green bordered box */}
                  <div className="w-8 h-8 rounded-lg border-2 border-[#00A36C] flex items-center justify-center bg-white p-1">
                    <img src={store.logo} alt={store.name} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-[#1F2937]">{store.name}</span>
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-2.5 h-2.5 ${i < Math.floor(store.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <span className="text-[10px] text-[#6B7280]">({store.reviews})</span>
                    </div>
                  </div>
                </div>
                <button>
                  <MoreHorizontal className="w-5 h-5 text-[#6B7280]" />
                </button>
              </div>

              {/* Products - Horizontal Scroll */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
                {store.products.map((product) => (
                  <div key={product.id} className="flex-shrink-0 rounded-xl overflow-hidden bg-[#F3F4F6] relative" style={{ width: '100px' }}>
                    <div className="aspect-square relative">
                      <img src={product.image} alt="" className="w-full h-full object-cover" />
                      
                      {/* Price badge - black bg, white text, tight fit */}
                      <div className="absolute top-1.5 left-1.5 bg-black rounded px-1.5 py-0.5">
                        <span className="text-[10px] font-bold text-white leading-none">{product.price}</span>
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

              {/* New Items + Arrow row */}
              <div className="flex items-center justify-between mt-3">
                <div className="text-[10px] text-[#6B7280]">
                  <span className="font-semibold text-[#1F2937]">{store.newItems} New</span>
                  <br />
                  <span>Items Added</span>
                </div>
                <Link to={createPageUrl("StoreDetail") + `?store=${encodeURIComponent(store.name)}`}>
                  <div className="w-8 h-8 rounded-full bg-[#E5E7EB] flex items-center justify-center">
                    <ChevronRight className="w-4 h-4 text-[#6B7280]" />
                  </div>
                </Link>
              </div>
            </div>

            {/* Bottom Card - Deal Banner */}
            <div className="bg-gradient-to-r from-[#3a3a3a] to-[#4a4a4a] rounded-b-3xl px-4 py-3 flex items-center justify-center gap-2">
              <span className="bg-[#00A36C] text-white text-[10px] font-bold px-2 py-0.5 rounded">{store.deal}</span>
              <span className="text-white text-[11px] font-light">{store.dealText}</span>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}