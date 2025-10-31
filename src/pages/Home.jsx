import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Scan, Scale, Lightbulb, FolderOpen, TrendingUp, DollarSign, Star, ChevronRight, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function Home() {
  const [userName, setUserName] = useState("");

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        return await base44.auth.me();
      } catch {
        return null;
      }
    }
  });

  const { data: captures } = useQuery({
    queryKey: ['recentCaptures'],
    queryFn: () => base44.entities.Capture.list('-created_date', 10),
    initialData: [],
  });

  useEffect(() => {
    if (user) {
      const firstName = user.full_name?.split(' ')[0] || 'there';
      setUserName(firstName);
    }
  }, [user]);

  const quickActions = [
    { 
      icon: Scan, 
      title: "Scan Product", 
      description: "Identify any product instantly",
      gradient: "from-[var(--primary)] to-[var(--secondary)]",
      page: "Snap"
    },
    { 
      icon: Scale, 
      title: "Compare Mode", 
      description: "Side-by-side product comparison",
      gradient: "from-purple-600 to-blue-600",
      page: "Compare"
    },
    { 
      icon: Lightbulb, 
      title: "Smart Recommendations", 
      description: "AI-powered product suggestions",
      gradient: "from-orange-500 to-yellow-500",
      page: "Library"
    },
    { 
      icon: FolderOpen, 
      title: "Library Access", 
      description: "View your saved scans & comparisons",
      gradient: "from-cyan-600 to-teal-600",
      page: "Library"
    }
  ];

  const recommendedProducts = captures.slice(0, 3);

  return (
    <div className="min-h-screen bg-background theme-transition">
      {/* Header */}
      <div className="px-6 pt-12 pb-8 fade-in">
        <h1 className="text-3xl font-bold text-main mb-2">
          👋 Hi {userName || 'there'}, what would you like to do today?
        </h1>
      </div>

      {/* Quick Action Tiles - 2x2 Grid */}
      <div className="px-6 pb-8">
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <Link key={idx} to={createPageUrl(action.page)}>
                <div 
                  className={`bg-gradient-to-br ${action.gradient} rounded-3xl p-6 card-shadow transition-transform hover:scale-105 active:scale-95 bounce-tap fade-in`}
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <Icon className="w-10 h-10 text-white mb-3" strokeWidth={2.5} />
                  <h3 className="text-lg font-bold text-white mb-1">{action.title}</h3>
                  <p className="text-white/80 text-xs leading-relaxed">
                    {action.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Dynamic Carousel Section */}
      {recommendedProducts.length > 0 && (
        <div className="px-6 pb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-main">Because you liked...</h2>
            <Link to={createPageUrl("Library")}>
              <button className="text-primary font-semibold text-sm flex items-center gap-1">
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {recommendedProducts.map((product) => (
              <Link key={product.id} to={`${createPageUrl("Preview")}?id=${product.id}`}>
                <div className="flex-shrink-0 w-64 bg-card glass-effect rounded-3xl overflow-hidden card-shadow transition-transform hover:scale-105 bounce-tap">
                  <div className="h-40 bg-gradient-to-br from-primary/20 to-secondary/20">
                    <img 
                      src={product.file_url} 
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-main text-sm line-clamp-1 mb-2">
                      {product.title}
                    </h3>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-semibold text-main">4.5</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-primary" />
                        <span className="text-sm font-bold text-primary">Best Price</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-primary/20 text-primary border-0 text-xs">
                        <Zap className="w-3 h-3 mr-1" />
                        Smart Buy
                      </Badge>
                      <span className="text-xs text-secondary">95% Score</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {/* AI Recommendation Card */}
            <div className="flex-shrink-0 w-64 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-6 card-shadow">
              <TrendingUp className="w-12 h-12 text-white mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Trending Deals</h3>
              <p className="text-white/80 text-sm mb-4">
                AI found {captures.length} products you might love
              </p>
              <button className="bg-white text-purple-600 font-semibold text-sm px-4 py-2 rounded-full hover:bg-white/90 transition-colors">
                Explore Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {recommendedProducts.length === 0 && (
        <div className="px-6 pb-8">
          <div className="bg-card glass-effect rounded-3xl p-12 text-center card-shadow">
            <Scan className="w-16 h-16 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-main mb-2">Start Scanning!</h3>
            <p className="text-secondary text-sm mb-6">
              Scan your first product to get personalized recommendations
            </p>
            <Link to={createPageUrl("Snap")}>
              <button className="bg-gradient-to-r from-primary to-secondary text-white font-bold px-6 py-3 rounded-full hover:scale-105 transition-transform bounce-tap">
                Scan Product
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* Tagline */}
      <div className="px-6 pb-12 text-center">
        <p className="text-secondary text-sm italic">
          "Shop Smarter, Save Big."
        </p>
      </div>
    </div>
  );
}