import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft } from "lucide-react";

export default function AllBrands() {
  const navigate = useNavigate();

  const brands = [
    { id: 1, name: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
    { id: 2, name: "Samsung", logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg" },
    { id: 3, name: "Nike", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg" },
    { id: 4, name: "Adidas", logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg" },
    { id: 5, name: "Sony", logo: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg" },
    { id: 6, name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
    { id: 7, name: "Levi's", logo: "https://upload.wikimedia.org/wikipedia/commons/4/47/Levi%27s_logo.svg" },
    { id: 8, name: "The North Face", logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/The_North_Face_logo.svg" },
    { id: 9, name: "Patagonia", logo: "https://upload.wikimedia.org/wikipedia/commons/4/49/Patagonia_logo.svg" },
    { id: 10, name: "KitchenAid", logo: "https://upload.wikimedia.org/wikipedia/commons/d/de/KitchenAid_Logo.svg" },
    { id: 11, name: "Dyson", logo: "https://upload.wikimedia.org/wikipedia/commons/7/74/Dyson_logo.svg" },
    { id: 12, name: "Columbia", logo: "https://upload.wikimedia.org/wikipedia/commons/6/60/Columbia_Sportswear_logo.svg" },
    { id: 13, name: "Ray-Ban", logo: "https://upload.wikimedia.org/wikipedia/commons/6/69/Ray-Ban_logo.svg" },
    { id: 14, name: "Coach", logo: "https://upload.wikimedia.org/wikipedia/commons/8/89/Coach_logo.svg" },
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
              src={brand.logo} 
              alt={brand.name} 
              className="max-w-[70%] max-h-[60%] object-contain" 
              style={{ borderRadius: '8px' }}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}