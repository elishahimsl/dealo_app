import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Camera, Scale, TrendingUp, Sparkles, Star, Clock, Package } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

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

  const { data: captures, isLoading } = useQuery({
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

  const recentScans = captures.slice(0, 3);
  const trendingProducts = captures.filter(c => c.content_type === 'product').slice(0, 3);
  const aiSuggestions = captures.slice(3, 6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <h1 className="text-3xl font-bold text-[var(--smart-gray)] mb-2">
          Welcome back, {userName || 'there'} 👋
        </h1>
        <p className="text-[var(--secondary-gray)] text-sm">
          Discover and explore with SnapSmart
        </p>
      </div>

      {/* Quick Access Buttons */}
      <div className="px-6 mb-8">
        <div className="grid grid-cols-2 gap-4">
          <Link to={createPageUrl("Snap")}>
            <div className="bg-gradient-to-br from-[var(--electric-blue)] to-[var(--teal-accent)] rounded-3xl p-6 text-white card-shadow smooth-transition hover:scale-105 active:scale-95">
              <div className="flex items-center justify-between mb-3">
                <Camera className="w-8 h-8" strokeWidth={2.5} />
                <Sparkles className="w-6 h-6 opacity-80" />
              </div>
              <h3 className="text-xl font-bold mb-1">Snap Now</h3>
              <p className="text-sm text-white/80">Identify anything</p>
            </div>
          </Link>

          <Link to={createPageUrl("Compare")}>
            <div className="bg-white rounded-3xl p-6 border-2 border-[var(--electric-blue)] card-shadow smooth-transition hover:scale-105 active:scale-95">
              <div className="flex items-center justify-between mb-3">
                <Scale className="w-8 h-8 text-[var(--electric-blue)]" strokeWidth={2.5} />
                <Sparkles className="w-6 h-6 text-[var(--teal-accent)]" />
              </div>
              <h3 className="text-xl font-bold text-[var(--smart-gray)] mb-1">Compare</h3>
              <p className="text-sm text-[var(--secondary-gray)]">2 items side-by-side</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Scroll Feed */}
      <div className="px-6 pb-8 space-y-8">
        {/* Recently Scanned Items */}
        <div className="slide-up">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[var(--electric-blue)]" />
              <h2 className="text-lg font-bold text-[var(--smart-gray)]">Recently Scanned</h2>
            </div>
            <Link to={createPageUrl("Library")}>
              <Button variant="ghost" size="sm" className="text-[var(--electric-blue)] font-semibold">
                View All
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-square rounded-2xl shimmer" />
              ))}
            </div>
          ) : recentScans.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-[var(--border-gray)] soft-shadow">
              <Camera className="w-12 h-12 text-[var(--secondary-gray)] mx-auto mb-3" />
              <p className="text-[var(--secondary-gray)] text-sm">No scans yet. Start snapping!</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {recentScans.map((scan) => (
                <Link key={scan.id} to={`${createPageUrl("Preview")}?id=${scan.id}`}>
                  <div className="aspect-square rounded-2xl overflow-hidden bg-white border border-[var(--border-gray)] soft-shadow smooth-transition hover:scale-105">
                    <img 
                      src={scan.file_url} 
                      alt={scan.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Trending Products */}
        {trendingProducts.length > 0 && (
          <div className="slide-up">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-[var(--purple-accent)]" />
              <h2 className="text-lg font-bold text-[var(--smart-gray)]">Trending Products</h2>
            </div>
            <div className="space-y-3">
              {trendingProducts.map((product) => (
                <Link key={product.id} to={`${createPageUrl("Preview")}?id=${product.id}`}>
                  <div className="bg-white rounded-2xl p-4 border border-[var(--border-gray)] soft-shadow smooth-transition hover:shadow-lg flex items-center gap-4">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      <img 
                        src={product.file_url} 
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[var(--smart-gray)] text-sm line-clamp-1 mb-1">
                        {product.title}
                      </h3>
                      <p className="text-xs text-[var(--secondary-gray)] line-clamp-2 mb-2">
                        {product.ai_summary}
                      </p>
                      <Badge className="bg-purple-50 text-purple-600 border-purple-200 text-xs">
                        Trending
                      </Badge>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* AI Suggestions */}
        {aiSuggestions.length > 0 && (
          <div className="slide-up">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-[var(--teal-accent)]" />
              <h2 className="text-lg font-bold text-[var(--smart-gray)]">AI Suggestions for You</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {aiSuggestions.map((suggestion) => (
                <Link key={suggestion.id} to={`${createPageUrl("Preview")}?id=${suggestion.id}`}>
                  <div className="bg-white rounded-2xl overflow-hidden border border-[var(--border-gray)] soft-shadow smooth-transition hover:scale-105">
                    <div className="aspect-square bg-gray-100">
                      <img 
                        src={suggestion.file_url} 
                        alt={suggestion.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-bold text-[var(--smart-gray)] text-sm line-clamp-1 mb-1">
                        {suggestion.title}
                      </h3>
                      <p className="text-xs text-[var(--secondary-gray)] line-clamp-2">
                        {suggestion.ai_summary}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Motivational Tagline */}
      <div className="px-6 pb-8">
        <div className="text-center">
          <p className="text-[var(--secondary-gray)] text-sm font-medium italic">
            "Learn more with every snap."
          </p>
        </div>
      </div>
    </div>
  );
}