import React from "react";
import { Tag } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
      {/* Animated Tag */}
      <div className="relative mb-8">
        <Tag className="w-32 h-32 text-[#00A36C] animate-tag-bounce" />
        {/* Motion lines */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-2 animate-motion-lines">
          <div className="w-8 h-0.5 bg-[#00A36C]/30 rounded-full transform -rotate-45" />
          <div className="w-6 h-0.5 bg-[#00A36C]/30 rounded-full transform -rotate-45" />
        </div>
      </div>

      {/* Text */}
      <h2 className="text-3xl font-bold text-[#1F2937] mb-2">Opening the</h2>
      <h2 className="text-3xl font-bold text-[#1F2937] mb-6">best deal...</h2>
      <p className="text-lg text-[#6B7280]">Hang tight...</p>

      <style>{`
        @keyframes tag-bounce {
          0%, 100% { transform: translateY(0); }
          30% { transform: translateY(-8px); }
          60% { transform: translateY(-6px); }
        }

        @keyframes motion-lines {
          0%, 70%, 100% { opacity: 0; }
          30%, 40% { opacity: 1; }
        }

        .animate-tag-bounce {
          animation: tag-bounce 1.4s ease-in-out infinite;
        }

        .animate-motion-lines {
          animation: motion-lines 1.4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}