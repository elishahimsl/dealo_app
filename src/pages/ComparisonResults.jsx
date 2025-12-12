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
  const overallWinner = Math.round(Object.values(winnerScores).reduce((a, b) => a + b, 0) / Object.keys(winnerScores).length);

  const item1Stores = [
    { name: "Amazon", logo: "https://logo.clearbit.com/amazon.com", price: "$299", url: "#" },
    { name: "Target", logo: "https://logo.clearbit.com/target.com", price: "$309", url: "#" },
    { name: "Best Buy", logo: "https://logo.clearbit.com/bestbuy.com", price: "$289", url: "#" }
  ];

  const item2Stores = [
    { name: "Amazon", logo: "https://logo.clearbit.com/amazon.com", price: "$319", url: "#" },
    { name: "Best Buy", logo: "https://logo.clearbit.com/bestbuy.com", price: "$329", url: "#" },
    { name: "Walmart", logo: "https://logo.clearbit.com/walmart.com", price: "$299", url: "#" }
  ];

  const alternatives = [
    { name: "Dell XPS 15", price: "$249", description: "Similar but cheaper", image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=200" },
    { name: "HP Spectre x360", price: "$249", description: "Better specs at same price", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200" },
    { name: "Lenovo ThinkPad", price: "$279", description: "Best value overall", image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=200" }
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

      <div className="px-6 py-6 space-y-4">
        {/* Product Comparison Tile */}
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <div className="flex items-start gap-4">
            {/* Product 1 */}
            <div className="flex-1 relative">
              <div className="absolute -top-2 -right-2 z-10">
                <div className="bg-[#00A36C] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-md">
                  LOWEST PRICE
                </div>
              </div>
              <div className="bg-white rounded-2xl overflow-hidden">
                <div className="w-full h-40 bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center p-4">
                  <img src={item1.file_url} alt={item1.title} className="max-w-full max-h-full object-contain" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[#1F2937] text-base mb-2">{item1.title}</h3>
                  <p className="text-2xl font-bold text-[#1F2937] mb-2">{item1.price}</p>
                  <div className="flex items-center gap-1 mb-3">
                    <span className="text-sm font-semibold text-[#1F2937]">4.5 ★</span>
                  </div>
                  <p className="text-sm font-bold text-[#1F2937]">amazon</p>
                </div>
              </div>
            </div>

            {/* VS Circle */}
            <div className="flex-shrink-0 pt-20">
              <div className="w-14 h-14 rounded-full bg-[#E5E7EB] flex items-center justify-center shadow-md">
                <span className="text-base font-bold text-[#6B7280]">VS</span>
              </div>
            </div>

            {/* Product 2 */}
            <div className="flex-1 relative">
              <div className="absolute -top-2 -right-2 z-10">
                <div className="bg-[#3B82F6] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-md">
                  POPULAR PICK
                </div>
              </div>
              <div className="bg-white rounded-2xl overflow-hidden">
                <div className="w-full h-40 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center p-4">
                  <img src={item2.file_url} alt={item2.title} className="max-w-full max-h-full object-contain" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[#1F2937] text-base mb-2">{item2.title}</h3>
                  <p className="text-2xl font-bold text-[#1F2937] mb-2">{item2.price}</p>
                  <div className="flex items-center gap-1 mb-3">
                    <span className="text-sm font-semibold text-[#1F2937]">4.7 ★</span>
                  </div>
                  <p className="text-sm font-bold text-[#1F2937]">BEST BUY</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Best Choice Tile */}
        <div className="bg-white rounded-3xl p-5 shadow-lg">
          <h2 className="text-sm font-bold text-[#6B7280] mb-3">Best Choice For You</h2>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-[#1F2937]">{winner.title}</h3>
            <div className="flex items-baseline">
              <span className="text-4xl font-bold text-[#1F2937]">{overallWinner}</span>
              <span className="text-xl text-[#6B7280]">/100</span>
            </div>
          </div>
          <div className="w-full h-2 bg-[#E5E7EB] rounded-full mb-3 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#3B82F6] to-[#00A36C] rounded-full" style={{ width: `${overallWinner}%` }} />
          </div>
          <p className="text-xs text-[#6B7280]">
            Better price stability, higher review quality, and stronger durability
          </p>
        </div>

        {/* Detailed Scores Tile */}
        <div className="bg-white rounded-3xl p-5 shadow-lg">
          <div className="space-y-3">
            {[
              { label: "Price", item1: item1Scores.price, item2: item2Scores.price },
              { label: "Durability", item1: item1Scores.durability, item2: item2Scores.durability },
              { label: "Reviews", item1: item1Scores.reviews, item2: item2Scores.reviews },
              { label: "Brand Reputation", item1: item1Scores.brand, item2: item2Scores.brand },
              { label: "Features", item1: item1Scores.features, item2: item2Scores.features },
              { label: "Design", item1: item1Scores.design, item2: item2Scores.design }
            ].map((category) => (
              <div key={category.label} className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#1F2937] w-36">{category.label}</span>
                <div className="flex items-center gap-6">
                  <span className="text-xl font-bold text-[#1F2937] w-10 text-right">{category.item1}</span>
                  <span className="text-xl font-bold text-[#6B7280] w-10 text-right">{category.item2}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price History Tile */}
        <div className="bg-white rounded-3xl p-5 shadow-lg">
          <h2 className="text-base font-bold text-[#1F2937] mb-4">Price History</h2>
          
          {/* Graph with gradient */}
          <div className="relative h-40 mb-4">
            <svg className="w-full h-full" viewBox="0 0 400 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#3B82F6', stopOpacity: 0.3 }} />
                  <stop offset="100%" style={{ stopColor: '#3B82F6', stopOpacity: 0 }} />
                </linearGradient>
                <linearGradient id="gradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#00A36C', stopOpacity: 0.3 }} />
                  <stop offset="100%" style={{ stopColor: '#00A36C', stopOpacity: 0 }} />
                </linearGradient>
              </defs>
              
              {/* Grid lines */}
              <line x1="0" y1="30" x2="400" y2="30" stroke="#E5E7EB" strokeWidth="1" />
              <line x1="0" y1="60" x2="400" y2="60" stroke="#E5E7EB" strokeWidth="1" />
              <line x1="0" y1="90" x2="400" y2="90" stroke="#E5E7EB" strokeWidth="1" />
              
              {/* Product 1 area (blue) */}
              <path
                d="M0,50 Q100,30 200,45 T400,55 L400,120 L0,120 Z"
                fill="url(#gradient1)"
              />
              <path
                d="M0,50 Q100,30 200,45 T400,55"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="3"
                strokeLinecap="round"
              />
              
              {/* Product 2 area (green) */}
              <path
                d="M0,70 Q100,80 200,65 T400,75 L400,120 L0,120 Z"
                fill="url(#gradient2)"
              />
              <path
                d="M0,70 Q100,80 200,65 T400,75"
                fill="none"
                stroke="#00A36C"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            
            {/* Y-axis price labels */}
            <div className="absolute left-0 top-0 text-xs font-semibold text-[#6B7280]">$400</div>
            <div className="absolute left-0 top-1/3 text-xs font-semibold text-[#6B7280]">$350</div>
            <div className="absolute left-0 top-2/3 text-xs font-semibold text-[#6B7280]">$300</div>
            <div className="absolute left-0 bottom-0 text-xs font-semibold text-[#6B7280]">$250</div>
          </div>

          {/* Verdicts in boxes */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 bg-[#E0F2FE] rounded-lg p-2 flex items-center gap-1">
              <span className="text-[#3B82F6] text-xs">↓</span>
              <span className="text-[#3B82F6] text-xs font-medium">Lowest in 60 days</span>
            </div>
            <div className="flex-1 bg-[#FEE2E2] rounded-lg p-2 flex items-center gap-1">
              <span className="text-[#EF4444] text-xs">↓</span>
              <span className="text-[#EF4444] text-xs font-medium">Likely to drop soon</span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#3B82F6]"></div>
              <span className="text-[#6B7280] font-medium">{item1.title}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#00A36C]"></div>
              <span className="text-[#6B7280] font-medium">{item2.title}</span>
            </div>
          </div>
        </div>

        {/* Store Options Tiles */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-lg">
          <div className="p-5 pb-3">
            <h2 className="text-base font-bold text-[#1F2937] mb-1">Store Options</h2>
          </div>
          
          {/* Product 1 Stores */}
          <div className="px-5 pb-4">
            <h3 className="text-sm font-semibold text-[#6B7280] mb-2">{item1.title}</h3>
            <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
              {item1Stores.map((store, idx) => (
                <button key={idx} className="w-full flex items-center justify-between p-4 hover:bg-[#F9FAFB] transition-colors border-b border-[#E5E7EB] last:border-b-0">
                  <div className="flex items-center gap-3">
                    <img src={store.logo} alt={store.name} className="w-6 h-6 object-contain" onError={(e) => e.target.style.display = 'none'} />
                    <span className="text-lg font-bold text-[#1F2937]">{store.price}</span>
                  </div>
                  <span className="text-sm font-medium text-[#9CA3AF]">Go to Store</span>
                </button>
              ))}
            </div>
          </div>

          {/* Product 2 Stores */}
          <div className="px-5 pb-5">
            <h3 className="text-sm font-semibold text-[#6B7280] mb-2">{item2.title}</h3>
            <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
              {item2Stores.map((store, idx) => (
                <button key={idx} className="w-full flex items-center justify-between p-4 hover:bg-[#F9FAFB] transition-colors border-b border-[#E5E7EB] last:border-b-0">
                  <div className="flex items-center gap-3">
                    <img src={store.logo} alt={store.name} className="w-6 h-6 object-contain" onError={(e) => e.target.style.display = 'none'} />
                    <span className="text-lg font-bold text-[#1F2937]">{store.price}</span>
                  </div>
                  <span className="text-sm font-medium text-[#9CA3AF]">Go to Store</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* AI Alternatives Tile */}
        <div className="bg-white rounded-3xl p-5 shadow-lg">
          <h2 className="text-base font-bold text-[#1F2937] mb-4">AI Alternatives</h2>
          <div className="grid grid-cols-3 gap-3">
            {alternatives.map((alt, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-sm">
                <div className="w-full h-28 bg-[#F3F4F6] flex items-center justify-center p-3">
                  <img src={alt.image} alt={alt.name} className="max-w-full max-h-full object-contain" />
                </div>
                <div className="p-3">
                  <p className="text-base font-bold text-[#1F2937] mb-1">{alt.price}</p>
                  <p className="text-xs text-[#3B82F6] font-medium">{alt.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] px-6 py-4 z-30">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <Button 
            onClick={() => setIsSaved(!isSaved)}
            className="flex-1 bg-white border-2 border-[#00A36C] text-[#00A36C] hover:bg-[#F0FDF4] font-semibold rounded-xl h-12 text-sm"
          >
            Save Comparison
          </Button>
          <Button className="bg-white border-2 border-[#E5E7EB] hover:bg-[#F9FAFB] h-12 px-4 rounded-xl">
            <Share2 className="w-5 h-5 text-[#6B7280]" />
          </Button>
          <Button className="flex-1 bg-[#00A36C] hover:bg-[#007E52] text-white font-semibold rounded-xl h-12 text-sm">
            Buy Winner
          </Button>
        </div>
      </div>
    </div>
  );
}