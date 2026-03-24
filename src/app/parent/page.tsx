"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { parentApi } from "@/lib/api";
import toast from "react-hot-toast";
import {
  BarChart3,
  Users,
  TrendingUp,
  AlertCircle,
  Award,
  Activity,
  Loader2,
  Zap,
  Target,
  Brain,
} from "lucide-react";
import HeroSection from "@/components/parent/HeroSection";
import PremiumStatCard from "@/components/parent/PremiumStatCard";
import PremiumChildCard from "@/components/parent/PremiumChildCard";

interface ChildOverview {
  id: string;
  name: string;
  classLevel: string;
  consistencyScore: number;
  topSubject: string;
  weakSubject: string;
  weeklyActivity: number;
}

const STORAGE_KEY = "parent_linked_children";

// Mock child data with insights
const MOCK_CHILD_DATA: { [key: string]: ChildOverview } = {
  STU001: {
    id: "STU001",
    name: "Sarah Johnson",
    classLevel: "Class 6",
    consistencyScore: 87,
    topSubject: "Mathematics",
    weakSubject: "English",
    weeklyActivity: 12,
  },
  STU002: {
    id: "STU002",
    name: "John Smith",
    classLevel: "Class 8",
    consistencyScore: 72,
    topSubject: "Science",
    weakSubject: "History",
    weeklyActivity: 8,
  },
  STU003: {
    id: "STU003",
    name: "Emma Davis",
    classLevel: "Class 7",
    consistencyScore: 94,
    topSubject: "English",
    weakSubject: "Mathematics",
    weeklyActivity: 15,
  },
  STU004: {
    id: "STU004",
    name: "Michael Brown",
    classLevel: "Class 9",
    consistencyScore: 68,
    topSubject: "Computer Science",
    weakSubject: "Physics",
    weeklyActivity: 6,
  },
};

export default function ParentDashboardHome() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [children, setChildren] = useState<ChildOverview[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Use parent ID in storage key to isolate data per parent account
  const parentStorageKey = user?.id ? `${STORAGE_KEY}:${user.id}` : STORAGE_KEY;

  useEffect(() => {
    // Clean up old shared storage key (for backward compatibility)
    if (user?.id) {
      if (STORAGE_KEY !== parentStorageKey) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    // Load immediately on mount
    loadChildren();

    // Auto-refresh data every 30 seconds
    const interval = setInterval(() => {
      loadChildren();
      setLastRefresh(new Date());
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  const loadChildren = async () => {
    // Check if parent has valid token
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;

    setLoading(true);
    try {
      const stored = localStorage.getItem(parentStorageKey);

      if (!stored) {
        setLoading(false);
        return;
      }

      const linkedIds = JSON.parse(stored);

      // Load data for each child
      const childrenData = await Promise.all(
        linkedIds.map(async (child: any) => {
          // First check mock data
          const mockData = MOCK_CHILD_DATA[child.id];
          if (mockData) {
            return mockData;
          }

          // For real students, try to fetch from backend insights endpoint
          try {
            const response = await parentApi.getInsights(child.id);

            if (response.data?.data) {
              const { profile, studyLogs } = response.data.data;

              if (profile) {
                // Calculate metrics from study logs (even if empty)
                const logs = studyLogs || [];
                const totalMinutes = logs.reduce(
                  (sum: number, log: any) => sum + (log.durationMinutes || 0),
                  0,
                );

                // Get top subject (most studied)
                const subjectCount: { [key: string]: number } = {};
                logs.forEach((log: any) => {
                  subjectCount[log.subject] =
                    (subjectCount[log.subject] || 0) + 1;
                });
                const topSubject =
                  Object.keys(subjectCount).sort(
                    (a, b) => subjectCount[b] - subjectCount[a],
                  )[0] || "Not started";

                // Calculate consistency score based on activity
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                const weeklyLogs = logs.filter(
                  (log: any) => new Date(log.createdAt) >= weekAgo,
                );
                const consistencyScore = Math.min(
                  100,
                  Math.round(weeklyLogs.length * 14.3),
                );

                const studentData = {
                  id: profile.userId || child.id, // Use userId from StudentProfile, not profile._id
                  name: profile.name || child.name || `Student ${child.id}`,
                  classLevel:
                    profile.classLevel || child.classLevel || "Unknown",
                  consistencyScore: Math.max(0, consistencyScore),
                  topSubject: topSubject,
                  weakSubject:
                    logs.length === 0 ? "Not available" : "Review needed",
                  weeklyActivity: Math.round(totalMinutes / 60) || 0,
                };

                return studentData;
              }
            }
          } catch (insightsError: any) {
            // Silently handle errors - use fallback data
          }

          // If API fails, use stored data (will show "Loading...", "Unknown")
          // This is okay - it shows the student is linked, real name will appear once backend is ready

          // Fallback to stored data (from linking)
          const fallbackData = {
            id: child.id,
            name: child.name || `Student ${child.id}`,
            classLevel: child.classLevel || "Unknown",
            consistencyScore: 0,
            topSubject: "Unknown",
            weakSubject: "Unknown",
            weeklyActivity: 0,
          };
          return fallbackData;
        }),
      );

      setChildren(childrenData);
    } catch (error) {
      // Silently handle loading errors
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Animated background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 p-6 lg:p-10 max-w-7xl mx-auto">
        {/* Hero Section */}
        <HeroSection
          userName={user?.name || "User"}
          lastRefresh={lastRefresh}
        />

        {/* Premium Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <PremiumStatCard
            icon={<Users className="w-5 h-5" />}
            label="Total Children"
            value={children.length}
            color="blue"
            isLoading={loading}
          />
          <PremiumStatCard
            icon={<Zap className="w-5 h-5" />}
            label="Active This Week"
            value={children.filter(c => c.weeklyActivity > 0).length}
            color="teal"
            isLoading={loading}
          />
          <PremiumStatCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="Avg. Performance"
            value={
              children.length > 0
                ? Math.round(
                    children.reduce((a, c) => a + c.consistencyScore, 0) /
                      children.length,
                  )
                : 0
            }
            suffix="%"
            color="purple"
            isLoading={loading}
          />
          <PremiumStatCard
            icon={<Target className="w-5 h-5" />}
            label="Needs Focus"
            value={children.filter(c => c.consistencyScore < 60).length}
            color="orange"
            isLoading={loading}
          />
        </div>

        {/* Children Section */}
        <div className="rounded-3xl overflow-hidden bg-white/5 dark:bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 shadow-2xl">
          {/* Header */}
          <div className="p-8 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-900/50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 text-transparent bg-clip-text flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 text-white">
                    <Users className="w-6 h-6" />
                  </div>
                  Your Children
                </h2>
                <p className="text-slate-400 mt-2">
                  Track and monitor your children's learning progress
                </p>
              </div>
              {!loading && children.length > 0 && (
                <div className="text-right">
                  <p className="text-4xl font-black text-transparent bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text">
                    {children.length}
                  </p>
                  <p className="text-sm text-slate-400">Active Profiles</p>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="relative w-16 h-16 mb-4">
                  <div className="absolute inset-0 rounded-full border-4 border-slate-700/30" />
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin" />
                </div>
                <p className="text-slate-400 text-lg">
                  Loading your dashboard...
                </p>
              </div>
            ) : children.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-block p-6 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 mb-6">
                  <Brain className="w-12 h-12 text-purple-400" />
                </div>
                <p className="text-slate-300 text-lg mb-2">
                  No children linked yet
                </p>
                <p className="text-slate-500 mb-6">
                  Start tracking your children's learning journey
                </p>
                <a
                  href="/parent/children"
                  className="inline-block px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600
                  hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transform hover:scale-105
                  transition-all duration-300 active:scale-95"
                >
                  Link Your Child
                </a>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {children.map((child, index) => (
                  <div
                    key={child.id}
                    style={{
                      animation: `slideUp 0.5s ease-out ${index * 100}ms forwards`,
                      opacity: 0,
                    }}
                  >
                    <PremiumChildCard
                      id={child.id}
                      name={child.name}
                      classLevel={child.classLevel}
                      consistencyScore={child.consistencyScore}
                      topSubject={child.topSubject}
                      weakSubject={child.weakSubject}
                      weeklyActivity={child.weeklyActivity}
                      onViewDetails={childId => {
                        router.push(`/parent/analytics?childId=${childId}`);
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        {children.length > 0 && (
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            <div className="group p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 hover:border-blue-500/60 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-blue-500/20">
              <div className="p-3 rounded-xl bg-blue-500/20 w-fit mb-3 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-blue-300 mb-2">
                Detailed Analytics
              </h3>
              <p className="text-sm text-blue-200/70">
                View comprehensive performance reports
              </p>
            </div>

            <div className="group p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-purple-500/20">
              <div className="p-3 rounded-xl bg-purple-500/20 w-fit mb-3 group-hover:scale-110 transition-transform duration-300">
                <Award className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-purple-300 mb-2">
                Achievements
              </h3>
              <p className="text-sm text-purple-200/70">
                Track milestones and celebrate progress
              </p>
            </div>

            <div className="group p-6 rounded-2xl bg-gradient-to-br from-teal-500/10 to-green-500/10 border border-teal-500/30 hover:border-teal-500/60 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-teal-500/20">
              <div className="p-3 rounded-xl bg-teal-500/20 w-fit mb-3 group-hover:scale-110 transition-transform duration-300">
                <Activity className="w-6 h-6 text-teal-400" />
              </div>
              <h3 className="text-lg font-bold text-teal-300 mb-2">
                Real-time Activity
              </h3>
              <p className="text-sm text-teal-200/70">
                Monitor learning activity as it happens
              </p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
