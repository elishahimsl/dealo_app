import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function AllStores() {
  const navigate = useNavigate();

  const stores = [
    { id: 1, name: "Target", url: "https://target.com" },
    { id: 2, name: "Walmart", url: "https://walmart.com" },
    { id: 3, name: "Amazon", url: "https://amazon.com" },
    { id: 4, name: "Best Buy", url: "https://bestbuy.com" },
    { id: 5, name: "Costco", url: "https://costco.com" },
    { id: 6, name: "CVS", url: "https://cvs.com" },
    { id: 7, name: "Walgreens", url: "https://walgreens.com" },
    { id: 8, name: "Home Depot", url: "https://homedepot.com" },
    { id: 9, name: "Lowes", url: "https://lowes.com" },
    { id: 10, name: "Macys", url: "https://macys.com" },
    { id: 11, name: "Nordstrom", url: "https://nordstrom.com" },
    { id: 12, name: "Sephora", url: "https://sephora.com" },
    { id: 13, name: "Ulta", url: "https://ulta.com" },
    { id: 14, name: "Kohls", url: "https://kohls.com" },
    { id: 15, name: "JCPenney", url: "https://jcpenney.com" },
    { id: 16, name: "TJ Maxx", url: "https://tjmaxx.com" },
    { id: 17, name: "Ross", url: "https://rossstores.com" },
    { id: 18, name: "Marshalls", url: "https://marshalls.com" },
    { id: 19, name: "Dick's Sporting", url: "https://dickssportinggoods.com" },
    { id: 20, name: "REI", url: "https://rei.com" },
    { id: 21, name: "Trader Joes", url: "https://traderjoes.com" },
    { id: 22, name: "Whole Foods", url: "https://wholefoodsmarket.com" },
    { id: 23, name: "Kroger", url: "https://kroger.com" },
    { id: 24, name: "Publix", url: "https://publix.com" },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-center relative">
          <button onClick={() => navigate(-1)} className="absolute left-0">
            <ArrowLeft className="w-5 h-5 text-[#1F2937]" />
          </button>
          <h1 className="text-base text-[#1F2937]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>Stores</h1>
        </div>
      </div>

      <div className="px-6 grid grid-cols-3 gap-3">
        {stores.map((store) => (
          <a key={store.id} href={store.url} target="_blank" rel="noopener noreferrer" className="rounded-2xl bg-[#E5E7EB] flex items-center justify-center py-4 hover:bg-[#D1D5DB] transition-colors">
            <span className="text-xs font-bold text-[#1F2937] text-center">{store.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}