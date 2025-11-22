import React, { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Camera, Plus, ArrowLeft, Loader2, Sparkles, Image as ImageIcon, Search } from "lucide-react";
import { Slider } from "@/components/ui/slider";

export default function Compare() {
  const navigate = useNavigate();
  const [item1, setItem1] = useState(null);
  const [item2, setItem2] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [showUploadOptions, setShowUploadOptions] = useState(null);
  const fileInput1Ref = useRef(null);
  const fileInput2Ref = useRef(null);

  // User preferences
  const [pricePreference, setPricePreference] = useState([50]);
  const [qualityPreference, setQualityPreference] = useState([50]);
  const [brandPreference, setBrandPreference] = useState([50]);
  const [durabilityPreference, setDurabilityPreference] = useState([50]);

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
      
      if (itemNumber === 1) {
        setItem1(itemData);
      } else {
        setItem2(itemData);
      }
      setShowUploadOptions(null);
    } catch (error) {
      console.error("Error processing file:", error);
    }
  };

  const handleAnalyze = async () => {
    if (!item1 || !item2) return;

    setAnalyzing(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Compare these two products based on user preferences:
        
        Item 1: ${item1.title} (${item1.price})
        Item 2: ${item2.title} (${item2.price})
        
        User Preferences:
        - Price importance: ${pricePreference[0]}%
        - Quality importance: ${qualityPreference[0]}%
        - Brand importance: ${brandPreference[0]}%
        - Durability importance: ${durabilityPreference[0]}%
        
        Provide: winner (1 or 2), detailed explanation (3 sentences), scores for each criterion (0-100).`,
        response_json_schema: {
          type: "object",
          properties: {
            winner: { type: "number" },
            explanation: { type: "string" },
            item1_scores: {
              type: "object",
              properties: {
                price: { type: "number" },
                quality: { type: "number" },
                brand: { type: "number" },
                durability: { type: "number" }
              }
            },
            item2_scores: {
              type: "object",
              properties: {
                price: { type: "number" },
                quality: { type: "number" },
                brand: { type: "number" },
                durability: { type: "number" }
              }
            }
          }
        }
      });

      navigate(createPageUrl("ComparisonResults"), {
        state: {
          item1,
          item2,
          result,
          preferences: {
            price: pricePreference[0],
            quality: qualityPreference[0],
            brand: brandPreference[0],
            durability: durabilityPreference[0]
          }
        }
      });
    } catch (error) {
      console.error("Error analyzing:", error);
    }
    setAnalyzing(false);
  };



  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header - Centered and at Top */}
      <div className="px-6 pt-4 pb-2 text-center relative">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(createPageUrl("Home"))}
          className="absolute left-6 top-4 w-8 h-8 rounded-full"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-sm font-bold text-[#1F2937]" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Compare
        </h1>
      </div>

      <div className="px-6 space-y-4">
        {/* Comparison Area - Wider and Shorter */}
        <div className="bg-white rounded-3xl p-6 border border-[#E5E7EB] relative">
          <div className="flex items-center justify-center gap-8">
            {/* Item 1 */}
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], 1)}
                ref={fileInput1Ref}
                className="hidden"
              />
              <div
                className={`w-full rounded-2xl bg-[#E5E7EB] flex items-center justify-center overflow-hidden transition-all ${
                  item1 ? '' : 'hover:bg-[#D1D5DB]'
                }`}
                style={{ 
                  height: '140px',
                  transform: 'perspective(800px) rotateY(8deg) rotateZ(2deg)'
                }}
              >
                {item1 ? (
                  <img src={item1.file_url} alt="" className="w-full h-full object-cover" />
                ) : null}
              </div>
              {item1 && (
                <p className="text-xs font-semibold text-[#1F2937] mt-2 text-center">{item1.price}</p>
              )}
            </div>

            {/* Item 2 */}
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], 2)}
                ref={fileInput2Ref}
                className="hidden"
              />
              <div
                className={`w-full rounded-2xl bg-[#E5E7EB] flex items-center justify-center overflow-hidden transition-all ${
                  item2 ? '' : 'hover:bg-[#D1D5DB]'
                }`}
                style={{ 
                  height: '140px',
                  transform: 'perspective(800px) rotateY(-8deg) rotateZ(-2deg)'
                }}
              >
                {item2 ? (
                  <img src={item2.file_url} alt="" className="w-full h-full object-cover" />
                ) : null}
              </div>
              {item2 && (
                <p className="text-xs font-semibold text-[#1F2937] mt-2 text-center">{item2.price}</p>
              )}
            </div>
          </div>

          {/* VS Badge - Bottom Center, smaller */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
            <div className="w-10 h-10 rounded-full bg-[#00A36C] flex items-center justify-center shadow-lg border-2 border-white">
              <span className="text-white font-bold text-xs">VS</span>
            </div>
          </div>

          {/* Plus Button - Bottom Right in Box */}
          <button
            onClick={() => setShowUploadOptions(!showUploadOptions)}
            className="absolute bottom-3 right-3 w-8 h-8 rounded-lg bg-[#E5E7EB] flex items-center justify-center hover:bg-[#D1D5DB] transition-colors"
          >
            <Plus className="w-5 h-5 text-[#6B7280]" />
          </button>

          {/* Upload Options Dropdown */}
          {showUploadOptions && (
            <div className="absolute bottom-14 right-3 bg-white rounded-2xl shadow-lg border border-[#E5E7EB] p-2 z-10">
              <button
                onClick={() => fileInput1Ref.current?.click()}
                className="flex items-center gap-2 px-4 py-2 hover:bg-[#F9FAFB] rounded-xl w-full text-left"
              >
                <Camera className="w-4 h-4 text-[#6B7280]" />
                <span className="text-sm text-[#1F2937]">Camera</span>
              </button>
              <button
                onClick={() => fileInput1Ref.current?.click()}
                className="flex items-center gap-2 px-4 py-2 hover:bg-[#F9FAFB] rounded-xl w-full text-left"
              >
                <ImageIcon className="w-4 h-4 text-[#6B7280]" />
                <span className="text-sm text-[#1F2937]">Upload Photo</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 hover:bg-[#F9FAFB] rounded-xl w-full text-left">
                <Sparkles className="w-4 h-4 text-[#6B7280]" />
                <span className="text-sm text-[#1F2937]">Search Products</span>
              </button>
            </div>
          )}
        </div>

        {/* Analyze Button - Same width as Shop Sense */}
        <div className="flex justify-center">
          <Button
            onClick={handleAnalyze}
            disabled={!item1 || !item2 || analyzing}
            className="h-8 rounded-full bg-[#00A36C] hover:bg-[#007E52] disabled:opacity-50 text-xs px-6"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze'
            )}
          </Button>
        </div>

        {/* Your Preferences - Outside */}
        <div className="pt-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-[#1F2937] text-base">Your Preferences</h3>
              <p className="text-xs text-[#6B7280]">Set what matters to you</p>
            </div>
            <Button
              variant="outline"
              className="rounded-full h-8 px-4 border-[#00A36C] text-[#00A36C] hover:bg-[#00A36C] hover:text-white text-xs flex items-center gap-2"
            >
              <Sparkles className="w-3 h-3" />
              Shop Sense
            </Button>
          </div>

          <div className="space-y-4">
            {/* Price */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-[#1F2937]">Price</span>
                <span className="text-xs text-[#6B7280]">{pricePreference[0] < 50 ? 'Least' : 'Most'}</span>
              </div>
              <Slider 
                value={pricePreference} 
                onValueChange={setPricePreference} 
                max={100} 
                step={1}
                className="[&_[role=slider]]:bg-[#00A36C] [&_[role=slider]]:border-[#00A36C]"
              />
            </div>

            {/* Quality */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-[#1F2937]">Quality</span>
                <span className="text-xs text-[#6B7280]">{qualityPreference[0] < 50 ? 'Least' : 'Most'}</span>
              </div>
              <Slider 
                value={qualityPreference} 
                onValueChange={setQualityPreference} 
                max={100} 
                step={1}
                className="[&_[role=slider]]:bg-[#00A36C] [&_[role=slider]]:border-[#00A36C]"
              />
            </div>

            {/* Brand */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-[#1F2937]">Brand</span>
                <span className="text-xs text-[#6B7280]">{brandPreference[0] < 50 ? 'Least' : 'Most'}</span>
              </div>
              <Slider 
                value={brandPreference} 
                onValueChange={setBrandPreference} 
                max={100} 
                step={1}
                className="[&_[role=slider]]:bg-[#00A36C] [&_[role=slider]]:border-[#00A36C]"
              />
            </div>

            {/* Durability */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-[#1F2937]">Durability</span>
                <span className="text-xs text-[#6B7280]">{durabilityPreference[0] < 50 ? 'Least' : 'Most'}</span>
              </div>
              <Slider 
                value={durabilityPreference} 
                onValueChange={setDurabilityPreference} 
                max={100} 
                step={1}
                className="[&_[role=slider]]:bg-[#00A36C] [&_[role=slider]]:border-[#00A36C]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}