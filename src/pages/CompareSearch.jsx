import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ChevronLeft, Search, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

export default function CompareSearch() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: savedProducts = [] } = useQuery({
    queryKey: ['captures'],
    queryFn: () => base44.entities.Capture.list(),
  });

  const filteredProducts = searchQuery.trim() 
    ? savedProducts.filter(p => 
        p.title?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const featuredProducts = [
    { id: 1, name: "iPhone 16 Pro", brand: "Apple", image: "https://images.unsplash.com/photo-1696446702592-006b59370cea?w=200" },
    { id: 2, name: "MacBook Air M2", brand: "Apple", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200" },
    { id: 3, name: "AirPods Pro", brand: "Apple", image: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=200" },
    { id: 4, name: "Samsung S24 Ultra", brand: "Samsung", image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=200" },
    { id: 5, name: "Sony WH-1000XM5", brand: "Sony", image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200" },
    { id: 6, name: "iPad Pro", brand: "Apple", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200" }
  ];

  const handleSelectProduct = (product) => {
    navigate(createPageUrl("Compare"));
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 sticky top-0 bg-white z-10">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)}>
            <ChevronLeft className="w-6 h-6 text-[#1F2937]" />
          </button>
          <div className="flex-1 bg-[#F3F4F6] rounded-full px-4 py-2 flex items-center gap-3">
            <Search className="w-5 h-5 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="flex-1 bg-transparent outline-none text-sm text-[#1F2937] placeholder:text-[#9CA3AF]"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")}>
                <X className="w-5 h-5 text-[#9CA3AF]" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="px-6">
        {searchQuery.trim() ? (
          /* Search Results */
          filteredProducts.length > 0 ? (
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-[#1F2937] mb-3">Search Results</h2>
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleSelectProduct(product)}
                  className="w-full bg-white border border-[#E5E7EB] rounded-2xl p-4 flex items-center gap-3 hover:bg-[#F9FAFB] transition-colors"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#F3F4F6] flex-shrink-0">
                    <img src={product.file_url} alt={product.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-bold text-[#1F2937] text-sm line-clamp-2 mb-0.5">{product.title}</h3>
                    <p className="text-xs text-[#6B7280]">{product.keywords?.[0] || 'Product'}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-sm text-[#6B7280]">No results found</p>
            </div>
          )
        ) : (
          /* Default View - Featured Products */
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-[#1F2937]">Featured Products</h2>
              <button className="text-xs font-semibold text-[#00A36C]">View All</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {featuredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleSelectProduct(product)}
                  className="bg-white border border-[#E5E7EB] rounded-2xl p-3 hover:shadow-lg transition-shadow"
                >
                  <div className="w-full aspect-square rounded-xl overflow-hidden bg-[#F3F4F6] mb-2">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-semibold text-[#1F2937] text-xs mb-0.5 line-clamp-2">{product.name}</h3>
                  <p className="text-[10px] text-[#6B7280]">{product.brand}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}