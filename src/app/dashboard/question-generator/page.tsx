"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { useAgentCache } from "@/hooks/useAgentCache";
import toast from "react-hot-toast";
import { useTranslation } from "@/hooks/useTranslation";
import {
  HelpCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Zap,
  Brain,
  Flame,
  Lightbulb,
} from "lucide-react";

interface Question {
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: string;
  type: string;
}
interface QGenResult {
  questions: {
    easy: Question[];
    medium: Question[];
    hard: Question[];
    thinking: Question[];
  };
  totalQuestions: number;
  topicCoverage: string[];
}

type DifficultyTab = "easy" | "medium" | "hard" | "thinking";

const DIFFICULTY_KEYS = {
  easy: "question_generator.easy",
  medium: "question_generator.medium",
  hard: "question_generator.hard",
  thinking: "question_generator.thinking",
} as const;

const DIFFICULTY_ICONS = {
  easy: Lightbulb,
  medium: Zap,
  hard: Flame,
  thinking: Brain,
} as const;

const DIFFICULTY_COLORS = {
  easy: "bg-green-100 dark:bg-green-500/20 border-green-300 dark:border-green-500/40 text-green-700 dark:text-green-400",
  medium:
    "bg-yellow-100 dark:bg-yellow-500/20 border-yellow-300 dark:border-yellow-500/40 text-yellow-700 dark:text-yellow-400",
  hard: "bg-red-100 dark:bg-red-500/20 border-red-300 dark:border-red-500/40 text-red-700 dark:text-red-400",
  thinking:
    "bg-purple-100 dark:bg-purple-500/20 border-purple-300 dark:border-purple-500/40 text-purple-700 dark:text-purple-400",
} as const;

export default function QuestionGeneratorPage() {
  const { t, language } = useTranslation();
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState("3");
  const [result, setResult] = useState<QGenResult | null>(null);
  const [activeTab, setActiveTab] = useState<DifficultyTab>("easy");
  const [revealedAnswers, setRevealedAnswers] = useState<Set<string>>(
    new Set(),
  );

  // Use caching hook with 24-hour TTL for question caching
  const { dispatch, loading, isCacheHit } = useAgentCache({
    ttl: 86400, // 24 hours
    showCacheNotification: true,
  });

  // Build TAB_CONFIG with translations
  const TAB_CONFIG = [
    {
      key: "easy" as DifficultyTab,
      label: t(DIFFICULTY_KEYS.easy),
      Icon: DIFFICULTY_ICONS.easy,
      active: DIFFICULTY_COLORS.easy,
    },
    {
      key: "medium" as DifficultyTab,
      label: t(DIFFICULTY_KEYS.medium),
      Icon: DIFFICULTY_ICONS.medium,
      active: DIFFICULTY_COLORS.medium,
    },
    {
      key: "hard" as DifficultyTab,
      label: t(DIFFICULTY_KEYS.hard),
      Icon: DIFFICULTY_ICONS.hard,
      active: DIFFICULTY_COLORS.hard,
    },
    {
      key: "thinking" as DifficultyTab,
      label: t(DIFFICULTY_KEYS.thinking),
      Icon: DIFFICULTY_ICONS.thinking,
      active: DIFFICULTY_COLORS.thinking,
    },
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !topic.trim()) {
      toast.error(t("common.fill_fields"));
      return;
    }
    setRevealedAnswers(new Set());
    try {
      const res = await dispatch("question-generator", {
        preferredLanguage: language,
        content: `Generate questions on ${topic}`,
        subject,
        topic,
        questionsPerLevel: parseInt(count, 10),
      });
      setResult(res.data.data);
      setActiveTab("easy");

      // Show cache hit notification
      if (res.isCacheHit) {
        toast.success("✨ Using cached questions (30-60% faster!)", {
          icon: "⚡",
        });
      } else {
        toast.success(
          t("question_generator.generated", {
            count: res.data.data.totalQuestions,
          }),
        );
      }
    } catch {
      toast.error(t("question_generator.error"));
    }
  };

  const toggleAnswer = (key: string) =>
    setRevealedAnswers(p => {
      const n = new Set(p);
      n.has(key) ? n.delete(key) : n.add(key);
      return n;
    });
  const activeQuestions: Question[] = result?.questions?.[activeTab] || [];
  const tabCount = (key: DifficultyTab) =>
    result?.questions?.[key]?.length || 0;

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-dark-950">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8 max-w-3xl mx-auto">
          <div className="mb-8 flex items-center gap-4 animate-fade-up stagger-1">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center animate-bounce-gentle">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
                {t("question_generator.title")}
              </h1>
              <p className="text-sm mt-0.5 text-slate-500 dark:text-slate-400">
                {t("question_generator.subtitle")}
              </p>
            </div>
          </div>

          <div className="rounded-2xl p-6 mb-6 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 animate-fade-up stagger-2">
            <h2 className="text-base font-bold mb-4 text-slate-900 dark:text-slate-100">
              {t("question_generator.for_any_topic")}
            </h2>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                    {t("question_generator.subject")}
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    placeholder={t("question_generator.subject_placeholder")}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                    {t("question_generator.topic")}
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    placeholder={t("question_generator.topic_placeholder")}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                    {t("question_generator.per_level")}
                  </label>
                  <select
                    value={count}
                    onChange={e => setCount(e.target.value)}
                    className="input-field"
                  >
                    {[2, 3, 4, 5].map(n => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />{" "}
                    {t("question_generator.generating")}
                  </>
                ) : (
                  <>
                    <HelpCircle className="w-4 h-4" />{" "}
                    {t("question_generator.generate")}
                  </>
                )}
              </button>
            </form>
          </div>

          {result && (
            <div className="space-y-4 animate-fade-in">
              {result.topicCoverage && result.topicCoverage.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {t("question_generator.coverage_label")}
                  </span>
                  {result.topicCoverage.map((t, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-full text-xs font-semibold bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-400"
                    >
                      {t}
                    </span>
                  ))}
                  <span className="ml-auto text-sm font-medium text-slate-500 dark:text-slate-400">
                    {result.totalQuestions} {t("question_generator.total")}
                  </span>
                </div>
              )}

              <div className="flex gap-2 flex-wrap">
                {TAB_CONFIG.map(({ key, label, Icon, active }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                      activeTab === key
                        ? active
                        : "bg-white dark:bg-dark-900 border-slate-200 dark:border-dark-700 text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}{" "}
                    <span className="opacity-70">({tabCount(key)})</span>
                  </button>
                ))}
              </div>

              {activeQuestions.length > 0 ? (
                <div className="space-y-4 animate-fade-up stagger-3">
                  {activeQuestions.map((q, i) => {
                    const key = `${activeTab}-${i}`;
                    const revealed = revealedAnswers.has(key);
                    return (
                      <div
                        key={key}
                        className="rounded-2xl p-5 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700"
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <p className="font-semibold flex-1 text-sm text-slate-800 dark:text-slate-200">
                            <span className="text-primary-500 mr-2">
                              Q{i + 1}.
                            </span>
                            {q.question}
                          </p>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-400 flex-shrink-0">
                            {q.type}
                          </span>
                        </div>
                        {q.options && q.options.length > 0 && (
                          <div className="grid grid-cols-2 gap-2 mb-3">
                            {q.options.map((opt, oi) => (
                              <div
                                key={oi}
                                className={`p-2 rounded-xl text-sm border ${
                                  revealed && opt === q.correctAnswer
                                    ? "bg-green-50 dark:bg-green-500/10 border-green-300 dark:border-green-500/30 text-green-700 dark:text-green-400 font-semibold"
                                    : "bg-slate-50 dark:bg-dark-800 border-slate-200 dark:border-dark-700 text-slate-700 dark:text-slate-300"
                                }`}
                              >
                                {opt}
                              </div>
                            ))}
                          </div>
                        )}
                        <button
                          onClick={() => toggleAnswer(key)}
                          className="flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 font-medium transition-colors"
                        >
                          {revealed ? (
                            <>
                              <ChevronUp className="w-4 h-4" />{" "}
                              {t("question_generator.hide")}
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-4 h-4" />{" "}
                              {t("question_generator.reveal")}
                            </>
                          )}
                        </button>
                        {revealed && (
                          <div className="mt-3 space-y-2">
                            <div className="p-3 rounded-xl border-l-4 border-green-500 text-sm font-semibold bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400">
                              ✓ {q.correctAnswer}
                            </div>
                            {q.explanation && (
                              <div className="p-3 rounded-xl text-sm bg-blue-50 dark:bg-blue-500/10 text-slate-700 dark:text-slate-300">
                                {q.explanation}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl p-10 text-center text-sm bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 text-slate-500 dark:text-slate-400">
                  {t("question_generator.no_questions")}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
