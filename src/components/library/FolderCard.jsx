import React from "react";
import { CheckSquare, BookOpen, Lightbulb, Star, Calendar, Folder } from "lucide-react";

const iconMap = {
  CheckSquare,
  BookOpen,
  Lightbulb,
  Star,
  Calendar,
  Folder
};

export default function FolderCard({ name, count, color, icon }) {
  const Icon = iconMap[icon] || Folder;

  return (
    <div className="bg-white rounded-3xl p-5 border border-[var(--border-gray)] smooth-transition hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]">
      <div className="flex items-start justify-between mb-3">
        <div className={`${color} w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-bold text-[var(--smart-gray)]">{count}</span>
      </div>
      <h3 className="font-bold text-[var(--smart-gray)] text-base">{name}</h3>
      <p className="text-xs text-[var(--secondary-gray)] mt-1">
        {count} {count === 1 ? 'item' : 'items'}
      </p>
    </div>
  );
}