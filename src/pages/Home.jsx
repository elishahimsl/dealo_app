import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Camera, Scale, Heart, Search, Plus, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const quickActions = [
    { icon: Camera, label: "Identify", page: "Snap" },
    { icon: Scale, label: "Compare", page: "Compare" },
    { icon: Heart, label: "Favorites", page: "MyCart" }
  ];

  // Mock trending products
  const trendingProducts = [
    { id: 1, price: "$89.99", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400" },
    { id: 2, price: "$199.99", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400" },
    { id: 3, price: "$59.99", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400" },
    { id: 4, price: "$24.99", image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400" },
    { id: 5, price: "$14.99", image: "https://images.unsplash.com/photo-1585419372611-f0ffebad6659?w=400" },
    { id: 6, price: "$34.99", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400" },
  ];

  // Deals near you with stock images
  const dealsNearYou = [
    { id: 1, store: "Target", discount: "Up to 40% OFF", image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800" },
    { id: 2, store: "Walmart", discount: "Flash Sale - 25% OFF", image: "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=800" },
    { id: 3, store: "Best Buy", discount: "Tech Deals - 30% OFF", image: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800" },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-8">
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <h1 className="text-2xl font-bold text-[#1F2937] mb-1 border-b-2 border-[#00A36C] inline-block" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Home
        </h1>
      </div>

      {/* Search Bar */}
      <div className="px-6 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
          <Input
            placeholder="Search products"
            className="pl-12 h-12 rounded-2xl border-[#E5E7EB] bg-white text-[#1F2937]"
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
                <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-sm hover:shadow-md transition-all flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-[#00A36C] flex items-center justify-center mb-2">
                    <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                  </div>
                  <span className="text-xs font-semibold text-[#1F2937]" style={{ fontFamily: 'Nunito, sans-serif' }}>
                    {action.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Trending Section - Full images with green price pills */}
      <div className="px-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#1F2937]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Trending
          </h2>
          <button className="text-[#00A36C] font-semibold text-sm flex items-center gap-1">
            View All
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {trendingProducts.map((product) => (
            <div key={product.id} className="rounded-2xl overflow-hidden shadow-sm relative" style={{ aspectRatio: '3/4' }}>
              <img 
                src={product.image} 
                alt="Product"
                className="w-full h-full object-cover"
              />
              {/* Transparent black price - top left */}
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm rounded-md px-2 py-1">
                <span className="text-xs font-bold text-white">{product.price}</span>
              </div>
              {/* Heart icon - bottom right */}
              <button className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-[#6B7280] flex items-center justify-center hover:bg-[#00A36C] transition-colors">
                <Heart className="w-4 h-4 text-white fill-white" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Deals Near You - With stock images */}
      <div className="px-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#1F2937]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Deals Near You
          </h2>
          <button className="text-[#00A36C] font-semibold text-sm flex items-center gap-1">
            View All
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6">
          {dealsNearYou.map((deal) => (
            <div key={deal.id} className="flex-shrink-0 w-72 rounded-3xl overflow-hidden shadow-lg relative">
              <img 
                src={deal.image} 
                alt={deal.store}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {deal.discount}
                </h3>
                <p className="text-white/90 text-lg font-semibold mb-4">
                  {deal.store}
                </p>
                <Button className="bg-white text-[#00A36C] hover:bg-white/90 font-semibold rounded-full">
                  View Deals
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SnapSmart Landing Section */}
      <div className="px-6 pb-12 pt-8 text-center">
        {/* Logo Only */}
        <div className="relative w-24 h-24 mx-auto mb-4">
          <svg viewBox="0 0 120 120" className="w-full h-full">
            <ellipse
              cx="45"
              cy="60"
              rx="30"
              ry="45"
              transform="rotate(45 45 60)"
              fill="#00A36C"
              opacity="0.9"
            />
            <ellipse
              cx="75"
              cy="60"
              rx="30"
              ry="45"
              transform="rotate(135 75 60)"
              fill="#007E52"
              opacity="0.9"
            />
          </svg>
        </div>

        <p className="text-lg text-[#6B7280] opacity-40 font-semibold mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Lens of the Future
        </p>
        <p className="text-sm text-[#6B7280] opacity-60 mb-4">
          Shop Smart. Save Big.
        </p>
        <a 
          href="#" 
          className="text-sm font-semibold text-[#00A36C] underline hover:opacity-80 transition-opacity"
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