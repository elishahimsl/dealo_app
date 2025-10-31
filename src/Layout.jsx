import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, FolderOpen, Camera, User } from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [theme, setTheme] = useState('dark');

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('snapsmart-theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const navItems = [
    { name: "Home", icon: Home, path: createPageUrl("Home") },
    { name: "Library", icon: FolderOpen, path: createPageUrl("Library") },
    { name: "Camera", icon: Camera, path: createPageUrl("Snap"), isCenter: true },
    { name: "Profile", icon: User, path: createPageUrl("Profile") },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <style>{`
        :root {
          --bg-dark: #1F2421;
          --bg-light: #F8F9F7;
          --primary-dark: #216869;
          --primary-light: #49A078;
          --secondary-dark: #49A078;
          --secondary-light: #216869;
          --soft-accent: #9CC5A1;
          --text-dark: #DCE1DE;
          --text-light: #1F2421;
        }
        
        [data-theme="dark"] {
          --background: var(--bg-dark);
          --primary: var(--primary-dark);
          --secondary: var(--secondary-dark);
          --text: var(--text-dark);
          --card-bg: rgba(33, 104, 105, 0.1);
          --border: rgba(73, 160, 120, 0.2);
        }
        
        [data-theme="light"] {
          --background: var(--bg-light);
          --primary: var(--primary-light);
          --secondary: var(--secondary-light);
          --text: var(--text-light);
          --card-bg: rgba(255, 255, 255, 0.9);
          --border: rgba(156, 197, 161, 0.3);
        }
        
        .bg-background { background-color: var(--background); }
        .text-primary { color: var(--primary); }
        .text-secondary { color: var(--secondary); }
        .text-main { color: var(--text); }
        .bg-card { background-color: var(--card-bg); }
        .border-theme { border-color: var(--border); }
        
        @keyframes ripple {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .theme-transition {
          transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
        }
        
        .ripple-effect {
          animation: ripple 1.5s ease-out infinite;
        }
        
        .float-animation {
          animation: float 3s ease-in-out infinite;
        }
        
        .fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        
        .bounce-tap:active {
          animation: bounce 0.3s ease-out;
        }
        
        .glass-effect {
          backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid var(--border);
        }
        
        .card-shadow {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        }
        
        [data-theme="dark"] .card-shadow {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
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
      <main className="flex-1 pb-24 overflow-auto theme-transition">
        {children}
      </main>

      {/* Bottom Navigation with Floating Camera Button */}
      <nav className="fixed bottom-0 left-0 right-0 glass-effect bg-card border-t border-theme z-50 theme-transition">
        <div className="max-w-lg mx-auto px-6 relative">
          {/* Floating Camera Button - TikTok style */}
          <Link to={createPageUrl("Snap")}>
            <div className="absolute left-1/2 -translate-x-1/2 -top-8">
              <button className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary shadow-2xl float-animation flex items-center justify-center bounce-tap hover:scale-110 active:scale-95 transition-transform">
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
                  className="flex flex-col items-center justify-center flex-1 transition-all bounce-tap"
                >
                  <Icon 
                    className={`w-6 h-6 mb-1 transition-colors ${
                      active ? 'text-primary' : 'text-secondary'
                    }`}
                    strokeWidth={active ? 2.5 : 2}
                  />
                  <span className={`text-xs font-semibold transition-colors ${
                    active ? 'text-primary' : 'text-secondary'
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