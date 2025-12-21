import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Search, Camera, ChevronRight, Sparkles, Flame, Users, Zap } from "lucide-react";

export default function Discover() {
  const navigate = useNavigate();

  const interestCategories = [
    { name: "Fashion", emoji: "👗" },
    { name: "Tech", emoji: "💻" },
    { name: "Health", emoji: "💪" },
    { name: "Sports", emoji: "⚽" },
    { name: "Home", emoji: "🏠" },
    { name: "Gifts", emoji: "🎁" }
  ];

  const todaysDeals = [
    { 
      title: "Wireless Noise-Canceling Headphones", 
      image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400",
      badge: "Trending Today",
      badgeIcon: Flame
    },
    { 
      title: "4-in-1 Digital Air Fryer", 
      image: "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=400",
      badge: "People Are Scanning",
      badgeIcon: Users
    }
  ];

  const trendingProducts = [
    { name: "Smart Fitness Watch", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300", category: "Tech", categoryIcon: "📱" },
    { name: "Noise-Cancelling Earbuds", image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300", category: "Tech", categoryIcon: "📱" },
    { name: "Wireless Stick Vacuum", image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=300", category: "Home", categoryIcon: "🏠" }
  ];

  const storesAndBrands = [
    { name: "amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", size: "large" },
    { name: "walmart", logo: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Walmart_logo.svg", size: "medium" },
    { name: "apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg", size: "small" },
    { name: "target", logo: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Target_logo.svg", size: "large" },
    { name: "samsung", logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg", size: "medium" },
    { name: "nike", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg", size: "small" },
    { name: "bestbuy", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f5/Best_Buy_Logo.svg", size: "medium" }
  ];

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Search Bar */}
      <div className="px-6 pt-6 pb-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-[#F3F4F6] rounded-full pl-11 pr-12 py-2 text-sm text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#00A36C]"
          />
          <button 
            onClick={() => navigate(createPageUrl("Snap"))}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            <Camera className="w-4 h-4 text-[#00A36C]" />
          </button>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Explore by Interest */}
        <div>
          <h2 className="text-lg font-bold text-[#1F2937] mb-3">Explore by interest</h2>
          <div className="grid grid-cols-2 gap-2">
            {interestCategories.map((category, idx) => (
              <button 
                key={idx}
                className="relative h-16 rounded-xl overflow-hidden shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)'
                }}
              >
                <div className="absolute inset-0 flex items-center">
                  <p className="text-sm font-bold text-[#1F2937] pl-3">{category.name}</p>
                </div>
                <div 
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-3xl transform rotate-12"
                  style={{ opacity: 0.3 }}
                >
                  {category.emoji}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Today's Deals */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-[#1F2937]">Today's Deals</h2>
            <button className="text-sm font-medium text-[#00A36C] flex items-center gap-1">
              See all <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {todaysDeals.map((deal, idx) => {
              const BadgeIcon = deal.badgeIcon;
              return (
                <div key={idx} className="flex-shrink-0" style={{ width: '140px' }}>
                  <div className="relative mb-2">
                    <div className="w-full h-32 rounded-xl overflow-hidden bg-[#F3F4F6]">
                      <img 
                        src={deal.image} 
                        alt={deal.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute top-2 left-2 bg-[#00A36C] rounded px-1.5 py-0.5 flex items-center gap-1 w-fit">
                      <BadgeIcon className="w-2.5 h-2.5 text-white" />
                      <span className="text-[9px] font-semibold text-white whitespace-nowrap">{deal.badge}</span>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-[#1F2937] line-clamp-2 px-1">{deal.title}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Smart Tools */}
        <div>
          <h2 className="text-lg font-bold text-[#1F2937] mb-3">Smart tools</h2>
          <div className="grid grid-cols-3 gap-2">
            <button className="bg-[#E8F5F1] rounded-2xl p-3 text-center shadow-md hover:shadow-xl transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center mx-auto">
                <Zap className="w-5 h-5 text-[#00A36C]" />
              </div>
            </button>
            <button 
              onClick={() => navigate(createPageUrl("AIDealFinder"))}
              className="bg-[#F0F4F8] rounded-2xl p-3 text-center shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center mx-auto">
                <Sparkles className="w-5 h-5 text-[#6B7280]" />
              </div>
            </button>
            <button 
              onClick={() => navigate(createPageUrl("DealScanner"))}
              className="bg-[#F8F9FA] rounded-2xl p-3 text-center shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center mx-auto">
                <Search className="w-5 h-5 text-[#9CA3AF]" />
              </div>
            </button>
          </div>
        </div>

        {/* Trending Right Now */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-[#1F2937]">Trending Right Now</h2>
            <button className="text-sm font-medium text-[#00A36C] flex items-center gap-1">
              See all <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {trendingProducts.map((product, idx) => (
              <div key={idx} className="flex-shrink-0" style={{ width: '110px' }}>
                <div className="w-full h-24 rounded-xl overflow-hidden bg-[#F3F4F6] mb-2">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs font-semibold text-[#1F2937] mb-1 line-clamp-2 px-1">{product.name}</p>
                <p className="text-xs text-[#6B7280] px-1">{product.category}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Explore Stores & Brands */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-[#1F2937]">Explore Stores & Brands</h2>
            <button className="text-sm font-medium text-[#00A36C] flex items-center gap-1">
              See all <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {storesAndBrands.map((brand, idx) => {
              const colSpan = brand.size === 'large' ? 'col-span-2' : brand.size === 'medium' ? 'col-span-1' : 'col-span-1';
              const height = brand.size === 'large' ? 'h-24' : brand.size === 'medium' ? 'h-20' : 'h-16';
              return (
                <button
                  key={idx}
                  className={`${colSpan} ${height} bg-[#F3F4F6] rounded-xl p-3 flex items-center justify-center shadow-md hover:shadow-xl transition-shadow`}
                >
                  <img 
                    src={brand.logo} 
                    alt={brand.name}
                    className="w-full h-full object-contain"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}