import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { User, Scan, DollarSign, Store, Tag, Settings, Award, ShoppingCart, Rocket, Share2, UserPlus, ChevronRight, Heart } from "lucide-react";

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

  // Mock recently viewed items
  const recentlyViewed = [
    { id: 1, price: "$89.99", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200" },
    { id: 2, price: "$199.99", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200" },
    { id: 3, price: "$59.99", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200" },
    { id: 4, price: "$24.99", image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=200" },
  ];

  if (showSettings) {
    return (
      <div className="min-h-screen bg-[#F9FAFB]">
        <div className="px-6 pt-8 pb-4">
          <button 
            onClick={() => setShowSettings(false)}
            className="flex items-center gap-2 mb-4 text-[#1F2937] hover:text-[#00A36C]"
          >
            <span className="font-semibold">← Back</span>
          </button>
          <h1 className="text-2xl font-bold text-[#1F2937] mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Settings
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      {/* Header Section - No "Profile" text */}
      <div className="px-6 pt-8 pb-6 bg-white border-b border-[#E5E7EB]">
        <div className="flex items-center justify-end mb-6">
          <button 
            onClick={() => setShowSettings(true)}
            className="w-10 h-10 rounded-full bg-[#F9FAFB] flex items-center justify-center hover:bg-[#E5E7EB] transition-colors"
          >
            <Settings className="w-5 h-5 text-[#1F2937]" />
          </button>
        </div>

        {/* Profile Picture & Info - Centered */}
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-white border-2 border-[#E5E7EB] flex items-center justify-center shadow-sm mb-2">
            <User className="w-12 h-12 text-[#6B7280]" strokeWidth={2} />
          </div>
          <div className="bg-[#D6F5E9] text-[#00A36C] text-xs font-bold px-3 py-1 rounded-full mb-3">
            Free
          </div>
          <h2 className="text-xl font-bold text-[#1F2937] mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {user?.full_name || 'ElishaH'}
          </h2>
          <p className="text-sm text-[#6B7280]">
            {user?.email || 'user@shopsmart.com'}
          </p>
        </div>
      </div>

      {/* Achievements Section with Arrow */}
      <div className="px-6 py-6 bg-white border-b border-[#E5E7EB]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[#1F2937]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Achievements
          </h3>
          <ChevronRight className="w-5 h-5 text-[#6B7280]" />
        </div>

        <div className="grid grid-cols-4 gap-3">
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div 
                key={badge.id}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-16 h-16 rounded-2xl bg-white border-2 border-[#E5E7EB] flex items-center justify-center shadow-sm">
                  <Icon className="w-8 h-8 text-[#00A36C]" strokeWidth={2} />
                </div>
                <span className="text-xs font-semibold text-[#1F2937] text-center leading-tight">
                  {badge.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Personal Insights Section - Rectangular tiles */}
      <div className="px-6 py-6 bg-white border-b border-[#E5E7EB]">
        <h3 className="text-lg font-bold text-[#1F2937] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Personal Insights
        </h3>
        
        <div className="grid grid-cols-1 gap-3">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div 
                key={idx}
                className="bg-white border border-[#E5E7EB] rounded-2xl p-3 shadow-sm flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-[#D6F5E9] flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-[#00A36C]" />
                </div>
                <div className="flex-1">
                  <p className="text-xl font-bold text-[#1F2937]">
                    {stat.value}
                  </p>
                  <p className="text-xs text-[#6B7280]">
                    {stat.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recently Viewed Section */}
      <div className="px-6 py-6 bg-white border-b border-[#E5E7EB]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[#1F2937]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Recently Viewed
          </h3>
          <ChevronRight className="w-5 h-5 text-[#6B7280]" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          {recentlyViewed.map((item) => (
            <div 
              key={item.id}
              className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-sm relative"
              style={{ aspectRatio: '3/4' }}
            >
              <img 
                src={item.image} 
                alt="Product"
                className="w-full h-full object-cover"
              />
              {/* Price - top left, smaller */}
              <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-md px-1.5 py-0.5">
                <span className="text-[10px] font-bold text-[#1F2937]">{item.price}</span>
              </div>
              {/* Heart - bottom right */}
              <button className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center">
                <Heart className="w-3 h-3 text-[#6B7280]" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Friends Button */}
      <div className="px-6 py-6">
        <Button className="w-full bg-[#00A36C] text-white hover:bg-[#007E52] font-bold rounded-2xl h-14 text-base flex items-center justify-center gap-3">
          <div className="w-6 h-6 border-2 border-white rounded flex items-center justify-center relative">
            <Share2 className="w-3 h-3 text-white" />
          </div>
          Invite Friends
        </Button>
      </div>

      {/* Footer Tagline - More faded */}
      <div className="px-6 pb-8">
        <p className="text-center text-sm text-[#6B7280] opacity-30 leading-relaxed font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Lens of the Future
        </p>
      </div>
    </div>
  );
}