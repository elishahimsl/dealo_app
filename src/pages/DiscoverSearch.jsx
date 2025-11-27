import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function DiscoverSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const trendingSearches = [
    "Electronics", "Fashion", "Home Decor", "Sports", "Beauty", 
    "Tech Deals", "Shoes", "Watches", "Bags", "Skincare",
    "Fitness", "Kitchen", "Gaming", "Outdoor"
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      {/* Search Bar */}
      <div className="px-6 pt-8 mb-6">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
            <Input
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 h-10 rounded-2xl bg-[#E5E7EB] border-0 text-[#1F2937] text-sm"
              autoFocus
            />
          </div>
          <button onClick={() => navigate(-1)} className="text-sm font-semibold text-[#1F2937]">
            Cancel
          </button>
        </div>
      </div>

      {/* Trending Searches */}
      <div className="px-6">
        <h3 className="text-sm font-semibold text-[#1F2937] mb-3">Trending Searches</h3>
        <div className="flex flex-wrap gap-2">
          {trendingSearches.map((search) => (
            <button
              key={search}
              onClick={() => setQuery(search)}
              className="px-4 py-2 rounded-full text-sm font-medium bg-white text-[#1F2937] border border-[#E5E7EB] hover:border-[#00A36C] hover:bg-[#D6F5E9] transition-all"
            >
              {search}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}