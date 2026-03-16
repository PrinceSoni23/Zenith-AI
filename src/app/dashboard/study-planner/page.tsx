"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { agentApi } from "@/lib/api";
import toast from "react-hot-toast";
import {
  Calendar,
  Loader2,
  Sparkles,
  CheckSquare,
  Square,
  Target,
} from "lucide-react";

interface Task {
  title: string;
  description: string;
  subject: string;
  taskType: string;
  estimatedMinutes: number;
  priority: string;
}

interface PlanResult {
  todaysTasks?: Task[];
  weeklyGoals?: string[];
  motivationalMessage?: string;
  studyTip?: string;
  totalEstimatedMinutes?: number;
}

const taskTypeIcons: Record<string, string> = {
  revise: "🔁",
  read: "📖",
  solve: "🧮",
  write: "✍️",
  practice: "💪",
};

export default function StudyPlannerPage() {
  const [result, setResult] = useState<PlanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set());

  const generatePlan = async () => {
    setLoading(true);
    try {
      const res = await agentApi.getDailyFlow();
      setResult(res.data.data.tasks as PlanResult);
      toast.success("Daily plan generated!");
    } catch {
      toast.error("Failed to generate plan.");
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = (index: number) => {
    setCompletedTasks(prev => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  const priorityClass: Record<string, string> = {
    high: "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-500/20",
    medium:
      "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-500/20",
    low: "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-500/20",
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-dark-950">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8 max-w-3xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center animate-bounce-gentle">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
                  Study Planner
                </h1>
                <p className="text-sm mt-0.5 text-slate-500 dark:text-slate-400">
                  Get your personalised daily micro-tasks
                </p>
              </div>
            </div>
            <button
              onClick={generatePlan}
              disabled={loading}
              className="btn-primary flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Planning…
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Generate Plan
                </>
              )}
            </button>
          </div>

          {!result && (
            <div className="rounded-2xl p-16 text-center bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-primary-500" />
              <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-slate-100">
                Your daily plan is waiting
              </h3>
              <p className="text-sm mb-6 text-slate-500 dark:text-slate-400">
                Click &quot;Generate Plan&quot; to get AI-powered micro-tasks
                for today
              </p>
              <button
                onClick={generatePlan}
                disabled={loading}
                className="btn-primary"
              >
                Generate My Plan
              </button>
            </div>
          )}

          {result && (
            <div className="space-y-5 animate-fade-in">
              {result.totalEstimatedMinutes && (
                <div className="rounded-2xl p-5 flex items-center justify-between bg-primary-50 dark:bg-primary-500/10 border border-primary-200 dark:border-primary-500/20">
                  <div>
                    <p className="text-sm font-medium text-primary-600 dark:text-primary-400">
                      Total Study Time Today
                    </p>
                    <p className="text-3xl font-black text-primary-600 dark:text-primary-400">
                      {result.totalEstimatedMinutes} min
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-primary-500">
                      {result.todaysTasks?.length || 0} tasks
                    </p>
                    <p className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                      {completedTasks.size} done
                    </p>
                  </div>
                </div>
              )}

              {result.todaysTasks && result.todaysTasks.length > 0 && (
                <div className="rounded-2xl p-6 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 hover-lift border-glow">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Progress
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {completedTasks.size}/{result.todaysTasks.length}
                    </p>
                  </div>
                  <div className="h-2.5 rounded-full mb-5 bg-slate-100 dark:bg-dark-700">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-green-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${(completedTasks.size / result.todaysTasks.length) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    {result.todaysTasks.map((task, i) => (
                      <div
                        key={i}
                        onClick={() => toggleTask(i)}
                        className={`flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all border ${
                          completedTasks.has(i)
                            ? "bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20 opacity-70"
                            : "bg-slate-50 dark:bg-dark-800 border-slate-100 dark:border-dark-700"
                        }`}
                      >
                        {completedTasks.has(i) ? (
                          <CheckSquare className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <Square className="w-5 h-5 flex-shrink-0 mt-0.5 text-slate-400 dark:text-slate-500" />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span>{taskTypeIcons[task.taskType] || "📌"}</span>
                            <p
                              className={`text-sm font-semibold text-slate-800 dark:text-slate-200 ${completedTasks.has(i) ? "line-through opacity-50" : ""}`}
                            >
                              {task.title}
                            </p>
                            <span
                              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${priorityClass[task.priority] || "text-slate-500 bg-slate-100 dark:bg-slate-700"}`}
                            >
                              {task.priority}
                            </span>
                          </div>
                          <p className="text-xs mt-1 text-slate-500 dark:text-slate-400">
                            {task.subject} · {task.estimatedMinutes} min
                          </p>
                          {task.description && (
                            <p className="text-xs mt-1 text-slate-500 dark:text-slate-400">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.weeklyGoals && result.weeklyGoals.length > 0 && (
                <div className="rounded-2xl p-6 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-5 h-5 text-purple-500" />
                    <h3 className="font-bold text-purple-600 dark:text-purple-400">
                      Weekly Goals
                    </h3>
                  </div>
                  <ul className="space-y-2 animate-fade-up">
                    {result.weeklyGoals.map((goal, i) => (
                      <li
                        key={i}
                        className="text-sm flex gap-2 text-purple-700 dark:text-purple-300"
                      >
                        <span>→</span>
                        {goal}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.studyTip && (
                <div className="rounded-2xl p-5 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20">
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    <span className="font-bold">💡 Tip: </span>
                    {result.studyTip}
                  </p>
                </div>
              )}

              {result.motivationalMessage && (
                <div className="rounded-2xl p-6 text-center bg-gradient-to-r from-primary-600 to-purple-600">
                  <p className="text-white text-lg font-semibold">
                    💪 {result.motivationalMessage}
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
