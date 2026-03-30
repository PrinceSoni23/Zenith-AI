import React, { useState, useEffect } from "react";

interface RedisStats {
  isConnected: boolean;
  keyCount: number;
  memoryUsage: string;
  message?: string;
}

export const RedisStatsMonitor: React.FC = () => {
  const [redisStats, setRedisStats] = useState<RedisStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRedisStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:5000/api/monitoring/redis-stats",
      );
      const data = await response.json();

      if (data.success) {
        setRedisStats(data.data);
        setError(null);
      } else {
        setError("Failed to fetch Redis stats");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch Redis stats",
      );
      // Fallback to offline state
      setRedisStats({
        isConnected: false,
        keyCount: 0,
        memoryUsage: "N/A",
        message: "Redis not available",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRedisStats();
    const interval = setInterval(fetchRedisStats, 5000); // Refresh every 5s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg shadow-md p-6 border-l-4 ${
        redisStats?.isConnected
          ? "bg-gradient-to-r from-red-50 to-white border-red-500"
          : "bg-gradient-to-r from-yellow-50 to-white border-yellow-500"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <svg
            className="w-6 h-6 text-red-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 1a9 9 0 100 18 9 9 0 000-18zM9 5a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1zm0 6a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1zm0 6a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" />
          </svg>
          <h3 className="text-lg font-bold text-gray-800">Redis Cache</h3>
        </div>
        <div
          className={`flex items-center gap-2 px-3 py-1 rounded-full ${
            redisStats?.isConnected
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              redisStats?.isConnected ? "bg-green-500" : "bg-yellow-500"
            } animate-pulse`}
          ></span>
          <span className="text-xs font-semibold">
            {redisStats?.isConnected ? "CONNECTED" : "OFFLINE"}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Keys Count */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm font-medium mb-1">Cache Keys</p>
          <p className="text-3xl font-bold text-red-600">
            {redisStats?.isConnected ? redisStats.keyCount : "—"}
          </p>
          <p className="text-xs text-gray-500 mt-1">Stored cache entries</p>
        </div>

        {/* Memory Usage */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm font-medium mb-1">Memory Usage</p>
          <p className="text-3xl font-bold text-orange-600">
            {redisStats?.memoryUsage || "—"}
          </p>
          <p className="text-xs text-gray-500 mt-1">Redis memory</p>
        </div>
      </div>

      {/* Status Message */}
      {redisStats?.message && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-3 py-2 rounded text-sm">
          ℹ️ {redisStats.message}
        </div>
      )}

      {/* Connection Details */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Status:</span>
          <span
            className={`font-semibold ${
              redisStats?.isConnected ? "text-green-600" : "text-yellow-600"
            }`}
          >
            {redisStats?.isConnected
              ? "✅ Ready - Cache persists on server restart"
              : "⚠️ Unavailable - Using in-memory cache"}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-gray-600">Cache Type:</span>
          <span className="font-semibold text-gray-700">
            {redisStats?.isConnected ? "Redis (Persistent)" : "In-Memory"}
          </span>
        </div>
      </div>

      {/* Help Text */}
      <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-700">
        <p className="font-semibold mb-1">💡 What this means:</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>
            <strong>Connected:</strong> Data stored in Redis survives server
            restarts
          </li>
          <li>
            <strong>Offline:</strong> Cache resets when server restarts
            (development mode)
          </li>
          <li>
            <strong>Keys:</strong> Number of cached API responses
          </li>
        </ul>
      </div>
    </div>
  );
};
