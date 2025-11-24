import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, ShoppingCart, Scan, Rocket, Award, Heart, Target, TrendingUp, Zap } from "lucide-react";

export default function Achievements() {
  const navigate = useNavigate();

  const allBadges = [
    { id: 1, icon: ShoppingCart, label: "Deal Hunter", description: "Save $500 with deals", earned: true, color: "#00A36C" },
    { id: 2, icon: Scan, label: "Product Explorer", description: "Scan 50 products", earned: true, color: "#00A36C" },
    { id: 3, icon: Rocket, label: "Early Adopter", description: "Join ShopSmart", earned: true, color: "#00A36C" },
    { id: 4, icon: Award, label: "Shop Master", description: "Complete 100 scans", earned: true, color: "#00A36C" },
    { id: 5, icon: Heart, label: "Favorite Collector", description: "Save 25 favorites", earned: false, color: "#00A36C" },
    { id: 6, icon: Target, label: "Smart Shopper", description: "Compare 20 products", earned: false, color: "#00A36C" },
    { id: 7, icon: TrendingUp, label: "Price Tracker", description: "Track 10 prices", earned: false, color: "#00A36C" },
    { id: 8, icon: Zap, label: "Quick Scanner", description: "Scan 5 items in a day", earned: false, color: "#00A36C" },
    { id: 9, icon: ShoppingCart, label: "Big Spender", description: "Save $1000 total", earned: false, color: "#00A36C" },
    { id: 10, icon: Award, label: "Review Master", description: "Read 50 AI reviews", earned: false, color: "#00A36C" },
    { id: 11, icon: Heart, label: "Collection King", description: "Create 5 collections", earned: false, color: "#00A36C" },
    { id: 12, icon: Target, label: "Deal Finder Pro", description: "Find 30 deals", earned: false, color: "#00A36C" },
    { id: 13, icon: Rocket, label: "Legend", description: "Complete all achievements", earned: false, color: "#00A36C" }
  ];

  const earnedCount = allBadges.filter(b => b.earned).length;
  const progressPercent = (earnedCount / allBadges.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] to-[#E5E7EB] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#00A36C] to-[#007E52] px-6 pt-8 pb-8 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(createPageUrl("Profile"))} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Achievements
            </h1>
            <p className="text-white/80 text-sm">Your shopping journey</p>
          </div>
        </div>

        {/* Progress Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-white/80 text-sm mb-1">Your Progress</p>
              <p className="text-white text-2xl font-bold">{earnedCount}/{allBadges.length}</p>
            </div>
            <div className="w-20 h-20 rounded-full border-4 border-white/30 flex items-center justify-center">
              <span className="text-white text-xl font-bold">{Math.round(progressPercent)}%</span>
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-white h-3 rounded-full transition-all duration-500 shadow-lg" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="px-6 pt-6">
        {/* Earned Badges */}
        <h2 className="text-lg font-bold text-[#1F2937] mb-4">Unlocked ({earnedCount})</h2>
        <div className="grid grid-cols-3 gap-4 mb-8">
          {allBadges.filter(b => b.earned).map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.id}
                className="bg-white rounded-2xl p-4 border-2 border-[#E5E7EB] shadow-lg flex flex-col items-center"
              >
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-3 shadow-lg"
                  style={{ 
                    background: `linear-gradient(135deg, ${badge.color}, ${badge.color}dd)` 
                  }}
                >
                  <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                </div>
                <h3 className="font-bold text-xs text-[#1F2937] text-center mb-1 leading-tight">
                  {badge.label}
                </h3>
                <p className="text-[9px] text-[#6B7280] text-center leading-tight">
                  {badge.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Locked Badges */}
        <h2 className="text-lg font-bold text-[#1F2937] mb-4">Locked ({allBadges.length - earnedCount})</h2>
        <div className="grid grid-cols-3 gap-4">
          {allBadges.filter(b => !b.earned).map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.id}
                className="bg-white rounded-2xl p-4 border-2 border-dashed border-[#E5E7EB] opacity-60 flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-full bg-[#E5E7EB] flex items-center justify-center mb-3">
                  <Icon className="w-8 h-8 text-[#9CA3AF]" strokeWidth={2} />
                </div>
                <h3 className="font-bold text-xs text-[#6B7280] text-center mb-1 leading-tight">
                  {badge.label}
                </h3>
                <p className="text-[9px] text-[#9CA3AF] text-center leading-tight">
                  {badge.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}