import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Search, Camera, ChevronRight, Sparkles, Flame, Users, Zap } from "lucide-react";

export default function Discover() {
  const navigate = useNavigate();

  const interestCategories = [
    { name: "Fashion", image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=300" },
    { name: "Tech", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300" },
    { name: "Health", image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=300" },
    { name: "Sports", image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=300" },
    { name: "Home", image: "https://images.unsplash.com/photo-1556912167-f556f1f39faa?w=300" },
    { name: "Gifts", image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300" }
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

  const stores = [
    { name: "Amazon", logo: "https://logo.clearbit.com/amazon.com" },
    { name: "Walmart", logo: "https://logo.clearbit.com/walmart.com" },
    { name: "Apple", logo: "https://logo.clearbit.com/apple.com" },
    { name: "Target", logo: "https://logo.clearbit.com/target.com" },
    { name: "Samsung", logo: "https://logo.clearbit.com/samsung.com" },
    { name: "Nike", logo: "https://logo.clearbit.com/nike.com" },
    { name: "Best Buy", logo: "https://logo.clearbit.com/bestbuy.com" }
  ];

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Search Bar */}
      <div className="px-6 pt-6 pb-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search or scan to find deals"
            className="w-full bg-[#F3F4F6] rounded-full pl-12 pr-12 py-3 text-sm text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#00A36C]"
          />
          <button 
            onClick={() => navigate(createPageUrl("Snap"))}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            <Camera className="w-5 h-5 text-[#00A36C]" />
          </button>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Explore by Interest */}
        <div>
          <h2 className="text-lg font-bold text-[#1F2937] mb-3">Explore by interest</h2>
          <div className="grid grid-cols-2 gap-3">
            {interestCategories.map((category, idx) => (
              <div key={idx} className="flex flex-col">
                <button className="w-full aspect-[3/2] rounded-2xl overflow-hidden bg-[#F3F4F6] mb-2">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </button>
                <p className="text-sm font-semibold text-[#1F2937] px-1">{category.name}</p>
              </div>
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
                <div key={idx} className="flex-shrink-0" style={{ width: '180px' }}>
                  <div className="relative mb-2">
                    <div className="w-full aspect-square rounded-2xl overflow-hidden bg-[#F3F4F6]">
                      <img 
                        src={deal.image} 
                        alt={deal.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5">
                      <BadgeIcon className="w-3.5 h-3.5 text-[#1F2937]" />
                      <span className="text-xs font-medium text-[#1F2937]">{deal.badge}</span>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-[#1F2937] mb-1 line-clamp-2 px-1">{deal.title}</p>
                  <button className="text-sm font-medium text-[#00A36C] flex items-center gap-1 px-1">
                    See deal <ChevronRight className="w-3.5 h-3.5" />
                  </button>
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
            <button 
              onClick={() => navigate(createPageUrl("Snap"))}
              className="bg-white border border-[#E5E7EB] rounded-2xl p-4 text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-[#00A36C]/10 flex items-center justify-center mb-3">
                <Camera className="w-5 h-5 text-[#00A36C]" />
              </div>
              <p className="text-sm font-semibold text-[#1F2937] mb-1">Scan a product</p>
              <p className="text-xs text-[#6B7280]">Find deals instantly from a photo.</p>
            </button>
            <button className="bg-white border border-[#E5E7EB] rounded-2xl p-4 text-left">
              <div className="w-10 h-10 rounded-xl bg-[#00A36C]/10 flex items-center justify-center mb-3">
                <Zap className="w-5 h-5 text-[#00A36C]" />
              </div>
              <p className="text-sm font-semibold text-[#1F2937] mb-1">PriceDrop</p>
              <p className="text-xs text-[#6B7280]">Get notified when prices fall.</p>
            </button>
            <button 
              onClick={() => navigate(createPageUrl("AIDealFinder"))}
              className="bg-white border border-[#E5E7EB] rounded-2xl p-4 text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-[#00A36C]/10 flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5 text-[#00A36C]" />
              </div>
              <p className="text-sm font-semibold text-[#1F2937] mb-1">DeaLo AI</p>
              <p className="text-xs text-[#6B7280]">AI-powered deal recommendations.</p>
            </button>
            <button className="bg-white border border-[#E5E7EB] rounded-2xl p-4 text-left">
              <div className="w-10 h-10 rounded-xl bg-[#00A36C]/10 flex items-center justify-center mb-3">
                <ChevronRight className="w-5 h-5 text-[#00A36C]" />
              </div>
              <p className="text-sm font-semibold text-[#1F2937] mb-1">Find more tools</p>
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
              <div key={idx} className="flex-shrink-0" style={{ width: '150px' }}>
                <div className="w-full aspect-square rounded-2xl overflow-hidden bg-[#F3F4F6] mb-2">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm font-semibold text-[#1F2937] mb-1 line-clamp-2 px-1">{product.name}</p>
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
          <div className="grid grid-cols-3 gap-3">
            {stores.map((store, idx) => (
              <button
                key={idx}
                className="bg-white border border-[#E5E7EB] rounded-2xl p-4 flex items-center justify-center hover:bg-[#F9FAFB] transition-colors aspect-[3/2]"
              >
                <img 
                  src={store.logo} 
                  alt={store.name}
                  className="w-full h-full object-contain p-2"
                  onError={(e) => e.target.style.display = 'none'}
                />
              </button>
            ))}
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