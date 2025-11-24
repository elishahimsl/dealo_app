import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, Link as LinkIcon, Search, TrendingDown, TrendingUp, Bell, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PriceDrop() {
  const navigate = useNavigate();
  const [showAnalysis, setShowAnalysis] = useState(false);

  const mockData = {
    currentPrice: 89.99,
    avgPrice: 94.50,
    peakPrice: 119.99,
    lowestPrice: 79.99,
    trend: "drop",
    confidence: "High",
    bestBuyWindow: "Best price expected in 2-3 weeks",
    priceHistory: [95, 98, 92, 89, 94, 97, 91, 88, 90, 93, 89, 85]
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
              PriceDrop
            </h1>
            <p className="text-white/80 text-sm">Price history & predictions</p>
          </div>
        </div>
      </div>

      <div className="px-6 pt-6">
        {/* Best Buy Window - Always Visible */}
        <div className="bg-gradient-to-r from-[#00A36C] to-[#007E52] rounded-3xl p-5 mb-6 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-white" />
              <h3 className="text-white font-bold text-sm">Best Buy Window</h3>
            </div>
            <div className="px-3 py-1 rounded-full text-xs font-bold bg-white text-[#00A36C] shadow-md">
              {mockData.confidence} Confidence
            </div>
          </div>
          <p className="text-white text-lg font-bold mb-2">{mockData.bestBuyWindow}</p>
          <Button className="w-full bg-white text-[#00A36C] hover:bg-gray-100 font-semibold rounded-xl flex items-center justify-center gap-2">
            <Bell className="w-4 h-4" />
            Notify Me
          </Button>
        </div>

        {!showAnalysis ? (
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setShowAnalysis(true)}
              className="bg-white rounded-2xl p-6 border border-[#E5E7EB] flex flex-col items-center gap-3 shadow-sm hover:shadow-lg transition-all"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center">
                <Camera className="w-7 h-7 text-white" />
              </div>
              <span className="text-xs font-semibold text-[#1F2937]">Scan</span>
            </button>
            <button className="bg-white rounded-2xl p-6 border border-[#E5E7EB] flex flex-col items-center gap-3 shadow-sm hover:shadow-lg transition-all">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center">
                <LinkIcon className="w-7 h-7 text-white" />
              </div>
              <span className="text-xs font-semibold text-[#1F2937]">Link</span>
            </button>
            <button className="bg-white rounded-2xl p-6 border border-[#E5E7EB] flex flex-col items-center gap-3 shadow-sm hover:shadow-lg transition-all">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center">
                <Search className="w-7 h-7 text-white" />
              </div>
              <span className="text-xs font-semibold text-[#1F2937]">Search</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Price History */}
            <div className="bg-white rounded-3xl p-6 border border-[#E5E7EB] shadow-lg">
              <h3 className="font-bold text-[#1F2937] mb-4 text-lg">12-Month Price Trend</h3>
              <div className="relative h-48 mb-6 bg-gradient-to-b from-[#00A36C]/10 to-transparent rounded-2xl p-4">
                <svg viewBox="0 0 300 100" className="w-full h-full">
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#00A36C" />
                      <stop offset="100%" stopColor="#007E52" />
                    </linearGradient>
                  </defs>
                  <polyline
                    points={mockData.priceHistory.map((price, idx) => `${idx * 25},${100 - price}`).join(' ')}
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="3"
                  />
                  {mockData.priceHistory.map((price, idx) => (
                    <circle
                      key={idx}
                      cx={idx * 25}
                      cy={100 - price}
                      r="3"
                      fill="#00A36C"
                    />
                  ))}
                </svg>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-[#10B981]/10 to-transparent rounded-2xl p-3 text-center">
                  <p className="text-xs text-[#6B7280] mb-1">Average</p>
                  <p className="text-lg font-bold text-[#1F2937]">${mockData.avgPrice}</p>
                </div>
                <div className="bg-gradient-to-br from-red-500/10 to-transparent rounded-2xl p-3 text-center">
                  <p className="text-xs text-[#6B7280] mb-1">Peak</p>
                  <p className="text-lg font-bold text-red-500">${mockData.peakPrice}</p>
                </div>
                <div className="bg-gradient-to-br from-[#10B981]/10 to-transparent rounded-2xl p-3 text-center">
                  <p className="text-xs text-[#6B7280] mb-1">Lowest</p>
                  <p className="text-lg font-bold text-[#00A36C]">${mockData.lowestPrice}</p>
                </div>
              </div>
            </div>

            {/* AI Prediction */}
            <div className="bg-white rounded-3xl p-6 border border-[#E5E7EB] shadow-lg">
              <h3 className="font-bold text-[#1F2937] mb-4 text-lg">AI Prediction</h3>
              <div className="bg-gradient-to-br from-[#00A36C] to-[#007E52] rounded-2xl p-4 mb-4">
                <div className="flex items-center gap-3">
                  {mockData.trend === "drop" ? (
                    <TrendingDown className="w-8 h-8 text-white" />
                  ) : (
                    <TrendingUp className="w-8 h-8 text-white" />
                  )}
                  <div>
                    <p className="text-white font-bold text-lg">Likely to {mockData.trend}</p>
                    <p className="text-white/80 text-sm">{mockData.confidence} confidence</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 rounded-xl border-2">No</Button>
                <Button className="flex-1 bg-gradient-to-r from-[#00A36C] to-[#007E52] hover:opacity-90 rounded-xl text-white">
                  Helpful
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}