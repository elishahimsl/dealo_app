import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Search, Camera, Sparkles, Scale, ScanSearch, Leaf, Zap, Award, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
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
    { id: 1, name: "Target", logo: "https://logo.clearbit.com/target.com" },
    { id: 2, name: "Walmart", logo: "https://logo.clearbit.com/walmart.com" },
    { id: 3, name: "Amazon", logo: "https://logo.clearbit.com/amazon.com" },
    { id: 4, name: "Best Buy", logo: "https://logo.clearbit.com/bestbuy.com" },
    { id: 5, name: "Costco", logo: "https://logo.clearbit.com/costco.com" },
    { id: 6, name: "CVS", logo: "https://logo.clearbit.com/cvs.com" },
  ];

  const brands = [
    { id: 1, name: "Nike", logo: "https://logo.clearbit.com/nike.com" },
    { id: 2, name: "Apple", logo: "https://logo.clearbit.com/apple.com" },
    { id: 3, name: "Samsung", logo: "https://logo.clearbit.com/samsung.com" },
    { id: 4, name: "Sony", logo: "https://logo.clearbit.com/sony.com" },
    { id: 5, name: "Adidas", logo: "https://logo.clearbit.com/adidas.com" },
    { id: 6, name: "Canon", logo: "https://logo.clearbit.com/canon.com" },
  ];

  const allTopics = [
    { id: 9, name: "Women", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400" },
    { id: 10, name: "Men", image: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=400" },
    { id: 1, name: "Sports", image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400" },
    { id: 2, name: "Health", image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400" },
    { id: 3, name: "Fashion", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400" },
    { id: 4, name: "Tech", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400" },
    { id: 5, name: "Food", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400" },
    { id: 6, name: "Home", image: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400" },
    { id: 7, name: "Beauty", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400" },
    { id: 8, name: "Toys", image: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400" },
    { id: 11, name: "Kids", image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400" },
    { id: 12, name: "Pets", image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400" },
    { id: 13, name: "Books", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400" },
    { id: 14, name: "Garden", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400" },
    { id: 15, name: "Auto", image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400" },
  ];

  const visibleTopics = showAllTopics ? allTopics : allTopics.slice(0, 12);

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      {/* Search Bar with Camera Button */}
      <div className="px-6 pt-8 mb-4">
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
            <Input
              placeholder="Search products, tools, or topics..."
              className="pl-10 h-10 rounded-2xl border-[#E5E7EB] bg-white text-[#1F2937] text-sm"
              style={{ fontFamily: 'Inter, sans-serif' }}
            />
          </div>
          <button className="w-10 h-10 rounded-2xl bg-white border border-[#E5E7EB] flex items-center justify-center hover:bg-[#F9FAFB] transition-colors">
            <Camera className="w-4 h-4 text-[#6B7280]" />
          </button>
        </div>
      </div>

      {/* ShopSmart Tools */}
      <div className="px-6 mb-4">
        <div className="mb-2">
          <h2 className="text-xs font-bold text-[#1F2937]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            ShopSmart Tools
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {specialTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => navigate(createPageUrl(tool.page))}
                className="bg-white rounded-xl p-2 border border-[#E5E7EB] shadow-sm flex flex-col items-center hover:border-[#00A36C] transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#00A36C] flex items-center justify-center mb-1">
                  <Icon className="w-4 h-4 text-white" strokeWidth={2} />
                </div>
                <span className="text-[9px] font-semibold text-[#1F2937] text-center leading-tight">
                  {tool.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search by Store - Horizontal Scroll with rectangular tiles */}
      <div className="mb-4">
        <div className="px-6 mb-2 flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#1F2937]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Search by Store
          </h2>
          <button onClick={() => navigate(createPageUrl("AllStores"))} className="text-[#6B7280]">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-6">
          {stores.map((store) => (
            <a 
              key={store.id}
              href={`https://${store.name.toLowerCase().replace(' ', '')}.com`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm hover:shadow-md transition-all relative overflow-hidden flex items-center justify-center"
              style={{ width: '140px', height: '80px' }}
            >
              <img 
                src={store.logo} 
                alt={store.name}
                className="max-w-[80%] max-h-[60%] object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </a>
          ))}
        </div>
      </div>

      {/* Search by Brand - Horizontal Scroll with rectangular tiles */}
      <div className="mb-4">
        <div className="px-6 mb-2 flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#1F2937]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Search by Brand
          </h2>
          <button onClick={() => navigate(createPageUrl("AllBrands"))} className="text-[#6B7280]">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-6">
          {brands.map((brand) => (
            <a 
              key={brand.id}
              href={`https://${brand.name.toLowerCase()}.com`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm hover:shadow-md transition-all relative overflow-hidden flex items-center justify-center"
              style={{ width: '140px', height: '80px' }}
            >
              <img 
                src={brand.logo} 
                alt={brand.name}
                className="max-w-[80%] max-h-[60%] object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </a>
          ))}
        </div>
      </div>

      {/* Browse Topics Section with big banner on top */}
      <div className="mb-4">
        <div className="px-6 mb-3">
          <h2 className="text-base font-bold text-[#1F2937]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Browse Topics
          </h2>
        </div>

        {/* Offers Banner with Stock Image */}
        <div className="px-6 mb-3">
          <div className="w-full h-32 rounded-2xl shadow-lg overflow-hidden relative">
            <img 
              src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800" 
              alt="Offers"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
            <h3 className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Offers
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 px-6">
          {visibleTopics.map((topic) => (
            <button 
              key={topic.id}
              className="rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden relative"
              style={{ aspectRatio: '3/4' }}
            >
              <img 
                src={topic.image} 
                alt={topic.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <span className="absolute bottom-3 left-3 font-bold text-white text-base">
                {topic.name}
              </span>
            </button>
          ))}
        </div>

        {/* More/Less Button */}
        <div className="px-6 mt-3 flex justify-center">
          <Button
            onClick={() => setShowAllTopics(!showAllTopics)}
            variant="outline"
            className="rounded-2xl border-2 border-[#00A36C] text-[#00A36C] hover:bg-[#00A36C] hover:text-white font-semibold"
          >
            {showAllTopics ? 'Show Less' : 'More Topics'}
          </Button>
        </div>
      </div>

      {/* Greyed out logo at bottom */}
      <div className="px-6 pb-8 pt-4">
        <div className="flex flex-col items-center opacity-30">
          <div className="relative w-16 h-16 mb-2">
            <svg viewBox="0 0 120 120" className="w-full h-full">
              <ellipse
                cx="45"
                cy="60"
                rx="30"
                ry="45"
                transform="rotate(45 45 60)"
                fill="#1F2937"
                opacity="0.9"
              />
              <ellipse
                cx="75"
                cy="60"
                rx="30"
                ry="45"
                transform="rotate(135 75 60)"
                fill="#1F2937"
                opacity="0.9"
              />
            </svg>
          </div>
          <p className="text-xs text-[#1F2937] font-semibold">ShopSmart</p>
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