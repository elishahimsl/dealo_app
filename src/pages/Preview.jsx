import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, Trash2, Sparkles, FileText, Calendar, Download, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import FlashcardGenerator from "../components/preview/FlashcardGenerator";

export default function Preview() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const captureId = urlParams.get('id');
  const [showFlashcards, setShowFlashcards] = useState(false);

  const { data: capture, isLoading } = useQuery({
    queryKey: ['capture', captureId],
    queryFn: async () => {
      const captures = await base44.entities.Capture.list();
      return captures.find(c => c.id === captureId);
    },
    enabled: !!captureId
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.Capture.update(captureId, {
        is_favorite: !capture.is_favorite
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['capture', captureId]);
      queryClient.invalidateQueries(['recentCaptures']);
      queryClient.invalidateQueries(['allCaptures']);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.Capture.delete(captureId);
    },
    onSuccess: () => {
      navigate(createPageUrl("Library"));
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--electric-blue)] border-t-transparent" />
      </div>
    );
  }

  if (!capture) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-[var(--secondary-gray)]">Capture not found</p>
      </div>
    );
  }

  if (showFlashcards) {
    return (
      <FlashcardGenerator 
        capture={capture} 
        onClose={() => setShowFlashcards(false)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 bg-white sticky top-0 z-10 border-b border-[var(--border-gray)]">
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(createPageUrl("Library"))}
            className="rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleFavoriteMutation.mutate()}
              className="rounded-xl"
            >
              <Star 
                className={`w-5 h-5 ${capture.is_favorite ? 'text-yellow-400 fill-yellow-400' : 'text-[var(--secondary-gray)]'}`} 
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (confirm("Delete this capture?")) {
                  deleteMutation.mutate();
                }
              }}
              className="rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-[var(--smart-gray)] mb-2">{capture.title}</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className="bg-[var(--light-blue)] text-[var(--electric-blue)] border-blue-200">
            {capture.content_type}
          </Badge>
          <span className="text-sm text-[var(--secondary-gray)] flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {format(new Date(capture.created_date), "MMM d, yyyy")}
          </span>
          {capture.has_due_date && capture.due_date && (
            <Badge variant="outline" className="border-red-200 bg-red-50 text-red-600">
              Due {format(new Date(capture.due_date), "MMM d")}
            </Badge>
          )}
        </div>
      </div>

      <div className="px-6 py-8 space-y-6">
        {/* Image Preview */}
        <div className="bg-white rounded-3xl overflow-hidden border border-[var(--border-gray)]">
          <img src={capture.file_url} alt={capture.title} className="w-full max-h-96 object-contain" />
        </div>

        {/* AI Summary */}
        {capture.ai_summary && (
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-6 border border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-white rounded-xl shadow-sm">
                <Sparkles className="w-5 h-5 text-[var(--electric-blue)]" />
              </div>
              <h3 className="font-bold text-[var(--smart-gray)]">AI Summary</h3>
            </div>
            <p className="text-[var(--secondary-gray)] leading-relaxed">{capture.ai_summary}</p>
          </div>
        )}

        {/* Keywords */}
        {capture.keywords && capture.keywords.length > 0 && (
          <div className="bg-white rounded-3xl p-6 border border-[var(--border-gray)]">
            <h3 className="font-bold text-[var(--smart-gray)] mb-3">Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {capture.keywords.map((keyword, idx) => (
                <span 
                  key={idx}
                  className="bg-[var(--light-blue)] text-[var(--electric-blue)] px-4 py-2 rounded-xl text-sm font-semibold"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Extracted Text */}
        {capture.extracted_text && (
          <div className="bg-white rounded-3xl p-6 border border-[var(--border-gray)]">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-[var(--electric-blue)]" />
              <h3 className="font-bold text-[var(--smart-gray)]">Extracted Text</h3>
            </div>
            <p className="text-[var(--secondary-gray)] leading-relaxed whitespace-pre-wrap">
              {capture.extracted_text}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            onClick={() => setShowFlashcards(true)}
            className="h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 hover:shadow-xl font-semibold"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Generate Flashcards
          </Button>
          <Button 
            variant="outline"
            className="h-14 rounded-2xl border-2 font-semibold"
            onClick={() => window.open(capture.file_url, '_blank')}
          >
            <Download className="w-5 h-5 mr-2" />
            Download
          </Button>
        </div>
      </div>
    </div>
  );
}