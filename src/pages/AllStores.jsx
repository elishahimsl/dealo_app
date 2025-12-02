import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function AllStores() {
  const navigate = useNavigate();

  const stores = [
    { id: 1, name: "Amazon", url: "https://amazon.com" },
    { id: 2, name: "Walmart", url: "https://walmart.com" },
    { id: 3, name: "Target", url: "https://target.com" },
    { id: 4, name: "Best Buy", url: "https://bestbuy.com" },
    { id: 5, name: "Costco", url: "https://costco.com" },
    { id: 6, name: "Sam's Club", url: "https://samsclub.com" },
    { id: 7, name: "Home Depot", url: "https://homedepot.com" },
    { id: 8, name: "Lowe's", url: "https://lowes.com" },
    { id: 9, name: "IKEA", url: "https://ikea.com" },
    { id: 10, name: "Macy's", url: "https://macys.com" },
    { id: 11, name: "Kohl's", url: "https://kohls.com" },
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
          <a 
            key={store.id} 
            href={store.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="rounded-2xl bg-white border border-[#E5E7EB] flex items-center justify-center hover:shadow-md transition-shadow"
            style={{ height: '100px' }}
          >
            <img 
              src={`https://logo.clearbit.com/${store.name.toLowerCase().replace(/[^a-z]/g, '')}.com`} 
              alt={store.name} 
              className="max-w-[60%] max-h-[50%] object-contain" 
              onError={(e) => { 
                e.target.style.display = 'none'; 
                e.target.nextSibling.style.display = 'block'; 
              }} 
            />
            <span className="text-sm font-bold text-[#1F2937] hidden">{store.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}