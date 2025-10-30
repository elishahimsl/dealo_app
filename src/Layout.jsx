import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, Camera, FolderOpen, Sparkles } from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  const navItems = [
    { name: "Home", icon: Home, path: createPageUrl("Home") },
    { name: "Snap", icon: Camera, path: createPageUrl("Snap") },
    { name: "Library", icon: FolderOpen, path: createPageUrl("Library") },
    { name: "AI", icon: Sparkles, path: createPageUrl("AIAssistant") },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <style>{`
        :root {
          --electric-blue: #0066FF;
          --smart-gray: #1A1A1A;
          --secondary-gray: #6B7280;
          --light-blue: #EBF5FF;
          --border-gray: #E5E7EB;
        }
        
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
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
      `}</style>

      {/* Main Content */}
      <main className="flex-1 pb-20 overflow-auto">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 glass-effect border-t border-[var(--border-gray)] safe-bottom z-50">
        <div className="max-w-lg mx-auto px-4">
          <div className="flex items-center justify-around h-16">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex flex-col items-center justify-center flex-1 smooth-transition group"
                >
                  <div className={`p-2.5 rounded-2xl smooth-transition ${
                    active 
                      ? 'bg-[var(--electric-blue)] shadow-lg shadow-blue-500/30' 
                      : 'group-hover:bg-[var(--light-blue)]'
                  }`}>
                    <Icon 
                      className={`w-5 h-5 smooth-transition ${
                        active ? 'text-white' : 'text-[var(--secondary-gray)] group-hover:text-[var(--electric-blue)]'
                      }`}
                      strokeWidth={active ? 2.5 : 2}
                    />
                  </div>
                  <span className={`text-xs mt-1 smooth-transition font-medium ${
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