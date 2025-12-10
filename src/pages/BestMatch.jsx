import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { HelpCircle, Plus, Camera, Image as ImageIcon, Bookmark, Sparkles, TrendingUp, Home, ShoppingBag, X } from "lucide-react";

export default function BestMatch() {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [showInspiration, setShowInspiration] = useState(false);
  const [showSavedItems, setShowSavedItems] = useState(false);
  const [showFullResults, setShowFullResults] = useState(null);
  const [activeResultTab, setActiveResultTab] = useState("topPicks");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  const { data: savedItems = [] } = useQuery({
    queryKey: ['captures'],
    queryFn: () => base44.entities.Capture.list(),
  });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
    const userMessage = { type: 'user', text: inputText };
    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const aiResponse = await base44.integrations.Core.InvokeLLM({
        prompt: `User is looking for: "${inputText}". Search the internet and find exactly 3 REAL products:
        1. One "Top Pick" (highest rated/most popular)
        2. One "Best Deal" (best value/biggest discount) - MUST include original_price
        3. One "Best Match" (closest match to query)
        
        For each product provide:
        - Exact product name/title
        - Current price (format: $XX.XX)
        - Original price for Best Deal ONLY (format: $XX.XX)
        - Store/brand name
        - Discount percentage for Best Deal (e.g., "50% off")
        - Product image URL (use real product images from online retailers)`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            products: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  price: { type: "string" },
                  original_price: { type: "string" },
                  store: { type: "string" },
                  badge: { type: "string" },
                  discount: { type: "string" },
                  image_url: { type: "string" }
                }
              }
            }
          }
        }
      });

      setMessages(prev => [...prev, { type: 'ai', products: aiResponse.products }]);
    } catch (error) {
      console.error("Error getting AI response:", error);
    }
    
    setIsLoading(false);
  };

  const insertSavedItem = (item) => {
    setMessages(prev => [...prev, {
      type: 'saved',
      product: {
        title: item.title,
        image_url: item.file_url,
        price: "$0.00",
        store: "Saved Item"
      }
    }]);
    setShowSavedItems(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex items-center justify-center relative">
        <button 
          onClick={() => navigate(-1)}
          className="absolute left-6"
        >
          <svg className="w-5 h-5 text-[#1F2937]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold text-[#1F2937]">DeaLo AI</h1>
        <button className="absolute right-6 w-8 h-8 rounded-full border border-[#E5E7EB] flex items-center justify-center">
          <HelpCircle className="w-4 h-4 text-[#6B7280]" />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 relative">
        {messages.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <h2 className="text-2xl font-bold text-[#1F2937] mb-2">Hi, I'm DeaLo!</h2>
            <p className="text-[#6B7280] text-sm">What are you looking for today?</p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className="mb-4">
            {msg.type === 'user' && (
              <div className="flex justify-end">
                <div className="bg-[#F3F4F6] rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]">
                  <p className="text-sm text-[#1F2937]">{msg.text}</p>
                </div>
              </div>
            )}
            
            {msg.type === 'ai' && (
              <div className="space-y-3">
                {msg.products?.slice(0, 3).map((product, pidx) => (
                  <div key={pidx} className="flex gap-2">
                    {/* Product Image - Separate Tile */}
                    <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-[#E5E7EB]">
                      <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
                    </div>
                    
                    {/* Product Info - Bigger Tile */}
                    <div className="flex-1 bg-white rounded-2xl border border-[#E5E7EB] p-3">
                      <div className="flex items-start justify-between mb-2">
                        {product.badge && (
                          <div className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            product.badge === 'Best Deal' ? 'bg-[#00A36C] text-white' : 'bg-[#3B82F6] text-white'
                          }`}>
                            {product.badge}
                          </div>
                        )}
                        <button>
                          <Bookmark className="w-4 h-4 text-[#6B7280]" />
                        </button>
                      </div>
                      <p className="text-[10px] text-[#6B7280] mb-0.5">{product.store}</p>
                      <h3 className="font-bold text-[#1F2937] text-xs mb-1 line-clamp-2">{product.title}</h3>
                      <div className="flex items-center gap-2">
                        {product.original_price && (
                          <p className="text-xs text-[#6B7280] line-through">{product.original_price}</p>
                        )}
                        <p className="text-sm font-bold text-[#1F2937]">{product.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => setShowFullResults(msg.products)}
                  className="w-full py-3 bg-[#F3F4F6] text-[#1F2937] rounded-xl font-semibold text-sm"
                >
                  View All Results
                </button>
              </div>
            )}

            {msg.type === 'saved' && (
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-3 flex gap-3 animate-scale-in">
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-[#F3F4F6]">
                  <img src={msg.product.image_url} alt={msg.product.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-[#1F2937] text-sm mb-0.5">{msg.product.title}</h3>
                  <p className="text-xs text-[#6B7280]">Added from saved items</p>
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#F3F4F6] rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-[#6B7280] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-[#6B7280] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-[#6B7280] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={chatEndRef} />
      </div>

      {/* Bottom Input Bar */}
      <div className="px-4 pb-6 pt-2 relative">
        <div className="bg-[#F9FAFB] rounded-3xl border border-[#E5E7EB] flex items-center px-4 py-3 gap-3">
          <button 
            onClick={() => setShowPlusMenu(!showPlusMenu)}
            className="flex-shrink-0"
          >
            <Plus className="w-5 h-5 text-[#6B7280]" />
          </button>
          <input
            type="text"
            placeholder="Ask DeaLo anything..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 text-sm outline-none placeholder:text-[#9CA3AF] bg-transparent"
          />
          <button 
            onClick={() => setShowInspiration(true)}
            className="flex-shrink-0"
          >
            <svg className="w-5 h-5 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
            </svg>
          </button>
          <button 
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              inputText.trim() 
                ? 'bg-[#1F2937]' 
                : 'bg-[#E5E7EB]'
            }`}
          >
            <svg className={`w-4 h-4 ${inputText.trim() ? 'text-white' : 'text-[#9CA3AF]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5c0 0 7 4.5 7 7s-7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Plus Menu Popup */}
        {showPlusMenu && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowPlusMenu(false)} />
            <div className="absolute bottom-20 left-8 bg-white rounded-2xl shadow-xl border border-[#E5E7EB] py-2 z-50 animate-scale-in">
              <button 
                onClick={() => { navigate(createPageUrl("Snap") + "?from=BestMatch"); setShowPlusMenu(false); }}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[#F9FAFB] text-left"
              >
                <Camera className="w-5 h-5 text-[#00A36C]" />
                <span className="text-sm font-medium text-[#1F2937] whitespace-nowrap">Take Photo</span>
              </button>
              <button 
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[#F9FAFB] text-left"
              >
                <ImageIcon className="w-5 h-5 text-[#00A36C]" />
                <span className="text-sm font-medium text-[#1F2937] whitespace-nowrap">Upload from Gallery</span>
              </button>
              <button 
                onClick={() => { setShowSavedItems(true); setShowPlusMenu(false); }}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[#F9FAFB] text-left"
              >
                <Bookmark className="w-5 h-5 text-[#00A36C]" />
                <span className="text-sm font-medium text-[#1F2937] whitespace-nowrap">Add from Saved</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Inspiration Sheet */}
      {showInspiration && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-end" onClick={() => setShowInspiration(false)}>
          <div 
            className="bg-white w-full rounded-t-3xl overflow-hidden flex flex-col animate-slide-up" 
            style={{ height: '90vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center py-3">
              <div className="w-10 h-1 bg-[#D1D5DB] rounded-full" />
            </div>
            
            {/* Header */}
            <div className="px-6 pb-3">
              <h2 className="text-sm font-bold text-[#1F2937] mb-3">Inspiration</h2>
              
              {/* Category pills - horizontal scroll */}
              <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide">
                {['All', 'Tech', 'Home', 'Shoes', 'Fashion', 'Beauty'].map(cat => (
                  <button 
                    key={cat} 
                    className={`text-xs font-medium whitespace-nowrap ${
                      cat === 'All' 
                        ? 'bg-[#E5E7EB] text-[#1F2937] px-3 py-1 rounded-full' 
                        : 'text-[#6B7280]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Content - scrollable */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "Wireless Headphones", price: "$89", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300" },
                  { name: "Smart Watch", price: "$149", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300" },
                  { name: "Running Shoes", price: "$119", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300" },
                  { name: "Bluetooth Speaker", price: "$59", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300" },
                  { name: "Hoodie", price: "$45", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300" },
                  { name: "Backpack", price: "$69", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300" },
                  { name: "Sunglasses", price: "$79", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300" },
                  { name: "Laptop", price: "$899", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300" },
                ].map((item, idx) => (
                  <div key={idx}>
                    <div className="aspect-square rounded-2xl overflow-hidden relative mb-2 bg-[#F3F4F6]">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm rounded px-1.5 py-0.5">
                        <span className="text-[10px] font-bold text-white leading-none">{item.price}</span>
                      </div>
                    </div>
                    <p className="text-xs font-medium text-[#1F2937]">{item.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Saved Items Sheet */}
      {showSavedItems && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowSavedItems(false)}>
          <div 
            className="bg-white w-full rounded-t-3xl overflow-hidden flex flex-col animate-slide-up" 
            style={{ height: '60vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center py-3">
              <div className="w-10 h-1 bg-[#D1D5DB] rounded-full" />
            </div>
            <div className="px-6 pb-4">
              <h2 className="text-xl font-bold text-[#1F2937]">Saved Items</h2>
            </div>
            <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-3">
              {savedItems.map(item => (
                <div key={item.id} className="bg-white rounded-xl border border-[#E5E7EB] p-3 flex gap-3">
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-[#F3F4F6]">
                    <img src={item.file_url} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#1F2937] text-sm mb-1">{item.title}</h3>
                    <button 
                      onClick={() => insertSavedItem(item)}
                      className="text-xs font-semibold text-[#00A36C]"
                    >
                      Use in Chat →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Full Results Sheet */}
      {showFullResults && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowFullResults(null)}>
          <div 
            className="bg-white w-full rounded-t-3xl overflow-hidden flex flex-col animate-slide-up" 
            style={{ height: '92vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center py-3">
              <div className="w-10 h-1 bg-[#D1D5DB] rounded-full" />
            </div>
            
            {/* Tabs with menu button */}
            <div className="flex items-center border-b border-[#E5E7EB] px-6">
              <div className="flex-1 flex">
                {['topPicks', 'bestDeals', 'bestMatches'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveResultTab(tab)}
                    className={`flex-1 py-3 text-xs font-semibold relative ${
                      activeResultTab === tab ? 'text-[#1F2937]' : 'text-[#6B7280]'
                    }`}
                  >
                    {tab === 'topPicks' && 'Top Picks'}
                    {tab === 'bestDeals' && 'Best Deals'}
                    {tab === 'bestMatches' && 'Best Matches'}
                    {activeResultTab === tab && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00A36C]" />
                    )}
                  </button>
                ))}
              </div>
              <button className="ml-2 p-2">
                <svg className="w-4 h-4 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Results List */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {/* Labeled products at top */}
              {showFullResults
                .filter(p => 
                  (activeResultTab === 'topPicks' && p.badge === 'Top Pick') ||
                  (activeResultTab === 'bestDeals' && p.badge === 'Best Deal') ||
                  (activeResultTab === 'bestMatches' && p.badge === 'Best Match')
                )
                .map((product, idx) => (
                  <div key={idx} className="flex gap-2 mb-3">
                    {/* Product Image with grey background */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-[#E5E7EB] relative">
                      <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
                      {product.badge === 'Best Deal' && product.discount && (
                        <div className="absolute top-1 left-1 bg-[#00A36C] text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                          {product.discount}
                        </div>
                      )}
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <div className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          product.badge === 'Best Deal' ? 'bg-[#00A36C] text-white' : 
                          product.badge === 'Top Pick' ? 'bg-[#3B82F6] text-white' : 
                          'bg-[#F59E0B] text-white'
                        }`}>
                          {product.badge}
                        </div>
                        <button>
                          <Bookmark className="w-4 h-4 text-[#6B7280]" />
                        </button>
                      </div>
                      <p className="text-[10px] text-[#6B7280] mb-0.5">{product.store}</p>
                      <h3 className="font-semibold text-[#1F2937] text-xs mb-1 line-clamp-2">{product.title}</h3>
                      <div className="flex items-center gap-2">
                        {product.original_price && (
                          <p className="text-xs text-[#6B7280] line-through">{product.original_price}</p>
                        )}
                        <p className="text-sm font-bold text-[#1F2937]">{product.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}