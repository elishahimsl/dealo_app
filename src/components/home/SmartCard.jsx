import React from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { FileText, Calendar, Star, Sparkles, BookOpen, Lightbulb, CheckSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const contentTypeConfig = {
  homework: { icon: CheckSquare, color: "bg-red-50 text-red-600 border-red-200" },
  notes: { icon: BookOpen, color: "bg-blue-50 text-blue-600 border-blue-200" },
  diagram: { icon: FileText, color: "bg-purple-50 text-purple-600 border-purple-200" },
  idea: { icon: Lightbulb, color: "bg-yellow-50 text-yellow-600 border-yellow-200" },
  reminder: { icon: Calendar, color: "bg-orange-50 text-orange-600 border-orange-200" },
  project: { icon: Star, color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  other: { icon: FileText, color: "bg-gray-50 text-gray-600 border-gray-200" },
};

export default function SmartCard({ capture }) {
  const config = contentTypeConfig[capture.content_type] || contentTypeConfig.other;
  const Icon = config.icon;

  return (
    <Link to={`${createPageUrl("Preview")}?id=${capture.id}`}>
      <div className="bg-white rounded-3xl p-5 border border-[var(--border-gray)] smooth-transition hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]">
        <div className="flex gap-4">
          {/* Thumbnail */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[var(--light-blue)] border-2 border-[var(--border-gray)]">
              {capture.file_url ? (
                <img 
                  src={capture.file_url} 
                  alt={capture.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FileText className="w-8 h-8 text-[var(--electric-blue)]" />
                </div>
              )}
            </div>
            {capture.is_favorite && (
              <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
                <Star className="w-3 h-3 text-white fill-white" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-bold text-[var(--smart-gray)] text-base line-clamp-1">
                {capture.title}
              </h3>
              <Badge className={`${config.color} border px-2 py-0.5 text-xs font-semibold`}>
                <Icon className="w-3 h-3 mr-1" />
                {capture.content_type}
              </Badge>
            </div>

            {capture.ai_summary && (
              <p className="text-sm text-[var(--secondary-gray)] line-clamp-2 mb-3 leading-relaxed">
                {capture.ai_summary}
              </p>
            )}

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1 text-xs text-[var(--secondary-gray)]">
                <Calendar className="w-3.5 h-3.5" />
                {format(new Date(capture.created_date), "MMM d")}
              </div>
              
              {capture.has_due_date && capture.due_date && (
                <Badge variant="outline" className="border-red-200 bg-red-50 text-red-600 text-xs px-2 py-0.5 font-semibold">
                  Due {format(new Date(capture.due_date), "MMM d")}
                </Badge>
              )}

              {capture.keywords && capture.keywords.length > 0 && (
                <div className="flex items-center gap-1">
                  {capture.keywords.slice(0, 2).map((keyword, idx) => (
                    <span key={idx} className="text-xs bg-[var(--light-blue)] text-[var(--electric-blue)] px-2 py-0.5 rounded-lg font-medium">
                      {keyword}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}