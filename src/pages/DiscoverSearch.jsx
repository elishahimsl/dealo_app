import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Camera } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function DiscoverSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const smartSuggestions = [
    "Recommended", "Trending", "Deals", "Electronics", "Best for You", "Nearby"
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      {/* Search Bar */}
      <div className="px-6 pt-8 mb-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Input
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pr-10 h-10 rounded-2xl bg-[#E5E7EB] border-0 text-[#1F2937] text-sm"
              autoFocus
            />
            <button 
              onClick={() => navigate(createPageUrl("Snap") + "?from=DiscoverSearch")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <Camera className="w-4 h-4 text-[#6B7280]" />
            </button>
          </div>
          <button onClick={() => navigate(-1)} className="text-sm font-semibold text-[#1F2937]">
            Cancel
          </button>
        </div>
      </div>

      {/* Smart Suggestion Pills */}
      <div className="px-6 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {smartSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setQuery(suggestion)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium bg-white text-[#1F2937] border border-[#E5E7EB] hover:border-[#00A36C] hover:bg-[#D6F5E9] transition-all"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Stores */}
      <div className="px-6 mb-6">
        <h2 className="text-sm font-bold text-[#1F2937] mb-3">Featured Stores</h2>
        <div className="space-y-2">
          <button 
            onClick={() => navigate(createPageUrl("StoreDetail") + "?store=Nike")}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white rounded-xl transition-colors"
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg" alt="Nike" className="w-8 h-8 object-contain" />
            <span className="text-sm font-medium text-[#1F2937]">Nike</span>
          </button>
          <button 
            onClick={() => navigate(createPageUrl("StoreDetail") + "?store=Amazon")}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white rounded-xl transition-colors"
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" className="w-8 h-8 object-contain" />
            <span className="text-sm font-medium text-[#1F2937]">Amazon</span>
          </button>
          <button 
            onClick={() => navigate(createPageUrl("StoreDetail") + "?store=Apple")}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white rounded-xl transition-colors"
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" className="w-8 h-8 object-contain" />
            <span className="text-sm font-medium text-[#1F2937]">Apple</span>
          </button>
          <button 
            onClick={() => navigate(createPageUrl("StoreDetail") + "?store=Target")}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white rounded-xl transition-colors"
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Target_logo.svg" alt="Target" className="w-8 h-8 object-contain" />
            <span className="text-sm font-medium text-[#1F2937]">Target</span>
          </button>
          <button 
            onClick={() => navigate(createPageUrl("StoreDetail") + "?store=Walmart")}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white rounded-xl transition-colors"
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/Walmart_logo.svg" alt="Walmart" className="w-8 h-8 object-contain" />
            <span className="text-sm font-medium text-[#1F2937]">Walmart</span>
          </button>
          <button 
            onClick={() => navigate(createPageUrl("StoreDetail") + "?store=Best Buy")}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white rounded-xl transition-colors"
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/f5/Best_Buy_Logo.svg" alt="Best Buy" className="w-8 h-8 object-contain" />
            <span className="text-sm font-medium text-[#1F2937]">Best Buy</span>
          </button>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}