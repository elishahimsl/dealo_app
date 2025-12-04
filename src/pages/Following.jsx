import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Heart, ArrowRight, MoreHorizontal, Star, Bell, BellRing, Sparkles, X, Tag } from "lucide-react";

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
        {/* Animated back/deal icon */}
        <button onClick={() => navigate(-1)} className="relative w-8 h-8 flex items-center justify-center group">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#00A36C] to-[#007E52] opacity-90 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0 rounded-full animate-ping-slow bg-[#00A36C] opacity-20" />
          <Tag className="w-4 h-4 text-white relative z-10 transform -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
        </button>
        
        <h1 className="text-base font-medium text-[#1F2937]" style={{ fontFamily: 'Inter, sans-serif' }}>Following</h1>
        
        <button className="text-xs font-medium text-[#6B7280]">Manage</button>
      </div>

      {/* Store Cards */}
      <div className="px-6 space-y-6">
        {followedStores.map((store) => (
          <div key={store.id} className="relative pt-1">
            {/* Stacked card effect - Deal tile underneath - more visible */}
            <div 
              className="absolute -bottom-3 left-1 right-1 h-20 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, #2a2a2a 0%, #3d3d3d 50%, #4a4a4a 100%)',
                boxShadow: '0 6px 25px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
              }}
            />
            
            {/* Deal content in bottom tile - positioned to be visible */}
            <div className="absolute -bottom-3 left-1 right-1 h-20 rounded-2xl flex items-end justify-center gap-2 z-0 pb-2">
              <span className="bg-[#00A36C] text-white text-[10px] font-bold px-2 py-1 rounded">{store.deal}</span>
              <span className="text-white text-[11px] font-light">{store.dealText}</span>
            </div>

            {/* Top Card - Products with gradient border effect */}
            <div 
              className="rounded-2xl p-[2px] relative z-10 mb-5"
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
                  <div className="w-6 h-6 rounded-full bg-[#1F2937]/60 flex items-center justify-center">
                    <ArrowRight className="w-3 h-3 text-white" />
                  </div>
                </Link>
              </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Notification Modal */}
      {showNotifModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center" onClick={() => setShowNotifModal(null)}>
          <div className="bg-white w-full rounded-t-3xl p-6 pb-10" onClick={e => e.stopPropagation()}>
            {/* Close button */}
            <button onClick={() => setShowNotifModal(null)} className="absolute top-4 right-4">
              <X className="w-5 h-5 text-[#6B7280]" />
            </button>

            <h3 className="text-lg font-bold text-[#1F2937] mb-1">Notifications</h3>
            <p className="text-xs text-[#6B7280] mb-4">Get alerts from {followedStores.find(s => s.id === showNotifModal)?.name}</p>

            <div className="space-y-3">
              <button 
                onClick={() => toggleNotification(showNotifModal, 'deals')}
                className={`w-full p-4 rounded-2xl flex items-center gap-3 transition-colors ${
                  notifications[showNotifModal]?.deals 
                    ? 'bg-[#00A36C]/10 border-2 border-[#00A36C]' 
                    : 'bg-[#F3F4F6] border-2 border-transparent'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  notifications[showNotifModal]?.deals ? 'bg-[#00A36C]' : 'bg-[#E5E7EB]'
                }`}>
                  <Tag className={`w-5 h-5 ${notifications[showNotifModal]?.deals ? 'text-white' : 'text-[#6B7280]'}`} />
                </div>
                <div className="text-left flex-1">
                  <p className="text-sm font-semibold text-[#1F2937]">Deal Alerts</p>
                  <p className="text-xs text-[#6B7280]">Get notified about new deals & discounts</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  notifications[showNotifModal]?.deals ? 'border-[#00A36C] bg-[#00A36C]' : 'border-[#D1D5DB]'
                }`}>
                  {notifications[showNotifModal]?.deals && <span className="text-white text-xs">✓</span>}
                </div>
              </button>

              <button 
                onClick={() => toggleNotification(showNotifModal, 'arrivals')}
                className={`w-full p-4 rounded-2xl flex items-center gap-3 transition-colors ${
                  notifications[showNotifModal]?.arrivals 
                    ? 'bg-[#00A36C]/10 border-2 border-[#00A36C]' 
                    : 'bg-[#F3F4F6] border-2 border-transparent'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  notifications[showNotifModal]?.arrivals ? 'bg-[#00A36C]' : 'bg-[#E5E7EB]'
                }`}>
                  <Sparkles className={`w-5 h-5 ${notifications[showNotifModal]?.arrivals ? 'text-white' : 'text-[#6B7280]'}`} />
                </div>
                <div className="text-left flex-1">
                  <p className="text-sm font-semibold text-[#1F2937]">New Arrivals</p>
                  <p className="text-xs text-[#6B7280]">Be first to know about new products</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  notifications[showNotifModal]?.arrivals ? 'border-[#00A36C] bg-[#00A36C]' : 'border-[#D1D5DB]'
                }`}>
                  {notifications[showNotifModal]?.arrivals && <span className="text-white text-xs">✓</span>}
                </div>
              </button>

              <button 
                onClick={() => toggleNotification(showNotifModal, 'priceDrop')}
                className={`w-full p-4 rounded-2xl flex items-center gap-3 transition-colors ${
                  notifications[showNotifModal]?.priceDrop 
                    ? 'bg-[#00A36C]/10 border-2 border-[#00A36C]' 
                    : 'bg-[#F3F4F6] border-2 border-transparent'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  notifications[showNotifModal]?.priceDrop ? 'bg-[#00A36C]' : 'bg-[#E5E7EB]'
                }`}>
                  <BellRing className={`w-5 h-5 ${notifications[showNotifModal]?.priceDrop ? 'text-white' : 'text-[#6B7280]'}`} />
                </div>
                <div className="text-left flex-1">
                  <p className="text-sm font-semibold text-[#1F2937]">Price Drops</p>
                  <p className="text-xs text-[#6B7280]">Alert me when prices go down</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  notifications[showNotifModal]?.priceDrop ? 'border-[#00A36C] bg-[#00A36C]' : 'border-[#D1D5DB]'
                }`}>
                  {notifications[showNotifModal]?.priceDrop && <span className="text-white text-xs">✓</span>}
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