import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ChevronLeft, User, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EditProfile() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => { try { return await base44.auth.me(); } catch { return null; } }
  });

  const [name, setName] = useState(user?.full_name || '');
  const [bio, setBio] = useState('Shopping smarter, one scan at a time ✨');

  const updateProfileMutation = useMutation({
    mutationFn: async (data) => {
      return await base44.auth.updateMe(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      navigate(createPageUrl("Profile"));
    },
  });

  const handleSave = () => {
    updateProfileMutation.mutate({
      full_name: name,
      bio: bio
    });
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-24">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)}>
          <ChevronLeft className="w-6 h-6 text-[#1F2937]" />
        </button>
        <h1 className="text-base font-semibold text-[#1F2937]">Edit Profile</h1>
        <div className="w-6" />
      </div>

      <div className="px-6">
        {/* Profile Picture */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#A7F3D0] to-[#6EE7B7] flex items-center justify-center">
              {user?.full_name ? (
                <span className="text-2xl font-bold text-[#065F46]">
                  {user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </span>
              ) : (
                <User className="w-12 h-12 text-[#065F46]" />
              )}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#00A36C] flex items-center justify-center shadow-lg">
              <Camera className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Name Input */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-[#1F2937] mb-2 block">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full bg-white rounded-lg p-3 text-sm text-[#1F2937] border border-[#E5E7EB] focus:outline-none focus:border-[#00A36C] shadow-sm"
          />
        </div>

        {/* Bio Input */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-[#1F2937]">Bio</label>
            <span className="text-xs text-[#9CA3AF]">{bio.length}/150</span>
          </div>
          <textarea
            value={bio}
            onChange={(e) => {
              if (e.target.value.length <= 150) {
                setBio(e.target.value);
              }
            }}
            placeholder="Tell us about yourself..."
            rows="3"
            className="w-full bg-white rounded-lg p-3 text-sm text-[#1F2937] border border-[#E5E7EB] focus:outline-none focus:border-[#00A36C] resize-none shadow-sm"
          />
        </div>

        {/* Done Button */}
        <Button
          onClick={handleSave}
          disabled={updateProfileMutation.isPending}
          className="w-full h-12 rounded-lg bg-[#00A36C] hover:bg-[#007E52] text-white font-semibold shadow-md"
        >
          {updateProfileMutation.isPending ? 'Saving...' : 'Done'}
        </Button>
      </div>
    </div>
  );
}