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
  const [dragOffset, setDragOffset] = useState(0);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

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

  // Touch/drag handlers for swipe
  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    setDragOffset(currentX - startX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (Math.abs(dragOffset) > 80) {
      handleSwipe(dragOffset > 0 ? 'right' : 'left');
    }
    setDragOffset(0);
  };

  const handleMouseDown = (e) => {
    setStartX(e.clientX);
    setIsDragging(true);
    
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      setDragOffset(e.clientX - startX);
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      if (Math.abs(dragOffset) > 80) {
        handleSwipe(dragOffset > 0 ? 'right' : 'left');
      }
      setDragOffset(0);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
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
        {/* Top Row - Logo, Notifications, Profile */}
        <div className="flex items-center justify-between mb-3">
          {/* DeaLo Logo */}
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-lg bg-[#00A36C] flex items-center justify-center">
              <Tag className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '-0.5px' }}>
              <span className="text-[#1F2937]">deal</span><span className="text-[#00A36C]">o</span>
            </h1>
          </div>
          
          {/* Notifications & Profile */}
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-full bg-[#F3F4F6] flex items-center justify-center">
              <Bell className="w-4 h-4 text-[#6B7280]" />
            </button>
            <Link to={createPageUrl("Profile")}>
              <div className="w-9 h-9 rounded-full bg-[#E5E7EB] flex items-center justify-center">
                <User className="w-4 h-4 text-[#6B7280]" />
              </div>
            </Link>
          </div>
        </div>

        {/* Search Bar - Full Width Thinner */}
        <Link to={createPageUrl("DiscoverSearch")} className="block mb-4">
          <div className="w-full bg-[#E5E7EB] rounded-full px-4 py-2 flex items-center gap-3">
            <svg className="w-4 h-4 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-sm text-[#6B7280] flex-1">Search Product</span>
            <Camera className="w-4 h-4 text-[#6B7280]" />
          </div>
        </Link>

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

      {/* Identify with Camera Tile - Stacked cards */}
      <div className="px-6 mb-8">
        <Link to={createPageUrl("Snap")}>
          <div className="relative">
            {/* Top card - Art */}
            <div className="rounded-2xl overflow-hidden shadow-lg relative z-10" style={{ height: '150px' }}>
              {/* Art background - starry night */}
              <div className="relative h-full bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
                {/* Animated stars/sparkles */}
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(25)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute text-white animate-twinkle"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        fontSize: `${3 + Math.random() * 5}px`,
                        animationDelay: `${Math.random() * 3}s`,
                        opacity: 0.3 + Math.random() * 0.5
                      }}
                    >
                      ✦
                    </div>
                  ))}
                </div>

                {/* Camera pointing at Tag */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Camera - angled to point at tag */}
                  <div className="relative mr-4 transform rotate-[15deg]">
                    {/* Camera body */}
                    <div className="w-20 h-16 rounded-xl bg-[#374151] flex items-center justify-center shadow-2xl border-2 border-[#4B5563]">
                      {/* Lens */}
                      <div className="w-10 h-10 rounded-full bg-[#1F2937] border-4 border-[#6B7280] flex items-center justify-center">
                        <div className="w-5 h-5 rounded-full bg-[#00A36C]" />
                      </div>
                    </div>
                    {/* Viewfinder */}
                    <div className="absolute -top-2 left-3 w-4 h-3 rounded-sm bg-[#374151] border border-[#4B5563]" />
                    {/* Flash lines going toward tag */}
                    <div className="absolute top-1/2 -right-3 -translate-y-1/2 flex flex-col gap-1">
                      <div className="w-4 h-0.5 bg-yellow-300/80 rounded-full" />
                      <div className="w-6 h-0.5 bg-yellow-300 rounded-full" />
                      <div className="w-4 h-0.5 bg-yellow-300/80 rounded-full" />
                    </div>
                  </div>

                  {/* Deal Tag flying like rocket */}
                  <div className="relative ml-2 transform rotate-[30deg]">
                    {/* The tag */}
                    <div className="w-14 h-14 rounded-xl bg-[#00A36C] flex items-center justify-center shadow-2xl">
                      <Tag className="w-8 h-8 text-white" />
                    </div>

                    {/* Rocket fire/boosters below the tag */}
                    <div className="absolute -bottom-5 left-1/2 flex flex-col items-center" style={{ transform: 'translateX(-50%)' }}>
                      <div className="w-3 h-5 bg-gradient-to-b from-[#00A36C] to-yellow-400 rounded-b-full" />
                      <div className="w-2 h-4 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-b-full -mt-1" />
                      <div className="w-1 h-3 bg-gradient-to-b from-orange-500 to-red-500 rounded-b-full -mt-0.5 animate-pulse" />
                    </div>

                    {/* Sparkle trail */}
                    <div className="absolute -bottom-8 -left-2 text-yellow-300 text-sm animate-pulse">✦</div>
                    <div className="absolute -bottom-6 -left-4 text-orange-400/60 text-xs">✧</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom card - Snap a picture (green bg, sticking out) */}
            <div 
              className="rounded-2xl bg-[#00A36C] flex items-center justify-center py-5 px-4 shadow-lg -mt-3 relative z-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                  <Tag className="w-5 h-5 text-[#00A36C]" />
                </div>
                <span className="text-white text-base font-semibold">Snap a picture to get started</span>
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
                  {/* Price badge - centered text */}
                  <div className="absolute top-2 left-2 bg-black/40 backdrop-blur-sm rounded flex items-center justify-center px-1.5 py-0.5">
                    <span className="text-[10px] font-bold text-white leading-none">{product.price}</span>
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
          <div className="relative flex justify-center" style={{ height: '280px' }}>
            {/* Phantom gradient background cards - sticking out on sides */}
            <div 
              className="absolute rounded-2xl"
              style={{ 
                width: '200px', 
                height: '190px',
                top: '14px',
                background: 'linear-gradient(145deg, #D1D5DB 0%, #C4C7CC 100%)',
                transform: 'scale(0.88) rotate(-3deg)',
                opacity: 0.35
              }}
            />
            <div 
              className="absolute rounded-2xl"
              style={{ 
                width: '195px', 
                height: '185px',
                top: '8px',
                background: 'linear-gradient(145deg, #E5E7EB 0%, #D1D5DB 100%)',
                transform: 'scale(0.94) rotate(2deg)',
                opacity: 0.55
              }}
            />

            {/* Check mark - fixed in center of screen, revealed when swiping right */}
            <div 
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500 flex items-center justify-center"
              style={{ 
                width: `${Math.min(70, 30 + Math.abs(dragOffset) * 0.5)}px`,
                height: `${Math.min(70, 30 + Math.abs(dragOffset) * 0.5)}px`,
                opacity: dragOffset > 20 ? Math.min(1, (dragOffset - 20) / 60) : 0,
                transition: dragOffset > 20 ? 'none' : 'opacity 0.2s'
              }}
            >
              <Check className="text-white" style={{ width: `${Math.min(36, 16 + Math.abs(dragOffset) * 0.25)}px`, height: `${Math.min(36, 16 + Math.abs(dragOffset) * 0.25)}px` }} />
            </div>

            {/* X mark - fixed in center of screen, revealed when swiping left */}
            <div 
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500 flex items-center justify-center"
              style={{ 
                width: `${Math.min(70, 30 + Math.abs(dragOffset) * 0.5)}px`,
                height: `${Math.min(70, 30 + Math.abs(dragOffset) * 0.5)}px`,
                opacity: dragOffset < -20 ? Math.min(1, (Math.abs(dragOffset) - 20) / 60) : 0,
                transition: dragOffset < -20 ? 'none' : 'opacity 0.2s'
              }}
            >
              <X className="text-white" style={{ width: `${Math.min(36, 16 + Math.abs(dragOffset) * 0.25)}px`, height: `${Math.min(36, 16 + Math.abs(dragOffset) * 0.25)}px` }} />
            </div>

            {/* Current card */}
            {swipeIndex < swipeCards.length && (
              <div 
                className="relative z-10"
                style={{
                  transform: `translateX(${dragOffset}px) rotate(${dragOffset * 0.05}deg)`,
                  transition: swipeDirection ? 'all 0.3s ease-out' : 'none'
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
              >
                {/* Gradient border wrapper */}
                <div 
                  className="rounded-2xl p-[3px]"
                  style={{
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(229,231,235,0.6) 50%, rgba(209,213,219,0.4) 100%)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                  }}
                >
                  {/* Image tile */}
                  <div 
                    className="rounded-xl overflow-hidden bg-[#F3F4F6] relative"
                    style={{ width: '180px', height: '180px' }}
                  >
                    <img 
                      src={swipeCards[swipeIndex].image} 
                      alt="" 
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Badge */}
                    <div className="absolute top-2 left-2 bg-[#00A36C] text-white text-[8px] font-bold px-2 py-0.5 rounded">
                      {swipeCards[swipeIndex].badge}
                    </div>

                    {/* Heart button */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(swipeCards[swipeIndex].id); }}
                      className={`absolute bottom-2 right-2 w-8 h-8 rounded-full flex items-center justify-center ${
                        favorites.includes(swipeCards[swipeIndex].id) ? 'bg-[#00A36C]' : 'bg-[#6B7280]/60'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${favorites.includes(swipeCards[swipeIndex].id) ? 'text-white fill-white' : 'text-white'}`} />
                    </button>
                  </div>
                </div>

                {/* Text underneath - moves with tile */}
                <div className="mt-3 text-center">
                  <p className="text-sm font-semibold text-[#1F2937]">{swipeCards[swipeIndex].title}</p>
                  <p className="text-xs text-[#6B7280]">{swipeCards[swipeIndex].brand}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Smart Suggestions Feed (After Onboarding) - Horizontal scrollable */
        <div className="mb-8">
          <div className="px-6">
            <h2 className="text-sm font-bold text-[#1F2937] mb-1">Smart Suggestions</h2>
            <p className="text-xs text-[#6B7280] mb-4">Based on your preferences</p>
          </div>

          {/* From Brands You Liked - Horizontal */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-[#6B7280] mb-3 px-6">From Brands You Liked</h3>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-6">
              {smartSuggestions.brandsYouLiked.map((item) => (
                <div key={item.id} className="flex-shrink-0" style={{ width: '130px' }}>
                  <div className="aspect-square rounded-2xl overflow-hidden relative bg-[#F3F4F6] mb-2">
                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 bg-[#00A36C] rounded px-2 py-0.5">
                      <span className="text-[9px] font-bold text-white">{item.price}</span>
                    </div>
                    <button className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-[#6B7280]/60 flex items-center justify-center">
                      <Heart className="w-3 h-3 text-white" />
                    </button>
                  </div>
                  <p className="text-[10px] font-medium text-[#6B7280]">{item.brand}</p>
                  <p className="text-xs font-semibold text-[#1F2937]">{item.title}</p>
                </div>
              ))}
            </div>
          </div>

          {/* From Stores You Liked - Horizontal */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-[#6B7280] mb-3 px-6">From Stores You Liked</h3>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-6">
              {smartSuggestions.storesYouLiked.map((item) => (
                <div key={item.id} className="flex-shrink-0" style={{ width: '130px' }}>
                  <div className="aspect-square rounded-2xl overflow-hidden relative bg-[#F3F4F6] mb-2">
                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 bg-[#00A36C] rounded px-2 py-0.5">
                      <span className="text-[9px] font-bold text-white">{item.price}</span>
                    </div>
                    <button className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-[#6B7280]/60 flex items-center justify-center">
                      <Heart className="w-3 h-3 text-white" />
                    </button>
                  </div>
                  <p className="text-[10px] font-medium text-[#6B7280]">{item.store}</p>
                  <p className="text-xs font-semibold text-[#1F2937]">{item.title}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Products Similar to What You Liked - Horizontal */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-[#6B7280] mb-3 px-6">Similar to What You Liked</h3>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-6">
              {smartSuggestions.similarToLiked.map((item) => (
                <div key={item.id} className="flex-shrink-0" style={{ width: '130px' }}>
                  <div className="aspect-square rounded-2xl overflow-hidden relative bg-[#F3F4F6] mb-2">
                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 bg-[#00A36C] rounded px-2 py-0.5">
                      <span className="text-[9px] font-bold text-white">{item.price}</span>
                    </div>
                    <button className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-[#6B7280]/60 flex items-center justify-center">
                      <Heart className="w-3 h-3 text-white" />
                    </button>
                  </div>
                  <p className="text-[10px] font-medium text-[#6B7280]">{item.store}</p>
                  <p className="text-xs font-semibold text-[#1F2937]">{item.title}</p>
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