"use client";

import { useEffect, useState } from "react";
import {
  Zap,
  Radio,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  RefreshCw,
} from "lucide-react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface RequestStats {
  totalRequests: number;
  requestsByAgent: Record<string, number>;
  cacheHits: number;
  cacheMisses: number;
  serverStartTime: string;
  uptime: string;
  cacheHitRate?: string;
}

interface RequestTrackerProps {
  refreshInterval?: number; // Auto-refresh in milliseconds (0 = disabled)
  compact?: boolean; // Compact view or detailed
}

export function RequestTracker({
  refreshInterval = 20000,
  compact = false,
}: RequestTrackerProps) {
  const [stats, setStats] = useState<RequestStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/monitoring/request-stats`);
      setStats(response.data.data);
      setError(null);
    } catch (err) {
      let errorMsg = "Error fetching stats from server";

      if (axios.isAxiosError(err)) {
        if (err.response?.status === 429) {
          errorMsg =
            "🚦 Rate limited. Auto-refresh is disabled by default. Click the button to refresh manually or enable refresh.";
          // Auto-ensure refresh is off
          setAutoRefresh(false);
        } else if (err.response?.status === 404) {
          errorMsg = "❌ Monitoring endpoint not found. Is backend running?";
        } else if (err.response?.status === 500) {
          errorMsg = "⚠️ Backend error. Check server logs.";
        } else {
          errorMsg = err.message;
        }
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchStats();
  }, []);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh || refreshInterval === 0) return;

    const interval = setInterval(fetchStats, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin">
          <Radio className="w-5 h-5 text-blue-500" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-500/10 rounded-lg border border-red-200 dark:border-red-500/30">
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!stats) return null;

  // Compact view - just show key metrics in a small card
  if (compact) {
    return (
      <div className="rounded-lg p-3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 border border-blue-200 dark:border-blue-500/30">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-pulse" />
            <div>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                Requests (Session)
              </p>
              <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {stats.totalRequests}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
              Cache Hit Rate
            </p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">
              {stats.cacheHitRate || "0%"}
            </p>
          </div>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`p-2 rounded-lg transition-colors ${
              autoRefresh
                ? "bg-blue-600 text-white"
                : "bg-slate-200 text-slate-600"
            }`}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Detailed view - full dashboard
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Request Monitor
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Live request tracking per server session
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchStats()}
            className="px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all bg-green-600 text-white hover:bg-green-700"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Now
          </button>
          <button
            onClick={() => {
              setAutoRefresh(!autoRefresh);
            }}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${
              autoRefresh
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
            }`}
          >
            <RefreshCw
              className={`w-4 h-4 ${autoRefresh ? "animate-spin" : ""}`}
            />
            {autoRefresh ? "Auto-Refresh ON" : "Auto-Refresh OFF"}
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Requests */}
        <div className="rounded-xl p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-500/20 dark:to-blue-600/10 border border-blue-200/50 dark:border-blue-500/30">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-semibold uppercase text-blue-600 dark:text-blue-400 mb-1">
                Total Requests
              </p>
              <p className="text-3xl font-black text-blue-900 dark:text-blue-100">
                {stats.totalRequests}
              </p>
            </div>
            <Zap className="w-8 h-8 text-blue-400 opacity-50" />
          </div>
          <p className="text-xs text-blue-700/70 dark:text-blue-300/70">
            Since server start (resets on restart)
          </p>
        </div>

        {/* Cache Hits */}
        <div className="rounded-xl p-6 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-500/20 dark:to-green-600/10 border border-green-200/50 dark:border-green-500/30">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-semibold uppercase text-green-600 dark:text-green-400 mb-1">
                Cache Hits
              </p>
              <p className="text-3xl font-black text-green-900 dark:text-green-100">
                {stats.cacheHits}
              </p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-400 opacity-50" />
          </div>
          <p className="text-xs text-green-700/70 dark:text-green-300/70">
            Requests served from cache
          </p>
        </div>

        {/* Cache Misses */}
        <div className="rounded-xl p-6 bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-500/20 dark:to-amber-600/10 border border-amber-200/50 dark:border-amber-500/30">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-semibold uppercase text-amber-600 dark:text-amber-400 mb-1">
                Cache Misses
              </p>
              <p className="text-3xl font-black text-amber-900 dark:text-amber-100">
                {stats.cacheMisses}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-amber-400 opacity-50" />
          </div>
          <p className="text-xs text-amber-700/70 dark:text-amber-300/70">
            Requests that called AI
          </p>
        </div>

        {/* Hit Rate */}
        <div className="rounded-xl p-6 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-500/20 dark:to-purple-600/10 border border-purple-200/50 dark:border-purple-500/30">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-semibold uppercase text-purple-600 dark:text-purple-400 mb-1">
                Hit Rate
              </p>
              <p className="text-3xl font-black text-purple-900 dark:text-purple-100">
                {stats.cacheHitRate || "0%"}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-400 opacity-50" />
          </div>
          <p className="text-xs text-purple-700/70 dark:text-purple-300/70">
            {stats.totalRequests > 0
              ? `${stats.cacheHits} of ${stats.totalRequests} used cache`
              : "No requests yet"}
          </p>
        </div>
      </div>

      {/* Server Info */}
      <div className="rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <h3 className="font-bold text-slate-900 dark:text-white">
            Server Session
          </h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
              Server Started
            </p>
            <p className="font-mono text-sm text-slate-900 dark:text-slate-100">
              {new Date(stats.serverStartTime).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
              Uptime
            </p>
            <p className="font-mono text-sm text-slate-900 dark:text-slate-100">
              {stats.uptime}
            </p>
          </div>
        </div>
      </div>

      {/* Requests by Agent */}
      {Object.keys(stats.requestsByAgent).length > 0 && (
        <div className="rounded-xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4">
            Requests by Agent
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.requestsByAgent)
              .sort((a, b) => b[1] - a[1])
              .map(([agent, count]) => (
                <div key={agent} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {agent}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                        style={{
                          width: `${(count / Math.max(...Object.values(stats.requestsByAgent))) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100 w-8 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="rounded-xl p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          <span className="font-semibold">💡 Info:</span> This counter tracks
          requests in the current server session. Auto-refresh is
          <span className="font-semibold"> disabled by default</span> to avoid
          rate limiting. Click{" "}
          <span className="font-semibold">"Refresh Now"</span> to get latest
          stats, or enable auto-refresh for continuous updates (every 20s).
          Resets to 0 when the backend server restarts.
        </p>
      </div>
    </div>
  );
}
