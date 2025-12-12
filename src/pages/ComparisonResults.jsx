import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Heart, Share2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ComparisonResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const { item1, item2, result, preferences } = location.state || {};
  const [isSaved, setIsSaved] = useState(false);

  if (!result || !item1 || !item2) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <p className="text-[#6B7280]">No comparison data available</p>
      </div>
    );
  }

  const winner = result.winner === "item1" ? item1 : item2;
  const loser = result.winner === "item1" ? item2 : item1;

  // Mock scores
  const item1Scores = {
    price: 92,
    durability: 85,
    reviews: 83,
    brand: 85,
    features: 88,
    design: 90
  };

  const item2Scores = {
    price: 85,
    durability: 85,
    reviews: 85,
    brand: 89,
    features: 82,
    design: 84
  };

  const winnerScores = result.winner === "item1" ? item1Scores : item2Scores;
  const loserScores = result.winner === "item1" ? item2Scores : item1Scores;

  const overallWinner = Math.round(Object.values(winnerScores).reduce((a, b) => a + b, 0) / Object.keys(winnerScores).length);
  const overallLoser = Math.round(Object.values(loserScores).reduce((a, b) => a + b, 0) / Object.keys(loserScores).length);

  // Mock store data
  const item1Stores = [
    { name: "Amazon", logo: "https://logo.clearbit.com/amazon.com", price: "$1,299", url: "#" },
    { name: "Best Buy", logo: "https://logo.clearbit.com/bestbuy.com", price: "$1,349", url: "#" },
    { name: "B&H Photo", logo: "https://logo.clearbit.com/bhphotovideo.com", price: "$1,399", url: "#" }
  ];

  const item2Stores = [
    { name: "Amazon", logo: "https://logo.clearbit.com/amazon.com", price: "$1,199", url: "#" },
    { name: "Best Buy", logo: "https://logo.clearbit.com/bestbuy.com", price: "$1,289", url: "#" },
    { name: "Walmart", logo: "https://logo.clearbit.com/walmart.com", price: "$1,249", url: "#" }
  ];

  const alternatives = [
    { name: "Dell XPS 15", price: "$1,249", description: "Similar but cheaper", image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=200" },
    { name: "HP Spectre x360", price: "$1,249", description: "Better specs at same price", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200" },
    { name: "Lenovo ThinkPad X1", price: "$1,279", description: "Best value overall", image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=200" }
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-32">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-[#E5E7EB] px-6 py-4">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6 text-[#1F2937]" />
          </button>
          <h1 className="text-base font-bold text-[#1F2937]">Comparison Results</h1>
          <button onClick={() => setIsSaved(!isSaved)}>
            <Bookmark className={`w-6 h-6 ${isSaved ? 'fill-[#00A36C] text-[#00A36C]' : 'text-[#6B7280]'}`} />
          </button>
        </div>
      </div>

      {/* Product Comparison Cards */}
      <div className="px-6 py-6 bg-white">
        <div className="flex items-start gap-4">
          {/* Product 1 */}
          <div className="flex-1 relative">
            <div className="absolute -top-2 -right-2 z-10">
              <div className="bg-[#00A36C] text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
                LOWEST PRICE
              </div>
            </div>
            <div className="bg-[#F9FAFB] rounded-2xl p-4 border border-[#E5E7EB]">
              <div className="w-full h-32 mb-3 flex items-center justify-center">
                <img src={item1.file_url} alt={item1.title} className="max-w-full max-h-full object-contain" />
              </div>
              <h3 className="font-bold text-[#1F2937] text-sm mb-2 line-clamp-2">{item1.title}</h3>
              <p className="text-xl font-bold text-[#00A36C] mb-2">{item1.price}</p>
              <div className="flex items-center gap-1 mb-1">
                <span className="text-sm font-semibold text-[#1F2937]">4.5 ★</span>
                <span className="text-xs text-[#6B7280]">(17.4k Reviews)</span>
              </div>
              <p className="text-xs font-bold text-[#1F2937] mt-2">amazon</p>
            </div>
          </div>

          {/* VS Circle */}
          <div className="flex-shrink-0 pt-16">
            <div className="w-12 h-12 rounded-full bg-[#E5E7EB] flex items-center justify-center">
              <span className="text-sm font-bold text-[#6B7280]">VS</span>
            </div>
          </div>

          {/* Product 2 */}
          <div className="flex-1 relative">
            <div className="absolute -top-2 -right-2 z-10">
              <div className="bg-[#3B82F6] text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
                POPULAR PICK
              </div>
            </div>
            <div className="bg-[#F9FAFB] rounded-2xl p-4 border border-[#E5E7EB]">
              <div className="w-full h-32 mb-3 flex items-center justify-center">
                <img src={item2.file_url} alt={item2.title} className="max-w-full max-h-full object-contain" />
              </div>
              <h3 className="font-bold text-[#1F2937] text-sm mb-2 line-clamp-2">{item2.title}</h3>
              <p className="text-xl font-bold text-[#00A36C] mb-2">{item2.price}</p>
              <div className="flex items-center gap-1 mb-1">
                <span className="text-sm font-semibold text-[#1F2937]">4.7 ★</span>
                <span className="text-xs text-[#6B7280]">(12.1k Reviews)</span>
              </div>
              <p className="text-xs font-bold text-[#1F2937] mt-2">BEST BUY</p>
            </div>
          </div>
        </div>
      </div>

      {/* Best Choice Section */}
      <div className="px-6 py-6 bg-white mt-2">
        <h2 className="text-base font-bold text-[#1F2937] mb-4">Best Choice For You</h2>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-2xl font-bold text-[#1F2937]">{winner.title}</h3>
          <div className="flex items-baseline">
            <span className="text-5xl font-bold text-[#1F2937]">{overallWinner}</span>
            <span className="text-2xl text-[#6B7280]">/100</span>
          </div>
        </div>
        <div className="w-full h-2 bg-[#E5E7EB] rounded-full mb-4 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#3B82F6] to-[#00A36C] rounded-full" style={{ width: `${overallWinner}%` }} />
        </div>
        <p className="text-sm text-[#6B7280]">
          Better price stability, higher review quality, and stronger durability
        </p>
      </div>

      {/* Detailed Scores */}
      <div className="px-6 py-6 bg-white mt-2">
        <div className="space-y-4">
          {[
            { label: "Price", item1: item1Scores.price, item2: item2Scores.price },
            { label: "Durability", item1: item1Scores.durability, item2: item2Scores.durability },
            { label: "Reviews", item1: item1Scores.reviews, item2: item2Scores.reviews },
            { label: "Brand Reputation", item1: item1Scores.brand, item2: item2Scores.brand },
            { label: "Features", item1: item1Scores.features, item2: item2Scores.features },
            { label: "Design", item1: item1Scores.design, item2: item2Scores.design }
          ].map((category) => (
            <div key={category.label} className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#1F2937] w-32">{category.label}</span>
              <div className="flex items-center gap-4 flex-1 justify-end">
                <span className="text-lg font-bold text-[#1F2937] w-12 text-right">{category.item1}</span>
                <span className="text-lg font-bold text-[#6B7280] w-12 text-right">{category.item2}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Price History */}
      <div className="px-6 py-6 bg-white mt-2">
        <h2 className="text-base font-bold text-[#1F2937] mb-4">Price History</h2>
        
        {/* Graph */}
        <div className="relative h-32 mb-4">
          <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
            {/* Grid lines */}
            <line x1="0" y1="25" x2="400" y2="25" stroke="#E5E7EB" strokeWidth="1" />
            <line x1="0" y1="50" x2="400" y2="50" stroke="#E5E7EB" strokeWidth="1" />
            <line x1="0" y1="75" x2="400" y2="75" stroke="#E5E7EB" strokeWidth="1" />
            
            {/* Product 1 line (blue) */}
            <path
              d="M0,40 Q100,20 200,35 T400,45"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2"
              strokeLinecap="round"
            />
            
            {/* Product 2 line (purple) */}
            <path
              d="M0,60 Q100,70 200,55 T400,65"
              fill="none"
              stroke="#A855F7"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 text-xs text-[#6B7280]">60</div>
          <div className="absolute right-0 bottom-0 text-xs text-[#6B7280]">30</div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-[#3B82F6]"></div>
              <span className="text-[#6B7280]">{item1.title}</span>
            </div>
            <span className="text-[#00A36C]">↓ Lowest in 60 days</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-[#A855F7]"></div>
            <span className="text-[#6B7280]">{item2.title}</span>
            <span className="text-[#EF4444]">↓ Likely to drop soon</span>
          </div>
        </div>
      </div>

      {/* Store Options for Both Products */}
      <div className="px-6 py-6 bg-white mt-2">
        <h2 className="text-base font-bold text-[#1F2937] mb-4">Store Options</h2>
        
        {/* Product 1 Stores */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-[#6B7280] mb-3">{item1.title}</h3>
          <div className="space-y-2">
            {item1Stores.map((store, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
                <div className="flex items-center gap-3">
                  <img src={store.logo} alt={store.name} className="w-8 h-8" onError={(e) => e.target.style.display = 'none'} />
                  <span className="text-lg font-bold text-[#1F2937]">{store.price}</span>
                </div>
                <Button className="bg-white border border-[#E5E7EB] text-[#1F2937] hover:bg-[#F9FAFB] text-sm px-4 py-2 h-auto rounded-lg">
                  Go to Store
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Product 2 Stores */}
        <div>
          <h3 className="text-sm font-semibold text-[#6B7280] mb-3">{item2.title}</h3>
          <div className="space-y-2">
            {item2Stores.map((store, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
                <div className="flex items-center gap-3">
                  <img src={store.logo} alt={store.name} className="w-8 h-8" onError={(e) => e.target.style.display = 'none'} />
                  <span className="text-lg font-bold text-[#1F2937]">{store.price}</span>
                </div>
                <Button className="bg-white border border-[#E5E7EB] text-[#1F2937] hover:bg-[#F9FAFB] text-sm px-4 py-2 h-auto rounded-lg">
                  Go to Store
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Alternatives */}
      <div className="px-6 py-6 bg-white mt-2">
        <h2 className="text-base font-bold text-[#1F2937] mb-4">AI Alternatives</h2>
        <div className="grid grid-cols-3 gap-3">
          {alternatives.map((alt, idx) => (
            <div key={idx} className="bg-[#F9FAFB] rounded-xl p-3 border border-[#E5E7EB]">
              <div className="w-full h-24 mb-2 flex items-center justify-center bg-white rounded-lg">
                <img src={alt.image} alt={alt.name} className="max-w-full max-h-full object-contain" />
              </div>
              <p className="text-lg font-bold text-[#1F2937] mb-1">{alt.price}</p>
              <p className="text-xs text-[#3B82F6] font-medium">{alt.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] px-6 py-4 z-30">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <Button 
            onClick={() => setIsSaved(!isSaved)}
            className="flex-1 bg-white border-2 border-[#00A36C] text-[#00A36C] hover:bg-[#F0FDF4] font-semibold rounded-xl h-12"
          >
            Save Comparison
          </Button>
          <Button className="bg-white border-2 border-[#E5E7EB] hover:bg-[#F9FAFB] h-12 px-4 rounded-xl">
            <Share2 className="w-5 h-5 text-[#6B7280]" />
          </Button>
          <Button className="flex-1 bg-[#00A36C] hover:bg-[#007E52] text-white font-semibold rounded-xl h-12">
            Buy Winner
          </Button>
        </div>
      </div>
    </div>
  );
}