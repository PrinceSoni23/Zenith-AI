"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Settings, User, Bell, Lock } from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState({
    weeklyReport: true,
    performanceAlert: true,
    milestones: true,
    recommendations: true,
  });

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
    toast.success("Preference updated!");
  };

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Settings
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Manage your account and preferences
        </p>
      </div>

      {/* Account Section */}
      <div className="rounded-3xl p-8 bg-white dark:bg-dark-900 border-2 border-slate-200 dark:border-slate-700 shadow-lg mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
          <User className="w-6 h-6 text-blue-500" />
          Account Information
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
              Name
            </label>
            <p className="px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {user?.name}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
              Email
            </label>
            <p className="px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {user?.email}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
              Role
            </label>
            <p className="px-4 py-3 rounded-lg bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-500/10 dark:to-purple-500/10 text-pink-600 dark:text-pink-400 font-semibold">
              Parent
            </p>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="rounded-3xl p-8 bg-white dark:bg-dark-900 border-2 border-slate-200 dark:border-slate-700 shadow-lg mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
          <Bell className="w-6 h-6 text-purple-500" />
          Notification Preferences
        </h2>

        <div className="space-y-4">
          {[
            {
              key: "weeklyReport" as const,
              label: "Weekly Report",
              description: "Get a weekly summary of your children's progress",
            },
            {
              key: "performanceAlert" as const,
              label: "Performance Alerts",
              description: "Get notified if performance drops significantly",
            },
            {
              key: "milestones" as const,
              label: "Milestone Celebrations",
              description: "Celebrate your children's achievements",
            },
            {
              key: "recommendations" as const,
              label: "AI Recommendations",
              description: "Receive AI-powered learning recommendations",
            },
          ].map(pref => (
            <div
              key={pref.key}
              className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                  {pref.label}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {pref.description}
                </p>
              </div>
              <button
                onClick={() => handleToggle(pref.key)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  notifications[pref.key]
                    ? "bg-green-500"
                    : "bg-slate-300 dark:bg-slate-600"
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    notifications[pref.key] ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Security Section */}
      <div className="rounded-3xl p-8 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-500/10 dark:to-orange-500/10 border-2 border-red-200 dark:border-red-500/30 shadow-lg">
        <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-6 flex items-center gap-2">
          <Lock className="w-6 h-6" />
          Security
        </h2>

        <button className="w-full px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-all">
          Change Password
        </button>

        <p className="text-sm text-red-600 dark:text-red-400 mt-4">
          Last login: Just now
        </p>
      </div>
    </div>
  );
}
