"use client";

import { ReactNode } from "react";

interface PremiumStatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  suffix?: string;
  color: "blue" | "teal" | "purple" | "orange";
  trend?: number;
  isLoading?: boolean;
}

const colorGradients = {
  blue: "from-blue-600 to-blue-400",
  teal: "from-teal-600 to-cyan-400",
  purple: "from-purple-600 to-pink-400",
  orange: "from-orange-600 to-amber-400",
};

const colorBgs = {
  blue: "bg-blue-50 dark:bg-blue-500/10",
  teal: "bg-teal-50 dark:bg-teal-500/10",
  purple: "bg-purple-50 dark:bg-purple-500/10",
  orange: "bg-orange-50 dark:bg-orange-500/10",
};

const colorBorders = {
  blue: "border-blue-200 dark:border-blue-500/30",
  teal: "border-teal-200 dark:border-teal-500/30",
  purple: "border-purple-200 dark:border-purple-500/30",
  orange: "border-orange-200 dark:border-orange-500/30",
};

export default function PremiumStatCard({
  icon,
  label,
  value,
  suffix,
  color,
  trend,
  isLoading,
}: PremiumStatCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-6 ${colorBgs[color]} border-2 ${colorBorders[color]} 
      shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:scale-105 group cursor-pointer
      animate-fade-in`}
    >
      {/* Animated background gradient */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-r ${colorGradients[color]}
        transition-opacity duration-300`}
      />

      {/* Animated blob */}
      <div
        className={`absolute -right-8 -top-8 w-32 h-32 rounded-full bg-gradient-to-br ${colorGradients[color]}
        opacity-5 group-hover:opacity-10 transition-opacity duration-300 animate-pulse`}
      />

      <div className="relative z-10">
        {/* Icon and label */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
            {label}
          </h3>
          <div
            className={`p-2.5 rounded-xl bg-gradient-to-br ${colorGradients[color]}
            text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300`}
          >
            {icon}
          </div>
        </div>

        {/* Value */}
        <div className="mb-2">
          <div className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400">
            {isLoading ? (
              <span className="animate-pulse">--</span>
            ) : (
              <>
                {value}
                {suffix && <span className="text-lg ml-1">{suffix}</span>}
              </>
            )}
          </div>
        </div>

        {/* Trend indicator */}
        {trend !== undefined && (
          <div
            className={`text-xs font-semibold flex items-center gap-1 ${
              trend >= 0
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            <span>{trend >= 0 ? "↑" : "↓"}</span>
            <span>{Math.abs(trend)}% from last week</span>
          </div>
        )}
      </div>
    </div>
  );
}
