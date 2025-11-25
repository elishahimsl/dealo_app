import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Search, X, Star, Loader2, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SearchProducts() {
  const navigate = useNavigate();
  const location = useLocation();
  const { slot, item1, item2 } = location.state || {};
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const popularSearches = ["Apple AirPods", "Nike Shoes", "Hydro Flask", "iPhone Cases", "Samsung Galaxy"];

  const handleSearch = async (query) => {
    if (!query.trim()) return;
    setSearchQuery(query);
    setLoading(true);
    
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Search for products matching: "${query}". Return 6 realistic products with real brand names, accurate prices, and high-quality Unsplash image URLs for each product type.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            products: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "number" },
                  name: { type: "string" },
                  brand: { type: "string" },
                  price: { type: "string" },
                  rating: { type: "number" },
                  feature: { type: "string" },
                  image: { type: "string" }
                }
              }
            }
          }
        }
      });
      setResults(response.products || []);
    } catch (error) {
      console.error("Search error:", error);
    }
    setLoading(false);
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setTimeout(() => {
      navigate(createPageUrl("Compare"), {
        state: {
          item1: slot === 'item1' ? { title: product.name, price: product.price, file_url: product.image } : item1,
          item2: slot === 'item2' ? { title: product.name, price: product.price, file_url: product.image } : item2
        }
      });
    }, 300);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end">
      <div className="bg-white rounded-t-3xl w-full max-h-[85vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5 text-[#1F2937]" />
            </button>
            <h1 className="text-lg font-bold text-[#1F2937]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Search Products
            </h1>
          </div>

          {/* Search Bar with glow */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
            <Input
              placeholder="Search for any product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
              className="pl-12 pr-12 h-14 rounded-2xl border-2 border-[#E5E7EB] focus:border-[#00A36C] focus:ring-[#00A36C]/20 text-base shadow-lg shadow-[#00A36C]/10"
              autoFocus
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(""); setResults([]); }} className="absolute right-4 top-1/2 -translate-y-1/2">
                <X className="w-5 h-5 text-[#6B7280]" />
              </button>
            )}
          </div>
        </div>

        <div className="overflow-y-auto max-h-[60vh] px-6 py-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-[#00A36C] animate-spin mb-3" />
              <p className="text-sm text-[#6B7280]">Searching products...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-3">
              {results.map((product, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectProduct(product)}
                  className={`w-full bg-white rounded-2xl p-4 border-2 transition-all flex items-center gap-4 ${
                    selectedProduct?.id === product.id 
                      ? 'border-[#00A36C] bg-[#D6F5E9] scale-[0.98]' 
                      : 'border-[#E5E7EB] hover:border-[#00A36C] hover:shadow-md'
                  }`}
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#F9FAFB] flex-shrink-0">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="font-semibold text-[#1F2937] text-sm mb-0.5 line-clamp-1">{product.name}</h4>
                    <p className="text-xs text-[#6B7280] mb-1">{product.brand}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#00A36C]">{product.price}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-[#00A36C] fill-[#00A36C]" />
                        <span className="text-xs text-[#6B7280]">{product.rating}</span>
                      </div>
                    </div>
                    {product.feature && (
                      <p className="text-[10px] text-[#6B7280] mt-1 line-clamp-1">{product.feature}</p>
                    )}
                  </div>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${selectedProduct?.id === product.id ? 'bg-[#00A36C]' : 'bg-[#E5E7EB]'}`}>
                    {selectedProduct?.id === product.id ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <span className="text-xs text-[#6B7280]">+</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-[#1F2937] mb-3">Popular Searches</h3>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((search) => (
                    <button
                      key={search}
                      onClick={() => handleSearch(search)}
                      className="px-4 py-2 rounded-full text-sm font-medium bg-[#F9FAFB] text-[#1F2937] border border-[#E5E7EB] hover:border-[#00A36C] hover:bg-[#D6F5E9] transition-all"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
      `}</style>
    </div>
  );
}