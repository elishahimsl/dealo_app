import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function AllBrands() {
  const navigate = useNavigate();

  const brands = [
    { id: 1, name: "Nike", url: "https://nike.com" },
    { id: 2, name: "Apple", url: "https://apple.com" },
    { id: 3, name: "Samsung", url: "https://samsung.com" },
    { id: 4, name: "Sony", url: "https://sony.com" },
    { id: 5, name: "Adidas", url: "https://adidas.com" },
    { id: 6, name: "Canon", url: "https://canon.com" },
    { id: 7, name: "Puma", url: "https://puma.com" },
    { id: 8, name: "Under Armour", url: "https://underarmour.com" },
    { id: 9, name: "Lululemon", url: "https://lululemon.com" },
    { id: 10, name: "New Balance", url: "https://newbalance.com" },
    { id: 11, name: "Dyson", url: "https://dyson.com" },
    { id: 12, name: "Bose", url: "https://bose.com" },
    { id: 13, name: "LG", url: "https://lg.com" },
    { id: 14, name: "Dell", url: "https://dell.com" },
    { id: 15, name: "HP", url: "https://hp.com" },
    { id: 16, name: "Lenovo", url: "https://lenovo.com" },
    { id: 17, name: "Asus", url: "https://asus.com" },
    { id: 18, name: "Microsoft", url: "https://microsoft.com" },
    { id: 19, name: "Google", url: "https://store.google.com" },
    { id: 20, name: "Philips", url: "https://philips.com" },
    { id: 21, name: "Panasonic", url: "https://panasonic.com" },
    { id: 22, name: "JBL", url: "https://jbl.com" },
    { id: 23, name: "Beats", url: "https://beatsbydre.com" },
    { id: 24, name: "Fitbit", url: "https://fitbit.com" },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-center relative">
          <button onClick={() => navigate(-1)} className="absolute left-0">
            <ArrowLeft className="w-5 h-5 text-[#1F2937]" />
          </button>
          <h1 className="text-base text-[#1F2937]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}>Brands</h1>
        </div>
      </div>

      <div className="px-6 grid grid-cols-3 gap-3">
        {brands.map((brand) => (
          <a key={brand.id} href={brand.url} target="_blank" rel="noopener noreferrer" className="rounded-2xl bg-[#E5E7EB] flex items-center justify-center py-4 hover:bg-[#D1D5DB] transition-colors">
            <span className="text-xs font-bold text-[#1F2937] text-center">{brand.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}