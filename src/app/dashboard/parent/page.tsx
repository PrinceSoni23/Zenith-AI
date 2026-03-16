"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { parentApi } from "@/lib/api";
import toast from "react-hot-toast";
import {
  Users,
  Loader2,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  BookOpen,
  Clock,
  BarChart2,
} from "lucide-react";

interface SubjectPerformance {
  subject: string;
  score: number;
  trend: string;
  hoursSpent: number;
}
interface ParentInsightResult {
  overallSummary: string;
  learningConsistency: number;
  subjectPerformance: SubjectPerformance[];
  studyActivity: string;
  weakAreas: string[];
  strengths: string[];
  recommendations: string[];
  parentTips: string[];
  encouragementForStudent: string;
}

export default function ParentPage() {
  const [loading, setLoading] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [result, setResult] = useState<ParentInsightResult | null>(null);
  const [linkedStudents, setLinkedStudents] = useState<
    { id: string; name: string }[]
  >([]);

  useEffect(() => {
    parentApi
      .getLinkedStudents()
      .then(res => {
        setLinkedStudents(res.data.data || []);
      })
      .catch(() => {});
  }, []);

  const handleGetInsights = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId.trim()) {
      toast.error("Please enter a student ID");
      return;
    }
    setLoading(true);
    try {
      const res = await parentApi.getInsights(studentId);
      setResult(res.data.data);
      toast.success("Student insights loaded!");
    } catch {
      toast.error("Failed to load insights. Please check the student ID.");
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (s: number) =>
    s >= 75 ? "bg-green-500" : s >= 50 ? "bg-yellow-500" : "bg-red-500";
  const scoreTextColor = (s: number) =>
    s >= 75
      ? "text-green-600 dark:text-green-400"
      : s >= 50
        ? "text-yellow-600 dark:text-yellow-400"
        : "text-red-600 dark:text-red-400";

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-dark-950">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8 max-w-3xl mx-auto">
          <div className="mb-8 flex items-center gap-4 animate-fade-up stagger-1">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center animate-bounce-gentle">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
                Parent Dashboard
              </h1>
              <p className="text-sm mt-0.5 text-slate-500 dark:text-slate-400">
                Monitor your child&apos;s learning progress and get AI-powered
                insights
              </p>
            </div>
          </div>

          <div className="rounded-2xl p-6 mb-6 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 animate-fade-up stagger-2">
            <h2 className="text-base font-bold mb-4 text-slate-900 dark:text-slate-100">
              View Student Insights
            </h2>
            <form onSubmit={handleGetInsights} className="space-y-4">
              {linkedStudents.length > 0 ? (
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                    Select your child
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {linkedStudents.map(student => (
                      <button
                        key={student.id}
                        type="button"
                        onClick={() => setStudentId(student.id)}
                        className={`p-3 rounded-xl border-2 text-left transition-all ${
                          studentId === student.id
                            ? "border-teal-500 bg-teal-50 dark:bg-teal-500/10"
                            : "border-slate-200 dark:border-dark-700 bg-slate-50 dark:bg-dark-800"
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400 font-bold mb-2">
                          {student.name[0]}
                        </div>
                        <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                          {student.name}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                    Student ID
                  </label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={e => setStudentId(e.target.value)}
                    placeholder="Enter your child's Student ID"
                    className="input-field"
                  />
                  <p className="text-xs mt-1 text-slate-400 dark:text-slate-500">
                    Ask your child to share their Student ID from their profile
                    page
                  </p>
                </div>
              )}
              <button
                type="submit"
                disabled={loading || !studentId}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading
                    insights…
                  </>
                ) : (
                  <>
                    <BarChart2 className="w-4 h-4" /> Get AI Insights
                  </>
                )}
              </button>
            </form>
          </div>

          {result && (
            <div className="space-y-5 animate-fade-in">
              <div className="rounded-2xl p-6 bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100">
                    Overall Summary
                  </h3>
                  <div className="text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Learning Consistency
                    </p>
                    <p
                      className={`text-2xl font-black ${scoreTextColor(result.learningConsistency)}`}
                    >
                      {result.learningConsistency}%
                    </p>
                  </div>
                </div>
                <p className="leading-relaxed text-sm text-slate-700 dark:text-slate-300">
                  {result.overallSummary}
                </p>
              </div>

              {result.studyActivity && (
                <div className="rounded-2xl p-5 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 hover-lift border-glow">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <h3 className="font-bold text-slate-900 dark:text-slate-100">
                      Study Activity
                    </h3>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {result.studyActivity}
                  </p>
                </div>
              )}

              {result.subjectPerformance &&
                result.subjectPerformance.length > 0 && (
                  <div className="rounded-2xl p-5 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 hover-lift border-glow">
                    <div className="flex items-center gap-2 mb-4">
                      <BookOpen className="w-5 h-5 text-purple-500" />
                      <h3 className="font-bold text-slate-900 dark:text-slate-100">
                        Subject Performance
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {result.subjectPerformance.map((sub, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-dark-800"
                        >
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                {sub.subject}
                              </span>
                              <div className="flex items-center gap-1">
                                {sub.trend === "up" && (
                                  <TrendingUp className="w-4 h-4 text-green-500" />
                                )}
                                {sub.trend === "down" && (
                                  <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />
                                )}
                                <span
                                  className={`text-sm font-bold ${scoreTextColor(sub.score)}`}
                                >
                                  {sub.score}%
                                </span>
                              </div>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-dark-700">
                              <div
                                className={`h-2 rounded-full transition-all ${scoreColor(sub.score)}`}
                                style={{ width: `${sub.score}%` }}
                              />
                            </div>
                          </div>
                          {sub.hoursSpent !== undefined && (
                            <span className="text-xs whitespace-nowrap text-slate-500 dark:text-slate-400">
                              {sub.hoursSpent}h
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              <div className="grid grid-cols-2 gap-4">
                {result.strengths && result.strengths.length > 0 && (
                  <div className="rounded-2xl p-5 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 hover-lift border-glow">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <h3 className="font-bold text-slate-900 dark:text-slate-100">
                        Strengths
                      </h3>
                    </div>
                    <ul className="space-y-2 animate-fade-up">
                      {result.strengths.map((s, i) => (
                        <li
                          key={i}
                          className="text-sm flex items-start gap-2 text-slate-700 dark:text-slate-300"
                        >
                          <span className="text-green-500 font-bold">✓</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {result.weakAreas && result.weakAreas.length > 0 && (
                  <div className="rounded-2xl p-5 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 hover-lift border-glow">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-5 h-5 text-orange-500" />
                      <h3 className="font-bold text-slate-900 dark:text-slate-100">
                        Needs Attention
                      </h3>
                    </div>
                    <ul className="space-y-2 animate-fade-up">
                      {result.weakAreas.map((w, i) => (
                        <li
                          key={i}
                          className="text-sm flex items-start gap-2 text-slate-700 dark:text-slate-300"
                        >
                          <span className="text-orange-500 font-bold">!</span>
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {result.recommendations && result.recommendations.length > 0 && (
                <div className="rounded-2xl p-5 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 hover-lift border-glow">
                  <h3 className="font-bold mb-3 text-slate-900 dark:text-slate-100">
                    AI Recommendations
                  </h3>
                  <ul className="space-y-2 animate-fade-up">
                    {result.recommendations.map((r, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm p-2 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-slate-700 dark:text-slate-300"
                      >
                        <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.parentTips && result.parentTips.length > 0 && (
                <div className="rounded-2xl p-5 bg-teal-50 dark:bg-teal-500/10 border-2 border-teal-300 dark:border-teal-500/30">
                  <h3 className="font-bold mb-3 text-teal-700 dark:text-teal-400">
                    Tips for You as a Parent
                  </h3>
                  <ul className="space-y-2 animate-fade-up">
                    {result.parentTips.map((tip, i) => (
                      <li
                        key={i}
                        className="text-sm text-slate-700 dark:text-slate-300"
                      >
                        💡 {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.encouragementForStudent && (
                <div className="rounded-2xl p-5 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20">
                  <h3 className="font-bold mb-2 text-yellow-700 dark:text-yellow-400">
                    Message for Your Child
                  </h3>
                  <p className="italic text-sm text-slate-700 dark:text-slate-300">
                    &quot;{result.encouragementForStudent}&quot;
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
