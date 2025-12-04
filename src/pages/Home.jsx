import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Camera, Tag, Bell, User, Bookmark, Users, Heart, X, Check } from "lucide-react";

export default function Home() {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('dealo_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [swipeIndex, setSwipeIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [likedProducts, setLikedProducts] = useState([]);
  const [dislikedProducts, setDislikedProducts] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    localStorage.setItem('dealo_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Check if user has completed onboarding swipes
  useEffect(() => {
    const hasOnboarded = localStorage.getItem('dealo_onboarded');
    if (hasOnboarded) {
      setShowSuggestions(true);
    }
  }, []);

  const toggleFavorite = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const trendingProducts = [
    { id: 1, price: "$20.00", image: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=400", title: "Smart Speaker", store: "Amazon" },
    { id: 2, price: "$25.00", image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400", title: "LA Dodger Hat", store: "Walmart" },
    { id: 3, price: "$40.00", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400", title: "Headphones", store: "Target" },
    { id: 4, price: "$89.00", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", title: "Running Shoes", store: "Nike" },
  ];

  // Swipe cards for onboarding
  const swipeCards = [
    { id: 101, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600", title: "Running Shoes", price: "$89.99", badge: "Trending", brand: "Nike" },
    { id: 102, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600", title: "Wireless Headphones", price: "$149.99", badge: "Hot Deal", brand: "Sony" },
    { id: 103, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600", title: "Smart Watch", price: "$299.99", badge: "New", brand: "Apple" },
    { id: 104, image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600", title: "Skincare Set", price: "$45.99", badge: "Popular", brand: "CeraVe" },
    { id: 105, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600", title: "Hoodie", price: "$59.99", badge: "Trending", brand: "Nike" },
    { id: 106, image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600", title: "4K Smart TV", price: "$499.99", badge: "Deal", brand: "Samsung" },
  ];

  // Smart suggestions data (shown after onboarding)
  const smartSuggestions = {
    brandsYouLiked: [
      { id: 201, brand: "Uniqlo", price: "$24.99", title: "Joggers", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400" },
      { id: 202, brand: "Nike", price: "$30.99", title: "Active Shorts", image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400" },
    ],
    storesYouLiked: [
      { id: 301, store: "Target", brand: "Xbox", price: "$500.99", title: "Xbox One", image: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400" },
      { id: 302, store: "Walmart", price: "$1,200", title: "TV 75\"", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400" },
    ],
    similarToLiked: [
      { id: 401, badge: "New", price: "$25.99", title: "Black T-Shirt", store: "Amazon", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400" },
      { id: 402, price: "$40.99", title: "Jeans", store: "Amazon", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400" },
    ],
  };

  const handleSwipe = (direction) => {
    setSwipeDirection(direction);
    const currentCard = swipeCards[swipeIndex];
    
    if (direction === 'right') {
      setLikedProducts(prev => [...prev, currentCard]);
    } else {
      setDislikedProducts(prev => [...prev, currentCard]);
    }

    setTimeout(() => {
      setSwipeDirection(null);
      if (swipeIndex < swipeCards.length - 1) {
        setSwipeIndex(prev => prev + 1);
      } else {
        // Onboarding complete
        localStorage.setItem('dealo_onboarded', 'true');
        setShowSuggestions(true);
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-8">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          {/* DeaLo Logo */}
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-lg bg-[#00A36C] flex items-center justify-center">
              <Tag className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '-0.5px' }}>
              <span className="text-[#1F2937]">deal</span><span className="text-[#00A36C]">o</span>
            </h1>
          </div>

          {/* Search Bar - in the middle */}
          <Link to={createPageUrl("DiscoverSearch")} className="flex-1 mx-4">
            <div className="bg-[#E5E7EB] rounded-2xl px-4 py-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-sm text-[#6B7280]">Search Product</span>
              <Camera className="w-4 h-4 text-[#6B7280] ml-auto" />
            </div>
          </Link>
          
          {/* Profile & Notifications */}
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-full bg-[#F3F4F6] flex items-center justify-center">
              <Bell className="w-4 h-4 text-[#6B7280]" />
            </button>
            <Link to={createPageUrl("Profile")}>
              <div className="w-8 h-8 rounded-full bg-[#E5E7EB] flex items-center justify-center">
                <User className="w-4 h-4 text-[#6B7280]" />
              </div>
            </Link>
          </div>
        </div>

        {/* Pill Buttons */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-6 px-6 pb-1">
          <Link to={createPageUrl("DealsNearYou")} className="flex-shrink-0">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E5E7EB] text-xs font-medium text-[#1F2937]">
              <Tag className="w-3 h-3 text-[#00A36C]" />
              Deals
            </button>
          </Link>
          <Link to={createPageUrl("Following")} className="flex-shrink-0">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E5E7EB] text-xs font-medium text-[#1F2937]">
              <Users className="w-3 h-3 text-[#00A36C]" />
              Following
            </button>
          </Link>
          <Link to={createPageUrl("More")} className="flex-shrink-0">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E5E7EB] text-xs font-medium text-[#1F2937]">
              <svg className="w-3 h-3 text-[#00A36C]" viewBox="0 0 12 12" fill="currentColor">
                <rect x="0" y="0" width="5" height="5" rx="1" />
                <rect x="7" y="0" width="5" height="5" rx="1" />
                <rect x="0" y="7" width="5" height="5" rx="1" />
                <rect x="7" y="7" width="5" height="5" rx="1" />
              </svg>
              Categories
            </button>
          </Link>
          <Link to={createPageUrl("MyCart")} className="flex-shrink-0">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E5E7EB] text-xs font-medium text-[#1F2937]">
              <Bookmark className="w-3 h-3 text-[#00A36C]" />
              Saved
            </button>
          </Link>
        </div>
      </div>

      {/* Identify with Camera Tile */}
      <div className="px-6 mb-6">
        <Link to={createPageUrl("Snap")}>
          <div className="rounded-3xl overflow-hidden shadow-lg" style={{ height: '200px' }}>
            {/* Art background */}
            <div className="relative h-full bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
              {/* Animated stars/sparkles */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute text-white animate-twinkle"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 70}%`,
                      fontSize: `${4 + Math.random() * 6}px`,
                      animationDelay: `${Math.random() * 3}s`,
                      opacity: 0.3 + Math.random() * 0.5
                    }}
                  >
                    ✦
                  </div>
                ))}
              </div>

              {/* Deal tag flying like rocket */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center">
                {/* Motion lines */}
                <div className="absolute -left-16 top-1/2 -translate-y-1/2 flex flex-col gap-1">
                  <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-[#00A36C]/60 rounded-full" />
                  <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-[#00A36C]/80 rounded-full" />
                  <div className="w-6 h-0.5 bg-gradient-to-r from-transparent to-[#00A36C]/40 rounded-full" />
                </div>
                
                {/* Camera illustration */}
                <div className="relative z-10 mr-4">
                  <div className="w-16 h-14 rounded-xl bg-white/90 shadow-xl flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-[#1F2937] flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full bg-[#00A36C]" />
                    </div>
                  </div>
                  {/* Flash burst */}
                  <div className="absolute -top-2 -right-2 w-4 h-4 text-yellow-300 animate-pulse">✧</div>
                </div>

                {/* Flying tag */}
                <div className="w-14 h-14 rounded-xl bg-[#00A36C] shadow-2xl flex items-center justify-center transform rotate-12">
                  <Tag className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Bottom CTA Row */}
              <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-sm border-t border-white/20 px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#00A36C] flex items-center justify-center shadow-lg">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                <span className="text-white text-sm font-medium">Snap a picture to get started</span>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Trending Products Section */}
      <div className="px-6 mb-6">
        <h2 className="text-sm font-bold text-[#1F2937] mb-3">Trending Products</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {trendingProducts.map((product) => (
            <div key={product.id} className="flex-shrink-0" style={{ width: '120px' }}>
              <div className="aspect-square rounded-2xl overflow-hidden relative mb-2 bg-[#F3F4F6]">
                <img src={product.image} alt="" className="w-full h-full object-cover" />
                {/* Price badge */}
                <div className="absolute top-2 left-2 bg-black/40 backdrop-blur-sm rounded px-1.5 py-0.5">
                  <span className="text-[10px] font-bold text-white">{product.price}</span>
                </div>
                {/* Heart */}
                <button 
                  onClick={() => toggleFavorite(product.id)}
                  className={`absolute bottom-2 right-2 w-6 h-6 rounded-full flex items-center justify-center ${
                    favorites.includes(product.id) ? 'bg-[#00A36C]' : 'bg-[#6B7280]/60'
                  }`}
                >
                  <Heart className={`w-3 h-3 ${favorites.includes(product.id) ? 'text-white fill-white' : 'text-white'}`} />
                </button>
              </div>
              <p className="text-xs font-medium text-[#1F2937] mb-0.5">{product.title}</p>
              <p className="text-[10px] text-[#6B7280]">{product.store}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tinder-Style Swipe Cards OR Smart Suggestions */}
      {!showSuggestions ? (
        <div className="px-6 mb-6">
          <h2 className="text-sm font-bold text-[#1F2937] mb-1">Smart Suggestions</h2>
          <p className="text-xs text-[#6B7280] mb-4">Swipe to help us learn your style</p>

          {/* Swipe Card Stack */}
          <div className="relative" style={{ height: '400px' }}>
            {/* Background cards (stack effect) */}
            {swipeIndex < swipeCards.length - 1 && (
              <div 
                className="absolute inset-x-4 top-4 bottom-4 rounded-3xl bg-[#E5E7EB] opacity-50"
                style={{ transform: 'scale(0.95)' }}
              />
            )}

            {/* Current card */}
            {swipeIndex < swipeCards.length && (
              <div 
                className={`absolute inset-0 rounded-3xl overflow-hidden bg-white shadow-2xl transition-all duration-300 ${
                  swipeDirection === 'right' ? 'translate-x-full rotate-12 opacity-0' :
                  swipeDirection === 'left' ? '-translate-x-full -rotate-12 opacity-0' : ''
                }`}
              >
                <img 
                  src={swipeCards[swipeIndex].image} 
                  alt="" 
                  className="w-full h-3/4 object-cover"
                />
                
                {/* Badge */}
                <div className="absolute top-4 left-4 bg-[#00A36C] text-white text-xs font-bold px-3 py-1 rounded-full">
                  {swipeCards[swipeIndex].badge}
                </div>

                {/* Swipe overlays */}
                {swipeDirection === 'right' && (
                  <div className="absolute inset-0 bg-green-500/30 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="w-10 h-10 text-white" />
                    </div>
                  </div>
                )}
                {swipeDirection === 'left' && (
                  <div className="absolute inset-0 bg-red-500/30 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center">
                      <X className="w-10 h-10 text-white" />
                    </div>
                  </div>
                )}

                {/* Card info */}
                <div className="absolute bottom-0 left-0 right-0 bg-white p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-[#1F2937]">{swipeCards[swipeIndex].title}</h3>
                    <span className="text-lg font-bold text-[#00A36C]">{swipeCards[swipeIndex].price}</span>
                  </div>
                  <p className="text-sm text-[#6B7280]">{swipeCards[swipeIndex].brand}</p>

                  {/* Swipe buttons */}
                  <div className="flex items-center justify-center gap-8 mt-4">
                    <button 
                      onClick={() => handleSwipe('left')}
                      className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center hover:bg-red-200 transition-colors"
                    >
                      <X className="w-7 h-7 text-red-500" />
                    </button>
                    <button 
                      onClick={() => toggleFavorite(swipeCards[swipeIndex].id)}
                      className="w-10 h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center"
                    >
                      <Bookmark className={`w-5 h-5 ${favorites.includes(swipeCards[swipeIndex].id) ? 'text-[#00A36C] fill-[#00A36C]' : 'text-[#6B7280]'}`} />
                    </button>
                    <button 
                      onClick={() => handleSwipe('right')}
                      className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center hover:bg-green-200 transition-colors"
                    >
                      <Check className="w-7 h-7 text-green-500" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Progress dots */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {swipeCards.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`w-2 h-2 rounded-full ${idx <= swipeIndex ? 'bg-[#00A36C]' : 'bg-[#E5E7EB]'}`} 
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Smart Suggestions Feed (After Onboarding) */
        <div className="px-6 mb-8">
          <h2 className="text-sm font-bold text-[#1F2937] mb-1">Smart Suggestions</h2>
          <p className="text-xs text-[#6B7280] mb-4">Based on your preferences</p>

          {/* From Brands You Liked */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-[#6B7280] mb-3">From Brands You Liked</h3>
            <div className="grid grid-cols-2 gap-3">
              {smartSuggestions.brandsYouLiked.map((item) => (
                <div key={item.id} className="rounded-2xl overflow-hidden bg-white border border-[#E5E7EB]">
                  <div className="aspect-square relative bg-[#F3F4F6]">
                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded px-2 py-0.5">
                      <span className="text-[9px] font-bold text-[#1F2937]">{item.brand}</span>
                    </div>
                    <button className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-[#6B7280]/60 flex items-center justify-center">
                      <Heart className="w-3 h-3 text-white" />
                    </button>
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-medium text-[#1F2937]">{item.title}</p>
                    <p className="text-xs font-bold text-[#00A36C]">{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* From Stores You Liked */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-[#6B7280] mb-3">From Stores You Liked</h3>
            <div className="grid grid-cols-2 gap-3">
              {smartSuggestions.storesYouLiked.map((item) => (
                <div key={item.id} className="rounded-2xl overflow-hidden bg-white border border-[#E5E7EB]">
                  <div className="aspect-square relative bg-[#F3F4F6]">
                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded px-2 py-0.5">
                      <span className="text-[9px] font-bold text-[#1F2937]">{item.store}</span>
                    </div>
                    {item.brand && (
                      <div className="absolute top-8 left-2 bg-[#1F2937]/80 backdrop-blur-sm rounded px-2 py-0.5">
                        <span className="text-[9px] font-medium text-white">{item.brand}</span>
                      </div>
                    )}
                    <button className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-[#6B7280]/60 flex items-center justify-center">
                      <Heart className="w-3 h-3 text-white" />
                    </button>
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-medium text-[#1F2937]">{item.title}</p>
                    <p className="text-xs font-bold text-[#00A36C]">{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Products Similar to What You Liked */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-[#6B7280] mb-3">Products Similar to What You Liked</h3>
            <div className="grid grid-cols-2 gap-3">
              {smartSuggestions.similarToLiked.map((item) => (
                <div key={item.id} className="rounded-2xl overflow-hidden bg-white border border-[#E5E7EB]">
                  <div className="aspect-square relative bg-[#F3F4F6]">
                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                    {item.badge && (
                      <div className="absolute top-2 left-2 bg-[#00A36C] rounded px-2 py-0.5">
                        <span className="text-[9px] font-bold text-white">{item.badge}</span>
                      </div>
                    )}
                    <button className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-[#6B7280]/60 flex items-center justify-center">
                      <Heart className="w-3 h-3 text-white" />
                    </button>
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-medium text-[#1F2937]">{item.title}</p>
                    <p className="text-[10px] text-[#6B7280]">{item.store}</p>
                    <p className="text-xs font-bold text-[#00A36C]">{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-6 pb-12 pt-4 text-center">
        <div className="flex items-center justify-center gap-1 opacity-20">
          <div className="w-5 h-5 rounded bg-[#00A36C] flex items-center justify-center">
            <Tag className="w-3 h-3 text-white" />
          </div>
          <p className="text-base font-bold">
            <span className="text-[#1F2937]">deal</span><span className="text-[#00A36C]">o</span>
          </p>
        </div>
        <p className="text-xs text-[#6B7280] opacity-40">Shop Smart. Save Big.</p>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; } 
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}