import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart } from "lucide-react";

export default function TrendingProducts() {
  const navigate = useNavigate();

  const trendingProducts = [
    { id: 1, price: "$89.99", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400" },
    { id: 2, price: "$199.99", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400" },
    { id: 3, price: "$59.99", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400" },
    { id: 4, price: "$24.99", image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400" },
    { id: 5, price: "$14.99", image: "https://images.unsplash.com/photo-1585419372611-f0ffebad6659?w=400" },
    { id: 6, price: "$34.99", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400" },
    { id: 7, price: "$129.99", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400" },
    { id: 8, price: "$79.99", image: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400" },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      <div className="px-6 pt-8 pb-4">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6 text-[#1F2937]" />
          </button>
          <h1 className="text-2xl font-bold text-[#1F2937]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Trending Products
          </h1>
        </div>
      </div>

      <div className="px-6">
        <div className="grid grid-cols-2 gap-3">
          {trendingProducts.map((product) => (
            <div key={product.id} className="rounded-2xl overflow-hidden shadow-sm relative aspect-square">
              <img 
                src={product.image} 
                alt="Product"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm rounded-md px-1 py-0.5">
                <span className="text-[9px] font-bold text-white">{product.price}</span>
              </div>
              <button className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-[#6B7280]/40 flex items-center justify-center hover:bg-[#00A36C] transition-colors">
                <Heart className="w-3 h-3 text-white" strokeWidth={2} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}