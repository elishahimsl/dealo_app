import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Tag, HelpCircle, Lightbulb, Clock, Heart, Camera, Plus, ChevronRight } from "lucide-react";

export default function BestMatch() {
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState("smart-match");
  const [showInfoSheet, setShowInfoSheet] = useState(false);

  const modes = [
    { id: "style", label: "Style" },
    { id: "deals", label: "Deals" },
    { id: "smart-match", label: "Smart Match" },
  ];

  const actionBubbles = [
    { id: "inspo", icon: Lightbulb, label: "Inspo" },
    { id: "recents", icon: Clock, label: "Recents" },
    { id: "saved", icon: Heart, label: "Saved" },
  ];

  const smartSuggestions = [
    { id: 1, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300", tag: "Popular in your style", price: "$89.99" },
    { id: 2, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300", tag: "Recently discounted", price: "$79.99" },
    { id: 3, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300", tag: "Similar to last search", price: "$199.99" },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      {/* Top Label */}
      <div className="px-6 pt-4 pb-2">
        <p className="text-[10px] text-[#9CA3AF] text-center">Best Match Tool – Revamped</p>
      </div>

      {/* Header */}
      <div className="px-6 pb-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="relative flex items-center justify-center group">
          <Tag className="w-5 h-5 text-[#00A36C] transform -rotate-45 group-hover:rotate-0 transition-transform duration-300 group-hover:scale-110" />
        </button>
        
        <h1 className="text-lg font-bold text-[#1F2937]" style={{ fontFamily: 'Inter, sans-serif' }}>
          DeaLo <span className="text-[#00A36C]">AI</span>
        </h1>
        
        <button onClick={() => setShowInfoSheet(true)} className="w-7 h-7 rounded-full border border-[#E5E7EB] flex items-center justify-center">
          <HelpCircle className="w-4 h-4 text-[#6B7280]" />
        </button>
      </div>

      {/* Hero Tagline */}
      <div className="px-6 py-12 text-center">
        <h2 className="text-2xl font-bold text-[#1F2937] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          Find Your
        </h2>
        <h2 className="text-2xl font-bold text-[#1F2937]" style={{ fontFamily: 'Inter, sans-serif' }}>
          Best Match For <span className="text-[#00A36C]">Less</span>
        </h2>
      </div>

      {/* Mode Selector */}
      <div className="px-6 mb-8">
        <div className="bg-[#E5E7EB] rounded-full p-1 flex">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
              className={`flex-1 py-2 rounded-full text-xs font-semibold transition-all ${
                activeMode === mode.id 
                  ? 'bg-white text-[#1F2937] shadow-sm' 
                  : 'text-[#6B7280]'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Smart Suggestions (shown after some usage) */}
      <div className="px-6 mb-6">
        <h3 className="text-xs font-semibold text-[#6B7280] mb-3">Smart Suggestions For You</h3>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {smartSuggestions.map((item) => (
            <div key={item.id} className="flex-shrink-0 rounded-2xl overflow-hidden bg-white border border-[#E5E7EB]" style={{ width: '140px' }}>
              <div className="aspect-square relative">
                <img src={item.image} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="p-2">
                <p className="text-[9px] text-[#00A36C] font-medium mb-1">{item.tag}</p>
                <p className="text-xs font-bold text-[#1F2937]">{item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Bubbles */}
      <div className="px-6 mb-4">
        <div className="flex justify-center gap-4">
          {actionBubbles.map((bubble) => {
            const Icon = bubble.icon;
            return (
              <button 
                key={bubble.id}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E5E7EB]"
              >
                <Icon className="w-4 h-4 text-[#6B7280]" />
                <span className="text-xs font-medium text-[#1F2937]">{bubble.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Input Bar */}
      <div className="px-6">
        <button 
          onClick={() => navigate(createPageUrl("SearchProducts"))}
          className="w-full bg-white rounded-2xl border border-[#E5E7EB] p-4 flex items-center gap-3 shadow-sm"
        >
          <Plus className="w-5 h-5 text-[#00A36C]" />
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-[#1F2937]">Find Matches</p>
            <p className="text-[10px] text-[#9CA3AF]">Paste a link, upload a photo, or describe the item.</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center">
            <Camera className="w-5 h-5 text-[#6B7280]" />
          </div>
        </button>
      </div>

      {/* Info Sheet Modal */}
      {showInfoSheet && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowInfoSheet(false)}>
          <div className="bg-white w-full rounded-t-3xl p-6 pb-10 max-h-[70vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-1 bg-[#E5E7EB] rounded-full mx-auto mb-6" />
            
            <h3 className="text-lg font-bold text-[#1F2937] mb-4">How DeaLo AI Works</h3>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#00A36C]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">1</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1F2937]">Upload or describe what you want</p>
                  <p className="text-xs text-[#6B7280]">Paste a link, take a photo, or type a description of the item you're looking for.</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#00A36C]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">2</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1F2937]">AI finds the best matches</p>
                  <p className="text-xs text-[#6B7280]">Our AI searches across thousands of stores to find similar items at better prices.</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#00A36C]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">3</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1F2937]">Compare and save</p>
                  <p className="text-xs text-[#6B7280]">Review your matches, compare prices, and find the perfect deal.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-[#F3F4F6] rounded-2xl">
              <p className="text-xs text-[#6B7280]">
                <span className="font-semibold text-[#1F2937]">Privacy:</span> Your searches are private and secure. We never share your data with third parties.
              </p>
            </div>

            <button 
              onClick={() => setShowInfoSheet(false)}
              className="w-full mt-6 py-3 rounded-2xl bg-[#00A36C] text-white font-semibold"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}