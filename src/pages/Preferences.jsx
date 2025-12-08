import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

export default function Preferences() {
  const navigate = useNavigate();
  const location = useLocation();
  const { item1, item2, preferences } = location.state || {};

  // Categories
  const [selectedCategories, setSelectedCategories] = useState({
    price: true,
    quality: true,
    sustainability: false,
    brand: true,
    shippingSpeed: false,
    popularity: false,
    condition: false,
  });

  // Priority Sliders
  const [priorities, setPriorities] = useState({
    price: [preferences?.price?.[0] || 70],
    quality: [preferences?.quality?.[0] || 80],
    sustainability: [50],
    brand: [preferences?.brand?.[0] || 60],
    shippingSpeed: [50],
    popularity: [50],
    condition: [50],
  });

  // Budget
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");

  // Brands
  const [searchBrand, setSearchBrand] = useState("");
  const [selectedBrands, setSelectedBrands] = useState([]);

  const allBrands = ["Apple", "Nike", "Adidas", "Samsung", "Sony", "Microsoft", "LG", "Canon"];
  const filteredBrands = allBrands.filter(b => b.toLowerCase().includes(searchBrand.toLowerCase()));

  // Condition
  const [condition, setCondition] = useState("either");

  // Retailers
  const [selectedRetailers, setSelectedRetailers] = useState({
    amazon: true,
    target: true,
    walmart: true,
    bestbuy: false,
    ebay: false,
  });

  const toggleCategory = (key) => {
    setSelectedCategories(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleBrand = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const toggleRetailer = (key) => {
    setSelectedRetailers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleApply = () => {
    // Navigate back with updated preferences
    navigate(-1);
  };

  const categoryLabels = {
    price: "Price",
    quality: "Quality",
    sustainability: "Sustainability",
    brand: "Brand",
    shippingSpeed: "Shipping Speed",
    popularity: "Popularity / Trend",
    condition: "Condition (New / Used)",
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between z-10">
        <button onClick={() => navigate(-1)}>
          <X className="w-5 h-5 text-[#1F2937]" />
        </button>
        <h1 className="text-base font-semibold text-[#1F2937]">Preferences</h1>
        <button onClick={handleApply} className="text-[#00A36C] font-semibold text-sm">Done</button>
      </div>

      <div className="px-6 py-6 space-y-8">
        {/* Categories Section */}
        <div>
          <h2 className="text-lg font-semibold text-[#1F2937] mb-4">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {Object.keys(selectedCategories).map((key) => (
              <button
                key={key}
                onClick={() => toggleCategory(key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategories[key]
                    ? "bg-[#00A36C] text-white"
                    : "bg-[#F3F4F6] text-[#6B7280] border border-[#E5E7EB]"
                }`}
              >
                {categoryLabels[key]}
              </button>
            ))}
          </div>
        </div>

        {/* Priority Weighting Section */}
        <div>
          <h2 className="text-lg font-semibold text-[#1F2937] mb-4">Priority Weighting</h2>
          <div className="space-y-6">
            {Object.keys(selectedCategories)
              .filter((key) => selectedCategories[key])
              .map((key) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[#1F2937]">{categoryLabels[key]}</span>
                    <span className="text-sm font-semibold text-[#00A36C]">{priorities[key][0]}</span>
                  </div>
                  <Slider
                    value={priorities[key]}
                    onValueChange={(val) => setPriorities(prev => ({ ...prev, [key]: val }))}
                    max={100}
                    step={1}
                    className="[&_[role=slider]]:bg-[#00A36C] [&_[role=slider]]:border-[#00A36C]"
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Budget Section */}
        <div>
          <h2 className="text-lg font-semibold text-[#1F2937] mb-4">Budget</h2>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-[#6B7280] mb-1 block">Min</label>
              <input
                type="number"
                placeholder="$0"
                value={budgetMin}
                onChange={(e) => setBudgetMin(e.target.value)}
                className="w-full px-4 py-2 border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#00A36C]"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-[#6B7280] mb-1 block">Max</label>
              <input
                type="number"
                placeholder="$1000"
                value={budgetMax}
                onChange={(e) => setBudgetMax(e.target.value)}
                className="w-full px-4 py-2 border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#00A36C]"
              />
            </div>
          </div>
        </div>

        {/* Brand Filters Section */}
        <div>
          <h2 className="text-lg font-semibold text-[#1F2937] mb-4">Brand Filters</h2>
          <input
            type="text"
            placeholder="Search brands"
            value={searchBrand}
            onChange={(e) => setSearchBrand(e.target.value)}
            className="w-full px-4 py-2 mb-3 border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#00A36C]"
          />
          <div className="space-y-2">
            {[...selectedBrands, ...filteredBrands.filter(b => !selectedBrands.includes(b))].map((brand) => (
              <button
                key={brand}
                onClick={() => toggleBrand(brand)}
                className="w-full flex items-center justify-between py-3 px-4 hover:bg-[#F9FAFB] rounded-xl transition-colors"
              >
                <span className="text-sm text-[#1F2937]">{brand}</span>
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  selectedBrands.includes(brand) ? "bg-[#00A36C] border-[#00A36C]" : "border-[#D1D5DB]"
                }`}>
                  {selectedBrands.includes(brand) && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Product Condition Section */}
        <div>
          <h2 className="text-lg font-semibold text-[#1F2937] mb-4">Product Condition</h2>
          <div className="flex gap-2 bg-[#F3F4F6] rounded-xl p-1">
            {["new", "used", "either"].map((c) => (
              <button
                key={c}
                onClick={() => setCondition(c)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  condition === c
                    ? "bg-white text-[#1F2937] shadow-sm"
                    : "text-[#6B7280]"
                }`}
              >
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Retailer Filters Section */}
        <div>
          <h2 className="text-lg font-semibold text-[#1F2937] mb-4">Stores You Prefer</h2>
          <div className="space-y-2">
            {Object.keys(selectedRetailers).map((key) => (
              <div key={key} className="flex items-center justify-between py-3 px-4 hover:bg-[#F9FAFB] rounded-xl transition-colors">
                <span className="text-sm text-[#1F2937] capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                <Switch
                  checked={selectedRetailers[key]}
                  onCheckedChange={() => toggleRetailer(key)}
                  className="data-[state=checked]:bg-[#00A36C]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Apply Button - Sticky Footer */}
      <div className="fixed bottom-24 left-0 right-0 px-6 py-4 bg-white border-t border-[#E5E7EB]">
        <Button 
          onClick={handleApply}
          className="w-full h-12 rounded-2xl bg-[#00A36C] hover:bg-[#007E52] text-white font-semibold"
        >
          Apply Preferences
        </Button>
      </div>
    </div>
  );
}