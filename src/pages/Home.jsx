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
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600",
    products: [
      { id: 101, price: "$199.00", originalPrice: "$349.00", image: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=400", title: "Running Socks", discount: "50% off", left: null },
      { id: 102, price: "$49.99", originalPrice: "$79.99", image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400", title: "Athletic Shorts", discount: "37% off", left: "1 left" },
    ]
  };

  const dealsForYou = [
    { id: 1, store: "Walmart", storeLogo: "https://logo.clearbit.com/walmart.com", discount: "Up to 30% off", category: "Toys", image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400", products: [{ image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=200" }] },
    { id: 2, store: "Best Buy", storeLogo: "https://logo.clearbit.com/bestbuy.com", discount: "Huge Deals on TV", category: "Electronics", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400", products: [] },
    { id: 3, store: "Amazon", storeLogo: "https://logo.clearbit.com/amazon.com", discount: "Up to 65% off", category: "Fashion", image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400", products: [] },
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
        <div className="rounded-3xl overflow-hidden relative border-4 border-[#E5E7EB]" style={{ height: '240px' }}>
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src={todaysBestDeal.image} 
              alt="" 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Gradient overlay - bottom to top */}
          <div 
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, ${todaysBestDeal.storeColor}f0 0%, ${todaysBestDeal.storeColor}dd 25%, ${todaysBestDeal.storeColor}99 45%, ${todaysBestDeal.storeColor}44 60%, transparent 75%)`
            }}
          />

          {/* Ends in badge - top right connected to border */}
          <div className="absolute -top-0 -right-0 flex items-center gap-1 bg-[#1F2937] rounded-bl-xl px-3 py-1.5">
            <Clock className="w-3 h-3 text-white" />
            <span className="text-[10px] font-semibold text-white">Ends in {todaysBestDeal.endsIn}</span>
          </div>

          {/* Content */}
          <div className="absolute inset-0 p-4 flex flex-col">
            {/* Store info - top left */}
            <div className="flex items-center gap-2">
              <img src={todaysBestDeal.storeLogo} alt="" className="w-8 h-8 object-contain" />
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
              <div className="flex items-start gap-1 mb-1">
                <span className="text-white text-xs font-medium">Up to</span>
                <div className="flex flex-col items-start leading-none">
                  <div className="flex items-start">
                    <span className="text-white text-3xl font-black">{todaysBestDeal.discount}</span>
                    <span className="text-white text-lg font-bold">%</span>
                  </div>
                  <span className="text-white text-xs font-semibold -mt-1">off</span>
                </div>
              </div>
              <p className="text-white/90 text-sm mb-2">{todaysBestDeal.brand}: {todaysBestDeal.category}</p>
              <button className="bg-white/20 backdrop-blur-sm text-white border border-white/40 px-3 py-1.5 rounded-full text-xs font-semibold">
                Shop Deal in Store
              </button>
            </div>
          </div>
        </div>

        {/* Deal Products - Connected to banner above */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          {todaysBestDeal.products.map((product) => (
            <div key={product.id} className="rounded-2xl overflow-hidden border-2 border-[#E5E7EB]">
              {/* Product Image with gradient and info */}
              <div className="relative" style={{ height: '140px' }}>
                <img src={product.image} alt="" className="w-full h-full object-cover" />

                {/* Red gradient from bottom */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to top, ${todaysBestDeal.storeColor}ee 0%, ${todaysBestDeal.storeColor}cc 20%, ${todaysBestDeal.storeColor}66 40%, transparent 60%)`
                  }}
                />

                {/* Heart - top left */}
                <button 
                  onClick={() => toggleFavorite(product)}
                  className="absolute top-2 left-2"
                >
                  <Heart className={`w-5 h-5 ${favorites.includes(product.id) ? 'text-[#00A36C] fill-[#00A36C]' : 'text-white'}`} />
                </button>

                {/* Price and brand info - bottom inside image */}
                <div className="absolute bottom-0 left-0 right-0 p-2">
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
              <div className="bg-[#F3F4F6] px-3 py-2 flex items-center justify-center">
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

        {/* Main deal card */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-4 mb-3">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <img src={dealsForYou[0].storeLogo} alt="" className="w-5 h-5 rounded" />
                <span className="text-sm font-semibold text-[#1F2937]">{dealsForYou[0].store}</span>
              </div>
              <p className="text-lg font-bold text-[#1F2937] mb-1">{dealsForYou[0].discount}</p>
              <p className="text-sm text-[#6B7280] mb-3">{dealsForYou[0].category}</p>
              <button className="bg-[#1F2937] text-white px-4 py-1.5 rounded-full text-xs font-semibold">
                Shop Now
              </button>
            </div>
            <div className="w-24 h-24 bg-[#F3F4F6] rounded-xl overflow-hidden flex items-center justify-center">
              <img src={dealsForYou[0].image} alt="" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Small deal cards */}
        <div className="grid grid-cols-2 gap-3">
          {dealsForYou.slice(1, 3).map((deal) => (
            <div key={deal.id} className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-3 relative">
              <div className="flex items-center gap-1 mb-2">
                <img src={deal.storeLogo} alt="" className="w-4 h-4 rounded" />
                <span className="text-xs font-semibold text-[#1F2937]">{deal.store}</span>
              </div>
              <p className="text-sm font-bold text-[#1F2937] mb-1 line-clamp-2">{deal.discount}</p>
              <button className="text-[10px] text-[#00A36C] font-semibold">Shop Now</button>
              <div className="absolute right-2 bottom-2 w-12 h-12 bg-[#F3F4F6] rounded-lg overflow-hidden">
                <img src={deal.image} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                <span className="text-[8px] text-[#6B7280]">: : Deal : :</span>
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