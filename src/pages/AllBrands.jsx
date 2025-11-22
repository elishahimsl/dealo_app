import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function AllBrands() {
  const navigate = useNavigate();

  const brands = [
    { id: 1, name: "Nike", logo: "https://logo.clearbit.com/nike.com" },
    { id: 2, name: "Apple", logo: "https://logo.clearbit.com/apple.com" },
    { id: 3, name: "Samsung", logo: "https://logo.clearbit.com/samsung.com" },
    { id: 4, name: "Sony", logo: "https://logo.clearbit.com/sony.com" },
    { id: 5, name: "Adidas", logo: "https://logo.clearbit.com/adidas.com" },
    { id: 6, name: "Canon", logo: "https://logo.clearbit.com/canon.com" },
    { id: 7, name: "Microsoft", logo: "https://logo.clearbit.com/microsoft.com" },
    { id: 8, name: "Dell", logo: "https://logo.clearbit.com/dell.com" },
    { id: 9, name: "HP", logo: "https://logo.clearbit.com/hp.com" },
    { id: 10, name: "LG", logo: "https://logo.clearbit.com/lg.com" },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      <div className="px-6 pt-8 pb-4">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6 text-[#1F2937]" />
          </button>
          <h1 className="text-2xl font-bold text-[#1F2937]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            All Brands
          </h1>
        </div>
      </div>

      <div className="px-6">
        <div className="grid grid-cols-2 gap-4">
          {brands.map((brand) => (
            <a
              key={brand.id}
              href={`https://${brand.name.toLowerCase()}.com`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm hover:shadow-md transition-all flex items-center justify-center"
              style={{ height: '120px' }}
            >
              <img
                src={brand.logo}
                alt={brand.name}
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