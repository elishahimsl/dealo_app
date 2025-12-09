import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, User, Camera, Compass, GitCompare } from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  // Hide nav on splash screen, camera page, and search products
  if (location.pathname === createPageUrl("Splash") || location.pathname === createPageUrl("Snap") || location.pathname === createPageUrl("SearchProducts")) {
    return <div className="min-h-screen">{children}</div>;
  }

  const navItems = [
    { name: "Home", icon: Home, path: createPageUrl("Home") },
    { name: "Compare", icon: GitCompare, path: createPageUrl("Compare") },
    { name: "Scan", icon: Camera, path: createPageUrl("Snap") + `?from=${currentPageName}`, isCenter: true },
    { name: "Discover", icon: Compass, path: createPageUrl("More") },
    { name: "Account", icon: User, path: createPageUrl("Profile") },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Main Content */}
      <main className="flex-1 pb-24 overflow-auto">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] z-50 shadow-lg">
        <div className="max-w-lg mx-auto px-4 relative">
          {/* Center Camera Button */}
          <Link to={createPageUrl("Snap")}>
            <div className="absolute left-1/2 -translate-x-1/2 -top-6">
              <button className="w-16 h-16 rounded-full bg-[#00A36C] shadow-2xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95">
                <Camera className="w-8 h-8 text-white" strokeWidth={2.5} />
              </button>
            </div>
          </Link>

          <div className="flex items-center justify-around h-16">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              if (item.isCenter) {
                return <div key={item.name} className="flex-1" />;
              }
              
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex flex-col items-center justify-center flex-1 transition-all"
                >
                  <Icon 
                    className={`w-6 h-6 transition-colors ${
                      active ? 'text-[#00A36C]' : 'text-[#6B7280]'
                    }`}
                    strokeWidth={active ? 2.5 : 2}
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}