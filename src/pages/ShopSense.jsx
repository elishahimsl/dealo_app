import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { X, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

export default function ShopSense() {
  const navigate = useNavigate();
  const location = useLocation();
  const { item1, item2 } = location.state || {};

  const [selectedChips, setSelectedChips] = useState([]);
  const [durability, setDurability] = useState([50]);
  const [brandImportance, setBrandImportance] = useState([50]);
  const [priceSensitivity, setPriceSensitivity] = useState([50]);
  const [sustainability, setSustainability] = useState([50]);
  const [maintenance, setMaintenance] = useState([50]);
  const [design, setDesign] = useState([50]);
  const [savePreferences, setSavePreferences] = useState(false);

  const chips = [
    "Value Hunter",
    "Premium Buyer",
    "Brand-Loyal",
    "Eco-Conscious",
    "Durability First",
    "Aesthetic Focused",
    "Budget First",
    "Tech-Savvy",
    "Name Brands Only",
    "Function Over Looks"
  ];

  const questions = [
    {
      id: 1,
      question: "Which describes you better?",
      options: [
        "I want the cheapest option",
        "I want the best long-term option",
        "I want whatever is most recommended",
        "I want what looks nicest"
      ]
    },
    {
      id: 2,
      question: "Which is more important?",
      options: ["Warranty / Support", "Low Upfront Price"]
    }
  ];

  const [selectedAnswers, setSelectedAnswers] = useState({});

  const toggleChip = (chip) => {
    setSelectedChips(prev =>
      prev.includes(chip) ? prev.filter(c => c !== chip) : [...prev, chip]
    );
  };

  const handleSaveAndApply = async () => {
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Compare these two products based on detailed user preferences:
        
        Item 1: ${item1.title} (${item1.price})
        Item 2: ${item2.title} (${item2.price})
        
        User Preferences:
        - Durability: ${durability[0]}%
        - Brand: ${brandImportance[0]}%
        - Price: ${priceSensitivity[0]}%
        - Sustainability: ${sustainability[0]}%
        - Maintenance: ${maintenance[0]}%
        - Design: ${design[0]}%
        
        User Style: ${selectedChips.join(', ')}
        
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
            durability: durability[0],
            brand: brandImportance[0],
            price: priceSensitivity[0],
            sustainability: sustainability[0],
            maintenance: maintenance[0],
            design: design[0]
          },
          shopSense: {
            chips: selectedChips,
            answers: selectedAnswers
          }
        }
      });
    } catch (error) {
      console.error("Error analyzing:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      {/* Header */}
      <div className="px-6 pt-8 pb-4 bg-white border-b border-[#E5E7EB]">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-[#1F2937]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              ShopSense
            </h1>
            <p className="text-sm text-[#6B7280]">Tune your comparison to match your buying style</p>
          </div>
          <button onClick={() => navigate(-1)}>
            <X className="w-6 h-6 text-[#6B7280]" />
          </button>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Quick Preference Chips */}
        <div>
          <h3 className="text-sm font-bold text-[#1F2937] mb-3">Quick Preferences</h3>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {chips.map((chip) => (
              <button
                key={chip}
                onClick={() => toggleChip(chip)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                  selectedChips.includes(chip)
                    ? "bg-[#00A36C] text-white"
                    : "bg-white text-[#1F2937] border border-[#E5E7EB]"
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Priority Sliders */}
        <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB]">
          <h3 className="text-sm font-bold text-[#1F2937] mb-4">Priority Sliders</h3>
          <div className="space-y-4">
            {[
              { label: "Durability Importance", value: durability, setter: setDurability },
              { label: "Brand Importance", value: brandImportance, setter: setBrandImportance },
              { label: "Price Sensitivity", value: priceSensitivity, setter: setPriceSensitivity },
              { label: "Sustainability Preference", value: sustainability, setter: setSustainability },
              { label: "Maintenance / Long-Term Cost", value: maintenance, setter: setMaintenance },
              { label: "Design & Aesthetics", value: design, setter: setDesign }
            ].map((slider) => (
              <div key={slider.label}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#1F2937]">{slider.label}</span>
                    <Info className="w-3 h-3 text-[#6B7280]" />
                  </div>
                  <span className="text-xs text-[#6B7280]">{slider.value[0]}%</span>
                </div>
                <Slider
                  value={slider.value}
                  onValueChange={slider.setter}
                  max={100}
                  step={1}
                  className="[&_[role=slider]]:bg-[#00A36C] [&_[role=slider]]:border-[#00A36C]"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Lightning Preferences */}
        <div>
          <h3 className="text-sm font-bold text-[#1F2937] mb-3">Lightning Preferences</h3>
          <div className="space-y-3">
            {questions.map((q) => (
              <div key={q.id} className="bg-white rounded-2xl p-4 border border-[#E5E7EB]">
                <p className="text-sm font-semibold text-[#1F2937] mb-3">{q.question}</p>
                <div className="space-y-2">
                  {q.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => setSelectedAnswers({ ...selectedAnswers, [q.id]: option })}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-colors ${
                        selectedAnswers[q.id] === option
                          ? "bg-[#D6F5E9] text-[#00A36C] border-2 border-[#00A36C]"
                          : "bg-[#F9FAFB] text-[#1F2937] border border-[#E5E7EB]"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save Preferences */}
        <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB]">
          <div className="flex items-center gap-3 mb-4">
            <Checkbox
              checked={savePreferences}
              onCheckedChange={setSavePreferences}
              className="border-[#00A36C] data-[state=checked]:bg-[#00A36C]"
            />
            <label className="text-sm text-[#1F2937]">
              Use these preferences for future comparisons
            </label>
          </div>
          <Button
            onClick={handleSaveAndApply}
            className="w-full h-12 rounded-2xl bg-[#00A36C] hover:bg-[#007E52] font-semibold"
          >
            Save & Apply ShopSense
          </Button>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}