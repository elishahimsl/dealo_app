import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Tag, Camera, Search, Heart, ChevronRight, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PriceDrop() {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [timeRange, setTimeRange] = useState("30 days");
  const [trendingIndex, setTrendingIndex] = useState(0);

  const recentlyViewed = [
    { id: 1, price: "$89.99", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300", title: "Wireless Headphones" },
    { id: 2, price: "$59.99", image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300", title: "Bluetooth Speaker" },
    { id: 3, price: "$149.99", image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300", title: "Smart Watch" },
    { id: 4, price: "$79.99", image: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=300", title: "Sneakers" },
  ];

  const recentlyDropped = [
    { id: 101, name: "Apple MacBook Pro", price: "$1,799", originalPrice: "$2,149", discount: "-16%", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300", brand: "Apple" },
    { id: 102, name: "iPhone 13 Pro", price: "$899", originalPrice: "$1,100", discount: "-20%", image: "https://images.unsplash.com/photo-1632661674596-df8be59a5ed3?w=300", brand: "Apple" },
    { id: 103, name: "Sony WH-1000XM4", price: "$248", originalPrice: "$349", discount: "-29%", image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=300", brand: "Sony" },
    { id: 104, name: "iPad Air", price: "$499", originalPrice: "$599", discount: "-17%", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300", brand: "Apple" },
  ];

  const trendingProducts = [
    { price: "$219.99", originalPrice: "$349.99", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400", title: "4K Smart TV", store: "Target", storeLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Target_logo.svg/1200px-Target_logo.svg.png" },
    { price: "$89.99", originalPrice: "$149.99", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400", title: "Wireless Headphones", store: "Amazon", storeLogo: "https://logo.clearbit.com/amazon.com" },
    { price: "$249.99", originalPrice: "$399.99", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", title: "Running Shoes", store: "Nike", storeLogo: "https://logo.clearbit.com/nike.com" },
  ];

  const toggleFavorite = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  // Product Analysis View
  if (selectedProduct) {
    const priceHistory = [100, 95, 92, 88, 94, 90, 85, 82, 78, 75];
    const cheapestStores = [
      { store: "Amazon", price: "$34.99", logo: "https://logo.clearbit.com/amazon.com" },
      { store: "Target", price: "$39.99", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Target_logo.svg/1200px-Target_logo.svg.png" },
      { store: "Walmart", price: "$37.99", logo: "https://logo.clearbit.com/walmart.com" },
    ];

    return (
      <div className="min-h-screen bg-white pb-24">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between bg-white">
          <button onClick={() => setSelectedProduct(null)} className="relative flex items-center justify-center group">
            <Tag className="w-5 h-5 text-[#00A36C] transform -rotate-45 group-hover:rotate-0 transition-transform duration-300 group-hover:scale-110" />
          </button>
          <h1 className="text-base font-medium text-[#1F2937]">Track Price</h1>
          <button className="w-8 h-8 rounded-full bg-[#F3F4F6] flex items-center justify-center">
            <Bell className="w-4 h-4 text-[#6B7280]" />
          </button>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Product Info - Full width */}
          <div className="flex gap-4">
            <div className="w-32 h-36 rounded-xl bg-[#F3F4F6] overflow-hidden flex-shrink-0">
              <img src={selectedProduct.image} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 py-1">
              <h2 className="font-bold text-[#1F2937] text-base mb-2">{selectedProduct.name || selectedProduct.title}</h2>
              <p className="text-xl font-bold text-[#4B5563] mb-1">{selectedProduct.price}</p>
              <div className="flex items-center gap-1">
                <span className="text-sm text-[#00A36C] font-medium">↓ 6%</span>
                <span className="text-sm text-[#6B7280]">(avg. $95)</span>
              </div>
            </div>
          </div>

          {/* Price Chart - No tile, with grid */}
          <div className="relative mt-2">
            {/* Time range headers */}
            <div className="flex justify-between mb-2">
              {["30 days", "90 days", "1 year"].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`text-[10px] font-medium ${timeRange === range ? 'text-[#00A36C]' : 'text-[#9CA3AF]'}`}
                >
                  {range}
                </button>
              ))}
            </div>
            {/* Line underneath headers */}
            <div className="flex items-center mb-3">
              <div className="flex-1 h-0.5 bg-[#E5E7EB] relative">
                <div 
                  className="absolute top-0 h-0.5 bg-[#00A36C] transition-all"
                  style={{ 
                    left: timeRange === "30 days" ? '0%' : timeRange === "90 days" ? '33%' : '66%',
                    width: '33%'
                  }}
                />
              </div>
            </div>

            {/* Chart with grid */}
            <div className="relative h-36">
              {/* Y-axis labels - RIGHT SIDE */}
              <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-between text-[9px] text-[#9CA3AF] w-7 items-end">
                <span>$100</span>
                <span>$85</span>
                <span>$70</span>
                <span>$55</span>
                <span>$40</span>
              </div>

              {/* Chart area */}
              <div className="mr-8 h-full relative">
                <svg viewBox="0 0 300 100" className="w-full h-full" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="glowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#00A36C" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#00A36C" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Horizontal grid lines */}
                  {[0, 25, 50, 75, 100].map((y) => (
                    <line key={y} x1="0" y1={y} x2="300" y2={y} stroke="#E5E7EB" strokeWidth="0.5" />
                  ))}
                  
                  {/* Vertical grid lines */}
                  {[0, 60, 120, 180, 240, 300].map((x) => (
                    <line key={x} x1={x} y1="0" x2={x} y2="100" stroke="#E5E7EB" strokeWidth="0.5" />
                  ))}
                  
                  {/* Glow area */}
                  <path
                    d={`M0,${100 - priceHistory[0]} ${priceHistory.map((p, i) => `L${i * 33},${100 - p}`).join(' ')} L${(priceHistory.length - 1) * 33},100 L0,100 Z`}
                    fill="url(#glowGradient)"
                  />
                  
                  {/* Price line */}
                  <polyline
                    points={priceHistory.map((p, i) => `${i * 33},${100 - p}`).join(' ')}
                    fill="none"
                    stroke="#00A36C"
                    strokeWidth="2"
                  />
                  
                  {/* Current point */}
                  <circle cx={(priceHistory.length - 1) * 33} cy={100 - priceHistory[priceHistory.length - 1]} r="5" fill="#00A36C" />
                </svg>
              </div>
              
              {/* X-axis labels below chart */}
              <div className="flex justify-between text-[9px] text-[#9CA3AF] mr-8 mt-2">
                <span>3</span>
                <span>10</span>
                <span>17</span>
                <span>24</span>
                <span>30</span>
              </div>
            </div>
          </div>

          {/* Next Drop Prediction - Header outside tile */}
          <div className="mt-12">
            <h3 className="font-bold text-[#1F2937] mb-3 text-sm">Next Drop</h3>
            <div className="bg-[#F9FAFB] rounded-xl p-4 border border-[#E5E7EB]">
              <p className="text-2xl font-bold text-[#1F2937] mb-2">$30 - $35</p>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-[#6B7280]">
                  {65 < 25 ? 'Low Confidence' : 65 <= 50 ? 'Moderate Confidence' : 65 <= 75 ? 'Moderate Confidence' : 'High Confidence'}
                </span>
                <div 
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                    65 < 25 ? 'border-red-500' : 65 <= 50 ? 'border-yellow-500' : 65 <= 75 ? 'border-yellow-500' : 'border-[#00A36C]'
                  }`}
                >
                  <span 
                    className={`text-[10px] font-bold ${
                      65 < 25 ? 'text-red-500' : 65 <= 50 ? 'text-yellow-500' : 65 <= 75 ? 'text-yellow-500' : 'text-[#00A36C]'
                    }`}
                  >
                    65%
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#6B7280]">Timing</span>
                <span className="bg-[#1F2937] text-white text-xs px-2 py-1 rounded">2-6 months</span>
              </div>
            </div>
          </div>

          {/* Cheapest Stores - Like saved product tiles */}
          <div>
            <h3 className="font-bold text-[#1F2937] mb-3 text-sm">Cheapest</h3>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {cheapestStores.map((s, idx) => (
                <div key={idx} className="flex-shrink-0" style={{ width: '110px' }}>
                  {/* Product tile with full image */}
                  <div className="aspect-square rounded-2xl overflow-hidden relative mb-2">
                    <img src={selectedProduct.image} alt="" className="w-full h-full object-cover" />
                    {/* Price badge - semi-transparent, tight fit */}
                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm rounded px-1 py-0.5">
                      <span className="text-[9px] font-bold text-white leading-none">{s.price}</span>
                    </div>
                    {/* Heart bottom right */}
                    <button 
                      onClick={() => toggleFavorite(s.store)}
                      className={`absolute bottom-2 right-2 w-6 h-6 rounded-full flex items-center justify-center ${
                        favorites.includes(s.store) ? 'bg-[#00A36C]' : 'bg-[#6B7280]/60'
                      }`}
                    >
                      <Heart className={`w-3 h-3 ${favorites.includes(s.store) ? 'text-white fill-white' : 'text-white'}`} />
                    </button>
                  </div>
                  {/* Brand with logo underneath */}
                  <div className="flex items-center gap-1">
                    <img src={s.logo} alt="" className="w-3 h-3 object-contain" />
                    <span className="text-[10px] font-medium text-[#1F2937]">{s.store}</span>
                  </div>
                  {/* Visit store link - underlined */}
                  <button className="text-[9px] text-[#00A36C] font-medium underline">Visit Store</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <style>{`
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </div>
    );
  }

  // Main PriceDrop Page
  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="relative flex items-center justify-center group">
          <Tag className="w-5 h-5 text-[#00A36C] transform -rotate-45 group-hover:rotate-0 transition-transform duration-300 group-hover:scale-110" />
        </button>
        <h1 className="text-base font-medium text-[#1F2937]">PriceDrop</h1>
        <div className="w-5" />
      </div>

      {/* Search Bar */}
      <div className="px-6 mb-6">
        <div className="flex items-center gap-2 bg-[#E5E7EB] rounded-2xl px-4 py-3">
          <Search className="w-4 h-4 text-[#6B7280]" />
          <input
            placeholder="Search products..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#6B7280]"
          />
          <button>
            <Camera className="w-4 h-4 text-[#6B7280]" />
          </button>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Trending Carousel - Swipeable with dots */}
        <div>
          <div className="rounded-2xl overflow-hidden relative" style={{ height: '140px' }}>
            <div className="absolute inset-0 bg-gradient-to-t from-[#1F2937] via-[#1F2937]/60 to-transparent z-10" />
            <img src={trendingProducts[trendingIndex].image} alt="" className="w-full h-full object-cover" />
            
            {/* Trending badge top right */}
            <div className="absolute top-3 right-3 z-20">
              <span className="bg-[#00A36C] text-white text-[9px] font-bold px-2 py-0.5 rounded">
                Trending
              </span>
            </div>
            
            {/* Bottom info */}
            <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
              {/* Store logo and name */}
              <div className="flex items-center gap-1.5 mb-1">
                <img src={trendingProducts[trendingIndex].storeLogo} alt="" className="w-4 h-4 object-contain" />
                <span className="text-white/90 text-[10px] font-medium">{trendingProducts[trendingIndex].store}</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-white text-sm font-bold">{trendingProducts[trendingIndex].price}</span>
                <span className="text-white/60 text-xs line-through">{trendingProducts[trendingIndex].originalPrice}</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-white/90 text-xs">{trendingProducts[trendingIndex].title}</p>
                <Button 
                  onClick={() => setSelectedProduct(trendingProducts[trendingIndex])}
                  className="bg-[#00A36C] hover:bg-[#007E52] text-white text-[10px] px-3 py-1 h-auto rounded-full"
                >
                  Analyze
                </Button>
              </div>
            </div>
          </div>
          
          {/* Dots */}
          <div className="flex justify-center gap-1.5 mt-2">
            {trendingProducts.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setTrendingIndex(idx)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === trendingIndex ? 'bg-[#1F2937]' : 'bg-[#D1D5DB]'}`}
              />
            ))}
          </div>
        </div>

        {/* Recently Viewed - Smaller tiles */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-sm font-bold text-[#1F2937]">Recently Viewed</h2>
            <div className="w-5 h-5 rounded-full bg-[#E5E7EB] flex items-center justify-center">
              <ChevronRight className="w-3 h-3 text-[#6B7280]" />
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {recentlyViewed.slice(0, 3).map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedProduct(item)}
                className="flex-shrink-0 rounded-xl overflow-hidden bg-[#F3F4F6]"
                style={{ width: '100px', height: '100px' }}
              >
                <div className="w-full h-full relative">
                  <img src={item.image} alt="" className="w-full h-full object-cover" />
                  <div className="absolute top-1.5 left-1.5 bg-black/40 backdrop-blur-sm rounded px-1 py-0.5">
                    <span className="text-[9px] font-bold text-white leading-none">{item.price}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recently Dropped - Like saved product tiles */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-sm font-bold text-[#1F2937]">Recently Dropped</h2>
            <div className="w-5 h-5 rounded-full bg-[#E5E7EB] flex items-center justify-center">
              <ChevronRight className="w-3 h-3 text-[#6B7280]" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {recentlyDropped.slice(0, 4).map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedProduct(item)}
                className="text-left"
              >
                {/* Product tile - full image */}
                <div className="aspect-square rounded-2xl overflow-hidden relative mb-2">
                  <img src={item.image} alt="" className="w-full h-full object-cover" />
                  {/* Price badge - semi-transparent, tight fit */}
                  <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm rounded px-1 py-0.5">
                    <span className="text-[9px] font-bold text-white leading-none">{item.price}</span>
                  </div>
                  {/* Heart bottom right */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id); }}
                    className={`absolute bottom-2 right-2 w-6 h-6 rounded-full flex items-center justify-center ${
                      favorites.includes(item.id) ? 'bg-[#00A36C]' : 'bg-[#6B7280]/60'
                    }`}
                  >
                    <Heart className={`w-3 h-3 ${favorites.includes(item.id) ? 'text-white fill-white' : 'text-white'}`} />
                  </button>
                </div>
                {/* Info underneath - no tile */}
                <p className="text-[10px] text-[#6B7280] mb-0.5">{item.brand}</p>
                <p className="text-xs font-medium text-[#1F2937] line-clamp-1 mb-1">{item.name}</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-[#6B7280] line-through">{item.originalPrice}</span>
                  <span className="bg-[#00A36C] text-white text-[8px] font-bold px-1 py-0.5 rounded">{item.discount}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}