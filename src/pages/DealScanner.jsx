import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Search, Camera, Heart, Tag, Cpu, Store, Bell } from "lucide-react";

export default function DealScanner() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(false);

  const toggleFavorite = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const todaysBestDeals = [
    { id: 1, name: "Apple Watch", brand: "Amazon", price: "$149", originalPrice: "$199", save: "Save $50", image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300" },
    { id: 2, name: "Headphones", brand: "BET", price: "$39", originalPrice: "$99", save: "Save $20", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300" },
    { id: 3, name: "72\" TV", brand: "VIZIO", price: "$60", originalPrice: "$100", save: "50% OFF", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300" },
  ];

  const trendingCategories = [
    { id: "all", name: "All" },
    { id: "tech", name: "Tech" },
    { id: "clothing", name: "Clothing" },
    { id: "home", name: "Home" },
    { id: "beauty", name: "Beauty" },
  ];

  const [trendingPriceDrops, setTrendingPriceDrops] = useState([
    { id: 101, name: "iPhone 15 Pro", brand: "Apple", price: "$800", originalPrice: "$1100", discount: "-27%", images: ["https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300", "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=300"], category: "tech" },
    { id: 102, name: "Quarter-Zip", brand: "Banana Republic", price: "$75", originalPrice: "$100", discount: "-40%", images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300", "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300"], category: "clothing" },
    { id: 103, name: "Sofa Set", brand: "IKEA", price: "$499", originalPrice: "$799", discount: "-38%", images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300"], category: "home" },
    { id: 104, name: "Face Cream", brand: "CeraVe", price: "$12", originalPrice: "$18", discount: "-33%", images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300"], category: "beauty" },
    { id: 105, name: "MacBook Air", brand: "Apple", price: "$899", originalPrice: "$1199", discount: "-25%", images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300"], category: "tech" },
    { id: 106, name: "Hoodie", brand: "Nike", price: "$45", originalPrice: "$75", discount: "-40%", images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300"], category: "clothing" },
  ]);

  const morePriceDrops = [
    { id: 107, name: "Smart Watch", brand: "Samsung", price: "$199", originalPrice: "$299", discount: "-33%", images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300"], category: "tech" },
    { id: 108, name: "Denim Jacket", brand: "Levi's", price: "$59", originalPrice: "$98", discount: "-40%", images: ["https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=300"], category: "clothing" },
    { id: 109, name: "Table Lamp", brand: "Target", price: "$29", originalPrice: "$49", discount: "-41%", images: ["https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=300"], category: "home" },
    { id: 110, name: "Lipstick Set", brand: "MAC", price: "$35", originalPrice: "$55", discount: "-36%", images: ["https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300"], category: "beauty" },
  ];

  const loadMorePriceDrops = () => {
    if (loading) return;
    setLoading(true);
    setTimeout(() => {
      const newDrops = morePriceDrops.map(d => ({ ...d, id: d.id + Math.random() * 10000 }));
      setTrendingPriceDrops(prev => [...prev, ...newDrops]);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        loadMorePriceDrops();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [trendingPriceDrops, loading]);

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="relative flex items-center justify-center group">
          <Tag className="w-5 h-5 text-[#00A36C] transform -rotate-45 group-hover:rotate-0 transition-transform duration-300 group-hover:scale-110" />
        </button>
        <h1 className="text-base font-semibold text-[#1F2937]">Deal Scanner</h1>
        <div className="w-5" />
      </div>

      <div className="px-6 space-y-6">
        {/* Search Bar */}
        <div className="flex items-center gap-2 bg-[#E5E7EB] rounded-2xl px-4 py-3">
          <Search className="w-4 h-4 text-[#6B7280]" />
          <input
            placeholder="Search Products"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#6B7280]"
          />
          <button>
            <Camera className="w-4 h-4 text-[#6B7280]" />
          </button>
        </div>

        {/* Tool Buttons */}
        <div className="flex gap-3">
          <button 
            onClick={() => navigate(createPageUrl("AIDealFinder"))}
            className="flex-1 bg-[#E5E7EB] rounded-2xl p-3 flex items-center gap-2 justify-center"
          >
            <Cpu className="w-5 h-5 text-[#00A36C]" />
            <span className="text-xs font-semibold text-[#1F2937]">AI Deal Finder</span>
          </button>
          <button 
            onClick={() => navigate(createPageUrl("CompareStores"))}
            className="flex-1 bg-[#E5E7EB] rounded-2xl p-3 flex items-center gap-2 justify-center"
          >
            <Store className="w-5 h-5 text-[#00A36C]" />
            <span className="text-xs font-semibold text-[#1F2937]">Compare Stores</span>
          </button>
        </div>

        {/* Today's Best Deals */}
        <div>
          <h2 className="text-sm font-bold text-[#1F2937] mb-3">Today's Best Deals</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {todaysBestDeals.map((deal) => (
              <div key={deal.id} className="flex-shrink-0" style={{ width: '120px' }}>
                <div className="aspect-square rounded-2xl overflow-hidden relative mb-2 bg-[#F3F4F6]">
                  <img src={deal.image} alt="" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => toggleFavorite(deal.id)}
                    className={`absolute bottom-2 right-2 w-6 h-6 rounded-full flex items-center justify-center ${
                      favorites.includes(deal.id) ? 'bg-[#00A36C]' : 'bg-[#6B7280]/60'
                    }`}
                  >
                    <Heart className={`w-3 h-3 ${favorites.includes(deal.id) ? 'text-white fill-white' : 'text-white'}`} />
                  </button>
                </div>
                <p className="text-xs font-medium text-[#1F2937]">{deal.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Price Drops */}
        <div>
          <div className="flex items-center justify-between mb-3 -mx-6 px-6">
            <h2 className="text-sm font-bold text-[#1F2937]">Trending Price Drops</h2>
            <button>
              <Bell className="w-4 h-4 text-[#6B7280]" />
            </button>
          </div>
          
          {/* Category pills */}
          <div className="flex gap-6 overflow-x-auto pb-3 scrollbar-hide justify-between -mx-6 px-6">
            {trendingCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`text-xs font-medium whitespace-nowrap ${
                  activeCategory === cat.id 
                    ? 'bg-[#E5E7EB] text-[#1F2937] px-3 py-1 rounded-full' 
                    : 'text-[#6B7280]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Price drop cards - 2 column grid - infinite scroll */}
          <div className="grid grid-cols-2 gap-3">
            {(activeCategory === "all" ? trendingPriceDrops : trendingPriceDrops.filter(item => item.category === activeCategory)).map((item) => (
              <div key={item.id}>
                <div className="aspect-square rounded-2xl overflow-hidden relative mb-2 bg-[#F3F4F6]">
                  <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => toggleFavorite(item.id)}
                    className={`absolute bottom-2 right-2 w-6 h-6 rounded-full flex items-center justify-center ${
                      favorites.includes(item.id) ? 'bg-[#00A36C]' : 'bg-[#6B7280]/60'
                    }`}
                  >
                    <Heart className={`w-3 h-3 ${favorites.includes(item.id) ? 'text-white fill-white' : 'text-white'}`} />
                  </button>
                  {/* Dots */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                    {item.images.map((_, idx) => (
                      <div key={idx} className={`w-1 h-1 rounded-full ${idx === 0 ? 'bg-white' : 'bg-white/50'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-xs font-medium text-[#1F2937]">{item.name}</p>
              </div>
            ))}
          </div>

          {/* Loading indicator */}
          {loading && (
            <div className="flex justify-center py-4 mt-3">
              <div className="w-6 h-6 border-2 border-[#00A36C] border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}