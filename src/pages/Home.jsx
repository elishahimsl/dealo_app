import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Camera, Scale, Heart, Tag, Grid3X3, Search, Bell, User, ChevronRight, Sparkles, ScanSearch, Leaf, Zap, Award } from "lucide-react";
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
    { icon: Sparkles, name: "SmartFinder", page: "SmartFinder", gradient: true },
    { icon: Scale, name: "Compare", page: "Compare", gradient: false },
    { icon: ScanSearch, name: "DealScanner", page: "DealScanner", gradient: true },
    { icon: Leaf, name: "SmartReview", page: "SmartReview", gradient: false },
    { icon: Zap, name: "PriceDrop", page: "PriceDrop", gradient: true },
    { icon: Award, name: "BestMatch", page: "BestMatch", gradient: false },
  ];

  const trendingProducts = [
    { id: 1, price: "$89.99", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400", title: "Wireless Headphones", badge: "Trending Now" },
    { id: 2, price: "$249.99", image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=400", title: "Gaming Chair" },
    { id: 3, price: "$699.99", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400", title: "4K Smart TV" },
    { id: 4, price: "$59.99", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400", title: "Bluetooth Speaker" },
  ];

  const dealsForYou = [
    { id: 1, store: "Target", discount: "Up to 40% OFF", image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800", url: "https://target.com/deals" },
    { id: 2, store: "Best Buy", discount: "Tech Sale 30% OFF", image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800", url: "https://bestbuy.com/deals" },
    { id: 3, store: "Amazon", discount: "Flash Deals", image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800", url: "https://amazon.com/deals" },
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
          <p className="text-white/70 text-xs font-light mb-3">get started</p>
          <div className="grid grid-cols-3 gap-2">
            {tools.map((tool, idx) => {
              const Icon = tool.icon;
              return (
                <Link key={idx} to={createPageUrl(tool.page)}>
                  <div className={`rounded-xl p-3 flex flex-col items-center ${tool.gradient ? 'bg-gradient-to-br from-[#00A36C] to-[#007E52]' : 'bg-white'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${tool.gradient ? 'bg-white/20' : 'bg-[#00A36C]'}`}>
                      <Icon className={`w-4 h-4 ${tool.gradient ? 'text-white' : 'text-white'}`} />
                    </div>
                    <span className={`text-[9px] font-semibold text-center ${tool.gradient ? 'text-white' : 'text-[#1F2937]'}`}>{tool.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Trending Section - New Design */}
      <div className="px-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#1F2937]">Trending</h2>
          <Link to={createPageUrl("TrendingProducts")}>
            <div className="w-7 h-7 rounded-full bg-[#E5E7EB] flex items-center justify-center">
              <ChevronRight className="w-4 h-4 text-[#6B7280]" />
            </div>
          </Link>
        </div>

        {/* Featured Product */}
        <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm mb-3">
          <div className="flex items-center gap-4">
            <div className="w-28 h-28 rounded-xl bg-[#F3F4F6] flex items-center justify-center overflow-hidden">
              <img src={trendingProducts[0].image} alt="" className="w-full h-full object-contain p-2" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-[#1F2937] text-lg mb-1">{trendingProducts[0].title}</h3>
              <p className="text-xl font-bold text-[#1F2937] mb-2">{trendingProducts[0].price}</p>
              <span className="inline-block px-3 py-1 rounded-full bg-[#00A36C] text-white text-xs font-semibold">
                Trending Now
              </span>
            </div>
          </div>
        </div>

        {/* Grid Products */}
        <div className="grid grid-cols-2 gap-3">
          {trendingProducts.slice(1).map((product) => (
            <div key={product.id} className="bg-white rounded-2xl p-3 border border-[#E5E7EB] shadow-sm">
              <div className="w-full h-24 rounded-xl bg-[#F3F4F6] flex items-center justify-center mb-2 overflow-hidden">
                <img src={product.image} alt="" className="w-full h-full object-contain p-2" />
              </div>
              <h4 className="font-bold text-[#1F2937] text-sm text-center">{product.title}</h4>
              <p className="text-[#1F2937] text-sm font-bold text-center">{product.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Deals For You */}
      <div className="px-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#1F2937]">Deals For You</h2>
          <Link to={createPageUrl("DealsNearYou")}>
            <ChevronRight className="w-5 h-5 text-[#6B7280]" />
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6">
          {dealsForYou.map((deal) => (
            <div key={deal.id} className="flex-shrink-0 w-72 rounded-3xl overflow-hidden shadow-lg relative">
              <img src={deal.image} alt={deal.store} className="w-full h-48 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">{deal.discount}</h3>
                <p className="text-white/90 text-lg font-semibold mb-4">{deal.store}</p>
                <a href={deal.url} target="_blank" rel="noopener noreferrer">
                  <Button className="bg-white text-[#00A36C] hover:bg-white/90 font-semibold rounded-full">
                    View Deals
                  </Button>
                </a>
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