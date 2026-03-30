"use client";

import {
  Zap,
  HardDrive,
  TrendingUp,
  Smartphone,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useFrontendCacheStats } from "@/hooks/useFrontendCacheStats";

export function FrontendCacheMonitor() {
  const stats = useFrontendCacheStats(1000); // Update every 1 second (local only, no API call)

  if (!stats) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-pulse">
          <Smartphone className="w-5 h-5 text-blue-500" />
        </div>
      </div>
    );
  }

  const usedPercentage = (stats.cacheSize / stats.maxCacheSize) * 100;
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
          <Smartphone className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Browser Cache Monitor
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Frontend cache activity (real-time, no API calls)
          </p>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Requests */}
        <div className="rounded-xl p-6 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-500/20 dark:to-purple-600/10 border border-purple-200/50 dark:border-purple-500/30">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-semibold uppercase text-purple-600 dark:text-purple-400 mb-1">
                Browser Requests
              </p>
              <p className="text-3xl font-black text-purple-900 dark:text-purple-100">
                {stats.totalRequests}
              </p>
            </div>
            <Zap className="w-8 h-8 text-purple-400 opacity-50" />
          </div>
          <p className="text-xs text-purple-700/70 dark:text-purple-300/70">
            Total from this device
          </p>
        </div>

        {/* Cache Hits */}
        <div className="rounded-xl p-6 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-500/20 dark:to-green-600/10 border border-green-200/50 dark:border-green-500/30">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-semibold uppercase text-green-600 dark:text-green-400 mb-1">
                Browser Hits
              </p>
              <p className="text-3xl font-black text-green-900 dark:text-green-100">
                {stats.cacheHits}
              </p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-400 opacity-50" />
          </div>
          <p className="text-xs text-green-700/70 dark:text-green-300/70">
            Instant responses from browser
          </p>
        </div>

        {/* Cache Misses */}
        <div className="rounded-xl p-6 bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-500/20 dark:to-orange-600/10 border border-orange-200/50 dark:border-orange-500/30">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-semibold uppercase text-orange-600 dark:text-orange-400 mb-1">
                Browser Misses
              </p>
              <p className="text-3xl font-black text-orange-900 dark:text-orange-100">
                {stats.cacheMisses}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-orange-400 opacity-50" />
          </div>
          <p className="text-xs text-orange-700/70 dark:text-orange-300/70">
            Needed to call backend/AI
          </p>
        </div>

        {/* Hit Rate */}
        <div className="rounded-xl p-6 bg-gradient-to-br from-cyan-50 to-cyan-100/50 dark:from-cyan-500/20 dark:to-cyan-600/10 border border-cyan-200/50 dark:border-cyan-500/30">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-semibold uppercase text-cyan-600 dark:text-cyan-400 mb-1">
                Hit Rate
              </p>
              <p className="text-3xl font-black text-cyan-900 dark:text-cyan-100">
                {stats.hitRate}%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-cyan-400 opacity-50" />
          </div>
          <p className="text-xs text-cyan-700/70 dark:text-cyan-300/70">
            How effective your browser cache is
          </p>
        </div>
      </div>

      {/* Cache Storage Info */}
      <div className="rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-4">
          <HardDrive className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <h3 className="font-bold text-slate-900 dark:text-white">
            Cache Storage Usage
          </h3>
        </div>

        <div className="space-y-4">
          {/* Storage Bar */}
          <div>
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Memory Used
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {formatBytes(stats.cacheSize)} /{" "}
                {formatBytes(stats.maxCacheSize)}
              </span>
            </div>
            <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  usedPercentage > 80
                    ? "bg-red-500"
                    : usedPercentage > 50
                      ? "bg-yellow-500"
                      : "bg-green-500"
                }`}
                style={{ width: `${Math.min(usedPercentage, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {Math.round(usedPercentage)}% full
              {usedPercentage > 80 && (
                <span className="ml-2 text-red-600 dark:text-red-400 font-semibold">
                  ⚠️ High usage
                </span>
              )}
            </p>
          </div>

          {/* Cached Entries */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                Cached Entries
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {stats.cachedEntries}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                Average Entry Size
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {stats.cachedEntries > 0
                  ? formatBytes(
                      Math.round(stats.cacheSize / stats.cachedEntries),
                    )
                  : "0 B"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="rounded-xl p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30">
        <p className="text-sm text-green-700 dark:text-green-300">
          <span className="font-semibold">📱 Browser Cache:</span> This shows
          cache activity in YOUR browser only. Higher hit rate means faster
          responses and less API calls. Resets when you close the tab or
          refresh, or after 24 hours per entry.
        </p>
      </div>
    </div>
  );
}
