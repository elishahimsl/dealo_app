import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tag } from "lucide-react";

export default function FollowingList() {
  const navigate = useNavigate();
  const [unfollowed, setUnfollowed] = useState([]);

  const followedStores = [
    { id: 1, name: "Nike", logo: "https://logo.clearbit.com/nike.com" },
    { id: 2, name: "Adidas", logo: "https://logo.clearbit.com/adidas.com" },
    { id: 3, name: "Target", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Target_logo.svg/1200px-Target_logo.svg.png" },
    { id: 4, name: "Amazon", logo: "https://logo.clearbit.com/amazon.com" },
    { id: 5, name: "Best Buy", logo: "https://logo.clearbit.com/bestbuy.com" },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex items-center">
        <button onClick={() => navigate(-1)} className="mr-3 group">
          <Tag className="w-5 h-5 text-[#00A36C] transform -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
        </button>
        <h1 className="text-base font-semibold text-[#1F2937]">Following List</h1>
      </div>

      {/* List */}
      <div className="px-6 space-y-3">
        {followedStores.filter(s => !unfollowed.includes(s.id)).map((store) => (
          <div key={store.id} className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F3F4F6] flex items-center justify-center p-1">
                <img src={store.logo} alt={store.name} className="w-full h-full object-contain" />
              </div>
              <span className="text-sm font-medium text-[#1F2937]">{store.name}</span>
            </div>
            <button 
              onClick={() => setUnfollowed(prev => [...prev, store.id])}
              className="px-4 py-1.5 rounded-lg bg-[#F3F4F6] text-xs font-medium text-[#6B7280]"
            >
              Following
            </button>
          </div>
        ))}
        
        {followedStores.filter(s => unfollowed.includes(s.id)).map((store) => (
          <div key={store.id} className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm opacity-60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F3F4F6] flex items-center justify-center p-1">
                <img src={store.logo} alt={store.name} className="w-full h-full object-contain" />
              </div>
              <span className="text-sm font-medium text-[#1F2937]">{store.name}</span>
            </div>
            <button 
              onClick={() => setUnfollowed(prev => prev.filter(id => id !== store.id))}
              className="px-4 py-1.5 rounded-lg bg-[#1F2937] text-xs font-medium text-white"
            >
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}