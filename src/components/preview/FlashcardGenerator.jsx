import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, ChevronLeft, ChevronRight, Sparkles, Check } from "lucide-react";

export default function FlashcardGenerator({ capture, onClose }) {
  const [generating, setGenerating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const { data: flashcards, refetch } = useQuery({
    queryKey: ['flashcards', capture.id],
    queryFn: async () => {
      const allCards = await base44.entities.Flashcard.list();
      return allCards.filter(f => f.capture_id === capture.id);
    },
    initialData: []
  });

  const generateMutation = useMutation({
    mutationFn: async () => {
      setGenerating(true);
      
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Based on this content, generate 5-7 study flashcards.
        
        Title: ${capture.title}
        Summary: ${capture.ai_summary || ''}
        Extracted Text: ${capture.extracted_text || ''}
        
        Create clear, concise question and answer pairs that would help a student study this material.
        Make questions specific and answers comprehensive but brief.`,
        response_json_schema: {
          type: "object",
          properties: {
            flashcards: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  question: { type: "string" },
                  answer: { type: "string" },
                  difficulty: { type: "string", enum: ["easy", "medium", "hard"] }
                }
              }
            }
          }
        }
      });

      // Save flashcards to database
      for (const card of result.flashcards) {
        await base44.entities.Flashcard.create({
          capture_id: capture.id,
          question: card.question,
          answer: card.answer,
          difficulty: card.difficulty,
          mastery_level: 0,
          times_reviewed: 0
        });
      }

      setGenerating(false);
      refetch();
    }
  });

  const handleNext = () => {
    setFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrev = () => {
    setFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const currentCard = flashcards[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[var(--smart-gray)]">Flashcards</h1>
            <p className="text-sm text-[var(--secondary-gray)]">{capture.title}</p>
          </div>
        </div>
      </div>

      <div className="px-6 pb-8">
        {flashcards.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-[var(--border-gray)] text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-lg font-bold text-[var(--smart-gray)] mb-2">Generate Study Flashcards</h3>
            <p className="text-[var(--secondary-gray)] mb-6">
              Our AI will analyze your capture and create interactive flashcards to help you study.
            </p>
            <Button
              onClick={() => generateMutation.mutate()}
              disabled={generating}
              className="bg-gradient-to-br from-purple-500 to-pink-500 hover:shadow-xl rounded-2xl h-14 px-8 font-semibold"
            >
              {generating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating Flashcards...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Flashcards
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Progress */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[var(--smart-gray)]">
                Card {currentIndex + 1} of {flashcards.length}
              </span>
              <div className="flex items-center gap-1">
                {flashcards.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === currentIndex 
                        ? 'w-8 bg-[var(--electric-blue)]' 
                        : 'w-1.5 bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Flashcard */}
            <div 
              className="relative h-96 cursor-pointer perspective-1000"
              onClick={() => setFlipped(!flipped)}
            >
              <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${flipped ? 'rotate-y-180' : ''}`}>
                {/* Front */}
                <div className="absolute inset-0 bg-white rounded-3xl p-8 border-2 border-[var(--electric-blue)] backface-hidden flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-semibold text-[var(--electric-blue)] mb-4 px-4 py-1 bg-[var(--light-blue)] rounded-full">
                    QUESTION
                  </span>
                  <p className="text-xl font-bold text-[var(--smart-gray)] leading-relaxed">
                    {currentCard.question}
                  </p>
                  <p className="text-sm text-[var(--secondary-gray)] mt-6">Tap to reveal answer</p>
                </div>

                {/* Back */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-8 border-2 border-purple-600 backface-hidden rotate-y-180 flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-semibold text-white mb-4 px-4 py-1 bg-white/20 rounded-full">
                    ANSWER
                  </span>
                  <p className="text-lg font-semibold text-white leading-relaxed">
                    {currentCard.answer}
                  </p>
                  <p className="text-sm text-white/80 mt-6">Tap to see question</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={flashcards.length <= 1}
                className="flex-1 h-14 rounded-2xl border-2 font-semibold"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={flashcards.length <= 1}
                className="flex-1 h-14 rounded-2xl bg-[var(--electric-blue)] hover:bg-blue-600 font-semibold"
              >
                Next
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}