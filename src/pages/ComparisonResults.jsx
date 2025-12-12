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
      <div className="sticky top-0 z-20 bg-[#F9FAFB] px-6 py-4">
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
        {/* Product Comparison Cards */}
        <div className="flex items-start gap-3">
          {/* Product 1 */}
          <div className="flex-1">
            <div className="bg-white rounded-3xl shadow-lg relative overflow-hidden" style={{ aspectRatio: '1/1' }}>
              <div className="absolute -top-2 -right-2 z-10">
                <div className="bg-[#00A36C] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-md">
                  LOWEST PRICE
                </div>
              </div>
              <div className="w-full h-full flex items-center justify-center p-4">
                <img src={item1.file_url} alt={item1.title} className="max-w-full max-h-full object-contain" />
              </div>
            </div>
            <div className="mt-2 px-1">
              <h3 className="font-bold text-[#1F2937] text-xs mb-1 line-clamp-2">{item1.title}</h3>
              <p className="text-base font-bold text-[#1F2937] mb-1">{item1.price}</p>
              <div className="flex items-center gap-1 mb-1">
                <span className="text-xs font-semibold text-[#1F2937]">4.5 <span className="text-yellow-400">★</span></span>
                <span className="text-[10px] text-[#6B7280]">(17.4k Reviews)</span>
              </div>
              <img src="https://logo.clearbit.com/amazon.com" alt="amazon" className="h-4 object-contain" onError={(e) => e.target.style.display = 'none'} />
            </div>
          </div>

          {/* VS Circle */}
          <div className="flex-shrink-0" style={{ paddingTop: '60px' }}>
            <div className="w-12 h-12 rounded-full bg-[#E5E7EB] flex items-center justify-center shadow-md">
              <span className="text-sm font-bold text-[#6B7280]">VS</span>
            </div>
          </div>

          {/* Product 2 */}
          <div className="flex-1">
            <div className="bg-white rounded-3xl shadow-lg relative overflow-hidden" style={{ aspectRatio: '1/1' }}>
              <div className="absolute -top-2 -right-2 z-10">
                <div className="bg-[#3B82F6] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-md">
                  POPULAR PICK
                </div>
              </div>
              <div className="w-full h-full flex items-center justify-center p-4">
                <img src={item2.file_url} alt={item2.title} className="max-w-full max-h-full object-contain" />
              </div>
            </div>
            <div className="mt-2 px-1">
              <h3 className="font-bold text-[#1F2937] text-xs mb-1 line-clamp-2">{item2.title}</h3>
              <p className="text-base font-bold text-[#1F2937] mb-1">{item2.price}</p>
              <div className="flex items-center gap-1 mb-1">
                <span className="text-xs font-semibold text-[#1F2937]">4.7 <span className="text-yellow-400">★</span></span>
                <span className="text-[10px] text-[#6B7280]">(12.1k Reviews)</span>
              </div>
              <img src="https://logo.clearbit.com/bestbuy.com" alt="Best Buy" className="h-4 object-contain" onError={(e) => e.target.style.display = 'none'} />
            </div>
          </div>
        </div>

        {/* Best Choice Tile */}
        <div className="bg-white rounded-xl p-5 shadow-lg">
          <h2 className="text-sm font-bold text-[#6B7280] mb-3">Best Choice For You</h2>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-[#1F2937]">{winner.title}</h3>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-[#1F2937]">{overallWinner}</span>
              <span className="text-base text-[#6B7280]">/100</span>
            </div>
          </div>
          <div className="w-full h-2 bg-[#E5E7EB] rounded-full mb-3 overflow-hidden">
            <div className="h-full bg-[#00A36C] rounded-full" style={{ width: `${overallWinner}%` }} />
          </div>
          <p className="text-xs text-[#6B7280]">
            {winner.title} wins with superior value and performance. It offers {result.winner === "item1" ? "better pricing" : "higher quality features"} and {result.winner === "item1" ? "stronger build quality" : "better brand reputation"}, making it the smarter choice for your needs.
          </p>
        </div>

        {/* Detailed Scores Tile */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <div>
            {[
              { label: "Price", item1: item1Scores.price, item2: item2Scores.price },
              { label: "Durability", item1: item1Scores.durability, item2: item2Scores.durability },
              { label: "Reviews", item1: item1Scores.reviews, item2: item2Scores.reviews },
              { label: "Brand Reputation", item1: item1Scores.brand, item2: item2Scores.brand },
              { label: "Features", item1: item1Scores.features, item2: item2Scores.features },
              { label: "Design", item1: item1Scores.design, item2: item2Scores.design }
            ].map((category, idx) => (
              <div key={category.label}>
                <div className="flex items-center justify-between py-3">
                  <span className="text-sm font-semibold text-[#1F2937]">{category.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-[#1F2937]">{category.item1}</span>
                    <span className="text-sm font-bold text-[#9CA3AF]">{category.item2}</span>
                  </div>
                </div>
                {idx < 5 && <div className="border-b border-[#E5E7EB]" />}
              </div>
            ))}
          </div>
        </div>

        {/* Price History Tile */}
        <div className="bg-white rounded-xl p-5 shadow-lg">
          <h2 className="text-base font-bold text-[#1F2937] mb-4">Price History</h2>
          
          {/* Graph with gradient */}
          <div className="relative h-40 mb-4 pl-10 pr-2">
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
              <line x1="0" y1="20" x2="400" y2="20" stroke="#E5E7EB" strokeWidth="1" />
              <line x1="0" y1="50" x2="400" y2="50" stroke="#E5E7EB" strokeWidth="1" />
              <line x1="0" y1="80" x2="400" y2="80" stroke="#E5E7EB" strokeWidth="1" />
              <line x1="0" y1="110" x2="400" y2="110" stroke="#E5E7EB" strokeWidth="1" />
              
              {/* Product 1 area (blue) - jagged stock line */}
              <path
                d="M0,45 L50,35 L100,42 L150,25 L200,38 L250,30 L300,45 L350,40 L400,50"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M0,45 L50,35 L100,42 L150,25 L200,38 L250,30 L300,45 L350,40 L400,50 L400,120 L0,120 Z"
                fill="url(#gradient1)"
              />
              
              {/* Product 1 dots */}
              <circle cx="0" cy="45" r="4" fill="#3B82F6" />
              <circle cx="50" cy="35" r="4" fill="#3B82F6" />
              <circle cx="100" cy="42" r="4" fill="#3B82F6" />
              <circle cx="150" cy="25" r="4" fill="#3B82F6" />
              <circle cx="200" cy="38" r="4" fill="#3B82F6" />
              <circle cx="250" cy="30" r="4" fill="#3B82F6" />
              <circle cx="300" cy="45" r="4" fill="#3B82F6" />
              <circle cx="350" cy="40" r="4" fill="#3B82F6" />
              <circle cx="400" cy="50" r="4" fill="#3B82F6" />
              
              {/* Product 2 area (green) - jagged stock line */}
              <path
                d="M0,65 L50,72 L100,68 L150,80 L200,70 L250,75 L300,68 L350,72 L400,78"
                fill="none"
                stroke="#00A36C"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M0,65 L50,72 L100,68 L150,80 L200,70 L250,75 L300,68 L350,72 L400,78 L400,120 L0,120 Z"
                fill="url(#gradient2)"
              />
              
              {/* Product 2 dots */}
              <circle cx="0" cy="65" r="4" fill="#00A36C" />
              <circle cx="50" cy="72" r="4" fill="#00A36C" />
              <circle cx="100" cy="68" r="4" fill="#00A36C" />
              <circle cx="150" cy="80" r="4" fill="#00A36C" />
              <circle cx="200" cy="70" r="4" fill="#00A36C" />
              <circle cx="250" cy="75" r="4" fill="#00A36C" />
              <circle cx="300" cy="68" r="4" fill="#00A36C" />
              <circle cx="350" cy="72" r="4" fill="#00A36C" />
              <circle cx="400" cy="78" r="4" fill="#00A36C" />
            </svg>
            
            {/* Y-axis price labels */}
            <div className="absolute -left-1 top-2 text-xs font-semibold text-[#6B7280]">$400</div>
            <div className="absolute -left-1 top-1/3 text-xs font-semibold text-[#6B7280]">$350</div>
            <div className="absolute -left-1 top-2/3 text-xs font-semibold text-[#6B7280]">$300</div>
            <div className="absolute -left-1 bottom-2 text-xs font-semibold text-[#6B7280]">$250</div>
            
            {/* X-axis day labels */}
            <div className="absolute -bottom-5 left-10 text-xs text-[#6B7280]">60d</div>
            <div className="absolute -bottom-5 left-1/3 text-xs text-[#6B7280]">45d</div>
            <div className="absolute -bottom-5 left-2/3 text-xs text-[#6B7280]">30d</div>
            <div className="absolute -bottom-5 right-8 text-xs text-[#6B7280]">Today</div>
          </div>

          {/* Verdicts in boxes */}
          <div className="flex items-center gap-2 mb-4 mt-6">
            <div className="flex-1 bg-[#E0F2FE] rounded-lg p-2 flex items-center gap-1">
              <span className="text-[#3B82F6] text-xs">↓</span>
              <span className="text-[#3B82F6] text-xs font-medium">Lowest in 60 days</span>
            </div>
            <div className="flex-1 bg-[#D1FAE5] rounded-lg p-2 flex items-center gap-1">
              <span className="text-[#00A36C] text-xs">↓</span>
              <span className="text-[#00A36C] text-xs font-medium">Likely to drop soon</span>
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
        <div className="bg-white rounded-xl overflow-hidden shadow-lg">
          <div className="p-5 pb-3">
            <h2 className="text-base font-bold text-[#1F2937] mb-1">Store Options</h2>
          </div>
          
          {/* Product 1 Stores */}
          <div className="px-5 pb-4">
            <h3 className="text-xs font-semibold text-[#6B7280] mb-2">{item1.title}</h3>
            <div className="bg-white">
              {item1Stores.map((store, idx) => (
                <button key={idx} className="w-full flex items-center justify-between p-3 hover:bg-[#F9FAFB] transition-colors border-b border-[#E5E7EB] last:border-b-0">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#F3F4F6] flex items-center justify-center flex-shrink-0">
                      <img src={store.logo} alt={store.name} className="w-5 h-5 object-contain" onError={(e) => e.target.style.display = 'none'} />
                    </div>
                    <span className="text-base font-bold text-[#1F2937]">{store.price}</span>
                  </div>
                  <div className="bg-[#F3F4F6] rounded-md px-2.5 py-1">
                    <span className="text-xs font-medium text-[#6B7280]">Go to Store</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Product 2 Stores */}
          <div className="px-5 pb-5">
            <h3 className="text-xs font-semibold text-[#6B7280] mb-2">{item2.title}</h3>
            <div className="bg-white">
              {item2Stores.map((store, idx) => (
                <button key={idx} className="w-full flex items-center justify-between p-3 hover:bg-[#F9FAFB] transition-colors border-b border-[#E5E7EB] last:border-b-0">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#F3F4F6] flex items-center justify-center flex-shrink-0">
                      <img src={store.logo} alt={store.name} className="w-5 h-5 object-contain" onError={(e) => e.target.style.display = 'none'} />
                    </div>
                    <span className="text-base font-bold text-[#1F2937]">{store.price}</span>
                  </div>
                  <div className="bg-[#F3F4F6] rounded-md px-2.5 py-1">
                    <span className="text-xs font-medium text-[#6B7280]">Go to Store</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* AI Alternatives Tile */}
        <div className="bg-white rounded-xl p-5 shadow-lg">
          <h2 className="text-base font-bold text-[#1F2937] mb-4">AI Alternatives</h2>
          <div className="grid grid-cols-3 gap-4">
            {alternatives.map((alt, idx) => (
              <div key={idx} className="flex flex-col">
                <div className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden shadow-sm mb-2 relative aspect-square">
                  <div className="w-full h-full bg-[#F3F4F6] flex items-center justify-center p-3">
                    <img src={alt.image} alt={alt.name} className="max-w-full max-h-full object-contain" />
                  </div>
                  <button className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-[#FEE2E2] transition-colors">
                    <Heart className="w-4 h-4 text-[#EF4444]" />
                  </button>
                </div>
                <p className="text-base font-bold text-[#1F2937] mb-0.5">{alt.price}</p>
                <p className="text-xs font-medium text-[#1F2937] mb-0.5 line-clamp-1">{alt.name}</p>
                <p className="text-xs text-[#6B7280]">{alt.description}</p>
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