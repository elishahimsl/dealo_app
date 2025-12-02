import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, MoreHorizontal } from "lucide-react";

export default function AllDeals() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const storeDeals = [
    {
      store: "Walmart",
      storeLogo: "https://logo.clearbit.com/walmart.com",
      storeColor: "#0071CE",
      discount: "30",
      category: "Toys",
      image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400",
      products: [
        { id: 201, title: "LEGO Set", discount: "25%", image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=300" },
        { id: 202, title: "Action Figure", discount: "30%", image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=300" },
        { id: 203, title: "Board Game", discount: "20%", image: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=300" },
        { id: 204, title: "Stuffed Animal", discount: "35%", image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=300" },
      ]
    },
    {
      store: "Amazon",
      storeLogo: "https://logo.clearbit.com/amazon.com",
      storeColor: "#FF9900",
      discount: "70",
      category: "PJ's & More",
      image: "https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?w=400",
      products: [
        { id: 301, title: "White Shirt", discount: "18%", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300" },
        { id: 302, title: "Pants", discount: "15%", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300" },
        { id: 303, title: "Goggles", discount: "36%", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300" },
        { id: 304, title: "Polo", discount: "86%", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300" },
      ]
    },
    {
      store: "Target",
      storeLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Target_logo.svg/1200px-Target_logo.svg.png",
      storeColor: "#CC0000",
      discount: "50",
      category: "Active Wear",
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400",
      products: [
        { id: 401, title: "Running Socks", discount: "50%", image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300" },
        { id: 402, title: "Athletic Shorts", discount: "37%", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300" },
        { id: 403, title: "Sports Bra", discount: "40%", image: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=300" },
        { id: 404, title: "Yoga Pants", discount: "45%", image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=300" },
      ]
    },
    {
      store: "Best Buy",
      storeLogo: "https://logo.clearbit.com/bestbuy.com",
      storeColor: "#0046BE",
      discount: "40",
      category: "Electronics",
      image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400",
      products: [
        { id: 501, title: "Headphones", discount: "35%", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300" },
        { id: 502, title: "Tablet", discount: "20%", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300" },
        { id: 503, title: "Smart Watch", discount: "28%", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300" },
        { id: 504, title: "Speaker", discount: "42%", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300" },
      ]
    },
    {
      store: "Nike",
      storeLogo: "https://logo.clearbit.com/nike.com",
      storeColor: "#111111",
      discount: "35",
      category: "Footwear",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
      products: [
        { id: 601, title: "Air Max", discount: "30%", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300" },
        { id: 602, title: "Running Shoes", discount: "25%", image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=300" },
        { id: 603, title: "Jordan 1", discount: "35%", image: "https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=300" },
        { id: 604, title: "Slides", discount: "40%", image: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=300" },
      ]
    },
    {
      store: "Home Depot",
      storeLogo: "https://logo.clearbit.com/homedepot.com",
      storeColor: "#F96302",
      discount: "25",
      category: "Tools & Garden",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
      products: [
        { id: 701, title: "Power Drill", discount: "20%", image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=300" },
        { id: 702, title: "Tool Set", discount: "25%", image: "https://images.unsplash.com/photo-1581147036324-c17ac41f3e6a?w=300" },
        { id: 703, title: "Garden Hose", discount: "30%", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300" },
        { id: 704, title: "Paint Kit", discount: "22%", image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=300" },
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
        {storeDeals.map((storeDeal, storeIdx) => (
          <div key={storeIdx}>
            {/* Store Banner with half-circle pin cutout - wider */}
            <div className="rounded-2xl overflow-hidden relative mb-3" style={{ height: '110px' }}>
              {/* Store color gradient - left to right, muted */}
              <div 
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to right, ${storeDeal.storeColor}cc 0%, ${storeDeal.storeColor}aa 35%, ${storeDeal.storeColor}77 55%, #3a3a3a 70%, #2d2d2d 85%)`
                }}
              />
              
              {/* Half-circle pin cutout on right with product */}
              <div className="absolute right-0 top-0 bottom-0 w-28 flex items-center justify-center overflow-hidden">
                <div 
                  className="absolute right-0 w-24 h-24 rounded-full bg-[#2d2d2d] flex items-center justify-center"
                  style={{ marginRight: '-12px' }}
                >
                  <span className="absolute top-1 left-2 text-white/50 text-[6px]">✦</span>
                  <span className="absolute top-3 right-2 text-white/40 text-[5px]">✦</span>
                  <span className="absolute bottom-2 left-3 text-white/45 text-[5px]">✦</span>
                  <img src={storeDeal.image} alt="" className="w-14 h-14 object-contain drop-shadow-lg" />
                </div>
              </div>

              {/* Content */}
              <div className="absolute inset-0 p-4 flex flex-col justify-center pr-32">
                <div className="flex items-center gap-1.5 mb-1">
                  <img src={storeDeal.storeLogo} alt="" className="w-5 h-5 rounded object-contain" />
                  <span className="text-white text-xs font-medium">{storeDeal.store}</span>
                </div>
                
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-white text-xs font-medium">Up to</span>
                  <span className="text-white text-xl font-black">{storeDeal.discount}</span>
                  <div className="flex flex-col leading-none">
                    <span className="text-white text-[8px] font-bold">%</span>
                    <span className="text-white text-[8px] font-semibold">off</span>
                  </div>
                  <span className="text-white/90 text-xs ml-1">{storeDeal.category}</span>
                </div>
                
                <button className="bg-white/20 backdrop-blur-sm text-white border border-white/40 px-3 py-1 rounded-full text-[10px] font-semibold w-fit">
                  Shop Now
                </button>
              </div>
            </div>

            {/* Store Products Grid */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-3">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <img src={storeDeal.storeLogo} alt="" className="w-4 h-4 rounded object-contain" />
                  <span className="text-xs font-semibold text-[#1F2937]">{storeDeal.store} Deals</span>
                </div>
                <button className="flex items-center justify-center">
                  <MoreHorizontal className="w-5 h-5 text-[#6B7280]" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {storeDeal.products.map((product) => (
                  <div key={product.id} className="rounded-xl overflow-hidden bg-[#F3F4F6]">
                    <div className="relative" style={{ height: '100px' }}>
                      <img src={product.image} alt="" className="w-full h-full object-contain p-2" />
                      
                      <div 
                        className="absolute inset-0"
                        style={{
                          background: `linear-gradient(to top, ${storeDeal.storeColor}dd 0%, ${storeDeal.storeColor}aa 30%, ${storeDeal.storeColor}55 45%, transparent 55%)`
                        }}
                      />
                      
                      <button 
                        onClick={() => toggleFavorite(product.id)}
                        className={`absolute bottom-2 right-2 w-5 h-5 rounded-full flex items-center justify-center border ${
                          favorites.includes(product.id) 
                            ? 'bg-[#00A36C] border-[#00A36C]' 
                            : 'bg-white/20 border-white'
                        }`}
                      >
                        <Heart className={`w-2.5 h-2.5 ${favorites.includes(product.id) ? 'text-white fill-white' : 'text-white'}`} />
                      </button>

                      <div className="absolute bottom-2 left-2">
                        <span className="text-white text-[9px] font-bold block">{product.discount} off</span>
                        <span className="text-white text-[10px] font-medium">{product.title}</span>
                      </div>
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