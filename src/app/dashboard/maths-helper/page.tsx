"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { agentApi } from "@/lib/api";
import toast from "react-hot-toast";
import { Calculator, Loader2 } from "lucide-react";

interface MathResult {
  mode: string;
  hints?: string[];
  steps?: { stepNumber: number; description: string; calculation: string }[];
  fullSolution?: string;
  answer?: string;
  conceptsUsed?: string[];
  formulasApplied?: string[];
  commonMistakes?: string[];
}

export default function MathsHelperPage() {
  const [problem, setProblem] = useState("");
  const [topic, setTopic] = useState("");
  const [mode, setMode] = useState<"hint" | "step-by-step" | "full-solution">(
    "step-by-step",
  );
  const [result, setResult] = useState<MathResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSolve = async () => {
    if (!problem.trim()) return toast.error("Please enter a maths problem");
    setLoading(true);
    try {
      const res = await agentApi.dispatch("maths-solver", {
        content: problem,
        topic: topic || "General",
        mode,
        subject: "Mathematics",
      });
      setResult(res.data.data as MathResult);
    } catch {
      toast.error("Failed to solve. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const modeOptions = [
    { value: "hint", label: " Hint Mode", desc: "Get hints only" },
    { value: "step-by-step", label: " Step by Step", desc: "See each step" },
    {
      value: "full-solution",
      label: " Full Solution",
      desc: "Complete answer",
    },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-dark-950">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8 max-w-3xl mx-auto">
          <div className="mb-8 flex items-center gap-4 animate-fade-up stagger-1">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center animate-bounce-gentle">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
                Maths Helper
              </h1>
              <p className="text-sm mt-0.5 text-slate-500 dark:text-slate-400">
                Paste any maths problem — get hints, steps, or full solution!
              </p>
            </div>
          </div>
          <div className="rounded-2xl p-6 mb-6 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 animate-fade-up stagger-2">
            <div className="mb-5">
              <label className="block text-sm font-semibold mb-3 text-slate-800 dark:text-slate-200">
                Choose Mode
              </label>
              <div className="grid grid-cols-3 gap-3">
                {modeOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setMode(opt.value as typeof mode)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${mode === opt.value ? "border-primary-500 bg-primary-50 dark:bg-primary-500/10" : "border-slate-200 dark:border-dark-700 bg-slate-50 dark:bg-dark-950"}`}
                  >
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {opt.label}
                    </p>
                    <p className="text-xs mt-0.5 text-slate-500 dark:text-slate-400">
                      {opt.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-slate-800 dark:text-slate-200">
                Topic (optional)
              </label>
              <input
                className="input-field"
                placeholder="e.g. Algebra, Trigonometry..."
                value={topic}
                onChange={e => setTopic(e.target.value)}
              />
            </div>
            <div className="mb-5">
              <label className="block text-sm font-semibold mb-2 text-slate-800 dark:text-slate-200">
                Your Maths Problem
              </label>
              <textarea
                className="input-field min-h-[120px] resize-none font-mono"
                placeholder="Type your maths problem here..."
                value={problem}
                onChange={e => setProblem(e.target.value)}
              />
            </div>
            <button
              onClick={handleSolve}
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Solving…
                </>
              ) : (
                <>🧮 Solve Problem</>
              )}
            </button>
          </div>
          {result && (
            <div className="space-y-4 animate-fade-in">
              {result.hints && result.hints.length > 0 && (
                <div className="rounded-2xl p-6 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/30">
                  <h3 className="font-bold mb-3 text-yellow-600 dark:text-yellow-400">
                    💡 Hints
                  </h3>
                  <ol className="space-y-2">
                    {result.hints.map((hint, i) => (
                      <li
                        key={i}
                        className="flex gap-2 text-sm text-slate-800 dark:text-slate-200"
                      >
                        <span className="font-bold text-yellow-600 dark:text-yellow-400">
                          {i + 1}.
                        </span>
                        {hint}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
              {result.steps && result.steps.length > 0 && (
                <div className="rounded-2xl p-6 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 hover-lift border-glow">
                  <h3 className="font-bold mb-4 text-slate-900 dark:text-slate-100">
                    🔢 Step-by-Step Solution
                  </h3>
                  <div className="space-y-3">
                    {result.steps.map(step => (
                      <div key={step.stepNumber} className="flex gap-3">
                        <div className="w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          {step.stepNumber}
                        </div>
                        <div>
                          <p className="text-sm text-slate-800 dark:text-slate-200">
                            {step.description}
                          </p>
                          {step.calculation && (
                            <code className="text-sm px-2 py-0.5 rounded mt-1 block font-mono bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-slate-400">
                              {step.calculation}
                            </code>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {result.fullSolution && (
                <div className="rounded-2xl p-6 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30">
                  <h3 className="font-bold mb-2 text-green-600 dark:text-green-400">
                    ✅ Full Solution
                  </h3>
                  <p className="text-sm whitespace-pre-wrap text-slate-800 dark:text-slate-200">
                    {result.fullSolution}
                  </p>
                </div>
              )}
              {result.answer && (
                <div className="rounded-2xl p-6 bg-primary-50 dark:bg-primary-500/10 border border-primary-200 dark:border-primary-500/30">
                  <h3 className="font-bold mb-1 text-primary-600 dark:text-primary-400">
                    🎯 Answer
                  </h3>
                  <p className="text-xl font-black text-primary-600 dark:text-primary-400">
                    {result.answer}
                  </p>
                </div>
              )}
              {result.conceptsUsed && result.conceptsUsed.length > 0 && (
                <div className="rounded-2xl p-6 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 hover-lift border-glow">
                  <h3 className="font-bold mb-3 text-slate-900 dark:text-slate-100">
                    📚 Concepts Used
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.conceptsUsed.map((c, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
