import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Camera, Scale, Heart, Tag, Grid3X3, Search, Bell, User, ChevronRight, Bookmark, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const queryClient = useQueryClient();
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('dealo_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('dealo_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const tools = [
    { icon: Camera, name: "Identify", page: "Snap" },
    { icon: Scale, name: "Compare", page: "Compare" },
    { icon: Heart, name: "Favorites", page: "MyCart" },
  ];

  const [trendingIndex, setTrendingIndex] = useState(0);

  const trendingProducts = [
    { id: 1, price: "$219.99", originalPrice: "$349.99", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&q=80", title: "4K Smart TV", store: "Target", storeLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Target_logo.svg/1200px-Target_logo.svg.png", badge: "Bestseller", storeColor: "#CC0000" },
    { id: 2, price: "$89.99", originalPrice: "$149.99", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80", title: "Wireless Headphones", store: "Amazon", storeLogo: "https://logo.clearbit.com/amazon.com", badge: "Top Rated", storeColor: "#FF9900" },
    { id: 3, price: "$249.99", originalPrice: "$399.99", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80", title: "Running Shoes", store: "Nike", storeLogo: "https://logo.clearbit.com/nike.com", badge: "Deal", storeColor: "#FFFFFF" },
    { id: 4, price: "$59.99", originalPrice: "$99.99", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80", title: "Bluetooth Speaker", store: "Walmart", storeLogo: "https://logo.clearbit.com/walmart.com", badge: "Hot", storeColor: "#0071CE" },
  ];

  const todaysBestDeal = {
    store: "Target",
    storeLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Target_logo.svg/1200px-Target_logo.svg.png",
    storeRating: 4.5,
    reviewCount: "17.5k",
    endsIn: "2 days",
    discount: "50",
    brand: "All in Motion",
    category: "Active Wear",
    storeColor: "#CC0000",
    bgColor: "#2D3748",
    soccerBall: "https://images.unsplash.com/photo-1614632537423-5765b78871cb?w=200&q=80",
    dumbbell: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=200&q=80",
    products: [
      { id: 101, price: "$199.00", originalPrice: "$349.00", image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400", title: "Running Socks", discount: "50% off", left: null },
      { id: 102, price: "$49.99", originalPrice: "$79.99", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400", title: "Athletic Shorts", discount: "37% off", left: "1 left" },
    ]
  };

  const dealsForYou = [
    { 
      id: 1, 
      store: "Walmart", 
      storeLogo: "https://logo.clearbit.com/walmart.com", 
      discount: "30", 
      discountText: "Up to 30% off",
      category: "Toys", 
      storeColor: "#0071CE",
      image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400",
      products: [
        { id: 201, price: "$24.99", title: "LEGO Set", discount: "25% off", image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=300" },
        { id: 202, price: "$19.99", title: "Action Figure", discount: "30% off", image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=300" },
        { id: 203, price: "$34.99", title: "Board Game", discount: "20% off", image: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=300" },
        { id: 204, price: "$15.99", title: "Stuffed Animal", discount: "35% off", image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=300" },
      ]
    },
    { 
      id: 2, 
      store: "Amazon", 
      storeLogo: "https://logo.clearbit.com/amazon.com", 
      discount: "70", 
      discountText: "Up to 70% off",
      category: "PJ's & More", 
      storeColor: "#FF9900",
      image: "https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?w=400",
      products: [
        { id: 301, price: "$18.99", title: "White Shirt", discount: "18% off", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300" },
        { id: 302, price: "$24.99", title: "Pants", discount: "15% off", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300" },
        { id: 303, price: "$12.99", title: "Goggles", discount: "36% off", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300" },
        { id: 304, price: "$9.99", title: "Polo", discount: "86% off", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300" },
      ]
    },
  ];

  const saveFavoriteMutation = useMutation({
    mutationFn: async (product) => {
      return await base44.entities.Capture.create({
        title: product.title,
        content_type: 'other',
        file_url: product.image,
        file_type: 'image',
        is_favorite: true
      });
    },
    onSuccess: () => queryClient.invalidateQueries(['allCaptures'])
  });

  const toggleFavorite = (product) => {
    if (favorites.includes(product.id)) {
      setFavorites(favorites.filter(id => id !== product.id));
    } else {
      setFavorites([...favorites, product.id]);
      saveFavoriteMutation.mutate(product);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-8">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          {/* DeaLo Logo */}
          <h1 className="text-2xl font-black tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
            <span className="text-[#1F2937]">Dea</span><span className="text-[#00A36C]">Lo</span>
          </h1>
          
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
        <div className="flex gap-2">
          <Link to={createPageUrl("DealsNearYou")}>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E5E7EB] text-xs font-medium text-[#1F2937]">
              <Tag className="w-3 h-3 text-[#00A36C]" />
              Deals
            </button>
          </Link>
          <Link to={createPageUrl("More")}>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E5E7EB] text-xs font-medium text-[#1F2937]">
              <Grid3X3 className="w-3 h-3 text-[#00A36C]" />
              Categories
            </button>
          </Link>
          <Link to={createPageUrl("DiscoverSearch")}>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E5E7EB] text-xs font-medium text-[#1F2937]">
              <Search className="w-3 h-3 text-[#00A36C]" />
              Search
            </button>
          </Link>
          <Link to={createPageUrl("MyCart")}>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E5E7EB] text-xs font-medium text-[#1F2937]">
              <Bookmark className="w-3 h-3 text-[#00A36C]" />
              Saved
            </button>
          </Link>
        </div>
      </div>

      {/* Tools Section */}
      <div className="px-6 mb-6">
        <div className="bg-[#4A5568] rounded-2xl p-4">
          <p className="text-white/80 text-xs font-light mb-3">Get Started</p>
          <div className="flex justify-center gap-3">
            {tools.map((tool, idx) => {
              const Icon = tool.icon;
              return (
                <Link key={idx} to={createPageUrl(tool.page)}>
                  <div className="rounded-xl p-3 flex flex-col items-center bg-[#F5F5F5]" style={{ width: '80px' }}>
                    <div className="w-8 h-8 rounded-full bg-[#00A36C] flex items-center justify-center mb-1">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-[9px] font-semibold text-[#1F2937] text-center">{tool.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Trending Section - Carousel */}
      <div className="px-6 mb-6">
        <h2 className="text-lg font-bold text-[#1F2937] mb-4">Trending</h2>

        <div className="rounded-3xl overflow-hidden relative" style={{ height: '340px' }}>
          {/* Gradient background - black at bottom to store color at top */}
          <div 
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, #1a1a1a 0%, #1a1a1a 40%, ${trendingProducts[trendingIndex].storeColor}99 85%, ${trendingProducts[trendingIndex].storeColor}66 100%)`
            }}
          />
          
          {/* Floating stars animation */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute text-white text-xs animate-float-down"
                style={{
                  left: `${10 + i * 12}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: `${3 + i * 0.3}s`
                }}
              >
                ✦
              </div>
            ))}
          </div>

          {/* Store logo - top left */}
          <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
            <img src={trendingProducts[trendingIndex].storeLogo} alt="" className="w-6 h-6 object-contain" />
            <span className="text-white text-sm font-semibold">{trendingProducts[trendingIndex].store}</span>
          </div>

          {/* Product Image - centered, transparent bg style */}
          <div className="absolute inset-0 flex items-center justify-center pt-8 pb-32">
            <img 
              src={trendingProducts[trendingIndex].image} 
              alt="" 
              className="max-h-full max-w-[80%] object-contain drop-shadow-2xl"
            />
          </div>

          {/* Bottom info section */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            {/* Badge */}
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded bg-[#00A36C] text-white text-[9px] font-bold flex items-center gap-1">
                ✓ {trendingProducts[trendingIndex].badge}
              </span>
            </div>
            
            {/* Price and title row */}
            <div className="flex items-end justify-between">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-lg font-bold text-white">{trendingProducts[trendingIndex].price}</span>
                  <span className="text-xs text-white/60 line-through">{trendingProducts[trendingIndex].originalPrice}</span>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-white/90">{trendingProducts[trendingIndex].title}</p>
                  <a href="#" className="text-[10px] text-[#00A36C] underline">Visit Store</a>
                </div>
              </div>
              
              {/* Heart with ring */}
              <button 
                onClick={() => toggleFavorite(trendingProducts[trendingIndex])}
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  favorites.includes(trendingProducts[trendingIndex].id) 
                    ? 'bg-[#00A36C] border-[#00A36C]' 
                    : 'bg-transparent border-white/50'
                }`}
              >
                <Heart className={`w-4 h-4 ${favorites.includes(trendingProducts[trendingIndex].id) ? 'text-white fill-white' : 'text-white'}`} />
              </button>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-1.5 mt-3">
              {trendingProducts.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setTrendingIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-colors ${idx === trendingIndex ? 'bg-white' : 'bg-white/30'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Today's Best Deal - App Store Style */}
      <div className="px-6 mb-6">
        <h2 className="text-lg font-bold text-[#1F2937] mb-4">Today's Best Deal</h2>

        {/* Main Banner */}
        <div className="rounded-3xl overflow-hidden relative" style={{ height: '240px', backgroundColor: todaysBestDeal.bgColor }}>
          {/* Inner red border */}
          <div className="absolute inset-0 rounded-3xl border-4 border-[#CC0000] z-20 pointer-events-none" />
          
          {/* Gradient overlay - red from bottom */}
          <div 
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, ${todaysBestDeal.storeColor} 0%, ${todaysBestDeal.storeColor}f5 35%, transparent 45%)`
            }}
          />

          {/* Product images - soccer ball and dumbbell on right */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 z-10">
            <img src={todaysBestDeal.soccerBall} alt="" className="w-16 h-16 object-contain drop-shadow-lg" />
            <img src={todaysBestDeal.dumbbell} alt="" className="w-20 h-16 object-contain drop-shadow-lg" />
            {/* White dots underneath */}
            <div className="flex gap-1 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
            </div>
          </div>

          {/* Ends in badge - top LEFT */}
          <div className="absolute top-0 left-0 flex items-center gap-1 bg-[#CC0000] rounded-br-xl px-3 py-1.5 z-30">
            <span className="text-[10px] font-semibold text-white">Ends in {todaysBestDeal.endsIn}</span>
          </div>

          {/* Content */}
          <div className="absolute inset-0 p-4 pt-10 flex flex-col z-10">
            {/* Store info */}
            <div className="flex items-center gap-2">
              <img src={todaysBestDeal.storeLogo} alt="" className="w-6 h-6 object-contain" />
              <div>
                <p className="text-white font-bold text-sm">{todaysBestDeal.store}</p>
                <div className="flex items-center gap-1">
                  <span className="text-white/90 text-[10px]">{todaysBestDeal.storeRating}</span>
                  <span className="text-yellow-300 text-[10px]">★</span>
                  <span className="text-white/70 text-[10px]">({todaysBestDeal.reviewCount})</span>
                </div>
              </div>
            </div>

            {/* Deal text - bottom */}
            <div className="mt-auto">
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-white text-xs font-medium">Up to</span>
                <span className="text-white text-2xl font-black">{todaysBestDeal.discount}</span>
                <div className="flex flex-col leading-none">
                  <span className="text-white text-[10px] font-bold">%</span>
                  <span className="text-white text-[10px] font-semibold">off</span>
                </div>
              </div>
              <p className="text-white/90 text-sm mb-2">{todaysBestDeal.brand}: {todaysBestDeal.category}</p>
              <button className="bg-white/20 backdrop-blur-sm text-white border border-white/40 px-3 py-1 rounded-full text-[10px] font-semibold">
                Shop Deal in Store
              </button>
            </div>
          </div>
        </div>

        {/* Deal Products - Connected to banner above */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          {todaysBestDeal.products.map((product) => (
            <div key={product.id} className="rounded-2xl overflow-hidden">
              {/* Product Image with gradient and info */}
              <div className="relative" style={{ height: '140px' }}>
                {/* Inner red border */}
                <div className="absolute inset-0 rounded-t-2xl border-4 border-b-0 border-[#CC0000] z-20 pointer-events-none" />
                
                <img src={product.image} alt="" className="w-full h-full object-cover object-top" />

                {/* Red gradient from bottom - more opaque */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to top, ${todaysBestDeal.storeColor} 0%, ${todaysBestDeal.storeColor}f0 25%, ${todaysBestDeal.storeColor}88 45%, transparent 55%)`
                  }}
                />

                {/* Heart - top left with ring */}
                <button 
                  onClick={() => toggleFavorite(product)}
                  className={`absolute top-2 left-2 z-30 w-7 h-7 rounded-full flex items-center justify-center border-2 ${
                    favorites.includes(product.id) 
                      ? 'bg-[#00A36C] border-[#00A36C]' 
                      : 'bg-transparent border-white'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${favorites.includes(product.id) ? 'text-white fill-white' : 'text-white'}`} />
                </button>

                {/* Price and brand info - bottom inside image */}
                <div className="absolute bottom-0 left-0 right-0 p-2 z-10">
                  <div className="flex items-center gap-1 mb-0.5">
                    <span className="text-white text-sm font-bold">{product.price}</span>
                    <span className="text-white/70 text-[10px] line-through">{product.originalPrice}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <img src={todaysBestDeal.storeLogo} alt="" className="w-3 h-3 object-contain" />
                    <span className="text-white/90 text-[10px] font-medium">Target</span>
                  </div>
                </div>
              </div>

              {/* Bottom bar - App Store style */}
              <div className="bg-[#F3F4F6] px-3 py-2 flex items-center justify-center border-2 border-t-0 border-[#E5E7EB] rounded-b-2xl">
                {product.left ? (
                  <span className="text-[10px] font-bold text-[#CC0000]">· · · {product.left} · · ·</span>
                ) : (
                  <span className="text-[10px] font-bold text-[#CC0000]">✦ {product.discount} ✦</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deals For You */}
      <div className="px-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#1F2937]">Deals For You</h2>
          <Link to={createPageUrl("AllDeals")}>
            <ChevronRight className="w-5 h-5 text-[#6B7280]" />
          </Link>
        </div>

        {/* Store Deal Sections */}
        <div className="space-y-6">
          {dealsForYou.map((storeDeal) => (
            <div key={storeDeal.id}>
              {/* Store Banner with circular product cutout */}
              <div className="rounded-2xl overflow-hidden relative mb-3" style={{ height: '100px' }}>
                {/* Store color gradient - left to right */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to right, ${storeDeal.storeColor} 0%, ${storeDeal.storeColor}dd 50%, ${storeDeal.storeColor}99 70%, transparent 85%)`
                  }}
                />
                
                {/* Circular cutout on right with product */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-[#1F2937] flex items-center justify-center overflow-hidden" style={{ marginRight: '-12px' }}>
                  <img src={storeDeal.image} alt="" className="w-16 h-16 object-contain" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 p-4 flex flex-col justify-center pr-28">
                  {/* Store logo and name */}
                  <div className="flex items-center gap-2 mb-1">
                    <img src={storeDeal.storeLogo} alt="" className="w-4 h-4 rounded" />
                    <span className="text-white text-[10px] font-medium">{storeDeal.store}</span>
                  </div>
                  
                  {/* Deal info */}
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-white text-[10px] font-medium">Up to</span>
                    <span className="text-white text-lg font-black">{storeDeal.discount}</span>
                    <div className="flex flex-col leading-none">
                      <span className="text-white text-[8px] font-bold">%</span>
                      <span className="text-white text-[8px] font-semibold">off</span>
                    </div>
                    <span className="text-white/90 text-[10px] ml-1">{storeDeal.category}</span>
                  </div>
                  
                  <button className="bg-white/20 backdrop-blur-sm text-white border border-white/40 px-2 py-0.5 rounded-full text-[9px] font-semibold w-fit">
                    Shop Now
                  </button>
                </div>
              </div>

              {/* Store Products Grid */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <img src={storeDeal.storeLogo} alt="" className="w-4 h-4 rounded" />
                    <span className="text-xs font-semibold text-[#1F2937]">{storeDeal.store} Deals</span>
                  </div>
                  <button className="flex items-center justify-center">
                    <MoreHorizontal className="w-5 h-5 text-[#6B7280]" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {storeDeal.products.map((product) => (
                    <div key={product.id} className="rounded-xl overflow-hidden bg-[#F3F4F6]">
                      {/* Product Image with gradient - all info inside */}
                      <div className="relative" style={{ height: '100px' }}>
                        <img src={product.image} alt="" className="w-full h-full object-contain p-2" />
                        
                        {/* Store color gradient from bottom - more opaque */}
                        <div 
                          className="absolute inset-0"
                          style={{
                            background: `linear-gradient(to top, ${storeDeal.storeColor}ee 0%, ${storeDeal.storeColor}cc 35%, ${storeDeal.storeColor}66 50%, transparent 60%)`
                          }}
                        />
                        
                        {/* Heart with ring - bottom right */}
                        <button 
                          onClick={() => toggleFavorite(product)}
                          className={`absolute bottom-2 right-2 w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                            favorites.includes(product.id) 
                              ? 'bg-[#00A36C] border-[#00A36C]' 
                              : 'bg-white/20 border-white'
                          }`}
                        >
                          <Heart className={`w-3 h-3 ${favorites.includes(product.id) ? 'text-white fill-white' : 'text-white'}`} />
                        </button>

                        {/* Product name and discount - bottom left inside tile */}
                        <div className="absolute bottom-2 left-2">
                          <span className="text-white text-[9px] font-bold block">{product.discount}</span>
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

      {/* Footer */}
      <div className="px-6 pb-12 pt-4 text-center">
        <p className="text-lg font-black tracking-tight opacity-20">
          <span className="text-[#1F2937]">Dea</span><span className="text-[#00A36C]">Lo</span>
        </p>
        <p className="text-xs text-[#6B7280] opacity-40">Shop Smart. Save Big.</p>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; } 
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes float-down {
          0% { transform: translateY(-20px); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translateY(350px); opacity: 0; }
        }
        .animate-float-down {
          animation: float-down 4s linear infinite;
        }
      `}</style>
    </div>
  );
}