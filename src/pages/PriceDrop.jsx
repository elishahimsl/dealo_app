import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, Link as LinkIcon, Search, TrendingDown, TrendingUp } from "lucide-react";
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
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      <div className="px-6 pt-8 pb-4">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6 text-[#1F2937]" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#1F2937]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              PriceDrop
            </h1>
            <p className="text-sm text-[#6B7280]">See past prices and predicted trends — instantly</p>
          </div>
        </div>

        {!showAnalysis ? (
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setShowAnalysis(true)}
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
              <h3 className="font-bold text-[#1F2937] mb-4">Price History (Last 12 Months)</h3>
              <div className="relative h-40 mb-4">
                <svg viewBox="0 0 300 100" className="w-full h-full">
                  <polyline
                    points={mockData.priceHistory.map((price, idx) => `${idx * 25},${100 - price}`).join(' ')}
                    fill="none"
                    stroke="#00A36C"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xs text-[#6B7280]">Average</p>
                  <p className="text-sm font-bold text-[#1F2937]">${mockData.avgPrice}</p>
                </div>
                <div>
                  <p className="text-xs text-[#6B7280]">Peak</p>
                  <p className="text-sm font-bold text-red-500">${mockData.peakPrice}</p>
                </div>
                <div>
                  <p className="text-xs text-[#6B7280]">Lowest</p>
                  <p className="text-sm font-bold text-[#00A36C]">${mockData.lowestPrice}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB]">
              <h3 className="font-bold text-[#1F2937] mb-4">AI Prediction</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6B7280]">Trend Direction</span>
                  <div className="flex items-center gap-2">
                    {mockData.trend === "drop" ? (
                      <TrendingDown className="w-5 h-5 text-[#00A36C]" />
                    ) : (
                      <TrendingUp className="w-5 h-5 text-red-500" />
                    )}
                    <span className="text-sm font-bold text-[#1F2937]">Likely to {mockData.trend}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6B7280]">Best Buy Window</span>
                  <span className="text-sm font-bold text-[#00A36C]">{mockData.bestBuyWindow}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6B7280]">Confidence</span>
                  <span className="text-sm font-bold text-[#1F2937]">{mockData.confidence}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-xl">No</Button>
              <Button className="flex-1 bg-[#00A36C] hover:bg-[#007E52] rounded-xl">Yes, Helpful</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}