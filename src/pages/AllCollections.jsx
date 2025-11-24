import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AllCollections() {
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
    { id: 1, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400" },
    { id: 2, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400" },
    { id: 3, image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400" }
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
      <div className="px-6 pt-8 pb-4">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6 text-[#1F2937]" />
          </button>
          <h1 className="text-base font-bold text-[#1F2937]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Collections
          </h1>
          <button onClick={() => setShowCreateCollection(true)}>
            <Plus className="w-5 h-5 text-[#1F2937]" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
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
                className="relative rounded-2xl overflow-hidden bg-[#E5E7EB] aspect-square cursor-pointer"
              >
                <div className="absolute inset-0 p-3 flex gap-2 justify-center items-center">
                  {folderProducts.map((product, idx) => (
                    <div
                      key={product.id}
                      className="w-[28%] aspect-square rounded-lg overflow-hidden shadow-md"
                      style={{
                        transform: `rotate(${(idx - 1) * 6}deg)`,
                        zIndex: 3 - Math.abs(idx - 1)
                      }}
                    >
                      <img 
                        src={product.image} 
                        alt="Product"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-[#1F2937] text-xs font-semibold truncate text-center">{folder.name}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {longPressFolder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="relative px-6">
            <div className="w-48 aspect-square rounded-2xl overflow-hidden bg-[#E5E7EB] mb-3 mx-auto">
              <div className="absolute inset-0 p-3 flex gap-2 justify-center items-center">
                {getFolderProducts().map((product, idx) => (
                  <div
                    key={product.id}
                    className="w-[28%] aspect-square rounded-lg overflow-hidden shadow-md"
                    style={{
                      transform: `rotate(${(idx - 1) * 6}deg)`,
                      zIndex: 3 - Math.abs(idx - 1)
                    }}
                  >
                    <img 
                      src={product.image} 
                      alt="Product"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <button
              onClick={handleDeleteFolder}
              className="w-32 mx-auto bg-red-500 text-white py-2 rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors flex items-center justify-center"
            >
              Delete
            </button>
          </div>
        </div>
      )}

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
    </div>
  );
}