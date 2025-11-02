import React from "react";
import { Settings, Bell, HelpCircle, FileText, Award, Heart, Tag, MapPin, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function More() {
  const menuItems = [
    { icon: Settings, label: "Settings", description: "App preferences", page: "Profile" },
    { icon: Bell, label: "Notifications", description: "Manage alerts" },
    { icon: Tag, label: "Deals & Offers", description: "Exclusive discounts" },
    { icon: MapPin, label: "Stores Near You", description: "Find nearby shops" },
    { icon: CreditCard, label: "Payment Methods", description: "Manage payments" },
    { icon: Heart, label: "Wishlist", description: "Saved items" },
    { icon: Award, label: "Rewards", description: "Loyalty program" },
    { icon: HelpCircle, label: "Help & Support", description: "Get assistance" },
    { icon: FileText, label: "Terms & Privacy", description: "Legal information" },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-8">
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <h1 className="text-2xl font-bold text-[#2E2E38] mb-1 border-b-2 border-[#5EE177] inline-block" style={{ fontFamily: 'Poppins, sans-serif' }}>
          More
        </h1>
      </div>

      {/* Menu Items */}
      <div className="px-6 space-y-2">
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          const content = (
            <div className="bg-white rounded-2xl p-4 border border-[#E4E8ED] shadow-sm hover:shadow-md transition-all flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#A8F3C1] to-[#FFD3E8] flex items-center justify-center flex-shrink-0">
                <Icon className="w-6 h-6 text-[#2E2E38]" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-[#2E2E38] text-sm" style={{ fontFamily: 'Nunito, sans-serif' }}>
                  {item.label}
                </h3>
                <p className="text-xs text-[#60656F]">{item.description}</p>
              </div>
            </div>
          );

          return item.page ? (
            <Link key={idx} to={createPageUrl(item.page)}>
              {content}
            </Link>
          ) : (
            <button key={idx} className="w-full text-left">
              {content}
            </button>
          );
        })}
      </div>

      {/* App Info */}
      <div className="px-6 mt-8">
        <div className="bg-gradient-to-r from-[#5EE177] to-[#FF8AC6] rounded-3xl p-6 text-center">
          <h3 className="text-white font-bold text-lg mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            SnapSmart
          </h3>
          <p className="text-white/90 text-sm mb-1">Version 1.0.0</p>
          <p className="text-white/80 text-xs">© 2025 SnapSmart. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}