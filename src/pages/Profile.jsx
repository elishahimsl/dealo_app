import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { User, Scan, DollarSign, TrendingDown, Settings, CreditCard, Sparkles, Award, LogOut, Bell, HelpCircle, Shield } from "lucide-react";

export default function Profile() {
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
  const moneySaved = 247; // Mock data
  const dealsTracked = 12; // Mock data

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
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#5EE177] to-[#FF8AC6] flex items-center justify-center">
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
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#5EE177] to-[#FF8AC6] flex items-center justify-center mx-auto mb-2">
                <Scan className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-[#2E2E38]">{totalScans}</p>
              <p className="text-xs text-[#60656F]">Scans</p>
            </div>
            <div className="text-center bg-[#F9FAFB] rounded-2xl p-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#5EE177] to-[#FF8AC6] flex items-center justify-center mx-auto mb-2">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-[#2E2E38]">${moneySaved}</p>
              <p className="text-xs text-[#60656F]">Saved</p>
            </div>
            <div className="text-center bg-[#F9FAFB] rounded-2xl p-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#5EE177] to-[#FF8AC6] flex items-center justify-center mx-auto mb-2">
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
        <div className="bg-gradient-to-r from-[#5EE177] to-[#FF8AC6] rounded-3xl p-6 shadow-lg">
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

      {/* Settings Section */}
      <div className="px-6 pb-32 space-y-3">
        {/* Account & Subscription */}
        <button className="w-full bg-white rounded-2xl p-5 border border-[#E4E8ED] shadow-sm text-left hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#A8F3C1] to-[#FFD3E8] rounded-full flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-[#2E2E38]" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-[#2E2E38]" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Account & Subscription
              </h4>
              <p className="text-xs text-[#60656F]">Manage premium features</p>
            </div>
          </div>
        </button>

        {/* Notifications */}
        <button className="w-full bg-white rounded-2xl p-5 border border-[#E4E8ED] shadow-sm text-left hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#A8F3C1] to-[#FFD3E8] rounded-full flex items-center justify-center">
              <Bell className="w-6 h-6 text-[#2E2E38]" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-[#2E2E38]" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Notifications
              </h4>
              <p className="text-xs text-[#60656F]">Manage alerts and reminders</p>
            </div>
          </div>
        </button>

        {/* AI Personalization */}
        <button className="w-full bg-white rounded-2xl p-5 border border-[#E4E8ED] shadow-sm text-left hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#A8F3C1] to-[#FFD3E8] rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-[#2E2E38]" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-[#2E2E38]" style={{ fontFamily: 'Nunito, sans-serif' }}>
                AI Personalization
              </h4>
              <p className="text-xs text-[#60656F]">Customize your experience</p>
            </div>
          </div>
        </button>

        {/* Privacy & Security */}
        <button className="w-full bg-white rounded-2xl p-5 border border-[#E4E8ED] shadow-sm text-left hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#A8F3C1] to-[#FFD3E8] rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-[#2E2E38]" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-[#2E2E38]" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Privacy & Security
              </h4>
              <p className="text-xs text-[#60656F]">Manage your data and privacy</p>
            </div>
          </div>
        </button>

        {/* Help & Support */}
        <button className="w-full bg-white rounded-2xl p-5 border border-[#E4E8ED] shadow-sm text-left hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#A8F3C1] to-[#FFD3E8] rounded-full flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-[#2E2E38]" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-[#2E2E38]" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Help & Support
              </h4>
              <p className="text-xs text-[#60656F]">Get assistance</p>
            </div>
          </div>
        </button>

        {/* Settings */}
        <button className="w-full bg-white rounded-2xl p-5 border border-[#E4E8ED] shadow-sm text-left hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#A8F3C1] to-[#FFD3E8] rounded-full flex items-center justify-center">
              <Settings className="w-6 h-6 text-[#2E2E38]" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-[#2E2E38]" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Settings
              </h4>
              <p className="text-xs text-[#60656F]">App preferences</p>
            </div>
          </div>
        </button>

        {/* Logout */}
        <button 
          onClick={() => base44.auth.logout()}
          className="w-full bg-white rounded-2xl p-5 border-2 border-red-200 text-left hover:bg-red-50 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <LogOut className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-red-600" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Log Out
              </h4>
              <p className="text-xs text-[#60656F]">Sign out of your account</p>
            </div>
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