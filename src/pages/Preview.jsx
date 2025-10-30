import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, Trash2, Sparkles, FileText, ChevronDown, ChevronUp, FileDown, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import FlashcardGenerator from "../components/preview/FlashcardGenerator";

export default function Preview() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const captureId = urlParams.get('id');
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [summaryExpanded, setSummaryExpanded] = useState(true);

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
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--primary-blue)] border-t-transparent" />
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
    <div className="min-h-screen bg-white pb-32">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 bg-white sticky top-0 z-10 border-b border-[var(--border-gray)]">
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(createPageUrl("Library"))}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleFavoriteMutation.mutate()}
              className="rounded-full"
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
              className="rounded-full text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <h1 className="text-xl font-bold text-[var(--smart-gray)] mb-2">{capture.title}</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className="bg-[var(--secondary-blue)] text-[var(--primary-blue)] border-blue-200 rounded-full">
            {capture.content_type}
          </Badge>
          <span className="text-xs text-[var(--secondary-gray)]">
            {format(new Date(capture.created_date), "MMM d, yyyy")}
          </span>
          {capture.has_due_date && capture.due_date && (
            <Badge variant="outline" className="border-red-200 bg-red-50 text-red-600 rounded-full">
              Due {format(new Date(capture.due_date), "MMM d")}
            </Badge>
          )}
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Preview Pane - Image/PDF viewer */}
        <div className="bg-white rounded-2xl overflow-hidden border border-[var(--border-gray)] card-shadow">
          <img src={capture.file_url} alt={capture.title} className="w-full max-h-96 object-contain" />
        </div>

        {/* AI Summary Section - Expandable */}
        {capture.ai_summary && (
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-200 overflow-hidden card-shadow">
            <button
              onClick={() => setSummaryExpanded(!summaryExpanded)}
              className="w-full flex items-center justify-between p-5"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl shadow-sm">
                  <Sparkles className="w-5 h-5 text-[var(--primary-blue)]" />
                </div>
                <h3 className="font-bold text-[var(--smart-gray)]">AI Summary</h3>
              </div>
              {summaryExpanded ? (
                <ChevronUp className="w-5 h-5 text-[var(--secondary-gray)]" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[var(--secondary-gray)]" />
              )}
            </button>
            
            {summaryExpanded && (
              <div className="px-5 pb-5 space-y-3">
                <p className="text-[var(--secondary-gray)] leading-relaxed">
                  {capture.ai_summary}
                </p>
                
                {/* Key Points */}
                {capture.keywords && capture.keywords.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-[var(--smart-gray)] text-sm mb-2">Key Points:</h4>
                    <ul className="space-y-1">
                      {capture.keywords.slice(0, 3).map((keyword, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-[var(--secondary-gray)]">
                          <span className="text-[var(--primary-blue)] mt-1">✓</span>
                          <span>{keyword}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Keywords chips */}
                {capture.keywords && capture.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {capture.keywords.map((keyword, idx) => (
                      <span 
                        key={idx}
                        className="bg-white text-[var(--primary-blue)] px-3 py-1 rounded-full text-xs font-semibold border border-blue-200"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Extracted Text */}
        {capture.extracted_text && (
          <div className="bg-white rounded-2xl p-5 border border-[var(--border-gray)] card-shadow">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-[var(--primary-blue)]" />
              <h3 className="font-bold text-[var(--smart-gray)]">Extracted Text</h3>
            </div>
            <p className="text-[var(--secondary-gray)] text-sm leading-relaxed whitespace-pre-wrap">
              {capture.extracted_text}
            </p>
          </div>
        )}
      </div>

      {/* Sticky Footer - Action Buttons */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-[var(--border-gray)] p-6 z-20">
        <div className="max-w-lg mx-auto space-y-3">
          <Button 
            onClick={() => setShowFlashcards(true)}
            className="w-4/5 mx-auto block h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-xl font-semibold text-base"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Generate Flashcards
          </Button>
          <div className="flex gap-3">
            <Button 
              variant="outline"
              className="flex-1 h-12 rounded-full border-2 font-semibold"
              onClick={() => navigate(createPageUrl("AIAssistant"))}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Ask AI
            </Button>
            <Button 
              variant="outline"
              className="flex-1 h-12 rounded-full border-2 font-semibold"
              onClick={() => window.open(capture.file_url, '_blank')}
            >
              <FileDown className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}