import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Grid3x3, List, FolderPlus, ArrowLeft } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

  const { data: folders } = useQuery({
    queryKey: ['folders'],
    queryFn: () => base44.entities.Folder.list(),
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
    reminders: captures.filter(c => c.content_type === 'reminder').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 sticky top-0 bg-white/80 backdrop-blur-xl z-10 border-b border-[var(--border-gray)]">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(createPageUrl("Home"))}
            className="rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[var(--smart-gray)]">Smart Library</h1>
            <p className="text-sm text-[var(--secondary-gray)]">{captures.length} items organized</p>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="rounded-xl"
          >
            {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid3x3 className="w-5 h-5" />}
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--secondary-gray)]" />
          <Input
            placeholder="Search your captures..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 rounded-2xl border-[var(--border-gray)] text-base"
          />
        </div>

        {/* Filter Tabs */}
        <Tabs value={activeFilter} onValueChange={setActiveFilter}>
          <TabsList className="w-full bg-[var(--light-blue)] rounded-2xl p-1 grid grid-cols-4">
            <TabsTrigger value="all" className="rounded-xl text-xs font-semibold">All</TabsTrigger>
            <TabsTrigger value="notes" className="rounded-xl text-xs font-semibold">Notes</TabsTrigger>
            <TabsTrigger value="homework" className="rounded-xl text-xs font-semibold">Homework</TabsTrigger>
            <TabsTrigger value="idea" className="rounded-xl text-xs font-semibold">Ideas</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="px-6 pb-8">
        {/* Smart Folders */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[var(--smart-gray)]">Smart Folders</h2>
            <span className="text-xs text-[var(--secondary-gray)] font-medium">Auto-organized</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
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
              icon="Star"
            />
          </div>
        </div>

        {/* All Captures */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[var(--smart-gray)]">All Captures</h2>
            <span className="text-xs text-[var(--secondary-gray)] font-medium">
              {filteredCaptures.length} items
            </span>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-3xl h-48 shimmer border border-[var(--border-gray)]" />
              ))}
            </div>
          ) : filteredCaptures.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-[var(--border-gray)] text-center">
              <p className="text-[var(--secondary-gray)]">No captures found</p>
            </div>
          ) : (
            <CaptureGrid captures={filteredCaptures} viewMode={viewMode} />
          )}
        </div>
      </div>
    </div>
  );
}