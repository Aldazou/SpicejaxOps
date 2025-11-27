"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import MainLayout from "@/components/MainLayout";
import { useN8N } from "@/hooks/useN8N";
import { Sparkles, Calendar, CheckCircle2, Lightbulb, Clock, ArrowRight } from "lucide-react";

interface DashboardData {
  schedule?: any[];
  approvals?: any[];
  contentIdeas?: any[];
  metrics?: any[];
}

const defaultApprovals = [
  {
    title: "Birria Fiesta carousel copy",
    type: "Instagram Carousel",
    daysWaiting: 2,
  },
  {
    title: "Nashville Heat promo email",
    type: "Email",
    daysWaiting: 1,
  },
];

const defaultIdeas = [
  { title: "Taco Tuesday takeover", category: "Social" },
  { title: "Spice lab BTS reel", category: "Video" },
  { title: "Recipe collaboration", category: "Partnership" },
];

const quickActions = [
  { icon: Sparkles, label: "Image Lab", href: "/enhance", color: "from-purple-500 to-indigo-500" },
  { icon: Calendar, label: "Calendar", href: "/calendar", color: "from-blue-500 to-cyan-500" },
  { icon: CheckCircle2, label: "Approvals", href: "/content", color: "from-emerald-500 to-green-500" },
  { icon: Lightbulb, label: "Ideas", href: "/content", color: "from-amber-500 to-orange-500" },
];

export default function DashboardPage() {
  const { data, loading } = useN8N<DashboardData>("dashboard", {
    autoFetch: false,
  });

  const [localSchedule, setLocalSchedule] = useState<any[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("spicejax_schedule");
      if (stored) {
        setLocalSchedule(JSON.parse(stored));
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const scheduleItems = useMemo(() => {
    if (data?.schedule?.length) return data.schedule;
    if (localSchedule.length) return localSchedule;
    return [
      { time: "9:00 AM", task: "Prep Birria Fiesta reel", status: "upcoming" },
      { time: "11:30 AM", task: "Plan Nashville Heat drop", status: "upcoming" },
      { time: "2:00 PM", task: "Review influencer content", status: "upcoming" },
    ];
  }, [data?.schedule, localSchedule]);

  const approvals = data?.approvals?.length ? data.approvals : defaultApprovals;
  const ideas = data?.contentIdeas?.length ? data.contentIdeas : defaultIdeas;

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#8bc53f] to-[#6ba82a] flex items-center justify-center shadow-lg shadow-[#8bc53f]/20">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <p className="uppercase tracking-[0.3em] text-[10px] font-bold text-[#8bc53f]">
                Command Center
              </p>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"}
            </h1>
            <p className="text-gray-500 mt-1">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
          </div>
          
          {/* Quick Actions */}
          <div className="flex gap-2 flex-wrap">
            {quickActions.map((action) => (
              <Link
                key={action.href + action.label}
                href={action.href}
                className="group flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-2xl hover:border-[#8bc53f]/30 hover:shadow-lg hover:shadow-[#8bc53f]/10 transition-all duration-300"
              >
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-sm`}>
                  <action.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 hidden sm:inline">
                  {action.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Schedule */}
          <div className="lg:col-span-1 bg-white rounded-3xl border border-gray-100 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.06)] p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">Today</h2>
                  <p className="text-xs text-gray-400">{scheduleItems.length} items</p>
                </div>
              </div>
            </div>
            
            {loading ? (
              <div className="text-center py-10 text-gray-500">Loading...</div>
            ) : (
              <div className="space-y-3">
                {scheduleItems.map((item, index) => (
                  <div
                    key={`${item.task}-${index}`}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors group"
                  >
                    <div className="flex-shrink-0 w-12 text-center">
                      <p className="text-xs font-bold text-[#8bc53f]">{item.time?.split(" ")[0]}</p>
                      <p className="text-[10px] text-gray-400">{item.time?.split(" ")[1]}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{item.task}</p>
                    </div>
                    <span className="flex-shrink-0 w-2 h-2 rounded-full bg-[#8bc53f]"></span>
                  </div>
                ))}
              </div>
            )}
            
            <Link
              href="/calendar"
              className="mt-5 flex items-center justify-center gap-2 w-full py-3 rounded-2xl border border-[#8bc53f]/20 text-[#5a8c1a] font-semibold text-sm hover:bg-[#f8fdf3] transition-colors"
            >
              View Calendar
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Approvals */}
          <div className="lg:col-span-1 bg-white rounded-3xl border border-gray-100 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.06)] p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">Approvals</h2>
                  <p className="text-xs text-gray-400">{approvals.length} pending</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              {approvals.map((item, index) => (
                <div
                  key={`${item.title}-${index}`}
                  className="p-4 rounded-2xl border border-gray-100 hover:border-[#8bc53f]/30 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-900">{item.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.type}</p>
                    </div>
                    <span className="px-2 py-1 text-xs font-bold text-amber-600 bg-amber-50 rounded-lg">
                      {item.daysWaiting}d
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href="/content"
                      className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#8bc53f] to-[#7ab82f] text-center text-sm font-semibold text-white shadow-sm hover:shadow-md transition-shadow"
                    >
                      Approve
                    </Link>
                    <Link
                      href="/content"
                      className="flex-1 py-2 rounded-xl bg-gray-100 text-center text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      Review
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Content Ideas */}
          <div className="lg:col-span-1 bg-white rounded-3xl border border-gray-100 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.06)] p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">Content Queue</h2>
                  <p className="text-xs text-gray-400">{ideas.length} ideas</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              {ideas.map((idea, index) => (
                <div
                  key={`${idea.title}-${index}`}
                  className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors group"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{idea.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{idea.category}</p>
                  </div>
                  <Link
                    href="/content"
                    className="px-4 py-1.5 rounded-xl bg-[#8bc53f] text-white text-xs font-bold hover:bg-[#7ab82f] transition-colors shadow-sm"
                  >
                    Use
                  </Link>
                </div>
              ))}
            </div>
            
            <Link
              href="/content"
              className="mt-5 flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-gradient-to-r from-[#8bc53f] to-[#7ab82f] text-white font-semibold text-sm shadow-lg shadow-[#8bc53f]/20 hover:shadow-xl hover:shadow-[#8bc53f]/30 transition-all"
            >
              Generate Ideas
              <Sparkles className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Image Lab CTA */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 sm:p-10">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#8bc53f]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#8bc53f]/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Ready to create magic?
              </h3>
              <p className="text-gray-400 max-w-md">
                Transform your product shots with AI-powered scene generation. Pick a vibe, hit enhance.
              </p>
            </div>
            <Link
              href="/enhance"
              className="flex-shrink-0 inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#8bc53f] to-[#7ab82f] text-white font-bold text-lg rounded-2xl shadow-[0_8px_30px_-4px_rgba(139,197,63,0.5)] hover:shadow-[0_12px_40px_-4px_rgba(139,197,63,0.6)] hover:scale-105 transition-all"
            >
              <Sparkles className="w-5 h-5" />
              Open Image Lab
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
