import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Grid3x3, List, FolderPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import FolderCard from "../components/library/FolderCard";
import CaptureGrid from "../components/library/CaptureGrid";

export default function Library() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const { data: captures, isLoading } = useQuery({
    queryKey: ['allCaptures'],
    queryFn: () => base44.entities.Capture.list('-created_date'),
    initialData: [],
  });

  const filteredCaptures = captures.filter(capture => {
    const matchesSearch = capture.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         capture.ai_summary?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "all" || capture.content_type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const smartFolderStats = {
    homework: captures.filter(c => c.content_type === 'homework').length,
    notes: captures.filter(c => c.content_type === 'notes').length,
    ideas: captures.filter(c => c.content_type === 'idea').length,
    projects: captures.filter(c => c.content_type === 'project').length,
  };

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "homework", label: "Homework" },
    { value: "notes", label: "Notes" },
    { value: "idea", label: "Ideas" },
    { value: "project", label: "Projects" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 sticky top-0 bg-white z-10 border-b border-[var(--border-gray)]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[var(--smart-gray)]">Smart Library</h1>
            <p className="text-sm text-[var(--secondary-gray)]">{captures.length} items organized</p>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="rounded-full"
          >
            {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid3x3 className="w-5 h-5" />}
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--secondary-gray)]" />
          <Input
            placeholder="Search your files"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 rounded-full border-[var(--border-gray)] text-base"
          />
        </div>

        {/* Filter Chips Row */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {filterOptions.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap smooth-transition ${
                activeFilter === filter.value
                  ? 'bg-[var(--primary-blue)] text-white'
                  : 'bg-[var(--secondary-blue)] text-[var(--primary-blue)] hover:bg-blue-100'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 pb-8 pt-6">
        {/* Smart Folders - 2 column grid, 140x140px cards */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-[var(--smart-gray)]">Smart Folders</h2>
            <span className="text-xs text-[var(--secondary-gray)] font-medium">Auto-organized</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FolderCard 
              name="Homework" 
              count={smartFolderStats.homework} 
              color="bg-red-500" 
              icon="CheckSquare"
            />
            <FolderCard 
              name="Notes" 
              count={smartFolderStats.notes} 
              color="bg-blue-500" 
              icon="BookOpen"
            />
            <FolderCard 
              name="Ideas" 
              count={smartFolderStats.ideas} 
              color="bg-yellow-500" 
              icon="Lightbulb"
            />
            <FolderCard 
              name="Projects" 
              count={smartFolderStats.projects} 
              color="bg-emerald-500" 
              icon="Sparkles"
            />
          </div>
        </div>

        {/* Recent Uploads List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-[var(--smart-gray)]">Recent Uploads</h2>
            <span className="text-xs text-[var(--secondary-gray)] font-medium">
              {filteredCaptures.length} items
            </span>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-2xl h-48 shimmer border border-[var(--border-gray)]" />
              ))}
            </div>
          ) : filteredCaptures.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 border border-[var(--border-gray)] text-center">
              <p className="text-[var(--secondary-gray)]">No captures found</p>
            </div>
          ) : (
            <CaptureGrid captures={filteredCaptures} viewMode={viewMode} />
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-24 right-6 w-14 h-14 bg-[var(--primary-blue)] rounded-full flex items-center justify-center card-shadow hover:scale-110 smooth-transition active:scale-95 z-40">
        <FolderPlus className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}