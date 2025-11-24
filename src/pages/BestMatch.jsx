import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Sparkles, ShoppingBag, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function BestMatch() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { type: "ai", text: "Hi! I'm your AI shopping assistant. What are you looking for today?" }
  ]);
  const [input, setInput] = useState("");
  const [showRecommendations, setShowRecommendations] = useState(false);

  const recommendations = [
    { 
      title: "Nike Air Zoom Pegasus", 
      price: "$120", 
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300",
      reason: "Perfect for daily running with excellent cushioning",
      rating: 4.7,
      inStock: true
    },
    { 
      title: "Adidas Ultraboost 22", 
      price: "$180", 
      image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=300",
      reason: "Premium comfort for long distance runs",
      rating: 4.8,
      inStock: true
    },
    { 
      title: "New Balance 1080v12", 
      price: "$160", 
      image: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=300",
      reason: "Great for wide feet with superior support",
      rating: 4.6,
      inStock: false
    }
  ];

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { type: "user", text: input }]);
      setInput("");
      
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          type: "ai", 
          text: "Great choice! Let me find the best options for you..." 
        }]);
        
        if (messages.length >= 2) {
          setTimeout(() => setShowRecommendations(true), 1000);
        }
      }, 800);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] to-[#E5E7EB] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#EC4899] to-[#BE185D] px-6 pt-8 pb-6 shadow-lg">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
              BestMatch
            </h1>
            <p className="text-white/80 text-sm">AI shopping assistant</p>
          </div>
        </div>
      </div>

      {!showRecommendations ? (
        <>
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-3xl px-5 py-3 ${
                  msg.type === "user" 
                    ? "bg-gradient-to-r from-[#EC4899] to-[#BE185D] text-white" 
                    : "bg-white border border-[#E5E7EB] text-[#1F2937]"
                }`}>
                  {msg.type === "ai" && (
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-4 h-4 text-[#EC4899]" />
                      <span className="text-xs font-bold text-[#EC4899]">AI Assistant</span>
                    </div>
                  )}
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="px-6 pb-6 bg-white border-t border-[#E5E7EB]">
            <div className="flex gap-2 pt-4">
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 h-12 rounded-2xl border-[#E5E7EB]"
              />
              <Button 
                onClick={handleSend}
                className="h-12 w-12 rounded-full bg-gradient-to-r from-[#EC4899] to-[#BE185D] hover:opacity-90"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* AI Intro */}
          <div className="bg-gradient-to-r from-[#EC4899] to-[#BE185D] rounded-3xl p-6 mb-6 shadow-xl">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg mb-2">Perfect Matches Found!</h3>
                <p className="text-white/90 text-sm leading-relaxed">
                  Based on your preferences, here are {recommendations.length} products I think you'll love:
                </p>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="space-y-4">
            {recommendations.map((product, idx) => (
              <div key={idx} className="bg-white rounded-3xl overflow-hidden border border-[#E5E7EB] shadow-lg">
                <div className="flex">
                  <img src={product.image} alt={product.title} className="w-32 h-32 object-cover" />
                  <div className="flex-1 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
                      <span className="text-sm font-bold text-[#1F2937]">{product.rating}</span>
                      <span className={`ml-auto text-xs font-semibold px-2 py-1 rounded-full ${
                        product.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>
                    <h4 className="font-bold text-[#1F2937] text-base mb-1">{product.title}</h4>
                    <p className="text-2xl font-bold text-[#EC4899] mb-2">{product.price}</p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-[#EC4899]/10 to-[#BE185D]/10 px-4 py-3">
                  <p className="text-xs text-[#6B7280] leading-relaxed">
                    <span className="font-bold text-[#EC4899]">Why this?</span> {product.reason}
                  </p>
                </div>
                <div className="p-4">
                  <Button className="w-full bg-gradient-to-r from-[#EC4899] to-[#BE185D] hover:opacity-90 rounded-2xl text-white font-semibold flex items-center justify-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    View Product
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}