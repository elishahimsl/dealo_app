import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { User, Scan, DollarSign, Store, Tag, Settings, Award, Trophy, Rocket, Target, Zap, ShoppingCart, Clock, Heart, FolderOpen, MapPin, Share2 } from "lucide-react";

export default function Profile() {
  const [showSettings, setShowSettings] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        return await base44.auth.me();
      } catch {
        return null;
      }
    }
  });

  const { data: captures } = useQuery({
    queryKey: ['allCaptures'],
    queryFn: () => base44.entities.Capture.list(),
    initialData: [],
  });

  const totalScans = captures.length;
  const moneySaved = 213;
  const storesVisited = 9;
  const topCategory = "Tech";

  const badges = [
    { id: 1, icon: ShoppingCart, label: "Deal Hunter", color: "from-[#5EE177] to-[#5EA7FF]", earned: true },
    { id: 2, icon: Scan, label: "Product Explorer", color: "from-[#FF8AC6] to-[#FFD93D]", earned: true },
    { id: 3, icon: Rocket, label: "Early Adopter", color: "from-[#5EA7FF] to-[#FF8AC6]", earned: true },
    { id: 4, icon: Share2, label: "Referral Champ", color: "from-[#FFD93D] to-[#5EE177]", earned: false },
    { id: 5, icon: Zap, label: "AI Prodigy", color: "from-[#5EE177] to-[#FF8AC6]", earned: false },
  ];

  const stats = [
    { icon: Scan, value: totalScans, label: "Items Scanned", color: "from-[#5EE177] to-[#5EA7FF]" },
    { icon: DollarSign, value: `$${moneySaved}`, label: "Saved from Deals", color: "from-[#FFD93D] to-[#FF8AC6]" },
    { icon: Store, value: storesVisited, label: "Stores Visited", color: "from-[#5EA7FF] to-[#5EE177]" },
    { icon: Tag, value: topCategory, label: "Top Category", color: "from-[#FF8AC6] to-[#FFD93D]" },
  ];

  const quickActions = [
    { icon: ShoppingCart, label: "My Cart" },
    { icon: Clock, label: "Shop History" },
    { icon: Heart, label: "Favorites" },
    { icon: FolderOpen, label: "My Folders" },
    { icon: MapPin, label: "Deals Near Me" },
  ];

  if (showSettings) {
    return (
      <div className="min-h-screen bg-[#F9FAFB]">
        {/* Settings View - Keep existing */}
        <div className="px-6 pt-8 pb-4">
          <button 
            onClick={() => setShowSettings(false)}
            className="flex items-center gap-2 mb-4 text-[#60656F] hover:text-[#2E2E38]"
          >
            <span className="font-semibold">← Back</span>
          </button>
          <h1 className="text-2xl font-bold text-[#2E2E38] mb-1 border-b-2 border-[#5EE177] inline-block" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Settings
          </h1>
        </div>
        {/* Settings content here */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      {/* 1. Header Section */}
      <div className="px-6 pt-8 pb-6 bg-white border-b border-[#E4E8ED]">
        <div className="flex items-center justify-between">
          {/* Profile Picture & Info */}
          <div className="flex items-center gap-4">
            <button className="w-20 h-20 rounded-full bg-gradient-to-br from-[#5EE177] to-[#5EA7FF] flex items-center justify-center shadow-lg">
              <User className="w-10 h-10 text-white" strokeWidth={2.5} />
            </button>
            <div>
              <h2 className="text-xl font-bold text-[#2E2E38]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {user?.full_name || 'ElishaH'}
              </h2>
              <p className="text-sm text-[#60656F]">
                Lens of the Future
              </p>
            </div>
          </div>

          {/* Settings Icon */}
          <button 
            onClick={() => setShowSettings(true)}
            className="w-12 h-12 rounded-full bg-[#F9FAFB] flex items-center justify-center hover:bg-[#E4E8ED] transition-colors"
          >
            <Settings className="w-6 h-6 text-[#60656F]" />
          </button>
        </div>
      </div>

      {/* 2. Achievements & Badges Section */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[#2E2E38]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Your Achievements
          </h3>
          <button className="text-sm font-semibold text-[#5EE177]">
            View All
          </button>
        </div>

        {/* Horizontal Scrollable Badges */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6">
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div 
                key={badge.id}
                className={`flex-shrink-0 w-24 h-24 rounded-3xl flex flex-col items-center justify-center gap-2 ${
                  badge.earned 
                    ? `bg-gradient-to-br ${badge.color} shadow-lg` 
                    : 'bg-[#E4E8ED] opacity-50'
                }`}
              >
                <Icon className={`w-8 h-8 ${badge.earned ? 'text-white' : 'text-[#60656F]'}`} strokeWidth={2} />
                <span className={`text-xs font-bold text-center px-1 ${badge.earned ? 'text-white' : 'text-[#60656F]'}`}>
                  {badge.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Personal Insights Section (2x2 Grid) */}
      <div className="px-6 pb-6">
        <h3 className="text-lg font-bold text-[#2E2E38] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Personal Insights
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div 
                key={idx}
                className="bg-white rounded-3xl p-5 border border-[#E4E8ED] shadow-sm"
              >
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-2xl font-bold text-[#2E2E38] mb-1">
                  {stat.value}
                </p>
                <p className="text-xs text-[#60656F]">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Quick Actions */}
      <div className="px-6 pb-6">
        <h3 className="text-lg font-bold text-[#2E2E38] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Quick Actions
        </h3>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <button 
                key={idx}
                className="flex-shrink-0 flex flex-col items-center gap-2"
              >
                <div className="w-16 h-16 rounded-2xl bg-white border border-[#E4E8ED] flex items-center justify-center shadow-sm hover:shadow-md transition-all">
                  <Icon className="w-7 h-7 text-[#60656F]" />
                </div>
                <span className="text-xs font-semibold text-[#2E2E38] text-center w-20">
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Invite Friends Card */}
      <div className="px-6 pb-6">
        <div className="bg-gradient-to-r from-[#FFD3E8] via-[#A8F3C1] to-[#5EA7FF] rounded-3xl p-6 shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Share2 className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-white text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Invite Friends & Earn Rewards
              </h4>
              <p className="text-white/90 text-sm">
                Share SnapSmart and get exclusive perks
              </p>
            </div>
          </div>
          <Button className="w-full bg-white text-[#5EE177] hover:bg-white/90 font-bold rounded-2xl h-12">
            Invite Now
          </Button>
        </div>
      </div>

      {/* 6. Footer Tagline */}
      <div className="px-6 pb-8">
        <p className="text-center text-xs text-[#60656F] leading-relaxed">
          Lens of the Future. Helping you discover, decide, and save.
        </p>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}