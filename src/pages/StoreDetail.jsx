import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Star, SlidersHorizontal, ChevronLeft, Menu, ShoppingBag } from "lucide-react";

export default function StoreDetail() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const storeName = urlParams.get("store") || "Target";
  
  const [isFollowing, setIsFollowing] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [sortBy, setSortBy] = useState("featured");

  const storeData = {
    "Target": {
      name: "Target",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Target_logo.svg/1200px-Target_logo.svg.png",
      color: "#CC0000",
      rating: 4.8,
      reviews: "105K",
      tagline: "Expect More. Pay Less.",
      products: [
        { id: 1, title: "Striped Pillow", price: "$24.99", originalPrice: "$39.99", discount: "38%", rating: 4.5, reviews: 48, image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=300", badge: "Best Seller" },
        { id: 2, title: "White Cups Set", price: "$34.99", originalPrice: "$49.99", discount: "30%", rating: 4.3, reviews: 18, image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=300", badge: null },
        { id: 3, title: "Throw Blanket", price: "$29.99", originalPrice: "$44.99", discount: "33%", rating: 4.7, reviews: 92, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300", badge: "Top Rated" },
        { id: 4, title: "Scented Candles", price: "$18.99", originalPrice: "$24.99", discount: "24%", rating: 4.4, reviews: 156, image: "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=300", badge: null },
        { id: 5, title: "Kitchen Towels", price: "$12.99", originalPrice: "$19.99", discount: "35%", rating: 4.2, reviews: 67, image: "https://images.unsplash.com/photo-1583845112203-29329902332e?w=300", badge: null },
        { id: 6, title: "Storage Basket", price: "$22.99", originalPrice: "$34.99", discount: "34%", rating: 4.6, reviews: 203, image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300", badge: "Best Seller" },
      ]
    },
    "Amazon": {
      name: "Amazon",
      logo: "https://logo.clearbit.com/amazon.com",
      color: "#FF9900",
      rating: 4.7,
      reviews: "2.1M",
      tagline: "Work hard. Have fun. Make history.",
      products: [
        { id: 1, title: "Echo Dot", price: "$29.99", originalPrice: "$49.99", discount: "40%", rating: 4.7, reviews: 892, image: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=300", badge: "Best Seller" },
        { id: 2, title: "Fire TV Stick", price: "$24.99", originalPrice: "$39.99", discount: "38%", rating: 4.5, reviews: 1203, image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300", badge: null },
        { id: 3, title: "Kindle", price: "$89.99", originalPrice: "$119.99", discount: "25%", rating: 4.8, reviews: 567, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300", badge: "Top Rated" },
        { id: 4, title: "AirPods Case", price: "$12.99", originalPrice: "$19.99", discount: "35%", rating: 4.3, reviews: 234, image: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=300", badge: null },
      ]
    },
    "Walmart": {
      name: "Walmart",
      logo: "https://logo.clearbit.com/walmart.com",
      color: "#0071CE",
      rating: 4.5,
      reviews: "890K",
      tagline: "Save Money. Live Better.",
      products: [
        { id: 1, title: "LEGO Set", price: "$24.99", originalPrice: "$39.99", discount: "38%", rating: 4.8, reviews: 324, image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=300", badge: "Best Seller" },
        { id: 2, title: "Board Game", price: "$19.99", originalPrice: "$29.99", discount: "33%", rating: 4.4, reviews: 89, image: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=300", badge: null },
        { id: 3, title: "Action Figure", price: "$14.99", originalPrice: "$24.99", discount: "40%", rating: 4.6, reviews: 156, image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=300", badge: null },
        { id: 4, title: "Puzzle Set", price: "$9.99", originalPrice: "$14.99", discount: "33%", rating: 4.2, reviews: 78, image: "https://images.unsplash.com/photo-1606503153255-59d8b8b82176?w=300", badge: "Deal" },
      ]
    },
    "Best Buy": {
      name: "Best Buy",
      logo: "https://logo.clearbit.com/bestbuy.com",
      color: "#0046BE",
      rating: 4.6,
      reviews: "456K",
      tagline: "Expert Service. Unbeatable Price.",
      products: [
        { id: 1, title: "Wireless Headphones", price: "$89.99", originalPrice: "$149.99", discount: "40%", rating: 4.7, reviews: 892, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300", badge: "Best Seller" },
        { id: 2, title: "Smart Watch", price: "$199.99", originalPrice: "$299.99", discount: "33%", rating: 4.5, reviews: 456, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300", badge: null },
        { id: 3, title: "Bluetooth Speaker", price: "$49.99", originalPrice: "$79.99", discount: "38%", rating: 4.4, reviews: 234, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300", badge: "Top Rated" },
        { id: 4, title: "USB-C Hub", price: "$29.99", originalPrice: "$49.99", discount: "40%", rating: 4.3, reviews: 123, image: "https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=300", badge: null },
      ]
    },
    "Nike": {
      name: "Nike",
      logo: "https://logo.clearbit.com/nike.com",
      color: "#111111",
      rating: 4.9,
      reviews: "1.2M",
      tagline: "Just Do It.",
      products: [
        { id: 1, title: "Air Max 90", price: "$119.99", originalPrice: "$159.99", discount: "25%", rating: 4.9, reviews: 2341, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300", badge: "Best Seller" },
        { id: 2, title: "Running Shorts", price: "$34.99", originalPrice: "$49.99", discount: "30%", rating: 4.6, reviews: 567, image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=300", badge: null },
        { id: 3, title: "Dri-FIT Shirt", price: "$29.99", originalPrice: "$44.99", discount: "33%", rating: 4.7, reviews: 892, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300", badge: "Top Rated" },
        { id: 4, title: "Sports Bag", price: "$44.99", originalPrice: "$64.99", discount: "31%", rating: 4.5, reviews: 234, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300", badge: null },
      ]
    },
    "Apple": {
      name: "Apple",
      logo: "https://logo.clearbit.com/apple.com",
      color: "#555555",
      rating: 4.9,
      reviews: "3.2M",
      tagline: "Think Different.",
      products: [
        { id: 1, title: "AirPods Pro", price: "$199.99", originalPrice: "$249.99", discount: "20%", rating: 4.9, reviews: 8934, image: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=300", badge: "Best Seller" },
        { id: 2, title: "MagSafe Charger", price: "$34.99", originalPrice: "$44.99", discount: "22%", rating: 4.7, reviews: 1234, image: "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=300", badge: null },
        { id: 3, title: "Apple Watch Band", price: "$44.99", originalPrice: "$59.99", discount: "25%", rating: 4.6, reviews: 567, image: "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=300", badge: null },
        { id: 4, title: "iPhone Case", price: "$49.99", originalPrice: "$69.99", discount: "29%", rating: 4.5, reviews: 2341, image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=300", badge: "Top Rated" },
      ]
    }
  };

  // Default to Target if store not found
  const store = storeData[storeName] || storeData["Target"];

  const toggleFavorite = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const sortedProducts = [...store.products].sort((a, b) => {
    if (sortBy === "price-low") return parseFloat(a.price.slice(1)) - parseFloat(b.price.slice(1));
    if (sortBy === "price-high") return parseFloat(b.price.slice(1)) - parseFloat(a.price.slice(1));
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "discount") return parseInt(b.discount) - parseInt(a.discount);
    return 0; // featured - original order
  });

  const featuredCategories = [
    { id: 1, name: "Deals", image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=300", label: "Top Deals" },
    { id: 2, name: "Best Sellers", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300", label: "Best Sellers" },
    { id: 3, name: "New Arrivals", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300", label: "New Arrivals" },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      {/* Store color header band - lighter */}
      <div 
        className="absolute top-0 left-0 right-0 h-32 z-0"
        style={{ backgroundColor: `${store.color}30` }}
      />

      {/* Back button - on the header band, left side */}
      <button 
        onClick={() => navigate(-1)} 
        className="absolute top-20 left-4 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center z-20"
      >
        <ChevronLeft className="w-5 h-5 text-[#1F2937]" />
      </button>

      {/* Menu button - on the header band, right side */}
      <button 
        className="absolute top-20 right-4 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center z-20"
      >
        <Menu className="w-5 h-5 text-[#6B7280]" />
      </button>

      {/* Logo - centered, overlapping the header band */}
      <div className="relative z-10 flex justify-center pt-16">
        <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center border-4 border-white">
          <img src={store.logo} alt={store.name} className="w-16 h-16 object-contain" />
        </div>
      </div>

      {/* Store Info - centered below logo */}
      <div className="relative z-10 flex flex-col items-center pt-3 pb-4">
        <h1 className="text-xl font-bold text-[#1F2937] mb-1">{store.name}</h1>
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-semibold text-[#1F2937]">{store.rating}</span>
          <span className="text-sm text-[#6B7280]">· {store.reviews} reviews</span>
        </div>
        <button 
          onClick={() => setIsFollowing(!isFollowing)}
          className={`px-6 py-1.5 rounded-full text-sm font-semibold mb-2 ${
            isFollowing 
              ? 'bg-[#E5E7EB] text-[#1F2937]' 
              : 'bg-[#1F2937] text-white'
          }`}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </button>
        <p className="text-xs text-[#6B7280] italic">{store.tagline}</p>
      </div>

      {/* Main content */}
      <div className="relative z-10 bg-[#F9FAFB] min-h-screen pt-2">

        {/* Featured Categories - Horizontal row with labels underneath */}
        <div className="px-6 mt-2">
          <h2 className="text-sm font-bold text-[#1F2937] mb-3">Featured</h2>
          <div className="flex gap-3">
            {/* Deals tile */}
            <div className="flex-1">
              <button className="w-full rounded-xl overflow-hidden relative" style={{ height: '80px' }}>
                <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=300" alt="Deals" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40" />
                <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">Deals</span>
              </button>
              <div className="flex items-center gap-1 mt-1.5">
                <ShoppingBag className="w-3 h-3 text-[#6B7280]" />
                <span className="text-[10px] text-[#6B7280]">Top Deals</span>
              </div>
            </div>
            
            {/* Best Sellers tile */}
            <div className="flex-1">
              <button className="w-full rounded-xl overflow-hidden relative" style={{ height: '80px' }}>
                <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300" alt="Best Sellers" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40" />
                <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">Best Sellers</span>
              </button>
              <div className="flex items-center gap-1 mt-1.5">
                <Star className="w-3 h-3 text-[#6B7280]" />
                <span className="text-[10px] text-[#6B7280]">Best Sellers</span>
              </div>
            </div>
            
            {/* New Arrivals tile */}
            <div className="flex-1">
              <button className="w-full rounded-xl overflow-hidden relative" style={{ height: '80px' }}>
                <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300" alt="New Arrivals" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40" />
                <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">New Arrivals</span>
              </button>
              <div className="flex items-center gap-1 mt-1.5">
                <ShoppingBag className="w-3 h-3 text-[#6B7280]" />
                <span className="text-[10px] text-[#6B7280]">New</span>
              </div>
            </div>
          </div>
        </div>

      {/* Products Section */}
      <div className="px-6 mt-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-[#1F2937]">Products</h2>
          <button 
            onClick={() => setShowFilter(true)}
            className="w-8 h-8 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#6B7280]" />
          </button>
        </div>

        {/* Products Grid - saved-style tiles */}
        <div className="grid grid-cols-2 gap-3">
          {sortedProducts.map((product) => (
            <div key={product.id}>
              {/* Product Image Tile */}
              <div className="aspect-square rounded-2xl overflow-hidden relative mb-2">
                <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                
                {/* Badge - bottom left */}
                {product.badge && (
                  <div className="absolute bottom-2 left-2 bg-black/40 backdrop-blur-sm text-white text-[8px] font-bold px-2 py-0.5 rounded">
                    {product.badge}
                  </div>
                )}

                {/* Price badge - top left, semi-transparent */}
                <div className="absolute top-2 left-2 bg-black/40 backdrop-blur-sm rounded px-1 py-0.5">
                  <span className="text-[9px] font-bold text-white leading-none">{product.price}</span>
                </div>

                {/* Heart - bottom right */}
                <button 
                  onClick={() => toggleFavorite(product.id)}
                  className={`absolute bottom-2 right-2 w-6 h-6 rounded-full flex items-center justify-center ${
                    favorites.includes(product.id) 
                      ? 'bg-[#00A36C]' 
                      : 'bg-[#6B7280]/60'
                  }`}
                >
                  <Heart className={`w-3 h-3 ${favorites.includes(product.id) ? 'text-white fill-white' : 'text-white'}`} />
                </button>
              </div>

              {/* Product Info underneath - no tile */}
              <h3 className="text-xs font-semibold text-[#1F2937] mb-0.5 truncate">{product.title}</h3>
              
              {/* Rating */}
              <div className="flex items-center gap-0.5 mb-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-2.5 h-2.5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                  />
                ))}
                <span className="text-[9px] text-[#6B7280] ml-0.5">({product.reviews})</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-[#6B7280] line-through">{product.originalPrice}</span>
                <span className="bg-[#00A36C] text-white text-[8px] font-bold px-1 py-0.5 rounded">{product.discount} off</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Modal */}
      {showFilter && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center" onClick={() => setShowFilter(false)}>
          <div className="bg-white w-full rounded-t-3xl p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-[#1F2937] mb-4">Sort & Filter</h3>
            
            <div className="space-y-2">
              {[
                { value: "featured", label: "Featured" },
                { value: "price-low", label: "Price: Low to High" },
                { value: "price-high", label: "Price: High to Low" },
                { value: "rating", label: "Highest Rated" },
                { value: "discount", label: "Biggest Discount" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => { setSortBy(option.value); setShowFilter(false); }}
                  className={`w-full p-3 rounded-xl text-left text-sm font-medium ${
                    sortBy === option.value 
                      ? 'bg-[#00A36C] text-white' 
                      : 'bg-[#F3F4F6] text-[#1F2937]'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}