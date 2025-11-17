import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(createPageUrl("Home"));
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F9FAFB] to-[#E5E7EB]">
      <style>{`
        @keyframes fadeInZoom {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        .logo-animation {
          animation: fadeInZoom 1.5s ease-out;
        }
      `}</style>

      <div className="text-center logo-animation">
        {/* Venn Diagram Logo - Green only */}
        <div className="relative w-32 h-32 mx-auto mb-6">
          <svg viewBox="0 0 120 120" className="w-full h-full">
            {/* Left egg - primary green */}
            <ellipse
              cx="45"
              cy="60"
              rx="30"
              ry="45"
              transform="rotate(45 45 60)"
              fill="#00A36C"
              opacity="0.9"
            />
            {/* Right egg - dark green */}
            <ellipse
              cx="75"
              cy="60"
              rx="30"
              ry="45"
              transform="rotate(135 75 60)"
              fill="#007E52"
              opacity="0.9"
            />
          </svg>
        </div>

        {/* ShopSmart Text */}
        <h1 className="text-4xl font-bold text-[#1F2937] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
          ShopSmart
        </h1>
        
        {/* Taglines */}
        <p className="text-lg text-[#6B7280] font-semibold mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Lens of the Future
        </p>
        <p className="text-sm text-[#6B7280] opacity-80">
          Shop Smart. Save Big.
        </p>
      </div>
    </div>
  );
}