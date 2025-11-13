import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Camera, Scale, Heart, Search, Star, Plus, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const quickActions = [
    { icon: Camera, label: "Identify", page: "Snap" },
    { icon: Scale, label: "Compare", page: "Compare" },
    { icon: Heart, label: "Favorites", page: "MyCart" }
  ];

  // Mock trending products - ALWAYS use these placeholders
  const trendingProducts = [
    { id: 1, title: "Wireless Headphones", price: "$89.99", rating: 4.5, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400" },
    { id: 2, title: "Smart Watch", price: "$199.99", rating: 4.8, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400" },
    { id: 3, title: "Bluetooth Speaker", price: "$59.99", rating: 4.6, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400" },
    { id: 4, title: "Phone Case", price: "$24.99", rating: 4.3, image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400" },
    { id: 5, title: "USB-C Cable", price: "$14.99", rating: 4.7, image: "https://images.unsplash.com/photo-1585419372611-f0ffebad6659?w=400" },
    { id: 6, title: "Laptop Stand", price: "$34.99", rating: 4.4, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400" },
  ];

  // Mock deals near you
  const dealsNearYou = [
    { id: 1, store: "Target", discount: "Up to 40% OFF", image: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=600" },
    { id: 2, store: "Walmart", discount: "Flash Sale - 25% OFF", image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=600" },
    { id: 3, store: "Best Buy", discount: "Tech Deals - 30% OFF", image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=600" },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-8">
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <h1 className="text-2xl font-bold text-[#2E2E38] mb-1 border-b-2 border-[#5EE177] inline-block" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Home
        </h1>
      </div>

      {/* Search Bar */}
      <div className="px-6 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#60656F]" />
          <Input
            placeholder="Search products"
            className="pl-12 h-12 rounded-2xl border-[#E4E8ED] bg-white text-[#2E2E38]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          />
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="px-6 mb-8">
        <div className="grid grid-cols-3 gap-4">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <Link key={idx} to={createPageUrl(action.page)}>
                <div className="bg-white rounded-2xl p-4 border border-[#E4E8ED] shadow-sm hover:shadow-md transition-all flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#5EE177] to-[#FF8AC6] flex items-center justify-center mb-2">
                    <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                  </div>
                  <span className="text-xs font-semibold text-[#2E2E38]" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    {action.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Trending Section - 2 rows of 3 */}
      <div className="px-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#2E2E38]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Trending
          </h2>
          <button className="text-[#5EE177] font-semibold text-sm flex items-center gap-1">
            View All
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {trendingProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl overflow-hidden border border-[#E4E8ED] shadow-sm">
              <div className="aspect-square bg-gradient-to-br from-[#A8F3C1] to-[#FFD3E8] relative">
                <img 
                  src={product.image} 
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                {/* Heart icon for favoriting */}
                <button className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-md">
                  <Star className="w-4 h-4 text-[#FF8AC6]" />
                </button>
              </div>
              <div className="p-2">
                <h3 className="font-semibold text-[#2E2E38] text-xs line-clamp-1 mb-1">
                  {product.title}
                </h3>
                <div className="flex items-center gap-1 mb-1">
                  <Star className="w-2.5 h-2.5 text-[#FF8AC6] fill-[#FF8AC6]" />
                  <span className="text-xs text-[#60656F]">{product.rating}</span>
                </div>
                <span className="text-sm font-bold text-[#5EE177]">{product.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deals Near You - Horizontal Scroll */}
      <div className="px-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#2E2E38]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Deals Near You
          </h2>
          <button className="text-[#5EE177] font-semibold text-sm flex items-center gap-1">
            View All
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6">
          {dealsNearYou.map((deal) => (
            <div key={deal.id} className="flex-shrink-0 w-72 bg-gradient-to-r from-[#5EE177] to-[#FF8AC6] rounded-3xl p-6 shadow-lg">
              <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {deal.discount}
              </h3>
              <p className="text-white/90 text-lg font-semibold mb-4">
                {deal.store}
              </p>
              <Button className="bg-white text-[#5EE177] hover:bg-white/90 font-semibold rounded-full">
                View Deals
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* SnapSmart Landing Section - No card, just on screen */}
      <div className="px-6 pb-12 pt-8 text-center">
        {/* Venn Diagram Logo Only */}
        <div className="relative w-24 h-24 mx-auto mb-4">
          <svg viewBox="0 0 120 120" className="w-full h-full">
            <ellipse
              cx="45"
              cy="60"
              rx="30"
              ry="45"
              transform="rotate(45 45 60)"
              fill="#5EE177"
              opacity="0.9"
            />
            <ellipse
              cx="75"
              cy="60"
              rx="30"
              ry="45"
              transform="rotate(135 75 60)"
              fill="#FF8AC6"
              opacity="0.9"
            />
          </svg>
        </div>

        {/* Text directly on screen */}
        <p className="text-lg text-[#60656F] font-semibold mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Lens of the Future
        </p>
        <p className="text-sm text-[#60656F] opacity-80 mb-4">
          Shop Smart. Save Big.
        </p>
        <a 
          href="#" 
          className="text-sm font-semibold underline bg-gradient-to-r from-[#5EE177] to-[#FF8AC6] bg-clip-text text-transparent hover:opacity-80 transition-opacity"
        >
          Learn more about us
        </a>
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