import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, Trash2, Sparkles, FileText, Lightbulb, Package, RotateCcw, Home, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import FlashcardGenerator from "../components/preview/FlashcardGenerator";

export default function Preview() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  const captureId = urlParams.get('id');
  const isNewScan = urlParams.get('new') === 'true';
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const { data: capture, isLoading } = useQuery({
    queryKey: ['capture', captureId],
    queryFn: async () => {
      const captures = await base44.entities.Capture.list();
      return captures.find(c => c.id === captureId);
    },
    enabled: !!captureId
  });

  useEffect(() => {
    if (isNewScan && capture) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [isNewScan, capture]);

  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      return await base44.entities.Capture.update(captureId, {
        is_favorite: !capture.is_favorite
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['capture', captureId]);
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
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--neon-green)] border-t-transparent" />
      </div>
    );
  }

  if (!capture) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-[var(--secondary-gray)]">Scan not found</p>
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
    <div className="min-h-screen bg-white">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                backgroundColor: ['#00FF88', '#00D9FF', '#FF6B6B', '#FFD93D'][Math.floor(Math.random() * 4)],
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        .animate-confetti {
          animation: confetti 3s ease-out forwards;
        }
      `}</style>

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
                if (confirm("Delete this scan?")) {
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
        </div>
      </div>

      <div className="px-6 py-6 space-y-6 pb-32">
        {/* Top Half: Image Preview */}
        <div className="bg-white rounded-2xl overflow-hidden border border-[var(--border-gray)] card-shadow">
          <img src={capture.file_url} alt={capture.title} className="w-full max-h-96 object-contain" />
        </div>

        {/* Detected Object Name - Big and Bold */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[var(--smart-gray)] mb-2">
            {capture.title}
          </h2>
          {capture.keywords && capture.keywords.length > 0 && (
            <div className="flex justify-center gap-2 flex-wrap">
              {capture.keywords.slice(0, 3).map((keyword, idx) => (
                <span 
                  key={idx}
                  className="text-sm text-[var(--secondary-gray)] bg-[var(--secondary-blue)] px-3 py-1 rounded-full"
                >
                  {keyword}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 🔍 Details Section */}
        {capture.extracted_text && (
          <div className="bg-white rounded-2xl p-5 border border-[var(--border-gray)] card-shadow">
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-5 h-5 text-[var(--neon-green)]" />
              <h3 className="font-bold text-[var(--smart-gray)]">🔍 Details</h3>
            </div>
            <p className="text-[var(--secondary-gray)] text-sm leading-relaxed whitespace-pre-wrap">
              {capture.extracted_text}
            </p>
          </div>
        )}

        {/* 💡 Smart Tips Section */}
        {capture.ai_summary && (
          <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-2xl p-5 border border-emerald-200 card-shadow">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-[var(--neon-green)]" />
              <h3 className="font-bold text-[var(--smart-gray)]">💡 Smart Tips</h3>
            </div>
            <p className="text-[var(--secondary-gray)] text-sm leading-relaxed">
              {capture.ai_summary}
            </p>
          </div>
        )}

        {/* Save to My Scans - Confirmation */}
        {isNewScan && (
          <div className="bg-gradient-to-r from-[var(--neon-green)] to-[var(--neon-cyan)] rounded-2xl p-5 text-center">
            <div className="text-white text-lg font-bold mb-2">✅ Scan Saved!</div>
            <p className="text-white/90 text-sm">
              This scan has been added to your history
            </p>
          </div>
        )}
      </div>

      {/* Bottom Bar - Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--border-gray)] p-6 z-20">
        <div className="max-w-lg mx-auto grid grid-cols-2 gap-3">
          <Button
            onClick={() => navigate(createPageUrl("Home"))}
            variant="outline"
            className="h-12 rounded-full border-2 font-semibold"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Rescan
          </Button>
          <Button
            onClick={() => navigate(createPageUrl("Home"))}
            className="h-12 rounded-full bg-gradient-to-r from-[var(--neon-green)] to-[var(--neon-cyan)] hover:opacity-90 font-semibold"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </div>
      </div>
    </div>
  );
}