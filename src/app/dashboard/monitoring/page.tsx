"use client";

export const dynamic = "force-dynamic";

import Sidebar from "@/components/dashboard/Sidebar";
import { RequestTracker } from "@/components/RequestTracker";
import { FrontendCacheMonitor } from "@/components/FrontendCacheMonitor";

export default function MonitoringPage() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-dark-950 dark:via-slate-900 dark:to-purple-900/20">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 mb-2">
              System Monitoring
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Real-time tracking of API requests and cache performance
            </p>
          </div>

          {/* Request Tracker */}
          <RequestTracker refreshInterval={20000} compact={false} />

          {/* Divider */}
          <div className="my-10 border-t-2 border-slate-300 dark:border-slate-700"></div>

          {/* Frontend Cache Monitor */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Browser Cache Performance
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Real-time statistics from your browser cache (zero API costs)
            </p>
            <FrontendCacheMonitor />
          </div>

          {/* Footer Info */}
          <div className="mt-10 p-6 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-slate-900 dark:text-white mb-3">
              About This Page
            </h3>
            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <li>
                <span className="font-semibold">📊 Backend Statistics:</span>{" "}
                Server-side request tracking | Resets when backend restarts
              </li>
              <li>
                ✨ <span className="font-semibold">Total Requests:</span> Every
                AI API call (cached or not) across all users
              </li>
              <li>
                ✅ <span className="font-semibold">Cache Hits:</span> Requests
                served from server memory (no AI call needed)
              </li>
              <li>
                ⚠️ <span className="font-semibold">Cache Misses:</span> Requests
                that required actual AI processing
              </li>
              <li>
                📊 <span className="font-semibold">Hit Rate:</span> Percentage
                of requests served from cache
              </li>
              <li>
                🔄 <span className="font-semibold">Resets to 0:</span> When the
                backend server restarts
              </li>
              <li className="pt-2 border-t border-slate-300 dark:border-slate-600 mt-3">
                <span className="font-semibold">
                  🌐 Browser Cache Statistics:
                </span>{" "}
                Your local browser cache | Updates every 1 second
              </li>
              <li>
                📱 <span className="font-semibold">Browser Requests:</span>{" "}
                Total questions asked by your browser
              </li>
              <li>
                💾 <span className="font-semibold">Storage Usage:</span> How
                much memory your browser cache is using (max 10MB per session)
              </li>
              <li>
                🚀 <span className="font-semibold">Cost Saving:</span> Seconds
                of API calls saved by caching
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
