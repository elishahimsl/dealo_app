import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, Link as LinkIcon, Search, Star, ThumbsUp, ThumbsDown, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SmartReview() {
  const navigate = useNavigate();
  const [showReview, setShowReview] = useState(false);

  const mockReview = {
    score: 8.5,
    sentiment: "Positive",
    sentimentDescription: "Most users are satisfied",
    topPros: ["Excellent battery life (mentioned 234 times)", "Comfortable fit (mentioned 189 times)", "Great sound quality (mentioned 156 times)"],
    topCons: ["Band durability issues (mentioned 98 times)", "Limited color options (mentioned 67 times)", "Expensive (mentioned 54 times)"],
    summary: "Users say the battery life is strong and sound quality exceeds expectations, but the band durability is a common concern among long-term users.",
    features: {
      quality: 85,
      durability: 70,
      value: 75,
      easeOfUse: 90,
      comfort: 88
    },
    similarProducts: [
      { name: "Alternative A", score: 9.2, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200" },
      { name: "Alternative B", score: 8.8, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200" },
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] to-[#E5E7EB] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#00A36C] to-[#007E52] px-6 pt-8 pb-6 shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
              SmartReview
            </h1>
            <p className="text-white/80 text-sm">AI-powered review analysis</p>
          </div>
        </div>
      </div>

      <div className="px-6 pt-6">
        {!showReview ? (
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setShowReview(true)}
              className="bg-white rounded-2xl p-6 border border-[#E5E7EB] flex flex-col items-center gap-3 shadow-sm hover:shadow-lg transition-all"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center">
                <Camera className="w-7 h-7 text-white" />
              </div>
              <span className="text-xs font-semibold text-[#1F2937]">Scan</span>
            </button>
            <button className="bg-white rounded-2xl p-6 border border-[#E5E7EB] flex flex-col items-center gap-3 shadow-sm hover:shadow-lg transition-all">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center">
                <LinkIcon className="w-7 h-7 text-white" />
              </div>
              <span className="text-xs font-semibold text-[#1F2937]">Link</span>
            </button>
            <button className="bg-white rounded-2xl p-6 border border-[#E5E7EB] flex flex-col items-center gap-3 shadow-sm hover:shadow-lg transition-all">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center">
                <Search className="w-7 h-7 text-white" />
              </div>
              <span className="text-xs font-semibold text-[#1F2937]">Search</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Score & Sentiment Card */}
            <div className="bg-white rounded-3xl p-6 border border-[#E5E7EB] shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-20 h-20 rounded-full border-4 border-[#00A36C] flex items-center justify-center">
                      <span className="text-3xl font-bold text-[#1F2937]">{mockReview.score}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                          {mockReview.sentiment}
                        </div>
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="text-xs text-[#6B7280]">{mockReview.sentimentDescription}</p>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-sm text-[#6B7280] leading-relaxed mb-4">{mockReview.summary}</p>

              {/* Top Pros & Cons */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <ThumbsUp className="w-5 h-5 text-green-600" />
                    <h4 className="font-bold text-sm text-green-800">Top Pros</h4>
                  </div>
                  <ul className="space-y-2">
                    {mockReview.topPros.map((pro, idx) => (
                      <li key={idx} className="text-xs text-green-700 leading-relaxed">
                        <span className="font-bold">{idx + 1}.</span> {pro}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-red-50 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <ThumbsDown className="w-5 h-5 text-red-600" />
                    <h4 className="font-bold text-sm text-red-800">Top Cons</h4>
                  </div>
                  <ul className="space-y-2">
                    {mockReview.topCons.map((con, idx) => (
                      <li key={idx} className="text-xs text-red-700 leading-relaxed">
                        <span className="font-bold">{idx + 1}.</span> {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Feature Breakdown */}
            <div className="bg-white rounded-3xl p-6 border border-[#E5E7EB] shadow-lg">
              <h3 className="font-bold text-[#1F2937] mb-4 text-lg">Feature Breakdown</h3>
              {Object.entries(mockReview.features).map(([key, value]) => (
                <div key={key} className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-[#1F2937] capitalize font-semibold">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="text-sm font-bold text-[#00A36C]">{value}%</span>
                  </div>
                  <div className="w-full bg-[#E5E7EB] rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-[#00A36C] to-[#007E52] h-3 rounded-full transition-all" 
                      style={{ width: `${value}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Similar Products */}
            <div className="bg-white rounded-3xl p-6 border border-[#E5E7EB] shadow-lg">
              <h3 className="font-bold text-[#1F2937] mb-4 text-lg">Better Alternatives</h3>
              <div className="grid grid-cols-2 gap-4">
                {mockReview.similarProducts.map((product, idx) => (
                  <div key={idx} className="border-2 border-[#00A36C] rounded-2xl overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-28 object-cover" />
                    <div className="p-3 bg-gradient-to-br from-[#00A36C] to-[#007E52]">
                      <p className="text-xs font-semibold text-white mb-1">{product.name}</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-white fill-white" />
                        <span className="text-sm font-bold text-white">{product.score}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}