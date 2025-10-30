import React from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { FileText, Calendar, Sparkles, BookOpen, Lightbulb, CheckSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const contentTypeConfig = {
  homework: { icon: CheckSquare, color: "bg-red-50 text-red-600 border-red-200" },
  notes: { icon: BookOpen, color: "bg-blue-50 text-blue-600 border-blue-200" },
  diagram: { icon: FileText, color: "bg-purple-50 text-purple-600 border-purple-200" },
  idea: { icon: Lightbulb, color: "bg-yellow-50 text-yellow-600 border-yellow-200" },
  reminder: { icon: Calendar, color: "bg-orange-50 text-orange-600 border-orange-200" },
  project: { icon: Sparkles, color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  other: { icon: FileText, color: "bg-gray-50 text-gray-600 border-gray-200" },
};

export default function SmartCard({ capture }) {
  const config = contentTypeConfig[capture.content_type] || contentTypeConfig.other;
  const Icon = config.icon;

  return (
    <div className="bg-white rounded-2xl p-4 border border-[var(--border-gray)] smooth-transition hover:shadow-lg card-shadow w-[90%] mx-auto" style={{ minHeight: '180px' }}>
      <div className="flex gap-4 h-full">
        {/* Thumbnail on left */}
        <Link to={`${createPageUrl("Preview")}?id=${capture.id}`} className="flex-shrink-0">
          <div className="w-24 h-24 rounded-lg overflow-hidden bg-[var(--secondary-blue)] border border-[var(--border-gray)]">
            {capture.file_url ? (
              <img 
                src={capture.file_url} 
                alt={capture.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FileText className="w-8 h-8 text-[var(--primary-blue)]" />
              </div>
            )}
          </div>
        </Link>

        {/* Right column: Title, tags, summary, buttons */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <Link to={`${createPageUrl("Preview")}?id=${capture.id}`}>
              <h3 className="font-bold text-[var(--smart-gray)] text-base line-clamp-1 mb-2">
                {capture.title}
              </h3>
            </Link>

            {/* Tags (pills) */}
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge className={`${config.color} border text-xs font-semibold px-2 py-0.5`}>
                {capture.content_type}
              </Badge>
              {capture.has_due_date && capture.due_date && (
                <Badge variant="outline" className="border-red-200 bg-red-50 text-red-600 text-xs px-2 py-0.5 font-semibold">
                  Due {format(new Date(capture.due_date), "MMM d")}
                </Badge>
              )}
            </div>

            {/* 2-line summary */}
            {capture.ai_summary && (
              <p className="text-sm text-[var(--secondary-gray)] line-clamp-2 mb-3 leading-relaxed">
                {capture.ai_summary}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <Link to={`${createPageUrl("Preview")}?id=${capture.id}`} className="flex-1">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full rounded-full h-8 text-xs font-semibold border-[var(--primary-blue)] text-[var(--primary-blue)] hover:bg-[var(--secondary-blue)]"
              >
                View
              </Button>
            </Link>
            <Link to={`${createPageUrl("Preview")}?id=${capture.id}`} className="flex-1">
              <Button 
                size="sm" 
                className="w-full rounded-full h-8 text-xs font-semibold bg-[var(--primary-blue)] hover:bg-blue-600"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                Flashcards
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}