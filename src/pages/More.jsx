import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Search, Scale, ScanSearch, Zap, Award, ChevronRight, Camera, Tag, ShoppingBag, User, Dumbbell, Heart, Shirt, Smartphone, UtensilsCrossed, Home as HomeIcon, Sparkles, Baby, PawPrint, BookOpen, Flower2, Car } from "lucide-react";
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
    { id: 1, name: "Amazon", url: "https://amazon.com", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
    { id: 2, name: "Walmart", url: "https://walmart.com", logo: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Walmart_logo.svg" },
    { id: 3, name: "Target", url: "https://target.com", logo: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Target_logo.svg" },
    { id: 4, name: "Best Buy", url: "https://bestbuy.com", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f5/Best_Buy_Logo.svg" },
    { id: 5, name: "Costco", url: "https://costco.com", logo: "https://upload.wikimedia.org/wikipedia/commons/5/59/Costco_Wholesale_logo_2010-10-26.svg" },
    { id: 6, name: "Sam's Club", url: "https://samsclub.com", logo: "https://upload.wikimedia.org/wikipedia/commons/8/81/Sams_Club.svg" },
    { id: 7, name: "Home Depot", url: "https://homedepot.com", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5f/TheHomeDepot.svg" },
    { id: 8, name: "Lowe's", url: "https://lowes.com", logo: "https://upload.wikimedia.org/wikipedia/commons/8/8f/Lowe%27s_Companies_logo.svg" },
    { id: 9, name: "IKEA", url: "https://ikea.com", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Ikea_logo.svg" },
    { id: 10, name: "Macy's", url: "https://macys.com", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b6/Macys_logo.svg" },
    { id: 11, name: "Kohl's", url: "https://kohls.com", logo: "https://upload.wikimedia.org/wikipedia/commons/1/18/Kohl%27s_logo.svg" },
  ];

  const brands = [
    { id: 1, name: "Apple", url: "https://apple.com", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
    { id: 2, name: "Samsung", url: "https://samsung.com", logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg" },
    { id: 3, name: "Nike", url: "https://nike.com", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg" },
    { id: 4, name: "Adidas", url: "https://adidas.com", logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg" },
    { id: 5, name: "Sony", url: "https://sony.com", logo: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg" },
    { id: 6, name: "Microsoft", url: "https://microsoft.com", logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
    { id: 7, name: "Levi's", url: "https://levis.com", logo: "https://upload.wikimedia.org/wikipedia/commons/4/47/Levi%27s_logo.svg" },
    { id: 8, name: "The North Face", url: "https://thenorthface.com", logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/The_North_Face_logo.svg" },
    { id: 9, name: "Patagonia", url: "https://patagonia.com", logo: "https://upload.wikimedia.org/wikipedia/commons/4/49/Patagonia_logo.svg" },
    { id: 10, name: "KitchenAid", url: "https://kitchenaid.com", logo: "https://upload.wikimedia.org/wikipedia/commons/d/de/KitchenAid_Logo.svg" },
    { id: 11, name: "Dyson", url: "https://dyson.com", logo: "https://upload.wikimedia.org/wikipedia/commons/7/74/Dyson_logo.svg" },
    { id: 12, name: "Columbia", url: "https://columbia.com", logo: "https://upload.wikimedia.org/wikipedia/commons/6/60/Columbia_Sportswear_logo.svg" },
    { id: 13, name: "Ray-Ban", url: "https://ray-ban.com", logo: "https://upload.wikimedia.org/wikipedia/commons/6/69/Ray-Ban_logo.svg" },
    { id: 14, name: "Coach", url: "https://coach.com", logo: "https://upload.wikimedia.org/wikipedia/commons/8/89/Coach_logo.svg" },
  ];

  const allTopics = [
    { id: 9, name: "Women", icon: User, gradient: "from-gray-100 to-gray-200" },
    { id: 10, name: "Men", icon: User, gradient: "from-gray-100 to-gray-200" },
    { id: 1, name: "Sports", icon: Dumbbell, gradient: "from-gray-100 to-gray-200" },
    { id: 2, name: "Health", icon: Heart, gradient: "from-gray-100 to-gray-200" },
    { id: 3, name: "Fashion", icon: Shirt, gradient: "from-gray-100 to-gray-200" },
    { id: 4, name: "Tech", icon: Smartphone, gradient: "from-gray-100 to-gray-200" },
    { id: 5, name: "Food", icon: UtensilsCrossed, gradient: "from-gray-100 to-gray-200" },
    { id: 6, name: "Home", icon: HomeIcon, gradient: "from-gray-100 to-gray-200" },
    { id: 7, name: "Beauty", icon: Sparkles, gradient: "from-gray-100 to-gray-200" },
    { id: 8, name: "Toys", icon: Baby, gradient: "from-gray-100 to-gray-200" },
    { id: 11, name: "Kids", icon: Baby, gradient: "from-gray-100 to-gray-200" },
    { id: 12, name: "Pets", icon: PawPrint, gradient: "from-gray-100 to-gray-200" },
    { id: 13, name: "Books", icon: BookOpen, gradient: "from-gray-100 to-gray-200" },
    { id: 14, name: "Garden", icon: Flower2, gradient: "from-gray-100 to-gray-200" },
    { id: 15, name: "Auto", icon: Car, gradient: "from-gray-100 to-gray-200" },
  ];

  const visibleTopics = showAllTopics ? allTopics : allTopics.slice(0, 6);

  return (
    <div className="min-h-screen bg-white pb-24 relative overflow-hidden">
      {/* Green gradient splash in top left */}
      <div 
        className="absolute top-0 left-0 w-96 h-96 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at top left, rgba(0, 163, 108, 0.12) 0%, rgba(0, 163, 108, 0.06) 40%, transparent 70%)',
          zIndex: 0
        }}
      />
      {/* Search Bar */}
      <div className="px-6 pt-6 mb-4 relative z-10">
        <div className="w-full h-10 rounded-2xl bg-[#E5E7EB] flex items-center px-4 gap-2">
          <button onClick={() => navigate(createPageUrl("DiscoverSearch"))} className="flex-1 flex items-center gap-2">
            <Search className="w-4 h-4 text-[#6B7280]" />
            <span className="text-sm text-[#6B7280]">Search</span>
          </button>
          <button onClick={() => navigate(createPageUrl("Snap") + "?from=More")}>
            <Camera className="w-4 h-4 text-[#6B7280]" />
          </button>
        </div>
      </div>

      {/* DeaLo Tools */}
      <div className="px-6 mb-4 relative z-10">
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
      <div className="mb-4 relative z-10">
        <div className="px-6 mb-2 flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#1F2937]">Search by Store</h2>
          <button onClick={() => navigate(createPageUrl("AllStores"))}><ChevronRight className="w-5 h-5 text-[#6B7280]" /></button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-6">
          {stores.slice(0, 6).map((store) => (
            <button key={store.id} onClick={() => navigate(createPageUrl("StoreDetail") + `?store=${encodeURIComponent(store.name)}`)} className="flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-sm border border-[#E5E7EB] flex flex-col items-center justify-center p-4" style={{ width: '130px', height: '80px' }}>
              <img src={store.logo} alt={store.name} className="w-14 h-14 object-contain" style={{ borderRadius: '8px' }} />
            </button>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div className="mb-4 relative z-10">
        <div className="px-6 mb-2 flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#1F2937]">Search by Brand</h2>
          <button onClick={() => navigate(createPageUrl("AllBrands"))}><ChevronRight className="w-5 h-5 text-[#6B7280]" /></button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-6">
          {brands.slice(0, 6).map((brand) => (
            <button key={brand.id} onClick={() => navigate(createPageUrl("StoreDetail") + `?store=${encodeURIComponent(brand.name)}`)} className="flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-sm border border-[#E5E7EB] flex flex-col items-center justify-center p-4" style={{ width: '130px', height: '80px' }}>
              <img src={brand.logo} alt={brand.name} className="w-14 h-14 object-contain" style={{ borderRadius: '8px' }} />
            </button>
          ))}
        </div>
      </div>

      {/* Topics */}
      <div className="mb-4 relative z-10">
        <div className="px-6 mb-3">
          <button onClick={() => navigate(createPageUrl("DealsNearYou"))} className="w-full h-24 rounded-2xl shadow-lg overflow-hidden relative bg-gradient-to-r from-[#00A36C] to-emerald-600">
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20">
              <Tag className="w-16 h-16 text-white transform -rotate-12" />
            </div>
            <h3 className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-white">Deals</h3>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 px-6">
          {visibleTopics.map((topic) => {
            const Icon = topic.icon;
            return (
              <button key={topic.id} onClick={() => navigate(createPageUrl("TopicDetail") + `?topic=${topic.name}`)} className={`rounded-2xl shadow-sm hover:shadow-md overflow-hidden relative bg-gradient-to-br ${topic.gradient} border border-[#E5E7EB]`} style={{ height: '80px' }}>
                <div className="absolute right-2 top-2">
                  <Icon className="w-7 h-7 text-[#00A36C]" strokeWidth={1.5} />
                </div>
                <span className="absolute bottom-2 left-3 font-bold text-[#1F2937] text-sm">{topic.name}</span>
              </button>
            );
          })}
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