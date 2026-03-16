"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import clsx from "clsx";
import {
  LayoutDashboard,
  Brain,
  Camera,
  Calendar,
  BookOpen,
  RefreshCw,
  PenTool,
  Calculator,
  HelpCircle,
  MessageSquare,
  Users,
  Trophy,
  LogOut,
  Sun,
  Moon,
  Zap,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";

const modules = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/power-hour", icon: Zap, label: "Power Hour" },
  {
    href: "/dashboard/class-translator",
    icon: Brain,
    label: "Understand Class",
  },
  { href: "/dashboard/smart-notes", icon: Camera, label: "Vision Lens" },
  { href: "/dashboard/study-planner", icon: Calendar, label: "Study Planner" },
  { href: "/dashboard/story-mode", icon: BookOpen, label: "Story Mode" },
  { href: "/dashboard/revision", icon: RefreshCw, label: "Auto Revision" },
  { href: "/dashboard/writing-coach", icon: PenTool, label: "Writing Coach" },
  { href: "/dashboard/maths-helper", icon: Calculator, label: "Maths Helper" },
  {
    href: "/dashboard/question-generator",
    icon: HelpCircle,
    label: "Question Bank",
  },
  { href: "/dashboard/mentor", icon: MessageSquare, label: "AI Mentor" },
  { href: "/dashboard/parent", icon: Users, label: "Parent Dashboard" },
  { href: "/dashboard/leaderboard", icon: Trophy, label: "Leaderboard" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside
      className={clsx(
        "hidden lg:flex flex-col h-screen sticky top-0 transition-all duration-300 flex-shrink-0",
        collapsed ? "w-[68px]" : "w-60",
        "bg-white dark:bg-dark-900 border-r border-slate-200 dark:border-dark-700",
      )}
    >
      {/* Logo + Collapse */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-200 dark:border-dark-700">
        <Link
          href="/dashboard"
          className={clsx(
            "flex items-center gap-2.5 group",
            collapsed && "justify-center w-full",
          )}
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center flex-shrink-0 transition-all">
            <Zap className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <div>
              <p className="font-black text-sm leading-none text-slate-900 dark:text-slate-100">
                Zen<span className="gradient-text">ith</span>
              </p>
              <p className="text-[10px] mt-0.5 text-slate-500 dark:text-slate-400">
                Learning Companion
              </p>
            </div>
          )}
        </Link>
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="w-6 h-6 rounded-lg flex items-center justify-center transition-colors text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-dark-800"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Expand button when collapsed */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="mx-auto mt-2 w-8 h-8 rounded-xl flex items-center justify-center transition-colors text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-dark-800"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* User Info - Clickable to Profile */}
      {!collapsed && (
        <Link
          href="/dashboard/profile"
          className="block px-4 py-3 border-b border-slate-200 dark:border-dark-700 hover:bg-slate-50 dark:hover:bg-dark-800 transition-colors"
        >
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center text-white font-bold text-sm flex-shrink-0 group-hover:scale-110 transition-transform">
              {user?.name?.[0]?.toUpperCase() || "S"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate text-slate-900 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {user?.name || "Student"}
              </p>
              <p className="text-xs capitalize text-slate-500 dark:text-slate-400">
                {user?.role || "student"}
              </p>
            </div>
          </div>
        </Link>
      )}
      {collapsed && (
        <Link
          href="/dashboard/profile"
          className="flex justify-center py-3 border-b border-slate-200 dark:border-dark-700 hover:bg-slate-50 dark:hover:bg-dark-800 transition-colors"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center text-white font-bold text-sm hover:scale-110 transition-transform cursor-pointer">
            {user?.name?.[0]?.toUpperCase() || "S"}
          </div>
        </Link>
      )}

      {/* Nav Links */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-0.5">
        {modules.map((mod, idx) => {
          const isActive = pathname === mod.href;
          return (
            <Link
              key={mod.href}
              href={mod.href}
              title={collapsed ? mod.label : undefined}
              style={{ animationDelay: `${idx * 40}ms` }}
              className={clsx(
                "flex items-center rounded-xl text-sm font-medium transition-all duration-150 group animate-slide-right",
                collapsed
                  ? "justify-center w-10 h-10 mx-auto"
                  : "gap-3 px-3 py-2.5",
                isActive ? "sidebar-link-active" : "sidebar-link",
              )}
            >
              <mod.icon
                className={clsx(
                  "flex-shrink-0 transition-colors",
                  collapsed ? "w-5 h-5" : "w-4 h-4",
                  isActive
                    ? "text-primary-500 dark:text-primary-400"
                    : "text-slate-400 group-hover:text-primary-500",
                )}
              />
              {!collapsed && <span>{mod.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Controls */}
      <div className="px-2 pb-4 pt-2 border-t border-slate-200 dark:border-dark-700 space-y-1">
        {/* Dark mode toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={clsx(
              "w-full flex items-center rounded-xl text-sm font-medium transition-all duration-150",
              collapsed
                ? "justify-center w-10 h-10 mx-auto"
                : "gap-3 px-3 py-2.5",
              "sidebar-link",
            )}
            title={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {theme === "dark" ? (
              <Sun
                className={clsx(
                  "flex-shrink-0",
                  collapsed ? "w-5 h-5" : "w-4 h-4",
                )}
              />
            ) : (
              <Moon
                className={clsx(
                  "flex-shrink-0",
                  collapsed ? "w-5 h-5" : "w-4 h-4",
                )}
              />
            )}
            {!collapsed && (
              <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
            )}
          </button>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={clsx(
            "w-full flex items-center rounded-xl text-sm font-medium transition-all duration-150",
            collapsed
              ? "justify-center w-10 h-10 mx-auto"
              : "gap-3 px-3 py-2.5",
            "text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400",
          )}
          title={collapsed ? "Sign Out" : undefined}
        >
          <LogOut
            className={clsx("flex-shrink-0", collapsed ? "w-5 h-5" : "w-4 h-4")}
          />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
