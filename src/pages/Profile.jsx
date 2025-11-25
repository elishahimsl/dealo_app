import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User, Scan, DollarSign, Store, Tag, Settings, Award, ShoppingCart, Rocket, Share2, ChevronRight, Heart, ArrowLeft, Bell, Lock, HelpCircle, FileText, LogOut } from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const [settingsPage, setSettingsPage] = useState(null);

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

  const recentlyViewed = [
    { id: 1, price: "$89.99", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200" },
    { id: 2, price: "$199.99", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200" },
    { id: 3, price: "$59.99", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200" },
    { id: 4, price: "$24.99", image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=200" },
  ];

  // Settings sub-pages
  if (settingsPage) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] pb-24 animate-slide-in">
        <div className="px-6 pt-6 pb-4 flex items-center gap-3">
          <button onClick={() => setSettingsPage(null)}><ArrowLeft className="w-5 h-5 text-[#1F2937]" /></button>
          <h1 className="text-base font-bold text-[#1F2937]">{settingsPage}</h1>
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
            <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB]">
              <h3 className="font-bold text-[#1F2937] mb-2">Two-Factor Authentication</h3>
              <p className="text-xs text-[#6B7280] mb-3">Add an extra layer of security</p>
              <Button variant="outline" className="w-full rounded-2xl border-[#00A36C] text-[#00A36C]">Setup 2FA</Button>
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
            {[{ title: 'Camera Access', desc: 'Required for scanning products' }, { title: 'Photo Library', desc: 'Upload photos for comparison' }, { title: 'Microphone', desc: 'Voice search functionality' }].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-4 border border-[#E5E7EB] flex items-center justify-between">
                <div><p className="text-sm font-semibold text-[#1F2937]">{item.title}</p><p className="text-xs text-[#6B7280]">{item.desc}</p></div>
                <div className="w-12 h-7 rounded-full bg-[#00A36C] p-1 cursor-pointer flex justify-end"><div className="w-5 h-5 rounded-full bg-white shadow" /></div>
              </div>
            ))}
            <div className="bg-[#F9FAFB] rounded-2xl p-4 border border-[#E5E7EB]">
              <h3 className="font-bold text-[#1F2937] mb-2">AI Personalization Data</h3>
              <p className="text-xs text-[#6B7280]">We use your preferences to improve recommendations. Your data is never sold to third parties.</p>
            </div>
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
            <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB]">
              <h3 className="font-bold text-[#1F2937] mb-3">Report an Issue</h3>
              <textarea placeholder="Describe your issue..." className="w-full h-24 rounded-xl border border-[#E5E7EB] p-3 text-sm resize-none mb-3" />
              <Button className="w-full rounded-2xl bg-[#00A36C] hover:bg-[#007E52]">Submit Report</Button>
            </div>
            <Button variant="outline" className="w-full rounded-2xl border-[#00A36C] text-[#00A36C]">Contact Support</Button>
          </div>
        )}

        {settingsPage === 'Terms' && (
          <div className="px-6">
            <div className="flex gap-2 mb-4 sticky top-0 bg-[#F9FAFB] py-2">
              <button className="flex-1 py-2 rounded-xl bg-[#00A36C] text-white text-sm font-semibold">Terms of Service</button>
              <button className="flex-1 py-2 rounded-xl bg-white text-[#1F2937] text-sm font-semibold border border-[#E5E7EB]">Privacy Policy</button>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB]" style={{ fontFamily: 'Georgia, serif' }}>
              <h2 className="text-lg font-bold mb-4">Terms of Service</h2>
              <p className="text-sm text-[#6B7280] leading-relaxed mb-4">Welcome to DeaLo. By using our app, you agree to these terms...</p>
              <h3 className="font-bold text-[#1F2937] mb-2">1. Acceptance of Terms</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed mb-4">By accessing or using DeaLo, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
              <h3 className="font-bold text-[#1F2937] mb-2">2. Use of Service</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">You may use our service for personal, non-commercial purposes only...</p>
            </div>
          </div>
        )}

        <style>{`@keyframes slide-in { from { transform: translateX(100%); } to { transform: translateX(0); } } .animate-slide-in { animation: slide-in 0.3s ease-out; }`}</style>
      </div>
    );
  }

  if (showSettings) {
    return (
      <div className="min-h-screen bg-white pb-24">
        <div className="px-6 pt-6 pb-4 flex items-center gap-3">
          <button onClick={() => setShowSettings(false)}><ArrowLeft className="w-5 h-5 text-[#1F2937]" /></button>
          <h1 className="text-base font-bold text-[#1F2937]">Settings</h1>
        </div>
        <div className="px-6">
          <div className="grid grid-cols-2 gap-3 mb-8">
            {[
              { icon: User, label: 'Account', desc: 'Profile & Email', color: '#00A36C' },
              { icon: Settings, label: 'Security', desc: 'Password', color: '#00A36C' },
              { icon: Bell, label: 'Notifications', desc: 'Alerts & Updates', color: '#1F2937' },
              { icon: Lock, label: 'Privacy', desc: 'Data & Sharing', color: '#1F2937' },
              { icon: HelpCircle, label: 'Help', desc: 'Support Center', color: '#1F2937' },
              { icon: FileText, label: 'Terms', desc: 'Legal & Privacy', color: '#1F2937' },
            ].map((item) => (
              <button key={item.label} onClick={() => setSettingsPage(item.label)} className="bg-[#F9FAFB] rounded-2xl p-4 text-left hover:bg-[#E5E7EB] transition-colors">
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
      <div className="px-6 pt-8 pb-6 bg-white border-b border-[#E5E7EB]">
        <div className="flex items-center justify-end mb-6">
          <button onClick={() => setShowSettings(true)} className="w-10 h-10 rounded-full bg-[#F9FAFB] flex items-center justify-center hover:bg-[#E5E7EB]">
            <Settings className="w-5 h-5 text-[#1F2937]" />
          </button>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-white border-2 border-[#E5E7EB] flex items-center justify-center shadow-sm mb-2">
            <User className="w-12 h-12 text-[#6B7280]" strokeWidth={2} />
          </div>
          <div className="bg-[#D6F5E9] text-[#00A36C] text-xs font-bold px-3 py-1 rounded-full mb-3">Free</div>
          <h2 className="text-xl font-bold text-[#1F2937] mb-1">{user?.full_name || 'ElishaH'}</h2>
          <p className="text-sm text-[#6B7280]">{user?.email || 'user@dealo.com'}</p>
        </div>
      </div>

      <div className="px-6 py-3 bg-white border-b border-[#E5E7EB]">
        <button onClick={() => navigate(createPageUrl("Achievements"))} className="flex items-center justify-between w-full mb-2">
          <h3 className="text-base font-bold text-[#1F2937]">Achievements</h3>
          <ChevronRight className="w-5 h-5 text-[#6B7280]" />
        </button>
        <div className="grid grid-cols-4 gap-2">
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div key={badge.id} className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-xl bg-white border-2 border-[#E5E7EB] flex items-center justify-center shadow-sm">
                  <Icon className="w-5 h-5 text-[#00A36C]" strokeWidth={2} />
                </div>
                <span className="text-[9px] font-semibold text-[#1F2937] text-center leading-tight">{badge.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-6 py-4 bg-white border-b border-[#E5E7EB]">
        <h3 className="text-base font-bold text-[#1F2937] mb-3">Personal Insights</h3>
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white border border-[#E5E7EB] rounded-xl p-3 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-[#D6F5E9] flex items-center justify-center mb-2"><Icon className="w-4 h-4 text-[#00A36C]" /></div>
                <p className="text-lg font-bold text-[#1F2937] mb-0.5">{stat.value}</p>
                <p className="text-[10px] text-[#6B7280] leading-tight">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="py-4 bg-white">
        <div className="px-6 flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-[#1F2937]">Recently Viewed</h3>
          <ChevronRight className="w-5 h-5 text-[#6B7280]" />
        </div>
        <div className="flex gap-3 overflow-x-scroll scrollbar-hide -mx-6 px-6">
          {recentlyViewed.map((item) => (
            <div key={item.id} className="flex-shrink-0 rounded-xl overflow-hidden shadow-sm relative" style={{ width: '140px', height: '100px' }}>
              <img src={item.image} alt="Product" className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm rounded-md px-1 py-0.5"><span className="text-[9px] font-bold text-white">{item.price}</span></div>
              <button className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-[#6B7280]/40 flex items-center justify-center"><Heart className="w-3 h-3 text-white" strokeWidth={2} /></button>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 py-6">
        <Button className="w-full bg-[#00A36C] text-white hover:bg-[#007E52] font-bold rounded-2xl h-14 text-base flex items-center justify-center gap-3">
          <div className="w-6 h-6 border-2 border-white rounded flex items-center justify-center"><Share2 className="w-3 h-3 text-white" /></div>
          Invite Friends
        </Button>
      </div>

      <div className="px-6 pb-8">
        <p className="text-center text-sm text-[#6B7280] opacity-30 font-semibold">DeaLo</p>
      </div>

      <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
    </div>
  );
}