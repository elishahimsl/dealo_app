import React from "react";
import { useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  
  // Hide navigation on home screen (camera view)
  const isHome = location.pathname === createPageUrl("Home");

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <style>{`
        :root {
          --primary-blue: #007BFF;
          --neon-green: #00FF88;
          --neon-cyan: #00D9FF;
          --secondary-blue: #E6F4FE;
          --smart-gray: #1C1C1E;
          --secondary-gray: #6B7280;
          --light-blue: #E6F4FE;
          --border-gray: #E5E7EB;
        }
        
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        
        @keyframes ping {
          0% { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        
        .animate-ping {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .shimmer {
          animation: shimmer 2s infinite linear;
          background: linear-gradient(to right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%);
          background-size: 1000px 100%;
        }
        
        .glass-effect {
          backdrop-filter: blur(20px) saturate(180%);
          background-color: rgba(255, 255, 255, 0.75);
          border: 1px solid rgba(209, 213, 219, 0.3);
        }

        .smooth-transition {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .card-shadow {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        
        .backface-hidden {
          backface-visibility: hidden;
        }
        
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Main Content */}
      <main className={`flex-1 ${isHome ? '' : 'pb-0'} overflow-auto`}>
        {children}
      </main>
    </div>
  );
}