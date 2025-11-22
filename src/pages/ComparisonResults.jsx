import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Share2, Heart, Check, X as XIcon, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ComparisonResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const { item1, item2, result, preferences } = location.state || {};
  const [activeSection, setActiveSection] = useState('overview');
  const [isSaved, setIsSaved] = useState(false);

  if (!result || !item1 || !item2) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <p className="text-[#6B7280]">No comparison data available</p>
      </div>
    );
  }

  const winner = result.winner === 1 ? item1 : item2;
  const loser = result.winner === 1 ? item2 : item1;
  const winnerScores = result.winner === 1 ? result.item1_scores : result.item2_scores;
  const loserScores = result.winner === 1 ? result.item2_scores : result.item1_scores;

  const overallWinnerScore = Object.values(winnerScores).reduce((a, b) => a + b, 0) / Object.keys(winnerScores).length;
  const overallLoserScore = Object.values(loserScores).reduce((a, b) => a + b, 0) / Object.keys(loserScores).length;

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      {/* Header */}
      <div className="px-6 pt-8 pb-4 bg-white border-b border-[#E5E7EB]">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-6 h-6 text-[#1F2937]" />
          </button>
          <h1 className="text-xl font-bold text-[#1F2937]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Comparison Results
          </h1>
          <div className="flex items-center gap-3">
            <button>
              <Share2 className="w-5 h-5 text-[#6B7280]" />
            </button>
            <button onClick={() => setIsSaved(!isSaved)}>
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-[#00A36C] text-[#00A36C]' : 'text-[#6B7280]'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Product Summary Cards */}
      <div className="px-6 py-6 bg-white border-b border-[#E5E7EB]">
        <div className="flex items-center gap-4">
          {/* Product A */}
          <div className="flex-1 flex flex-col items-center">
            <img src={item1.file_url} alt={item1.title} className="w-20 h-20 rounded-xl object-cover mb-2" />
            <p className="text-xs font-semibold text-[#1F2937] text-center line-clamp-2 mb-1">{item1.title}</p>
            <p className="text-sm font-bold text-[#00A36C]">{item1.price}</p>
          </div>

          {/* VS */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#00A36C] to-[#007E52] flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">VS</span>
            </div>
          </div>

          {/* Product B */}
          <div className="flex-1 flex flex-col items-center">
            <img src={item2.file_url} alt={item2.title} className="w-20 h-20 rounded-xl object-cover mb-2" />
            <p className="text-xs font-semibold text-[#1F2937] text-center line-clamp-2 mb-1">{item2.title}</p>
            <p className="text-sm font-bold text-[#00A36C]">{item2.price}</p>
          </div>
        </div>
      </div>

      {/* Overall Winner Banner */}
      <div className="px-6 py-6 bg-gradient-to-r from-[#00A36C] to-[#007E52]">
        <div className="text-center">
          <p className="text-white/80 text-sm mb-2">SmartScore Winner</p>
          <div className="flex items-center justify-center gap-6 mb-3">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center mb-1">
                <span className="text-2xl font-bold text-white">{Math.round(overallWinnerScore)}</span>
              </div>
              <p className="text-xs text-white">{winner.title}</p>
            </div>
            <span className="text-2xl text-white/60">vs</span>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full border-4 border-white/40 flex items-center justify-center mb-1">
                <span className="text-2xl font-bold text-white/60">{Math.round(overallLoserScore)}</span>
              </div>
              <p className="text-xs text-white/60">{loser.title}</p>
            </div>
          </div>
          <p className="text-sm text-white/90">
            {preferences ? 'Based on your preferences' : 'Based on general quality'}
          </p>
        </div>
      </div>

      {/* Category Comparisons */}
      <div className="px-6 py-6 space-y-4">
        <h3 className="text-lg font-bold text-[#1F2937]" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Detailed Comparison
        </h3>

        {Object.keys(winnerScores).map((category) => {
          const winScore = winnerScores[category];
          const loseScore = loserScores[category];
          const isWinnerBetter = winScore > loseScore;

          return (
            <div key={category} className="bg-white rounded-2xl p-4 border border-[#E5E7EB]">
              <h4 className="font-semibold text-[#1F2937] mb-3 capitalize">
                {category.replace(/([A-Z])/g, ' $1').trim()}
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-[#E5E7EB] rounded-full h-8 overflow-hidden">
                    <div 
                      className="bg-[#00A36C] h-full flex items-center justify-end pr-2"
                      style={{ width: `${result.winner === 1 ? winScore : loseScore}%` }}
                    >
                      <span className="text-xs font-bold text-white">
                        {Math.round(result.winner === 1 ? winScore : loseScore)}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-[#6B7280] w-16">{item1.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-[#E5E7EB] rounded-full h-8 overflow-hidden">
                    <div 
                      className="bg-[#6B7280] h-full flex items-center justify-end pr-2"
                      style={{ width: `${result.winner === 2 ? winScore : loseScore}%` }}
                    >
                      <span className="text-xs font-bold text-white">
                        {Math.round(result.winner === 2 ? winScore : loseScore)}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-[#6B7280] w-16">{item2.title}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Your Preferences (if set) */}
      {preferences && (
        <div className="px-6 pb-6">
          <div className="bg-[#D6F5E9] rounded-2xl p-4">
            <h4 className="font-semibold text-[#00A36C] mb-2">Your Priorities</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(preferences).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-[#00A36C] capitalize">{key}</span>
                  <span className="font-bold text-[#00A36C]">{value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI Recommendation */}
      <div className="px-6 pb-6">
        <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] text-center">
          <img src={winner.file_url} alt={winner.title} className="w-24 h-24 rounded-xl object-cover mx-auto mb-4" />
          <div className="inline-block bg-[#00A36C] text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
            Recommended for You
          </div>
          <h3 className="font-bold text-[#1F2937] text-lg mb-2">{winner.title}</h3>
          <p className="text-sm text-[#6B7280] mb-4">{result.explanation}</p>
          <Button className="w-full bg-[#00A36C] hover:bg-[#007E52] rounded-2xl mb-2">
            Find Online
          </Button>
          <button className="text-sm text-[#00A36C] font-semibold">
            Why This Recommendation?
          </button>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-24 left-0 right-0 px-6">
        <Button
          onClick={() => navigate(createPageUrl("Compare"))}
          className="w-full h-14 rounded-2xl bg-[#00A36C] hover:bg-[#007E52] font-semibold"
        >
          Compare Again
        </Button>
      </div>
    </div>
  );
}