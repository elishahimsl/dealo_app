import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { User, Scan, DollarSign, TrendingDown, Settings, Award, ChevronRight, Gift, Users, History, Zap, Moon, Sun, Bell, Shield, Sparkles, CreditCard, HelpCircle, LogOut } from "lucide-react";

export default function Profile() {
  const [showSettings, setShowSettings] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

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
  const moneySaved = 247;
  const dealsTracked = 12;

  const settingsItems = [
    { icon: CreditCard, label: "Account & Subscription", description: "Manage premium features" },
    { icon: Bell, label: "Notifications", description: "Manage alerts and reminders" },
    { icon: Sparkles, label: "AI Personalization", description: "Customize your experience" },
    { icon: Shield, label: "Privacy & Security", description: "Manage your data and privacy" },
    { icon: HelpCircle, label: "Help & Support", description: "Get assistance" },
    { icon: LogOut, label: "Log Out", description: "Sign out of your account", isLogout: true },
  ];

  if (showSettings) {
    return (
      <div className="min-h-screen bg-[#F9FAFB]">
        {/* Settings Header */}
        <div className="px-6 pt-8 pb-4">
          <button 
            onClick={() => setShowSettings(false)}
            className="flex items-center gap-2 mb-4 text-[#60656F] hover:text-[#2E2E38]"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
            <span className="font-semibold">Back</span>
          </button>
          <h1 className="text-2xl font-bold text-[#2E2E38] mb-1 border-b-2 border-[#5EE177] inline-block" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Settings
          </h1>
        </div>

        {/* Settings Items */}
        <div className="px-6 pb-32 space-y-3">
          {settingsItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button 
                key={idx}
                onClick={() => item.isLogout && base44.auth.logout()}
                className={`w-full rounded-2xl p-5 border shadow-sm text-left hover:shadow-md transition-all ${
                  item.isLogout 
                    ? 'bg-white border-red-200 hover:bg-red-50' 
                    : 'bg-white border-[#E4E8ED]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    item.isLogout 
                      ? 'bg-red-100' 
                      : 'bg-gradient-to-br from-[#5EE177] to-[#5EA7FF]'
                  }`}>
                    <Icon className={`w-6 h-6 ${item.isLogout ? 'text-red-600' : 'text-white'}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold ${item.isLogout ? 'text-red-600' : 'text-[#2E2E38]'}`} style={{ fontFamily: 'Nunito, sans-serif' }}>
                      {item.label}
                    </h4>
                    <p className="text-xs text-[#60656F]">{item.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <h1 className="text-2xl font-bold text-[#2E2E38] mb-1 border-b-2 border-[#5EE177] inline-block" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Profile
        </h1>
      </div>

      {/* Profile Card */}
      <div className="px-6 mb-6">
        <div className="bg-white rounded-3xl p-6 border border-[#E4E8ED] shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#5EE177] to-[#5EA7FF] flex items-center justify-center">
              <User className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#2E2E38] mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {user?.full_name || 'Guest User'}
              </h2>
              <p className="text-[#60656F] text-sm">
                {user?.email || 'guest@snapsmart.com'}
              </p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center bg-[#F9FAFB] rounded-2xl p-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#5EE177] to-[#5EA7FF] flex items-center justify-center mx-auto mb-2">
                <Scan className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-[#2E2E38]">{totalScans}</p>
              <p className="text-xs text-[#60656F]">Scans</p>
            </div>
            <div className="text-center bg-[#F9FAFB] rounded-2xl p-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#5EE177] to-[#5EA7FF] flex items-center justify-center mx-auto mb-2">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-[#2E2E38]">${moneySaved}</p>
              <p className="text-xs text-[#60656F]">Saved</p>
            </div>
            <div className="text-center bg-[#F9FAFB] rounded-2xl p-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#5EE177] to-[#5EA7FF] flex items-center justify-center mx-auto mb-2">
                <TrendingDown className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-[#2E2E38]">{dealsTracked}</p>
              <p className="text-xs text-[#60656F]">Deals</p>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Badge */}
      <div className="px-6 mb-6">
        <div className="bg-gradient-to-r from-[#5EE177] to-[#5EA7FF] rounded-3xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <Award className="w-8 h-8 text-white" />
            <div>
              <h4 className="font-bold text-white text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Achievement Unlocked!
              </h4>
              <p className="text-white/90 text-sm">Saved $100 This Month</p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Scan className="w-5 h-5 text-white" />
            </div>
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-6 pb-32 space-y-3">
        {/* Rewards & Achievements */}
        <button className="w-full bg-white rounded-2xl p-5 border border-[#E4E8ED] shadow-sm text-left hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FFD93D] to-[#FF8AC6] rounded-full flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-[#2E2E38]" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Rewards & Achievements
              </h4>
              <p className="text-xs text-[#60656F]">View your badges and rewards</p>
            </div>
            <ChevronRight className="w-5 h-5 text-[#60656F]" />
          </div>
        </button>

        {/* Order History */}
        <button className="w-full bg-white rounded-2xl p-5 border border-[#E4E8ED] shadow-sm text-left hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#5EA7FF] to-[#5EE177] rounded-full flex items-center justify-center">
              <History className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-[#2E2E38]" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Order History
              </h4>
              <p className="text-xs text-[#60656F]">Track your purchases</p>
            </div>
            <ChevronRight className="w-5 h-5 text-[#60656F]" />
          </div>
        </button>

        {/* Refer Friends */}
        <button className="w-full bg-white rounded-2xl p-5 border border-[#E4E8ED] shadow-sm text-left hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FF8AC6] to-[#5EA7FF] rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-[#2E2E38]" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Refer Friends
              </h4>
              <p className="text-xs text-[#60656F]">Earn rewards together</p>
            </div>
            <ChevronRight className="w-5 h-5 text-[#60656F]" />
          </div>
        </button>

        {/* Smart Insights */}
        <button className="w-full bg-white rounded-2xl p-5 border border-[#E4E8ED] shadow-sm text-left hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#5EE177] to-[#FFD93D] rounded-full flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-[#2E2E38]" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Smart Insights
              </h4>
              <p className="text-xs text-[#60656F]">Your shopping analytics</p>
            </div>
            <ChevronRight className="w-5 h-5 text-[#60656F]" />
          </div>
        </button>

        {/* Gift Cards */}
        <button className="w-full bg-white rounded-2xl p-5 border border-[#E4E8ED] shadow-sm text-left hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FF8AC6] to-[#FFD93D] rounded-full flex items-center justify-center">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-[#2E2E38]" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Gift Cards
              </h4>
              <p className="text-xs text-[#60656F]">Manage your gift cards</p>
            </div>
            <ChevronRight className="w-5 h-5 text-[#60656F]" />
          </div>
        </button>

        {/* Theme Toggle */}
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="w-full bg-white rounded-2xl p-5 border border-[#E4E8ED] shadow-sm text-left hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#2E2E38] to-[#60656F] rounded-full flex items-center justify-center">
                {isDarkMode ? <Moon className="w-6 h-6 text-white" /> : <Sun className="w-6 h-6 text-white" />}
              </div>
              <div>
                <h4 className="font-semibold text-[#2E2E38]" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  Dark Mode
                </h4>
                <p className="text-xs text-[#60656F]">Toggle theme</p>
              </div>
            </div>
            <div className={`w-12 h-6 rounded-full relative transition-all ${isDarkMode ? 'bg-[#5EE177]' : 'bg-[#E4E8ED]'}`}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isDarkMode ? 'right-1' : 'left-1'}`} />
            </div>
          </div>
        </button>

        {/* Settings */}
        <button 
          onClick={() => setShowSettings(true)}
          className="w-full bg-white rounded-2xl p-5 border border-[#E4E8ED] shadow-sm text-left hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#5EE177] to-[#5EA7FF] rounded-full flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-[#2E2E38]" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Settings
              </h4>
              <p className="text-xs text-[#60656F]">App preferences & account</p>
            </div>
            <ChevronRight className="w-5 h-5 text-[#60656F]" />
          </div>
        </button>
      </div>

      {/* Footer */}
      <div className="fixed bottom-24 left-0 right-0 px-6">
        <div className="bg-white rounded-2xl p-4 border border-[#E4E8ED] text-center shadow-sm">
          <p className="text-[#60656F] text-xs">
            SnapSmart © 2025 • Shop Smart. Save Big.
          </p>
        </div>
      </div>
    </div>
  );
}