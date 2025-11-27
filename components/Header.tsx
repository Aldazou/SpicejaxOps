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
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-2xl border-b border-brand-gold/20">
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
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-brand-sage rounded-2xl border border-brand-gold/20 text-sm">
              <span className="text-brand-gold">📅</span>
              <span className="font-medium text-brand-text">{currentDate}</span>
            </div>
            
            {/* Status */}
            <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-spice-50 to-spice-100 rounded-2xl border border-brand-lime/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-lime opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-lime"></span>
              </span>
              <span className="text-sm font-semibold text-brand-title">Live</span>
            </div>
            
            {/* Avatar */}
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-lime to-brand-rust rounded-full blur opacity-40 group-hover:opacity-70 transition-opacity"></div>
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-brand-title to-brand-black rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg ring-2 ring-white group-hover:scale-105 transition-transform">
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
                    ? "bg-gradient-to-r from-brand-title to-brand-black text-white shadow-lg"
                    : "text-brand-text hover:text-brand-title hover:bg-brand-sage border border-transparent hover:border-brand-gold/20"
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
