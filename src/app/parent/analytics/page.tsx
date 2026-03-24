"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { SearchParamsWrapper } from "@/components/SearchParamsWrapper";
import { parentApi } from "@/lib/api";
import toast from "react-hot-toast";
import {
  BarChart3,
  TrendingUp,
  BookOpen,
  Target,
  Award,
  AlertCircle,
  Zap,
  Heart,
  Loader2,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface ChildAnalytics {
  name: string;
  classLevel: string;
  overallSummary: string;
  learningConsistency: number;
  subjectPerformance: Array<{
    subject: string;
    score: number;
    trend: string;
    minutesSpent: number;
  }>;
  studyActivity: string;
  weakAreas: string[];
  strengths: string[];
  recommendations: string[];
  parentTips: string[];
  encouragementForStudent: string;
}

// Mock analytics data for each child
const MOCK_ANALYTICS: { [key: string]: ChildAnalytics } = {
  STU001: {
    name: "Sarah Johnson",
    classLevel: "Class 6",
    overallSummary:
      "Sarah is doing exceptionally well in her studies. She shows strong consistency and excellent grasp of mathematical concepts.",
    learningConsistency: 87,
    subjectPerformance: [
      { subject: "Mathematics", score: 92, trend: "up", minutesSpent: 720 },
      { subject: "Science", score: 85, trend: "up", minutesSpent: 540 },
      { subject: "English", score: 72, trend: "stable", minutesSpent: 360 },
      { subject: "Social Studies", score: 88, trend: "up", minutesSpent: 420 },
    ],
    studyActivity: "Very active - 2040 minutes this week",
    weakAreas: ["English Grammar", "Essay Writing", "Vocabulary"],
    strengths: ["Problem Solving", "Mathematical Reasoning", "Quick Learning"],
    recommendations: [
      "Focus on English comprehension with regular reading practice",
      "Practice essay writing with guided prompts",
      "Use flashcards for vocabulary building",
    ],
    parentTips: [
      "Praise her mathematical abilities to boost confidence",
      "Encourage reading habits with interesting books",
      "Set small achievable goals in English to improve motivation",
    ],
    encouragementForStudent:
      "You're doing amazing! Keep up the fantastic work in Mathematics and Science! 🌟",
  },
  STU002: {
    name: "John Smith",
    classLevel: "Class 8",
    overallSummary:
      "John has good potential but needs more consistency in his studies. He excels in Science but needs attention in History.",
    learningConsistency: 72,
    subjectPerformance: [
      { subject: "Science", score: 88, trend: "up", minutesSpent: 600 },
      { subject: "Mathematics", score: 75, trend: "stable", minutesSpent: 480 },
      { subject: "English", score: 78, trend: "up", minutesSpent: 420 },
      { subject: "History", score: 62, trend: "down", minutesSpent: 240 },
    ],
    studyActivity: "Active - 1740 minutes this week",
    weakAreas: ["History Facts", "Timeline Understanding", "Date Memorization"],
    strengths: ["Scientific Experiments", "Lab Work", "Analytical Thinking"],
    recommendations: [
      "Dedicate more time to History with engaging storytelling methods",
      "Create timeline charts for better visualization",
      "Join study groups for peer learning in weak areas",
    ],
    parentTips: [
      "Celebrate his Science achievements",
      "Use documentaries to make History more interesting",
      "Help create study schedules with balanced subjects",
    ],
    encouragementForStudent:
      "Your Science skills are impressive! Let's give History the attention it deserves. You've got this! 💪",
  },
  STU003: {
    name: "Emma Davis",
    classLevel: "Class 7",
    overallSummary:
      "Emma is an exceptional student with excellent consistency across all subjects. She shows strong academic performance and engagement.",
    learningConsistency: 94,
    subjectPerformance: [
      { subject: "English", score: 96, trend: "up", minutesSpent: 660 },
      { subject: "Mathematics", score: 91, trend: "stable", minutesSpent: 600 },
      { subject: "Science", score: 89, trend: "up", minutesSpent: 540 },
      { subject: "Social Studies", score: 92, trend: "up", minutesSpent: 480 },
    ],
    studyActivity: "Highly active - 2280 minutes this week",
    weakAreas: ["Time Management", "Stress Relief", "Work-Life Balance"],
    strengths: [
      "Overall Excellence",
      "Consistent Performance",
      "Self-Motivation",
    ],
    recommendations: [
      "Encourage balanced studies with adequate breaks",
      "Explore advanced topics to maintain engagement",
      "Consider leadership roles in academic activities",
    ],
    parentTips: [
      "Celebrate her all-around excellence",
      "Ensure she takes breaks to avoid burnout",
      "Encourage her to help peers with difficult concepts",
    ],
    encouragementForStudent:
      "Emma, you're an outstanding student! Your dedication is inspiring. Keep shining! ⭐",
  },
  STU004: {
    name: "Michael Brown",
    classLevel: "Class 9",
    overallSummary:
      "Michael shows interest in technology and practical subjects. He would benefit from more structured study approach and consistent effort.",
    learningConsistency: 68,
    subjectPerformance: [
      {
        subject: "Computer Science",
        score: 84,
        trend: "up",
        minutesSpent: 540,
      },
      { subject: "Physics", score: 70, trend: "stable", minutesSpent: 360 },
      { subject: "Mathematics", score: 65, trend: "down", minutesSpent: 300 },
      { subject: "Chemistry", score: 62, trend: "down", minutesSpent: 240 },
    ],
    studyActivity: "Moderate - 1440 minutes this week",
    weakAreas: [
      "Mathematics Fundamentals",
      "Chemical Equations",
      "Theory Understanding",
    ],
    strengths: [
      "Computer Programming",
      "Practical Application",
      "Technical Skills",
    ],
    recommendations: [
      "Strengthen mathematics fundamentals with focused sessions",
      "Use practical experiments for better Chemistry understanding",
      "Increase overall study consistency with daily goals",
    ],
    parentTips: [
      "Leverage his interest in technology for learning",
      "Help set daily study targets and monitor progress",
      "Connect academic subjects to real-world applications",
    ],
    encouragementForStudent:
      "Your computer skills are great! Let's work on building a stronger foundation in all subjects. You're on the right track! 🚀",
  },
};

// Helper function to generate weekly consistency data
function generateWeeklyData(consistency: number) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const baseVariation = Math.floor(consistency * 0.1);
  return days.map((day, idx) => ({
    day,
    consistency: Math.max(
      0,
      Math.min(100, consistency + (Math.random() - 0.5) * baseVariation * 2),
    ),
  }));
}

// Helper function to generate weekly study activity
function generateWeeklyStudyActivity() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map(day => ({
    day,
    sessions: Math.floor(Math.random() * 8) + 1,
  }));
}

function AnalyticsContent() {
  const searchParams = useSearchParams();
  const childId = searchParams.get("childId");
  const [analytics, setAnalytics] = useState<ChildAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (childId) {
      loadAnalytics();
    }
  }, [childId]);

  const loadAnalytics = async () => {
    if (!childId) return;
    try {
      // Check mock data first for testing/demo
      const mockChildData = MOCK_ANALYTICS[childId.toUpperCase()];
      if (mockChildData) {
        setAnalytics(mockChildData);
        setLoading(false);
        return;
      }

      // Try to fetch from backend
      try {
        const response = await parentApi.getInsights(childId);
        if (response.data?.data) {
          const { profile, studyLogs } = response.data.data;
          console.log(`[Analytics] Full response:`, response);
          console.log(`[Analytics] Profile:`, profile);
          console.log(`[Analytics] StudyLogs:`, studyLogs);

          if (profile) {
            // Transform backend data to ChildAnalytics format
            const logs = studyLogs || [];

            // Calculate subject performance
            const subjectData: {
              [key: string]: { hours: number; count: number };
            } = {};
            logs.forEach((log: any) => {
              if (!subjectData[log.subject]) {
                subjectData[log.subject] = { hours: 0, count: 0 };
              }
              subjectData[log.subject].hours += log.durationMinutes / 60;
              subjectData[log.subject].count += 1;
            });

            const subjectPerformance = Object.entries(subjectData)
              .map(([subject, data]) => ({
                subject,
                score: Math.min(100, 50 + data.count * 10), // Base score + activity bonus
                trend: "up",
                minutesSpent: Math.round(data.hours * 60),
              }))
              .slice(0, 5); // Top 5 subjects

            // Calculate consistency
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            const weeklyLogs = logs.filter(
              (log: any) => new Date(log.createdAt) >= weekAgo,
            );
            const learningConsistency = Math.min(
              100,
              Math.round(weeklyLogs.length * 14.3),
            );

            const totalHours =
              logs.reduce(
                (sum: number, log: any) => sum + (log.durationMinutes || 0),
                0,
              ) / 60;

            const generatedAnalytics: ChildAnalytics = {
              name: profile.name || `Student ${childId}`,
              classLevel: profile.classLevel || "Unknown",
              overallSummary:
                logs.length === 0
                  ? "Getting started with learning! No activities recorded yet. Encourage your child to begin their first study session."
                  : `${profile.name || "Your child"} has studied for ${Math.round(totalHours)} hours with activities in ${Object.keys(subjectData).length} subjects.`,
              learningConsistency,
              subjectPerformance:
                subjectPerformance.length > 0
                  ? subjectPerformance
                  : [
                      {
                        subject: "No activities yet",
                        score: 0,
                        trend: "stable",
                        minutesSpent: 0,
                      },
                    ],
              studyActivity:
                logs.length === 0
                  ? "No activity recorded - Get started!"
                  : `${logs.length} study sessions this week - Great start!`,
              weakAreas:
                Object.keys(subjectData).length === 0
                  ? ["All areas to explore"]
                  : Object.entries(subjectData)
                      .sort(([, a], [, b]) => a.count - b.count)
                      .slice(0, 3)
                      .map(([subject]) => subject),
              strengths: Object.entries(subjectData)
                .sort(([, a], [, b]) => b.count - a.count)
                .slice(0, 3)
                .map(([subject]) => subject),
              recommendations:
                logs.length === 0
                  ? [
                      "Encourage your child to start with their first study session",
                      "Help set up a study schedule for consistency",
                      "Choose their favorite subject to start with",
                    ]
                  : [
                      "Continue the momentum with regular study sessions",
                      `Focus more time on weak areas: ${Object.keys(subjectData).length === 1 ? "explore more subjects" : Object.entries(subjectData).sort(([, a], [, b]) => a.count - b.count)[0][0]}`,
                      "Set weekly study goals to build consistency",
                    ],
              parentTips: [
                "Even small study sessions add up to big progress",
                "Celebrate each learning milestone with your child",
                "Check back here regularly to track improvement",
              ],
              encouragementForStudent:
                logs.length === 0
                  ? "You're about to start an amazing learning journey! Take that first step today! 🚀"
                  : `Great effort! You've already logged ${logs.length} study session${logs.length > 1 ? "s" : ""}. Keep it up! 💪`,
            };

            setAnalytics(generatedAnalytics);
            setLoading(false);
            return;
          }
        }
      } catch (apiError) {
        // API failed, continue to check mock data
      }

      // Check mock data
      const childData = MOCK_ANALYTICS[childId.toUpperCase()];
      if (childData) {
        setAnalytics(childData);
      } else {
        // No data available - this is normal for real students
        // Store that data is not available
        setAnalytics(null);
      }
    } catch (error) {
      console.error("Error loading analytics:", error);
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (score: number) => {
    if (score >= 75) return "text-green-600 dark:text-green-400";
    if (score >= 50) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const scoreBarColor = (score: number) => {
    if (score >= 75) return "bg-green-500";
    if (score >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  if (!childId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="inline-block p-6 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 mb-6">
            <AlertCircle className="w-16 h-16 text-purple-400" />
          </div>
          <p className="text-slate-100 text-lg mb-2 font-semibold">
            Select a Child
          </p>
          <p className="text-slate-400 mb-8">
            Please select a child to view their analytics and learning insights.
          </p>
          <a
            href="/parent/children"
            className="inline-block px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Go to Children
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="relative w-20 h-20 mb-6 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-slate-700/30" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin" />
          </div>
          <p className="text-slate-400 text-lg">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    // Get the child name from localStorage if available
    const linkedChildrenStr =
      typeof window !== "undefined"
        ? localStorage.getItem("parent_linked_children")
        : null;
    let childName = childId || "Student";

    if (linkedChildrenStr) {
      try {
        const linkedChildren = JSON.parse(linkedChildrenStr);
        const child = linkedChildren.find((c: any) => c.id === childId);
        if (child) {
          childName = child.name;
        }
      } catch (e) {
        // Continue with default
      }
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="inline-block p-6 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 mb-6">
            <AlertCircle className="w-16 h-16 text-amber-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100 mb-2">
            Analytics Not Yet Available
          </h2>
          <p className="text-slate-400 mb-6">
            Analytics data for{" "}
            <strong className="text-slate-200">{childName}</strong> will appear
            here once their learning activities are tracked.
          </p>
          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
            <p className="text-sm text-blue-200">
              💡 Have your child complete learning activities to start building
              their analytics profile.
            </p>
          </div>
          <a
            href="/parent/children"
            className="inline-block px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Back to Children
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Animated background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 p-6 lg:p-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <a
              href="/parent"
              className="p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-slate-200 transition-all"
            >
              ←
            </a>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 text-transparent bg-clip-text">
            {analytics.name}'s Analytics
          </h1>
          <p className="text-slate-400 text-sm">
            {analytics.classLevel} • Detailed learning insights
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {/* Learning Consistency */}
          <div
            className="group relative overflow-hidden rounded-2xl p-6 bg-white/5 backdrop-blur-xl border border-slate-700/50 shadow-lg hover:shadow-2xl transition-all duration-300 animate-fade-in"
            style={{ animationDelay: "100ms" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-green-500/20 group-hover:opacity-30 opacity-10 transition-opacity" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-300">
                  Learning Consistency
                </h3>
                <div className="p-2.5 rounded-lg bg-green-500/20 text-green-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <p className={`text-4xl font-bold mb-2 text-green-400`}>
                {analytics.learningConsistency}%
              </p>
              <p className="text-xs text-slate-400">
                {analytics.learningConsistency >= 80
                  ? "✨ Excellent engagement"
                  : analytics.learningConsistency >= 60
                    ? "📈 Good progress"
                    : "⚡ Needs improvement"}
              </p>
            </div>
          </div>

          {/* Strong Subjects */}
          <div
            className="group relative overflow-hidden rounded-2xl p-6 bg-white/5 backdrop-blur-xl border border-slate-700/50 shadow-lg hover:shadow-2xl transition-all duration-300 animate-fade-in"
            style={{ animationDelay: "200ms" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-blue-500/20 group-hover:opacity-30 opacity-10 transition-opacity" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-300">Strong Subjects</h3>
                <div className="p-2.5 rounded-lg bg-blue-500/20 text-blue-400">
                  <Award className="w-5 h-5" />
                </div>
              </div>
              <p className="text-4xl font-bold text-blue-400 mb-2">
                {analytics.strengths?.length || 0}
              </p>
              <p className="text-xs text-slate-400">Topics performing well</p>
            </div>
          </div>

          {/* Focus Areas */}
          <div
            className="group relative overflow-hidden rounded-2xl p-6 bg-white/5 backdrop-blur-xl border border-slate-700/50 shadow-lg hover:shadow-2xl transition-all duration-300 animate-fade-in"
            style={{ animationDelay: "300ms" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-orange-500/20 group-hover:opacity-30 opacity-10 transition-opacity" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-300">Focus Areas</h3>
                <div className="p-2.5 rounded-lg bg-orange-500/20 text-orange-400">
                  <Target className="w-5 h-5" />
                </div>
              </div>
              <p className="text-4xl font-bold text-orange-400 mb-2">
                {analytics.weakAreas?.length || 0}
              </p>
              <p className="text-xs text-slate-400">Topics for improvement</p>
            </div>
          </div>
        </div>

        {/* Overall Summary */}
        <div
          className="rounded-2xl p-6 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-red-500/10 border border-purple-500/30 shadow-lg mb-10 backdrop-blur-xl animate-fade-in"
          style={{ animationDelay: "400ms" }}
        >
          <h3 className="font-semibold text-base text-purple-300 mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            📚 Overall Summary
          </h3>
          <p className="text-slate-200 leading-relaxed text-sm">
            {analytics.overallSummary}
          </p>
        </div>

        {/* Subject Performance Bar Chart */}
        {analytics.subjectPerformance &&
          analytics.subjectPerformance.length > 0 && (
            <div
              className="rounded-2xl p-6 bg-white/5 backdrop-blur-xl border border-slate-700/50 shadow-lg mb-10 animate-fade-in"
              style={{ animationDelay: "500ms" }}
            >
              <h3 className="font-semibold text-lg text-slate-100 mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-400" />
                Subject Performance Scores
              </h3>
              <div className="w-full h-80 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.subjectPerformance}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(100,116,139,0.3)"
                    />
                    <XAxis dataKey="subject" stroke="rgb(148,163,184)" />
                    <YAxis stroke="rgb(148,163,184)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(15,23,42,0.95)",
                        border: "1px solid rgba(100,116,139,0.5)",
                        borderRadius: "8px",
                        color: "rgb(226,232,240)",
                      }}
                      formatter={value => `${value}%`}
                    />
                    <Bar
                      dataKey="score"
                      fill="url(#colorGradient)"
                      radius={[8, 8, 0, 0]}
                    />
                    <defs>
                      <linearGradient
                        id="colorGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="5%" stopColor="rgb(139,92,246)" />
                        <stop offset="95%" stopColor="rgb(236,72,153)" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Subject Details Grid */}
              <div className="grid md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-700/50">
                {analytics.subjectPerformance.map((subject, idx) => (
                  <div
                    key={idx}
                    className="group p-3 rounded-xl bg-slate-800/30 hover:bg-slate-800/60 border border-slate-700/50 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-100 text-sm">
                        {subject.subject}
                      </span>
                      <span className="text-lg font-bold text-transparent bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text">
                        {subject.score}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>⏱️ {subject.minutesSpent} mins/week</span>
                      <span>
                        {subject.trend === "up"
                          ? "↑ Improving"
                          : subject.trend === "down"
                            ? "↓ Declining"
                            : "→ Stable"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Study Hours Distribution Pie Chart */}
        {analytics.subjectPerformance &&
          analytics.subjectPerformance.length > 0 && (
            <div
              className="rounded-2xl p-6 bg-white/5 backdrop-blur-xl border border-slate-700/50 shadow-lg mb-10 animate-fade-in"
              style={{ animationDelay: "600ms" }}
            >
              <h3 className="font-semibold text-lg text-slate-100 mb-6 flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-cyan-400" />
                Study Time Distribution by Subject
              </h3>
              <div className="w-full h-80 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.subjectPerformance}
                      dataKey="minutesSpent"
                      nameKey="subject"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={50}
                      paddingAngle={2}
                      label={({ name, value }) => `${name}: ${value} mins`}
                    >
                      {analytics.subjectPerformance.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            [
                              "rgb(139,92,246)",
                              "rgb(236,72,153)",
                              "rgb(34,197,94)",
                              "rgb(34,211,238)",
                              "rgb(249,115,22)",
                            ][index % 5]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(15,23,42,0.95)",
                        border: "1px solid rgba(100,116,139,0.5)",
                        borderRadius: "8px",
                        color: "rgb(226,232,240)",
                      }}
                      formatter={(value: any) => `${value || 0} mins/week`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Legend */}
              <div className="mt-6 pt-6 border-t border-slate-700/50 grid grid-cols-2 md:grid-cols-3 gap-3">
                {analytics.subjectPerformance.map((subject, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: [
                          "rgb(139,92,246)",
                          "rgb(236,72,153)",
                          "rgb(34,197,94)",
                          "rgb(34,211,238)",
                          "rgb(249,115,22)",
                        ][idx % 5],
                      }}
                    />
                    <span className="text-xs text-slate-300">
                      {subject.subject}: {subject.minutesSpent} mins/week
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Learning Progress Trend Chart */}
        <div
          className="rounded-2xl p-6 bg-white/5 backdrop-blur-xl border border-slate-700/50 shadow-lg mb-10 animate-fade-in"
          style={{ animationDelay: "700ms" }}
        >
          <h3 className="font-semibold text-lg text-slate-100 mb-6 flex items-center gap-2">
            <LineChartIcon className="w-5 h-5 text-green-400" />
            Learning Consistency Trend
          </h3>
          <div className="w-full h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={generateWeeklyData(analytics.learningConsistency)}
              >
                <defs>
                  <linearGradient
                    id="colorConsistency"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="rgb(34,197,94)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="rgb(34,197,94)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(100,116,139,0.3)"
                />
                <XAxis dataKey="day" stroke="rgb(148,163,184)" />
                <YAxis stroke="rgb(148,163,184)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15,23,42,0.95)",
                    border: "1px solid rgba(100,116,139,0.5)",
                    borderRadius: "8px",
                    color: "rgb(226,232,240)",
                  }}
                  formatter={value => `${value}%`}
                />
                <Area
                  type="monotone"
                  dataKey="consistency"
                  stroke="rgb(34,197,94)"
                  fillOpacity={1}
                  fill="url(#colorConsistency)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Activity Chart */}
        <div
          className="rounded-2xl p-6 bg-white/5 backdrop-blur-xl border border-slate-700/50 shadow-lg mb-10 animate-fade-in"
          style={{ animationDelay: "800ms" }}
        >
          <h3 className="font-semibold text-lg text-slate-100 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            Weekly Study Activity
          </h3>
          <div className="w-full h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={generateWeeklyStudyActivity()}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(100,116,139,0.3)"
                />
                <XAxis dataKey="day" stroke="rgb(148,163,184)" />
                <YAxis stroke="rgb(148,163,184)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15,23,42,0.95)",
                    border: "1px solid rgba(100,116,139,0.5)",
                    borderRadius: "8px",
                    color: "rgb(226,232,240)",
                  }}
                  formatter={value => `${value} sessions`}
                />
                <Bar
                  dataKey="sessions"
                  fill="url(#gradientBar)"
                  radius={[8, 8, 0, 0]}
                />
                <defs>
                  <linearGradient id="gradientBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgb(59,130,246)" />
                    <stop offset="95%" stopColor="rgb(34,211,238)" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Score Gauge */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {analytics.strengths && analytics.strengths.length > 0 && (
            <div
              className="group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 shadow-lg backdrop-blur-xl animate-fade-in"
              style={{ animationDelay: "900ms" }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-br from-green-400 to-emerald-400 transition-opacity" />
              <h3 className="font-semibold text-base text-green-300 mb-4 flex items-center gap-2 relative z-10">
                <Award className="w-6 h-6" />⭐ Strengths
              </h3>
              <ul className="space-y-3 relative z-10">
                {analytics.strengths.map((strength, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-lg bg-green-500/10 hover:bg-green-500/20 transition-colors"
                  >
                    <span className="text-green-400 font-bold text-xl">✓</span>
                    <span className="text-slate-100">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analytics.weakAreas && analytics.weakAreas.length > 0 && (
            <div
              className="group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 shadow-lg backdrop-blur-xl animate-fade-in"
              style={{ animationDelay: "1000ms" }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-br from-orange-400 to-red-400 transition-opacity" />
              <h3 className="font-semibold text-base text-orange-300 mb-4 flex items-center gap-2 relative z-10">
                <Target className="w-6 h-6" />
                🎯 Areas to Focus
              </h3>
              <ul className="space-y-3 relative z-10">
                {analytics.weakAreas.map((area, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 transition-colors"
                  >
                    <span className="text-orange-400 font-bold text-xl">→</span>
                    <span className="text-slate-100">{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Recommendations */}
        {analytics.recommendations && analytics.recommendations.length > 0 && (
          <div
            className="rounded-2xl p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 shadow-lg mb-10 backdrop-blur-xl animate-fade-in"
            style={{ animationDelay: "1100ms" }}
          >
            <h3 className="font-semibold text-lg text-blue-300 mb-4 flex items-center gap-2">
              <Zap className="w-6 h-6" />
              💡 AI Recommendations
            </h3>
            <div className="space-y-4">
              {analytics.recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 hover:border-blue-500/40 transition-all hover:bg-blue-500/20"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 text-slate-900 text-sm font-bold flex items-center justify-center flex-shrink-0 shadow-lg">
                    {idx + 1}
                  </div>
                  <p className="text-slate-100 text-lg">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Parent Tips */}
        {analytics.parentTips && analytics.parentTips.length > 0 && (
          <div
            className="rounded-2xl p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 shadow-lg mb-10 backdrop-blur-xl animate-fade-in"
            style={{ animationDelay: "1200ms" }}
          >
            <h3 className="font-semibold text-lg text-purple-300 mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5" />
              💝 Tips for You
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {analytics.parentTips.map((tip, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-purple-500/10 border border-purple-500/20 hover:border-purple-500/40 hover:bg-purple-500/20 transition-all"
                >
                  <p className="text-slate-100">💡 {tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Encouragement */}
        {analytics.encouragementForStudent && (
          <div
            className="rounded-2xl p-6 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border border-amber-500/30 shadow-lg backdrop-blur-xl relative overflow-hidden animate-fade-in"
            style={{ animationDelay: "1300ms" }}
          >
            <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-amber-500/10 blur-3xl" />
            <div className="relative z-10">
              <h3 className="font-semibold text-lg text-amber-300 mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                🌟 Daily Encouragement
              </h3>
              <p className="italic text-slate-100 text-base leading-relaxed mb-3 bg-gradient-to-r from-amber-200 to-orange-200 bg-clip-text text-transparent">
                "{analytics.encouragementForStudent}"
              </p>
              <p className="text-xs text-slate-400">
                💭 Share this message with your child to keep them motivated!
              </p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <SearchParamsWrapper>
      <AnalyticsContent />
    </SearchParamsWrapper>
  );
}
