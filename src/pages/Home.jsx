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

  useEffect(() => {
    localStorage.setItem('dealo_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = async (id, product) => {
    const isCurrentlyFavorited = favorites.includes(id);
    
    if (isCurrentlyFavorited) {
      setFavorites(prev => prev.filter(f => f !== id));
    } else {
      setFavorites(prev => [...prev, id]);
      // Save to database
      try {
        await base44.entities.Capture.create({
          title: product.title,
          content_type: 'other',
          file_url: product.image,
          file_type: 'image',
          ai_summary: `${product.title} from ${product.store || product.brand}`,
          keywords: [product.store || product.brand, product.title]
        });
      } catch (error) {
        console.error("Error saving to database:", error);
      }
    }
  };



  const trendingProducts = [
    { id: 1, price: "$20.00", image: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=400", title: "Smart Speaker", store: "Amazon" },
    { id: 2, price: "$25.00", image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400", title: "LA Dodger Hat", store: "Walmart" },
    { id: 3, price: "$40.00", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400", title: "Headphones", store: "Target" },
    { id: 4, price: "$89.00", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", title: "Running Shoes", store: "Nike" },
  ];

  // Smart suggestions data
  const smartSuggestions = {
    storesYouLiked: [
      { id: 301, store: "Target", brand: "Xbox", price: "$500.99", title: "Xbox One", image: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400" },
      { id: 302, store: "Walmart", price: "$1,200", title: "TV 75\"", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400" },
      { id: 303, store: "Best Buy", price: "$299", title: "Headphones", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400" },
      { id: 304, store: "Amazon", price: "$89.99", title: "Echo Dot", image: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=400" },
      { id: 305, store: "Costco", price: "$149", title: "Air Fryer", image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400" },
      { id: 306, store: "Target", price: "$34.99", title: "Throw Blanket", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400" },
    ],
    similarToLiked: [
      { id: 401, badge: "New", price: "$25.99", title: "Black T-Shirt", store: "Amazon", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400" },
      { id: 402, price: "$40.99", title: "Jeans", store: "Amazon", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400" },
      { id: 403, price: "$65.00", title: "Sneakers", store: "Nike", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400" },
      { id: 404, price: "$29.99", title: "Backpack", store: "Target", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400" },
      { id: 405, price: "$18.99", title: "Watch", store: "Amazon", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400" },
      { id: 406, price: "$55.00", title: "Sunglasses", store: "Walmart", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400" },
    ],
    brandsYouLiked: [
      { id: 201, brand: "Uniqlo", price: "$24.99", title: "Joggers", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400" },
      { id: 202, brand: "Nike", price: "$30.99", title: "Active Shorts", image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400" },
      { id: 203, brand: "Adidas", price: "$45.00", title: "Track Jacket", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400" },
      { id: 204, brand: "Levi's", price: "$59.99", title: "Denim Jacket", image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400" },
      { id: 205, brand: "H&M", price: "$19.99", title: "Basic Tee", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400" },
      { id: 206, brand: "Zara", price: "$35.00", title: "Chinos", image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400" },
    ],
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

        {/* Search Bar */}
        <Link to={createPageUrl("DiscoverSearch")} className="block mb-4">
          <div className="w-full h-10 rounded-2xl bg-[#E5E7EB] flex items-center px-4 gap-2">
            <svg className="w-4 h-4 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-sm text-[#6B7280] flex-1">Search</span>
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

                  {/* Deal Tag flying like rocket - NO green bg */}
                  <div className="relative ml-2 transform rotate-[30deg]">
                    {/* The tag icon only */}
                    <Tag className="w-12 h-12 text-[#00A36C] drop-shadow-lg" />

                    {/* Rocket fire/boosters below the tag */}
                    <div className="absolute -bottom-4 left-1/2 flex flex-col items-center" style={{ transform: 'translateX(-50%)' }}>
                      <div className="w-2 h-4 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-b-full" />
                      <div className="w-1.5 h-3 bg-gradient-to-b from-orange-500 to-red-500 rounded-b-full -mt-1" />
                      <div className="w-1 h-2 bg-gradient-to-b from-red-500 to-red-600 rounded-b-full -mt-0.5 animate-pulse" />
                    </div>

                    {/* Sparkle trail */}
                    <div className="absolute -bottom-6 -left-2 text-yellow-300 text-sm animate-pulse">✦</div>
                    <div className="absolute -bottom-4 -left-4 text-orange-400/60 text-xs">✧</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom card - Snap a picture (starts at camera height, sticks out on bottom) */}
            <div 
              className="rounded-2xl bg-[#374151] flex items-center justify-center px-4 shadow-lg relative z-0"
              style={{ height: '80px', marginTop: '-20px' }}
            >
              <div className="flex items-center gap-2 mt-4">
                <div className="w-8 h-8 rounded-full bg-[#00A36C] flex items-center justify-center">
                  <Camera className="w-4 h-4 text-white" />
                </div>
                <span className="text-white text-sm font-semibold">Snap a picture to get started</span>
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
                  {/* Heart */}
                  <button 
                    onClick={() => toggleFavorite(product.id, product)}
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

      {/* Smart Suggestions Feed - Horizontal scrollable */}
      <div className="mb-8">
        <div className="px-6">
          <h2 className="text-sm font-bold text-[#1F2937] mb-1">Smart Suggestions</h2>
          <p className="text-xs text-[#6B7280] mb-4">Based on your preferences</p>
        </div>

        {/* From Stores You Liked - Horizontal */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-[#6B7280] mb-3 px-6">From Stores You Liked</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-6">
            {smartSuggestions.storesYouLiked.map((item) => (
              <div key={item.id} className="flex-shrink-0" style={{ width: '120px' }}>
                <div className="aspect-square rounded-2xl overflow-hidden relative bg-[#F3F4F6] mb-2">
                  <img src={item.image} alt="" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => toggleFavorite(item.id, item)}
                    className={`absolute bottom-2 right-2 w-6 h-6 rounded-full flex items-center justify-center ${
                      favorites.includes(item.id) ? 'bg-[#00A36C]' : 'bg-[#6B7280]/60'
                    }`}
                  >
                    <Heart className={`w-3 h-3 ${favorites.includes(item.id) ? 'text-white fill-white' : 'text-white'}`} />
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
              <div key={item.id} className="flex-shrink-0" style={{ width: '120px' }}>
                <div className="aspect-square rounded-2xl overflow-hidden relative bg-[#F3F4F6] mb-2">
                  <img src={item.image} alt="" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => toggleFavorite(item.id, item)}
                    className={`absolute bottom-2 right-2 w-6 h-6 rounded-full flex items-center justify-center ${
                      favorites.includes(item.id) ? 'bg-[#00A36C]' : 'bg-[#6B7280]/60'
                    }`}
                  >
                    <Heart className={`w-3 h-3 ${favorites.includes(item.id) ? 'text-white fill-white' : 'text-white'}`} />
                  </button>
                </div>
                <p className="text-[10px] font-medium text-[#6B7280]">{item.store}</p>
                <p className="text-xs font-semibold text-[#1F2937]">{item.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* From Brands You Liked - Horizontal */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-[#6B7280] mb-3 px-6">From Brands You Liked</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-6">
            {smartSuggestions.brandsYouLiked.map((item) => (
              <div key={item.id} className="flex-shrink-0" style={{ width: '120px' }}>
                <div className="aspect-square rounded-2xl overflow-hidden relative bg-[#F3F4F6] mb-2">
                  <img src={item.image} alt="" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => toggleFavorite(item.id, item)}
                    className={`absolute bottom-2 right-2 w-6 h-6 rounded-full flex items-center justify-center ${
                      favorites.includes(item.id) ? 'bg-[#00A36C]' : 'bg-[#6B7280]/60'
                    }`}
                  >
                    <Heart className={`w-3 h-3 ${favorites.includes(item.id) ? 'text-white fill-white' : 'text-white'}`} />
                  </button>
                </div>
                <p className="text-[10px] font-medium text-[#6B7280]">{item.brand}</p>
                <p className="text-xs font-semibold text-[#1F2937]">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

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