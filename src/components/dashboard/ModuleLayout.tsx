"use client";

import Sidebar from "./Sidebar";
import { type LucideIcon } from "lucide-react";

interface ModuleLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  gradient: string; // e.g. "from-blue-500 to-cyan-500"
}

export default function ModuleLayout({
  children,
  title,
  subtitle,
  icon: Icon,
  gradient,
}: ModuleLayoutProps) {
  return (
    <div className="flex h-screen" style={{ background: "var(--background)" }}>
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8 max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8 flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}
            >
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1
                className="text-2xl font-black"
                style={{ color: "var(--text)" }}
              >
                {title}
              </h1>
              <p
                className="text-sm mt-0.5"
                style={{ color: "var(--text-muted)" }}
              >
                {subtitle}
              </p>
            </div>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}

// Reusable card for module pages
export function ModuleCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl p-6 ${className}`}
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
    >
      {children}
    </div>
  );
}

// Reusable label
export function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      className="block text-sm font-semibold mb-2"
      style={{ color: "var(--text)" }}
    >
      {children}
    </label>
  );
}

// Reusable result section title
export function ResultTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-bold text-base mb-3" style={{ color: "var(--text)" }}>
      {children}
    </h3>
  );
}

// Tag/badge pill
export function Tag({
  children,
  color = "primary",
}: {
  children: React.ReactNode;
  color?: string;
}) {
  const colorMap: Record<string, string> = {
    primary: "text-primary-500 bg-primary-500/10",
    green: "text-green-500 bg-green-500/10",
    yellow: "text-yellow-500 bg-yellow-500/10",
    red: "text-red-500 bg-red-500/10",
    purple: "text-purple-500 bg-purple-500/10",
    blue: "text-blue-500 bg-blue-500/10",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${colorMap[color] || colorMap.primary}`}
    >
      {children}
    </span>
  );
}
