import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Send, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function BestMatch() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hi! I'm your personal shopping assistant. What are you looking for today?" }
  ]);
  const [inputText, setInputText] = useState("");
  const [showRecommendations, setShowRecommendations] = useState(false);

  const mockRecommendations = [
    { 
      id: 1, 
      title: "Nike Air Max", 
      price: "$119.99", 
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
      reason: "Best value for your budget with excellent reviews"
    },
    { 
      id: 2, 
      title: "Adidas Ultra Boost", 
      price: "$139.99", 
      image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400",
      reason: "Premium comfort and durability"
    },
  ];

  const handleSend = () => {
    if (inputText.trim()) {
      setMessages([...messages, { sender: "user", text: inputText }]);
      setInputText("");
      
      setTimeout(() => {
        if (messages.length < 6) {
          setMessages(prev => [...prev, { 
            sender: "ai", 
            text: "What's your budget range?" 
          }]);
        } else {
          setShowRecommendations(true);
        }
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      <div className="px-6 pt-8 pb-4">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6 text-[#1F2937]" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#1F2937]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              BestMatch
            </h1>
            <p className="text-sm text-[#6B7280]">Tell us what you need — we'll find the perfect product</p>
          </div>
        </div>
      </div>

      {!showRecommendations ? (
        <>
          <div className="px-6 space-y-3 mb-20">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl p-3 ${
                  msg.sender === "user" 
                    ? "bg-[#00A36C] text-white" 
                    : "bg-white border border-[#E5E7EB] text-[#1F2937]"
                }`}>
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="fixed bottom-24 left-0 right-0 px-6 bg-[#F9FAFB] py-4">
            <div className="flex gap-2">
              <Input
                placeholder="Type your answer..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 rounded-2xl"
              />
              <Button onClick={handleSend} className="bg-[#00A36C] hover:bg-[#007E52] rounded-2xl">
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="px-6">
          <h3 className="text-lg font-bold text-[#1F2937] mb-4">Your Perfect Matches</h3>
          <div className="space-y-4">
            {mockRecommendations.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl overflow-hidden border border-[#E5E7EB]">
                <div className="flex gap-4 p-4">
                  <img src={product.image} alt={product.title} className="w-24 h-24 rounded-xl object-cover" />
                  <div className="flex-1">
                    <h4 className="font-bold text-[#1F2937] mb-1">{product.title}</h4>
                    <p className="text-lg font-bold text-[#00A36C] mb-2">{product.price}</p>
                    <p className="text-xs text-[#6B7280] mb-2">Why we picked this: {product.reason}</p>
                    <Button
                      onClick={() => navigate(createPageUrl("Compare"))}
                      size="sm"
                      variant="outline"
                      className="rounded-xl border-[#00A36C] text-[#00A36C]"
                    >
                      Compare This
                    </Button>
                  </div>
                  <button className="self-start">
                    <Heart className="w-6 h-6 text-[#6B7280]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}