import React, { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Settings, History, Loader2, Sparkles, Camera as CameraIcon } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const [cameraReady, setCameraReady] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [file, setFile] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isMobile] = useState(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: isMobile ? 'environment' : 'user', width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraReady(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraReady(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !cameraReady) return;

    setScanning(true);

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);

    canvas.toBlob(async (blob) => {
      const capturedFile = new File([blob], `snap-${Date.now()}.jpg`, { type: 'image/jpeg' });
      
      try {
        // Upload and process
        const { file_url } = await base44.integrations.Core.UploadFile({ file: capturedFile });

        // Extract data using AI
        const result = await base44.integrations.Core.InvokeLLM({
          prompt: `Analyze this image/document and identify what it is. Provide:
          1. A descriptive title/name of the object or document
          2. Content type (homework, notes, diagram, idea, reminder, project, product, or other)
          3. A detailed description and key insights (2-3 sentences)
          4. 3-5 relevant keywords or tags
          5. Any due dates or important dates mentioned (format: YYYY-MM-DD)
          6. Extract any visible text
          7. Smart tips or recommendations based on what you see
          
          Be thorough and provide actionable insights.`,
          file_urls: file_url,
          response_json_schema: {
            type: "object",
            properties: {
              title: { type: "string" },
              content_type: { 
                type: "string",
                enum: ["homework", "notes", "diagram", "idea", "reminder", "project", "product", "other"]
              },
              description: { type: "string" },
              smart_tips: { type: "string" },
              keywords: { type: "array", items: { type: "string" } },
              due_date: { type: "string" },
              extracted_text: { type: "string" },
              brand: { type: "string" },
              model: { type: "string" }
            }
          }
        });

        // Save to database
        const capture = await base44.entities.Capture.create({
          title: result.title || "Untitled Scan",
          content_type: result.content_type || "other",
          file_url,
          file_type: 'image',
          ai_summary: result.description || result.smart_tips || "",
          extracted_text: result.extracted_text || "",
          keywords: result.keywords || [],
          has_due_date: !!result.due_date,
          due_date: result.due_date || null,
          is_favorite: false
        });

        // Navigate to results
        navigate(`${createPageUrl("Preview")}?id=${capture.id}&new=true`);
      } catch (error) {
        console.error("Error processing scan:", error);
        alert("Failed to process image. Please try again.");
      }
      
      setScanning(false);
    }, 'image/jpeg', 0.9);
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setScanning(true);

    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file: selectedFile });

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this image/document and identify what it is. Provide:
        1. A descriptive title/name of the object or document
        2. Content type (homework, notes, diagram, idea, reminder, project, product, or other)
        3. A detailed description and key insights (2-3 sentences)
        4. 3-5 relevant keywords or tags
        5. Any due dates or important dates mentioned (format: YYYY-MM-DD)
        6. Extract any visible text
        7. Smart tips or recommendations based on what you see`,
        file_urls: file_url,
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            content_type: { 
              type: "string",
              enum: ["homework", "notes", "diagram", "idea", "reminder", "project", "product", "other"]
            },
            description: { type: "string" },
            smart_tips: { type: "string" },
            keywords: { type: "array", items: { type: "string" } },
            due_date: { type: "string" },
            extracted_text: { type: "string" }
          }
        }
      });

      const capture = await base44.entities.Capture.create({
        title: result.title || "Untitled Scan",
        content_type: result.content_type || "other",
        file_url,
        file_type: selectedFile.type.startsWith('image/') ? 'image' : 'pdf',
        ai_summary: result.description || result.smart_tips || "",
        extracted_text: result.extracted_text || "",
        keywords: result.keywords || [],
        has_due_date: !!result.due_date,
        due_date: result.due_date || null,
        is_favorite: false
      });

      navigate(`${createPageUrl("Preview")}?id=${capture.id}&new=true`);
    } catch (error) {
      console.error("Error processing file:", error);
      alert("Failed to process file. Please try again.");
    }
    
    setScanning(false);
  };

  return (
    <div className="relative h-screen w-screen bg-black overflow-hidden">
      {/* Camera Video Feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay Text (top center) */}
      {!scanning && (
        <div className="absolute top-8 left-0 right-0 text-center z-10 px-6">
          <p className="text-white text-sm font-medium drop-shadow-lg">
            Point your camera at an object or document
          </p>
        </div>
      )}

      {/* Top Navigation */}
      <div className="absolute top-0 left-0 right-0 z-20 pt-12 px-6 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(createPageUrl("Library"))}
          className="rounded-full bg-black/30 backdrop-blur-md hover:bg-black/50 border border-white/20"
        >
          <History className="w-5 h-5 text-white" />
        </Button>
        
        <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
          <Sparkles className="w-4 h-4 text-[#00FF88]" />
          <span className="text-white text-sm font-semibold">SnapSmart</span>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(createPageUrl("AIAssistant"))}
          className="rounded-full bg-black/30 backdrop-blur-md hover:bg-black/50 border border-white/20"
        >
          <Settings className="w-5 h-5 text-white" />
        </Button>
      </div>

      {/* Scanning Overlay */}
      {scanning && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-30 flex flex-col items-center justify-center">
          <div className="relative">
            {/* Pulsing radar animation */}
            <div className="w-32 h-32 rounded-full border-4 border-[#00FF88] animate-ping absolute inset-0" />
            <div className="w-32 h-32 rounded-full border-4 border-[#00FF88] flex items-center justify-center relative">
              <Loader2 className="w-16 h-16 text-[#00FF88] animate-spin" />
            </div>
          </div>
          <p className="text-white text-lg font-semibold mt-8 animate-pulse">Scanning...</p>
          <p className="text-white/70 text-sm mt-2">Analyzing your photo with AI</p>
        </div>
      )}

      {/* Bottom Controls */}
      {!scanning && (
        <div className="absolute bottom-0 left-0 right-0 pb-12 px-6 z-20">
          <div className="flex items-center justify-center gap-8">
            {/* Upload from gallery button */}
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileSelect}
              ref={fileInputRef}
              className="hidden"
            />
            <button
              onClick={handleFileUpload}
              className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/30 flex items-center justify-center smooth-transition hover:bg-white/30 active:scale-90"
            >
              <CameraIcon className="w-6 h-6 text-white" />
            </button>

            {/* Main Snap Button - BIG circular button */}
            <button
              onClick={capturePhoto}
              disabled={!cameraReady}
              className="w-24 h-24 rounded-full bg-gradient-to-r from-[#00FF88] to-[#00D9FF] shadow-2xl shadow-cyan-500/50 flex flex-col items-center justify-center smooth-transition hover:scale-110 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
            >
              <Sparkles className="w-8 h-8 text-white mb-1" strokeWidth={2.5} />
              <span className="text-white text-xs font-bold">SNAP</span>
            </button>

            {/* AI Assistant quick access */}
            <button
              onClick={() => navigate(createPageUrl("AIAssistant"))}
              className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/30 flex items-center justify-center smooth-transition hover:bg-white/30 active:scale-90"
            >
              <Sparkles className="w-6 h-6 text-[#00FF88]" />
            </button>
          </div>

          {!cameraReady && (
            <p className="text-white text-sm text-center mt-4">
              Requesting camera access...
            </p>
          )}
        </div>
      )}
    </div>
  );
}