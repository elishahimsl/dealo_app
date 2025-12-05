import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Camera, Heart, ThumbsUp, ThumbsDown, SlidersHorizontal } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function DealsNearYou() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [activeFilter, setActiveFilter] = useState("for-you");
  const [likedDeals, setLikedDeals] = useState([]);
  const [dislikedDeals, setDislikedDeals] = useState([]);
  const [deals, setDeals] = useState([
    { id: 1, name: "75\" Samsung TV", brand: "Samsung", store: "Amazon", price: "$1,500", originalPrice: "$3,000", discount: "50% off", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400", category: "tech" },
    { id: 2, name: "Apple Macbook", brand: "Apple", store: "Best Buy", price: "$1,200", originalPrice: "$2,200", discount: "45% off", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400", category: "tech" },
    { id: 3, name: "Blue Headphones", brand: "Skull Candy", store: "Target", price: "$35", originalPrice: "$65", discount: "Save $30", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400", category: "tech" },
    { id: 4, name: "Brown Chair", brand: "IKEA", store: "Amazon", price: "$100", originalPrice: "$200", discount: "Save $100", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400", category: "home" },
  ]);
  const [loading, setLoading] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState([]);

  const toggleFavorite = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const handleLike = (id) => {
    if (likedDeals.includes(id)) {
      setLikedDeals(prev => prev.filter(d => d !== id));
    } else {
      setLikedDeals(prev => [...prev, id]);
      setDislikedDeals(prev => prev.filter(d => d !== id));
    }
  };

  const handleDislike = (id) => {
    if (dislikedDeals.includes(id)) {
      setDislikedDeals(prev => prev.filter(d => d !== id));
    } else {
      setDislikedDeals(prev => [...prev, id]);
      setLikedDeals(prev => prev.filter(d => d !== id));
    }
  };

  const filters = [
    { id: "for-you", name: "For You" },
    { id: "trending", name: "Trending" },
    { id: "hot-deals", name: "Hot Deals" },
    { id: "new-arrivals", name: "New Arrivals" },
    { id: "limited-time", name: "Limited Time" },
  ];

  const topics = ["Tech", "Fashion", "Home", "Beauty", "Sports", "Food", "Toys", "Auto"];

  const moreDeals = [
    { id: 5, name: "Nike Air Max", brand: "Nike", store: "Nike", price: "$89", originalPrice: "$150", discount: "41% off", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", category: "fashion" },
    { id: 6, name: "Instant Pot", brand: "Instant Pot", store: "Amazon", price: "$59", originalPrice: "$99", discount: "Save $40", image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400", category: "home" },
    { id: 7, name: "AirPods Pro", brand: "Apple", store: "Apple", price: "$189", originalPrice: "$249", discount: "24% off", image: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=400", category: "tech" },
    { id: 8, name: "Yoga Mat", brand: "Lululemon", store: "Target", price: "$48", originalPrice: "$78", discount: "Save $30", image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400", category: "sports" },
    { id: 9, name: "Coffee Maker", brand: "Keurig", store: "Walmart", price: "$79", originalPrice: "$129", discount: "39% off", image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400", category: "home" },
    { id: 10, name: "Smart Watch", brand: "Fitbit", store: "Best Buy", price: "$149", originalPrice: "$229", discount: "35% off", image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400", category: "tech" },
  ];

  const loadMoreDeals = () => {
    if (loading) return;
    setLoading(true);
    setTimeout(() => {
      const newDeals = moreDeals.map(d => ({ ...d, id: d.id + deals.length + Math.random() * 1000 }));
      setDeals(prev => [...prev, ...newDeals]);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        loadMoreDeals();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [deals, loading]);

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      {/* Header with back arrow tag */}
      <div className="px-6 pt-6 pb-4 flex items-center">
        <button onClick={() => navigate(-1)} className="mr-3 group">
          <Tag className="w-5 h-5 text-[#00A36C] transform -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
        </button>
        <h1 className="text-base font-semibold text-[#1F2937]">Deals</h1>
      </div>

      <div className="px-6 space-y-4">
        {/* Search Bar - Thinner */}
        <div className="flex items-center gap-2 bg-[#E5E7EB] rounded-full px-4 py-2">
          <Search className="w-4 h-4 text-[#6B7280]" />
          <input
            placeholder="Search Product"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#6B7280]"
          />
          <button>
            <Camera className="w-4 h-4 text-[#6B7280]" />
          </button>
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                activeFilter === filter.id 
                  ? 'bg-[#1F2937] text-white' 
                  : 'bg-white border border-[#E5E7EB] text-[#1F2937]'
              }`}
            >
              {filter.name}
            </button>
          ))}
        </div>

        {/* Deals based on interests */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#1F2937]">Deals based on your interests</h2>
          <button onClick={() => setShowFilterModal(true)} className="w-7 h-7 rounded-full bg-[#E5E7EB] flex items-center justify-center">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#6B7280]" />
          </button>
        </div>

        {/* Deals Grid - 2 column - infinite scroll */}
        <div className="grid grid-cols-2 gap-3">
          {deals.map((deal) => (
            <div key={deal.id}>
              {/* Product tile with gradient border */}
              <div 
                className="rounded-2xl p-[2px] mb-2"
                style={{
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(200,200,200,0.4) 50%, rgba(150,150,150,0.3) 100%)',
                }}
              >
                <div className="aspect-square rounded-2xl overflow-hidden relative bg-[#F3F4F6]">
                  <img src={deal.image} alt="" className="w-full h-full object-cover" />
                  {/* Discount badge - top left - GREEN */}
                  <div className="absolute top-2 left-2 bg-[#00A36C] text-white text-[9px] font-bold px-2 py-1 rounded">
                    {deal.discount}
                  </div>
                  {/* Heart - bottom right */}
                  <button 
                    onClick={() => toggleFavorite(deal.id)}
                    className={`absolute bottom-2 right-2 w-7 h-7 rounded-full flex items-center justify-center ${
                      favorites.includes(deal.id) ? 'bg-[#00A36C]' : 'bg-[#6B7280]/60'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${favorites.includes(deal.id) ? 'text-white fill-white' : 'text-white'}`} />
                  </button>
                </div>
              </div>
              
              {/* Info underneath */}
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-sm font-bold text-[#1F2937]">{deal.price}</span>
                <span className="text-xs text-[#6B7280] line-through">{deal.originalPrice}</span>
              </div>
              <p className="text-xs font-medium text-[#1F2937] mb-0.5">{deal.name}</p>
              <p className="text-[10px] text-[#6B7280] mb-1">{deal.store}</p>
              
              {/* Thumbs up/down for algorithm */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleLike(deal.id)}
                  className={`flex items-center gap-0.5 ${likedDeals.includes(deal.id) ? 'text-[#00A36C]' : 'text-[#6B7280]'}`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${likedDeals.includes(deal.id) ? 'fill-[#00A36C]' : ''}`} />
                </button>
                <button 
                  onClick={() => handleDislike(deal.id)}
                  className={`flex items-center gap-0.5 ${dislikedDeals.includes(deal.id) ? 'text-red-500' : 'text-[#6B7280]'}`}
                >
                  <ThumbsDown className={`w-3.5 h-3.5 ${dislikedDeals.includes(deal.id) ? 'fill-red-500' : ''}`} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center py-4">
            <div className="w-6 h-6 border-2 border-[#00A36C] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowFilterModal(false)}>
          <div className="bg-white w-full rounded-t-3xl p-6 pb-10" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-[#1F2937] mb-4">Filter by Topics</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {topics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => setSelectedTopics(prev => 
                    prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
                  )}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    selectedTopics.includes(topic) 
                      ? 'bg-[#00A36C] text-white' 
                      : 'bg-[#F3F4F6] text-[#1F2937]'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setShowFilterModal(false)}
              className="w-full py-3 rounded-2xl bg-[#00A36C] text-white font-semibold"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}