"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { agentApi } from "@/lib/api";
import toast from "react-hot-toast";
import { Brain, Loader2, Sparkles } from "lucide-react";

interface TranslatorResult {
  simpleExplanation: string;
  realLifeExample: string;
  keyPoints: string[];
  relatedConcepts: string[];
  translatedContent: string;
}

export default function ClassTranslatorPage() {
  const [content, setContent] = useState("");
  const [subject, setSubject] = useState("");
  const [result, setResult] = useState<TranslatorResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return toast.error("Please describe what was taught");
    setLoading(true);
    try {
      const res = await agentApi.dispatch("class-translator", {
        content,
        subject,
      });
      setResult(res.data.data);
    } catch {
      toast.error("Failed to process. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-dark-950">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8 max-w-3xl mx-auto">
          <div className="mb-8 flex items-center gap-4 animate-fade-up stagger-1">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center animate-bounce-gentle">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
                Understand Today&apos;s Class
              </h1>
              <p className="text-sm mt-0.5 text-slate-500 dark:text-slate-400">
                Paste what your teacher taught — get a simple explanation!
              </p>
            </div>
          </div>

          <div className="rounded-2xl p-6 mb-6 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 animate-fade-up stagger-2">
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-slate-800 dark:text-slate-200">
                Subject
              </label>
              <input
                className="input-field"
                placeholder="e.g. Science, History, Maths..."
                value={subject}
                onChange={e => setSubject(e.target.value)}
              />
            </div>
            <div className="mb-5">
              <label className="block text-sm font-semibold mb-2 text-slate-800 dark:text-slate-200">
                What was taught in class?
              </label>
              <textarea
                className="input-field min-h-[140px] resize-none"
                placeholder="Describe what the teacher taught today. You can write in your own language too!"
                value={content}
                onChange={e => setContent(e.target.value)}
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Processing…
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Make it Simple
                </>
              )}
            </button>
          </div>

          {result && (
            <div className="space-y-4 animate-fade-in">
              <ResultSection
                title="📖 Simple Explanation"
                content={result.simpleExplanation}
                accent="blue"
              />
              <ResultSection
                title="🌍 Real-Life Example"
                content={result.realLifeExample}
                accent="green"
              />

              {Array.isArray(result.keyPoints) &&
                result.keyPoints.length > 0 && (
                  <div className="rounded-2xl p-6 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 hover-lift border-glow">
                    <h3 className="font-bold mb-3 text-slate-900 dark:text-slate-100">
                      🔑 Key Points
                    </h3>
                    <ul className="space-y-2 animate-fade-up">
                      {result.keyPoints.map((pt, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"
                        >
                          <span className="text-primary-500 mt-0.5 flex-shrink-0">
                            •
                          </span>{" "}
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {result.translatedContent && (
                <ResultSection
                  title="🌐 In Your Language"
                  content={result.translatedContent}
                  accent="purple"
                />
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function ResultSection({
  title,
  content,
  accent,
}: {
  title: string;
  content: string;
  accent: string;
}) {
  const accentMap: Record<
    string,
    { light: string; dark: string; border: string; text: string }
  > = {
    blue: {
      light: "bg-blue-50",
      dark: "dark:bg-blue-500/10",
      border: "border-blue-200 dark:border-blue-500/30",
      text: "text-blue-600 dark:text-blue-400",
    },
    green: {
      light: "bg-green-50",
      dark: "dark:bg-green-500/10",
      border: "border-green-200 dark:border-green-500/30",
      text: "text-green-600 dark:text-green-400",
    },
    purple: {
      light: "bg-purple-50",
      dark: "dark:bg-purple-500/10",
      border: "border-purple-200 dark:border-purple-500/30",
      text: "text-purple-600 dark:text-purple-400",
    },
  };
  const a = accentMap[accent] || accentMap.blue;
  if (!content) return null;
  return (
    <div className={`rounded-2xl p-6 ${a.light} ${a.dark} border ${a.border}`}>
      <h3 className={`font-bold mb-2 ${a.text}`}>{title}</h3>
      <p className="text-sm leading-relaxed whitespace-pre-wrap text-slate-800 dark:text-slate-200">
        {content}
      </p>
    </div>
  );
}
