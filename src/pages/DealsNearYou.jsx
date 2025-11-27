import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DealsNearYou() {
  const navigate = useNavigate();

  const deals = [
    { id: 1, store: "Target", discount: "Up to 40% OFF", image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800", url: "https://target.com/deals" },
    { id: 2, store: "Best Buy", discount: "Tech Sale 30% OFF", image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800", url: "https://bestbuy.com/deals" },
    { id: 3, store: "Amazon", discount: "Flash Deals", image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800", url: "https://amazon.com/deals" },
    { id: 4, store: "Walmart", discount: "Rollback Prices", image: "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=800", url: "https://walmart.com/deals" },
    { id: 5, store: "Costco", discount: "Members Only 25% OFF", image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800", url: "https://costco.com/deals" },
    { id: 6, store: "Nike", discount: "End of Season 50% OFF", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800", url: "https://nike.com/sale" },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-center relative">
          <button onClick={() => navigate(-1)} className="absolute left-0">
            <ArrowLeft className="w-5 h-5 text-[#1F2937]" />
          </button>
          <h1 className="text-base text-[#1F2937]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>
            Deals
          </h1>
        </div>
      </div>

      {/* Deals Grid */}
      <div className="px-6">
        <div className="grid grid-cols-2 gap-3">
          {deals.map((deal) => (
            <div key={deal.id} className="rounded-2xl overflow-hidden shadow-sm relative" style={{ height: '160px' }}>
              <img src={deal.image} alt={deal.store} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="text-sm font-bold text-white mb-0.5">{deal.discount}</h3>
                <p className="text-white/90 text-xs font-semibold mb-2">{deal.store}</p>
                <a href={deal.url} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" className="bg-white text-[#00A36C] hover:bg-white/90 font-semibold rounded-full text-xs h-7 px-3">
                    View Deals
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}