import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

export default function DealScanner() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    categories: [],
    brands: [],
    priceRange: { min: 0, max: 500 }
  });

  const categories = ["All Deals", "Electronics", "Home", "Clothing", "Beauty", "Automotive"];
  const brandOptions = ["Nike", "Apple", "Samsung", "Sony", "Target Brand"];
  const categoryOptions = ["Electronics", "Home", "Clothing", "Beauty", "Automotive"];

  const mockDeals = [
    { 
      id: 1, 
      store: "Target", 
      discount: "40% OFF", 
      originalPrice: "$149.99", 
      salePrice: "$89.99",
      image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400",
      distance: "0.5 mi"
    },
    { 
      id: 2, 
      store: "Best Buy", 
      discount: "30% OFF", 
      originalPrice: "$199.99", 
      salePrice: "$139.99",
      image: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=400",
      distance: "1.2 mi"
    },
    { 
      id: 3, 
      store: "Walmart", 
      discount: "25% OFF", 
      originalPrice: "$79.99", 
      salePrice: "$59.99",
      image: "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=400",
      distance: "2.1 mi"
    },
  ];

  const filteredDeals = mockDeals.filter(deal => {
    const matchesCategory = preferences.categories.length === 0 || preferences.categories.includes(activeCategory);
    const price = parseFloat(deal.salePrice.replace('$', ''));
    const matchesPrice = price >= preferences.priceRange.min && price <= preferences.priceRange.max;
    return matchesCategory && matchesPrice;
  });

  const aiRecommendedDeals = preferences.categories.length > 0 || preferences.brands.length > 0 
    ? filteredDeals.slice(0, 2)
    : mockDeals.slice(0, 2);

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      <div className="px-6 pt-8 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)}>
              <ArrowLeft className="w-6 h-6 text-[#1F2937]" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-[#1F2937]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                DealScanner
              </h1>
              <p className="text-sm text-[#6B7280]">Top deals online and near you</p>
            </div>
          </div>
          <button 
            onClick={() => setShowPreferences(true)}
            className="w-10 h-10 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center"
          >
            <Settings className="w-5 h-5 text-[#1F2937]" />
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-6">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setActiveCategory(cat.toLowerCase().replace(" ", ""))}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${
                activeCategory === cat.toLowerCase().replace(" ", "")
                  ? "bg-[#00A36C] text-white"
                  : "bg-white text-[#1F2937] border border-[#E5E7EB]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6">
        {/* AI Recommended Deals */}
        {(preferences.categories.length > 0 || preferences.brands.length > 0) && (
          <>
            <h3 className="text-lg font-bold text-[#1F2937] mb-2">AI Recommended For You</h3>
            <p className="text-xs text-[#6B7280] mb-4">Based on your preferences</p>
            <div className="space-y-4 mb-6">
              {aiRecommendedDeals.map((deal) => (
                <div key={`ai-${deal.id}`} className="bg-white rounded-2xl overflow-hidden border-2 border-[#00A36C] shadow-sm">
                  <div className="relative h-48">
                    <img src={deal.image} alt={deal.store} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                      {deal.discount}
                    </div>
                    <div className="absolute top-3 right-3 bg-[#00A36C] text-white text-xs font-bold px-2 py-1 rounded-full">
                      AI Pick
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <h4 className="text-white font-bold text-lg mb-1">{deal.store}</h4>
                      <div className="flex items-center gap-2 text-white">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{deal.distance}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-sm text-[#6B7280] line-through">{deal.originalPrice}</span>
                        <span className="text-2xl font-bold text-[#00A36C] ml-2">{deal.salePrice}</span>
                      </div>
                    </div>
                    <Button className="w-full bg-[#00A36C] hover:bg-[#007E52] rounded-xl">
                      View Deal
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <h3 className="text-lg font-bold text-[#1F2937] mb-4">Today's Hottest Deals</h3>
        <div className="space-y-4">
          {filteredDeals.map((deal) => (
            <div key={deal.id} className="bg-white rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-sm">
              <div className="relative h-48">
                <img src={deal.image} alt={deal.store} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  {deal.discount}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <h4 className="text-white font-bold text-lg mb-1">{deal.store}</h4>
                  <div className="flex items-center gap-2 text-white">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{deal.distance}</span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-sm text-[#6B7280] line-through">{deal.originalPrice}</span>
                    <span className="text-2xl font-bold text-[#00A36C] ml-2">{deal.salePrice}</span>
                  </div>
                </div>
                <Button className="w-full bg-[#00A36C] hover:bg-[#007E52] rounded-xl">
                  View Deal
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preferences Modal */}
      {showPreferences && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white rounded-t-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#1F2937]">Deal Preferences</h2>
              <button onClick={() => setShowPreferences(false)}>
                <X className="w-6 h-6 text-[#1F2937]" />
              </button>
            </div>

            <div className="px-6 py-6 space-y-6">
              {/* Favorite Categories */}
              <div>
                <h3 className="text-sm font-bold text-[#1F2937] mb-3">Favorite Categories</h3>
                <div className="space-y-2">
                  {categoryOptions.map((cat) => (
                    <div key={cat} className="flex items-center gap-3">
                      <Checkbox
                        checked={preferences.categories.includes(cat)}
                        onCheckedChange={(checked) => {
                          setPreferences(prev => ({
                            ...prev,
                            categories: checked 
                              ? [...prev.categories, cat]
                              : prev.categories.filter(c => c !== cat)
                          }));
                        }}
                        className="border-[#00A36C] data-[state=checked]:bg-[#00A36C]"
                      />
                      <label className="text-sm text-[#1F2937]">{cat}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Favorite Brands */}
              <div>
                <h3 className="text-sm font-bold text-[#1F2937] mb-3">Favorite Brands</h3>
                <div className="space-y-2">
                  {brandOptions.map((brand) => (
                    <div key={brand} className="flex items-center gap-3">
                      <Checkbox
                        checked={preferences.brands.includes(brand)}
                        onCheckedChange={(checked) => {
                          setPreferences(prev => ({
                            ...prev,
                            brands: checked 
                              ? [...prev.brands, brand]
                              : prev.brands.filter(b => b !== brand)
                          }));
                        }}
                        className="border-[#00A36C] data-[state=checked]:bg-[#00A36C]"
                      />
                      <label className="text-sm text-[#1F2937]">{brand}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-sm font-bold text-[#1F2937] mb-3">Price Range</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[#6B7280]">${preferences.priceRange.min}</span>
                  <span className="text-xs text-[#6B7280]">${preferences.priceRange.max}</span>
                </div>
                <Slider
                  value={[preferences.priceRange.max]}
                  onValueChange={([max]) => setPreferences(prev => ({ ...prev, priceRange: { ...prev.priceRange, max } }))}
                  max={1000}
                  step={10}
                  className="[&_[role=slider]]:bg-[#00A36C] [&_[role=slider]]:border-[#00A36C]"
                />
              </div>

              <Button 
                onClick={() => setShowPreferences(false)}
                className="w-full h-12 rounded-2xl bg-[#00A36C] hover:bg-[#007E52]"
              >
                Apply Preferences
              </Button>
            </div>
          </div>
        </div>
      )}

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