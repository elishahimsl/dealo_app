import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft } from "lucide-react";

export default function AllStores() {
  const navigate = useNavigate();

  const stores = [
    { id: 1, name: "Amazon" },
    { id: 2, name: "Walmart" },
    { id: 3, name: "Target" },
    { id: 4, name: "Best Buy" },
    { id: 5, name: "Costco" },
    { id: 6, name: "Sam's Club" },
    { id: 7, name: "Home Depot" },
    { id: 8, name: "Lowe's" },
    { id: 9, name: "IKEA" },
    { id: 10, name: "Macy's" },
    { id: 11, name: "Kohl's" },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      <div className="px-6 pt-6 pb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5 text-[#1F2937]" />
        </button>
        <h1 className="text-lg font-bold text-[#1F2937]">Stores</h1>
      </div>

      <div className="px-6 grid grid-cols-2 gap-3">
        {stores.map((store) => (
          <Link 
            key={store.id} 
            to={createPageUrl("StoreDetail") + `?store=${encodeURIComponent(store.name)}`}
            className="rounded-2xl bg-white border border-[#E5E7EB] flex items-center justify-center hover:shadow-md transition-shadow"
            style={{ height: '100px' }}
          >
            <img 
              src={`https://logo.clearbit.com/${store.name.toLowerCase().replace(/[^a-z]/g, '')}.com`} 
              alt={store.name} 
              className="max-w-[70%] max-h-[60%] object-contain" 
              style={{ borderRadius: '8px' }}
              onError={(e) => { 
                e.target.style.display = 'none'; 
                e.target.nextSibling.style.display = 'block'; 
              }} 
            />
            <span className="text-sm font-bold text-[#1F2937] hidden">{store.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}