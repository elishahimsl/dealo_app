import React, { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Send, Loader2, ArrowLeft, Info, Trash2, Camera as CameraIcon } from "lucide-react";
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

export default function AIAssistant() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const { data: captures, refetch } = useQuery({
    queryKey: ['allCaptures'],
    queryFn: () => base44.entities.Capture.list('-created_date'),
    initialData: [],
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (promptText = input) => {
    const userMessage = promptText.trim();
    if (!userMessage || loading) return;

    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const context = captures.slice(0, 10).map(c => 
        `Title: ${c.title}\nType: ${c.content_type}\nSummary: ${c.ai_summary || 'N/A'}\nText: ${c.extracted_text?.substring(0, 200) || 'N/A'}`
      ).join('\n\n---\n\n');

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an AI assistant for SnapSmart, helping users understand their scans. Here are their recent scans:

${context}

User's question: ${userMessage}

Provide a helpful, concise response. Reference scan content when relevant.`,
      });

      setMessages(prev => [...prev, { role: "assistant", content: response }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Sorry, I encountered an error. Please try again." 
      }]);
    }
    setLoading(false);
  };

  const clearHistory = async () => {
    try {
      for (const capture of captures) {
        await base44.entities.Capture.delete(capture.id);
      }
      refetch();
      setMessages([]);
    } catch (error) {
      console.error("Error clearing history:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 bg-white border-b border-[var(--border-gray)]">
        <div className="flex items-center gap-4 mb-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(createPageUrl("Home"))}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[var(--smart-gray)]">⚙️ Settings</h1>
          </div>
        </div>
      </div>

      {/* Settings Options */}
      <div className="px-6 py-6 space-y-3">
        {/* Camera Permissions */}
        <button className="w-full bg-white border border-[var(--border-gray)] rounded-2xl p-5 text-left smooth-transition hover:shadow-md card-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--secondary-blue)] rounded-full flex items-center justify-center">
                <CameraIcon className="w-5 h-5 text-[var(--primary-blue)]" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--smart-gray)]">Camera Permissions</h3>
                <p className="text-sm text-[var(--secondary-gray)]">Manage camera access</p>
              </div>
            </div>
          </div>
        </button>

        {/* Smart Mode Toggle */}
        <button className="w-full bg-white border border-[var(--border-gray)] rounded-2xl p-5 text-left smooth-transition hover:shadow-md card-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[var(--neon-green)] to-[var(--neon-cyan)] rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--smart-gray)]">Smart Mode</h3>
                <p className="text-sm text-[var(--secondary-gray)]">Advanced AI insights enabled</p>
              </div>
            </div>
            <div className="w-12 h-6 bg-gradient-to-r from-[var(--neon-green)] to-[var(--neon-cyan)] rounded-full relative">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
            </div>
          </div>
        </button>

        {/* Clear History */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="w-full bg-white border border-red-200 rounded-2xl p-5 text-left smooth-transition hover:shadow-md hover:border-red-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-600">Clear History</h3>
                    <p className="text-sm text-[var(--secondary-gray)]">Delete all saved scans</p>
                  </div>
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

        {/* About SnapSmart */}
        <button 
          onClick={() => navigate(createPageUrl("Library"))}
          className="w-full bg-white border border-[var(--border-gray)] rounded-2xl p-5 text-left smooth-transition hover:shadow-md card-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center">
                <Info className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--smart-gray)]">About SnapSmart</h3>
                <p className="text-sm text-[var(--secondary-gray)]">Version 1.0.0</p>
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* App Info */}
      <div className="px-6 py-6 mt-auto">
        <div className="bg-gradient-to-r from-[var(--neon-green)] to-[var(--neon-cyan)] rounded-2xl p-6 text-center">
          <Sparkles className="w-12 h-12 text-white mx-auto mb-3" />
          <h3 className="text-white font-bold text-lg mb-2">SnapSmart AI</h3>
          <p className="text-white/90 text-sm leading-relaxed">
            Your intelligent companion for scanning, organizing, and learning from the world around you.
          </p>
        </div>
      </div>
    </div>
  );
}