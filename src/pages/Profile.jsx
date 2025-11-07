import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { User, Scan, DollarSign, Store, Tag, Settings, Award, ShoppingCart, Rocket, Share2 } from "lucide-react";

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
    { id: 1, icon: ShoppingCart, label: "Deal Hunter" },
    { id: 2, icon: Scan, label: "Product Explorer" },
    { id: 3, icon: Rocket, label: "Early Adopter" },
    { id: 4, icon: Award, label: "Shop Master" },
  ];

  const stats = [
    { icon: Scan, value: totalScans, label: "Items Scanned" },
    { icon: DollarSign, value: `$${moneySaved}`, label: "Saved from Deals" },
    { icon: Store, value: storesVisited, label: "Stores Visited" },
    { icon: Tag, value: topCategory, label: "Top Category" },
  ];

  if (showSettings) {
    return (
      <div className="min-h-screen bg-white">
        <div className="px-6 pt-8 pb-4">
          <button 
            onClick={() => setShowSettings(false)}
            className="flex items-center gap-2 mb-4 text-[#2E2E38] hover:text-[#5EE177]"
          >
            <span className="font-semibold">← Back</span>
          </button>
          <h1 className="text-2xl font-bold text-[#2E2E38] mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Settings
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header Section */}
      <div className="px-6 pt-8 pb-6 border-b border-[#E4E8ED]">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#2E2E38]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Profile
          </h1>
          <button 
            onClick={() => setShowSettings(true)}
            className="w-10 h-10 rounded-full bg-[#F9FAFB] flex items-center justify-center hover:bg-[#E4E8ED] transition-colors"
          >
            <Settings className="w-5 h-5 text-[#2E2E38]" />
          </button>
        </div>

        {/* Profile Picture & Info - Centered */}
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-[#5EE177] flex items-center justify-center shadow-lg mb-4">
            <User className="w-12 h-12 text-white" strokeWidth={2.5} />
          </div>
          <h2 className="text-xl font-bold text-[#2E2E38] mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {user?.full_name || 'ElishaH'}
          </h2>
          <p className="text-sm text-[#60656F]">
            {user?.email || 'user@shopsmart.com'}
          </p>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="px-6 py-6 bg-[#F9FAFB]">
        <h3 className="text-lg font-bold text-[#2E2E38] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Achievements
        </h3>

        <div className="grid grid-cols-4 gap-3">
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div 
                key={badge.id}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#5EE177] flex items-center justify-center shadow-md">
                  <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                </div>
                <span className="text-xs font-semibold text-[#2E2E38] text-center leading-tight">
                  {badge.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Personal Insights Section */}
      <div className="px-6 py-6">
        <h3 className="text-lg font-bold text-[#2E2E38] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Personal Insights
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div 
                key={idx}
                className="bg-white border-2 border-[#5EE177] rounded-3xl p-5 shadow-sm"
              >
                <div className="w-10 h-10 rounded-full bg-[#5EE177] flex items-center justify-center mb-3">
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

      {/* Invite Friends Card */}
      <div className="px-6 pb-6">
        <div className="bg-[#5EE177] rounded-3xl p-6 shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Share2 className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-white text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Invite Friends
              </h4>
              <p className="text-white/90 text-sm">
                Share ShopSmart with friends
              </p>
            </div>
          </div>
          <Button className="w-full bg-white text-[#5EE177] hover:bg-white/90 font-bold rounded-2xl h-12">
            Invite Now
          </Button>
        </div>
      </div>

      {/* Footer Tagline */}
      <div className="px-6 pb-8">
        <p className="text-center text-sm text-[#60656F] leading-relaxed font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Lens of the Future
        </p>
      </div>
    </div>
  );
}