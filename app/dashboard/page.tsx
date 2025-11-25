"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import MainLayout from "@/components/MainLayout";
import DashboardCard from "@/components/DashboardCard";
import { useN8N } from "@/hooks/useN8N";

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
];

const quickActions = [
  { icon: "🪄", label: "Image Lab", href: "/enhance" },
  { icon: "📝", label: "Content Studio", href: "/content" },
  { icon: "📅", label: "Calendar", href: "/calendar" },
  { icon: "⚡", label: "Workflows", href: "/workflows" },
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
    ];
  }, [data?.schedule, localSchedule]);

  const approvals = data?.approvals?.length ? data.approvals : defaultApprovals;
  const ideas = data?.contentIdeas?.length ? data.contentIdeas : defaultIdeas;
  const activityItems = useMemo(() => {
    const upcoming = scheduleItems.slice(0, 2).map((item) => ({
      label: item.task,
      meta: item.time,
      badge: "Schedule",
    }));
    const approvalEvents = approvals.slice(0, 2).map((item) => ({
      label: item.title,
      meta: item.type,
      badge: "Approval",
    }));
    return [...upcoming, ...approvalEvents];
  }, [scheduleItems, approvals]);

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Slim header */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
            <p className="uppercase tracking-[0.4em] text-xs text-gray-400">
              SpiceJax
            </p>
            <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
              </div>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action) => (
              <Link
                key={`chip-${action.href}`}
                href={action.href}
                aria-label={action.label}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#8bc53f] text-white text-xl shadow hover:bg-[#77a933] transition"
              >
                <span>{action.icon}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* Column 1 */}
          <div className="space-y-6 col-span-1 xl:col-span-1">
            <DashboardCard title="Today" icon="📅">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-2">
                {new Date().toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            {loading ? (
                <div className="text-center py-10 text-gray-500">Loading...</div>
              ) : scheduleItems.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  No scheduled items for today
                </div>
            ) : (
              <div className="space-y-3">
                  {scheduleItems.map((item, index) => (
                <div
                      key={`${item.task}-${index}`}
                      className="flex items-center justify-between rounded-2xl border border-gray-200 px-4 py-3 hover:border-gray-300 transition"
                >
                      <div className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-[#4f7f00]" />
                    <div>
                          <p className="font-semibold text-gray-900">{item.task}</p>
                      <p className="text-sm text-gray-500">{item.time}</p>
                    </div>
                  </div>
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#eef7e2] text-[#4f7f00] capitalize">
                        {item.status || "upcoming"}
                  </span>
                  </div>
                ))}
              </div>
            )}
              <Link
                href="/calendar"
                className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-[#8bc53f] py-2 text-sm font-semibold text-[#4f7f00] hover:bg-[#f3fbe3] transition"
              >
                Open calendar
              </Link>
          </DashboardCard>

            <DashboardCard title="Approvals" icon="✅">
              <div className="space-y-4">
                {approvals.map((item, index) => (
                  <div
                    key={`${item.title}-${index}`}
                    className="rounded-2xl border border-gray-200 p-4 hover:border-gray-300 transition"
                >
                  <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{item.title}</p>
                        <p className="text-xs text-gray-500">{item.type}</p>
                    </div>
                      <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                      {item.daysWaiting}d
                    </span>
                  </div>
                    <div className="mt-3 flex gap-2">
                      <Link
                        href="/content"
                        className="flex-1 rounded-lg bg-[#8bc53f] py-1.5 text-center text-sm font-semibold text-white hover:bg-[#77a933] transition"
                      >
                      Approve
                      </Link>
                      <Link
                        href="/content"
                        className="flex-1 rounded-lg bg-gray-100 py-1.5 text-center text-sm font-semibold text-gray-700 hover:bg-gray-200 transition"
                      >
                      Review
                      </Link>
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>
          </div>

          {/* Column 2 */}
          <div className="space-y-6 col-span-1 xl:col-span-1">
            <DashboardCard title="Content queue" icon="✨">
              <p className="text-sm text-gray-500">
                Pull fresh hooks or captions without leaving the dashboard.
              </p>
              <div className="space-y-3 mt-3">
                {ideas.map((idea, index) => (
                  <div
                    key={`${idea.title}-${index}`}
                    className="rounded-2xl border border-gray-200 p-3 flex items-center justify-between hover:border-gray-300 transition"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{idea.title}</p>
                      <p className="text-xs text-gray-500">{idea.category}</p>
                    </div>
                    <Link
                      href="/content"
                      className="rounded-full bg-[#8bc53f] text-white px-3 py-1 text-xs font-semibold hover:bg-[#77a933] transition"
                    >
                      Use
                    </Link>
                  </div>
                ))}
              </div>
              <Link
                href="/content"
                className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-[#8bc53f] py-2.5 text-sm font-semibold text-white hover:bg-[#77a933] transition"
              >
                Generate new ideas
              </Link>
            </DashboardCard>

            <DashboardCard title="Image Lab" icon="🪄">
              <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-5 text-center">
                <p className="text-sm text-gray-500">
                  Need a refreshed hero shot? Jump straight into the enhancer with the
                  latest scene presets.
                </p>
                <Link
                  href="/enhance"
                  className="mt-3 inline-flex items-center justify-center rounded-xl bg-[#8bc53f] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#77a933] transition"
                >
                  Open Image Lab
                </Link>
            </div>
          </DashboardCard>
          </div>

          {/* Column 3 */}
          <div className="space-y-6 col-span-1 xl:col-span-1">
            <DashboardCard title="Activity" icon="🕒">
              <div className="space-y-3">
                {activityItems.map((event, index) => (
                  <div
                    key={`${event.label}-${index}`}
                    className="rounded-2xl border border-gray-200 px-4 py-3 flex items-center justify-between hover:border-gray-300 transition"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{event.label}</p>
                      <p className="text-xs text-gray-500">{event.meta}</p>
                    </div>
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#eef7e2] text-[#4f7f00]">
                      {event.badge}
                    </span>
                  </div>
                ))}
                {activityItems.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-10">
                    Nothing logged yet. Approvals and schedule updates will show here.
                  </p>
                )}
            </div>
          </DashboardCard>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

