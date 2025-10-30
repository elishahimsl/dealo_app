import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function QuickActionCard({ action }) {
  const Icon = action.icon;
  
  return (
    <Link to={createPageUrl(action.page)}>
      <div className="bg-white rounded-2xl p-4 border border-[var(--border-gray)] smooth-transition hover:shadow-lg hover:scale-105 active:scale-95">
        <div className={`${action.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-3 mx-auto shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <p className="text-xs font-semibold text-center text-[var(--smart-gray)]">
          {action.label}
        </p>
      </div>
    </Link>
  );
}