import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ChevronLeft, SlidersHorizontal } from "lucide-react";

export default function SavedComparisons() {
  const navigate = useNavigate();

  const savedFromStorage = JSON.parse(localStorage.getItem('savedComparisons') || '[]');
  
  // Example saved comparisons if no data in storage
  const exampleComparisons = [
    {
      id: 'example1',
      item1: { title: 'iPhone 16 Pro', file_url: 'https://images.unsplash.com/photo-1696446702592-006b59370cea?w=200', price: '$999', brand: 'Apple' },
      item2: { title: 'Samsung Galaxy S24', file_url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=200', price: '$899', brand: 'Samsung' },
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      result: { winner: 'item1', confidence: 85 }
    },
    {
      id: 'example2',
      item1: { title: 'Sony WH-1000XM5', file_url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200', price: '$349', brand: 'Sony' },
      item2: { title: 'Bose QuietComfort', file_url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=200', price: '$329', brand: 'Bose' },
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      result: { winner: 'item1', confidence: 78 }
    },
    {
      id: 'example3',
      item1: { title: 'MacBook Air M2', file_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200', price: '$1199', brand: 'Apple' },
      item2: { title: 'Dell XPS 13', file_url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=200', price: '$1099', brand: 'Dell' },
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      result: { winner: 'item2', confidence: 72 }
    }
  ];
  
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return '1 week ago';
    return `${Math.floor(diffDays / 7)} weeks ago`;
  };

  const dataToDisplay = savedFromStorage.length > 0 ? savedFromStorage : exampleComparisons;

  const savedComparisons = dataToDisplay.map(comp => ({
    id: comp.id,
    product1: { name: comp.item1.title, image: comp.item1.file_url },
    product2: { name: comp.item2.title, image: comp.item2.file_url },
    date: getTimeAgo(comp.date),
    fullData: comp
  }));

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="px-6 pt-8 pb-2 flex items-center justify-between relative">
        <button onClick={() => navigate(-1)} className="absolute left-6">
          <ChevronLeft className="w-6 h-6 text-[#1F2937]" />
        </button>
        <h1 className="text-sm font-semibold text-[#1F2937] w-full text-center">Saved Comparisons</h1>
      </div>

      <div className="px-6 space-y-3 relative">
        <button className="absolute -top-6 right-6 z-10">
          <svg className="w-5 h-5 text-[#6B7280]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="8" x2="20" y2="8" strokeLinecap="round"/>
            <circle cx="8" cy="8" r="2" fill="currentColor"/>
            <line x1="4" y1="16" x2="20" y2="16" strokeLinecap="round"/>
            <circle cx="16" cy="16" r="2" fill="currentColor"/>
          </svg>
        </button>
        
        {savedComparisons.map((comp) => (
          <button 
            key={comp.id} 
            onClick={() => navigate(createPageUrl("ComparisonResults"), { 
              state: comp.fullData || { 
                item1: { title: comp.product1.name, file_url: comp.product1.image, price: '$999', brand: 'Brand' },
                item2: { title: comp.product2.name, file_url: comp.product2.image, price: '$899', brand: 'Brand' },
                result: { winner: 'item1' }
              }
            })}
            className="w-full bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-[#F3F4F6] mb-2">
                  <img src={comp.product1.image} alt={comp.product1.name} className="w-full h-full object-cover" />
                </div>
                <p className="text-xs font-semibold text-[#1F2937] text-center line-clamp-2">{comp.product1.name}</p>
              </div>
              
              <div className="w-10 h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-[#6B7280]">VS</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-[#F3F4F6] mb-2">
                  <img src={comp.product2.image} alt={comp.product2.name} className="w-full h-full object-cover" />
                </div>
                <p className="text-xs font-semibold text-[#1F2937] text-center line-clamp-2">{comp.product2.name}</p>
              </div>
            </div>
            <p className="text-xs text-[#6B7280] text-center mt-2">{comp.date}</p>
          </button>
        ))}
      </div>
    </div>
  );
}