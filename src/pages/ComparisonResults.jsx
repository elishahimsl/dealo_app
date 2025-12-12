import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Heart, Share2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ComparisonResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const { item1, item2, result, preferences } = location.state || {};
  const [isSaved, setIsSaved] = useState(false);
  const [graphPosition, setGraphPosition] = useState(null);
  const [favoriteAlts, setFavoriteAlts] = useState({});
  const [activeGraph, setActiveGraph] = useState('item1'); // 'item1' or 'item2'
  const [timePeriod, setTimePeriod] = useState('1M');

  // Price history data points for item1 (blue line)
  const item1Path = [
    { x: 0, y: 45 },
    { x: 50, y: 35 },
    { x: 100, y: 42 },
    { x: 150, y: 25 },
    { x: 200, y: 38 },
    { x: 250, y: 30 },
    { x: 300, y: 45 },
    { x: 350, y: 40 },
    { x: 400, y: 50 }
  ];

  // Price history data points for item2 (green line)
  const item2Path = [
    { x: 0, y: 65 },
    { x: 50, y: 72 },
    { x: 100, y: 68 },
    { x: 150, y: 80 },
    { x: 200, y: 70 },
    { x: 250, y: 75 },
    { x: 300, y: 68 },
    { x: 350, y: 72 },
    { x: 400, y: 78 }
  ];

  // Function to get Y position on the line for a given X position
  const getYOnLine = (xPos, pathData) => {
    const x = xPos * 400;
    
    // Find the two points that x falls between
    for (let i = 0; i < pathData.length - 1; i++) {
      if (x >= pathData[i].x && x <= pathData[i + 1].x) {
        const x1 = pathData[i].x;
        const y1 = pathData[i].y;
        const x2 = pathData[i + 1].x;
        const y2 = pathData[i + 1].y;
        
        // Linear interpolation between the two points
        const t = (x - x1) / (x2 - x1);
        return y1 + (y2 - y1) * t;
      }
    }
    return pathData[pathData.length - 1].y;
  };

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
          <button onClick={() => navigate(-1)} className="relative">
            <svg className="w-6 h-6 text-[#1F2937]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-base font-bold text-[#1F2937]">Comparison Results</h1>
          <button onClick={() => setIsSaved(!isSaved)}>
            <Bookmark className={`w-6 h-6 ${isSaved ? 'fill-[#00A36C] text-[#00A36C]' : 'text-[#6B7280]'}`} />
          </button>
        </div>
      </div>

      <div className="px-6 py-6 space-y-4">
        {/* Product Comparison Cards */}
        <div className="flex items-start gap-2 relative">
          {/* Product 1 */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-lg p-4 relative">
              <div className="absolute -top-2.5 right-3 z-10">
                <div className="bg-[#00A36C] text-white text-[8px] font-semibold px-2.5 py-1 rounded shadow-md">
                  LOWEST PRICE
                </div>
              </div>
              <div className="w-full bg-white flex items-center justify-center mb-3" style={{ height: '140px' }}>
                <img src={item1.file_url} alt={item1.title} className="max-w-full max-h-full object-contain" />
              </div>
              <h3 className="font-bold text-[#1F2937] text-xs mb-1 line-clamp-2">{item1.title}</h3>
              <p className="text-base font-bold text-[#1F2937] mb-1">{item1.price}</p>
              <div className="flex items-center gap-1 mb-2">
                <span className="text-xs font-semibold text-[#1F2937]">4.5 <span className="text-yellow-400">★</span></span>
                <span className="text-[10px] text-[#6B7280]">(17.4k Reviews)</span>
              </div>
              <img src="https://logo.clearbit.com/amazon.com" alt="amazon" className="h-4 object-contain" onError={(e) => e.target.style.display = 'none'} />
            </div>
          </div>

          {/* VS Circle - overlapping */}
          <div className="absolute left-1/2 -translate-x-1/2 z-20" style={{ top: '50px' }}>
            <div className="w-9 h-9 rounded-full bg-[#E5E7EB] flex items-center justify-center shadow-sm">
              <span className="text-xs font-bold text-[#6B7280]">VS</span>
            </div>
          </div>

          {/* Product 2 */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-lg p-4 relative">
              <div className="absolute -top-2.5 right-3 z-10">
                <div className="bg-[#3B82F6] text-white text-[8px] font-semibold px-2.5 py-1 rounded shadow-md">
                  POPULAR PICK
                </div>
              </div>
              <div className="w-full bg-white flex items-center justify-center mb-3" style={{ height: '140px' }}>
                <img src={item2.file_url} alt={item2.title} className="max-w-full max-h-full object-contain" />
              </div>
              <h3 className="font-bold text-[#1F2937] text-xs mb-1 line-clamp-2">{item2.title}</h3>
              <p className="text-base font-bold text-[#1F2937] mb-1">{item2.price}</p>
              <div className="flex items-center gap-1 mb-2">
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
            {winner.title} excels with {result.winner === "item1" ? `${item1Scores.price}% price rating, ${item1Scores.durability}% durability score, and ${item1Scores.value || 88}% overall value` : `${item2Scores.brand}% brand reputation, ${item2Scores.features}% feature set, and ${item2Scores.design}% design quality`}. Based on your preferences, this product delivers the best combination of quality, value, and performance for your specific needs.
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
          <h2 className="text-base font-bold text-[#1F2937] mb-3">Price History</h2>
          
          {/* Border line */}
          <div className="border-t border-[#E5E7EB] mb-3" />
          
          {/* Time period selector - iOS style */}
          <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
            {['1W', '1M', '3M', '6M', '1Y'].map((period) => (
              <button
                key={period}
                onClick={() => setTimePeriod(period)}
                className={`flex-shrink-0 px-4 py-1.5 text-xs font-semibold transition-colors ${
                  timePeriod === period
                    ? 'text-[#1F2937]'
                    : 'text-[#6B7280]'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
          
          {/* Graph with gradient - iOS style */}
          <div 
            className="relative h-40 mb-4 pl-10 pr-2 cursor-crosshair"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left - 40;
              const width = rect.width - 48;
              const y = e.clientY - rect.top;
              
              // Determine which line was clicked based on y position
              const item1Y = 45 - ((x / width) * 15);
              const item2Y = 65 + ((x / width) * 8);
              
              if (Math.abs(y - item1Y) < Math.abs(y - item2Y)) {
                setActiveGraph('item1');
                const percent = Math.max(0, Math.min(1, x / width));
                setGraphPosition(percent);
              } else {
                setActiveGraph('item2');
                const percent = Math.max(0, Math.min(1, x / width));
                setGraphPosition(percent);
              }
            }}
            onMouseMove={(e) => {
              if (graphPosition !== null) {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left - 40;
                const width = rect.width - 48;
                const percent = Math.max(0, Math.min(1, x / width));
                setGraphPosition(percent);
              }
            }}
            onMouseLeave={() => {
              if (graphPosition !== null) {
                setGraphPosition(null);
              }
            }}
            onTouchStart={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.touches[0].clientX - rect.left - 40;
              const width = rect.width - 48;
              const y = e.touches[0].clientY - rect.top;
              
              const item1Y = 45 - ((x / width) * 15);
              const item2Y = 65 + ((x / width) * 8);
              
              if (Math.abs(y - item1Y) < Math.abs(y - item2Y)) {
                setActiveGraph('item1');
              } else {
                setActiveGraph('item2');
              }
              const percent = Math.max(0, Math.min(1, x / width));
              setGraphPosition(percent);
            }}
            onTouchMove={(e) => {
              if (graphPosition !== null) {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.touches[0].clientX - rect.left - 40;
                const width = rect.width - 48;
                const percent = Math.max(0, Math.min(1, x / width));
                setGraphPosition(percent);
              }
            }}
            onTouchEnd={() => setGraphPosition(null)}
          >
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
              
              {/* Product 1 area (blue) */}
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
              
              {/* Product 2 area (green) */}
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
              
              {/* Interactive dot - iOS style (only for active graph) */}
              {graphPosition !== null && (
                <>
                  <line 
                    x1={graphPosition * 400} 
                    y1="0" 
                    x2={graphPosition * 400} 
                    y2="120" 
                    stroke={activeGraph === 'item1' ? '#3B82F6' : '#00A36C'}
                    strokeWidth="1.5"
                    opacity="0.3"
                  />
                  {activeGraph === 'item1' && (
                    <circle 
                      cx={graphPosition * 400} 
                      cy={getYOnLine(graphPosition, item1Path)} 
                      r="5" 
                      fill="#3B82F6"
                      stroke="#1F2937"
                      strokeWidth="2"
                    />
                  )}
                  {activeGraph === 'item2' && (
                    <circle 
                      cx={graphPosition * 400} 
                      cy={getYOnLine(graphPosition, item2Path)} 
                      r="5" 
                      fill="#00A36C"
                      stroke="#1F2937"
                      strokeWidth="2"
                    />
                  )}
                </>
              )}
            </svg>
            
            {/* Price tooltip - only for active graph */}
            {graphPosition !== null && (
              <div 
                className="absolute -top-8 bg-white rounded-lg shadow-lg px-3 py-1.5 border border-[#E5E7EB]"
                style={{ left: `${graphPosition * 100}%`, transform: 'translateX(-50%)' }}
              >
                {activeGraph === 'item1' ? (
                  <p className="text-xs font-bold text-[#3B82F6]">${Math.round(350 - graphPosition * 50)}</p>
                ) : (
                  <p className="text-xs font-bold text-[#00A36C]">${Math.round(330 - graphPosition * 40)}</p>
                )}
              </div>
            )}
            
            {/* Y-axis price labels */}
            <div className="absolute -left-1 top-2 text-xs font-semibold text-[#6B7280]">400</div>
            <div className="absolute -left-1 top-1/3 text-xs font-semibold text-[#6B7280]">350</div>
            <div className="absolute -left-1 top-2/3 text-xs font-semibold text-[#6B7280]">300</div>
            <div className="absolute -left-1 bottom-2 text-xs font-semibold text-[#6B7280]">250</div>
            
            {/* X-axis day labels - iOS style based on time period */}
            {(timePeriod === '1W' || timePeriod === '1M') ? (
              <>
                <div className="absolute -bottom-5 left-10 text-xs text-[#6B7280]">5</div>
                <div className="absolute -bottom-5 left-1/3 text-xs text-[#6B7280]">12</div>
                <div className="absolute -bottom-5 left-2/3 text-xs text-[#6B7280]">19</div>
                <div className="absolute -bottom-5 right-8 text-xs text-[#6B7280]">26</div>
              </>
            ) : (
              <>
                <div className="absolute -bottom-5 left-10 text-xs text-[#6B7280]">Jul</div>
                <div className="absolute -bottom-5 left-1/3 text-xs text-[#6B7280]">Sep</div>
                <div className="absolute -bottom-5 left-2/3 text-xs text-[#6B7280]">Nov</div>
                <div className="absolute -bottom-5 right-8 text-xs text-[#6B7280]">Dec</div>
              </>
            )}
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
                  <button 
                    onClick={() => setFavoriteAlts({...favoriteAlts, [idx]: !favoriteAlts[idx]})}
                    className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${favoriteAlts[idx] ? 'fill-[#00A36C] text-[#00A36C]' : 'text-[#9CA3AF]'}`} />
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