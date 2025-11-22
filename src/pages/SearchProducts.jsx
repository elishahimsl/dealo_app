import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Search, X, ChevronRight, Scan, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SearchProducts() {
  const navigate = useNavigate();
  const location = useLocation();
  const { slot } = location.state || {}; // "item1" or "item2"
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  const popularSearches = [
    "Apple AirPods",
    "Nike Shoes",
    "Hydro Flask",
    "Aveeno Lotion",
    "iPhone Cases"
  ];

  const mockResults = [
    {
      id: 1,
      name: "Apple AirPods Pro (2nd Gen)",
      brand: "Apple",
      price: "$249.99",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=200"
    },
    {
      id: 2,
      name: "Sony WH-1000XM5 Headphones",
      brand: "Sony",
      price: "$399.99",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200"
    },
    {
      id: 3,
      name: "Bose QuietComfort 45",
      brand: "Bose",
      price: "$329.99",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=200"
    }
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
    setShowResults(true);
  };

  const handleSelectProduct = (product) => {
    navigate(createPageUrl("Compare"), {
      state: {
        [slot]: {
          title: product.name,
          price: product.price,
          file_url: product.image
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6 text-[#1F2937]" />
          </button>
          <h1 className="text-2xl font-bold text-[#1F2937]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Find a Product
          </h1>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
          <Input
            placeholder="Search product name or scan code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
            className="pl-10 pr-10 h-12 rounded-2xl"
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(""); setShowResults(false); }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-5 h-5 text-[#6B7280]" />
            </button>
          )}
        </div>
      </div>

      {!showResults ? (
        <div className="px-6 space-y-6">
          {/* Popular Searches */}
          <div>
            <h3 className="text-sm font-bold text-[#1F2937] mb-3">Popular Searches</h3>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {popularSearches.map((search) => (
                <button
                  key={search}
                  onClick={() => handleSearch(search)}
                  className="px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap bg-white text-[#1F2937] border border-[#E5E7EB] hover:border-[#00A36C] transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>

          {/* Still Can't Find It */}
          <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] text-center">
            <Scan className="w-12 h-12 text-[#00A36C] mx-auto mb-3" />
            <h3 className="font-bold text-[#1F2937] mb-2">Still Can't Find It?</h3>
            <p className="text-sm text-[#6B7280] mb-4">Try scanning the barcode instead</p>
            <Button
              onClick={() => navigate(createPageUrl("Snap"))}
              className="bg-[#00A36C] hover:bg-[#007E52] rounded-2xl"
            >
              Scan Barcode
            </Button>
          </div>
        </div>
      ) : (
        <div className="px-6">
          <h3 className="text-sm font-bold text-[#1F2937] mb-3">Search Results</h3>
          <div className="space-y-3">
            {mockResults.map((product) => (
              <button
                key={product.id}
                onClick={() => handleSelectProduct(product)}
                className="w-full bg-white rounded-2xl p-4 border border-[#E5E7EB] hover:border-[#00A36C] transition-colors flex items-center gap-4"
              >
                <img src={product.image} alt={product.name} className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1 text-left">
                  <h4 className="font-semibold text-[#1F2937] text-sm mb-1">{product.name}</h4>
                  <p className="text-xs text-[#6B7280] mb-1">{product.brand}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#00A36C]">{product.price}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-[#00A36C] fill-[#00A36C]" />
                      <span className="text-xs text-[#6B7280]">{product.rating}</span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[#6B7280]" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Footer Button */}
      <div className="fixed bottom-24 left-0 right-0 px-6">
        <Button
          onClick={() => navigate(createPageUrl("Compare"))}
          className="w-full h-12 rounded-2xl bg-[#00A36C] hover:bg-[#007E52]"
        >
          Done
        </Button>
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