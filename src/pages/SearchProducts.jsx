import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";

export default function SearchProducts() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const slot = urlParams.get('slot');
  const [url, setUrl] = useState("https://www.google.com/search?q=");
  const iframeRef = useRef(null);

  const handleAddProduct = async () => {
    alert("Add product from current page - coming soon!");
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Top Black Bar */}
      <div className="bg-black px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div className="flex-1 bg-[#1F2937] rounded-lg px-3 py-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                window.open(url, '_blank');
              }
            }}
            placeholder="Enter URL or search..."
            className="w-full bg-transparent text-white text-sm focus:outline-none"
          />
        </div>
      </div>

      {/* Browser Content */}
      <div className="flex-1 bg-[#F3F4F6] flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-[#6B7280] mb-4">Browser view - Enter a URL above</p>
          <button
            onClick={() => window.open(url, '_blank')}
            className="px-6 py-2 bg-[#00A36C] text-white rounded-lg text-sm font-semibold"
          >
            Open in New Tab
          </button>
        </div>
      </div>

      {/* Bottom Black Bar */}
      <div className="bg-black px-6 py-4">
        <button
          onClick={handleAddProduct}
          className="w-full h-12 rounded-2xl bg-[#00A36C] hover:bg-[#007E52] text-white font-semibold flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>
    </div>
  );
}