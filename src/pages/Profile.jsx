import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Settings, MessageSquare, HelpCircle, Moon, Trash2, User, Scan, Scale, Star, LogOut } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Profile() {
  const navigate = useNavigate();

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

  const { data: captures, refetch } = useQuery({
    queryKey: ['allCaptures'],
    queryFn: () => base44.entities.Capture.list(),
    initialData: [],
  });

  const totalScans = captures.length;
  const favorites = captures.filter(c => c.is_favorite).length;
  const comparisons = 0; // This would track comparison history

  const clearHistory = async () => {
    try {
      for (const capture of captures) {
        await base44.entities.Capture.delete(capture.id);
      }
      refetch();
    } catch (error) {
      console.error("Error clearing history:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Profile Header */}
      <div className="px-6 pt-12 pb-8">
        <div className="bg-white rounded-3xl p-6 card-shadow">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--electric-blue)] to-[var(--teal-accent)] flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--smart-gray)] mb-1">
                {user?.full_name || 'Guest User'}
              </h2>
              <p className="text-[var(--secondary-gray)] text-sm">
                {user?.email || 'guest@snapsmart.com'}
              </p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-2">
                <Scan className="w-6 h-6 text-[var(--electric-blue)]" />
              </div>
              <p className="text-2xl font-bold text-[var(--smart-gray)]">{totalScans}</p>
              <p className="text-xs text-[var(--secondary-gray)]">Total Scans</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto mb-2">
                <Scale className="w-6 h-6 text-[var(--purple-accent)]" />
              </div>
              <p className="text-2xl font-bold text-[var(--smart-gray)]">{comparisons}</p>
              <p className="text-xs text-[var(--secondary-gray)]">Comparisons</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-yellow-50 flex items-center justify-center mx-auto mb-2">
                <Star className="w-6 h-6 text-yellow-500" />
              </div>
              <p className="text-2xl font-bold text-[var(--smart-gray)]">{favorites}</p>
              <p className="text-xs text-[var(--secondary-gray)]">Favorites</p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Section */}
      <div className="px-6 pb-8 space-y-3">
        <h3 className="font-bold text-[var(--smart-gray)] text-sm mb-3 px-2">⚙️ Settings</h3>

        {/* Toggle Dark Mode */}
        <button className="w-full bg-white rounded-2xl p-5 border border-[var(--border-gray)] soft-shadow smooth-transition hover:shadow-md text-left flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <Moon className="w-5 h-5 text-[var(--smart-gray)]" />
            </div>
            <div>
              <h4 className="font-semibold text-[var(--smart-gray)]">Dark Mode</h4>
              <p className="text-xs text-[var(--secondary-gray)]">Toggle theme</p>
            </div>
          </div>
          <div className="w-12 h-6 bg-gray-200 rounded-full relative">
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
          </div>
        </button>

        {/* Manage Account */}
        <button className="w-full bg-white rounded-2xl p-5 border border-[var(--border-gray)] soft-shadow smooth-transition hover:shadow-md text-left flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
              <Settings className="w-5 h-5 text-[var(--electric-blue)]" />
            </div>
            <div>
              <h4 className="font-semibold text-[var(--smart-gray)]">Manage Account</h4>
              <p className="text-xs text-[var(--secondary-gray)]">Edit profile & preferences</p>
            </div>
          </div>
        </button>

        {/* Clear Cache/History */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="w-full bg-white rounded-2xl p-5 border border-red-200 soft-shadow smooth-transition hover:shadow-md text-left flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-red-600">Clear History</h4>
                  <p className="text-xs text-[var(--secondary-gray)]">Delete all scans</p>
                </div>
              </div>
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear all scan history?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete all your saved scans. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={clearHistory} className="bg-red-500 hover:bg-red-600">
                Clear History
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <h3 className="font-bold text-[var(--smart-gray)] text-sm mb-3 px-2 mt-6">💬 Support</h3>

        {/* Feedback */}
        <button className="w-full bg-white rounded-2xl p-5 border border-[var(--border-gray)] soft-shadow smooth-transition hover:shadow-md text-left flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-50 rounded-full flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-[var(--teal-accent)]" />
            </div>
            <div>
              <h4 className="font-semibold text-[var(--smart-gray)]">Feedback</h4>
              <p className="text-xs text-[var(--secondary-gray)]">Share your thoughts</p>
            </div>
          </div>
        </button>

        {/* Help & Support */}
        <button className="w-full bg-white rounded-2xl p-5 border border-[var(--border-gray)] soft-shadow smooth-transition hover:shadow-md text-left flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-[var(--purple-accent)]" />
            </div>
            <div>
              <h4 className="font-semibold text-[var(--smart-gray)]">Help & Support</h4>
              <p className="text-xs text-[var(--secondary-gray)]">FAQs and contact</p>
            </div>
          </div>
        </button>

        {/* Logout */}
        <button 
          onClick={() => base44.auth.logout()}
          className="w-full bg-white rounded-2xl p-5 border border-[var(--border-gray)] soft-shadow smooth-transition hover:shadow-md text-left flex items-center justify-between mt-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <LogOut className="w-5 h-5 text-[var(--smart-gray)]" />
            </div>
            <div>
              <h4 className="font-semibold text-[var(--smart-gray)]">Log Out</h4>
            </div>
          </div>
        </button>

        {/* About */}
        <div className="bg-gradient-to-r from-[var(--electric-blue)] to-[var(--teal-accent)] rounded-3xl p-6 text-center mt-8">
          <h3 className="text-white font-bold text-lg mb-2">SnapSmart AI</h3>
          <p className="text-white/90 text-sm">Version 1.0.0 (2025 Edition)</p>
          <p className="text-white/80 text-xs mt-2">© 2025 SnapSmart. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}