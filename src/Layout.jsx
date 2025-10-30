import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, Scale, FolderOpen, User, Camera } from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  const navItems = [
    { name: "Home", icon: Home, path: createPageUrl("Home") },
    { name: "Compare", icon: Scale, path: createPageUrl("Compare") },
    { name: "Snap", icon: Camera, path: createPageUrl("Snap"), isCenter: true },
    { name: "Library", icon: FolderOpen, path: createPageUrl("Library") },
    { name: "Profile", icon: User, path: createPageUrl("Profile") },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#1F2421] flex flex-col">
      <style>{`
        :root {
          --bg-dark: #1F2421;
          --primary: #216869;
          --accent: #49A078;
          --secondary: #9CC5A1;
          --light: #DCE1DE;
        }
        
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(73, 160, 120, 0.5); }
          50% { box-shadow: 0 0 30px rgba(73, 160, 120, 0.8); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .shimmer {
          animation: shimmer 2s infinite linear;
          background: linear-gradient(to right, #2a3330 0%, #3a4340 20%, #2a3330 40%, #2a3330 100%);
          background-size: 1000px 100%;
        }
        
        .glow-pulse {
          animation: glow 2s ease-in-out infinite;
        }
        
        .float-animation {
          animation: float 3s ease-in-out infinite;
        }
        
        .slide-in {
          animation: slideIn 0.5s ease-out;
        }

        .smooth-transition {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .glass-dark {
          backdrop-filter: blur(20px) saturate(180%);
          background-color: rgba(31, 36, 33, 0.85);
          border: 1px solid rgba(73, 160, 120, 0.2);
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
      <main className="flex-1 pb-24 overflow-auto">
        {children}
      </main>

      {/* Bottom Navigation with Floating Center Button */}
      <nav className="fixed bottom-0 left-0 right-0 glass-dark border-t border-[var(--accent)]/20 z-50">
        <div className="max-w-lg mx-auto px-6 relative">
          {/* Floating Camera Button */}
          <Link to={createPageUrl("Snap")}>
            <div className="absolute left-1/2 -translate-x-1/2 -top-8">
              <button className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--primary)] shadow-2xl glow-pulse flex items-center justify-center smooth-transition hover:scale-110 active:scale-95">
                <Camera className="w-8 h-8 text-white" strokeWidth={2.5} />
              </button>
            </div>
          </Link>

          <div className="flex items-center justify-around h-20">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              if (item.isCenter) {
                // Empty space for floating button
                return <div key={item.name} className="flex-1" />;
              }
              
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex flex-col items-center justify-center flex-1 smooth-transition group"
                >
                  <Icon 
                    className={`w-6 h-6 mb-1 smooth-transition ${
                      active ? 'text-[var(--accent)]' : 'text-[var(--secondary)] group-hover:text-[var(--accent)]'
                    }`}
                    strokeWidth={active ? 2.5 : 2}
                  />
                  <span className={`text-xs smooth-transition font-medium ${
                    active ? 'text-[var(--accent)]' : 'text-[var(--secondary)]'
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