import React, { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Camera, Upload, X, Loader2, Sparkles, ArrowLeft } from "lucide-react";
import CapturePreview from "../components/snap/CapturePreview";

export default function Snap() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const processCapture = async () => {
    if (!file) return;

    setProcessing(true);
    try {
      // Upload file
      const { file_url } = await base44.integrations.Core.UploadFile({ file });

      // Extract data using AI
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this document/image and extract key information. Provide:
        1. A descriptive title
        2. Content type (homework, notes, diagram, idea, reminder, project, or other)
        3. A brief summary (2-3 sentences)
        4. 3-5 relevant keywords
        5. Any due dates or deadlines mentioned (format: YYYY-MM-DD)
        6. Extract any text visible in the image
        
        Be thorough and accurate.`,
        file_urls: file_url,
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            content_type: { 
              type: "string",
              enum: ["homework", "notes", "diagram", "idea", "reminder", "project", "other"]
            },
            summary: { type: "string" },
            keywords: { type: "array", items: { type: "string" } },
            due_date: { type: "string" },
            extracted_text: { type: "string" }
          }
        }
      });

      setExtractedData({
        ...result,
        file_url,
        file_type: file.type.startsWith('image/') ? 'image' : file.type === 'application/pdf' ? 'pdf' : 'document'
      });

    } catch (error) {
      console.error("Error processing capture:", error);
      alert("Failed to process image. Please try again.");
    }
    setProcessing(false);
  };

  const handleSave = async (data) => {
    try {
      await base44.entities.Capture.create({
        title: data.title,
        content_type: data.content_type,
        file_url: data.file_url,
        file_type: data.file_type,
        ai_summary: data.summary,
        extracted_text: data.extracted_text,
        keywords: data.keywords || [],
        has_due_date: !!data.due_date,
        due_date: data.due_date || null,
        is_favorite: false
      });

      navigate(createPageUrl("Home"));
    } catch (error) {
      console.error("Error saving capture:", error);
      alert("Failed to save. Please try again.");
    }
  };

  if (extractedData) {
    return <CapturePreview data={extractedData} onSave={handleSave} onCancel={() => {
      setExtractedData(null);
      setFile(null);
      setPreview(null);
    }} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(createPageUrl("Home"))}
            className="rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-[var(--smart-gray)]">Snap & Capture</h1>
            <p className="text-sm text-[var(--secondary-gray)]">Take a photo or upload a file</p>
          </div>
        </div>
      </div>

      <div className="px-6 pb-8">
        {!preview ? (
          <div className="space-y-4">
            {/* Camera Capture */}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              ref={cameraInputRef}
              className="hidden"
            />
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="w-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 smooth-transition hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="flex flex-col items-center text-white">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                  <Camera className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold mb-2">Take Photo</h3>
                <p className="text-white/80 text-sm">Use your camera to capture notes</p>
              </div>
            </button>

            {/* File Upload */}
            <input
              type="file"
              accept="image/*,.pdf,.doc,.docx"
              onChange={handleFileSelect}
              ref={fileInputRef}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-white rounded-3xl p-8 border-2 border-[var(--border-gray)] smooth-transition hover:shadow-xl hover:border-[var(--electric-blue)]"
            >
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-[var(--light-blue)] rounded-full flex items-center justify-center mb-4">
                  <Upload className="w-10 h-10 text-[var(--electric-blue)]" />
                </div>
                <h3 className="text-xl font-bold text-[var(--smart-gray)] mb-2">Upload File</h3>
                <p className="text-[var(--secondary-gray)] text-sm">Choose from your device</p>
              </div>
            </button>

            {/* Info Card */}
            <div className="bg-[var(--light-blue)] rounded-3xl p-6 border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-xl">
                  <Sparkles className="w-5 h-5 text-[var(--electric-blue)]" />
                </div>
                <div>
                  <h4 className="font-bold text-[var(--smart-gray)] mb-1">AI-Powered Analysis</h4>
                  <p className="text-sm text-[var(--secondary-gray)] leading-relaxed">
                    Our AI will automatically analyze your capture, extract text, detect content type, and generate summaries.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Preview */}
            <div className="bg-white rounded-3xl p-6 border border-[var(--border-gray)]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[var(--smart-gray)]">Preview</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                  }}
                  className="rounded-xl"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="rounded-2xl overflow-hidden bg-gray-100 max-h-96">
                <img src={preview} alt="Preview" className="w-full h-full object-contain" />
              </div>
            </div>

            {/* Process Button */}
            <Button
              onClick={processCapture}
              disabled={processing}
              className="w-full bg-[var(--electric-blue)] hover:bg-blue-600 rounded-2xl h-14 text-base font-bold smooth-transition hover:shadow-xl"
            >
              {processing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Process with AI
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}