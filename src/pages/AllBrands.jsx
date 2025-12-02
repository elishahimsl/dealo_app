import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function AllBrands() {
  const navigate = useNavigate();

  const brands = [
    { id: 1, name: "Apple", url: "https://apple.com" },
    { id: 2, name: "Samsung", url: "https://samsung.com" },
    { id: 3, name: "Nike", url: "https://nike.com" },
    { id: 4, name: "Adidas", url: "https://adidas.com" },
    { id: 5, name: "Sony", url: "https://sony.com" },
    { id: 6, name: "Microsoft", url: "https://microsoft.com" },
    { id: 7, name: "Levi's", url: "https://levis.com" },
    { id: 8, name: "The North Face", url: "https://thenorthface.com" },
    { id: 9, name: "Patagonia", url: "https://patagonia.com" },
    { id: 10, name: "KitchenAid", url: "https://kitchenaid.com" },
    { id: 11, name: "Dyson", url: "https://dyson.com" },
    { id: 12, name: "Columbia", url: "https://columbia.com" },
    { id: 13, name: "Ray-Ban", url: "https://ray-ban.com" },
    { id: 14, name: "Coach", url: "https://coach.com" },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      <div className="px-6 pt-6 pb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5 text-[#1F2937]" />
        </button>
        <h1 className="text-lg font-bold text-[#1F2937]">Brands</h1>
      </div>

      <div className="px-6 grid grid-cols-2 gap-3">
        {brands.map((brand) => (
          <a 
            key={brand.id} 
            href={brand.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="rounded-2xl bg-white border border-[#E5E7EB] flex items-center justify-center hover:shadow-md transition-shadow"
            style={{ height: '100px' }}
          >
            <img 
              src={`https://logo.clearbit.com/${brand.name.toLowerCase().replace(/[^a-z]/g, '')}.com`} 
              alt={brand.name} 
              className="max-w-[60%] max-h-[50%] object-contain" 
              onError={(e) => { 
                e.target.style.display = 'none'; 
                e.target.nextSibling.style.display = 'block'; 
              }} 
            />
            <span className="text-sm font-bold text-[#1F2937] hidden">{brand.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}