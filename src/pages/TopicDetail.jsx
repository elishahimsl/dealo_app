import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, ChevronRight, Star } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function TopicDetail() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const topicName = urlParams.get('topic') || 'Topic';
  const [showMoreBrands, setShowMoreBrands] = useState(false);
  const [showMoreCategories, setShowMoreCategories] = useState({});
  const [showMoreClothing, setShowMoreClothing] = useState(false);

  const isMenOrWomen = topicName === 'Men' || topicName === 'Women';

  const menClothingCategories = [
    { name: "Shirts & Tops", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300" },
    { name: "Shoes", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300" },
    { name: "Pants & Jeans", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300" },
    { name: "Jackets & Coats", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300" },
    { name: "Activewear", image: "https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=300" },
    { name: "Shorts", image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=300" },
    { name: "Underwear", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300" },
    { name: "Sleepwear", image: "https://images.unsplash.com/photo-1631947430066-48c30d57b943?w=300" },
    { name: "Suits & Blazers", image: "https://images.unsplash.com/photo-1593032465175-7d7eebd1e005?w=300" },
    { name: "Accessories", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300" },
  ];

  const womenClothingCategories = [
    { name: "Dresses", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300" },
    { name: "Tops & Blouses", image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=300" },
    { name: "Shoes", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300" },
    { name: "Pants & Jeans", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300" },
    { name: "Skirts", image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=300" },
    { name: "Activewear", image: "https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=300" },
    { name: "Jackets & Coats", image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=300" },
    { name: "Lingerie", image: "https://images.unsplash.com/photo-1611042553365-9b101441c135?w=300" },
    { name: "Swimwear", image: "https://images.unsplash.com/photo-1562408590-e32931084e23?w=300" },
    { name: "Bags & Accessories", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300" },
  ];

  const topicBrands = {
    Men: [
      { name: "Nike", logo: "https://logo.clearbit.com/nike.com", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", rating: 4.8, reviews: 12400 },
      { name: "Adidas", logo: "https://logo.clearbit.com/adidas.com", image: "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=400", rating: 4.7, reviews: 9800 },
      { name: "Under Armour", logo: "https://logo.clearbit.com/underarmour.com", image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400", rating: 4.6, reviews: 7200 },
      { name: "Levi's", logo: "https://logo.clearbit.com/levi.com", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400", rating: 4.5, reviews: 8900 },
      { name: "Ralph Lauren", logo: "https://logo.clearbit.com/ralphlauren.com", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400", rating: 4.7, reviews: 6500 },
      { name: "Tommy Hilfiger", logo: "https://logo.clearbit.com/tommy.com", image: "https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=400", rating: 4.5, reviews: 5400 },
    ],
    Women: [
      { name: "Zara", logo: "https://logo.clearbit.com/zara.com", image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400", rating: 4.6, reviews: 15200 },
      { name: "H&M", logo: "https://logo.clearbit.com/hm.com", image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400", rating: 4.4, reviews: 18900 },
      { name: "Lululemon", logo: "https://logo.clearbit.com/lululemon.com", image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400", rating: 4.8, reviews: 11200 },
      { name: "Sephora", logo: "https://logo.clearbit.com/sephora.com", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400", rating: 4.7, reviews: 22100 },
      { name: "Victoria's Secret", logo: "https://logo.clearbit.com/victoriassecret.com", image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400", rating: 4.3, reviews: 14500 },
      { name: "Free People", logo: "https://logo.clearbit.com/freepeople.com", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400", rating: 4.5, reviews: 8700 },
    ],
    default: [
      { name: "Apple", logo: "https://logo.clearbit.com/apple.com", image: "https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=400", rating: 4.9, reviews: 45200 },
      { name: "Samsung", logo: "https://logo.clearbit.com/samsung.com", image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400", rating: 4.7, reviews: 32100 },
      { name: "Sony", logo: "https://logo.clearbit.com/sony.com", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", rating: 4.6, reviews: 18700 },
      { name: "Nike", logo: "https://logo.clearbit.com/nike.com", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", rating: 4.8, reviews: 28900 },
      { name: "Dyson", logo: "https://logo.clearbit.com/dyson.com", image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400", rating: 4.7, reviews: 12400 },
      { name: "Bose", logo: "https://logo.clearbit.com/bose.com", image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400", rating: 4.6, reviews: 9800 },
    ]
  };

  const menCategories = [
    { name: "Clothing", items: [
      { name: "T-Shirts", price: "$29.99", originalPrice: "$39.99", discount: 10, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300" },
      { name: "Jeans", price: "$59.99", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300" },
      { name: "Jackets", price: "$89.99", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300" },
      { name: "Hoodies", price: "$49.99", originalPrice: "$69.99", discount: 20, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300" },
    ]},
    { name: "Shoes", items: [
      { name: "Sneakers", price: "$119.99", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300" },
      { name: "Boots", price: "$149.99", originalPrice: "$179.99", discount: 30, image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=300" },
      { name: "Loafers", price: "$89.99", image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=300" },
      { name: "Running", price: "$129.99", image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300" },
    ]},
    { name: "Accessories", items: [
      { name: "Watches", price: "$199.99", originalPrice: "$249.99", discount: 50, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300" },
      { name: "Belts", price: "$39.99", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300" },
      { name: "Wallets", price: "$49.99", image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=300" },
      { name: "Sunglasses", price: "$79.99", originalPrice: "$94.99", discount: 15, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300" },
    ]},
  ];

  const womenCategories = [
    { name: "Clothing", items: [
      { name: "Dresses", price: "$59.99", originalPrice: "$79.99", discount: 20, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300" },
      { name: "Tops", price: "$34.99", image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=300" },
      { name: "Jeans", price: "$69.99", originalPrice: "$94.99", discount: 25, image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300" },
      { name: "Activewear", price: "$49.99", image: "https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=300" },
    ]},
    { name: "Shoes", items: [
      { name: "Heels", price: "$89.99", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300" },
      { name: "Sneakers", price: "$99.99", originalPrice: "$119.99", discount: 20, image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300" },
      { name: "Sandals", price: "$49.99", image: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=300" },
      { name: "Flats", price: "$59.99", originalPrice: "$74.99", discount: 15, image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=300" },
    ]},
    { name: "Beauty", items: [
      { name: "Skincare", price: "$45.99", originalPrice: "$60.99", discount: 15, image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300" },
      { name: "Makeup", price: "$35.99", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300" },
      { name: "Fragrance", price: "$79.99", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=300" },
      { name: "Haircare", price: "$29.99", originalPrice: "$39.99", discount: 10, image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300" },
    ]},
  ];

  const genericCategories = [
    { name: "Best Sellers", items: [
      { name: "Top Pick 1", price: "$49.99", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300" },
      { name: "Top Pick 2", price: "$79.99", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300" },
      { name: "Top Pick 3", price: "$39.99", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300" },
      { name: "Top Pick 4", price: "$59.99", image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=300" },
    ]},
    { name: "New Arrivals", items: [
      { name: "New Item 1", price: "$69.99", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300" },
      { name: "New Item 2", price: "$89.99", image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=300" },
      { name: "New Item 3", price: "$44.99", image: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=300" },
      { name: "New Item 4", price: "$54.99", image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300" },
    ]},
  ];

  const brands = topicBrands[topicName] || topicBrands.default;
  const visibleBrands = showMoreBrands ? brands : brands.slice(0, 4);
  const categories = topicName === 'Men' ? menCategories : topicName === 'Women' ? womenCategories : genericCategories;
  const clothingCategories = topicName === 'Men' ? menClothingCategories : topicName === 'Women' ? womenClothingCategories : [];

  const toggleCategory = (catName) => {
    setShowMoreCategories(prev => ({ ...prev, [catName]: !prev[catName] }));
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)}><ArrowLeft className="w-5 h-5 text-[#1F2937]" /></button>
          <div className="w-5" />
          <div className="w-5" />
        </div>
        
        {/* Search Bar */}
        <div className="w-full h-10 rounded-2xl bg-[#E5E7EB] flex items-center px-4 gap-2">
          <Search className="w-4 h-4 text-[#6B7280]" />
          <span className="text-sm text-[#6B7280]">Search</span>
        </div>

        {/* Topic Name below search */}
        <h1 className="text-base font-semibold text-[#1F2937] text-center mt-3">{topicName}</h1>
      </div>

      {/* Clothing Categories - Only for Men/Women */}
      {isMenOrWomen && (
        <div className="px-6 mb-6">
          <h2 className="text-sm font-bold text-[#1F2937] mb-3">Categories</h2>
          <div className="grid grid-cols-2 gap-3">
            {(showMoreClothing ? clothingCategories : clothingCategories.slice(0, 6)).map((cat, idx) => (
              <div key={idx} className="rounded-2xl overflow-hidden bg-white border border-[#E5E7EB] shadow-sm relative" style={{ height: '100px' }}>
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <p className="text-white text-sm font-semibold">{cat.name}</p>
                </div>
              </div>
            ))}
          </div>
          {clothingCategories.length > 6 && (
            <button onClick={() => setShowMoreClothing(!showMoreClothing)} className="w-full py-2 mt-3 text-center text-sm font-semibold text-[#00A36C] border border-[#00A36C] rounded-xl hover:bg-[#D6F5E9]">
              {showMoreClothing ? 'Less' : 'More'}
            </button>
          )}
        </div>
      )}

      {/* Featured Brands */}
      <div className="px-6 mb-6">
        <h2 className="text-sm font-bold text-[#1F2937] mb-3">Featured Brands</h2>
        <div className="grid grid-cols-2 gap-3">
          {visibleBrands.map((brand, idx) => (
            <div key={idx} className="rounded-2xl overflow-hidden bg-white border border-[#E5E7EB] shadow-sm aspect-square relative">
              <img src={brand.image} alt={brand.name} className="w-full h-full object-cover brightness-[0.3]" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <img src={brand.logo} alt={brand.name} className="w-20 h-20 object-contain brightness-0 invert mb-2" />
                <p className="text-sm font-bold text-white">{brand.name}</p>
              </div>
            </div>
          ))}
        </div>
        
        {brands.length > 4 && (
          <button onClick={() => setShowMoreBrands(!showMoreBrands)} className="w-full py-2 mt-3 text-center text-sm font-semibold text-[#00A36C] border border-[#00A36C] rounded-xl hover:bg-[#D6F5E9]">
            {showMoreBrands ? 'Less' : 'More'}
          </button>
        )}
      </div>

      {/* Product Categories */}
      <div className="px-6 space-y-6">
        {categories.map((cat) => (
          <div key={cat.name}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-[#1F2937]">{cat.name}</h2>
              <button className="w-7 h-7 rounded-full border border-[#E5E7EB] flex items-center justify-center">
                <ChevronRight className="w-4 h-4 text-[#6B7280]" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {(showMoreCategories[cat.name] ? cat.items : cat.items.slice(0, 4)).map((item, idx) => (
                <div key={idx}>
                  <div className="rounded-2xl overflow-hidden bg-white border border-[#E5E7EB] shadow-sm mb-2 aspect-square relative">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-xs font-semibold text-[#1F2937]">{item.name}</p>
                </div>
              ))}
            </div>
            {cat.items.length > 4 && (
              <button onClick={() => toggleCategory(cat.name)} className="w-full py-2 mt-2 text-center text-xs font-semibold text-[#00A36C] border border-[#00A36C] rounded-xl">
                {showMoreCategories[cat.name] ? 'Less' : 'More'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}