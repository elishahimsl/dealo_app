import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";
import { FileText, Calendar, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function CaptureGrid({ captures, viewMode }) {
  if (viewMode === "list") {
    return (
      <div className="space-y-3">
        {captures.map((capture) => (
          <Link key={capture.id} to={`${createPageUrl("Preview")}?id=${capture.id}`}>
            <div className="bg-white rounded-2xl p-4 border border-[var(--border-gray)] smooth-transition hover:shadow-lg flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-[var(--light-blue)] border border-[var(--border-gray)] flex-shrink-0">
                {capture.file_url ? (
                  <img src={capture.file_url} alt={capture.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FileText className="w-6 h-6 text-[var(--electric-blue)]" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[var(--smart-gray)] text-sm line-clamp-1 mb-1">
                  {capture.title}
                </h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {capture.content_type}
                  </Badge>
                  <span className="text-xs text-[var(--secondary-gray)]">
                    {format(new Date(capture.created_date), "MMM d")}
                  </span>
                </div>
              </div>
              {capture.is_favorite && (
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 flex-shrink-0" />
              )}
            </div>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {captures.map((capture) => (
        <Link key={capture.id} to={`${createPageUrl("Preview")}?id=${capture.id}`}>
          <div className="bg-white rounded-3xl overflow-hidden border border-[var(--border-gray)] smooth-transition hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]">
            <div className="relative aspect-square bg-[var(--light-blue)]">
              {capture.file_url ? (
                <img src={capture.file_url} alt={capture.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FileText className="w-12 h-12 text-[var(--electric-blue)]" />
                </div>
              )}
              {capture.is_favorite && (
                <div className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-lg">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                </div>
              )}
              {capture.has_due_date && (
                <div className="absolute bottom-2 left-2 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Due
                </div>
              )}
            </div>
            <div className="p-3">
              <h3 className="font-bold text-[var(--smart-gray)] text-sm line-clamp-2 mb-1">
                {capture.title}
              </h3>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  {capture.content_type}
                </Badge>
                <span className="text-xs text-[var(--secondary-gray)]">
                  {format(new Date(capture.created_date), "MMM d")}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}