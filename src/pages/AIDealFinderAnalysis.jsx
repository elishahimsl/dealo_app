import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ChevronLeft, MoreVertical, ChevronDown, ChevronUp, Camera, Info } from "lucide-react";

export default function AIDealFinderAnalysis() {
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state?.product || {
    name: "Sony WH-1000XM5",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400",
    price: "$278",
    store: "Amazon",
    storeLogo: "https://logo.clearbit.com/amazon.com",
    availability: "In Stock"
  };

  const [expandedScore, setExpandedScore] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  const dealScore = 82;
  const dealVerdict = dealScore >= 80 ? "Great Deal" : dealScore >= 60 ? "Fair Price" : "Not a Deal";
  const buyTiming = "Good time to buy";
  const microExplanation = "This price is 18% below the market average and near recent lows.";

  const subscores = [
    { 
      label: "Price Value", 
      score: 88, 
      explanation: "Current price is significantly below typical market pricing for this product category."
    },
    { 
      label: "Discount Strength", 
      score: 82, 
      explanation: "The discount represents substantial savings compared to the original retail price."
    },
    { 
      label: "Market Position", 
      score: 79, 
      explanation: "This is among the better prices currently available across major retailers."
    },
    { 
      label: "Price Stability", 
      score: 76, 
      explanation: "Price has remained relatively stable at this level, suggesting it's likely to hold."
    }
  ];

  const alternatives = [
    { name: "Bose QuietComfort", price: "$249", tag: "Better value", image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=200" },
    { name: "Sony WH-1000XM4", price: "$228", tag: "Cheaper option", image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200" },
    { name: "Sennheiser Momentum", price: "$349", tag: "Higher quality", image: "https://images.unsplash.com/photo-1545127398-14699f92334b?w=200" }
  ];

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Top Navigation */}
      <div className="sticky top-0 z-20 bg-white border-b border-[#E5E7EB] px-6 py-4">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)}>
            <ChevronLeft className="w-6 h-6 text-[#1F2937]" />
          </button>
          <h1 className="text-base font-semibold text-[#1F2937]">AI Deal Finder</h1>
          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)}>
              <MoreVertical className="w-6 h-6 text-[#1F2937]" />
            </button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-8 bg-white rounded-xl shadow-lg py-2 z-40 w-48 border border-[#E5E7EB]">
                  <button className="w-full px-4 py-2 text-left text-sm text-[#1F2937] hover:bg-[#F9FAFB]">
                    Save Product
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-[#1F2937] hover:bg-[#F9FAFB]">
                    Share
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-[#1F2937] hover:bg-[#F9FAFB]">
                    Fix Product
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-[#1F2937] hover:bg-[#F9FAFB]">
                    How this works
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Product Header Card */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm">
          <div className="flex gap-4 mb-4">
            <div className="w-24 h-24 rounded-xl bg-[#F9FAFB] flex items-center justify-center flex-shrink-0">
              <img src={product.image} alt={product.name} className="w-full h-full object-contain p-2" />
            </div>
            <div className="flex-1">
              <h2 className="text-base font-bold text-[#1F2937] mb-2 line-clamp-2">
                {product.name}
              </h2>
              <div className="flex items-center gap-2 mb-2">
                <img 
                  src={product.storeLogo} 
                  alt={product.store} 
                  className="h-4 object-contain"
                  onError={(e) => e.target.style.display = 'none'}
                />
                <span className="text-xs text-[#6B7280]">{product.store}</span>
              </div>
              <p className="text-2xl font-bold text-[#1F2937]">{product.price}</p>
            </div>
          </div>
          <span className="inline-block px-3 py-1 bg-[#D1FAE5] text-[#065F46] text-xs font-semibold rounded-full">
            {product.availability}
          </span>
        </div>

        {/* Deal Verdict Card */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-md">
          <div className="text-center mb-4">
            <div className="flex items-baseline justify-center mb-2">
              <span className="text-5xl font-bold text-[#1F2937]">{dealScore}</span>
              <span className="text-xl text-[#6B7280] ml-1">/100</span>
            </div>
            <p className="text-lg font-bold text-[#00A36C] mb-3">{dealVerdict}</p>
            <div className="inline-block px-4 py-2 bg-[#D1FAE5] rounded-full mb-3">
              <p className="text-sm font-semibold text-[#065F46]">{buyTiming}</p>
            </div>
            <p className="text-sm text-[#6B7280] leading-relaxed">
              {microExplanation}
            </p>
          </div>
        </div>

        {/* Deal Score Breakdown */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm">
          <h3 className="text-base font-bold text-[#1F2937] mb-4">Deal Score Breakdown</h3>
          <div className="space-y-4">
            {subscores.map((item, idx) => (
              <div key={idx}>
                <button
                  onClick={() => setExpandedScore(expandedScore === idx ? null : idx)}
                  className="w-full"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[#1F2937]">{item.label}</span>
                      <Info className="w-4 h-4 text-[#9CA3AF]" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#1F2937]">{item.score}</span>
                      {expandedScore === idx ? (
                        <ChevronUp className="w-4 h-4 text-[#6B7280]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#6B7280]" />
                      )}
                    </div>
                  </div>
                  <div className="h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#00A36C] rounded-full transition-all"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </button>
                {expandedScore === idx && (
                  <div className="mt-3 pt-3 border-t border-[#E5E7EB]">
                    <p className="text-xs text-[#6B7280] leading-relaxed">
                      {item.explanation}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Market Price Context */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm">
          <h3 className="text-base font-bold text-[#1F2937] mb-4">Market Price Context</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#6B7280]">Market Average</span>
              <span className="text-base font-bold text-[#1F2937]">$339</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#6B7280]">Current Best Price</span>
              <span className="text-base font-bold text-[#00A36C]">{product.price}</span>
            </div>
            <div className="pt-3 border-t border-[#E5E7EB]">
              <div className="inline-block px-3 py-1.5 bg-[#D1FAE5] rounded-lg">
                <span className="text-sm font-semibold text-[#065F46]">$61 below market average</span>
              </div>
            </div>
            <p className="text-xs text-[#6B7280] pt-2">
              Based on pricing from 18 major retailers
            </p>
          </div>
        </div>

        {/* AI Deal Summary */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm">
          <h3 className="text-base font-bold text-[#1F2937] mb-3">AI Deal Summary</h3>
          <p className="text-sm text-[#6B7280] leading-relaxed">
            This listing is currently one of the strongest values available. While prices may fluctuate slightly, 
            similar listings have remained higher over the past few weeks, making this a favorable purchase window. 
            The product consistently receives positive reviews for sound quality and noise cancellation.
          </p>
        </div>

        {/* Key Product Highlights */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-sm">
          <h3 className="text-base font-bold text-[#1F2937] mb-4">Key Product Highlights</h3>
          
          <div className="mb-4">
            <p className="text-xs font-semibold text-[#6B7280] mb-2">Key Features</p>
            <ul className="space-y-2">
              <li className="text-sm text-[#1F2937] flex items-start gap-2">
                <span className="text-[#00A36C] mt-0.5">•</span>
                <span>Industry-leading noise cancellation technology</span>
              </li>
              <li className="text-sm text-[#1F2937] flex items-start gap-2">
                <span className="text-[#00A36C] mt-0.5">•</span>
                <span>Up to 30 hours battery life with ANC</span>
              </li>
              <li className="text-sm text-[#1F2937] flex items-start gap-2">
                <span className="text-[#00A36C] mt-0.5">•</span>
                <span>Premium sound quality with LDAC support</span>
              </li>
            </ul>
          </div>

          <div className="mb-4">
            <p className="text-xs font-semibold text-[#6B7280] mb-2">Pros</p>
            <ul className="space-y-2">
              <li className="text-sm text-[#1F2937] flex items-start gap-2">
                <span className="text-[#00A36C] mt-0.5">•</span>
                <span>Exceptional noise cancellation</span>
              </li>
              <li className="text-sm text-[#1F2937] flex items-start gap-2">
                <span className="text-[#00A36C] mt-0.5">•</span>
                <span>Comfortable for long listening sessions</span>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold text-[#6B7280] mb-2">Cons</p>
            <ul className="space-y-2">
              <li className="text-sm text-[#1F2937] flex items-start gap-2">
                <span className="text-[#6B7280] mt-0.5">•</span>
                <span>Premium price point</span>
              </li>
              <li className="text-sm text-[#1F2937] flex items-start gap-2">
                <span className="text-[#6B7280] mt-0.5">•</span>
                <span>Slightly bulky for travel</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Alternative Picks */}
        <div>
          <h3 className="text-base font-bold text-[#1F2937] mb-4">Alternative Picks</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {alternatives.map((alt, idx) => (
              <div key={idx} className="flex-shrink-0" style={{ width: '140px' }}>
                <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-sm">
                  <div className="w-full h-32 bg-[#F9FAFB] flex items-center justify-center p-3">
                    <img src={alt.image} alt={alt.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-bold text-[#1F2937] mb-1">{alt.price}</p>
                    <p className="text-xs font-semibold text-[#1F2937] mb-2 line-clamp-2">{alt.name}</p>
                    <span className="inline-block px-2 py-1 bg-[#F3F4F6] text-[#6B7280] text-xs rounded-full">
                      {alt.tag}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <button className="flex-shrink-0 w-32 h-full flex items-center justify-center text-sm font-semibold text-[#00A36C]">
              View more →
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] px-6 py-4 z-30">
        <div className="flex gap-3 max-w-lg mx-auto">
          <button 
            onClick={() => navigate(createPageUrl("Snap"))}
            className="flex-1 py-3 bg-[#00A36C] text-white rounded-full font-semibold text-sm"
          >
            Scan Again
          </button>
          <button 
            className="flex-1 py-3 bg-white border-2 border-[#E5E7EB] text-[#1F2937] rounded-full font-semibold text-sm flex items-center justify-center gap-2"
          >
            <Camera className="w-4 h-4" />
            Fix Product
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