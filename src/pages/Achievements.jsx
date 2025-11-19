import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingCart, Scan, Award, Rocket, Star, TrendingUp, Heart, Target, Zap, Trophy, Crown, Gift, Sparkles } from "lucide-react";

export default function Achievements() {
  const navigate = useNavigate();

  const allBadges = [
    { id: 1, icon: ShoppingCart, label: "Deal Hunter", description: "Find 10 great deals", earned: true },
    { id: 2, icon: Scan, label: "Product Explorer", description: "Scan 25 products", earned: true },
    { id: 3, icon: Rocket, label: "Early Adopter", description: "Join in the first month", earned: true },
    { id: 4, icon: Award, label: "Shop Master", description: "Make 50 purchases", earned: true },
    { id: 5, icon: Star, label: "5-Star Hunter", description: "Find 5 five-star products", earned: false },
    { id: 6, icon: TrendingUp, label: "Trend Setter", description: "View 50 trending items", earned: false },
    { id: 7, icon: Heart, label: "Favorite Collector", description: "Save 100 favorites", earned: false },
    { id: 8, icon: Target, label: "Perfect Match", description: "Get 10 perfect product matches", earned: false },
    { id: 9, icon: Zap, label: "Speed Shopper", description: "Complete 5 purchases in a day", earned: false },
    { id: 10, icon: Trophy, label: "Champion Saver", description: "Save $500 with deals", earned: false },
    { id: 11, icon: Crown, label: "VIP Member", description: "Upgrade to premium", earned: false },
    { id: 12, icon: Gift, label: "Referral Master", description: "Invite 10 friends", earned: false },
    { id: 13, icon: Sparkles, label: "AI Expert", description: "Use AI features 100 times", earned: false },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      {/* Header */}
      <div className="px-6 pt-8 pb-4 bg-white border-b border-[#E5E7EB]">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(createPageUrl("Profile"))}
          className="rounded-full mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold text-[#1F2937] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Achievements
        </h1>
        <p className="text-sm text-[#6B7280]">
          Unlock badges by using ShopSmart
        </p>
      </div>

      {/* Progress Bar */}
      <div className="px-6 py-6 bg-white border-b border-[#E5E7EB]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-[#1F2937]">Progress</span>
          <span className="text-sm font-bold text-[#00A36C]">4/13</span>
        </div>
        <div className="w-full h-3 bg-[#E5E7EB] rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#00A36C] to-[#007E52] rounded-full"
            style={{ width: '31%' }}
          />
        </div>
      </div>

      {/* Badges Grid */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-3 gap-4">
          {allBadges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div 
                key={badge.id}
                className={`flex flex-col items-center p-4 rounded-2xl border-2 ${
                  badge.earned 
                    ? 'border-[#00A36C] bg-[#D6F5E9]' 
                    : 'border-[#E5E7EB] bg-white opacity-40'
                }`}
              >
                <div 
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 ${
                    badge.earned 
                      ? 'bg-[#00A36C]' 
                      : 'bg-[#E5E7EB]'
                  }`}
                >
                  <Icon 
                    className={`w-8 h-8 ${badge.earned ? 'text-white' : 'text-[#6B7280]'}`} 
                    strokeWidth={2} 
                  />
                </div>
                <h3 className={`font-bold text-xs text-center mb-1 ${
                  badge.earned ? 'text-[#1F2937]' : 'text-[#6B7280]'
                }`}>
                  {badge.label}
                </h3>
                <p className="text-[9px] text-[#6B7280] text-center leading-tight">
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