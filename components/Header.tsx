"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: "📊" },
  { name: "Content Studio", href: "/content", icon: "🎨" },
  { name: "Image Enhancer", href: "/enhance", icon: "✨" },
  { name: "Library", href: "/library", icon: "🖼️" },
  { name: "Calendar", href: "/calendar", icon: "📅" },
  { name: "Chat Assistant", href: "/chat", icon: "💬" },
  { name: "Workflows", href: "/workflows", icon: "⚡" },
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
        month: "short",
        day: "numeric",
      };
      setCurrentDate(now.toLocaleDateString("en-US", options));
    };
    updateDate();
    const interval = setInterval(updateDate, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-2xl border-b border-gray-100">
      <div className="px-4 sm:px-8 py-3 sm:py-4">
        {/* Top row */}
        <div className="flex items-center justify-between gap-4 mb-4">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <Image
              src="/logo.svg"
              alt="SpiceJax"
              width={180}
              height={48}
              priority
              className="h-10 sm:h-12 w-auto transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Date pill */}
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-2xl border border-gray-100 text-sm">
              <span className="text-gray-400">📅</span>
              <span className="font-medium text-gray-600">{currentDate}</span>
            </div>
            
            {/* Status */}
            <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#f0f9e8] to-[#e8f5db] rounded-2xl border border-[#d4ebc4]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8bc53f] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8bc53f]"></span>
              </span>
              <span className="text-sm font-semibold text-[#5a8c1a]">Live</span>
            </div>
            
            {/* Avatar */}
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#8bc53f] to-[#a8d96a] rounded-full blur opacity-40 group-hover:opacity-70 transition-opacity"></div>
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-[#8bc53f] to-[#6ba82a] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg ring-2 ring-white group-hover:scale-105 transition-transform">
                SJ
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar snap-x pb-1 -mx-1 px-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`inline-flex items-center gap-1.5 sm:gap-2 rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-semibold transition-all duration-300 snap-start whitespace-nowrap ${
                  isActive
                    ? "bg-gradient-to-r from-[#8bc53f] to-[#7ab82f] text-white shadow-[0_4px_20px_-4px_rgba(139,197,63,0.5)]"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <span className="text-base sm:text-lg">{item.icon}</span>
                <span className="hidden sm:inline">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
