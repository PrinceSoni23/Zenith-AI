"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useLanguage } from "@/context/LanguageContext";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  BookOpen,
  Bell,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ParentSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const navItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      href: "/parent",
      active: pathname === "/parent",
    },
    {
      icon: Users,
      label: "My Children",
      href: "/parent/children",
      active: pathname === "/parent/children",
    },
    {
      icon: BarChart3,
      label: "Analytics",
      href: "/parent/analytics",
      active: pathname === "/parent/analytics",
    },
    {
      icon: Bell,
      label: "Notifications",
      href: "/parent/notifications",
      active: pathname === "/parent/notifications",
    },
    {
      icon: Settings,
      label: "Settings",
      href: "/parent/settings",
      active: pathname === "/parent/settings",
    },
  ];

  return (
    <>
      {/* Mobile menu toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl transition-all hover:scale-110 active:scale-95"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:relative w-64 h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white transition-transform duration-300 z-40 flex flex-col shadow-2xl border-r border-slate-800/50`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-800/30">
          <Link
            href="/parent"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white">ParentHub</h1>
              <p className="text-xs text-slate-400">Portal</p>
            </div>
          </Link>
        </div>

        {/* User Section */}
        <div className="p-5 mx-3 my-3 rounded-lg bg-slate-800/40 border border-slate-700/30 hover:bg-slate-800/60 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-semibold text-sm">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-100 truncate">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 space-y-2 overflow-y-auto px-3">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group
                ${
                  item.active
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
                }
              `}
            >
              <item.icon
                className={`w-5 h-5 transition-transform ${item.active ? "" : "group-hover:scale-110"}`}
              />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-700/30 to-transparent" />

        {/* Footer */}
        <div className="p-3 space-y-2">
          {/* Language Selector */}
          <select
            value={language}
            onChange={e =>
              setLanguage(e.target.value as "english" | "hinglish" | "hindi")
            }
            className="w-full flex items-center px-4 py-2.5 rounded-lg bg-slate-800/30 text-slate-300 border border-slate-700/30 hover:bg-slate-800/60 transition-all cursor-pointer text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            title="Select language"
          >
            <option value="english">🇬🇧 English</option>
            <option value="hinglish">🇮🇳 Hinglish</option>
            <option value="hindi">हिंदी (Hindi)</option>
          </select>

          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 transition-all group"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-medium text-sm">Back Home</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all group"
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
