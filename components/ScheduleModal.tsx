"use client";

import { useState } from "react";

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (date: string, time: string, platform: string) => void;
  content: string;
}

export default function ScheduleModal({
  isOpen,
  onClose,
  onConfirm,
  content,
}: ScheduleModalProps) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!date || !time) {
      alert("Please select a date and time");
      return;
    }
    setLoading(true);
    await onConfirm(date, time, platform);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 m-4 animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">📅 Schedule Post</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Content Preview */}
          <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600 max-h-32 overflow-y-auto">
            {content}
          </div>

          {/* Platform Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Platform
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {["Instagram", "TikTok", "Twitter", "Facebook", "LinkedIn", "Pinterest", "YouTube"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    platform === p
                      ? "bg-[#8bc53f] text-white shadow-md"
                      : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#8bc53f] focus:border-[#8bc53f]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#8bc53f] focus:border-[#8bc53f]"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1 py-2.5 bg-[#8bc53f] text-white font-bold rounded-lg hover:bg-[#77a933] shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Scheduling..." : "Confirm Schedule"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

