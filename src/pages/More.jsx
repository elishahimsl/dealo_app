import React from "react";
import { Search, Filter, Sparkles, Scale, ScanSearch, Leaf, BarChart3, Home as HomeIcon, Shirt, Laptop, Heart as HeartIcon, Gift, ChevronRight, Dumbbell, Utensils, Clock, TrendingUp, Package } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Discover() {
  const specialTools = [
    { id: 1, icon: Sparkles, name: "SmartFinder", color: "bg-gradient-to-br from-[#5EE177] to-[#FF8AC6]" },
    { id: 2, icon: Scale, name: "SnapCompare", color: "bg-gradient-to-br from-[#FF8AC6] to-[#5EE177]" },
    { id: 3, icon: ScanSearch, name: "DealScanner", color: "bg-gradient-to-br from-[#5EE177] to-[#FF8AC6]" },
    { id: 4, icon: Leaf, name: "SmartReview", color: "bg-gradient-to-br from-[#FF8AC6] to-[#5EE177]" },
  ];

  const topics = [
    { id: 1, name: "Sports", icon: Dumbbell, color: "bg-gradient-to-br from-[#5EE177] to-[#A8F3C1]" },
    { id: 2, name: "Health", icon: HeartIcon, color: "bg-gradient-to-br from-[#FF8AC6] to-[#FFB3D9]" },
    { id: 3, name: "Fashion", icon: Shirt, color: "bg-gradient-to-br from-[#5EE177] to-[#A8F3C1]" },
    { id: 4, name: "Tech", icon: Laptop, color: "bg-gradient-to-br from-[#FF8AC6] to-[#FFB3D9]" },
    { id: 5, name: "Food", icon: Utensils, color: "bg-gradient-to-br from-[#5EE177] to-[#A8F3C1]" },
    { id: 6, name: "Home", icon: HomeIcon, color: "bg-gradient-to-br from-[#FF8AC6] to-[#FFB3D9]" },
    { id: 7, name: "Beauty", icon: Sparkles, color: "bg-gradient-to-br from-[#5EE177] to-[#A8F3C1]" },
    { id: 8, name: "Toys", icon: Gift, color: "bg-gradient-to-br from-[#FF8AC6] to-[#FFB3D9]" },
    { id: 9, name: "Books", icon: Package, color: "bg-gradient-to-br from-[#5EE177] to-[#A8F3C1]" },
    { id: 10, name: "Garden", icon: Leaf, color: "bg-gradient-to-br from-[#FF8AC6] to-[#FFB3D9]" },
  ];

  const forYou = [
    { id: 1, title: "Recently Viewed", icon: Clock },
    { id: 2, title: "Top Stores", icon: TrendingUp },
    { id: 3, title: "AI Picks", icon: Sparkles },
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

      {/* ShopSmart Tools Section - Words top left, icon bottom right tilted */}
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
                className="bg-white rounded-3xl p-4 border border-[#E4E8ED] shadow-sm hover:shadow-md transition-all relative overflow-hidden h-24"
              >
                <span className="text-sm font-bold text-[#2E2E38] relative z-10">
                  {tool.name}
                </span>
                <div className={`absolute -bottom-2 -right-2 w-16 h-16 ${tool.color} rounded-2xl flex items-center justify-center transform rotate-12`}>
                  <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Browse Topics Section - 2 cards per row, 16:9 aspect ratio */}
      <div className="mb-6">
        <div className="px-6 mb-3">
          <h2 className="text-base font-bold text-[#2E2E38]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Browse Topics
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 px-6">
          {topics.map((topic) => {
            const Icon = topic.icon;
            return (
              <button 
                key={topic.id}
                className="rounded-3xl shadow-sm hover:shadow-md transition-all overflow-hidden"
                style={{ aspectRatio: '16/9' }}
              >
                <div className={`w-full h-full ${topic.color} p-4 flex flex-col justify-between`}>
                  <Icon className="w-10 h-10 text-white" strokeWidth={1.5} />
                  <span className="font-bold text-white text-lg text-left">
                    {topic.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* For You Section - Icons instead of emojis */}
      <div className="px-6 mb-8">
        <div className="mb-3">
          <h2 className="text-base font-bold text-[#2E2E38]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            For You
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {forYou.map((item) => {
            const Icon = item.icon;
            return (
              <button 
                key={item.id}
                className="aspect-square bg-white rounded-2xl border border-[#E4E8ED] shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center gap-2"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5EE177] to-[#FF8AC6] flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-semibold text-[#2E2E38] text-center px-2">
                  {item.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Greyed out logo at bottom */}
      <div className="px-6 pb-8 pt-4">
        <div className="flex flex-col items-center opacity-30">
          <div className="relative w-16 h-16 mb-2">
            <svg viewBox="0 0 120 120" className="w-full h-full">
              <ellipse
                cx="45"
                cy="60"
                rx="30"
                ry="45"
                transform="rotate(45 45 60)"
                fill="#2E2E38"
                opacity="0.9"
              />
              <ellipse
                cx="75"
                cy="60"
                rx="30"
                ry="45"
                transform="rotate(135 75 60)"
                fill="#2E2E38"
                opacity="0.9"
              />
            </svg>
          </div>
          <p className="text-xs text-[#2E2E38] font-semibold">ShopSmart</p>
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