import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Search, Star, Grid3x3, ArrowUpDown } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Library() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  const { data: captures, isLoading } = useQuery({
    queryKey: ['allCaptures'],
    queryFn: () => base44.entities.Capture.list('-created_date'),
    initialData: [],
  });

  const filteredCaptures = captures
    .filter(capture => {
      const matchesTab = activeTab === "all" || 
                        (activeTab === "favorites" && capture.is_favorite);
      const matchesSearch = capture.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "recent") return new Date(b.created_date) - new Date(a.created_date);
      if (sortBy === "name") return a.title.localeCompare(b.title);
      return 0;
    });

  const tabs = [
    { id: "all", label: "All" },
    { id: "favorites", label: "Favorites" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 bg-white/80 backdrop-blur-lg sticky top-0 z-10 border-b border-[var(--border-gray)]">
        <h1 className="text-2xl font-bold text-[var(--smart-gray)] mb-6">📚 Your Collection</h1>
        
        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 rounded-full text-sm font-semibold smooth-transition ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[var(--electric-blue)] to-[var(--teal-accent)] text-white'
                  : 'bg-white text-[var(--secondary-gray)] border border-[var(--border-gray)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Sort */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--secondary-gray)]" />
            <Input
              placeholder="Search your scans"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 rounded-2xl border-[var(--border-gray)]"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32 h-11 rounded-2xl">
              <ArrowUpDown className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recent</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid of Cards */}
      <div className="px-6 py-6">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square rounded-3xl shimmer" />
            ))}
          </div>
        ) : filteredCaptures.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[var(--border-gray)] soft-shadow">
            <Grid3x3 className="w-16 h-16 text-[var(--secondary-gray)] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[var(--smart-gray)] mb-2">
              {activeTab === "favorites" ? "No favorites yet" : "No scans yet"}
            </h3>
            <p className="text-[var(--secondary-gray)] text-sm">
              {activeTab === "favorites" 
                ? "Star your favorite items to see them here" 
                : "Start by scanning your first item"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredCaptures.map((capture) => (
              <Link key={capture.id} to={`${createPageUrl("Preview")}?id=${capture.id}`}>
                <div className="bg-white rounded-3xl overflow-hidden border border-[var(--border-gray)] soft-shadow smooth-transition hover:scale-105">
                  <div className="relative aspect-square bg-gray-100">
                    <img 
                      src={capture.file_url} 
                      alt={capture.title}
                      className="w-full h-full object-cover"
                    />
                    {capture.is_favorite && (
                      <div className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-lg">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-[var(--smart-gray)] text-sm line-clamp-1 mb-1">
                      {capture.title}
                    </h3>
                    <p className="text-xs text-[var(--secondary-gray)]">
                      {format(new Date(capture.created_date), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}