import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DealsNearYou() {
  const navigate = useNavigate();

  const dealsNearYou = [
    { id: 1, store: "Target", discount: "Up to 40% OFF", image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800" },
    { id: 2, store: "Walmart", discount: "Flash Sale - 25% OFF", image: "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=800" },
    { id: 3, store: "Best Buy", discount: "Tech Deals - 30% OFF", image: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800" },
    { id: 4, store: "Costco", discount: "Member Exclusive - 35% OFF", image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800" },
    { id: 5, store: "Home Depot", discount: "Home Essentials - 20% OFF", image: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800" },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      <div className="px-6 pt-8 pb-4">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6 text-[#1F2937]" />
          </button>
          <h1 className="text-2xl font-bold text-[#1F2937]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Deals Near You
          </h1>
        </div>
      </div>

      <div className="px-6 space-y-4">
        {dealsNearYou.map((deal) => (
          <div key={deal.id} className="rounded-3xl overflow-hidden shadow-lg relative">
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
  );
}