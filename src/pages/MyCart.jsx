import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plus, Heart, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function MyCart() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showCreateCollection, setShowCreateCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [longPressFolder, setLongPressFolder] = useState(null);
  const [longPressTimer, setLongPressTimer] = useState(null);

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

  const deleteFolderMutation = useMutation({
    mutationFn: (folderId) => base44.entities.Folder.delete(folderId),
    onSuccess: () => {
      queryClient.invalidateQueries(['folders']);
      setLongPressFolder(null);
    },
  });

  const mockProducts = [
    { id: 1, brand: "Nike", title: "Alphabete Athletics Nike Killer Pants", price: "$32.44", originalPrice: "$67.44", savings: "$35", size: "M", store: "Nike Store", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400" },
    { id: 2, brand: "Nike", title: "Alphabete Athletic Black Backpack", price: "$22.40", originalPrice: null, savings: null, size: null, store: "Nike Store", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400" },
    { id: 3, brand: "Adidas", title: "Sport Shoes Running Edition", price: "$45.99", originalPrice: "$89.99", savings: "$44", size: "L", store: "Adidas", image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400" },
    { id: 4, brand: "Puma", title: "Training Jacket Premium", price: "$55.00", originalPrice: null, savings: null, size: "M", store: "Puma Store", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400" },
    { id: 5, brand: "Under Armour", title: "Compression Shirt Tech", price: "$28.50", originalPrice: "$45.00", savings: "$16.50", size: "S", store: "Under Armour", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400" }
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

  const handleLongPressStart = (folder) => {
    const timer = setTimeout(() => {
      setLongPressFolder(folder);
    }, 500);
    setLongPressTimer(timer);
  };

  const handleLongPressEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleDeleteFolder = () => {
    if (longPressFolder) {
      deleteFolderMutation.mutate(longPressFolder.id);
    }
  };

  const getFolderProducts = () => mockProducts.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <h1 className="text-lg font-bold text-[#1F2937] text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Saved
        </h1>
      </div>

      {/* Collections Section */}
      <div className="px-6 py-4">
        {folders.length > 0 && (
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[#1F2937]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Collections
            </h2>
            {folders.length >= 2 && (
              <button onClick={() => navigate(createPageUrl("AllCollections"))}>
                <ChevronRight className="w-5 h-5 text-[#6B7280]" />
              </button>
            )}
          </div>
        )}

        {/* Collections Row - Horizontal Scroll */}
        <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
          {/* Existing Collections */}
          {folders.map((folder) => {
            const folderProducts = getFolderProducts();
            return (
              <div
                key={folder.id}
                onTouchStart={() => handleLongPressStart(folder)}
                onTouchEnd={handleLongPressEnd}
                onMouseDown={() => handleLongPressStart(folder)}
                onMouseUp={handleLongPressEnd}
                onMouseLeave={handleLongPressEnd}
                className="relative rounded-2xl overflow-hidden bg-[#E5E7EB] flex-shrink-0 cursor-pointer"
                style={{ width: '120px', height: '120px' }}
              >
                <div className="absolute inset-0 p-3 flex gap-1 justify-center items-center">
                  {folderProducts.slice(0, 3).map((product, idx) => (
                    <div
                      key={product.id}
                      className="w-[26%] aspect-square rounded-lg overflow-hidden shadow-md"
                      style={{
                        transform: `rotate(${(idx - 1) * 5}deg)`,
                        zIndex: 3 - Math.abs(idx - 1)
                      }}
                    >
                      <img src={product.image} alt="Product" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-[#1F2937] text-[10px] font-semibold truncate text-center">{folder.name}</p>
                </div>
              </div>
            );
          })}

          {/* Create Collection Tile - Same size as collection tiles */}
          <button
            onClick={() => setShowCreateCollection(true)}
            className="rounded-2xl bg-[#E5E7EB] flex-shrink-0 relative overflow-hidden"
            style={{ width: '120px', height: '120px' }}
          >
            <div className="absolute top-4 left-0 right-0 flex items-center justify-center">
              <span className="text-[10px] font-semibold text-[#6B7280]">+ Create collection</span>
            </div>
            
            {/* Leaning books - spread across bottom, cropped */}
            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-1">
              {mockProducts.slice(0, 5).map((product, idx) => (
                <div 
                  key={product.id}
                  className="w-5 h-12 rounded-t-sm overflow-hidden shadow-sm"
                  style={{ 
                    transform: `rotate(${(idx - 2) * 6}deg)`,
                    marginBottom: '-4px'
                  }}
                >
                  <img src={product.image} alt="" className="w-full h-full object-cover object-top" />
                </div>
              ))}
            </div>
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-6 py-4">
        <h2 className="text-sm font-semibold text-[#1F2937] mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
          All Items
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {mockProducts.map((product) => (
            <div key={product.id}>
              <div className="bg-white rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-sm mb-2 relative aspect-square">
                <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                {product.savings && (
                  <div className="absolute top-2 left-2 bg-[#00A36C] text-white text-[10px] font-bold px-2 py-1 rounded-md">
                    Save {product.savings}
                  </div>
                )}
                <button className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-[#00A36C] flex items-center justify-center shadow-md">
                  <Heart className="w-4 h-4 text-white fill-white" />
                </button>
              </div>
              <div>
                <p className="text-[10px] text-[#6B7280] mb-0.5" style={{ fontWeight: 300 }}>{product.brand}</p>
                <h3 className="font-bold text-[#1F2937] text-xs mb-0.5 line-clamp-2 leading-tight">{product.title}</h3>
                <p className="text-sm font-bold text-[#1F2937] mb-1">{product.price}</p>
                <div className="flex items-center gap-2 text-[10px]">
                  {product.size && <span className="text-[#6B7280]">{product.size}</span>}
                  <a href={`https://${product.store.toLowerCase().replace(' ', '')}.com`} target="_blank" rel="noopener noreferrer" className="text-[#00A36C] underline hover:opacity-80">
                    Visit Store
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Modal Overlay */}
      {longPressFolder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setLongPressFolder(null)}>
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <div className="w-32 h-32 rounded-2xl overflow-hidden bg-[#E5E7EB] mb-3 mx-auto relative">
              <div className="absolute inset-0 p-2 flex gap-1 justify-center items-center">
                {getFolderProducts().slice(0, 3).map((product, idx) => (
                  <div key={product.id} className="w-[26%] aspect-square rounded-lg overflow-hidden shadow-md" style={{ transform: `rotate(${(idx - 1) * 5}deg)`, zIndex: 3 - Math.abs(idx - 1) }}>
                    <img src={product.image} alt="Product" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
            <button onClick={handleDeleteFolder} className="w-20 mx-auto bg-red-500 text-white py-1.5 rounded-lg text-xs font-semibold hover:bg-red-600 transition-colors flex items-center justify-center">
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Create Collection Modal */}
      {showCreateCollection && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#1F2937]">Create Collection</h3>
              <button onClick={() => setShowCreateCollection(false)}><X className="w-6 h-6 text-[#6B7280]" /></button>
            </div>
            <Input placeholder="Collection name" value={newCollectionName} onChange={(e) => setNewCollectionName(e.target.value)} className="mb-4 h-12 rounded-2xl" />
            <Button onClick={handleCreateCollection} disabled={!newCollectionName.trim()} className="w-full rounded-2xl bg-[#00A36C] hover:bg-[#007E52] h-12">Create</Button>
          </div>
        </div>
      )}

      <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
    </div>
  );
}