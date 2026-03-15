"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { agentApi } from "@/lib/api";
import toast from "react-hot-toast";
import {
  PenTool,
  Loader2,
  CheckCircle,
  AlertCircle,
  Star,
  ThumbsUp,
  TrendingUp,
  Sparkles,
} from "lucide-react";

const WRITING_TYPES = ["essay", "answer", "story", "letter", "other"];

interface Correction {
  original: string;
  corrected: string;
  explanation: string;
}
interface WritingResult {
  improvedText: string;
  grammarFeedback: string[];
  structureFeedback: string;
  vocabularyEnhancements: string[];
  corrections: Correction[];
  overallScore: number;
  strengths: string[];
  areasToImprove: string[];
  encouragement: string;
}

export default function WritingCoachPage() {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [writingType, setWritingType] = useState("essay");
  const [originalText, setOriginalText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WritingResult | null>(null);
  const [showImproved, setShowImproved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalText.trim() || originalText.length < 50) {
      toast.error("Please write at least 50 characters to get feedback");
      return;
    }
    setLoading(true);
    setShowImproved(false);
    try {
      const res = await agentApi.dispatch("writing-coach", {
        content: originalText,
        subject,
        topic,
        writingType,
      });
      setResult(res.data.data);
      toast.success("Writing feedback ready!");
    } catch {
      toast.error("Failed to get writing feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (s: number) =>
    s >= 80
      ? "text-green-600 dark:text-green-400"
      : s >= 60
        ? "text-yellow-600 dark:text-yellow-400"
        : "text-red-600 dark:text-red-400";
  const scoreLabel = (s: number) =>
    s >= 90
      ? "Excellent!"
      : s >= 80
        ? "Very Good"
        : s >= 70
          ? "Good"
          : s >= 60
            ? "Average"
            : "Needs Work";

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-dark-950">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8 max-w-3xl mx-auto">
          <div className="mb-8 flex items-center gap-4 animate-fade-up stagger-1">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center animate-bounce-gentle">
              <PenTool className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
                Writing Coach
              </h1>
              <p className="text-sm mt-0.5 text-slate-500 dark:text-slate-400">
                Get AI feedback on grammar, structure, and vocabulary
              </p>
            </div>
          </div>

          <div className="rounded-2xl p-6 mb-6 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 animate-fade-up stagger-2">
            <h2 className="text-base font-bold mb-4 text-slate-900 dark:text-slate-100">
              Submit your writing for feedback
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                    Writing Type
                  </label>
                  <select
                    value={writingType}
                    onChange={e => setWritingType(e.target.value)}
                    className="input-field capitalize"
                  >
                    {WRITING_TYPES.map(t => (
                      <option key={t} value={t} className="capitalize">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    placeholder="e.g., English"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                    Topic / Title
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    placeholder="e.g., My favourite season"
                    className="input-field"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                  Your Writing
                </label>
                <textarea
                  value={originalText}
                  onChange={e => setOriginalText(e.target.value)}
                  placeholder="Paste or write your text here (minimum 50 characters)..."
                  rows={8}
                  className="input-field resize-none"
                  required
                />
                <p className="text-xs mt-1 text-right text-slate-400 dark:text-slate-500">
                  {originalText.length} characters
                </p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Analysing your
                    writing…
                  </>
                ) : (
                  <>
                    <PenTool className="w-4 h-4" /> Get Feedback
                  </>
                )}
              </button>
            </form>
          </div>

          {result && (
            <div className="space-y-5 animate-fade-in">
              <div className="rounded-2xl p-6 bg-pink-50 dark:bg-pink-500/10 border border-pink-200 dark:border-pink-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm mb-1 text-slate-500 dark:text-slate-400">
                      Overall Score
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span
                        className={`text-5xl font-black ${scoreColor(result.overallScore)}`}
                      >
                        {result.overallScore}
                      </span>
                      <span className="text-lg text-slate-400 dark:text-slate-500">
                        /100
                      </span>
                      <span
                        className={`ml-2 text-base font-bold ${scoreColor(result.overallScore)}`}
                      >
                        {scoreLabel(result.overallScore)}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`w-20 h-20 rounded-full border-4 flex items-center justify-center border-current ${scoreColor(result.overallScore)}`}
                  >
                    <Star className="w-8 h-8" />
                  </div>
                </div>
                {result.encouragement && (
                  <p className="mt-4 text-sm italic pt-4 border-t border-pink-200 dark:border-pink-500/20 text-slate-700 dark:text-slate-300">
                    💬 {result.encouragement}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {result.strengths && result.strengths.length > 0 && (
                  <div className="rounded-2xl p-5 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 hover-lift border-glow">
                    <div className="flex items-center gap-2 mb-3">
                      <ThumbsUp className="w-5 h-5 text-green-500" />
                      <h3 className="font-bold text-slate-900 dark:text-slate-100">
                        Strengths
                      </h3>
                    </div>
                    <ul className="space-y-2 animate-fade-up">
                      {result.strengths.map((s, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300"
                        >
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {result.areasToImprove && result.areasToImprove.length > 0 && (
                  <div className="rounded-2xl p-5 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 hover-lift border-glow">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-5 h-5 text-orange-500" />
                      <h3 className="font-bold text-slate-900 dark:text-slate-100">
                        Areas to Improve
                      </h3>
                    </div>
                    <ul className="space-y-2 animate-fade-up">
                      {result.areasToImprove.map((a, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300"
                        >
                          <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {result.structureFeedback && (
                <div className="rounded-2xl p-5 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 hover-lift border-glow">
                  <h3 className="font-bold mb-2 text-slate-900 dark:text-slate-100">
                    Structure Feedback
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {result.structureFeedback}
                  </p>
                </div>
              )}

              {result.grammarFeedback && result.grammarFeedback.length > 0 && (
                <div className="rounded-2xl p-5 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 hover-lift border-glow">
                  <h3 className="font-bold mb-3 text-slate-900 dark:text-slate-100">
                    Grammar Feedback
                  </h3>
                  <ul className="space-y-2 animate-fade-up">
                    {result.grammarFeedback.map((f, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm p-2 rounded-lg bg-slate-50 dark:bg-dark-800 text-slate-700 dark:text-slate-300"
                      >
                        <span className="text-primary-500 font-bold">•</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.corrections && result.corrections.length > 0 && (
                <div className="rounded-2xl p-5 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 hover-lift border-glow">
                  <h3 className="font-bold mb-3 text-slate-900 dark:text-slate-100">
                    Specific Corrections
                  </h3>
                  <div className="space-y-3">
                    {result.corrections.map((c, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl border border-slate-200 dark:border-dark-700"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-red-500 line-through text-sm">
                            {c.original}
                          </span>
                          <span className="text-slate-400">→</span>
                          <span className="text-green-600 dark:text-green-400 font-semibold text-sm">
                            {c.corrected}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {c.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.improvedText && (
                <div className="rounded-2xl p-5 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 hover-lift border-glow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-500" />
                      <h3 className="font-bold text-slate-900 dark:text-slate-100">
                        AI-Improved Version
                      </h3>
                    </div>
                    <button
                      onClick={() => setShowImproved(!showImproved)}
                      className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 font-medium transition-colors"
                    >
                      {showImproved ? "Hide" : "Show improved version"}
                    </button>
                  </div>
                  {showImproved && (
                    <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20">
                      <p className="leading-relaxed whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">
                        {result.improvedText}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
