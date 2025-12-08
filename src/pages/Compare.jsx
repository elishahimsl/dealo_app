import React, { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Camera, Plus, Tag, Loader2, Sparkles, Image as ImageIcon, Search, X, Check, Trash2, ChevronRight } from "lucide-react";
import { Slider } from "@/components/ui/slider";

export default function Compare() {
  const navigate = useNavigate();
  const location = useLocation();
  const [item1, setItem1] = useState(location.state?.item1 || null);
  const [item2, setItem2] = useState(location.state?.item2 || null);
  const [analyzing, setAnalyzing] = useState(false);
  const [showUploadOptions, setShowUploadOptions] = useState(null); // null, 1, or 2
  const [deleteSlot, setDeleteSlot] = useState(null);
  const [shopSenseApplied, setShopSenseApplied] = useState(location.state?.shopSenseApplied || false);
  const fileInput1Ref = useRef(null);
  const fileInput2Ref = useRef(null);

  const [pricePreference, setPricePreference] = useState(location.state?.preferences?.price || [50]);
  const [qualityPreference, setQualityPreference] = useState(location.state?.preferences?.quality || [50]);
  const [brandPreference, setBrandPreference] = useState(location.state?.preferences?.brand || [50]);
  const [durabilityPreference, setDurabilityPreference] = useState(location.state?.preferences?.durability || [50]);

  const handleFileSelect = async (file, itemNumber) => {
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this product briefly. Provide: title, price, image URL from Unsplash of the product type.`,
        file_urls: file_url,
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            price: { type: "string" },
            image_url: { type: "string" }
          }
        }
      });

      const itemData = { ...result, file_url: result.image_url || file_url };
      
      if (itemNumber === 1) setItem1(itemData);
      else setItem2(itemData);
      setShowUploadOptions(null);
    } catch (error) {
      console.error("Error processing file:", error);
    }
  };

  const handleAnalyze = () => {
    if (!item1 || !item2) return;
    navigate(createPageUrl("ShopSense"), {
      state: { item1, item2, preferences: { price: pricePreference, quality: qualityPreference, brand: brandPreference, durability: durabilityPreference } }
    });
  };

  const handleDeleteItem = (slot) => {
    if (slot === 1) setItem1(null);
    else setItem2(null);
    setDeleteSlot(null);
  };

  const handleLongPress = (slot) => {
    if ((slot === 1 && item1) || (slot === 2 && item2)) {
      setDeleteSlot(slot);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex items-center justify-center">
        <h1 className="text-base font-normal text-[#1F2937]">Compare</h1>
      </div>

      <div className="px-6 space-y-6">
        {/* Main Comparison Box */}
        <div className="bg-[#2D3748] rounded-3xl p-5 shadow-sm">
          {/* Add Products Label */}
          <h2 className="text-xs font-medium text-white mb-3">Add Products</h2>
          
          {/* Product Tiles */}
          <div className="flex gap-3 mb-4">
            {/* Item 1 Tile */}
            <div className="flex-1">
              <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], 1)} ref={fileInput1Ref} className="hidden" />
              <div
                onClick={() => !item1 && setShowUploadOptions(1)}
                onMouseDown={() => item1 && setTimeout(() => handleLongPress(1), 500)}
                onTouchStart={() => item1 && setTimeout(() => handleLongPress(1), 500)}
                className={`w-full rounded-2xl flex items-center justify-center overflow-hidden cursor-pointer ${
                  item1 ? 'bg-[#3D4856]' : 'bg-[#3D4856] border-2 border-[#4A5568]'
                }`}
                style={{ height: '140px' }}
              >
                {item1 ? (
                  <img src={item1.file_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Plus className="w-8 h-8 text-[#00A36C]" />
                )}
              </div>
              {item1 && <p className="text-xs font-semibold text-white mt-2 text-center">{item1.price}</p>}
            </div>

            {/* Item 2 Tile */}
            <div className="flex-1">
              <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], 2)} ref={fileInput2Ref} className="hidden" />
              <div
                onClick={() => !item2 && setShowUploadOptions(2)}
                onMouseDown={() => item2 && setTimeout(() => handleLongPress(2), 500)}
                onTouchStart={() => item2 && setTimeout(() => handleLongPress(2), 500)}
                className={`w-full rounded-2xl flex items-center justify-center overflow-hidden cursor-pointer ${
                  item2 ? 'bg-[#3D4856]' : 'bg-[#3D4856] border-2 border-[#4A5568]'
                }`}
                style={{ height: '140px' }}
              >
                {item2 ? (
                  <img src={item2.file_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Plus className="w-8 h-8 text-[#00A36C]" />
                )}
              </div>
              {item2 && <p className="text-xs font-semibold text-white mt-2 text-center">{item2.price}</p>}
            </div>
          </div>

          {/* Preferences Row */}
          <button 
            onClick={() => navigate(createPageUrl("Preferences"), { state: { item1, item2, preferences: { price: pricePreference, quality: qualityPreference, brand: brandPreference, durability: durabilityPreference } } })}
            className="w-full flex items-center justify-between hover:bg-[#3D4856] rounded-xl transition-colors"
          >
            <span className="text-base font-semibold text-white">Preferences</span>
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Info Text */}
        <div className="px-2">
          <div className="flex items-start gap-2 mb-1">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#00A36C] to-[#007E52] flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-[#1F2937]">Add two products to compare</h3>
          </div>
          <p className="text-sm text-[#6B7280] ml-8">specs, price, reviews, and AI recommendations</p>
        </div>

        {/* Analyze Button */}
        <Button 
          onClick={handleAnalyze} 
          disabled={!item1 || !item2 || analyzing} 
          className="w-full h-12 rounded-2xl bg-[#00A36C] hover:bg-[#007E52] disabled:opacity-50 disabled:bg-[#D1D5DB] text-white font-semibold"
        >
          {analyzing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Analyzing...</> : 'Analyze'}
        </Button>
      </div>

      {/* Bottom Sheet for Add Product Options */}
      {showUploadOptions && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowUploadOptions(null)}>
          <div 
            className="bg-white rounded-t-3xl w-full pb-8 pt-4 animate-slide-up" 
            style={{ maxHeight: '66vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag Handle */}
            <div className="flex justify-center mb-4">
              <div className="w-10 h-1 bg-[#D1D5DB] rounded-full" />
            </div>

            {/* Options */}
            <div className="px-6 space-y-2">
              <button 
                onClick={() => { navigate(createPageUrl("Snap") + `?from=Compare&slot=${showUploadOptions}`); setShowUploadOptions(null); }} 
                className="w-full flex items-center justify-between py-4 hover:bg-[#F9FAFB] rounded-xl transition-colors px-4"
              >
                <span className="text-base text-[#1F2937]">Take Photo</span>
                <svg className="w-5 h-5 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button 
                onClick={() => { navigate(createPageUrl("SearchProducts"), { state: { slot: showUploadOptions === 1 ? 'item1' : 'item2', item1, item2 } }); setShowUploadOptions(null); }} 
                className="w-full flex items-center justify-between py-4 hover:bg-[#F9FAFB] rounded-xl transition-colors px-4"
              >
                <span className="text-base text-[#1F2937]">Search Product</span>
                <svg className="w-5 h-5 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button 
                onClick={() => { navigate(createPageUrl("MyCart")); setShowUploadOptions(null); }} 
                className="w-full flex items-center justify-between py-4 hover:bg-[#F9FAFB] rounded-xl transition-colors px-4"
              >
                <span className="text-base text-[#1F2937]">Choose From Saved Items</span>
                <svg className="w-5 h-5 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button 
                onClick={() => { navigate(createPageUrl("ShopSenseTuner"), { state: { item1, item2, preferences: { price: pricePreference, quality: qualityPreference, brand: brandPreference, durability: durabilityPreference } } }); setShowUploadOptions(null); }} 
                className="w-full flex items-center justify-between py-4 hover:bg-[#F9FAFB] rounded-xl transition-colors px-4"
              >
                <span className="text-base text-[#1F2937]">Shop Sense Smart Pick</span>
                <svg className="w-5 h-5 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button 
                onClick={() => { alert("Paste product URL (feature coming soon)"); setShowUploadOptions(null); }} 
                className="w-full flex items-center justify-between py-4 hover:bg-[#F9FAFB] rounded-xl transition-colors px-4"
              >
                <span className="text-base text-[#1F2937]">Import From Link</span>
                <svg className="w-5 h-5 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>

      {/* Delete Slot Modal */}
      {deleteSlot && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setDeleteSlot(null)}>
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <div className="w-32 h-32 rounded-2xl overflow-hidden bg-[#E5E7EB] mb-3 mx-auto" style={{ transform: deleteSlot === 1 ? 'perspective(800px) rotateY(8deg) rotateZ(2deg)' : 'perspective(800px) rotateY(-8deg) rotateZ(-2deg)' }}>
              <img src={deleteSlot === 1 ? item1?.file_url : item2?.file_url} alt="" className="w-full h-full object-cover" />
            </div>
            <button onClick={() => handleDeleteItem(deleteSlot)} className="w-16 mx-auto bg-red-500 text-white py-1.5 rounded-lg text-xs font-semibold hover:bg-red-600 transition-colors flex items-center justify-center">
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}