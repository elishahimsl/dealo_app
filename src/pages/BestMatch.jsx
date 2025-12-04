import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tag, Settings, Send, Mic, Camera, Star, Zap, DollarSign, Heart, Package, Sliders, X, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";

export default function BestMatch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);

  const placeholders = [
    "A gift for my dad under $50",
    "Wireless earbuds for running",
    "A cozy hoodie with good reviews",
    "A gaming laptop for $900 or less",
    "Best headphones for music production"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const [filters, setFilters] = useState({
    brands: ["Apple", "Nike", "Adidas"],
    stores: ["Target", "Amazon", "Best Buy"],
    priceRange: "$$",
    quality: "Best Value"
  });

  const [priorities, setPriorities] = useState({
    specs: 50,
    reviews: 70,
    price: 80,
    delivery: 40,
    preferences: 60
  });

  const results = [
    { id: 1, title: "Sony WH-1000XM5", price: "$348", image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400", match: 93, reasons: ["Matches your brand preference", "Under your budget", "Highly rated"], rating: 4.8, reviews: 12400 },
    { id: 2, title: "Bose QuietComfort 45", price: "$279", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400", match: 85, reasons: ["Great noise cancellation", "Premium build quality"], rating: 4.7, reviews: 8900 },
    { id: 3, title: "Apple AirPods Max", price: "$449", image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400", match: 81, reasons: ["Top rated by users", "Apple ecosystem"], rating: 4.6, reviews: 15200 },
    { id: 4, title: "Sennheiser HD 660S", price: "$399", image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400", match: 78, reasons: ["Audiophile quality", "Open-back design"], rating: 4.9, reviews: 3200 },
  ];

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowResults(true);
    }, 1500);
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] pb-24">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 bg-white border-b border-[#E5E7EB]">
          <div className="flex items-center justify-between">
            <button onClick={() => setShowResults(false)} className="relative flex items-center justify-center group">
              <Tag className="w-5 h-5 text-[#00A36C] transform -rotate-45 group-hover:rotate-0 transition-transform duration-300 group-hover:scale-110" />
            </button>
            <h1 className="text-base font-medium text-[#1F2937]">Best Match</h1>
            <button onClick={() => setShowFilters(true)}>
              <Sliders className="w-5 h-5 text-[#6B7280]" />
            </button>
          </div>
        </div>

        {/* Hero Result */}
        <div className="px-6 py-4">
          <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-lg overflow-hidden mb-4">
            <div className="relative">
              <img src={results[0].image} alt={results[0].title} className="w-full h-48 object-cover" />
              <div className="absolute top-3 right-3 bg-[#00A36C] text-white px-3 py-1.5 rounded-full flex items-center gap-1">
                <Star className="w-4 h-4 fill-white" />
                <span className="text-sm font-bold">{results[0].match}% Match</span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-xl font-bold text-[#1F2937] mb-1">{results[0].title}</h3>
              <p className="text-2xl font-bold text-[#00A36C] mb-3">{results[0].price}</p>
              <div className="space-y-1.5 mb-4">
                {results[0].reasons.map((reason, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#00A36C]" />
                    <span className="text-xs text-[#6B7280]">{reason}</span>
                  </div>
                ))}
              </div>
              <Button className="w-full bg-[#00A36C] hover:bg-[#007E52] rounded-2xl font-semibold">
                View Product
              </Button>
            </div>
          </div>

          {/* Alternative Matches */}
          <h3 className="text-sm font-bold text-[#1F2937] mb-3">Alternative Matches</h3>
          <div className="grid grid-cols-2 gap-3">
            {results.slice(1).map((product) => (
              <div key={product.id} className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                <div className="relative">
                  <img src={product.image} alt={product.title} className="w-full h-28 object-cover" />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full">
                    <span className="text-xs font-bold text-[#00A36C]">{product.match}%</span>
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="text-xs font-bold text-[#1F2937] mb-1 line-clamp-2">{product.title}</h4>
                  <p className="text-sm font-bold text-[#1F2937]">{product.price}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 text-[#00A36C] fill-[#00A36C]" />
                    <span className="text-[10px] text-[#6B7280]">{product.rating} ({product.reviews.toLocaleString()})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter Overlay */}
        {showFilters && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
            <div className="bg-white rounded-t-3xl w-full p-6 max-h-[70vh] overflow-y-auto animate-slide-up">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-[#1F2937]">Adjust Filters</h3>
                <button onClick={() => setShowFilters(false)}>
                  <X className="w-6 h-6 text-[#6B7280]" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-[#1F2937] mb-2">Price Range</h4>
                  <div className="flex gap-2">
                    {["$", "$$", "$$$", "$$$$"].map((p) => (
                      <button key={p} onClick={() => setFilters({...filters, priceRange: p})} className={`flex-1 py-2 rounded-xl text-sm font-semibold ${filters.priceRange === p ? 'bg-[#00A36C] text-white' : 'bg-[#F3F4F6] text-[#6B7280]'}`}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-[#1F2937] mb-2">Quality Level</h4>
                  <div className="flex gap-2">
                    {["Best Value", "Premium", "Top Rated"].map((q) => (
                      <button key={q} onClick={() => setFilters({...filters, quality: q})} className={`flex-1 py-2 rounded-xl text-xs font-semibold ${filters.quality === q ? 'bg-[#00A36C] text-white' : 'bg-[#F3F4F6] text-[#6B7280]'}`}>
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                <Button onClick={() => setShowFilters(false)} className="w-full bg-[#00A36C] hover:bg-[#007E52] rounded-2xl font-semibold">
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        )}

        <style>{`@keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } } .animate-slide-up { animation: slide-up 0.3s ease-out; }`}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="relative flex items-center justify-center group">
            <Tag className="w-5 h-5 text-[#00A36C] transform -rotate-45 group-hover:rotate-0 transition-transform duration-300 group-hover:scale-110" />
          </button>
          <h1 className="text-base font-medium text-[#1F2937]">Best Match</h1>
          <button onClick={() => navigate("/Customization")}>
            <Settings className="w-5 h-5 text-[#6B7280]" />
          </button>
        </div>
      </div>

      {/* Input Section */}
      <div className="px-6 mb-6">
        <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-lg p-6">
          <h2 className="text-lg font-bold text-[#1F2937] mb-2">Describe what you want</h2>
          <p className="text-xs text-[#6B7280] mb-4">Tell me what you're looking for and I'll find the best match</p>
          
          <div className="relative mb-4">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholders[placeholderIdx]}
              className="h-14 rounded-2xl border-[#E5E7EB] pr-12 text-sm"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#00A36C] flex items-center justify-center">
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>

          <div className="flex justify-center gap-6">
            <button className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center">
                <span className="text-sm">✏️</span>
              </div>
              <span className="text-[10px] text-[#6B7280]">Write it</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center">
                <Mic className="w-4 h-4 text-[#6B7280]" />
              </div>
              <span className="text-[10px] text-[#6B7280]">Speak it</span>
            </button>
            <button onClick={() => navigate("/Snap")} className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center">
                <Camera className="w-4 h-4 text-[#6B7280]" />
              </div>
              <span className="text-[10px] text-[#6B7280]">Snap it</span>
            </button>
          </div>
        </div>
      </div>

      {/* Smart Filters */}
      <div className="px-6 mb-6">
        <h3 className="text-sm font-bold text-[#1F2937] mb-3">Smart Filters</h3>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {filters.brands.map((brand) => (
            <button key={brand} className="flex-shrink-0 px-4 py-2 rounded-full bg-[#00A36C]/10 border border-[#00A36C] text-[#00A36C] text-xs font-semibold">
              {brand}
            </button>
          ))}
          {filters.stores.map((store) => (
            <button key={store} className="flex-shrink-0 px-4 py-2 rounded-full bg-[#F3F4F6] text-[#6B7280] text-xs font-semibold">
              {store}
            </button>
          ))}
          <button className="flex-shrink-0 px-4 py-2 rounded-full bg-[#F3F4F6] text-[#6B7280] text-xs font-semibold">
            {filters.priceRange}
          </button>
          <button className="flex-shrink-0 px-4 py-2 rounded-full bg-[#F3F4F6] text-[#6B7280] text-xs font-semibold">
            {filters.quality}
          </button>
        </div>
      </div>

      {/* Match Score Priorities */}
      <div className="px-6 mb-6">
        <h3 className="text-sm font-bold text-[#1F2937] mb-3">Match Score Priorities</h3>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 space-y-4">
          {[
            { key: "specs", icon: "🔧", label: "Specs matter most" },
            { key: "reviews", icon: "⭐", label: "Reviews matter most" },
            { key: "price", icon: "💸", label: "Price matters most" },
            { key: "delivery", icon: "⚡", label: "Fast delivery matters most" },
            { key: "preferences", icon: "❤️", label: "My preferences matter most" },
          ].map((item) => (
            <div key={item.key} className="flex items-center gap-3">
              <span className="text-lg">{item.icon}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[#1F2937]">{item.label}</span>
                  <span className="text-[10px] text-[#6B7280]">{priorities[item.key]}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={priorities[item.key]}
                  onChange={(e) => setPriorities({...priorities, [item.key]: parseInt(e.target.value)})}
                  className="w-full h-1.5 bg-[#E5E7EB] rounded-full appearance-none cursor-pointer accent-[#00A36C]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-3xl p-8 text-center">
            <div className="w-16 h-16 border-4 border-[#00A36C] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-semibold text-[#1F2937]">Finding your best matches...</p>
          </div>
        </div>
      )}

      <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
    </div>
  );
}