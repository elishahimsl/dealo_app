import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Camera, Scale, Heart, Tag, Grid3X3, Search, Bell, User, ChevronRight, Clock } from "lucide-react";
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
    { id: 1, price: "$219.99", originalPrice: "$349.99", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400", title: "VIZIO 4K Smart TV", store: "Target", storeLogo: "https://logo.clearbit.com/target.com", badge: "Bestseller" },
    { id: 2, price: "$89.99", originalPrice: "$149.99", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400", title: "Sony Wireless Headphones", store: "Best Buy", storeLogo: "https://logo.clearbit.com/bestbuy.com", badge: "Top Rated" },
    { id: 3, price: "$249.99", originalPrice: "$399.99", image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=400", title: "Gaming Chair Pro", store: "Amazon", storeLogo: "https://logo.clearbit.com/amazon.com", badge: "Deal" },
    { id: 4, price: "$59.99", originalPrice: "$99.99", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400", title: "JBL Bluetooth Speaker", store: "Walmart", storeLogo: "https://logo.clearbit.com/walmart.com", badge: "Hot" },
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
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600",
    products: [
      { id: 101, price: "$199.00", originalPrice: "$349.00", image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400", title: "Running Socks", discount: "50% off", left: null },
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
        </div>
      </div>

      {/* Tools Section */}
      <div className="px-6 mb-6">
        <div className="bg-[#1F2937] rounded-2xl p-4">
          <p className="text-white text-xs font-light mb-3">Get Started</p>
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

        <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden">
          {/* Store header */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={trendingProducts[trendingIndex].storeLogo} alt="" className="w-6 h-6 rounded" />
              <span className="text-sm font-semibold text-[#1F2937]">{trendingProducts[trendingIndex].store}</span>
            </div>
            <button>
              <Heart className="w-5 h-5 text-[#6B7280]" />
            </button>
          </div>

          {/* Product Image */}
          <div className="px-6 pb-4">
            <div className="bg-[#F3F4F6] rounded-2xl h-48 flex items-center justify-center overflow-hidden">
              <img src={trendingProducts[trendingIndex].image} alt="" className="h-full object-contain" />
            </div>
          </div>

          {/* Product Info */}
          <div className="px-4 pb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded bg-[#00A36C] text-white text-[10px] font-bold flex items-center gap-1">
                ✓ {trendingProducts[trendingIndex].badge}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-[#1F2937]">{trendingProducts[trendingIndex].price}</span>
                  <span className="text-sm text-[#6B7280] line-through">{trendingProducts[trendingIndex].originalPrice}</span>
                </div>
                <p className="text-sm text-[#1F2937]">{trendingProducts[trendingIndex].title}</p>
                <a href="#" className="text-xs text-[#00A36C] underline">Visit Store</a>
              </div>
              <button onClick={() => toggleFavorite(trendingProducts[trendingIndex])}>
                <Heart className={`w-6 h-6 ${favorites.includes(trendingProducts[trendingIndex].id) ? 'text-[#00A36C] fill-[#00A36C]' : 'text-[#6B7280]'}`} />
              </button>
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-1.5 pb-4">
            {trendingProducts.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setTrendingIndex(idx)}
                className={`w-2 h-2 rounded-full transition-colors ${idx === trendingIndex ? 'bg-[#1F2937]' : 'bg-[#E5E7EB]'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Today's Best Deal - App Store Style */}
      <div className="px-6 mb-6">
        <h2 className="text-lg font-bold text-[#1F2937] mb-4">Today's Best Deal</h2>

        {/* Main Banner */}
        <div className="rounded-3xl overflow-hidden relative" style={{ height: '240px' }}>
          {/* Inner red border */}
          <div className="absolute inset-0 rounded-3xl border-4 border-[#CC0000] z-20 pointer-events-none" />
          
          {/* Background Image - product focused */}
          <div className="absolute inset-0">
            <img 
              src={todaysBestDeal.image} 
              alt="" 
              className="w-full h-full object-cover object-top"
            />
          </div>

          {/* Gradient overlay - bottom to top, more opaque under text */}
          <div 
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, ${todaysBestDeal.storeColor} 0%, ${todaysBestDeal.storeColor}f5 30%, ${todaysBestDeal.storeColor}aa 50%, transparent 55%)`
            }}
          />

          {/* Ends in badge - top right connected to border, red background */}
          <div className="absolute top-0 right-0 flex items-center gap-1 bg-[#CC0000] rounded-bl-xl px-3 py-1.5 z-30">
            <Clock className="w-3 h-3 text-white" />
            <span className="text-[10px] font-semibold text-white">Ends in {todaysBestDeal.endsIn}</span>
          </div>

          {/* Content */}
          <div className="absolute inset-0 p-4 flex flex-col z-10">
            {/* Store info - top left */}
            <div className="flex items-center gap-2">
              <img src={todaysBestDeal.storeLogo} alt="" className="w-7 h-7 object-contain" />
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
              {/* Store Banner */}
              <div className="rounded-2xl overflow-hidden relative mb-3" style={{ height: '120px' }}>
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img src={storeDeal.image} alt="" className="w-full h-full object-cover" />
                </div>
                
                {/* Store color gradient - bottom to top */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to top, ${storeDeal.storeColor} 0%, ${storeDeal.storeColor}f0 40%, ${storeDeal.storeColor}88 60%, transparent 70%)`
                  }}
                />

                {/* Content */}
                <div className="absolute inset-0 p-4 flex flex-col justify-end">
                  {/* Store logo and name */}
                  <div className="flex items-center gap-2 mb-2">
                    <img src={storeDeal.storeLogo} alt="" className="w-5 h-5 rounded" />
                    <span className="text-white text-xs font-medium">{storeDeal.store}</span>
                  </div>
                  
                  {/* Deal info */}
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
                    <img src={storeDeal.storeLogo} alt="" className="w-4 h-4 rounded" />
                    <span className="text-xs font-semibold text-[#1F2937]">{storeDeal.store} Deals</span>
                  </div>
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1F2937]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E5E7EB]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E5E7EB]" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {storeDeal.products.map((product) => (
                    <div key={product.id} className="rounded-xl overflow-hidden">
                      {/* Product Image with gradient */}
                      <div className="relative bg-[#F3F4F6]" style={{ height: '90px' }}>
                        <img src={product.image} alt="" className="w-full h-full object-contain p-2" />
                        
                        {/* Store color gradient from bottom */}
                        <div 
                          className="absolute inset-0"
                          style={{
                            background: `linear-gradient(to top, ${storeDeal.storeColor}dd 0%, ${storeDeal.storeColor}88 30%, transparent 50%)`
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

                        {/* Price and discount - bottom left */}
                        <div className="absolute bottom-2 left-2">
                          <span className="text-white text-[10px] font-bold bg-black/30 px-1 rounded">{product.discount}</span>
                        </div>
                      </div>

                      {/* Product name */}
                      <div className="bg-white px-2 py-1.5 border-t border-[#E5E7EB]">
                        <p className="text-[10px] text-[#1F2937] font-medium text-center">{product.title}</p>
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

      <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
    </div>
  );
}