import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User, Scan, DollarSign, Store, Tag, Settings, Award, ShoppingCart, Rocket, Share2, ChevronRight, Heart, Bell, Lock, HelpCircle, LogOut, Palette, Info, Bookmark, List, BellRing, Star, Clock, Sparkles, Pencil } from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const [settingsPage, setSettingsPage] = useState(null);
  const [usePreferences, setUsePreferences] = useState(true);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => { try { return await base44.auth.me(); } catch { return null; } }
  });

  const { data: captures } = useQuery({
    queryKey: ['allCaptures'],
    queryFn: () => base44.entities.Capture.list(),
    initialData: [],
  });

  const totalScans = captures.length;
  const savedItems = 24;
  const savedLists = 5;

  // Collections data
  const collections = [
    { id: 1, icon: Bookmark, label: "Saved Products", count: 24, color: "#00A36C" },
    { id: 2, icon: List, label: "Saved Lists", count: 5, color: "#1F2937" },
    { id: 3, icon: BellRing, label: "Price Alerts", count: 8, color: "#F59E0B" },
    { id: 4, icon: Star, label: "Your Brands", count: 12, color: "#8B5CF6" },
    { id: 5, icon: Store, label: "Your Stores", count: 6, color: "#EC4899" },
  ];

  // Recent activity
  const recentActivity = [
    { id: 1, type: "saved", title: "Nike Air Max 90", brand: "Nike", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200", time: "2h ago" },
    { id: 2, type: "alert", title: "Price drop alert set", brand: "Sony WH-1000XM5", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200", time: "5h ago" },
    { id: 3, type: "liked", title: "Smart Watch", brand: "Apple", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200", time: "1d ago" },
  ];

  // Preferences
  const likedBrands = ["Nike", "Apple", "Sony", "Target", "Uniqlo"];
  const likedStores = ["Amazon", "Target", "Best Buy"];
  const likedCategories = ["Tech", "Fashion", "Home"];

  // Settings sub-pages
  if (settingsPage) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] pb-24 animate-slide-in">
        <div className="px-6 pt-6 pb-4 flex items-center justify-between">
          <button onClick={() => setSettingsPage(null)} className="relative flex items-center justify-center group">
            <Tag className="w-5 h-5 text-[#00A36C] transform -rotate-45 group-hover:rotate-0 transition-transform duration-300 group-hover:scale-110" />
          </button>
          <h1 className="text-base font-medium text-[#1F2937]">{settingsPage}</h1>
          <div className="w-5" />
        </div>
        
        {settingsPage === 'Account' && (
          <div className="px-6 space-y-4">
            <div className="flex flex-col items-center py-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-[#E5E7EB] flex items-center justify-center">
                  <User className="w-12 h-12 text-[#6B7280]" />
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#00A36C] flex items-center justify-center shadow-lg">
                  <span className="text-white text-xs">✎</span>
                </button>
              </div>
            </div>
            {[{ label: 'Username', value: user?.full_name || 'ElishaH' }, { label: 'Email', value: user?.email || 'user@dealo.com' }, { label: 'Phone Number', value: '+1 (555) 000-0000' }].map((item) => (
              <button key={item.label} className="w-full bg-white rounded-2xl p-4 border border-[#E5E7EB] flex items-center justify-between">
                <div><p className="text-xs text-[#6B7280]">{item.label}</p><p className="text-sm font-semibold text-[#1F2937]">{item.value}</p></div>
                <ChevronRight className="w-5 h-5 text-[#6B7280]" />
              </button>
            ))}
            <div className="pt-4 space-y-3">
              <Button variant="outline" className="w-full rounded-2xl border-[#E5E7EB]">Change Email</Button>
              <Button variant="outline" className="w-full rounded-2xl border-[#E5E7EB]">Change Username</Button>
              <Button className="w-full rounded-2xl bg-red-500 hover:bg-red-600 text-white">Delete Account</Button>
            </div>
          </div>
        )}

        {settingsPage === 'Security' && (
          <div className="px-6 space-y-4">
            <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB]">
              <h3 className="font-bold text-[#1F2937] mb-2">Password Settings</h3>
              <p className="text-xs text-[#6B7280] mb-3">Last changed 30 days ago</p>
              <Button className="w-full rounded-2xl bg-[#00A36C] hover:bg-[#007E52]">Change Password</Button>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB]">
              <h3 className="font-bold text-[#1F2937] mb-3">Biometric Login</h3>
              {['Face ID', 'Touch ID'].map((item) => (
                <div key={item} className="flex items-center justify-between py-3 border-b border-[#E5E7EB] last:border-0">
                  <span className="text-sm text-[#1F2937]">{item}</span>
                  <div className="w-12 h-7 rounded-full bg-[#E5E7EB] p-1 cursor-pointer"><div className="w-5 h-5 rounded-full bg-white shadow" /></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {settingsPage === 'Notifications' && (
          <div className="px-6 space-y-3">
            {[{ title: 'Push Alerts', desc: 'Get notified about new deals' }, { title: 'Price Drop Alerts', desc: 'Know when prices drop on saved items' }, { title: 'Smart Recommendations', desc: 'AI-powered product suggestions' }, { title: 'Weekly Usage Reports', desc: 'Summary of your shopping activity' }].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-4 border border-[#E5E7EB] flex items-center justify-between">
                <div><p className="text-sm font-semibold text-[#1F2937]">{item.title}</p><p className="text-xs text-[#6B7280]">{item.desc}</p></div>
                <div className="w-12 h-7 rounded-full bg-[#00A36C] p-1 cursor-pointer flex justify-end"><div className="w-5 h-5 rounded-full bg-white shadow" /></div>
              </div>
            ))}
          </div>
        )}

        {settingsPage === 'Privacy' && (
          <div className="px-6 space-y-4">
            <h3 className="text-sm font-bold text-[#1F2937]">Data Permissions</h3>
            {[{ title: 'Camera Access', desc: 'Required for scanning products' }, { title: 'Photo Library', desc: 'Upload photos for comparison' }].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-4 border border-[#E5E7EB] flex items-center justify-between">
                <div><p className="text-sm font-semibold text-[#1F2937]">{item.title}</p><p className="text-xs text-[#6B7280]">{item.desc}</p></div>
                <div className="w-12 h-7 rounded-full bg-[#00A36C] p-1 cursor-pointer flex justify-end"><div className="w-5 h-5 rounded-full bg-white shadow" /></div>
              </div>
            ))}
            <Button className="w-full rounded-2xl bg-red-500 hover:bg-red-600 text-white mt-4">Clear My Data</Button>
          </div>
        )}

        {settingsPage === 'Help' && (
          <div className="px-6 space-y-4">
            <div className="relative">
              <input placeholder="Search help topics..." className="w-full h-12 rounded-2xl border border-[#E5E7EB] px-4 text-sm" />
            </div>
            <h3 className="text-sm font-bold text-[#1F2937]">FAQ</h3>
            {['How do I scan a product?', 'How does price comparison work?', 'Can I delete my account?'].map((q) => (
              <div key={q} className="bg-white rounded-2xl p-4 border border-[#E5E7EB]">
                <p className="text-sm font-semibold text-[#1F2937]">{q}</p>
              </div>
            ))}
            <Button variant="outline" className="w-full rounded-2xl border-[#00A36C] text-[#00A36C]">Contact Support</Button>
          </div>
        )}

        <style>{`@keyframes slide-in { from { transform: translateX(100%); } to { transform: translateX(0); } } .animate-slide-in { animation: slide-in 0.3s ease-out; }`}</style>
      </div>
    );
  }

  if (showSettings) {
    return (
      <div className="min-h-screen bg-white pb-24">
        <div className="px-6 pt-6 pb-4 flex items-center justify-between">
          <button onClick={() => setShowSettings(false)} className="relative flex items-center justify-center group">
            <Tag className="w-5 h-5 text-[#00A36C] transform -rotate-45 group-hover:rotate-0 transition-transform duration-300 group-hover:scale-110" />
          </button>
          <h1 className="text-base font-medium text-[#1F2937]">Settings</h1>
          <div className="w-5" />
        </div>
        <div className="px-6">
          <div className="grid grid-cols-2 gap-3 mb-8">
            {[
              { icon: User, label: 'Account', desc: 'Profile & Email', color: '#00A36C' },
              { icon: Bell, label: 'Notifications', desc: 'Alerts & Updates', color: '#1F2937' },
              { icon: Palette, label: 'Customization', desc: 'Preferences & Theme', color: '#00A36C', page: 'Customization' },
              { icon: Lock, label: 'Privacy', desc: 'Data & Sharing', color: '#1F2937' },
              { icon: HelpCircle, label: 'Help', desc: 'Support & Terms', color: '#1F2937' },
              { icon: Info, label: 'About', desc: 'App Info', color: '#1F2937' },
            ].map((item) => (
              <button key={item.label} onClick={() => item.page ? navigate(createPageUrl(item.page)) : setSettingsPage(item.label)} className="bg-[#F9FAFB] rounded-2xl p-4 text-left hover:bg-[#E5E7EB] transition-colors">
                <item.icon className="w-6 h-6 mb-2" style={{ color: item.color }} />
                <h3 className="text-sm font-bold text-[#1F2937]">{item.label}</h3>
                <p className="text-xs text-[#6B7280] mt-1">{item.desc}</p>
              </button>
            ))}
          </div>
          <div className="flex justify-center mb-6">
            <button onClick={() => base44.auth.logout()} className="flex items-center gap-2 text-[#1F2937] hover:opacity-70">
              <LogOut className="w-5 h-5" /><span className="text-sm font-semibold">Sign out</span>
            </button>
          </div>
          <p className="text-center text-xs text-[#6B7280]">Terms and Conditions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      {/* Header */}
      <div className="px-6 pt-6 pb-2 flex items-center justify-between">
        <p className="text-xs text-[#9CA3AF]">Profile</p>
        <button onClick={() => setShowSettings(true)} className="w-8 h-8 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center">
          <Pencil className="w-4 h-4 text-[#6B7280]" />
        </button>
      </div>

      {/* Profile Card */}
      <div className="px-6 mb-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E5E7EB]">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00A36C] to-[#007E52] flex items-center justify-center shadow-lg">
                {user?.full_name ? (
                  <span className="text-2xl font-bold text-white">{user.full_name.charAt(0).toUpperCase()}</span>
                ) : (
                  <User className="w-10 h-10 text-white" />
                )}
              </div>
            </div>

            {/* Name & Tagline */}
            <div className="flex-1 pt-1">
              <h2 className="text-xl font-bold text-[#1F2937] mb-0.5">{user?.full_name || 'ElishaH'}</h2>
              <p className="text-xs text-[#6B7280] mb-2">{user?.email || 'user@dealo.com'}</p>
              <div className="inline-flex items-center gap-1 bg-[#D6F5E9] text-[#00A36C] text-[10px] font-semibold px-2 py-1 rounded-full">
                <Sparkles className="w-3 h-3" />
                Smart Shopper
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex items-center justify-around mt-5 pt-4 border-t border-[#E5E7EB]">
            <Link to={createPageUrl("MyCart")} className="text-center">
              <p className="text-lg font-bold text-[#1F2937]">{savedItems}</p>
              <p className="text-[10px] text-[#6B7280]">Saved Items</p>
            </Link>
            <div className="w-px h-8 bg-[#E5E7EB]" />
            <Link to={createPageUrl("MyCart")} className="text-center">
              <p className="text-lg font-bold text-[#1F2937]">{savedLists}</p>
              <p className="text-[10px] text-[#6B7280]">Saved Lists</p>
            </Link>
            <div className="w-px h-8 bg-[#E5E7EB]" />
            <button className="text-center">
              <p className="text-lg font-bold text-[#1F2937]">{totalScans}</p>
              <p className="text-[10px] text-[#6B7280]">Scans</p>
            </button>
          </div>
        </div>
      </div>

      {/* Your Collections */}
      <div className="mb-6">
        <h3 className="px-6 text-sm font-bold text-[#1F2937] mb-3">Your Collections</h3>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-6">
          {collections.map((col) => {
            const Icon = col.icon;
            return (
              <button 
                key={col.id}
                onClick={() => navigate(createPageUrl("MyCart"))}
                className="flex-shrink-0 bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow"
                style={{ width: '120px' }}
              >
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-2"
                  style={{ backgroundColor: `${col.color}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color: col.color }} />
                </div>
                <p className="text-xs font-semibold text-[#1F2937] mb-0.5 text-left">{col.label}</p>
                <p className="text-[10px] text-[#6B7280] text-left">{col.count} items</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-6 mb-6">
        <h3 className="text-sm font-bold text-[#1F2937] mb-3">Recent Activity</h3>
        <div className="space-y-2">
          {recentActivity.map((item) => (
            <button 
              key={item.id}
              className="w-full bg-white rounded-2xl p-3 border border-[#E5E7EB] flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#F3F4F6] flex-shrink-0">
                <img src={item.image} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs font-semibold text-[#1F2937]">{item.title}</p>
                <p className="text-[10px] text-[#6B7280]">{item.brand}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#9CA3AF]">{item.time}</span>
                <ChevronRight className="w-4 h-4 text-[#D1D5DB]" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Your Preferences */}
      <div className="px-6 mb-6">
        <h3 className="text-sm font-bold text-[#1F2937] mb-3">Your Preferences</h3>
        <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm space-y-4">
          {/* Brands */}
          <div>
            <p className="text-[10px] font-medium text-[#6B7280] mb-2">Brands You Like</p>
            <div className="flex flex-wrap gap-2">
              {likedBrands.map((brand) => (
                <span key={brand} className="px-3 py-1 rounded-full bg-[#F3F4F6] text-xs font-medium text-[#1F2937]">
                  {brand}
                </span>
              ))}
            </div>
          </div>

          {/* Stores */}
          <div>
            <p className="text-[10px] font-medium text-[#6B7280] mb-2">Stores You Shop At</p>
            <div className="flex flex-wrap gap-2">
              {likedStores.map((store) => (
                <span key={store} className="px-3 py-1 rounded-full bg-[#D6F5E9] text-xs font-medium text-[#00A36C]">
                  {store}
                </span>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <p className="text-[10px] font-medium text-[#6B7280] mb-2">Categories You Follow</p>
            <div className="flex flex-wrap gap-2">
              {likedCategories.map((cat) => (
                <span key={cat} className="px-3 py-1 rounded-full bg-[#F3F4F6] text-xs font-medium text-[#1F2937]">
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {/* Preferences Toggle */}
          <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#1F2937]">Smart Suggestion Influence</p>
              <p className="text-[10px] text-[#6B7280]">Use my preferences to improve recommendations</p>
            </div>
            <button 
              onClick={() => setUsePreferences(!usePreferences)}
              className={`w-12 h-7 rounded-full p-1 transition-colors ${usePreferences ? 'bg-[#00A36C]' : 'bg-[#E5E7EB]'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${usePreferences ? 'translate-x-5' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Account & Settings */}
      <div className="px-6 mb-6">
        <h3 className="text-sm font-bold text-[#1F2937] mb-3">Account & Settings</h3>
        <div className="space-y-2">
          {[
            { icon: Sparkles, label: "Your DeaLo AI Activity", desc: "Chats, searches, generations" },
            { icon: HelpCircle, label: "Help / Support", desc: "FAQ and contact" },
            { icon: Info, label: "About DeaLo", desc: "Version 1.0.0" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button 
                key={item.label}
                onClick={() => setSettingsPage('Help')}
                className="w-full bg-white rounded-2xl p-3 border border-[#E5E7EB] flex items-center gap-3 shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-[#F3F4F6] flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#6B7280]" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-xs font-semibold text-[#1F2937]">{item.label}</p>
                  <p className="text-[10px] text-[#6B7280]">{item.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[#D1D5DB]" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Invite Friends */}
      <div className="px-6 mb-6">
        <Button className="w-full bg-[#00A36C] text-white hover:bg-[#007E52] font-bold rounded-2xl h-12 text-sm flex items-center justify-center gap-2">
          <Share2 className="w-4 h-4" />
          Invite Friends
        </Button>
      </div>

      {/* Sign Out */}
      <div className="px-6 mb-8">
        <button 
          onClick={() => base44.auth.logout()} 
          className="w-full text-center text-xs text-[#6B7280] hover:text-[#1F2937]"
        >
          Sign Out
        </button>
      </div>

      {/* Footer */}
      <div className="px-6 pb-8 text-center">
        <div className="flex items-center justify-center gap-1 opacity-20">
          <div className="w-4 h-4 rounded bg-[#00A36C] flex items-center justify-center">
            <Tag className="w-2.5 h-2.5 text-white" />
          </div>
          <p className="text-sm font-bold">
            <span className="text-[#1F2937]">deal</span><span className="text-[#00A36C]">o</span>
          </p>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; } 
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}