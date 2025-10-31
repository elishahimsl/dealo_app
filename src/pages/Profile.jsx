import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { User, Scan, DollarSign, TrendingDown, Moon, Sun, Settings, CreditCard, Sparkles, Award, LogOut } from "lucide-react";

export default function Profile() {
  const [theme, setTheme] = useState('dark');

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

  useEffect(() => {
    const savedTheme = localStorage.getItem('snapsmart-theme') || 'dark';
    setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('snapsmart-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const totalScans = captures.length;
  const moneySaved = 247; // Mock data
  const dealsTracked = 12; // Mock data

  return (
    <div className="min-h-screen bg-background theme-transition">
      {/* Profile Header */}
      <div className="px-6 pt-12 pb-8">
        <div className="bg-card glass-effect rounded-3xl p-6 card-shadow fade-in">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-main mb-1">
                {user?.full_name || 'Guest User'}
              </h2>
              <p className="text-secondary text-sm">
                {user?.email || 'guest@snapsmart.com'}
              </p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-2">
                <Scan className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-main">{totalScans}</p>
              <p className="text-xs text-secondary">Scans</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-2">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-main">${moneySaved}</p>
              <p className="text-xs text-secondary">Saved</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-2">
                <TrendingDown className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-main">{dealsTracked}</p>
              <p className="text-xs text-secondary">Deals</p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Section */}
      <div className="px-6 pb-8 space-y-3">
        {/* Theme Toggle */}
        <div className="bg-card glass-effect rounded-2xl p-5 card-shadow bounce-tap transition-transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                theme === 'dark' ? 'bg-gradient-to-br from-indigo-600 to-purple-600' : 'bg-gradient-to-br from-yellow-400 to-orange-500'
              }`}>
                {theme === 'dark' ? (
                  <Moon className="w-5 h-5 text-white" />
                ) : (
                  <Sun className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <h4 className="font-bold text-main">Theme</h4>
                <p className="text-xs text-secondary">
                  {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className={`w-14 h-7 rounded-full relative transition-all ${
                theme === 'dark' ? 'bg-primary' : 'bg-gray-300'
              }`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${
                theme === 'dark' ? 'right-1' : 'left-1'
              }`} />
            </button>
          </div>
        </div>

        {/* Account / Subscription */}
        <button className="w-full bg-card glass-effect rounded-2xl p-5 card-shadow text-left bounce-tap transition-transform hover:scale-105">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-main">Account & Subscription</h4>
              <p className="text-xs text-secondary">Manage premium features</p>
            </div>
          </div>
        </button>

        {/* AI Personalization */}
        <button className="w-full bg-card glass-effect rounded-2xl p-5 card-shadow text-left bounce-tap transition-transform hover:scale-105">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-main">AI Personalization</h4>
              <p className="text-xs text-secondary">Customize your experience</p>
            </div>
          </div>
        </button>

        {/* Achievement Badges */}
        <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl p-5 card-shadow">
          <div className="flex items-center gap-3 mb-3">
            <Award className="w-8 h-8 text-white" />
            <div>
              <h4 className="font-bold text-white text-lg">Achievement Unlocked!</h4>
              <p className="text-white/80 text-sm">Saved $100 This Month</p>
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

        {/* Settings */}
        <button className="w-full bg-card glass-effect rounded-2xl p-5 card-shadow text-left bounce-tap transition-transform hover:scale-105">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-main">Settings</h4>
              <p className="text-xs text-secondary">App preferences & privacy</p>
            </div>
          </div>
        </button>

        {/* Logout */}
        <button 
          onClick={() => base44.auth.logout()}
          className="w-full bg-red-500/10 border-2 border-red-500/30 rounded-2xl p-5 text-left bounce-tap transition-transform hover:scale-105"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
              <LogOut className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-red-600">Log Out</h4>
            </div>
          </div>
        </button>
      </div>

      {/* Footer */}
      <div className="px-6 pb-12 text-center">
        <p className="text-secondary text-xs">
          SnapSmart © 2025 • Shop Smarter, Save Big
        </p>
      </div>
    </div>
  );
}