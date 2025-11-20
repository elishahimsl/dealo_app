import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Heart, Folder, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function MyCart() {
  const queryClient = useQueryClient();
  const [showCreateCollection, setShowCreateCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [selectedCollection, setSelectedCollection] = useState(null);

  const { data: folders } = useQuery({
    queryKey: ['folders'],
    queryFn: () => base44.entities.Folder.list(),
    initialData: [],
  });

  const { data: captures } = useQuery({
    queryKey: ['allCaptures'],
    queryFn: () => base44.entities.Capture.list('-created_date'),
    initialData: [],
  });

  const createFolderMutation = useMutation({
    mutationFn: (folderData) => base44.entities.Folder.create(folderData),
    onSuccess: () => {
      queryClient.invalidateQueries(['folders']);
      setShowCreateCollection(false);
      setNewCollectionName("");
    }
  });

  const mockProducts = [
    {
      id: 1,
      brand: "Nike",
      title: "Alphabete Athletics Nike Killer Pants",
      price: "$32.44",
      originalPrice: "$67.44",
      savings: "$35",
      size: "M",
      store: "Nike Store",
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400"
    },
    {
      id: 2,
      brand: "Nike",
      title: "Alphabete Athletic Black Backpack",
      price: "$22.40",
      originalPrice: null,
      savings: null,
      size: null,
      store: "Nike Store",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400"
    }
  ];

  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      createFolderMutation.mutate({
        name: newCollectionName,
        type: "manual",
        category: "custom",
        color: "#00A36C",
        icon: "Folder",
        item_count: 0
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      {/* Header - Centered */}
      <div className="px-6 pt-8 pb-4">
        <h1 className="text-lg font-bold text-[#1F2937] text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Saved
        </h1>
      </div>

      {/* Collections Section */}
      <div className="px-6 py-4">
        <h2 className="text-sm font-semibold text-[#1F2937] mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Collections
        </h2>

        {/* Create Collection Button - Full Width with Books */}
        <button
          onClick={() => setShowCreateCollection(true)}
          className="w-full bg-[#E5E7EB] rounded-2xl relative overflow-hidden mb-3"
          style={{ minHeight: '120px' }}
        >
          {/* Centered Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-semibold text-[#6B7280]">+ Create collection</span>
          </div>
          
          {/* Book-like images at bottom */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-end gap-1">
            <div 
              className="w-16 h-20 rounded-t-lg overflow-hidden shadow-lg"
              style={{ transform: 'rotate(-8deg) translateY(8px)' }}
            >
              <img src={mockProducts[0].image} alt="" className="w-full h-full object-cover" />
            </div>
            <div 
              className="w-16 h-24 rounded-t-lg overflow-hidden shadow-lg"
              style={{ transform: 'rotate(-3deg) translateY(4px)' }}
            >
              <img src={mockProducts[1].image} alt="" className="w-full h-full object-cover" />
            </div>
            <div 
              className="w-16 h-20 rounded-t-lg overflow-hidden shadow-lg"
              style={{ transform: 'rotate(8deg) translateY(8px)' }}
            >
              <img src={mockProducts[0].image} alt="" className="w-full h-full object-cover" />
            </div>
          </div>
        </button>

        {/* Existing Collections - Horizontal Scroll */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6">
          {folders.map((folder) => (
            <button
              key={folder.id}
              onClick={() => setSelectedCollection(folder.id)}
              className="flex-shrink-0 w-24 h-24 rounded-2xl bg-white border-2 border-[#E5E7EB] shadow-sm hover:border-[#00A36C] transition-colors relative overflow-hidden"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <Folder className="w-10 h-10 text-[#00A36C]" />
              </div>
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-xs font-semibold text-[#1F2937] truncate">{folder.name}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-2 gap-4">
          {mockProducts.map((product) => (
            <div key={product.id}>
              {/* Product Image - Separate Square Tile */}
              <div className="bg-white rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-sm mb-2 relative aspect-square">
                <img 
                  src={product.image} 
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                {/* Savings Badge - Top Left */}
                {product.savings && (
                  <div className="absolute top-2 left-2 bg-[#00A36C] text-white text-[10px] font-bold px-2 py-1 rounded-md">
                    Save {product.savings}
                  </div>
                )}
                {/* Heart Icon - Bottom Right */}
                <button className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-[#00A36C] flex items-center justify-center shadow-md">
                  <Heart className="w-4 h-4 text-white fill-white" />
                </button>
              </div>

              {/* Product Info - Text underneath */}
              <div>
                <p className="text-[10px] text-[#6B7280] mb-0.5" style={{ fontWeight: 300 }}>
                  {product.brand}
                </p>
                <h3 className="font-bold text-[#1F2937] text-xs mb-0.5 line-clamp-2 leading-tight">
                  {product.title}
                </h3>
                <p className="text-sm font-bold text-[#1F2937] mb-1">
                  {product.price}
                </p>
                <div className="flex items-center gap-2 text-[10px]">
                  {product.size && (
                    <span className="text-[#6B7280]">{product.size}</span>
                  )}
                  <a 
                    href={`https://${product.store.toLowerCase().replace(' ', '')}.com`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00A36C] underline hover:opacity-80"
                  >
                    Visit Store
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Collection Modal */}
      {showCreateCollection && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#1F2937]">Create Collection</h3>
              <button onClick={() => setShowCreateCollection(false)}>
                <X className="w-6 h-6 text-[#6B7280]" />
              </button>
            </div>
            <Input
              placeholder="Collection name"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              className="mb-4 h-12 rounded-2xl"
            />
            <Button
              onClick={handleCreateCollection}
              disabled={!newCollectionName.trim()}
              className="w-full rounded-2xl bg-[#00A36C] hover:bg-[#007E52] h-12"
            >
              Create
            </Button>
          </div>
        </div>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}