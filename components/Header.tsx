"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: "📊" },
  { name: "Content Studio", href: "/content", icon: "🎨" },
  { name: "Image Enhancer", href: "/enhance", icon: "✨" },
  { name: "Library", href: "/library", icon: "bh" },
  { name: "Calendar", href: "/calendar", icon: "📅" },
  { name: "Chat Assistant", href: "/chat", icon: "💬" },
  { name: "Workflows", href: "/workflows", icon: "⚡" },
  { name: "Test Workflow", href: "/test", icon: "🧪" },
  { name: "Settings", href: "/settings", icon: "⚙️" },
];

export default function Header() {
  const [currentDate, setCurrentDate] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      setCurrentDate(now.toLocaleDateString("en-US", options));
    };
    updateDate();
    const interval = setInterval(updateDate, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b border-gray-200/50 shadow-sm">
      <div className="px-8 py-4 space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <Image
              src="/logo.svg"
              alt="SpiceJax"
              width={220}
              height={60}
              priority
              className="h-12 w-auto"
            />
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200/50 text-sm">
              <span className="text-xl">📅</span>
              <span className="font-semibold text-gray-700">
                {currentDate}
              </span>
            </div>
            <div className="hidden lg:flex items-center space-x-4 mr-4">
              <div className="px-4 py-2 bg-green-50 rounded-xl border border-green-100/50">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-green-700">
                    All Systems Operational
                  </span>
                </div>
              </div>
            </div>
            <div className="relative group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-spice-500 to-spice-600 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative w-11 h-11 bg-gradient-to-br from-spice-500 to-spice-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-white group-hover:scale-105 transition-transform">
                SJ
              </div>
            </div>
          </div>
        </div>

        {/* Top navigation */}
        <nav className="flex gap-2 overflow-x-auto no-scrollbar snap-x pb-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition snap-start sm:px-4 sm:py-2 sm:text-sm ${
                  isActive
                    ? "border-[#8bc53f] bg-[#8bc53f] text-white shadow"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span>{item.icon}</span>
                <span className="hidden sm:inline">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
