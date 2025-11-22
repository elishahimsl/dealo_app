import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function AllStores() {
  const navigate = useNavigate();

  const stores = [
    { id: 1, name: "Target", logo: "https://logo.clearbit.com/target.com" },
    { id: 2, name: "Walmart", logo: "https://logo.clearbit.com/walmart.com" },
    { id: 3, name: "Amazon", logo: "https://logo.clearbit.com/amazon.com" },
    { id: 4, name: "Best Buy", logo: "https://logo.clearbit.com/bestbuy.com" },
    { id: 5, name: "Costco", logo: "https://logo.clearbit.com/costco.com" },
    { id: 6, name: "CVS", logo: "https://logo.clearbit.com/cvs.com" },
    { id: 7, name: "Walgreens", logo: "https://logo.clearbit.com/walgreens.com" },
    { id: 8, name: "Home Depot", logo: "https://logo.clearbit.com/homedepot.com" },
    { id: 9, name: "Kroger", logo: "https://logo.clearbit.com/kroger.com" },
    { id: 10, name: "Lowe's", logo: "https://logo.clearbit.com/lowes.com" },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      <div className="px-6 pt-8 pb-4">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6 text-[#1F2937]" />
          </button>
          <h1 className="text-2xl font-bold text-[#1F2937]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            All Stores
          </h1>
        </div>
      </div>

      <div className="px-6">
        <div className="grid grid-cols-2 gap-4">
          {stores.map((store) => (
            <a
              key={store.id}
              href={`https://${store.name.toLowerCase().replace(/['s\s]/g, '')}.com`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm hover:shadow-md transition-all flex items-center justify-center"
              style={{ height: '120px' }}
            >
              <img
                src={store.logo}
                alt={store.name}
                className="max-w-[80%] max-h-[60%] object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}