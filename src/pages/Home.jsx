import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Camera, FileText, FolderOpen, Sparkles, Calendar, BookOpen, Target, User, Lightbulb, X } from "lucide-react";
import SmartCard from "../components/home/SmartCard";
import QuickActionCard from "../components/home/QuickActionCard";

export default function Home() {
  const [greeting, setGreeting] = useState("");
  const [userName, setUserName] = useState("");
  const [showTip, setShowTip] = useState(true);

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
    const timer = setTimeout(() => {
      setShowTip(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const quickActions = [
    { icon: Camera, label: "Snap New", color: "bg-gradient-to-br from-blue-500 to-blue-600", page: "Snap" },
    { icon: FileText, label: "Add Note", color: "bg-gradient-to-br from-purple-500 to-purple-600", page: "Snap" },
    { icon: FolderOpen, label: "Browse Library", color: "bg-gradient-to-br from-emerald-500 to-emerald-600", page: "Library" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[var(--smart-gray)] mb-1">
              👋 {greeting}, {userName || 'there'}
            </h1>
            <p className="text-[var(--secondary-gray)] text-sm font-medium">
              Your smart learning companion
            </p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center border-2 border-white card-shadow">
            <User className="w-5 h-5 text-[var(--primary-blue)]" />
          </div>
        </div>

        {/* Quick Actions - Row of 3 */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {quickActions.map((action, index) => (
            <QuickActionCard key={index} action={action} />
          ))}
        </div>
      </div>

      {/* Recent Smart Captures Feed */}
      <div className="px-6 pb-8">
        <h2 className="text-lg font-semibold text-[var(--smart-gray)] mb-4">
          Recent Smart Captures
        </h2>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-[var(--border-gray)] shimmer h-44" />
            ))}
          </div>
        ) : captures.length === 0 ? (
          <div className="bg-[var(--secondary-blue)] rounded-2xl p-12 border border-blue-200 text-center card-shadow">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="w-10 h-10 text-[var(--primary-blue)]" />
            </div>
            <h3 className="text-lg font-bold text-[var(--smart-gray)] mb-2">No captures yet</h3>
            <p className="text-[var(--secondary-gray)] text-sm mb-6">
              Start by capturing your first note or document
            </p>
            <Link to={createPageUrl("Snap")}>
              <Button className="bg-[var(--primary-blue)] hover:bg-blue-600 rounded-full px-6 font-semibold h-12">
                <Camera className="w-4 h-4 mr-2" />
                Snap Now
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {captures.map((capture) => (
              <SmartCard key={capture.id} capture={capture} />
            ))}
          </div>
        )}
      </div>

      {/* AI Tip Strip - Floating bubble */}
      {showTip && captures.length > 0 && (
        <div className="fixed bottom-24 left-6 right-6 z-40 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full px-6 py-4 card-shadow flex items-center justify-between max-w-md mx-auto">
            <div className="flex items-center gap-3">
              <Lightbulb className="w-5 h-5 text-white flex-shrink-0" />
              <p className="text-white text-sm font-medium">
                Try asking AI: "Summarize my recent notes"
              </p>
            </div>
            <button 
              onClick={() => setShowTip(false)}
              className="ml-2 text-white/80 hover:text-white smooth-transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}