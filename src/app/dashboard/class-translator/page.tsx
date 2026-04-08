"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { HelpButton } from "@/components/Tutorial/HelpButton";
import { dashboardTutorials } from "@/config/tutorialConfig";
import { useTranslation } from "@/hooks/useTranslation";
import { useAgentCache } from "@/hooks/useAgentCache";
import toast from "react-hot-toast";
import {
  Brain,
  Loader2,
  Sparkles,
  Lightbulb,
  Globe,
  Target,
  BookOpen,
  ArrowRight,
  Zap,
} from "lucide-react";

interface TranslatorResult {
  simpleExplanation: string;
  realLifeExample: string;
  keyPoints: string[];
  translatedContent: string;
  formalDefinition: string;
}

export default function ClassTranslatorPage() {
  const [content, setContent] = useState("");
  const [subject, setSubject] = useState("");
  const [language, setLanguage] = useState("english");
  const [result, setResult] = useState<TranslatorResult | null>(null);
  const { t } = useTranslation();

  // Use caching hook with 24-hour TTL for question caching
  const { dispatch, loading, isCacheHit } = useAgentCache({
    ttl: 86400, // 24 hours
    showCacheNotification: true,
  });

  const handleSubmit = async () => {
    if (!content.trim()) return toast.error("Please describe what was taught");
    try {
      // Extract topic from first line of content or use first 50 chars
      const topic =
        content.split("\n")[0].trim().substring(0, 100) || subject || "Concept";

      const res = await dispatch("class-translator", {
        content,
        subject,
        topic,
        language,
      });
      console.log("Class Translator Response:", res);
      setResult(res.data.data);

      // Show cache hit notification
      if (res.isCacheHit) {
        toast.success("✨ Using cached response (30-60% faster!)", {
          icon: "⚡",
        });
      }
    } catch (error: unknown) {
      console.error("Class Translator Error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to process. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-dark-950 dark:via-slate-900 dark:to-purple-900/20">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8 max-w-4xl mx-auto">
          {/* Header with animated gradient */}
          <div className="mb-10 animate-fade-up stagger-1 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center animate-bounce-gentle shadow-lg shadow-purple-300/50 dark:shadow-purple-500/20">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">
                  {t("class_translator.title")}
                </h1>
                <p className="text-sm mt-1 text-slate-500 dark:text-slate-400">
                  {t("class_translator.subtitle")}
                </p>
              </div>
            </div>
            <HelpButton tutorial={dashboardTutorials.classTranslator} />
          </div>

          {/* Input Section with engaging design */}
          <div className="rounded-3xl p-6 md:p-8 mb-8 bg-white dark:bg-dark-900 border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-shadow animate-fade-up stagger-2 backdrop-blur-sm">
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-bold mb-3 text-slate-800 dark:text-slate-200">
                  <span className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                    1
                  </span>
                  {t("class_translator.subject")}?
                </label>
                <input
                  className="input-field rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder={t("class_translator.subject")}
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold mb-3 text-slate-800 dark:text-slate-200">
                  <span className="w-5 h-5 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white text-xs font-bold">
                    🌐
                  </span>
                  Choose Language
                </label>
                <select
                  data-tutorial="language-select"
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  className="input-field rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white dark:bg-dark-800 cursor-pointer"
                >
                  <option value="english">🇬🇧 English</option>
                  <option value="hinglish">🇮🇳 Hinglish</option>
                </select>
              </div>
            </div>
            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm font-bold mb-3 text-slate-800 dark:text-slate-200">
                <span className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                  2
                </span>
                {t("class_translator.content")}?
              </label>
              <textarea
                data-tutorial="concept-input"
                className="input-field min-h-[160px] resize-none rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder={t("class_translator.content")}
                value={content}
                onChange={e => setContent(e.target.value)}
              />
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                ✨ Tip: The more details, the better the explanation!
              </p>
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 rounded-xl font-bold text-base py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 active:scale-95 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Translating your
                  lesson...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" /> {t("class_translator.explain")}
                </>
              )}
            </button>
          </div>

          {/* Loading State with engaging animations */}
          {loading && (
            <div className="rounded-3xl p-12 mb-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-pink-500/10 border border-purple-200/50 dark:border-purple-500/30 animate-fade-in">
              <div className="flex flex-col items-center justify-center">
                {/* Animated Brain with particles */}
                <div className="relative w-24 h-24 mb-6">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 animate-pulse"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Brain className="w-10 h-10 text-white animate-bounce" />
                    </div>
                  </div>

                  {/* Orbiting particles */}
                  <div className="absolute top-0 left-1/2 w-2 h-2 bg-yellow-400 rounded-full animate-orbit-1"></div>
                  <div className="absolute top-2 right-2 w-2 h-2 bg-pink-400 rounded-full animate-orbit-2"></div>
                  <div className="absolute bottom-2 right-0 w-2 h-2 bg-cyan-400 rounded-full animate-orbit-3"></div>
                  <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-green-400 rounded-full animate-orbit-4"></div>
                </div>

                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-2 text-center">
                  Translating Your Lesson...
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 text-center mb-6">
                  Our AI is working its magic! ✨
                </p>

                {/* Progress steps animation */}
                <div className="flex justify-center items-center gap-2 mb-6">
                  <div
                    className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                    style={{ animationDelay: "0s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>

                {/* Loading messages that cycle */}
                <div className="text-center">
                  <p className="text-xs text-slate-500 dark:text-slate-400 h-5 animate-fade-cycle">
                    Reading your notes...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Results Grid - Interactive Cards */}
          {result && (
            <div
              data-tutorial="explanation"
              className="space-y-0 animate-fade-in"
            >
              {/* Formal Definition Section - At Top in Blue/Purple */}
              {result.formalDefinition && (
                <div
                  className="animate-card-in mb-6"
                  style={{ animationDelay: "0s" }}
                >
                  <ResultCard
                    icon={<BookOpen className="w-6 h-6" />}
                    title="Formal Definition (For Exam)"
                    content={result.formalDefinition}
                    gradient="from-blue-600 via-purple-600 to-purple-700"
                    bgGradient="from-blue-50 via-purple-50 to-blue-50 dark:from-blue-500/20 dark:via-purple-500/20 dark:to-blue-500/20"
                    emoji="📚"
                    fullWidth
                  />
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div
                  className="animate-card-in"
                  style={{ animationDelay: "0.1s" }}
                >
                  <ResultCard
                    icon={<Lightbulb className="w-6 h-6" />}
                    title={t("class_translator.simple_explanation")}
                    content={result.simpleExplanation}
                    gradient="from-blue-500 to-cyan-500"
                    bgGradient="from-blue-50 to-cyan-50 dark:from-blue-500/10 dark:to-cyan-500/10"
                    emoji="💡"
                  />
                </div>
                <div
                  className="animate-card-in"
                  style={{ animationDelay: "0.2s" }}
                >
                  <ResultCard
                    icon={<Globe className="w-6 h-6" />}
                    title={t("class_translator.real_life_example")}
                    content={result.realLifeExample}
                    gradient="from-green-500 to-emerald-500"
                    bgGradient="from-green-50 to-emerald-50 dark:from-green-500/10 dark:to-emerald-500/10"
                    emoji="🌍"
                  />
                </div>
              </div>

              {Array.isArray(result.keyPoints) &&
                result.keyPoints.length > 0 && (
                  <div className="rounded-3xl p-6 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-500/10 dark:to-orange-500/10 border border-yellow-200/50 dark:border-yellow-500/30 mb-4 hover-lift shadow-lg overflow-hidden relative">
                    {/* Decorative background art */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-200/20 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-orange-200/20 rounded-full blur-2xl -ml-20 -mb-20 pointer-events-none"></div>

                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white shadow-lg">
                          <span className="text-xl">🔑</span>
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
                          {t("class_translator.key_points")}
                        </h3>
                      </div>

                      {/* Decorative separator */}
                      <div className="h-1 w-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mb-6 opacity-60"></div>

                      <div className="grid md:grid-cols-2 gap-3">
                        {result.keyPoints.map((pt, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-3 p-4 rounded-2xl bg-white/60 dark:bg-slate-800/40 hover:bg-white/90 dark:hover:bg-slate-800/60 transition-all backdrop-blur-sm border border-white/30 dark:border-slate-700/30 group"
                          >
                            {/* Animated number badge */}
                            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500 flex-shrink-0 w-8 text-center group-hover:scale-125 transition-transform">
                              {i + 1}
                            </span>
                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                              {pt}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Decorative footer */}
                      <div className="flex gap-2 mt-6 pt-4 border-t border-white/30">
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 opacity-70"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-400 opacity-70"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-300 opacity-70"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 opacity-70"></div>
                      </div>
                    </div>
                  </div>
                )}

              {result.translatedContent && (
                <div
                  className="animate-card-in"
                  style={{ animationDelay: "0.3s" }}
                >
                  <ResultCard
                    icon={<BookOpen className="w-6 h-6" />}
                    title="In Your Language"
                    content={result.translatedContent}
                    gradient="from-purple-500 to-pink-500"
                    bgGradient="from-purple-50 to-pink-50 dark:from-purple-500/10 dark:to-pink-500/10"
                    emoji="🌐"
                    fullWidth
                  />
                </div>
              )}

              {/* Celebration Footer */}
              <div className="rounded-3xl p-6 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-500/20 dark:to-emerald-500/20 border border-green-200 dark:border-green-500/30 mt-6 text-center">
                <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                  ✨ Great job! Your teacher would be proud! Keep learning! 🎉
                </p>
              </div>
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

interface ResultCardProps {
  icon: React.ReactNode;
  title: string;
  content: string;
  gradient: string;
  bgGradient: string;
  emoji: string;
  fullWidth?: boolean;
}

function ResultCard({
  icon,
  title,
  content,
  gradient,
  bgGradient,
  emoji,
  fullWidth = false,
}: ResultCardProps) {
  if (!content) return null;

  return (
    <div
      className={`rounded-3xl p-6 bg-gradient-to-br ${bgGradient} border border-slate-200/50 dark:border-slate-700/50 hover-lift shadow-lg hover:shadow-xl transition-all backdrop-blur-sm overflow-hidden relative ${fullWidth ? "col-span-full" : ""}`}
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-2xl -ml-16 -mb-16 pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex items-start gap-3 mb-4">
          <div
            className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-xl shadow-lg flex-shrink-0 hover:scale-110 transition-transform`}
          >
            {emoji}
          </div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 pt-1">
            {title}
          </h3>
        </div>

        {/* Decorative separator line */}
        <div
          className={`h-1 w-12 bg-gradient-to-r ${gradient} rounded-full mb-4 opacity-60`}
        ></div>

        <p className="text-sm leading-relaxed whitespace-pre-wrap text-slate-700 dark:text-slate-300">
          {content}
        </p>

        {/* Decorative footer elements */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-white/20">
          <div className="w-1 h-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 opacity-70"></div>
          <div className="w-1 h-1 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-70"></div>
          <div className="w-1 h-1 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 opacity-70"></div>
        </div>
      </div>
    </div>
  );
}
