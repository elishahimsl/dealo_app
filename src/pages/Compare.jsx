import React, { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Camera, Plus, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { Slider } from "@/components/ui/slider";

export default function Compare() {
  const navigate = useNavigate();
  const [item1, setItem1] = useState(null);
  const [item2, setItem2] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
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
        
        Provide: winner (1 or 2), detailed explanation (3 sentences), scores for each criterion.`,
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

      setResult(result);
    } catch (error) {
      console.error("Error analyzing:", error);
    }
    setAnalyzing(false);
  };

  if (result) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] pb-24">
        <div className="px-6 pt-8 pb-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => { setResult(null); setItem1(null); setItem2(null); }}
            className="rounded-full mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-[#1F2937]">Comparison Results</h1>
        </div>

        <div className="px-6 space-y-6">
          {/* Winner Announcement */}
          <div className="bg-gradient-to-r from-[#00A36C] to-[#007E52] rounded-3xl p-6 text-center">
            <Sparkles className="w-12 h-12 text-white mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-white mb-2">
              {result.winner === 1 ? item1.title : item2.title}
            </h2>
            <p className="text-white/90 text-sm">Winner based on your preferences</p>
          </div>

          {/* Explanation */}
          <div className="bg-white rounded-3xl p-6 border border-[#E5E7EB]">
            <h3 className="font-bold text-[#1F2937] mb-3">Why?</h3>
            <p className="text-[#6B7280] text-sm leading-relaxed">{result.explanation}</p>
          </div>

          <Button
            onClick={() => navigate(createPageUrl("Home"))}
            className="w-full h-12 rounded-2xl bg-[#00A36C] hover:bg-[#007E52]"
          >
            Done
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(createPageUrl("Home"))}
          className="rounded-full mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold text-[#1F2937]" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Compare
        </h1>
      </div>

      <div className="px-6 space-y-6">
        {/* Item Slots */}
        <div className="bg-white rounded-3xl p-6 border border-[#E5E7EB]">
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Item 1 */}
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], 1)}
                ref={fileInput1Ref}
                className="hidden"
              />
              <button
                onClick={() => fileInput1Ref.current?.click()}
                className={`w-full aspect-square rounded-2xl border-2 border-dashed ${
                  item1 ? 'border-[#00A36C]' : 'border-[#E5E7EB]'
                } flex items-center justify-center overflow-hidden`}
              >
                {item1 ? (
                  <img src={item1.file_url} alt="Item 1" className="w-full h-full object-cover" />
                ) : (
                  <Plus className="w-12 h-12 text-[#6B7280]" />
                )}
              </button>
              {item1 && (
                <p className="text-sm font-semibold text-[#1F2937] mt-2 text-center">{item1.price}</p>
              )}
            </div>

            {/* VS Divider */}
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-[#00A36C] flex items-center justify-center">
                <span className="text-white font-bold text-lg">VS</span>
              </div>
            </div>

            {/* Item 2 */}
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], 2)}
                ref={fileInput2Ref}
                className="hidden"
              />
              <button
                onClick={() => fileInput2Ref.current?.click()}
                className={`w-full aspect-square rounded-2xl border-2 border-dashed ${
                  item2 ? 'border-[#00A36C]' : 'border-[#E5E7EB]'
                } flex items-center justify-center overflow-hidden`}
              >
                {item2 ? (
                  <img src={item2.file_url} alt="Item 2" className="w-full h-full object-cover" />
                ) : (
                  <Plus className="w-12 h-12 text-[#6B7280]" />
                )}
              </button>
              {item2 && (
                <p className="text-sm font-semibold text-[#1F2937] mt-2 text-center">{item2.price}</p>
              )}
            </div>
          </div>

          {/* Analyze Button */}
          <Button
            onClick={handleAnalyze}
            disabled={!item1 || !item2 || analyzing}
            className="w-full h-12 rounded-2xl bg-[#00A36C] hover:bg-[#007E52] disabled:opacity-50"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze'
            )}
          </Button>
        </div>

        {/* Your Preferences */}
        <div className="bg-white rounded-3xl p-6 border border-[#E5E7EB]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#1F2937]">Your Preferences</h3>
            <span className="text-xs text-[#6B7280]">Set what matters to you</span>
          </div>

          <div className="space-y-6">
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