import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, Camera, FolderOpen, User } from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  const navItems = [
    { name: "Home", icon: Home, path: createPageUrl("Home") },
    { name: "Snap", icon: Camera, path: createPageUrl("Snap") },
    { name: "Library", icon: FolderOpen, path: createPageUrl("Library") },
    { name: "Profile", icon: User, path: createPageUrl("Profile") },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      <style>{`
        :root {
          --electric-blue: #3B82F6;
          --teal-accent: #14B8A6;
          --purple-accent: #A855F7;
          --smart-gray: #1F2937;
          --secondary-gray: #6B7280;
          --light-gray: #F3F4F6;
          --border-gray: #E5E7EB;
        }
        
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        
        @keyframes bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .shimmer {
          animation: shimmer 2s infinite linear;
          background: linear-gradient(to right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%);
          background-size: 1000px 100%;
        }
        
        .glass-effect {
          backdrop-filter: blur(20px) saturate(180%);
          background-color: rgba(255, 255, 255, 0.75);
          border: 1px solid rgba(229, 231, 235, 0.3);
        }

        .smooth-transition {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .card-shadow {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        
        .soft-shadow {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }
        
        .slide-up {
          animation: slideUp 0.4s ease-out;
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
      <main className="flex-1 pb-20 overflow-auto">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 glass-effect border-t border-[var(--border-gray)] z-50">
        <div className="max-w-lg mx-auto px-6">
          <div className="flex items-center justify-around h-20">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex flex-col items-center justify-center flex-1 smooth-transition group"
                >
                  <div className={`p-3 rounded-2xl smooth-transition ${
                    active 
                      ? 'bg-gradient-to-r from-[var(--electric-blue)] to-[var(--teal-accent)] shadow-lg' 
                      : 'group-hover:bg-[var(--light-gray)]'
                  }`}>
                    <Icon 
                      className={`w-6 h-6 smooth-transition ${
                        active ? 'text-white' : 'text-[var(--secondary-gray)] group-hover:text-[var(--electric-blue)]'
                      }`}
                      strokeWidth={active ? 2.5 : 2}
                    />
                  </div>
                  <span className={`text-xs mt-1.5 smooth-transition font-semibold ${
                    active ? 'text-[var(--electric-blue)]' : 'text-[var(--secondary-gray)]'
                  }`}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}