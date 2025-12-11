import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { HelpCircle, Plus, Camera, Image as ImageIcon, Bookmark, Sparkles, TrendingUp, Home, ShoppingBag, X } from "lucide-react";
import LoadingScreen from "../components/LoadingScreen";

export default function BestMatch() {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [showInspiration, setShowInspiration] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [loadingCategory, setLoadingCategory] = useState(false);
  
  useEffect(() => {
    if (showInspiration && categoryProducts.length === 0 && selectedCategory === 'All') {
      loadCategoryProducts('All');
    }
  }, [showInspiration]);
  const [showSavedItems, setShowSavedItems] = useState(false);
  const [showFullResults, setShowFullResults] = useState(null);
  const [activeResultTab, setActiveResultTab] = useState("topPicks");
  const [isLoading, setIsLoading] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
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
        2. One "Best Deal" (best value/biggest discount) - MUST include original_price and discount
        3. One "Best Match" (closest match to query)
        
        For each product provide:
        - Exact product name/title
        - Current price (format: $XX.XX)
        - Original price for Best Deal (format: $XX.XX)
        - Store/brand name
        - Badge: "Top Pick", "Best Deal", or "Best Match"
        - Discount percentage for Best Deal (e.g., "50% off")
        - Product image URL (real product images from retailers)`,
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

      setMessages(prev => [...prev, { type: 'ai', products: aiResponse.products, query: inputText }]);
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

  const loadCategoryProducts = async (category) => {
    setSelectedCategory(category);
    setLoadingCategory(true);
    setCategoryProducts([]);
    
    try {
      const categoryName = category === 'All' ? 'popular trending' : category;
      const aiResponse = await base44.integrations.Core.InvokeLLM({
        prompt: `Find 6 real popular products in the "${categoryName}" category. Search the internet for actual products with real images from online retailers.
        For each product provide:
        - Product name
        - High quality product image URL from actual retailers`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            products: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  image_url: { type: "string" }
                }
              }
            }
          }
        }
      });
      
      setCategoryProducts(aiResponse.products || []);
    } catch (error) {
      console.error("Error loading category products:", error);
    }
    
    setLoadingCategory(false);
  };

  const handleProductClick = (product) => {
    setShowLoadingScreen(true);
    setTimeout(() => {
      // Generate a Google search URL for the product
      const searchQuery = encodeURIComponent(`${product.title} ${product.store || ''} buy`);
      window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank');
      setShowLoadingScreen(false);
    }, 2000);
  };

  if (showLoadingScreen) {
    return <LoadingScreen />;
  }

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
              <div className="space-y-2">
                {msg.products?.map((product, pidx) => (
                  <div key={pidx} className="flex gap-3 cursor-pointer" onClick={() => handleProductClick(product)}>
                    {/* Product Image - Left side, bigger */}
                    <div className="w-32 h-32 rounded-2xl overflow-hidden bg-[#E5E7EB] flex-shrink-0">
                      <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
                    </div>
                    
                    {/* Product Info - Right side */}
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        {product.badge && (
                          <div className={`inline-block px-2 py-0.5 rounded text-[8px] font-bold mb-1 ${
                            product.badge === 'Best Deal' ? 'bg-[#00A36C] text-white' : 
                            product.badge === 'Top Pick' ? 'bg-[#3B82F6] text-white' : 
                            'bg-[#F59E0B] text-white'
                          }`}>
                            {product.badge}
                          </div>
                        )}
                        <p className="text-[9px] text-[#6B7280] mb-0.5">{product.store}</p>
                        <h3 className="font-semibold text-[#1F2937] text-[11px] mb-0.5 line-clamp-2">{product.title}</h3>
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold text-[#1F2937]">{product.price}</p>
                          {product.badge === 'Best Deal' && product.original_price && (
                            <p className="text-[10px] text-[#6B7280] line-through">{product.original_price}</p>
                          )}
                        </div>
                      </div>
                      <button className="self-end" onClick={(e) => e.stopPropagation()}>
                        <Bookmark className="w-4 h-4 text-[#6B7280]" />
                      </button>
                    </div>
                  </div>
                ))}
                <button 
                  onClick={async () => {
                    setIsLoading(true);
                    try {
                      const fullResponse = await base44.integrations.Core.InvokeLLM({
                        prompt: `User is looking for: "${msg.query}". Search the internet and find REAL products in 3 categories:
                        
                        TOP PICKS (5 products):
                        - First one gets badge "Top Pick" (highest rated/most popular)
                        - Next 4 are other good picks (no badge, just good products)
                        
                        BEST DEALS (5 products):
                        - First one gets badge "Best Deal" (biggest discount) with original_price and discount
                        - Next 4 are other deals (with original_price and discount, no badge)
                        
                        BEST MATCHES (5 products):
                        - First one gets badge "Best Match" (closest to query)
                        - Next 4 are similar matches (no badge)
                        
                        For each product provide:
                        - Exact product name/title
                        - Current price (format: $XX.XX)
                        - Original price for deals (format: $XX.XX)
                        - Store/brand name
                        - Badge (only first in each category)
                        - Discount for deals (e.g., "50% off")
                        - Category: "topPicks", "bestDeals", or "bestMatches"
                        - Product image URL (real images from retailers)`,
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
                                  image_url: { type: "string" },
                                  category: { type: "string" }
                                }
                              }
                            }
                          }
                        }
                      });
                      setShowFullResults(fullResponse.products);
                    } catch (error) {
                      console.error("Error loading full results:", error);
                    }
                    setIsLoading(false);
                  }}
                  className="w-full py-3 bg-[#F3F4F6] text-[#1F2937] rounded-xl font-semibold text-xs mt-2"
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
            <div className="flex flex-col items-center pb-3">
              <h2 className="text-sm font-normal text-[#1F2937] mb-3">Inspiration</h2>
              
              {/* Category buttons - clickable, scrollable with padding */}
              <div className="w-full overflow-x-auto scrollbar-hide">
                <div className="flex gap-2 px-6 pb-2">
                  {['All', 'Tech', 'Home', 'Shoes', 'Fashion', 'Beauty', 'Sports'].map(cat => (
                    <button 
                      key={cat} 
                      onClick={() => loadCategoryProducts(cat)}
                      className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${
                        selectedCategory === cat 
                          ? 'bg-[#1F2937] text-white' 
                          : 'bg-[#F3F4F6] text-[#1F2937] hover:bg-[#E5E7EB]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Content - scrollable */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              {loadingCategory ? (
                <div className="flex justify-center items-center h-full">
                  <div className="w-6 h-6 border-2 border-[#1F2937] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {categoryProducts.map((item, idx) => (
                    <div key={idx}>
                      <div className="aspect-square rounded-2xl overflow-hidden mb-2 bg-[#E5E7EB]">
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <p className="text-xs font-medium text-[#1F2937]">{item.name}</p>
                    </div>
                  ))}
                </div>
              )}
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
              {showFullResults
                .filter(p => p.category === activeResultTab)
                .map((product, idx) => (
                  <div key={idx} className="cursor-pointer" onClick={() => handleProductClick(product)}>
                    <div className="flex gap-3 mb-3">
                      <div className="w-28 h-28 rounded-xl overflow-hidden flex-shrink-0 bg-[#E5E7EB] relative">
                        <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
                        {activeResultTab === 'bestDeals' && product.discount && (
                          <div className="absolute top-1 left-1 bg-[#00A36C] text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                            {product.discount}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          {idx === 0 && product.badge && (
                            <div className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold mb-1 ${
                              product.badge === 'Best Deal' ? 'bg-[#00A36C] text-white' : 
                              product.badge === 'Top Pick' ? 'bg-[#3B82F6] text-white' : 
                              'bg-[#F59E0B] text-white'
                            }`}>
                              {product.badge}
                            </div>
                          )}
                          <p className="text-[9px] text-[#6B7280] mb-0.5">{product.store}</p>
                          <h3 className="font-semibold text-[#1F2937] text-[11px] mb-1 line-clamp-2">{product.title}</h3>
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-bold text-[#1F2937]">{product.price}</p>
                            {activeResultTab === 'bestDeals' && product.original_price && (
                              <p className="text-[10px] text-[#6B7280] line-through">{product.original_price}</p>
                            )}
                          </div>
                        </div>
                        <button className="self-end" onClick={(e) => e.stopPropagation()}>
                          <Bookmark className="w-4 h-4 text-[#6B7280]" />
                        </button>
                      </div>
                    </div>
                    
                    {idx === 0 && (
                      <div className="border-t border-[#E5E7EB] my-4" />
                    )}
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