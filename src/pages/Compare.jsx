import React, { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Camera, Upload, ArrowLeft, Loader2, Sparkles, Star, DollarSign } from "lucide-react";

export default function Compare() {
  const navigate = useNavigate();
  const [item1, setItem1] = useState(null);
  const [item2, setItem2] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [comparison, setComparison] = useState(null);
  const fileInput1Ref = useRef(null);
  const fileInput2Ref = useRef(null);

  const { data: captures } = useQuery({
    queryKey: ['allCaptures'],
    queryFn: () => base44.entities.Capture.list('-created_date'),
    initialData: [],
  });

  const handleFileSelect = async (file, itemNumber) => {
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this item image briefly. Provide: title, brand, model, price estimate, key features (3-5 words each), and a durability rating (1-5 stars).`,
        file_urls: file_url,
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            brand: { type: "string" },
            model: { type: "string" },
            price: { type: "string" },
            features: { type: "array", items: { type: "string" } },
            durability_stars: { type: "number" }
          }
        }
      });

      const itemData = { file_url, ...result };
      
      if (itemNumber === 1) {
        setItem1(itemData);
      } else {
        setItem2(itemData);
      }
    } catch (error) {
      console.error("Error processing file:", error);
      alert("Failed to process image. Please try again.");
    }
  };

  const handleAnalyze = async () => {
    if (!item1 || !item2) return;

    setAnalyzing(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Compare these two items and provide:
        
        Item 1: ${item1.title} (${item1.brand || 'Unknown brand'})
        Features: ${item1.features?.join(', ') || 'N/A'}
        
        Item 2: ${item2.title} (${item2.brand || 'Unknown brand'})
        Features: ${item2.features?.join(', ') || 'N/A'}
        
        Provide: comparison verdict (which is better and why, 2-3 sentences), winner (1 or 2), and a detailed comparison table with features.`,
        response_json_schema: {
          type: "object",
          properties: {
            verdict: { type: "string" },
            winner: { type: "number" },
            comparison_points: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  feature: { type: "string" },
                  item1_value: { type: "string" },
                  item2_value: { type: "string" }
                }
              }
            }
          }
        }
      });

      setComparison(result);
    } catch (error) {
      console.error("Error analyzing:", error);
      alert("Failed to analyze. Please try again.");
    }
    setAnalyzing(false);
  };

  // Results View
  if (comparison) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-24">
        <div className="px-6 pt-12 pb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => {
              setComparison(null);
              setItem1(null);
              setItem2(null);
            }}
            className="rounded-full mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-[var(--smart-gray)]">⚖️ Comparison Results</h1>
        </div>

        <div className="px-6 space-y-6">
          {/* Winner Badge */}
          <div className={`rounded-3xl p-6 text-center ${
            comparison.winner === 1 ? 'bg-gradient-to-r from-blue-500 to-teal-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'
          }`}>
            <Sparkles className="w-12 h-12 text-white mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-white mb-2">
              {comparison.winner === 1 ? item1.title : item2.title}
            </h2>
            <p className="text-white/90 text-sm">Winner</p>
          </div>

          {/* AI Verdict */}
          <div className="bg-white rounded-3xl p-6 border border-[var(--border-gray)] soft-shadow">
            <h3 className="font-bold text-[var(--smart-gray)] mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[var(--electric-blue)]" />
              AI Verdict
            </h3>
            <p className="text-[var(--secondary-gray)] leading-relaxed">
              {comparison.verdict}
            </p>
          </div>

          {/* Comparison Table */}
          <div className="bg-white rounded-3xl p-6 border border-[var(--border-gray)] soft-shadow">
            <h3 className="font-bold text-[var(--smart-gray)] mb-4">Feature Comparison</h3>
            <div className="space-y-3">
              {comparison.comparison_points?.map((point, idx) => (
                <div key={idx} className="border-b border-[var(--border-gray)] pb-3 last:border-0">
                  <p className="text-sm font-semibold text-[var(--smart-gray)] mb-2">
                    {point.feature}
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-xl p-3">
                      <p className="text-xs text-blue-600 font-semibold mb-1">Item 1</p>
                      <p className="text-sm text-[var(--smart-gray)]">{point.item1_value}</p>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-3">
                      <p className="text-xs text-purple-600 font-semibold mb-1">Item 2</p>
                      <p className="text-sm text-[var(--smart-gray)]">{point.item2_value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={() => navigate(createPageUrl("Home"))}
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-[var(--electric-blue)] to-[var(--teal-accent)] font-semibold"
          >
            Done
          </Button>
        </div>
      </div>
    );
  }

  // Selection View
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="px-6 pt-12 pb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(createPageUrl("Home"))}
          className="rounded-full mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold text-[var(--smart-gray)] mb-2">⚖️ Compare Mode</h1>
        <p className="text-[var(--secondary-gray)] text-sm">Select or snap two items to compare</p>
      </div>

      <div className="px-6 pb-8 space-y-6">
        {/* Split Screen - Item 1 vs Item 2 */}
        <div className="grid grid-cols-2 gap-4">
          {/* Item 1 */}
          <div className="space-y-3">
            <h3 className="font-semibold text-[var(--smart-gray)] text-sm">Item 1</h3>
            <div className={`aspect-square rounded-3xl border-4 ${
              item1 ? 'border-blue-500' : 'border-dashed border-[var(--border-gray)]'
            } overflow-hidden bg-white flex items-center justify-center`}>
              {item1 ? (
                <img src={item1.file_url} alt="Item 1" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4">
                  <Upload className="w-8 h-8 text-[var(--secondary-gray)] mx-auto mb-2" />
                  <p className="text-xs text-[var(--secondary-gray)]">Add item</p>
                </div>
              )}
            </div>
            {item1 && (
              <div className="bg-white rounded-2xl p-3 soft-shadow">
                <p className="font-bold text-sm text-[var(--smart-gray)] line-clamp-1 mb-1">
                  {item1.title}
                </p>
                <p className="text-xs text-[var(--secondary-gray)]">{item1.brand}</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], 1)}
              ref={fileInput1Ref}
              className="hidden"
            />
            <Button
              onClick={() => fileInput1Ref.current?.click()}
              variant="outline"
              className="w-full rounded-2xl border-2 border-blue-500 text-blue-500 font-semibold"
            >
              <Camera className="w-4 h-4 mr-2" />
              {item1 ? 'Change' : 'Add Item 1'}
            </Button>
          </div>

          {/* Item 2 */}
          <div className="space-y-3">
            <h3 className="font-semibold text-[var(--smart-gray)] text-sm">Item 2</h3>
            <div className={`aspect-square rounded-3xl border-4 ${
              item2 ? 'border-purple-500' : 'border-dashed border-[var(--border-gray)]'
            } overflow-hidden bg-white flex items-center justify-center`}>
              {item2 ? (
                <img src={item2.file_url} alt="Item 2" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4">
                  <Upload className="w-8 h-8 text-[var(--secondary-gray)] mx-auto mb-2" />
                  <p className="text-xs text-[var(--secondary-gray)]">Add item</p>
                </div>
              )}
            </div>
            {item2 && (
              <div className="bg-white rounded-2xl p-3 soft-shadow">
                <p className="font-bold text-sm text-[var(--smart-gray)] line-clamp-1 mb-1">
                  {item2.title}
                </p>
                <p className="text-xs text-[var(--secondary-gray)]">{item2.brand}</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], 2)}
              ref={fileInput2Ref}
              className="hidden"
            />
            <Button
              onClick={() => fileInput2Ref.current?.click()}
              variant="outline"
              className="w-full rounded-2xl border-2 border-purple-500 text-purple-500 font-semibold"
            >
              <Camera className="w-4 h-4 mr-2" />
              {item2 ? 'Change' : 'Add Item 2'}
            </Button>
          </div>
        </div>

        {/* Pick from Library */}
        {captures.length > 0 && (
          <div>
            <h3 className="font-semibold text-[var(--smart-gray)] text-sm mb-3">
              Or pick from your library:
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {captures.slice(0, 8).map((capture) => (
                <button
                  key={capture.id}
                  onClick={() => {
                    const itemData = {
                      file_url: capture.file_url,
                      title: capture.title,
                      brand: capture.keywords?.[0] || 'Unknown',
                      features: capture.keywords || []
                    };
                    if (!item1) setItem1(itemData);
                    else if (!item2) setItem2(itemData);
                  }}
                  className="aspect-square rounded-xl overflow-hidden border-2 border-[var(--border-gray)] smooth-transition hover:border-[var(--electric-blue)]"
                >
                  <img 
                    src={capture.file_url} 
                    alt={capture.title}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Analyze Button */}
        <Button
          onClick={handleAnalyze}
          disabled={!item1 || !item2 || analyzing}
          className="w-full h-14 rounded-2xl bg-gradient-to-r from-[var(--electric-blue)] to-[var(--teal-accent)] font-bold text-lg disabled:opacity-50"
        >
          {analyzing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Analyze & Compare
            </>
          )}
        </Button>
      </div>
    </div>
  );
}