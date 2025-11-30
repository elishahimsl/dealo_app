import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Star, Palette, Smartphone, Bell, ChevronRight, Sun, Moon, Zap } from "lucide-react";

export default function Customization() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");
  const [behaviors, setBehaviors] = useState({
    smartSense: true,
    advancedFilters: false,
    autoplayVideos: false,
    quickCompare: true,
    useProfilePreferences: true
  });
  const [notifications, setNotifications] = useState({
    priceDrops: true,
    restocks: true,
    dealAlerts: true,
    brandNotifs: false
  });

  const toggleBehavior = (key) => {
    setBehaviors({ ...behaviors, [key]: !behaviors[key] });
  };

  const toggleNotification = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F9FAFB] to-[#E5E7EB] pb-24">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5 text-[#1F2937]" />
          </button>
          <h1 className="text-base font-bold text-[#1F2937]">Customization</h1>
          <div className="w-5" />
        </div>
      </div>

      <div className="px-6 space-y-4">
        {/* Preferences Card */}
        <button
          onClick={() => navigate(createPageUrl("Preferences"))}
          className="w-full bg-white rounded-3xl p-5 border border-[#E5E7EB] shadow-lg text-left relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#00A36C]/10 to-transparent rounded-bl-full" />
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00A36C] to-[#007E52] flex items-center justify-center flex-shrink-0">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-[#1F2937]">Preferences</h3>
                <span className="px-2 py-0.5 rounded-full bg-[#00A36C]/10 text-[#00A36C] text-[10px] font-bold">Recommended</span>
              </div>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                Build your shopping profile — favorite brands, categories, priorities, and more.
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-[#6B7280] flex-shrink-0 mt-3" />
          </div>
        </button>

        {/* Visual Theme */}
        <div className="bg-white rounded-3xl p-5 border border-[#E5E7EB] shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#F3F4F6] flex items-center justify-center">
              <Palette className="w-5 h-5 text-[#6B7280]" />
            </div>
            <h3 className="text-base font-bold text-[#1F2937]">Visual Theme</h3>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "light", icon: Sun, label: "Light", preview: "bg-white" },
              { id: "dark", icon: Moon, label: "Dark", preview: "bg-[#1F2937]" },
              { id: "amoled", icon: Zap, label: "AMOLED", preview: "bg-black" },
            ].map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`rounded-2xl p-3 border-2 transition-all ${
                    theme === t.id ? 'border-[#00A36C] bg-[#00A36C]/5' : 'border-[#E5E7EB]'
                  }`}
                >
                  <div className={`w-full h-12 rounded-xl ${t.preview} border border-[#E5E7EB] mb-2`} />
                  <div className="flex items-center justify-center gap-1">
                    <Icon className={`w-3 h-3 ${theme === t.id ? 'text-[#00A36C]' : 'text-[#6B7280]'}`} />
                    <span className={`text-xs font-semibold ${theme === t.id ? 'text-[#00A36C]' : 'text-[#6B7280]'}`}>
                      {t.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* App Behavior */}
        <div className="bg-white rounded-3xl p-5 border border-[#E5E7EB] shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#F3F4F6] flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-[#6B7280]" />
            </div>
            <h3 className="text-base font-bold text-[#1F2937]">App Behavior</h3>
          </div>

          <div className="space-y-3">
            {[
              { key: "smartSense", label: "SmartSense Suggestions (AI)" },
              { key: "advancedFilters", label: "Advanced filters default ON" },
              { key: "autoplayVideos", label: "Autoplay videos" },
              { key: "quickCompare", label: "Quick-add to Compare" },
              { key: "useProfilePreferences", label: "Best Match uses profile preferences" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-2">
                <span className="text-sm text-[#1F2937]">{item.label}</span>
                <button
                  onClick={() => toggleBehavior(item.key)}
                  className={`w-12 h-7 rounded-full p-1 transition-colors ${
                    behaviors[item.key] ? 'bg-[#00A36C]' : 'bg-[#E5E7EB]'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    behaviors[item.key] ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-3xl p-5 border border-[#E5E7EB] shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#F3F4F6] flex items-center justify-center">
              <Bell className="w-5 h-5 text-[#6B7280]" />
            </div>
            <h3 className="text-base font-bold text-[#1F2937]">Notification Settings</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { key: "priceDrops", label: "Price Drops", icon: "💰" },
              { key: "restocks", label: "Restocks", icon: "📦" },
              { key: "dealAlerts", label: "Deal Alerts", icon: "🔔" },
              { key: "brandNotifs", label: "Brand Updates", icon: "🏷️" },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => toggleNotification(item.key)}
                className={`rounded-2xl p-4 border-2 transition-all ${
                  notifications[item.key] 
                    ? 'border-[#00A36C] bg-[#00A36C]/5' 
                    : 'border-[#E5E7EB] bg-[#F9FAFB]'
                }`}
              >
                <span className="text-2xl mb-2 block">{item.icon}</span>
                <span className={`text-xs font-semibold ${
                  notifications[item.key] ? 'text-[#00A36C]' : 'text-[#6B7280]'
                }`}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}