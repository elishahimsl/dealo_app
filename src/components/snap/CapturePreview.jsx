import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, X, Sparkles } from "lucide-react";

const contentTypes = [
  { value: "homework", label: "Homework" },
  { value: "notes", label: "Notes" },
  { value: "diagram", label: "Diagram" },
  { value: "idea", label: "Idea" },
  { value: "reminder", label: "Reminder" },
  { value: "project", label: "Project" },
  { value: "other", label: "Other" },
];

export default function CapturePreview({ data, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: data.title || "",
    content_type: data.content_type || "other",
    summary: data.summary || "",
    keywords: data.keywords || [],
    due_date: data.due_date || "",
    extracted_text: data.extracted_text || "",
    file_url: data.file_url,
    file_type: data.file_type
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 px-6 pt-12 pb-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[var(--smart-gray)] mb-1">Review & Edit</h1>
            <p className="text-sm text-[var(--secondary-gray)]">AI has analyzed your capture</p>
          </div>
          <div className="flex items-center gap-2 bg-[var(--light-blue)] px-4 py-2 rounded-full">
            <Sparkles className="w-4 h-4 text-[var(--electric-blue)]" />
            <span className="text-sm font-semibold text-[var(--electric-blue)]">AI Generated</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Preview Image */}
          <div className="bg-white rounded-3xl p-6 border border-[var(--border-gray)]">
            <div className="rounded-2xl overflow-hidden bg-gray-100 max-h-64">
              <img src={formData.file_url} alt="Capture" className="w-full h-full object-contain" />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-semibold text-[var(--smart-gray)]">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="rounded-xl border-[var(--border-gray)] h-12 text-base"
              placeholder="Enter a title..."
              required
            />
          </div>

          {/* Content Type */}
          <div className="space-y-2">
            <Label htmlFor="content_type" className="text-sm font-semibold text-[var(--smart-gray)]">Content Type</Label>
            <Select value={formData.content_type} onValueChange={(value) => setFormData({ ...formData, content_type: value })}>
              <SelectTrigger className="rounded-xl border-[var(--border-gray)] h-12 text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {contentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Summary */}
          <div className="space-y-2">
            <Label htmlFor="summary" className="text-sm font-semibold text-[var(--smart-gray)]">AI Summary</Label>
            <Textarea
              id="summary"
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="rounded-xl border-[var(--border-gray)] min-h-24 text-base resize-none"
              placeholder="AI will generate a summary..."
            />
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="due_date" className="text-sm font-semibold text-[var(--smart-gray)]">Due Date (Optional)</Label>
            <Input
              id="due_date"
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              className="rounded-xl border-[var(--border-gray)] h-12 text-base"
            />
          </div>

          {/* Keywords */}
          {formData.keywords && formData.keywords.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-[var(--smart-gray)]">Keywords</Label>
              <div className="flex flex-wrap gap-2">
                {formData.keywords.map((keyword, idx) => (
                  <span 
                    key={idx}
                    className="bg-[var(--light-blue)] text-[var(--electric-blue)] px-4 py-2 rounded-xl text-sm font-semibold"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Extracted Text */}
          {formData.extracted_text && (
            <div className="bg-[var(--light-blue)] rounded-2xl p-4 border border-blue-200">
              <Label className="text-sm font-semibold text-[var(--smart-gray)] mb-2 block">Extracted Text</Label>
              <p className="text-sm text-[var(--secondary-gray)] leading-relaxed">
                {formData.extracted_text}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 h-12 rounded-xl font-semibold border-2"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 rounded-xl font-semibold bg-[var(--electric-blue)] hover:bg-blue-600"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Capture
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}