import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { ShoppingCart, Trash2, Search, MapPin, Star, FolderPlus, Folder, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function MyCart() {
  const [activeTab, setActiveTab] = useState("favorites");
  const [sortBy, setSortBy] = useState("recent");
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [folders, setFolders] = useState([]);

  const { data: captures } = useQuery({
    queryKey: ['allCaptures'],
    queryFn: () => base44.entities.Capture.list('-created_date'),
    initialData: [],
  });

  // Mock cart items
  const cartItems = [
    { 
      id: 1, 
      title: "7-Pod Pro", 
      price: 299, 
      quantity: 1, 
      rating: 4.5,
      store: "Target",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200" 
    },
    { 
      id: 2, 
      title: "Faith over Fear T-Shirt", 
      price: 12, 
      quantity: 1, 
      rating: 3,
      store: "Amazon",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200" 
    },
  ];

  const snapHistory = captures.slice(0, 10);

  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      setFolders([...folders, { id: Date.now(), name: newFolderName, itemCount: 0 }]);
      setNewFolderName("");
      setShowFolderModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header with Tabs */}
      <div className="px-6 pt-8 pb-4 bg-white border-b border-[#E4E8ED]">
        <div className="flex justify-center gap-12 mb-4">
          <button
            onClick={() => setActiveTab("favorites")}
            className={`text-lg font-bold pb-2 transition-colors ${
              activeTab === "favorites" 
                ? "text-[#2E2E38] border-b-2 border-[#5EE177]" 
                : "text-[#60656F]"
            }`}
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Favorites
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`text-lg font-bold pb-2 transition-colors ${
              activeTab === "history" 
                ? "text-[#2E2E38] border-b-2 border-[#5EE177]" 
                : "text-[#60656F]"
            }`}
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Snap History
          </button>
        </div>

        {/* Search Bar - Extended with only folder button */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#60656F]" />
            <Input
              placeholder="Search favorites"
              className="pl-12 h-14 rounded-2xl border-[#E4E8ED] bg-[#F9FAFB] text-[#2E2E38] text-base"
              style={{ fontFamily: 'Inter, sans-serif' }}
            />
          </div>
          
          {/* Add Folder Icon - Working */}
          <button 
            onClick={() => setShowFolderModal(true)}
            className="w-10 h-10 rounded-2xl bg-[#F9FAFB] border border-[#E4E8ED] flex items-center justify-center hover:bg-[#E4E8ED] transition-colors"
          >
            <FolderPlus className="w-4 h-4 text-[#60656F]" />
          </button>
        </div>
      </div>

      {/* Sort By */}
      {activeTab === "favorites" && (
        <div className="px-6 py-4 flex items-center justify-between">
          <p className="text-sm text-[#60656F]">{cartItems.length} items</p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#60656F]">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-28 h-9 rounded-xl border-[#E4E8ED]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recent</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="location">Location</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="px-6 pb-32">
        {activeTab === "favorites" ? (
          <div className="space-y-4">
            {/* Folders */}
            {folders.map((folder) => (
              <div key={folder.id} className="bg-white rounded-3xl p-4 border border-[#E4E8ED] shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#5EE177] flex items-center justify-center">
                    <Folder className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-[#2E2E38]">{folder.name}</h3>
                    <p className="text-xs text-[#60656F]">{folder.itemCount} items</p>
                  </div>
                  <button className="text-[#60656F] hover:text-[#2E2E38]">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
                {/* Placeholder boxes for items */}
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="aspect-square rounded-xl border-2 border-dashed border-[#E4E8ED] bg-[#F9FAFB]" />
                  ))}
                </div>
              </div>
            ))}

            {/* Regular items with 3 dots */}
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-3xl p-4 border border-[#E4E8ED] shadow-sm">
                <div className="flex gap-4 mb-3">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#A8F3C1] to-[#FFD3E8] overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#2E2E38] text-base mb-1">{item.title}</h3>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 ${i < item.rating ? 'text-[#FF8AC6] fill-[#FF8AC6]' : 'text-gray-300'}`} 
                        />
                      ))}
                      <span className="text-xs text-[#60656F] ml-1">{item.rating}</span>
                    </div>
                    <p className="text-xl font-bold text-[#5EE177] mb-2">${item.price}</p>
                  </div>
                  <button className="text-[#60656F] hover:text-[#2E2E38] self-start">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full rounded-2xl border-2 border-[#5EE177] text-[#5EE177] hover:bg-[#5EE177] hover:text-white font-semibold"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Visit {item.store} Store
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div>
            {snapHistory.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#E4E8ED] shadow-sm">
                <ShoppingCart className="w-16 h-16 text-[#60656F] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#2E2E38] mb-2">No Snap History Yet</h3>
                <p className="text-[#60656F] text-sm">
                  Start scanning products to build your history
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {snapHistory.map((item) => (
                  <div key={item.id} className="bg-white rounded-3xl p-4 border border-[#E4E8ED] shadow-sm flex items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-[#A8F3C1] to-[#FFD3E8]">
                      <img src={item.file_url} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#2E2E38] mb-1 line-clamp-1">{item.title}</h3>
                      <p className="text-xs text-[#60656F]">
                        {new Date(item.created_date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <button className="text-[#60656F] hover:text-red-500">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Folder Modal */}
      {showFolderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-[#2E2E38] mb-4">Create New Folder</h3>
            <Input
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="mb-4 h-12 rounded-2xl"
            />
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowFolderModal(false)}
                className="flex-1 rounded-2xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddFolder}
                className="flex-1 rounded-2xl bg-[#5EE177] hover:bg-[#4dd068]"
              >
                Create
              </Button>
            </div>
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