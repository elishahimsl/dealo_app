import React, { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Send, Loader2, ArrowLeft, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function AIAssistant() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm your AI assistant. I can help you summarize your notes, create flashcards, answer questions about your captures, and more. What would you like to do?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const { data: captures } = useQuery({
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

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      // Build context from user's captures
      const context = captures.slice(0, 10).map(c => 
        `Title: ${c.title}\nType: ${c.content_type}\nSummary: ${c.ai_summary || 'N/A'}\nText: ${c.extracted_text?.substring(0, 200) || 'N/A'}`
      ).join('\n\n---\n\n');

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an AI study assistant helping a student. Here are their recent captures:

${context}

User's question: ${userMessage}

Provide a helpful, concise response. If they ask about specific notes or captures, reference the content above. If they ask you to create flashcards or summaries, provide those directly in your response.`,
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

  const quickPrompts = [
    "Summarize my recent notes",
    "What do I need to study?",
    "Create a quiz from my captures",
    "What are my upcoming deadlines?"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 bg-white border-b border-[var(--border-gray)]">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(createPageUrl("Home"))}
            className="rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[var(--smart-gray)]">AI Assistant</h1>
            <p className="text-sm text-[var(--secondary-gray)]">Ask me anything</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {messages.map((message, idx) => (
          <div
            key={idx}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-3xl px-5 py-3 ${
                message.role === 'user'
                  ? 'bg-[var(--electric-blue)] text-white'
                  : 'bg-white border border-[var(--border-gray)] text-[var(--smart-gray)]'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-[var(--electric-blue)]" />
                  <span className="text-xs font-semibold text-[var(--electric-blue)]">AI Assistant</span>
                </div>
              )}
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-[var(--border-gray)] rounded-3xl px-5 py-3 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[var(--electric-blue)]" />
              <span className="text-sm text-[var(--secondary-gray)]">Thinking...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      {messages.length === 1 && (
        <div className="px-6 pb-4">
          <p className="text-xs font-semibold text-[var(--secondary-gray)] mb-3">Quick prompts:</p>
          <div className="grid grid-cols-2 gap-2">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInput(prompt);
                  setTimeout(() => handleSend(), 100);
                }}
                className="bg-white border border-[var(--border-gray)] rounded-2xl p-3 text-xs font-semibold text-[var(--smart-gray)] smooth-transition hover:border-[var(--electric-blue)] hover:bg-[var(--light-blue)] text-left"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-6 pb-8 pt-4 bg-white border-t border-[var(--border-gray)]">
        <div className="flex gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything..."
            className="flex-1 h-12 rounded-2xl border-[var(--border-gray)] text-base"
            disabled={loading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="h-12 w-12 rounded-2xl bg-[var(--electric-blue)] hover:bg-blue-600 p-0"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}