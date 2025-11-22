import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Mic, Camera, MessageSquare, Filter, Heart, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SmartFinder() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  const popularSearches = [
    "Budget Tech",
    "Trending Apparel", 
    "Best Under $50",
    "Recommended For You"
  ];

  const mockResults = [
    { id: 1, title: "Nike Running Shoes", price: "$89.99", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400" },
    { id: 2, title: "Adidas Sneakers", price: "$79.99", image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400" },
    { id: 3, title: "Puma Sport Shoes", price: "$69.99", image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400" },
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setShowResults(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      <div className="px-6 pt-8 pb-4">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6 text-[#1F2937]" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#1F2937]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              SmartFinder
            </h1>
            <p className="text-sm text-[#6B7280]">Find exactly what you're looking for</p>
          </div>
        </div>

        <div className="relative mb-4">
          <Input
            placeholder="Describe what you're looking for (e.g., red Nike running shoes, under $120)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="pr-12 h-12 rounded-2xl"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2">
            <Mic className="w-5 h-5 text-[#6B7280]" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <button
            onClick={() => navigate(createPageUrl("Snap"))}
            className="bg-white rounded-xl p-3 border border-[#E5E7EB] flex flex-col items-center gap-2"
          >
            <Camera className="w-6 h-6 text-[#00A36C]" />
            <span className="text-xs font-semibold text-[#1F2937]">Photo Scan</span>
          </button>
          <button className="bg-white rounded-xl p-3 border border-[#E5E7EB] flex flex-col items-center gap-2">
            <MessageSquare className="w-6 h-6 text-[#00A36C]" />
            <span className="text-xs font-semibold text-[#1F2937]">Describe It</span>
          </button>
          <button className="bg-white rounded-xl p-3 border border-[#E5E7EB] flex flex-col items-center gap-2">
            <Filter className="w-6 h-6 text-[#00A36C]" />
            <span className="text-xs font-semibold text-[#1F2937]">Category</span>
          </button>
        </div>
      </div>

      {!showResults ? (
        <div className="px-6">
          <h3 className="text-sm font-bold text-[#1F2937] mb-3">Popular Searches Today</h3>
          <div className="grid grid-cols-2 gap-3">
            {popularSearches.map((search, idx) => (
              <button
                key={idx}
                onClick={() => { setSearchQuery(search); setShowResults(true); }}
                className="bg-white rounded-xl p-4 border border-[#E5E7EB] text-left hover:border-[#00A36C] transition-colors"
              >
                <Sparkles className="w-5 h-5 text-[#00A36C] mb-2" />
                <span className="text-sm font-semibold text-[#1F2937]">{search}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="px-6">
          <div className="bg-[#D6F5E9] rounded-xl p-4 mb-4">
            <p className="text-sm text-[#00A36C]">
              <strong>AI Reasoning:</strong> We matched your request based on brand, price range, materials, and popularity.
            </p>
          </div>

          <h3 className="text-sm font-bold text-[#1F2937] mb-3">Results</h3>
          <div className="grid grid-cols-2 gap-4">
            {mockResults.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-sm">
                <div className="aspect-square relative">
                  <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                  <button className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center">
                    <Heart className="w-4 h-4 text-[#6B7280]" />
                  </button>
                </div>
                <div className="p-3">
                  <h4 className="text-sm font-bold text-[#1F2937] mb-1 line-clamp-2">{product.title}</h4>
                  <p className="text-lg font-bold text-[#00A36C] mb-2">{product.price}</p>
                  <Button variant="outline" size="sm" className="w-full text-xs rounded-xl border-[#00A36C] text-[#00A36C]">
                    More Like This
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}