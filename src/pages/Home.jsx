import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Scan, Scale, FolderOpen, Sparkles, TrendingUp, Clock, Award, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const [userName, setUserName] = useState("");
  const [greeting, setGreeting] = useState("");
  const [rotatingText, setRotatingText] = useState(0);

  const rotatingMessages = [
    "Scan something new",
    "Compare two items", 
    "See what others discovered"
  ];

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
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    if (user) {
      const firstName = user.full_name?.split(' ')[0] || 'there';
      setUserName(firstName);
    }
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotatingText((prev) => (prev + 1) % rotatingMessages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const smartActions = [
    { 
      icon: Scan, 
      title: "Identify Something", 
      description: "Snap a picture or upload an image to learn more",
      gradient: "from-[var(--accent)] to-[var(--primary)]",
      page: "Snap"
    },
    { 
      icon: Scale, 
      title: "Compare Mode", 
      description: "Scan or select two images and I'll analyze the differences",
      gradient: "from-purple-600 to-blue-600",
      page: "Compare"
    },
    { 
      icon: FolderOpen, 
      title: "My Library", 
      description: "Access your saved scans, discoveries, and notes",
      gradient: "from-blue-600 to-cyan-600",
      page: "Library"
    }
  ];

  const recentScans = captures.slice(0, 3);
  const trendingTopics = [
    { title: "Top Tech Gadgets This Week", badge: "Trending" },
    { title: "Cool Art Finds", badge: "AI Recommended" },
    { title: "Eco-friendly Materials", badge: "Popular" }
  ];

  return (
    <div className="min-h-screen bg-[#1F2421]">
      {/* Top Section: Greeting */}
      <div className="px-6 pt-12 pb-8 slide-in">
        <h1 className="text-3xl font-bold text-[var(--light)] mb-2">
          {greeting}, {userName || 'there'} 👋
        </h1>
        <p className="text-[var(--secondary)] text-lg mb-4">
          What would you like to do today?
        </p>
        
        {/* Rotating Subtitles */}
        <div className="h-8 overflow-hidden">
          <div 
            className="smooth-transition"
            style={{ 
              transform: `translateY(-${rotatingText * 32}px)`,
              transition: 'transform 0.5s ease-in-out'
            }}
          >
            {rotatingMessages.map((msg, idx) => (
              <Link 
                key={idx} 
                to={createPageUrl(idx === 0 ? "Snap" : idx === 1 ? "Compare" : "Library")}
                className="h-8 flex items-center gap-2 text-[var(--accent)] font-medium hover:text-[var(--secondary)] smooth-transition"
              >
                <Sparkles className="w-4 h-4" />
                {msg}
                <ChevronRight className="w-4 h-4" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Middle Section: Smart Actions Grid */}
      <div className="px-6 pb-8">
        <div className="grid grid-cols-1 gap-4">
          {smartActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <Link key={idx} to={createPageUrl(action.page)}>
                <div 
                  className={`bg-gradient-to-br ${action.gradient} rounded-3xl p-6 shadow-2xl smooth-transition hover:scale-105 active:scale-95 slide-in`}
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-8 h-8 text-white" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{action.title}</h3>
                      <p className="text-white/80 text-sm leading-relaxed">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Lower Section: Smart Recommendations Feed */}
      <div className="px-6 pb-32">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-[var(--accent)]" />
          <h2 className="text-xl font-bold text-[var(--light)]">Smart Picks for You 🌟</h2>
        </div>

        {/* Horizontal Scrollable Cards */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide mb-6">
          {recentScans.map((scan, idx) => (
            <Link key={scan.id} to={`${createPageUrl("Preview")}?id=${scan.id}`}>
              <div className="flex-shrink-0 w-64 glass-dark rounded-3xl overflow-hidden smooth-transition hover:scale-105">
                <div className="h-40 bg-gradient-to-br from-[var(--primary)] to-[var(--accent)]">
                  <img 
                    src={scan.file_url} 
                    alt={scan.title}
                    className="w-full h-full object-cover opacity-90"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[var(--light)] text-sm line-clamp-1 mb-1">
                    {scan.title}
                  </h3>
                  <p className="text-[var(--secondary)] text-xs line-clamp-2 mb-3">
                    {scan.ai_summary || "Recent discovery"}
                  </p>
                  <Badge className="bg-[var(--accent)]/20 text-[var(--accent)] border-[var(--accent)]/30">
                    <Clock className="w-3 h-3 mr-1" />
                    Recent
                  </Badge>
                </div>
              </div>
            </Link>
          ))}

          {/* AI Curated Topics */}
          {trendingTopics.map((topic, idx) => (
            <div key={idx} className="flex-shrink-0 w-64 glass-dark rounded-3xl p-4 smooth-transition hover:scale-105">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mb-3">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-[var(--light)] text-sm mb-2">
                {topic.title}
              </h3>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                {topic.badge}
              </Badge>
            </div>
          ))}

          {/* Your Past Scans Suggestion */}
          {captures.length > 3 && (
            <Link to={createPageUrl("Library")}>
              <div className="flex-shrink-0 w-64 glass-dark rounded-3xl p-4 smooth-transition hover:scale-105">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[var(--primary)] flex items-center justify-center mb-3">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-[var(--light)] text-sm mb-2">
                  You have {captures.length} discoveries
                </h3>
                <p className="text-[var(--secondary)] text-xs mb-3">
                  Want to explore them again?
                </p>
                <Badge className="bg-[var(--accent)]/20 text-[var(--accent)] border-[var(--accent)]/30">
                  From Your Library
                </Badge>
              </div>
            </Link>
          )}
        </div>

        {/* Motivational Text */}
        <div className="text-center mt-8">
          <p className="text-[var(--secondary)] text-sm italic">
            "Smart discovery starts here."
          </p>
        </div>
      </div>
    </div>
  );
}