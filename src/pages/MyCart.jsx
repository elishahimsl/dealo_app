import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Heart, MoreVertical, Folder, Camera, X } from "lucide-react";
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
      title: "Alphabete Athletics Nike Killer Pants",
      price: "$32.44",
      store: "Nike Store",
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400"
    },
    {
      id: 2,
      title: "Alphabete Athletic Black Backpack",
      price: "$22.40",
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
      {/* Header */}
      <div className="px-6 pt-8 pb-4 bg-white border-b border-[#E5E7EB]">
        <h1 className="text-2xl font-bold text-[#1F2937] mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Saved
        </h1>
      </div>

      {/* Collections Section */}
      <div className="px-6 py-6 bg-white border-b border-[#E5E7EB]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#1F2937]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Collections
          </h2>
        </div>

        {/* Scrollable Collections Bar */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6">
          {/* Create Collection Button */}
          <button
            onClick={() => setShowCreateCollection(true)}
            className="flex-shrink-0 w-24 h-24 rounded-2xl border-2 border-dashed border-[#00A36C] bg-[#D6F5E9] flex flex-col items-center justify-center gap-2 hover:bg-[#A8EFD4] transition-colors"
          >
            <Plus className="w-6 h-6 text-[#00A36C]" />
            <span className="text-xs font-semibold text-[#00A36C]">Create</span>
          </button>

          {/* Existing Collections */}
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
      <div className="px-6 py-6">
        <div className="grid grid-cols-2 gap-4">
          {mockProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-sm">
              {/* Product Image */}
              <div className="relative aspect-square">
                <img 
                  src={product.image} 
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                {/* Save Bg Badge */}
                <div className="absolute top-2 left-2 bg-[#00A36C] text-white text-xs font-bold px-2 py-1 rounded-md">
                  Save Bg
                </div>
                {/* Heart Icon */}
                <button className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white border-2 border-[#00A36C] flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white fill-white" />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-3">
                <h3 className="font-bold text-[#1F2937] text-sm mb-1 line-clamp-2 leading-tight">
                  {product.title}
                </h3>
                <p className="text-lg font-bold text-[#00A36C] mb-2">
                  {product.price}
                </p>
                <Button 
                  variant="outline"
                  className="w-full h-8 text-xs rounded-xl border-[#00A36C] text-[#00A36C] hover:bg-[#00A36C] hover:text-white"
                >
                  Visit Store
                </Button>
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