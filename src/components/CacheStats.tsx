/**
 * Cache Statistics Manager Component
 * Displays cache hit rate and performance metrics
 * Can be added to dashboard for transparency
 */

import { useState } from "react";
import { useCacheManagement } from "@/hooks/useCacheManagement";
import { Zap, Trash2, BarChart3, AlertCircle } from "lucide-react";

interface CacheStatsProps {
  compact?: boolean;
  showClearButton?: boolean;
}

export default function CacheStats({
  compact = false,
  showClearButton = true,
}: CacheStatsProps) {
  const { getStats, clearCache, formatBytes } = useCacheManagement();
  const [stats, setStats] = useState(getStats());

  const refreshStats = () => {
    setStats(getStats());
  };

  const handleClearCache = () => {
    if (
      confirm("⚠️  Clear all cached responses? This will force new API calls.")
    ) {
      clearCache();
      refreshStats();
    }
  };

  if (compact) {
    return (
      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
        <Zap className="w-3.5 h-3.5 text-amber-500" />
        <span className="font-semibold">{stats.hitRate}%</span>
        <span>cache hit rate</span>
      </div>
    );
  }

  const estimatedSavings = stats.hits * 0.5; // Rough estimate: 0.5s per hit

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900/20 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="font-bold text-slate-900 dark:text-slate-100">
            Cache Performance
          </h3>
        </div>
        <button
          onClick={refreshStats}
          className="text-xs px-2 py-1 rounded-lg bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-500/30 transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-lg bg-white dark:bg-slate-800 p-3 border border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
            Hit Rate
          </p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats.hitRate}%
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            {stats.hits} hits / {stats.hits + stats.misses} total
          </p>
        </div>

        <div className="rounded-lg bg-white dark:bg-slate-800 p-3 border border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
            Cache Size
          </p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {formatBytes(stats.totalSize)}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            {stats.entriesCount} entries
          </p>
        </div>
      </div>

      <div className="rounded-lg bg-white dark:bg-slate-800 p-3 border border-slate-200 dark:border-slate-700 mb-4">
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
          ⚡ Estimated Time Saved
        </p>
        <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
          ~{Math.round(estimatedSavings)}s
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          By serving cached responses
        </p>
      </div>

      {stats.entries.length > 0 && (
        <div className="mb-4 max-h-48 overflow-y-auto">
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 px-1">
            Cached Agents:
          </p>
          <div className="space-y-1">
            {stats.entries.slice(0, 5).map((entry, idx) => (
              <div
                key={idx}
                className="text-xs px-2 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex justify-between"
              >
                <span className="text-slate-600 dark:text-slate-400 truncate">
                  {entry.key.split(":")[0]}
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-semibold">
                  {entry.hits} hits
                </span>
              </div>
            ))}
            {stats.entries.length > 5 && (
              <p className="text-xs text-slate-400 px-2 py-1">
                +{stats.entries.length - 5} more...
              </p>
            )}
          </div>
        </div>
      )}

      {showClearButton && (
        <button
          onClick={handleClearCache}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/30 transition-colors text-sm font-semibold"
        >
          <Trash2 className="w-4 h-4" />
          Clear All Cache
        </button>
      )}
    </div>
  );
}
