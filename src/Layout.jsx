import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, ShoppingCart, MoreHorizontal, User, Scan } from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  // Hide nav on splash screen
  if (location.pathname === createPageUrl("Splash")) {
    return <div className="min-h-screen">{children}</div>;
  }

  const navItems = [
    { name: "Home", icon: Home, path: createPageUrl("Home") },
    { name: "My Cart", icon: ShoppingCart, path: createPageUrl("MyCart") },
    { name: "Scan", icon: Scan, path: createPageUrl("Snap"), isCenter: true },
    { name: "More", icon: MoreHorizontal, path: createPageUrl("More") },
    { name: "Profile", icon: User, path: createPageUrl("Profile") },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      <style>{`
        @keyframes scanLine {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
        
        .scan-line {
          animation: scanLine 2s ease-in-out infinite;
        }
        
        .smooth-transition {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>

      {/* Main Content */}
      <main className="flex-1 pb-24 overflow-auto">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E4E8ED] z-50 shadow-lg">
        <div className="max-w-lg mx-auto px-4 relative">
          {/* Center Camera Button - Larger, Stationary */}
          <Link to={createPageUrl("Snap")}>
            <div className="absolute left-1/2 -translate-x-1/2 -top-8">
              <button className="w-20 h-20 rounded-full bg-gradient-to-br from-[#5EE177] to-[#FF8AC6] shadow-2xl flex items-center justify-center smooth-transition hover:scale-105 active:scale-95">
                {/* Scanner Icon with Animated Line */}
                <div className="relative w-12 h-12">
                  <Scan className="w-12 h-12 text-white" strokeWidth={2} />
                  {/* Animated Neon Green Scanning Line */}
                  <div className="absolute inset-0 overflow-hidden rounded">
                    <div className="scan-line w-full h-1 bg-[#5EE177] opacity-80 blur-sm" />
                  </div>
                </div>
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
                  className="flex flex-col items-center justify-center flex-1 smooth-transition"
                >
                  <Icon 
                    className={`w-6 h-6 mb-1 smooth-transition ${
                      active ? 'text-[#5EE177]' : 'text-[#60656F]'
                    }`}
                    strokeWidth={active ? 2.5 : 2}
                  />
                  <span className={`text-xs font-semibold smooth-transition ${
                    active ? 'text-[#5EE177]' : 'text-[#60656F]'
                  }`} style={{ fontFamily: 'Nunito, sans-serif' }}>
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