import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Search, Camera, Sparkles, Scale, ScanSearch, Leaf, Zap, Award, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Discover() {
  const navigate = useNavigate();
  const [showAllTopics, setShowAllTopics] = useState(false);

  const specialTools = [
    { id: 1, icon: Sparkles, name: "SmartFinder", page: "SmartFinder" },
    { id: 2, icon: Scale, name: "SnapCompare", page: "Compare" },
    { id: 3, icon: ScanSearch, name: "DealScanner", page: "DealScanner" },
    { id: 4, icon: Leaf, name: "SmartReview", page: "SmartReview" },
    { id: 5, icon: Zap, name: "PriceDrop", page: "PriceDrop" },
    { id: 6, icon: Award, name: "BestMatch", page: "BestMatch" },
  ];

  const stores = [
    { id: 1, name: "Target", logo: "https://logo.clearbit.com/target.com", url: "https://target.com" },
    { id: 2, name: "Walmart", logo: "https://logo.clearbit.com/walmart.com", url: "https://walmart.com" },
    { id: 3, name: "Amazon", logo: "https://logo.clearbit.com/amazon.com", url: "https://amazon.com" },
    { id: 4, name: "Best Buy", logo: "https://logo.clearbit.com/bestbuy.com", url: "https://bestbuy.com" },
    { id: 5, name: "Costco", logo: "https://logo.clearbit.com/costco.com", url: "https://costco.com" },
    { id: 6, name: "CVS", logo: "https://logo.clearbit.com/cvs.com", url: "https://cvs.com" },
    { id: 7, name: "Walgreens", logo: "https://logo.clearbit.com/walgreens.com", url: "https://walgreens.com" },
    { id: 8, name: "Home Depot", logo: "https://logo.clearbit.com/homedepot.com", url: "https://homedepot.com" },
    { id: 9, name: "Lowes", logo: "https://logo.clearbit.com/lowes.com", url: "https://lowes.com" },
    { id: 10, name: "Macys", logo: "https://logo.clearbit.com/macys.com", url: "https://macys.com" },
    { id: 11, name: "Nordstrom", logo: "https://logo.clearbit.com/nordstrom.com", url: "https://nordstrom.com" },
    { id: 12, name: "Sephora", logo: "https://logo.clearbit.com/sephora.com", url: "https://sephora.com" },
  ];

  const brands = [
    { id: 1, name: "Nike", logo: "https://logo.clearbit.com/nike.com", url: "https://nike.com" },
    { id: 2, name: "Apple", logo: "https://logo.clearbit.com/apple.com", url: "https://apple.com" },
    { id: 3, name: "Samsung", logo: "https://logo.clearbit.com/samsung.com", url: "https://samsung.com" },
    { id: 4, name: "Sony", logo: "https://logo.clearbit.com/sony.com", url: "https://sony.com" },
    { id: 5, name: "Adidas", logo: "https://logo.clearbit.com/adidas.com", url: "https://adidas.com" },
    { id: 6, name: "Canon", logo: "https://logo.clearbit.com/canon.com", url: "https://canon.com" },
    { id: 7, name: "Puma", logo: "https://logo.clearbit.com/puma.com", url: "https://puma.com" },
    { id: 8, name: "Under Armour", logo: "https://logo.clearbit.com/underarmour.com", url: "https://underarmour.com" },
    { id: 9, name: "Lululemon", logo: "https://logo.clearbit.com/lululemon.com", url: "https://lululemon.com" },
    { id: 10, name: "New Balance", logo: "https://logo.clearbit.com/newbalance.com", url: "https://newbalance.com" },
    { id: 11, name: "Dyson", logo: "https://logo.clearbit.com/dyson.com", url: "https://dyson.com" },
    { id: 12, name: "Bose", logo: "https://logo.clearbit.com/bose.com", url: "https://bose.com" },
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

  const visibleTopics = showAllTopics ? allTopics : allTopics.slice(0, 12);

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      {/* Search Bar */}
      <div className="px-6 pt-8 mb-4">
        <button 
          onClick={() => navigate(createPageUrl("DiscoverSearch"))}
          className="w-full h-10 rounded-2xl bg-[#E5E7EB] flex items-center px-4 gap-2"
        >
          <Search className="w-4 h-4 text-[#6B7280]" />
          <span className="text-sm text-[#6B7280]">Search</span>
        </button>
      </div>

      {/* DeaLo Tools */}
      <div className="px-6 mb-4">
        <h2 className="text-xs font-bold text-[#1F2937] mb-2">DeaLo Tools</h2>
        <div className="grid grid-cols-3 gap-2">
          {specialTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button key={tool.id} onClick={() => navigate(createPageUrl(tool.page))} className="bg-white rounded-xl p-2 border border-[#E5E7EB] shadow-sm flex flex-col items-center hover:border-[#00A36C]">
                <div className="w-8 h-8 rounded-full bg-[#00A36C] flex items-center justify-center mb-1">
                  <Icon className="w-4 h-4 text-white" strokeWidth={2} />
                </div>
                <span className="text-[9px] font-semibold text-[#1F2937] text-center">{tool.name}</span>
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
          {stores.map((store) => (
            <a key={store.id} href={store.url} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm hover:shadow-md flex items-center justify-center" style={{ width: '120px', height: '70px' }}>
              <img src={store.logo} alt={store.name} className="max-w-[70%] max-h-[50%] object-contain" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = `<span class="text-xs font-semibold text-[#1F2937]">${store.name}</span>`; }} />
            </a>
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
          {brands.map((brand) => (
            <a key={brand.id} href={brand.url} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm hover:shadow-md flex items-center justify-center" style={{ width: '120px', height: '70px' }}>
              <img src={brand.logo} alt={brand.name} className="max-w-[70%] max-h-[50%] object-contain" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = `<span class="text-xs font-semibold text-[#1F2937]">${brand.name}</span>`; }} />
            </a>
          ))}
        </div>
      </div>

      {/* Topics */}
      <div className="mb-4">
        <div className="px-6 mb-3">
          <h2 className="text-base font-bold text-[#1F2937]">Browse Topics</h2>
        </div>

        <div className="px-6 mb-3">
          <div className="w-full h-32 rounded-2xl shadow-lg overflow-hidden relative">
            <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800" alt="Offers" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
            <h3 className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-bold text-white">Offers</h3>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 px-6">
          {visibleTopics.map((topic) => (
            <button key={topic.id} onClick={() => navigate(createPageUrl("TopicDetail") + `?topic=${topic.name}`)} className="rounded-2xl shadow-sm hover:shadow-md overflow-hidden relative" style={{ aspectRatio: '3/4' }}>
              <img src={topic.image} alt={topic.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <span className="absolute bottom-3 left-3 font-bold text-white text-base">{topic.name}</span>
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
        <div className="relative w-16 h-16 mb-2">
          <svg viewBox="0 0 120 120" className="w-full h-full">
            <ellipse cx="45" cy="60" rx="30" ry="45" transform="rotate(45 45 60)" fill="#1F2937" opacity="0.9" />
            <ellipse cx="75" cy="60" rx="30" ry="45" transform="rotate(135 75 60)" fill="#1F2937" opacity="0.9" />
          </svg>
        </div>
        <p className="text-xs text-[#1F2937] font-semibold">DeaLo</p>
      </div>

      <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
    </div>
  );
}