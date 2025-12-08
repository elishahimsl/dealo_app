import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft } from "lucide-react";

export default function AllBrands() {
  const navigate = useNavigate();

  const brands = [
    { id: 1, name: "Apple" },
    { id: 2, name: "Samsung" },
    { id: 3, name: "Nike" },
    { id: 4, name: "Adidas" },
    { id: 5, name: "Sony" },
    { id: 6, name: "Microsoft" },
    { id: 7, name: "Levi's" },
    { id: 8, name: "The North Face" },
    { id: 9, name: "Patagonia" },
    { id: 10, name: "KitchenAid" },
    { id: 11, name: "Dyson" },
    { id: 12, name: "Columbia" },
    { id: 13, name: "Ray-Ban" },
    { id: 14, name: "Coach" },
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
          <Link 
            key={brand.id} 
            to={createPageUrl("StoreDetail") + `?store=${encodeURIComponent(brand.name)}`}
            className="rounded-2xl bg-white border border-[#E5E7EB] flex items-center justify-center hover:shadow-md transition-shadow"
            style={{ height: '100px' }}
          >
            <img 
              src={`https://logo.clearbit.com/${brand.name.toLowerCase().replace(/[^a-z]/g, '')}.com`} 
              alt={brand.name} 
              className="w-20 h-20 object-contain rounded-lg" 
              onError={(e) => { 
                e.target.style.display = 'none'; 
                e.target.nextSibling.style.display = 'block'; 
              }} 
            />
            <span className="text-sm font-bold text-[#1F2937] hidden">{brand.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}