import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart } from "lucide-react";

export default function AllDeals() {
  const navigate = useNavigate();

  const storeDeals = [
    {
      store: "Amazon",
      storeLogo: "https://logo.clearbit.com/amazon.com",
      mainDeal: { title: "Amazon Essentials", discount: "Up to 70% off", description: "PJ's & More", image: "https://images.unsplash.com/photo-1631947430066-48c30d57b943?w=400" },
      products: [
        { id: 1, title: "White Shirt", discount: "18% off", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300" },
        { id: 2, title: "Pants", discount: "15% off", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300" },
        { id: 3, title: "Goggles", discount: "36% off", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300" },
        { id: 4, title: "Polo", discount: "86% off", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300" },
      ]
    },
    {
      store: "Target",
      storeLogo: "https://logo.clearbit.com/target.com",
      mainDeal: { title: "Target Circle Week", discount: "Up to 50% off", description: "Home & Kitchen", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400" },
      products: [
        { id: 1, title: "Throw Blanket", discount: "40% off", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300" },
        { id: 2, title: "Candles", discount: "25% off", image: "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=300" },
        { id: 3, title: "Pillows", discount: "30% off", image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=300" },
        { id: 4, title: "Rug", discount: "45% off", image: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=300" },
      ]
    },
    {
      store: "Walmart",
      storeLogo: "https://logo.clearbit.com/walmart.com",
      mainDeal: { title: "Rollback Deals", discount: "Up to 60% off", description: "Electronics", image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400" },
      products: [
        { id: 1, title: "Headphones", discount: "35% off", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300" },
        { id: 2, title: "Tablet", discount: "20% off", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300" },
        { id: 3, title: "Smart Watch", discount: "28% off", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300" },
        { id: 4, title: "Speaker", discount: "42% off", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300" },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 bg-white border-b border-[#E5E7EB]">
        <div className="flex items-center justify-center relative">
          <button onClick={() => navigate(-1)} className="absolute left-0">
            <ArrowLeft className="w-5 h-5 text-[#1F2937]" />
          </button>
          <h1 className="text-base font-bold text-[#1F2937]">All Deals</h1>
        </div>
      </div>

      <div className="px-6 py-4 space-y-6">
        {storeDeals.map((store, storeIdx) => (
          <div key={storeIdx}>
            {/* Main Deal Banner */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-4 mb-3">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <img src={store.storeLogo} alt="" className="w-5 h-5 rounded" />
                    <span className="text-sm font-semibold text-[#1F2937]">{store.mainDeal.title}</span>
                  </div>
                  <p className="text-lg font-bold text-[#1F2937] mb-1">{store.mainDeal.discount}</p>
                  <p className="text-sm text-[#6B7280] mb-3">{store.mainDeal.description}</p>
                  <button className="bg-[#1F2937] text-white px-4 py-1.5 rounded-full text-xs font-semibold">
                    Shop Now
                  </button>
                </div>
                <div className="w-24 h-24 bg-[#F3F4F6] rounded-xl overflow-hidden">
                  <img src={store.mainDeal.image} alt="" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            {/* Store Products */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <img src={store.storeLogo} alt="" className="w-5 h-5 rounded" />
                  <span className="text-sm font-semibold text-[#1F2937]">{store.store} Deals</span>
                </div>
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1F2937]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E5E7EB]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E5E7EB]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {store.products.map((product) => (
                  <div key={product.id} className="bg-[#F3F4F6] rounded-xl p-3 relative">
                    <div className="h-20 flex items-center justify-center mb-2">
                      <img src={product.image} alt="" className="h-full object-contain" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs bg-[#D6F5E9] text-[#00A36C] px-2 py-0.5 rounded font-semibold">{product.discount}</span>
                        <p className="text-xs text-[#1F2937] mt-1">{product.title}</p>
                      </div>
                      <button>
                        <Heart className="w-4 h-4 text-[#6B7280]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}