import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Camera, FileText, FolderOpen, Sparkles, Star, Calendar, BookOpen, TrendingUp } from "lucide-react";
import SmartCard from "../components/home/SmartCard";
import QuickActionCard from "../components/home/QuickActionCard";

export default function Home() {
  const [greeting, setGreeting] = useState("");
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
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    if (user) {
      const firstName = user.full_name?.split(' ')[0] || 'there';
      setUserName(firstName);
    }
  }, [user]);

  const quickActions = [
    { icon: Camera, label: "Snap New", color: "bg-blue-500", page: "Snap" },
    { icon: FileText, label: "Add Note", color: "bg-purple-500", page: "Snap" },
    { icon: FolderOpen, label: "Library", color: "bg-emerald-500", page: "Library" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="px-6 pt-12 pb-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[var(--smart-gray)] mb-1">
              {greeting}, {userName || 'there'} 👋
            </h1>
            <p className="text-[var(--secondary-gray)] text-sm font-medium">
              Let's organize your day
            </p>
          </div>
          <Link to={createPageUrl("AIAssistant")}>
            <Button 
              size="icon" 
              className="bg-gradient-to-br from-blue-500 to-purple-600 hover:shadow-lg smooth-transition rounded-2xl h-12 w-12"
            >
              <Sparkles className="w-5 h-5 text-white" />
            </Button>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {quickActions.map((action, index) => (
            <QuickActionCard key={index} action={action} />
          ))}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-white rounded-2xl p-4 border border-[var(--border-gray)] smooth-transition hover:shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-blue-50 rounded-xl">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-[var(--smart-gray)]">{captures.length}</p>
            <p className="text-xs text-[var(--secondary-gray)] font-medium">Total Items</p>
          </div>
          
          <div className="bg-white rounded-2xl p-4 border border-[var(--border-gray)] smooth-transition hover:shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-purple-50 rounded-xl">
                <BookOpen className="w-4 h-4 text-purple-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-[var(--smart-gray)]">
              {captures.filter(c => c.content_type === 'notes').length}
            </p>
            <p className="text-xs text-[var(--secondary-gray)] font-medium">Notes</p>
          </div>
          
          <div className="bg-white rounded-2xl p-4 border border-[var(--border-gray)] smooth-transition hover:shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-emerald-50 rounded-xl">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-[var(--smart-gray)]">
              {captures.filter(c => c.has_due_date).length}
            </p>
            <p className="text-xs text-[var(--secondary-gray)] font-medium">Due Soon</p>
          </div>
        </div>
      </div>

      {/* Recent Captures Feed */}
      <div className="px-6 pb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[var(--smart-gray)]">Recent Captures</h2>
          <Link to={createPageUrl("Library")}>
            <Button variant="ghost" size="sm" className="text-[var(--electric-blue)] font-semibold">
              View All
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-4 border border-[var(--border-gray)] shimmer h-40" />
            ))}
          </div>
        ) : captures.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-[var(--border-gray)] text-center">
            <div className="w-20 h-20 bg-[var(--light-blue)] rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="w-10 h-10 text-[var(--electric-blue)]" />
            </div>
            <h3 className="text-lg font-bold text-[var(--smart-gray)] mb-2">No captures yet</h3>
            <p className="text-[var(--secondary-gray)] text-sm mb-6">
              Start by capturing your first note or document
            </p>
            <Link to={createPageUrl("Snap")}>
              <Button className="bg-[var(--electric-blue)] hover:bg-blue-600 rounded-xl px-6 font-semibold">
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
    </div>
  );
}