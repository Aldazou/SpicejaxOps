"use client";

import { useState, useEffect } from "react";
import MainLayout from "@/components/MainLayout";
import Image from "next/image";

interface ScheduledPost {
  id: string;
  day: string;
  time: string;
  platform: string;
  content: string;
  image?: string;
  status: "scheduled" | "posted" | "draft";
}

export default function CalendarPage() {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);

  // Load schedule from LocalStorage on mount
  useEffect(() => {
    const savedSchedule = localStorage.getItem('spicejax_schedule');
    if (savedSchedule) {
      setScheduledPosts(JSON.parse(savedSchedule));
    }
  }, []);
  
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const getPostsForDay = (day: string) => {
    return scheduledPosts.filter((post) => post.day === day);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "Instagram":
        return "📸";
      case "TikTok":
        return "🎵";
      case "Twitter":
        return "🐦";
      case "Facebook":
        return "📘";
      case "LinkedIn":
        return "💼";
      case "Pinterest":
        return "📌";
      case "YouTube":
        return "▶️";
      default:
        return "📱";
    }
  };

  const handleClearSchedule = () => {
    if (confirm("Clear all scheduled posts? This cannot be undone.")) {
      localStorage.removeItem('spicejax_schedule');
      setScheduledPosts([]);
      setSelectedDay(null);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Content Calendar</h1>
            <p className="text-gray-500 mt-2">
              View and manage your scheduled posts for the week
            </p>
          </div>
          {scheduledPosts.length > 0 && (
            <button
              onClick={handleClearSchedule}
              className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors"
            >
              Clear All ({scheduledPosts.length})
            </button>
          )}
        </div>

        {/* Week Overview */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {days.map((day) => {
            const posts = getPostsForDay(day);
            const isSelected = selectedDay === day;
            
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(isSelected ? null : day)}
                className={`bg-white rounded-xl border-2 p-4 text-left transition-all ${
                  isSelected
                    ? "border-[#8bc53f] shadow-lg"
                    : "border-gray-200 hover:border-[#cfe7b1]"
                }`}
              >
                <div className="text-sm font-bold text-gray-500 mb-2">
                  {day}
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {posts.length}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {posts.length === 1 ? "post" : "posts"}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Day Details */}
        {selectedDay ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              📅 {selectedDay}'s Schedule
            </h2>

            <div className="space-y-4">
              {getPostsForDay(selectedDay).length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-6xl mb-4">🌙</p>
                  <p className="text-gray-500">No posts scheduled for {selectedDay}</p>
                </div>
              ) : (
                getPostsForDay(selectedDay).map((post) => (
                  <div
                    key={post.id}
                    className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Image */}
                    {post.image && (
                      <div className="relative w-full aspect-video bg-gray-100">
                        <Image
                          src={post.image}
                          alt="Post image"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{getPlatformIcon(post.platform)}</span>
                          <div>
                            <p className="font-bold text-gray-900">{post.platform}</p>
                            <p className="text-sm text-gray-500">{post.time}</p>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-[#eef7e2] text-[#4f7f00] text-xs font-bold rounded-full">
                          {post.status.toUpperCase()}
                        </span>
                      </div>

                      <p className="text-gray-700 mb-4 whitespace-pre-line">{post.content}</p>

                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-[#8bc53f] text-white font-medium rounded-lg hover:bg-[#77a933] transition-colors">
                          Edit
                        </button>
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">
                          Reschedule
                        </button>
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
            <p className="text-6xl mb-4">📆</p>
            <p className="text-gray-500 text-lg">
              Select a day to view scheduled posts
            </p>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500 mb-1">Total Scheduled</p>
            <p className="text-4xl font-bold text-gray-900">{scheduledPosts.length}</p>
            <p className="text-xs text-gray-400 mt-2">posts this week</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500 mb-1">Posted</p>
            <p className="text-4xl font-bold text-gray-900">
              {scheduledPosts.filter((p) => p.status === "posted").length}
            </p>
            <p className="text-xs text-gray-400 mt-2">this week</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500 mb-1">Drafts</p>
            <p className="text-4xl font-bold text-gray-900">
              {scheduledPosts.filter((p) => p.status === "draft").length}
            </p>
            <p className="text-xs text-gray-400 mt-2">ready to schedule</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

