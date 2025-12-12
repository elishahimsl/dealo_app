import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  User, Settings, ChevronRight, Bookmark, Star, Tag, 
  Bell, BellRing, Clock, Camera, LogOut, HelpCircle, Info, 
  Lock, Globe, DollarSign, Store, TrendingUp, Scan, Users, Layers, Heart
} from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => { try { return await base44.auth.me(); } catch { return null; } }
  });

  const { data: captures } = useQuery({
    queryKey: ['allCaptures'],
    queryFn: () => base44.entities.Capture.list(),
    initialData: [],
  });

  // Your Stuff cards
  const yourStuff = [
    { id: 1, icon: Bookmark, label: "Saved Products", page: "MyCart" },
    { id: 2, icon: Layers, label: "Saved Comparisons", page: "SavedComparisons" },
    { id: 3, icon: Users, label: "Following", page: "FollowingList" },
  ];

  // Recently viewed/scanned products
  const recentlyViewed = captures.slice(0, 6);
  const recentlyScanned = captures.slice(0, 6);

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const toggleFavorite = (productId) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  // Stats
  const stats = [
    { icon: DollarSign, value: "$213", label: "Saved from Deals", color: "#00A36C" },
    { icon: Store, value: "9", label: "Stores Visited", color: "#00A36C" },
    { icon: Scan, value: captures.length.toString(), label: "Items Scanned", color: "#00A36C" },
    { icon: TrendingUp, value: "47", label: "Deals Found", color: "#00A36C" },
  ];

  // Tracking toggles
  const [alerts, setAlerts] = useState({
    priceDrop: true,
    restock: false,
    scan: true,
  });

  // Activity rows
  const activityRows = [
    { icon: Clock, label: "Recent Searches", page: "DiscoverSearch" },
    { icon: Camera, label: "Scan History", page: "RecentlyViewed" },
    { icon: Layers, label: "Compare History", page: "Compare" },
  ];

  // Settings Modal
  if (showSettings) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] pb-24">
        <div className="px-6 pt-6 pb-4 flex items-center justify-between">
          <button onClick={() => setShowSettings(false)} className="group">
            <ChevronRight className="w-5 h-5 text-[#1F2937] rotate-180" />
          </button>
          <h1 className="text-base font-semibold text-[#1F2937]">Settings</h1>
          <div className="w-5" />
        </div>

        <div className="px-6">
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { icon: Bell, label: "Notifications" },
              { icon: Star, label: "Personalization" },
              { icon: User, label: "Account and Login" },
              { icon: Lock, label: "Data and Privacy" },
              { icon: Globe, label: "Appearance" },
              { icon: HelpCircle, label: "Help Center" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button 
                  key={item.label}
                  className="bg-white rounded-lg p-4 shadow-md hover:bg-[#F9FAFB] transition-colors text-left"
                  style={{ height: '90px' }}
                >
                  <Icon className="w-5 h-5 text-[#00A36C] mb-2" strokeWidth={1.5} />
                  <p className="text-xs font-medium text-[#1F2937] leading-tight">{item.label}</p>
                </button>
              );
            })}
          </div>

          <button 
            onClick={() => base44.auth.logout()}
            className="w-full flex items-center justify-center gap-2 py-3 text-[#1F2937] hover:text-[#6B7280] transition-colors font-semibold mb-2"
          >
            <span className="text-sm">Sign Out</span>
          </button>
          
          <div className="text-center">
            <p className="text-xs text-[#9CA3AF] mb-1">Version 1.0.0</p>
            <div className="flex items-center justify-center gap-3 text-xs text-[#9CA3AF]">
              <button className="hover:text-[#6B7280]">Terms</button>
              <span>•</span>
              <button className="hover:text-[#6B7280]">Privacy</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-32">
      {/* Header */}
      <div className="px-6 pt-6 pb-3 flex items-center justify-between">
        <h1 className="text-base font-semibold text-[#1F2937]">Account</h1>
        <button 
          onClick={() => setShowSettings(true)}
          className="w-8 h-8 rounded-full bg-[#E5E7EB] flex items-center justify-center hover:bg-[#D1D5DB] transition-colors"
        >
          <Settings className="w-4 h-4 text-[#1F2937]" strokeWidth={2} />
        </button>
      </div>

      {/* Profile Section */}
      <div className="px-6 mb-6">
        <div className="flex items-start gap-4 mb-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#A7F3D0] to-[#6EE7B7] flex items-center justify-center flex-shrink-0">
            {user?.full_name ? (
              <span className="text-xl font-bold text-[#065F46]">
                {user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </span>
            ) : (
              <User className="w-8 h-8 text-[#065F46]" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <h2 className="text-base font-semibold text-[#1F2937] mb-1">
              {user?.full_name?.split(' ')[0] || 'Guest'}
            </h2>
            <p className="text-xs text-[#6B7280] mb-1.5">
              Shopping smarter, one scan at a time ✨
            </p>
            {user?.email && (
              <span className="inline-block px-2 py-0.5 rounded-full bg-[#D1FAE5] text-[#065F46] text-[10px] font-medium">
                Verified
              </span>
            )}
          </div>
        </div>

        {/* Edit Profile and Share Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => navigate(createPageUrl("EditProfile"))}
            className="bg-white rounded-lg p-3 shadow-md hover:bg-[#F9FAFB] transition-colors"
          >
            <p className="text-xs font-semibold text-[#1F2937]">Edit Profile</p>
          </button>
          <button 
            className="bg-white rounded-lg p-3 shadow-md hover:bg-[#F9FAFB] transition-colors"
          >
            <p className="text-xs font-semibold text-[#1F2937]">Share DeaLo</p>
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-4 gap-2">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div 
                key={idx}
                className="bg-white rounded-lg p-3 shadow-md text-center"
              >
                <Icon className="w-5 h-5 text-[#00A36C] mx-auto mb-2" strokeWidth={1.5} />
                <p className="text-base font-bold text-[#1F2937]">{stat.value}</p>
                <p className="text-[9px] text-[#6B7280] leading-tight">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Your Stuff Section */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-3 gap-2">
          {yourStuff.map((item) => {
            const Icon = item.icon;
            return (
              <button 
                key={item.id}
                onClick={() => navigate(createPageUrl(item.page))}
                className="bg-white rounded-lg p-3 text-center hover:bg-[#F9FAFB] transition-colors shadow-md"
                style={{ height: '90px' }}
              >
                <Icon className="w-5 h-5 text-[#00A36C] mb-2 mx-auto" strokeWidth={1.5} />
                <p className="text-xs font-medium text-[#1F2937] leading-tight">{item.label}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recently Viewed Section */}
      <div className="px-6 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-sm font-bold text-[#1F2937]">Recently Viewed</h2>
          <button className="w-6 h-6 rounded-full bg-[#E5E7EB] flex items-center justify-center">
            <ChevronRight className="w-3.5 h-3.5 text-[#6B7280]" />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {recentlyViewed.map((product) => (
            <div key={product.id} className="flex-shrink-0" style={{ width: '100px' }}>
              <button 
                onClick={() => navigate(createPageUrl("Preview") + `?id=${product.id}`)}
                className="relative w-full bg-white rounded-lg shadow-md overflow-hidden mb-2"
                style={{ height: '100px' }}
              >
                <img 
                  src={product.file_url} 
                  alt={product.title} 
                  className="w-full h-full object-cover"
                />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(product.id);
                  }}
                  className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-white/90 flex items-center justify-center shadow-sm"
                >
                  <Heart 
                    className={`w-3.5 h-3.5 ${favorites.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-[#6B7280]'}`} 
                    strokeWidth={2}
                  />
                </button>
              </button>
              <p className="text-xs text-[#1F2937] font-medium line-clamp-2">{product.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recently Scanned Section */}
      <div className="px-6 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-sm font-bold text-[#1F2937]">Recently Scanned</h2>
          <button className="w-6 h-6 rounded-full bg-[#E5E7EB] flex items-center justify-center">
            <ChevronRight className="w-3.5 h-3.5 text-[#6B7280]" />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {recentlyScanned.map((product) => (
            <div key={product.id} className="flex-shrink-0" style={{ width: '100px' }}>
              <button 
                onClick={() => navigate(createPageUrl("Preview") + `?id=${product.id}`)}
                className="relative w-full bg-white rounded-lg shadow-md overflow-hidden mb-2"
                style={{ height: '100px' }}
              >
                <img 
                  src={product.file_url} 
                  alt={product.title} 
                  className="w-full h-full object-cover"
                />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(product.id);
                  }}
                  className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-white/90 flex items-center justify-center shadow-sm"
                >
                  <Heart 
                    className={`w-3.5 h-3.5 ${favorites.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-[#6B7280]'}`} 
                    strokeWidth={2}
                  />
                </button>
              </button>
              <p className="text-xs text-[#1F2937] font-medium line-clamp-2">{product.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Padding */}
      <div className="h-24" />

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