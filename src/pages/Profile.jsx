import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  User, Settings, ChevronRight, Bookmark, Star, Tag, 
  Bell, BellRing, Clock, Camera, LogOut, HelpCircle, Info, 
  Lock, Globe, DollarSign, Store, TrendingUp, Scan, Users, Layers
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
    { id: 1, icon: Bookmark, label: "Saved Products", count: 24, page: "MyCart" },
    { id: 2, icon: Layers, label: "Saved Comparisons", count: 8, page: "Compare" },
    { id: 3, icon: Users, label: "Following", count: 12, page: "FollowingList" },
    { id: 4, icon: Tag, label: "Favorite Categories", count: 6, page: "More" },
  ];

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
    { icon: Scale, label: "Compare History", page: "Compare" },
  ];

  // Settings Modal
  if (showSettings) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] pb-24">
        <div className="px-6 pt-6 pb-4 flex items-center justify-between">
          <button onClick={() => setShowSettings(false)} className="group">
            <Tag className="w-5 h-5 text-[#00A36C] transform -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
          </button>
          <h1 className="text-base font-semibold text-[#1F2937]">Settings</h1>
          <div className="w-5" />
        </div>

        <div className="px-6">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
            {[
              { icon: Bell, label: "Notifications", page: null },
              { icon: Lock, label: "Privacy", page: null },
              { icon: Globe, label: "Language", page: null },
              { icon: HelpCircle, label: "Help Center", page: null },
              { icon: Info, label: "About", page: null },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <button 
                  key={item.label}
                  className={`w-full flex items-center gap-4 p-4 text-left hover:bg-[#F9FAFB] transition-colors ${idx < 4 ? 'border-b border-[#F3F4F6]' : ''}`}
                >
                  <Icon className="w-5 h-5 text-[#6B7280]" strokeWidth={1.5} />
                  <span className="flex-1 text-sm text-[#1F2937]">{item.label}</span>
                  <ChevronRight className="w-4 h-4 text-[#D1D5DB]" />
                </button>
              );
            })}
          </div>

          <button 
            onClick={() => base44.auth.logout()}
            className="w-full flex items-center justify-center gap-2 py-3 text-red-500 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" strokeWidth={1.5} />
            <span className="text-sm font-medium">Log Out</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-32">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[#1F2937]">Account</h1>
        <button 
          onClick={() => setShowSettings(true)}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#E5E7EB] transition-colors"
        >
          <Settings className="w-5 h-5 text-[#6B7280]" strokeWidth={1.5} />
        </button>
      </div>

      {/* Profile Card */}
      <div className="px-6 mb-6">
        <button 
          onClick={() => navigate(createPageUrl("Customization"))}
          className="w-full bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4"
        >
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
          <div className="flex-1 text-left">
            <h2 className="text-lg font-semibold text-[#1F2937] mb-0.5">
              {user?.full_name || 'Guest User'}
            </h2>
            <p className="text-sm text-[#6B7280]">
              {user?.email || 'No email'}
            </p>
            {user?.email && (
              <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full bg-[#D1FAE5] text-[#065F46] text-[10px] font-medium">
                Verified
              </span>
            )}
          </div>

          {/* Chevron */}
          <ChevronRight className="w-5 h-5 text-[#D1D5DB]" />
        </button>
      </div>

      {/* Stats Row */}
      <div className="px-6 mb-8">
        <div className="grid grid-cols-4 gap-2">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div 
                key={idx}
                className="bg-white rounded-2xl p-3 shadow-sm text-center"
              >
                <div 
                  className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <Icon className="w-4 h-4" style={{ color: stat.color }} />
                </div>
                <p className="text-base font-bold text-[#1F2937]">{stat.value}</p>
                <p className="text-[9px] text-[#6B7280] leading-tight">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Your Stuff Section */}
      <div className="px-6 mb-8">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="text-lg font-bold text-[#1F2937] mb-4">Your Stuff</h2>
          <div className="grid grid-cols-2 gap-3">
            {yourStuff.map((item) => {
              const Icon = item.icon;
              return (
                <button 
                  key={item.id}
                  onClick={() => navigate(createPageUrl(item.page))}
                  className="bg-[#F9FAFB] rounded-xl p-4 text-left hover:bg-[#F3F4F6] transition-colors"
                  style={{ height: '100px' }}
                >
                  <Icon className="w-6 h-6 text-[#00A36C] mb-2" strokeWidth={1.5} />
                  <p className="text-sm font-medium text-[#1F2937]">{item.label}</p>
                  <p className="text-xs text-[#9CA3AF]">{item.count} items</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tracking & Alerts Section */}
      <div className="px-6 mb-8">
        <h2 className="text-lg font-bold text-[#1F2937] mb-4">Tracking & Alerts</h2>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {[
            { key: 'priceDrop', icon: Tag, label: "Price Drop Alerts" },
            { key: 'restock', icon: BellRing, label: "Restock Alerts" },
            { key: 'scan', icon: Camera, label: "Scan Alerts" },
          ].map((item, idx) => {
            const Icon = item.icon;
            const isOn = alerts[item.key];
            return (
              <div 
                key={item.key}
                className={`flex items-center gap-4 p-4 ${idx < 2 ? 'border-b border-[#F3F4F6]' : ''}`}
              >
                <Icon className="w-5 h-5 text-[#6B7280]" strokeWidth={1.5} />
                <span className="flex-1 text-sm text-[#1F2937]">{item.label}</span>
                <button 
                  onClick={() => setAlerts(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                  className={`w-12 h-7 rounded-full p-1 transition-colors ${isOn ? 'bg-[#00A36C]' : 'bg-[#E5E7EB]'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${isOn ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Your Activity Section */}
      <div className="px-6 mb-8">
        <h2 className="text-lg font-bold text-[#1F2937] mb-4">Your Activity</h2>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {activityRows.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button 
                key={item.label}
                onClick={() => navigate(createPageUrl(item.page))}
                className={`w-full flex items-center gap-4 p-4 text-left hover:bg-[#F9FAFB] transition-colors ${idx < activityRows.length - 1 ? 'border-b border-[#F3F4F6]' : ''}`}
              >
                <Icon className="w-5 h-5 text-[#6B7280]" strokeWidth={1.5} />
                <span className="flex-1 text-sm text-[#1F2937]">{item.label}</span>
                <ChevronRight className="w-4 h-4 text-[#D1D5DB]" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Padding */}
      <div className="h-24" />
    </div>
  );
}