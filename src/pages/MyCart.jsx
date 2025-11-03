import React, { useState } from "react";
import { ShoppingCart, Trash2, Plus, Minus, Search, User, Heart, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function MyCart() {
  const [activeTab, setActiveTab] = useState("cart");
  const [sortBy, setSortBy] = useState("recent");

  // Mock cart items
  const cartItems = [
    { 
      id: 1, 
      title: "7-Pod Pro", 
      price: 299, 
      quantity: 1, 
      rating: 4.5,
      store: "Target",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200" 
    },
    { 
      id: 2, 
      title: "Faith over Fear T-Shirt", 
      price: 12, 
      quantity: 1, 
      rating: 3,
      store: "Amazon",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200" 
    },
  ];

  const snapHistory = [
    { id: 1, title: "Nike Shoes", date: "2 days ago", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200" },
    { id: 2, title: "Apple Watch", date: "5 days ago", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200" },
  ];

  const categories = [
    { name: "Soccer Stuff", items: 5 },
    { name: "Tech", items: 12 },
    { name: "Clothes", items: 8 },
    { name: "Food", items: 3 },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header with Tabs */}
      <div className="px-6 pt-8 pb-4 bg-white border-b border-[#E4E8ED]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab("cart")}
              className={`text-lg font-bold pb-2 transition-colors ${
                activeTab === "cart" 
                  ? "text-[#2E2E38] border-b-2 border-[#5EE177]" 
                  : "text-[#60656F]"
              }`}
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              My Cart
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`text-lg font-bold pb-2 transition-colors ${
                activeTab === "history" 
                  ? "text-[#2E2E38] border-b-2 border-[#5EE177]" 
                  : "text-[#60656F]"
              }`}
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Snap History
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-full bg-[#F9FAFB] flex items-center justify-center">
              <User className="w-5 h-5 text-[#60656F]" />
            </button>
            <button className="w-10 h-10 rounded-full bg-[#F9FAFB] flex items-center justify-center">
              <Heart className="w-5 h-5 text-[#60656F]" />
            </button>
            <button className="w-10 h-10 rounded-full bg-[#F9FAFB] flex items-center justify-center relative">
              <ShoppingCart className="w-5 h-5 text-[#60656F]" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#5EE177] rounded-full text-white text-xs flex items-center justify-center font-bold">
                {cartItems.length}
              </span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#60656F]" />
          <Input
            placeholder="Search products"
            className="pl-12 h-12 rounded-2xl border-[#E4E8ED] bg-[#F9FAFB] text-[#2E2E38]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          />
        </div>

        {/* Create Folder Button */}
        <Button className="w-full bg-gradient-to-r from-[#5EE177] to-[#FF8AC6] hover:opacity-90 rounded-2xl h-12 font-semibold">
          + Create Folder
        </Button>
      </div>

      {/* AI Product Finder */}
      <div className="px-6 py-4">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-lg mb-2">AI Product Finder</h3>
              <p className="text-white/90 text-sm mb-3">
                Finds best deals, more for you across stores near—the best selected.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sort By */}
      {activeTab === "cart" && (
        <div className="px-6 pb-4 flex items-center justify-between">
          <p className="text-sm text-[#60656F]">{cartItems.length} items</p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#60656F]">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-28 h-9 rounded-xl border-[#E4E8ED]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recent</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="px-6 pb-32">
        {activeTab === "cart" ? (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-3xl p-4 border border-[#E4E8ED] shadow-sm">
                <div className="flex gap-4 mb-3">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#A8F3C1] to-[#FFD3E8] overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#2E2E38] text-base mb-1">{item.title}</h3>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 ${i < item.rating ? 'text-[#FF8AC6] fill-[#FF8AC6]' : 'text-gray-300'}`} 
                        />
                      ))}
                      <span className="text-xs text-[#60656F] ml-1">{item.rating}</span>
                    </div>
                    <p className="text-xl font-bold text-[#5EE177] mb-2">${item.price}</p>
                  </div>
                  <button className="text-[#60656F] hover:text-red-500 transition-colors self-start">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full rounded-2xl border-2 border-[#5EE177] text-[#5EE177] hover:bg-[#5EE177] hover:text-white font-semibold"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Visit {item.store} Store
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {snapHistory.map((item) => (
              <div key={item.id} className="bg-white rounded-3xl p-4 border border-[#E4E8ED] shadow-sm flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-[#A8F3C1] to-[#FFD3E8]">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#2E2E38] mb-1">{item.title}</h3>
                  <p className="text-xs text-[#60656F]">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Category Bar */}
      <div className="fixed bottom-20 left-0 right-0 bg-white border-t border-[#E4E8ED] z-40 px-6 py-4">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          {categories.map((cat, idx) => (
            <div 
              key={idx}
              className="flex-shrink-0 bg-gradient-to-br from-[#5EE177] to-[#FF8AC6] rounded-2xl p-4 min-w-[120px]"
            >
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-2">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-white font-bold text-sm mb-1">{cat.name}</h4>
              <p className="text-white/80 text-xs">{cat.items} items</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}