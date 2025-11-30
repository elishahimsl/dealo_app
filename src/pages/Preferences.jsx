import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Search, Heart, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Preferences() {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedStores, setSelectedStores] = useState([]);
  const [priorities, setPriorities] = useState(["Price", "Quality", "Brand loyalty", "Fast shipping", "Sustainability", "Popularity"]);
  const [dealSensitivity, setDealSensitivity] = useState(50);
  const [priceComfort, setPriceComfort] = useState(2);
  const [selectedMood, setSelectedMood] = useState(null);

  const categories = [
    { id: 1, name: "Electronics", icon: "📱" },
    { id: 2, name: "Fashion", icon: "👕" },
    { id: 3, name: "Home", icon: "🏠" },
    { id: 4, name: "Beauty", icon: "💄" },
    { id: 5, name: "Fitness", icon: "💪" },
    { id: 6, name: "Sports", icon: "⚽" },
    { id: 7, name: "Toys", icon: "🧸" },
    { id: 8, name: "Books", icon: "📚" },
    { id: 9, name: "Food", icon: "🍔" },
    { id: 10, name: "Health", icon: "💊" },
    { id: 11, name: "Auto", icon: "🚗" },
    { id: 12, name: "Garden", icon: "🌱" },
  ];

  const brands = [
    { id: 1, name: "Apple", logo: "https://logo.clearbit.com/apple.com" },
    { id: 2, name: "Nike", logo: "https://logo.clearbit.com/nike.com" },
    { id: 3, name: "Samsung", logo: "https://logo.clearbit.com/samsung.com" },
    { id: 4, name: "Adidas", logo: "https://logo.clearbit.com/adidas.com" },
    { id: 5, name: "Sony", logo: "https://logo.clearbit.com/sony.com" },
    { id: 6, name: "Microsoft", logo: "https://logo.clearbit.com/microsoft.com" },
    { id: 7, name: "Dyson", logo: "https://logo.clearbit.com/dyson.com" },
    { id: 8, name: "Bose", logo: "https://logo.clearbit.com/bose.com" },
    { id: 9, name: "Lululemon", logo: "https://logo.clearbit.com/lululemon.com" },
    { id: 10, name: "Canon", logo: "https://logo.clearbit.com/canon.com" },
  ];

  const stores = [
    { id: 1, name: "Amazon", logo: "https://logo.clearbit.com/amazon.com", color: "#FF9900" },
    { id: 2, name: "Target", logo: "https://logo.clearbit.com/target.com", color: "#CC0000" },
    { id: 3, name: "Walmart", logo: "https://logo.clearbit.com/walmart.com", color: "#0071DC" },
    { id: 4, name: "Best Buy", logo: "https://logo.clearbit.com/bestbuy.com", color: "#0046BE" },
    { id: 5, name: "Costco", logo: "https://logo.clearbit.com/costco.com", color: "#E31837" },
    { id: 6, name: "Home Depot", logo: "https://logo.clearbit.com/homedepot.com", color: "#F96302" },
  ];

  const moods = [
    { id: 1, name: "Minimalist", image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=200" },
    { id: 2, name: "Sporty", image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=200" },
    { id: 3, name: "Techy", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200" },
    { id: 4, name: "Luxury", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200" },
  ];

  const sections = ["Categories", "Brands", "Stores", "Priorities", "Sensitivity", "Style"];
  const progress = ((currentSection + 1) / sections.length) * 100;

  const toggleCategory = (id) => {
    setSelectedCategories(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const toggleBrand = (id) => {
    setSelectedBrands(prev => 
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  const toggleStore = (id) => {
    setSelectedStores(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const movePriority = (from, to) => {
    const newPriorities = [...priorities];
    const [removed] = newPriorities.splice(from, 1);
    newPriorities.splice(to, 0, removed);
    setPriorities(newPriorities);
  };

  const handleSave = () => {
    setShowSuccess(true);
    setTimeout(() => {
      navigate(-1);
    }, 2000);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#00A36C] to-[#007E52] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 animate-bounce">
            <Check className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Preferences Updated!</h2>
          <p className="text-white/80">Your Best Match results just got smarter.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-32">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 bg-white border-b border-[#E5E7EB] sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => currentSection > 0 ? setCurrentSection(currentSection - 1) : navigate(-1)}>
            <ArrowLeft className="w-5 h-5 text-[#1F2937]" />
          </button>
          <h1 className="text-base font-bold text-[#1F2937]">Your Preferences</h1>
          <div className="w-5" />
        </div>
        
        {/* Progress Bar */}
        <div className="h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#00A36C] to-[#007E52] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-[#6B7280] mt-2">{currentSection + 1} of {sections.length}</p>
      </div>

      <div className="px-6 py-6">
        {/* Section 1: Categories */}
        {currentSection === 0 && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold text-[#1F2937] mb-2">Favorite Categories</h2>
            <p className="text-sm text-[#6B7280] mb-6">Select categories you shop most</p>
            
            <div className="grid grid-cols-3 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`rounded-2xl p-4 border-2 transition-all ${
                    selectedCategories.includes(cat.id)
                      ? 'border-[#00A36C] bg-[#00A36C]/10 scale-105'
                      : 'border-[#E5E7EB] bg-white'
                  }`}
                >
                  <span className="text-3xl block mb-2">{cat.icon}</span>
                  <span className={`text-xs font-semibold ${
                    selectedCategories.includes(cat.id) ? 'text-[#00A36C]' : 'text-[#1F2937]'
                  }`}>
                    {cat.name}
                  </span>
                  {selectedCategories.includes(cat.id) && (
                    <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#00A36C] flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Section 2: Brands */}
        {currentSection === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold text-[#1F2937] mb-2">Favorite Brands</h2>
            <p className="text-sm text-[#6B7280] mb-4">Select brands you love</p>
            
            {/* Selected Brands Strip */}
            {selectedBrands.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
                {brands.filter(b => selectedBrands.includes(b.id)).map((brand) => (
                  <div key={brand.id} className="flex-shrink-0 px-3 py-1.5 rounded-full bg-[#00A36C] text-white text-xs font-semibold flex items-center gap-1">
                    {brand.name}
                    <button onClick={() => toggleBrand(brand.id)} className="ml-1">×</button>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-3">
              {brands.map((brand) => (
                <button
                  key={brand.id}
                  onClick={() => toggleBrand(brand.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                    selectedBrands.includes(brand.id)
                      ? 'border-[#00A36C] bg-[#00A36C]/5'
                      : 'border-[#E5E7EB] bg-white'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center overflow-hidden">
                    <img src={brand.logo} alt={brand.name} className="w-8 h-8 object-contain" />
                  </div>
                  <span className="text-sm font-semibold text-[#1F2937] flex-1 text-left">{brand.name}</span>
                  {selectedBrands.includes(brand.id) && (
                    <div className="w-6 h-6 rounded-full bg-[#00A36C] flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Stores */}
        {currentSection === 2 && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold text-[#1F2937] mb-2">Favorite Stores</h2>
            <p className="text-sm text-[#6B7280] mb-6">Where do you shop most?</p>
            
            <div className="grid grid-cols-2 gap-4">
              {stores.map((store) => (
                <button
                  key={store.id}
                  onClick={() => toggleStore(store.id)}
                  className={`rounded-2xl p-4 border-2 transition-all relative overflow-hidden ${
                    selectedStores.includes(store.id)
                      ? 'border-[#00A36C]'
                      : 'border-[#E5E7EB]'
                  }`}
                  style={{ backgroundColor: selectedStores.includes(store.id) ? `${store.color}10` : 'white' }}
                >
                  <div className="w-16 h-16 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center mx-auto mb-3 overflow-hidden">
                    <img src={store.logo} alt={store.name} className="w-12 h-12 object-contain" />
                  </div>
                  <span className="text-sm font-semibold text-[#1F2937]">{store.name}</span>
                  {selectedStores.includes(store.id) && (
                    <div className="absolute top-2 right-2">
                      <Heart className="w-5 h-5 text-[#00A36C] fill-[#00A36C]" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Section 4: Priorities */}
        {currentSection === 3 && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold text-[#1F2937] mb-2">Shopping Priorities</h2>
            <p className="text-sm text-[#6B7280] mb-6">Drag to rank what matters most</p>
            
            <div className="space-y-3">
              {priorities.map((priority, idx) => (
                <div
                  key={priority}
                  className={`flex items-center gap-3 p-4 rounded-2xl border-2 bg-white ${
                    idx === 0 ? 'border-[#00A36C] shadow-lg' : 'border-[#E5E7EB]'
                  }`}
                >
                  <GripVertical className="w-5 h-5 text-[#6B7280]" />
                  <span className={`flex-1 font-semibold ${idx === 0 ? 'text-[#00A36C]' : 'text-[#1F2937]'}`}>
                    {priority}
                  </span>
                  <div className="flex gap-1">
                    {idx > 0 && (
                      <button onClick={() => movePriority(idx, idx - 1)} className="w-8 h-8 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#6B7280]">↑</button>
                    )}
                    {idx < priorities.length - 1 && (
                      <button onClick={() => movePriority(idx, idx + 1)} className="w-8 h-8 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#6B7280]">↓</button>
                    )}
                  </div>
                  {idx === 0 && (
                    <span className="text-[10px] text-[#00A36C] font-bold">Most Important</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 5: Sensitivity & Price */}
        {currentSection === 4 && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold text-[#1F2937] mb-2">Deal Sensitivity & Price</h2>
            <p className="text-sm text-[#6B7280] mb-6">Set your comfort levels</p>
            
            <div className="bg-white rounded-3xl p-6 border border-[#E5E7EB] mb-6">
              <h3 className="text-sm font-bold text-[#1F2937] mb-4">Deal Sensitivity</h3>
              <div className="flex justify-between text-xs text-[#6B7280] mb-2">
                <span>Low</span>
                <span>Extreme</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={dealSensitivity}
                onChange={(e) => setDealSensitivity(parseInt(e.target.value))}
                className="w-full h-2 bg-gradient-to-r from-[#E5E7EB] to-[#00A36C] rounded-full appearance-none cursor-pointer"
              />
              <p className="text-center text-sm font-bold text-[#00A36C] mt-2">{dealSensitivity}%</p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#E5E7EB]">
              <h3 className="text-sm font-bold text-[#1F2937] mb-4">Comfortable Price Range</h3>
              <div className="flex justify-between gap-2">
                {["$", "$$", "$$$", "$$$$"].map((p, idx) => (
                  <button
                    key={p}
                    onClick={() => setPriceComfort(idx)}
                    className={`flex-1 py-4 rounded-2xl font-bold text-lg transition-all ${
                      priceComfort === idx
                        ? 'bg-[#00A36C] text-white shadow-lg scale-105'
                        : 'bg-[#F3F4F6] text-[#6B7280]'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Section 6: Style Mood */}
        {currentSection === 5 && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold text-[#1F2937] mb-2">Style Mood Board</h2>
            <p className="text-sm text-[#6B7280] mb-6">What's your vibe? (Optional)</p>
            
            <div className="grid grid-cols-2 gap-4">
              {moods.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => setSelectedMood(mood.id)}
                  className={`rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedMood === mood.id
                      ? 'border-[#00A36C] scale-105'
                      : 'border-[#E5E7EB]'
                  }`}
                >
                  <img src={mood.image} alt={mood.name} className="w-full h-32 object-cover" />
                  <div className={`p-3 ${selectedMood === mood.id ? 'bg-[#00A36C]/10' : 'bg-white'}`}>
                    <span className={`text-sm font-semibold ${
                      selectedMood === mood.id ? 'text-[#00A36C]' : 'text-[#1F2937]'
                    }`}>
                      {mood.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] p-6">
        {currentSection < sections.length - 1 ? (
          <Button
            onClick={() => setCurrentSection(currentSection + 1)}
            className="w-full bg-[#00A36C] hover:bg-[#007E52] rounded-2xl h-14 font-semibold text-base"
          >
            Continue
          </Button>
        ) : (
          <Button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-[#00A36C] to-[#007E52] hover:opacity-90 rounded-2xl h-14 font-semibold text-base shadow-lg"
          >
            Save Preferences
          </Button>
        )}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
      `}</style>
    </div>
  );
}