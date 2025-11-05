import React from "react";
import { Search, Filter, Sparkles, Scale, ScanSearch, Leaf, BarChart3, Home as HomeIcon, Shirt, Laptop, Heart as HeartIcon, Gift, ChevronRight, Dumbbell, Utensils } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Discover() {
  const specialTools = [
    { id: 1, icon: Sparkles, name: "SmartFinder", color: "bg-[#5EE177]" },
    { id: 2, icon: Scale, name: "SnapCompare", color: "bg-gradient-to-br from-[#5EE177] to-[#FF8AC6]" },
    { id: 3, icon: ScanSearch, name: "DealScanner", color: "bg-[#FF8AC6]" },
    { id: 4, icon: Leaf, name: "SmartReview", color: "bg-gradient-to-br from-[#FF8AC6] to-[#5EE177]" },
  ];

  const topics = [
    { id: 1, name: "Sports", icon: Dumbbell, color: "bg-gradient-to-br from-[#5EE177] to-[#FF8AC6]" },
    { id: 2, name: "Health", icon: HeartIcon, color: "bg-[#FF8AC6]" },
    { id: 3, name: "Fashion", icon: Shirt, color: "bg-[#5EE177]" },
    { id: 4, name: "Tech", icon: Laptop, color: "bg-gradient-to-br from-[#FF8AC6] to-[#5EE177]" },
    { id: 5, name: "Food", icon: Utensils, color: "bg-[#5EE177]" },
  ];

  const forYou = [
    { id: 1, title: "Recently Viewed", icon: "👁️" },
    { id: 2, title: "Top Stores", icon: "🏬" },
    { id: 3, title: "AI Picks", icon: "🤖" },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      {/* Header with 3 dots */}
      <div className="px-6 pt-8 pb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#2E2E38] border-b-2 border-[#5EE177] inline-block" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Discover
        </h1>
        <button className="text-[#60656F]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="5" r="1.5" fill="currentColor"/>
            <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
            <circle cx="12" cy="19" r="1.5" fill="currentColor"/>
          </svg>
        </button>
      </div>

      {/* Search Bar */}
      <div className="px-6 mb-6">
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#60656F]" />
            <Input
              placeholder="Search products, tools, or topics..."
              className="pl-12 h-12 rounded-2xl border-[#E4E8ED] bg-white text-[#2E2E38]"
              style={{ fontFamily: 'Inter, sans-serif' }}
            />
          </div>
        </div>
      </div>

      {/* ShopSmart Tools Section - Smaller, 2x2 grid */}
      <div className="px-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-[#2E2E38]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            ShopSmart Tools
          </h2>
          <button className="text-xs font-semibold text-[#5EE177]">More →</button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {specialTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button 
                key={tool.id}
                className="bg-white rounded-3xl p-4 border border-[#E4E8ED] shadow-sm hover:shadow-md transition-all flex items-center gap-3"
              >
                <div className={`w-12 h-12 ${tool.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <span className="text-sm font-bold text-[#2E2E38]">
                  {tool.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Browse Topics Section - 16:9 aspect ratio cards */}
      <div className="mb-6">
        <div className="px-6 mb-3">
          <h2 className="text-base font-bold text-[#2E2E38]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Browse Topics
          </h2>
        </div>

        <div className="space-y-3 px-6">
          {topics.map((topic) => {
            const Icon = topic.icon;
            return (
              <button 
                key={topic.id}
                className="w-full rounded-3xl shadow-sm hover:shadow-md transition-all overflow-hidden"
                style={{ aspectRatio: '16/9' }}
              >
                <div className={`w-full h-full ${topic.color} p-6 flex items-center gap-4`}>
                  <Icon className="w-16 h-16 text-white" strokeWidth={1.5} />
                  <span className="font-bold text-white text-2xl">
                    {topic.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* For You Section - 3 square cards in a row */}
      <div className="px-6 mb-8">
        <div className="mb-3">
          <h2 className="text-base font-bold text-[#2E2E38]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            For You
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {forYou.map((item) => (
            <button 
              key={item.id}
              className="aspect-square bg-white rounded-2xl border border-[#E4E8ED] shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center gap-2"
            >
              <span className="text-3xl">{item.icon}</span>
              <span className="text-xs font-semibold text-[#2E2E38] text-center px-2">
                {item.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}