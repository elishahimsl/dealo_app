import React from "react";
import { Search, Filter, Sparkles, Scale, ScanSearch, Leaf, BarChart3, Home as HomeIcon, Shirt, Laptop, Heart as HeartIcon, Gift, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Discover() {
  const specialTools = [
    { 
      id: 1,
      icon: Sparkles, 
      name: "SmartFinder", 
      description: "Find alternatives or dupes instantly",
      color: "bg-[#5EE177]"
    },
    { 
      id: 2,
      icon: Scale, 
      name: "SnapCompare", 
      description: "Compare two scanned products side-by-side",
      color: "bg-[#5EA7FF]"
    },
    { 
      id: 3,
      icon: ScanSearch, 
      name: "DealScanner", 
      description: "Locate price drops and local discounts",
      color: "bg-[#FF8AC6]"
    },
    { 
      id: 4,
      icon: Leaf, 
      name: "EcoMeter", 
      description: "Check product sustainability",
      color: "bg-[#5EE177]"
    },
    { 
      id: 5,
      icon: BarChart3, 
      name: "SmartReview Analyzer", 
      description: "AI summarizes what reviewers really say",
      color: "bg-[#5EA7FF]"
    },
  ];

  const topics = [
    { id: 1, name: "Home & Living", icon: HomeIcon, color: "bg-[#5EA7FF]" },
    { id: 2, name: "Fashion", icon: Shirt, color: "bg-[#FF8AC6]" },
    { id: 3, name: "Tech", icon: Laptop, color: "bg-[#5EE177]" },
    { id: 4, name: "Eco", icon: Leaf, color: "bg-[#5EE177]" },
    { id: 5, name: "Health", icon: HeartIcon, color: "bg-[#FF8AC6]" },
    { id: 6, name: "Gifts", icon: Gift, color: "bg-[#5EA7FF]" },
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

      {/* Special Tools Section */}
      <div className="px-6 mb-8">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-[#2E2E38] mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Special Tools
          </h2>
          <p className="text-sm text-[#60656F]">
            Powerful utilities to enhance your shopping
          </p>
        </div>

        <div className="space-y-4">
          {specialTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button 
                key={tool.id}
                className="w-full bg-white rounded-3xl p-5 border border-[#E4E8ED] shadow-sm hover:shadow-md transition-all text-left"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 ${tool.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-7 h-7 text-white" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#2E2E38] text-base mb-1">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-[#60656F] line-clamp-1">
                      {tool.description}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#60656F] flex-shrink-0" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Browse Topics Section */}
      <div className="mb-8">
        <div className="px-6 mb-4">
          <h2 className="text-lg font-bold text-[#2E2E38] mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Browse Topics
          </h2>
          <p className="text-sm text-[#60656F]">
            Explore by category or trend
          </p>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-6">
          {topics.map((topic) => {
            const Icon = topic.icon;
            return (
              <button 
                key={topic.id}
                className="flex-shrink-0 w-36 h-40 rounded-3xl shadow-sm hover:shadow-md transition-all"
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