import React from "react";
import { CheckSquare, BookOpen, Lightbulb, Sparkles, Calendar, Folder } from "lucide-react";

const iconMap = {
  CheckSquare,
  BookOpen,
  Lightbulb,
  Sparkles,
  Calendar,
  Folder
};

export default function FolderCard({ name, count, color, icon }) {
  const Icon = iconMap[icon] || Folder;

  return (
    <div 
      className="bg-white rounded-2xl p-5 border border-[var(--border-gray)] smooth-transition hover:scale-105 active:scale-95 card-shadow"
      style={{ width: '100%', height: '140px' }}
    >
      <div className="flex flex-col h-full justify-between">
        <div className="flex items-start justify-between">
          <div className={`${color} w-12 h-12 rounded-2xl flex items-center justify-center shadow-md`}>
            <Icon className="w-6 h-6 text-white" strokeWidth={2} />
          </div>
          <span className="text-2xl font-bold text-[var(--smart-gray)]">{count}</span>
        </div>
        <div>
          <h3 className="font-bold text-[var(--smart-gray)] text-sm mb-1">{name}</h3>
          <p className="text-xs text-[var(--secondary-gray)]">
            {count} {count === 1 ? 'item' : 'items'}
          </p>
        </div>
      </div>
    </div>
  );
}