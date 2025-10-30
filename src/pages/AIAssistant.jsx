import React, { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Send, Loader2, FileText, Zap, Target, Brain } from "lucide-react";

export default function AIAssistant() {
  const [messages, setMessages] = useState([]);
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

  const smartActions = [
    { icon: FileText, label: "Summarize", prompt: "Summarize my recent notes" },
    { icon: Sparkles, label: "Flashcards", prompt: "Create flashcards from my latest capture" },
    { icon: Zap, label: "Quiz Me", prompt: "Create a quiz from my captures" },
    { icon: Target, label: "Organize", prompt: "Help me organize my files by subject" },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 bg-white border-b border-[var(--border-gray)]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[var(--smart-gray)]">🤖 SnapSmart AI Assistant</h1>
            <p className="text-sm text-[var(--secondary-gray)]">Your smart learning companion</p>
          </div>
        </div>
      </div>

      {/* Smart Actions Strip - Horizontal chips */}
      {messages.length === 0 && (
        <div className="px-6 py-4 border-b border-[var(--border-gray)] bg-[var(--secondary-blue)]">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            {smartActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSend(action.prompt)}
                  className="flex items-center gap-2 bg-white border border-blue-200 rounded-full px-4 py-2 whitespace-nowrap smooth-transition hover:bg-blue-50 hover:border-[var(--primary-blue)] flex-shrink-0"
                >
                  <Icon className="w-4 h-4 text-[var(--primary-blue)]" />
                  <span className="text-sm font-semibold text-[var(--smart-gray)]">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
              <Brain className="w-10 h-10 text-[var(--primary-blue)]" />
            </div>
            <h2 className="text-xl font-bold text-[var(--smart-gray)] mb-2">
              Ask me to analyze your latest upload 📚
            </h2>
            <p className="text-[var(--secondary-gray)] text-sm leading-relaxed">
              I can help you summarize notes, create flashcards, solve problems, and organize your captures.
            </p>
          </div>
        ) : (
          <>
            {messages.map((message, idx) => (
              <div
                key={idx}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-3xl px-5 py-3 ${
                    message.role === 'user'
                      ? 'bg-[var(--primary-blue)] text-white'
                      : 'bg-white border border-[var(--border-gray)] text-[var(--smart-gray)]'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-[var(--primary-blue)]" />
                      <span className="text-xs font-semibold text-[var(--primary-blue)]">AI Assistant</span>
                    </div>
                  )}
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-[var(--border-gray)] rounded-3xl px-5 py-3 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[var(--primary-blue)]" />
                  <span className="text-sm text-[var(--secondary-gray)]">Thinking...</span>
                </div>
              </div>
            )}
          </>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="px-6 pb-24 pt-4 bg-white border-t border-[var(--border-gray)]">
        <div className="flex gap-3 max-w-lg mx-auto">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything..."
            className="flex-1 h-12 rounded-full border-[var(--border-gray)] text-base px-5"
            disabled={loading}
          />
          <Button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="h-12 w-12 rounded-full bg-[var(--primary-blue)] hover:bg-blue-600 p-0 flex-shrink-0"
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