import React, { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Camera, Plus, Tag, Loader2, Sparkles, Image as ImageIcon, Search, X, Check, Trash2 } from "lucide-react";
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
    <div className="min-h-screen bg-[#F3F4F6] pb-24">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex items-center justify-center">
        <h1 className="text-lg font-bold text-[#1F2937]">Compare</h1>
      </div>

      <div className="px-6 space-y-6">
        {/* Add Products Section */}
        <div>
          <h2 className="text-sm font-semibold text-[#6B7280] mb-3">Add Products</h2>
          <div className="flex gap-3">
            {/* Item 1 Tile */}
            <div className="flex-1">
              <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], 1)} ref={fileInput1Ref} className="hidden" />
              <div
                onClick={() => !item1 && setShowUploadOptions(1)}
                onMouseDown={() => item1 && setTimeout(() => handleLongPress(1), 500)}
                onTouchStart={() => item1 && setTimeout(() => handleLongPress(1), 500)}
                className={`w-full rounded-2xl flex items-center justify-center overflow-hidden cursor-pointer ${
                  item1 ? 'bg-white' : 'bg-white border-2 border-dashed border-[#D1D5DB]'
                }`}
                style={{ height: '140px' }}
              >
                {item1 ? (
                  <img src={item1.file_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Plus className="w-8 h-8 text-[#9CA3AF]" />
                )}
              </div>
              {item1 && <p className="text-xs font-semibold text-[#1F2937] mt-2 text-center">{item1.price}</p>}
            </div>

            {/* Item 2 Tile */}
            <div className="flex-1">
              <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], 2)} ref={fileInput2Ref} className="hidden" />
              <div
                onClick={() => !item2 && setShowUploadOptions(2)}
                onMouseDown={() => item2 && setTimeout(() => handleLongPress(2), 500)}
                onTouchStart={() => item2 && setTimeout(() => handleLongPress(2), 500)}
                className={`w-full rounded-2xl flex items-center justify-center overflow-hidden cursor-pointer ${
                  item2 ? 'bg-white' : 'bg-white border-2 border-dashed border-[#D1D5DB]'
                }`}
                style={{ height: '140px' }}
              >
                {item2 ? (
                  <img src={item2.file_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Plus className="w-8 h-8 text-[#9CA3AF]" />
                )}
              </div>
              {item2 && <p className="text-xs font-semibold text-[#1F2937] mt-2 text-center">{item2.price}</p>}
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB]">
          <h2 className="text-sm font-semibold text-[#6B7280] mb-4">Preferences</h2>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[#1F2937]">Price</span>
                <span className="text-xs text-[#6B7280]">{pricePreference[0] < 50 ? 'Lower' : 'Higher'}</span>
              </div>
              <Slider value={pricePreference} onValueChange={setPricePreference} max={100} step={1} className="[&_[role=slider]]:bg-[#00A36C] [&_[role=slider]]:border-[#00A36C]" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[#1F2937]">Quality</span>
                <span className="text-xs text-[#6B7280]">{qualityPreference[0] < 50 ? 'Lower' : 'Higher'}</span>
              </div>
              <Slider value={qualityPreference} onValueChange={setQualityPreference} max={100} step={1} className="[&_[role=slider]]:bg-[#00A36C] [&_[role=slider]]:border-[#00A36C]" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[#1F2937]">Brand</span>
                <span className="text-xs text-[#6B7280]">{brandPreference[0] < 50 ? 'Less Important' : 'More Important'}</span>
              </div>
              <Slider value={brandPreference} onValueChange={setBrandPreference} max={100} step={1} className="[&_[role=slider]]:bg-[#00A36C] [&_[role=slider]]:border-[#00A36C]" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[#1F2937]">Durability</span>
                <span className="text-xs text-[#6B7280]">{durabilityPreference[0] < 50 ? 'Lower' : 'Higher'}</span>
              </div>
              <Slider value={durabilityPreference} onValueChange={setDurabilityPreference} max={100} step={1} className="[&_[role=slider]]:bg-[#00A36C] [&_[role=slider]]:border-[#00A36C]" />
            </div>
          </div>
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

      {/* Upload Options Modal */}
      {showUploadOptions && (
        <div className="fixed inset-0 bg-black/40 z-50" onClick={() => setShowUploadOptions(null)}>
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-xl border border-[#E5E7EB] p-2 w-48" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => { navigate(createPageUrl("Snap")); setShowUploadOptions(null); }} className="flex items-center gap-2 px-4 py-2 hover:bg-[#F9FAFB] rounded-xl w-full text-left">
              <Camera className="w-4 h-4 text-[#6B7280]" /><span className="text-sm text-[#1F2937]">Camera</span>
            </button>
            <button onClick={() => { (showUploadOptions === 1 ? fileInput1Ref : fileInput2Ref).current?.click(); setShowUploadOptions(null); }} className="flex items-center gap-2 px-4 py-2 hover:bg-[#F9FAFB] rounded-xl w-full text-left">
              <ImageIcon className="w-4 h-4 text-[#6B7280]" /><span className="text-sm text-[#1F2937]">Upload Photo</span>
            </button>
            <button onClick={() => { navigate(createPageUrl("SearchProducts"), { state: { slot: showUploadOptions === 1 ? 'item1' : 'item2', item1, item2 } }); setShowUploadOptions(null); }} className="flex items-center gap-2 px-4 py-2 hover:bg-[#F9FAFB] rounded-xl w-full text-left">
              <Search className="w-4 h-4 text-[#6B7280]" /><span className="text-sm text-[#1F2937]">Search Products</span>
            </button>
          </div>
        </div>
      )}

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