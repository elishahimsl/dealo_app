import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Search, Scale, ScanSearch, Zap, Award, ChevronRight, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Discover() {
  const navigate = useNavigate();
  const [showAllTopics, setShowAllTopics] = useState(false);

  const specialTools = [
    { id: 1, icon: Scale, name: "SnapCompare", page: "Compare" },
    { id: 2, icon: ScanSearch, name: "DealScanner", page: "DealScanner" },
    { id: 3, icon: Zap, name: "PriceDrop", page: "PriceDrop" },
    { id: 4, icon: Award, name: "DeaLo AI", page: "BestMatch" },
  ];

  const stores = [
    { id: 1, name: "Amazon", url: "https://amazon.com" },
    { id: 2, name: "Walmart", url: "https://walmart.com" },
    { id: 3, name: "Target", url: "https://target.com" },
    { id: 4, name: "Best Buy", url: "https://bestbuy.com" },
    { id: 5, name: "Costco", url: "https://costco.com" },
    { id: 6, name: "Sam's Club", url: "https://samsclub.com" },
    { id: 7, name: "Home Depot", url: "https://homedepot.com" },
    { id: 8, name: "Lowe's", url: "https://lowes.com" },
    { id: 9, name: "IKEA", url: "https://ikea.com" },
    { id: 10, name: "Macy's", url: "https://macys.com" },
    { id: 11, name: "Kohl's", url: "https://kohls.com" },
  ];

  const brands = [
    { id: 1, name: "Apple", url: "https://apple.com" },
    { id: 2, name: "Samsung", url: "https://samsung.com" },
    { id: 3, name: "Nike", url: "https://nike.com" },
    { id: 4, name: "Adidas", url: "https://adidas.com" },
    { id: 5, name: "Sony", url: "https://sony.com" },
    { id: 6, name: "Microsoft", url: "https://microsoft.com" },
    { id: 7, name: "Levi's", url: "https://levis.com" },
    { id: 8, name: "The North Face", url: "https://thenorthface.com" },
    { id: 9, name: "Patagonia", url: "https://patagonia.com" },
    { id: 10, name: "KitchenAid", url: "https://kitchenaid.com" },
    { id: 11, name: "Dyson", url: "https://dyson.com" },
    { id: 12, name: "Columbia", url: "https://columbia.com" },
    { id: 13, name: "Ray-Ban", url: "https://ray-ban.com" },
    { id: 14, name: "Coach", url: "https://coach.com" },
  ];

  const allTopics = [
    { id: 9, name: "Women", image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400" },
    { id: 10, name: "Men", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400" },
    { id: 1, name: "Sports", image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400" },
    { id: 2, name: "Health", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400" },
    { id: 3, name: "Fashion", image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400" },
    { id: 4, name: "Tech", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400" },
    { id: 5, name: "Food", image: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400" },
    { id: 6, name: "Home", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400" },
    { id: 7, name: "Beauty", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400" },
    { id: 8, name: "Toys", image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400" },
    { id: 11, name: "Kids", image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400" },
    { id: 12, name: "Pets", image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400" },
    { id: 13, name: "Books", image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400" },
    { id: 14, name: "Garden", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400" },
    { id: 15, name: "Auto", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400" },
  ];

  const visibleTopics = showAllTopics ? allTopics : allTopics.slice(0, 6);

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      {/* Search Bar */}
      <div className="px-6 pt-6 mb-4">
        <div className="w-full h-10 rounded-2xl bg-[#E5E7EB] flex items-center px-4 gap-2">
          <button onClick={() => navigate(createPageUrl("DiscoverSearch"))} className="flex-1 flex items-center gap-2">
            <Search className="w-4 h-4 text-[#6B7280]" />
            <span className="text-sm text-[#6B7280]">Search</span>
          </button>
          <button onClick={() => navigate(createPageUrl("Snap"))}>
            <Camera className="w-4 h-4 text-[#6B7280]" />
          </button>
        </div>
      </div>

      {/* DeaLo Tools */}
      <div className="px-6 mb-4">
        <h2 className="text-xs font-bold text-[#1F2937] mb-2">DeaLo Tools</h2>
        <div className="grid grid-cols-2 gap-2">
          {specialTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button key={tool.id} onClick={() => navigate(createPageUrl(tool.page))} className="bg-white rounded-lg px-3 py-2 border border-[#E5E7EB] shadow-sm flex items-center gap-2 hover:border-[#00A36C]">
                <div className="w-6 h-6 rounded-full bg-[#00A36C] flex items-center justify-center flex-shrink-0">
                  <Icon className="w-3 h-3 text-white" strokeWidth={2} />
                </div>
                <span className="text-[9px] font-semibold text-[#1F2937]">{tool.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stores */}
      <div className="mb-4">
        <div className="px-6 mb-2 flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#1F2937]">Search by Store</h2>
          <button onClick={() => navigate(createPageUrl("AllStores"))}><ChevronRight className="w-5 h-5 text-[#6B7280]" /></button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-6">
          {stores.slice(0, 6).map((store) => (
            <button key={store.id} onClick={() => navigate(createPageUrl("StoreDetail") + `?store=${encodeURIComponent(store.name)}`)} className="flex-shrink-0 rounded-lg bg-[#E5E7EB] flex items-center justify-center" style={{ width: '130px', height: '80px' }}>
              <img src={`https://logo.clearbit.com/${store.name.toLowerCase().replace(/[^a-z]/g, '')}.com`} alt={store.name} className="max-w-[75%] max-h-[55%] object-contain" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
              <span className="text-xs font-bold text-[#1F2937] hidden">{store.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div className="mb-4">
        <div className="px-6 mb-2 flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#1F2937]">Search by Brand</h2>
          <button onClick={() => navigate(createPageUrl("AllBrands"))}><ChevronRight className="w-5 h-5 text-[#6B7280]" /></button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-6">
          {brands.slice(0, 6).map((brand) => (
            <button key={brand.id} onClick={() => navigate(createPageUrl("StoreDetail") + `?store=${encodeURIComponent(brand.name)}`)} className="flex-shrink-0 rounded-lg bg-[#E5E7EB] flex items-center justify-center" style={{ width: '130px', height: '80px' }}>
              <img src={`https://logo.clearbit.com/${brand.name.toLowerCase().replace(/[^a-z]/g, '')}.com`} alt={brand.name} className="max-w-[75%] max-h-[55%] object-contain" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
              <span className="text-xs font-bold text-[#1F2937] hidden">{brand.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Topics */}
      <div className="mb-4">
        <div className="px-6 mb-3">
          <button onClick={() => navigate(createPageUrl("DealsNearYou"))} className="w-full h-24 rounded-2xl shadow-lg overflow-hidden relative">
            <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800" alt="Deals" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
            <h3 className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-white">Deals</h3>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 px-6">
          {visibleTopics.map((topic) => (
            <button key={topic.id} onClick={() => navigate(createPageUrl("TopicDetail") + `?topic=${topic.name}`)} className="rounded-2xl shadow-sm hover:shadow-md overflow-hidden relative" style={{ height: '80px' }}>
              <img src={topic.image} alt={topic.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <span className="absolute bottom-2 left-3 font-bold text-white text-sm">{topic.name}</span>
            </button>
          ))}
        </div>

        <div className="px-6 mt-3 flex justify-center">
          <Button onClick={() => setShowAllTopics(!showAllTopics)} variant="outline" className="rounded-2xl border-2 border-[#00A36C] text-[#00A36C] hover:bg-[#00A36C] hover:text-white font-semibold">
            {showAllTopics ? 'Show Less' : 'More Topics'}
          </Button>
        </div>
      </div>

      <div className="px-6 pb-8 pt-4 flex flex-col items-center opacity-30">
        <p className="text-lg font-black tracking-tight">
          <span className="text-[#1F2937]">Dea</span><span className="text-[#00A36C]">Lo</span>
        </p>
      </div>

      <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
    </div>
  );
}