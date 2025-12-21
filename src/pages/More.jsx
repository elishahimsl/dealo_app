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
    { name: "Amazon", logo: "https://logo.clearbit.com/amazon.com", size: "large" },
    { name: "Walmart", logo: "https://logo.clearbit.com/walmart.com", size: "medium" },
    { name: "Apple", logo: "https://logo.clearbit.com/apple.com", size: "small" },
    { name: "Target", logo: "https://logo.clearbit.com/target.com", size: "large" },
    { name: "Samsung", logo: "https://logo.clearbit.com/samsung.com", size: "medium" },
    { name: "Nike", logo: "https://logo.clearbit.com/nike.com", size: "small" },
    { name: "Best Buy", logo: "https://logo.clearbit.com/bestbuy.com", size: "medium" }
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
                    <div className="absolute top-2 left-2 bg-[#00A36C] rounded px-2 py-1 flex items-center gap-1">
                      <BadgeIcon className="w-3 h-3 text-white" />
                      <span className="text-xs font-semibold text-white">{deal.badge}</span>
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
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-[#1F2937]">Smart tools</h2>
            <ChevronRight className="w-5 h-5 text-[#6B7280]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-white border border-[#E5E7EB] rounded-2xl p-4 text-left shadow-md hover:shadow-xl transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-[#00A36C]/10 flex items-center justify-center mb-3">
                <Zap className="w-5 h-5 text-[#00A36C]" />
              </div>
              <p className="text-sm font-semibold text-[#1F2937] mb-1">PriceDrop</p>
              <p className="text-xs text-[#6B7280]">Get notified when prices fall.</p>
            </button>
            <button 
              onClick={() => navigate(createPageUrl("AIDealFinder"))}
              className="bg-white border border-[#E5E7EB] rounded-2xl p-4 text-left shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="w-10 h-10 rounded-xl bg-[#00A36C]/10 flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5 text-[#00A36C]" />
              </div>
              <p className="text-sm font-semibold text-[#1F2937] mb-1">DeaLo AI</p>
              <p className="text-xs text-[#6B7280]">AI-powered deal recommendations.</p>
            </button>
            <button 
              onClick={() => navigate(createPageUrl("DealScanner"))}
              className="bg-white border border-[#E5E7EB] rounded-2xl p-4 text-left shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="w-10 h-10 rounded-xl bg-[#00A36C]/10 flex items-center justify-center mb-3">
                <Search className="w-5 h-5 text-[#00A36C]" />
              </div>
              <p className="text-sm font-semibold text-[#1F2937] mb-1">Deal Scanner</p>
              <p className="text-xs text-[#6B7280]">Discover daily deals and offers.</p>
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
                <div className="flex items-center gap-1 px-1">
                  <span className="text-xs">{product.categoryIcon}</span>
                  <span className="text-xs text-[#6B7280]">{product.category}</span>
                </div>
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