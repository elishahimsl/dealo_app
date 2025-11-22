import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, Link as LinkIcon, Search, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SmartReview() {
  const navigate = useNavigate();
  const [showReview, setShowReview] = useState(false);

  const mockReview = {
    score: 8.5,
    sentiment: "Positive",
    sentimentDescription: "Most users are satisfied",
    topPros: ["Excellent battery life", "Comfortable fit", "Great sound quality"],
    topCons: ["Band durability issues", "Limited color options", "Expensive"],
    pros: ["Excellent battery life", "Comfortable fit", "Great sound quality"],
    cons: ["Band durability issues", "Limited color options", "Expensive"],
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
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      <div className="px-6 pt-8 pb-4">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6 text-[#1F2937]" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#1F2937]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              SmartReview
            </h1>
            <p className="text-sm text-[#6B7280]">Clear, unbiased summaries from thousands of reviews</p>
          </div>
        </div>

        {!showReview ? (
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setShowReview(true)}
              className="bg-white rounded-xl p-4 border border-[#E5E7EB] flex flex-col items-center gap-2"
            >
              <Camera className="w-8 h-8 text-[#00A36C]" />
              <span className="text-xs font-semibold text-[#1F2937]">Scan Product</span>
            </button>
            <button className="bg-white rounded-xl p-4 border border-[#E5E7EB] flex flex-col items-center gap-2">
              <LinkIcon className="w-8 h-8 text-[#00A36C]" />
              <span className="text-xs font-semibold text-[#1F2937]">Paste Link</span>
            </button>
            <button className="bg-white rounded-xl p-4 border border-[#E5E7EB] flex flex-col items-center gap-2">
              <Search className="w-8 h-8 text-[#00A36C]" />
              <span className="text-xs font-semibold text-[#1F2937]">Search</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB]">
              <div className="flex items-center justify-center mb-4">
                <div className="w-24 h-24 rounded-full border-4 border-[#00A36C] flex items-center justify-center">
                  <span className="text-3xl font-bold text-[#1F2937]">{mockReview.score}</span>
                </div>
              </div>

              {/* Sentiment Analysis */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  mockReview.sentiment === "Positive" 
                    ? "bg-green-100 text-green-800" 
                    : mockReview.sentiment === "Neutral" 
                    ? "bg-yellow-100 text-yellow-800" 
                    : "bg-red-100 text-red-800"
                }`}>
                  Overall Sentiment: {mockReview.sentiment}
                </div>
              </div>
              <p className="text-xs text-center text-[#6B7280] mb-1">{mockReview.sentimentDescription}</p>

              <p className="text-sm text-center text-[#6B7280] mb-4">{mockReview.summary}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-semibold text-sm text-[#1F2937] mb-2">Top 3 Most Mentioned Pros</h4>
                  <ul className="space-y-1">
                    {mockReview.topPros.map((pro, idx) => (
                      <li key={idx} className="text-xs text-[#00A36C] flex items-start gap-1">
                        <span className="font-bold">{idx + 1}.</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-[#1F2937] mb-2">Top 3 Most Mentioned Cons</h4>
                  <ul className="space-y-1">
                    {mockReview.topCons.map((con, idx) => (
                      <li key={idx} className="text-xs text-red-500 flex items-start gap-1">
                        <span className="font-bold">{idx + 1}.</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB]">
              <h3 className="font-bold text-[#1F2937] mb-4">Feature Breakdown</h3>
              {Object.entries(mockReview.features).map(([key, value]) => (
                <div key={key} className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-[#6B7280] capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="text-xs font-bold text-[#00A36C]">{value}%</span>
                  </div>
                  <div className="w-full bg-[#E5E7EB] rounded-full h-2">
                    <div className="bg-[#00A36C] h-2 rounded-full" style={{ width: `${value}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB]">
              <h3 className="font-bold text-[#1F2937] mb-3">Similar & Better Reviewed</h3>
              <div className="grid grid-cols-2 gap-3">
                {mockReview.similarProducts.map((product, idx) => (
                  <div key={idx} className="border border-[#E5E7EB] rounded-xl overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-24 object-cover" />
                    <div className="p-2">
                      <p className="text-xs font-semibold text-[#1F2937] mb-1">{product.name}</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-[#00A36C] fill-[#00A36C]" />
                        <span className="text-xs font-bold text-[#00A36C]">{product.score}</span>
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