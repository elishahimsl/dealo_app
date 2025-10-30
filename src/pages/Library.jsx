import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Grid3x3, List, ArrowLeft, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
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

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "homework", label: "Homework" },
    { value: "notes", label: "Notes" },
    { value: "idea", label: "Ideas" },
    { value: "project", label: "Projects" },
    { value: "product", label: "Products" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 sticky top-0 bg-white z-10 border-b border-[var(--border-gray)]">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(createPageUrl("Home"))}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[var(--smart-gray)]">🕓 Scan History</h1>
            <p className="text-sm text-[var(--secondary-gray)]">{captures.length} saved scans</p>
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
            placeholder="Search your scans"
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
                  ? 'bg-gradient-to-r from-[var(--neon-green)] to-[var(--neon-cyan)] text-white'
                  : 'bg-[var(--secondary-blue)] text-[var(--primary-blue)] hover:bg-blue-100'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 pb-8 pt-6">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-48 shimmer border border-[var(--border-gray)]" />
            ))}
          </div>
        ) : filteredCaptures.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-[var(--border-gray)] text-center">
            <p className="text-[var(--secondary-gray)] text-lg font-semibold mb-2">No scans yet</p>
            <p className="text-[var(--secondary-gray)] text-sm mb-6">
              Start by snapping your first object or document
            </p>
            <Button 
              onClick={() => navigate(createPageUrl("Home"))}
              className="bg-gradient-to-r from-[var(--neon-green)] to-[var(--neon-cyan)] hover:opacity-90 rounded-full px-6 font-semibold"
            >
              Start Scanning
            </Button>
          </div>
        ) : (
          <CaptureGrid captures={filteredCaptures} viewMode={viewMode} />
        )}
      </div>
    </div>
  );
}