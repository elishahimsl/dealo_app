import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export default function ShopSenseTuner() {
  const navigate = useNavigate();
  const location = useLocation();
  const { item1, item2, preferences: initialPrefs } = location.state || {};

  const [selectedChips, setSelectedChips] = useState([]);
  const [answers, setAnswers] = useState({});
  
  const [pricePreference, setPricePreference] = useState(initialPrefs?.price || [50]);
  const [qualityPreference, setQualityPreference] = useState(initialPrefs?.quality || [50]);
  const [brandPreference, setBrandPreference] = useState(initialPrefs?.brand || [50]);
  const [durabilityPreference, setDurabilityPreference] = useState(initialPrefs?.durability || [50]);

  const chips = [
    { id: "value", label: "Value Seeker", effect: { price: 80, quality: 40 } },
    { id: "durability", label: "Durability First", effect: { durability: 90, price: 30 } },
    { id: "brand", label: "Brand Focused", effect: { brand: 85, price: 40 } },
    { id: "budget", label: "Budget Priority", effect: { price: 95, quality: 30 } },
    { id: "premium", label: "Premium Buyer", effect: { quality: 90, brand: 80, price: 20 } },
    { id: "balanced", label: "Balanced Shopper", effect: { price: 50, quality: 50, brand: 50, durability: 50 } },
  ];

  const questions = [
    {
      id: "q1",
      question: "What matters more to you?",
      options: [
        { label: "Lower price", effect: { price: 80 } },
        { label: "Better long-term quality", effect: { quality: 80, durability: 70 } }
      ]
    },
    {
      id: "q2",
      question: "Brand preference?",
      options: [
        { label: "Trusted brands only", effect: { brand: 90 } },
        { label: "Best performance regardless", effect: { quality: 85, brand: 30 } }
      ]
    },
    {
      id: "q3",
      question: "How long do you plan to use this?",
      options: [
        { label: "Short term (< 1 year)", effect: { price: 75, durability: 30 } },
        { label: "Long term (2+ years)", effect: { durability: 90, quality: 75 } }
      ]
    }
  ];

  const toggleChip = (chipId) => {
    const chip = chips.find(c => c.id === chipId);
    if (selectedChips.includes(chipId)) {
      setSelectedChips(selectedChips.filter(c => c !== chipId));
    } else {
      setSelectedChips([...selectedChips, chipId]);
      // Apply chip effects
      if (chip?.effect) {
        if (chip.effect.price) setPricePreference([chip.effect.price]);
        if (chip.effect.quality) setQualityPreference([chip.effect.quality]);
        if (chip.effect.brand) setBrandPreference([chip.effect.brand]);
        if (chip.effect.durability) setDurabilityPreference([chip.effect.durability]);
      }
    }
  };

  const selectAnswer = (questionId, optionIdx) => {
    const question = questions.find(q => q.id === questionId);
    const option = question?.options[optionIdx];
    setAnswers({ ...answers, [questionId]: optionIdx });
    
    // Apply answer effects
    if (option?.effect) {
      if (option.effect.price) setPricePreference([option.effect.price]);
      if (option.effect.quality) setQualityPreference([option.effect.quality]);
      if (option.effect.brand) setBrandPreference([option.effect.brand]);
      if (option.effect.durability) setDurabilityPreference([option.effect.durability]);
    }
  };

  const applyPreferences = () => {
    navigate(createPageUrl("Compare"), {
      state: {
        item1,
        item2,
        shopSenseApplied: true,
        preferences: {
          price: pricePreference,
          quality: qualityPreference,
          brand: brandPreference,
          durability: durabilityPreference
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-32">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#00A36C] to-[#007E52] px-6 pt-8 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              <Sparkles className="w-5 h-5" /> ShopSense
            </h1>
            <p className="text-white/80 text-sm">Personalize your comparison</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Quick Preference Chips */}
        <div>
          <h3 className="font-bold text-[#1F2937] mb-3">What's your shopping style?</h3>
          <div className="flex flex-wrap gap-2">
            {chips.map((chip) => (
              <button
                key={chip.id}
                onClick={() => toggleChip(chip.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  selectedChips.includes(chip.id)
                    ? 'bg-[#00A36C] text-white'
                    : 'bg-white text-[#1F2937] border border-[#E5E7EB]'
                }`}
              >
                {selectedChips.includes(chip.id) && <Check className="w-3 h-3 inline mr-1" />}
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* AI Questions */}
        <div>
          <h3 className="font-bold text-[#1F2937] mb-3">Quick Questions</h3>
          <div className="space-y-4">
            {questions.map((q) => (
              <div key={q.id} className="bg-white rounded-2xl p-4 border border-[#E5E7EB]">
                <p className="text-sm font-semibold text-[#1F2937] mb-3">{q.question}</p>
                <div className="flex gap-2">
                  {q.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => selectAnswer(q.id, idx)}
                      className={`flex-1 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        answers[q.id] === idx
                          ? 'bg-[#00A36C] text-white'
                          : 'bg-[#F9FAFB] text-[#1F2937] border border-[#E5E7EB]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preview Sliders (Read-only) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-[#1F2937]">Calibrated Preferences</h3>
            <span className="text-xs text-[#6B7280] italic">Auto-adjusted by ShopSense</span>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] space-y-4 opacity-80">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-[#6B7280]">Price Importance</span>
                <span className="text-xs font-semibold text-[#00A36C]">{pricePreference[0]}%</span>
              </div>
              <Slider value={pricePreference} max={100} disabled className="[&_[role=slider]]:bg-[#00A36C]" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-[#6B7280]">Quality Importance</span>
                <span className="text-xs font-semibold text-[#00A36C]">{qualityPreference[0]}%</span>
              </div>
              <Slider value={qualityPreference} max={100} disabled className="[&_[role=slider]]:bg-[#00A36C]" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-[#6B7280]">Brand Importance</span>
                <span className="text-xs font-semibold text-[#00A36C]">{brandPreference[0]}%</span>
              </div>
              <Slider value={brandPreference} max={100} disabled className="[&_[role=slider]]:bg-[#00A36C]" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-[#6B7280]">Durability Importance</span>
                <span className="text-xs font-semibold text-[#00A36C]">{durabilityPreference[0]}%</span>
              </div>
              <Slider value={durabilityPreference} max={100} disabled className="[&_[role=slider]]:bg-[#00A36C]" />
            </div>
          </div>
        </div>
      </div>

      {/* Apply Button */}
      <div className="fixed bottom-24 left-0 right-0 px-6">
        <Button onClick={applyPreferences} className="w-full h-14 rounded-2xl bg-[#00A36C] hover:bg-[#007E52] text-white font-bold text-base flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5" />
          Apply ShopSense Preferences
        </Button>
      </div>
    </div>
  );
}