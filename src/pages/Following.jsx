import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Heart, ArrowRight, MoreHorizontal, Star, BellRing, Sparkles, Tag } from "lucide-react";

export default function Following() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [showNotifModal, setShowNotifModal] = useState(null);
  const [notifications, setNotifications] = useState({});

  const toggleFavorite = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const toggleNotification = (storeId, type) => {
    setNotifications(prev => ({
      ...prev,
      [storeId]: {
        ...prev[storeId],
        [type]: !prev[storeId]?.[type]
      }
    }));
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
    <div className="min-h-screen bg-[#EDEEF0] pb-24">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex items-center justify-between">
        {/* Animated back/deal icon - no circle */}
        <button onClick={() => navigate(-1)} className="relative flex items-center justify-center group">
          <Tag className="w-5 h-5 text-[#00A36C] transform -rotate-45 group-hover:rotate-0 transition-transform duration-300 group-hover:scale-110" />
        </button>
        
        <h1 className="text-base font-medium text-[#1F2937]" style={{ fontFamily: 'Inter, sans-serif' }}>Following</h1>
        
        <button onClick={() => navigate(createPageUrl("FollowingList"))} className="text-xs font-medium text-[#6B7280]">Manage</button>
      </div>

      {/* Store Cards */}
      <div className="px-6 space-y-6">
        {followedStores.map((store) => (
          <div key={store.id} className="relative pt-1">
            {/* Stacked card effect - Deal tile underneath - much more visible */}
            <div 
              className="absolute -bottom-12 left-1 right-1 h-32 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, #2a2a2a 0%, #3d3d3d 50%, #4a4a4a 100%)',
                boxShadow: '0 6px 25px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
              }}
            />
            
            {/* Deal content in bottom tile - at bottom */}
            <div className="absolute -bottom-12 left-1 right-1 h-32 rounded-2xl flex items-end justify-center gap-2 z-0 pb-3">
              <span className="bg-[#00A36C] text-white text-[10px] font-bold px-2 py-1 rounded">{store.deal}</span>
              <span className="text-white text-[11px] font-light">{store.dealText}</span>
            </div>

            {/* Top Card - Products with gradient border effect */}
            <div 
              className="rounded-2xl p-[2px] relative z-10 mb-14"
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(200,200,200,0.4) 50%, rgba(150,150,150,0.3) 100%)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
              }}
            >
              <div className="bg-white rounded-2xl p-4">
              {/* Store Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {/* Logo - no border */}
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                    <img src={store.logo} alt={store.name} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-[#1F2937]">{store.name}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-medium text-[#1F2937]">{store.rating}</span>
                      <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                      <span className="text-[10px] text-[#6B7280]">({store.reviews})</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setShowNotifModal(store.id)}>
                  <MoreHorizontal className="w-5 h-5 text-[#6B7280]" />
                </button>
              </div>

              {/* Products - Horizontal Scroll */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
                {store.products.map((product) => (
                  <div key={product.id} className="flex-shrink-0 rounded-xl overflow-hidden bg-[#F3F4F6] relative" style={{ width: '100px' }}>
                    <div className="aspect-square relative">
                      <img src={product.image} alt="" className="w-full h-full object-cover" />
                      
                      {/* Price badge - more transparent, centered text */}
                      <div className="absolute top-1.5 left-1.5 bg-black/40 backdrop-blur-sm rounded px-1.5 py-1 flex items-center justify-center">
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
                <div className="leading-tight">
                  <span className="text-xs font-bold text-[#1F2937]" style={{ fontFamily: 'Inter, sans-serif' }}>{store.newItems} New</span>
                  <br />
                  <span className="text-[10px] text-[#9CA3AF]">Items Added</span>
                </div>
                <Link to={createPageUrl("StoreDetail") + `?store=${encodeURIComponent(store.name)}`}>
                  <div className="w-7 h-7 rounded-full bg-transparent flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-[#1F2937]" />
                  </div>
                </Link>
              </div>
              </div>
            </div>
          </div>
        ))}
      </div>



      {/* Notification Modal - Compact */}
      {showNotifModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-6" onClick={() => setShowNotifModal(null)}>
          <div className="bg-white rounded-2xl p-4 w-full max-w-xs shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-bold text-[#1F2937] mb-3">Notifications</h3>

            <div className="space-y-2">
              <button 
                onClick={() => toggleNotification(showNotifModal, 'deals')}
                className={`w-full p-2.5 rounded-xl flex items-center gap-2 transition-colors ${
                  notifications[showNotifModal]?.deals 
                    ? 'bg-[#00A36C]/10' 
                    : 'bg-[#F3F4F6]'
                }`}
              >
                <Tag className={`w-4 h-4 ${notifications[showNotifModal]?.deals ? 'text-[#00A36C]' : 'text-[#6B7280]'}`} />
                <span className="text-xs font-medium text-[#1F2937] flex-1 text-left">Deals</span>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  notifications[showNotifModal]?.deals ? 'border-[#00A36C] bg-[#00A36C]' : 'border-[#D1D5DB]'
                }`}>
                  {notifications[showNotifModal]?.deals && <span className="text-white text-[8px]">✓</span>}
                </div>
              </button>

              <button 
                onClick={() => toggleNotification(showNotifModal, 'arrivals')}
                className={`w-full p-2.5 rounded-xl flex items-center gap-2 transition-colors ${
                  notifications[showNotifModal]?.arrivals 
                    ? 'bg-[#00A36C]/10' 
                    : 'bg-[#F3F4F6]'
                }`}
              >
                <Sparkles className={`w-4 h-4 ${notifications[showNotifModal]?.arrivals ? 'text-[#00A36C]' : 'text-[#6B7280]'}`} />
                <span className="text-xs font-medium text-[#1F2937] flex-1 text-left">New Arrivals</span>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  notifications[showNotifModal]?.arrivals ? 'border-[#00A36C] bg-[#00A36C]' : 'border-[#D1D5DB]'
                }`}>
                  {notifications[showNotifModal]?.arrivals && <span className="text-white text-[8px]">✓</span>}
                </div>
              </button>

              <button 
                onClick={() => toggleNotification(showNotifModal, 'priceDrop')}
                className={`w-full p-2.5 rounded-xl flex items-center gap-2 transition-colors ${
                  notifications[showNotifModal]?.priceDrop 
                    ? 'bg-[#00A36C]/10' 
                    : 'bg-[#F3F4F6]'
                }`}
              >
                <BellRing className={`w-4 h-4 ${notifications[showNotifModal]?.priceDrop ? 'text-[#00A36C]' : 'text-[#6B7280]'}`} />
                <span className="text-xs font-medium text-[#1F2937] flex-1 text-left">Price Drops</span>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  notifications[showNotifModal]?.priceDrop ? 'border-[#00A36C] bg-[#00A36C]' : 'border-[#D1D5DB]'
                }`}>
                  {notifications[showNotifModal]?.priceDrop && <span className="text-white text-[8px]">✓</span>}
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.3); opacity: 0; }
          100% { transform: scale(1); opacity: 0.2; }
        }
        .animate-ping-slow {
          animation: ping-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}