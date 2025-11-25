"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: "📊" },
  { name: "Content Studio", href: "/content", icon: "🎨" },
  { name: "Image Enhancer", href: "/enhance", icon: "✨" },
  { name: "Calendar", href: "/calendar", icon: "📅" },
  { name: "Chat Assistant", href: "/chat", icon: "💬" },
  { name: "Workflows", href: "/workflows", icon: "⚡" },
  { name: "Test Workflow", href: "/test", icon: "🧪" },
  { name: "Settings", href: "/settings", icon: "⚙️" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed left-0 top-0 h-screen w-72 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 border-r border-gray-800/50 backdrop-blur-xl">
      <div className="flex flex-col h-full p-6">
        {/* Logo */}
        <Link href="/dashboard" className="mb-8 group">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-spice-500 to-spice-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative w-14 h-14 bg-gradient-to-br from-spice-500 to-spice-600 rounded-2xl flex items-center justify-center text-3xl shadow-glow">
                🌶️
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                SpiceJax
              </h1>
              <p className="text-xs text-gray-400 font-medium tracking-wide">COMMAND CENTER</p>
            </div>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group relative flex items-center space-x-4 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-spice-500/20 to-spice-600/20 text-white shadow-inner-glow"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 w-1 h-8 bg-gradient-to-b from-spice-500 to-spice-600 rounded-r-full"></div>
                )}
                <span className="text-2xl transition-transform group-hover:scale-110">
                  {item.icon}
                </span>
                <span className="font-semibold text-sm">{item.name}</span>
                {isActive && (
                  <div className="absolute right-3 w-2 h-2 bg-spice-500 rounded-full animate-pulse"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Card */}
        <div className="mt-auto">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-spice-500/10 to-spice-600/10 border border-spice-500/20 p-4">
            <div className="absolute top-0 right-0 w-24 h-24 bg-spice-500/20 rounded-full blur-2xl"></div>
            <div className="relative">
              <div className="text-xs font-bold text-spice-400 mb-1">SpiceJax Seasonings</div>
              <div className="text-xs text-gray-400 space-y-0.5">
                <p className="flex items-center">
                  <span className="mr-2">📍</span>
                  Miami, FL
                </p>
                <p className="flex items-center">
                  <span className="mr-2">🌶️</span>
                  5 Signature Blends
                </p>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-700/50">
                <p className="text-xs text-gray-500">© 2025 SpiceJax</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
