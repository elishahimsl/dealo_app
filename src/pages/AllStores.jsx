import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft } from "lucide-react";

export default function AllStores() {
  const navigate = useNavigate();

  const stores = [
    { id: 1, name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
    { id: 2, name: "Walmart", logo: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Walmart_logo.svg" },
    { id: 3, name: "Target", logo: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Target_logo.svg" },
    { id: 4, name: "Best Buy", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f5/Best_Buy_Logo.svg" },
    { id: 5, name: "Costco", logo: "https://upload.wikimedia.org/wikipedia/commons/5/59/Costco_Wholesale_logo_2010-10-26.svg" },
    { id: 6, name: "Sam's Club", logo: "https://upload.wikimedia.org/wikipedia/commons/8/81/Sams_Club.svg" },
    { id: 7, name: "Home Depot", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5f/TheHomeDepot.svg" },
    { id: 8, name: "Lowe's", logo: "https://upload.wikimedia.org/wikipedia/commons/8/8f/Lowe%27s_Companies_logo.svg" },
    { id: 9, name: "IKEA", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Ikea_logo.svg" },
    { id: 10, name: "Macy's", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b6/Macys_logo.svg" },
    { id: 11, name: "Kohl's", logo: "https://upload.wikimedia.org/wikipedia/commons/1/18/Kohl%27s_logo.svg" },
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
              src={store.logo} 
              alt={store.name} 
              className="max-w-[70%] max-h-[60%] object-contain" 
              style={{ borderRadius: '8px' }}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}