import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Tag, HelpCircle, Lightbulb, Clock, Heart, Camera, Plus } from "lucide-react";

export default function BestMatch() {
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState("style");
  const [showInfoSheet, setShowInfoSheet] = useState(false);
  const [inputText, setInputText] = useState("");

  const actionBubbles = [
    { id: "inspo", icon: Lightbulb, label: "Inspo" },
    { id: "recents", icon: Clock, label: "Recents" },
    { id: "saved", icon: Heart, label: "Saved" },
  ];

  const suggestions = [
    { id: 1, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300", brand: "Nike", product: "Air Max 90", price: "$89.99" },
    { id: 2, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300", brand: "Sony", product: "WH-1000XM5", price: "$279.99" },
    { id: 3, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300", brand: "Apple", product: "Watch Series 9", price: "$399.99" },
    { id: 4, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300", brand: "Nike", product: "Tech Hoodie", price: "$89.99" },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24 flex flex-col">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex items-center justify-between">
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

      {/* Mode Toggle - Style / Deals as tabs */}
      <div className="px-6 mb-6">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setActiveMode("style")}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
              activeMode === "style" 
                ? 'bg-[#00A36C] text-white' 
                : 'bg-white text-[#6B7280] border border-[#E5E7EB]'
            }`}
          >
            Style
          </button>
          <button
            onClick={() => setActiveMode("deals")}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
              activeMode === "deals" 
                ? 'bg-[#00A36C] text-white' 
                : 'bg-white text-[#6B7280] border border-[#E5E7EB]'
            }`}
          >
            Deals
          </button>
        </div>
      </div>

      {/* Action Bubbles */}
      <div className="px-6 mb-6">
        <div className="flex justify-center gap-3">
          {actionBubbles.map((bubble) => {
            const Icon = bubble.icon;
            return (
              <button 
                key={bubble.id}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E5E7EB] shadow-sm"
              >
                <Icon className="w-4 h-4 text-[#6B7280]" />
                <span className="text-xs font-medium text-[#1F2937]">{bubble.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Suggestions */}
      <div className="flex-1 px-6 mb-6">
        <h3 className="text-sm font-bold text-[#1F2937] mb-3">Suggestions</h3>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6">
          {suggestions.map((item) => (
            <div key={item.id} className="flex-shrink-0" style={{ width: '140px' }}>
              {/* Image tile only */}
              <div className="aspect-square rounded-2xl overflow-hidden relative bg-[#F3F4F6] mb-2">
                <img src={item.image} alt="" className="w-full h-full object-cover" />
                {/* Price badge - green bg, white text */}
                <div className="absolute top-2 left-2 bg-[#00A36C] rounded px-2 py-0.5">
                  <span className="text-[10px] font-bold text-white">{item.price}</span>
                </div>
                {/* Heart */}
                <button className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-[#6B7280]/60 flex items-center justify-center">
                  <Heart className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
              {/* Text underneath - separate from tile */}
              <p className="text-[10px] font-medium text-[#6B7280]">{item.brand}</p>
              <p className="text-xs font-semibold text-[#1F2937]">{item.product}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Input Bar - Message style */}
      <div className="px-6 pb-6 mt-auto">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm flex items-center p-2 gap-2">
          <button className="w-10 h-10 rounded-xl bg-[#F3F4F6] flex items-center justify-center flex-shrink-0">
            <Plus className="w-5 h-5 text-[#6B7280]" />
          </button>
          <input
            type="text"
            placeholder="Find Matches"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 text-sm outline-none placeholder:text-[#9CA3AF] bg-transparent"
          />
          <button 
            onClick={() => navigate(createPageUrl("Snap"))}
            className="w-10 h-10 rounded-xl bg-[#00A36C] flex items-center justify-center flex-shrink-0"
          >
            <Camera className="w-5 h-5 text-white" />
          </button>
        </div>
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
                  <p className="text-sm font-semibold text-[#1F2937]">Describe or upload</p>
                  <p className="text-xs text-[#6B7280]">Type what you're looking for or snap a photo.</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#00A36C]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">2</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1F2937]">AI finds matches</p>
                  <p className="text-xs text-[#6B7280]">We search thousands of stores for the best options.</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#00A36C]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">3</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1F2937]">Compare and save</p>
                  <p className="text-xs text-[#6B7280]">Review matches and find the perfect deal.</p>
                </div>
              </div>
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