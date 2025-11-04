import React from "react";
import { Search, Filter, Sparkles, Scale, ScanSearch, Leaf, BarChart3, Home as HomeIcon, Shirt, Laptop, Heart as HeartIcon, Gift, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Discover() {
  const specialTools = [
    { id: 1, icon: Sparkles, name: "SmartFinder", color: "bg-[#5EE177]" },
    { id: 2, icon: Scale, name: "SnapCompare", color: "bg-[#5EA7FF]" },
    { id: 3, icon: ScanSearch, name: "DealScanner", color: "bg-[#FF8AC6]" },
    { id: 4, icon: Leaf, name: "EcoMeter", color: "bg-[#5EE177]" },
    { id: 5, icon: BarChart3, name: "SmartReview", color: "bg-[#5EA7FF]" },
    { id: 6, icon: Sparkles, name: "PriceDrop", color: "bg-[#FF8AC6]" },
  ];

  const topics = [
    { id: 1, name: "Home & Living", icon: HomeIcon, color: "bg-[#5EA7FF]" },
    { id: 2, name: "Fashion", icon: Shirt, color: "bg-[#FF8AC6]" },
    { id: 3, name: "Tech", icon: Laptop, color: "bg-[#5EE177]" },
    { id: 4, name: "Eco", icon: Leaf, color: "bg-[#5EE177]" },
    { id: 5, name: "Health", icon: HeartIcon, color: "bg-[#FF8AC6]" },
    { id: 6, name: "Gifts", icon: Gift, color: "bg-[#5EA7FF]" },
    { id: 7, name: "Beauty", icon: Sparkles, color: "bg-[#FF8AC6]" },
    { id: 8, name: "Sports", icon: HeartIcon, color: "bg-[#5EE177]" },
    { id: 9, name: "Food", icon: Gift, color: "bg-[#5EA7FF]" },
  ];

  const forYou = [
    { id: 1, title: "Top Deals Nearby", description: "Fresh discounts in your area" },
    { id: 2, title: "Recently Viewed", description: "Pick up where you left off" },
    { id: 3, title: "New Tools", description: "Explore the latest features" },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <h1 className="text-2xl font-bold text-[#2E2E38] mb-1 border-b-2 border-[#5EE177] inline-block" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Discover
        </h1>
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
          <button className="w-12 h-12 rounded-2xl bg-white border border-[#E4E8ED] flex items-center justify-center hover:bg-[#F9FAFB] transition-colors">
            <Filter className="w-5 h-5 text-[#60656F]" />
          </button>
        </div>
      </div>

      {/* ShopSmart Tools Section - Small Cards */}
      <div className="px-6 mb-8">
        <h2 className="text-lg font-bold text-[#2E2E38] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
          ShopSmart Tools
        </h2>

        <div className="grid grid-cols-3 gap-3">
          {specialTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button 
                key={tool.id}
                className="bg-white rounded-2xl p-4 border border-[#E4E8ED] shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center"
              >
                <div className={`w-12 h-12 ${tool.color} rounded-2xl flex items-center justify-center mb-2`}>
                  <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <span className="text-xs font-semibold text-[#2E2E38] text-center leading-tight">
                  {tool.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Browse Topics Section - Takes up most of the page */}
      <div className="mb-8">
        <div className="px-6 mb-4">
          <h2 className="text-lg font-bold text-[#2E2E38] mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Browse Topics
          </h2>
          <p className="text-sm text-[#60656F]">
            Explore by category or trend
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 px-6">
          {topics.map((topic) => {
            const Icon = topic.icon;
            return (
              <button 
                key={topic.id}
                className="aspect-square rounded-3xl shadow-sm hover:shadow-md transition-all"
              >
                <div className={`w-full h-full ${topic.color} rounded-3xl p-4 flex flex-col items-center justify-center`}>
                  <Icon className="w-12 h-12 text-white mb-3" strokeWidth={2} />
                  <span className="font-bold text-white text-sm text-center">
                    {topic.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* For You Section */}
      <div className="px-6 mb-8">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-[#2E2E38] mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Recommended For You
          </h2>
          <p className="text-sm text-[#60656F]">
            Tailored suggestions based on your activity
          </p>
        </div>

        <div className="space-y-3">
          {forYou.map((item) => (
            <button 
              key={item.id}
              className="w-full bg-white rounded-2xl p-4 border border-[#E4E8ED] shadow-sm hover:shadow-md transition-all text-left"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-[#2E2E38] text-sm mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#60656F]">
                    {item.description}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-[#60656F]" />
              </div>
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