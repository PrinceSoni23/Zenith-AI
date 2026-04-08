"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { HelpButton } from "@/components/Tutorial/HelpButton";
import { dashboardTutorials } from "@/config/tutorialConfig";
import { useAgentCache } from "@/hooks/useAgentCache";
import toast from "react-hot-toast";
import { useTranslation } from "@/hooks/useTranslation";
import {
  BookOpen,
  Loader2,
  Users,
  Lightbulb,
  MessageCircle,
  Sparkles,
  Star,
} from "lucide-react";

interface StoryResult {
  storyTitle: string;
  story: string;
  moralOrLesson: string;
  conceptsExplained: { [key: string]: string };
  funFact: string;
}

export default function StoryModePage() {
  const { t } = useTranslation();
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState<StoryResult | null>(null);

  // Use caching hook with 24-hour TTL for story caching
  const { dispatch, loading, isCacheHit } = useAgentCache({
    ttl: 86400, // 24 hours
    showCacheNotification: true,
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !topic.trim()) {
      toast.error(t("common.fill_fields"));
      return;
    }
    try {
      const res = await dispatch("story-mode", {
        content: `I want to learn about ${topic}`,
        subject,
        topic,
      });
      setResult(res.data.data);

      // Show cache hit notification
      if (res.isCacheHit) {
        toast.success("✨ Using cached story (30-60% faster!)", {
          icon: "⚡",
        });
      } else {
        toast.success(t("story_mode.ready"));
      }
    } catch {
      toast.error(t("story_mode.error"));
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-dark-950">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8 max-w-3xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4 animate-fade-up stagger-1">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center animate-bounce-gentle">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
                  {t("sidebar.story_mode")}
                </h1>
                <p className="text-sm mt-0.5 text-slate-500 dark:text-slate-400">
                  {t("story_mode.subtitle")}
                </p>
              </div>
            </div>
            <HelpButton tutorial={dashboardTutorials.storyMode} />
          </div>

          <div className="rounded-2xl p-6 mb-6 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 animate-fade-up stagger-2">
            <h2 className="text-base font-bold mb-4 text-slate-900 dark:text-slate-100">
              {t("story_mode.what_learn")}
            </h2>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                    {t("story_mode.subject")}
                  </label>
                  <input
                    data-tutorial="subject-select"
                    type="text"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    placeholder={t("story_mode.subject_example")}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                    {t("story_mode.topic")}
                  </label>
                  <input
                    data-tutorial="topic-enter"
                    type="text"
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    placeholder={t("story_mode.topic_example")}
                    className="input-field"
                    required
                  />
                </div>
              </div>
              <button
                data-tutorial="generate-story"
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />{" "}
                    {t("story_mode.generating")}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> {t("story_mode.generate")}
                  </>
                )}
              </button>
            </form>
          </div>

          {result && (
            <div className="space-y-6 animate-fade-in">
              {/* Story Title & Content */}
              <div className="group rounded-2xl overflow-hidden bg-gradient-to-br from-violet-50 via-purple-50 to-white dark:from-violet-900/20 dark:via-purple-900/20 dark:to-dark-900 border-2 border-violet-200 dark:border-violet-500/30 shadow-lg hover:shadow-2xl transition-all duration-500 p-8">
                <style>{`
                  @keyframes slideInRight {
                    from {
                      opacity: 0;
                      transform: translateX(-20px);
                    }
                    to {
                      opacity: 1;
                      transform: translateX(0);
                    }
                  }
                  
                  .story-section {
                    animation: slideInRight 0.7s ease-out;
                  }
                  
                  @keyframes fadeInUp {
                    from {
                      opacity: 0;
                      transform: translateY(10px);
                    }
                    to {
                      opacity: 1;
                      transform: translateY(0);
                    }
                  }
                  
                  .story-paragraph {
                    animation: fadeInUp 0.6s ease-out forwards;
                  }
                `}</style>

                <div className="flex items-center gap-3 mb-6 story-section">
                  <div className="p-3 rounded-lg bg-violet-100 dark:bg-violet-500/20 group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
                      {result.storyTitle}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      An interactive story to help you understand
                    </p>
                  </div>
                </div>

                <div className="space-y-4 text-slate-700 dark:text-slate-300">
                  {result.story.split("\n").map(
                    (p, i) =>
                      p.trim() && (
                        <p
                          key={i}
                          className="story-paragraph leading-relaxed text-sm group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors duration-300"
                          style={{ animationDelay: `${i * 0.05}s` }}
                        >
                          {p}
                        </p>
                      ),
                  )}
                </div>

                {/* Decorative line */}
                <div className="mt-6 h-1 rounded-full bg-gradient-to-r from-violet-600 via-purple-600 to-transparent opacity-30 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Moral/Lesson Section */}
              <div className="group rounded-2xl overflow-hidden bg-gradient-to-br from-yellow-50 via-orange-50 to-white dark:from-yellow-900/20 dark:via-orange-900/20 dark:to-dark-900 border-2 border-yellow-200 dark:border-yellow-500/30 shadow-lg hover:shadow-2xl transition-all duration-500 p-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-500/20 mt-1 group-hover:scale-110 transition-transform duration-300">
                    <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-3 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors duration-300">
                      {t("story_mode.moral")}
                    </h3>
                    <p className="italic leading-relaxed text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors duration-300 px-4 py-3 rounded-lg bg-white/50 dark:bg-dark-800/50 border-l-4 border-yellow-400 dark:border-yellow-600">
                      &quot;{result.moralOrLesson}&quot;
                    </p>
                  </div>
                </div>
              </div>

              {result.conceptsExplained &&
                Object.keys(result.conceptsExplained).length > 0 && (
                  <div className="rounded-2xl p-8 bg-gradient-to-br from-slate-50 to-white dark:from-dark-800 dark:to-dark-900 border border-slate-200 dark:border-dark-700 shadow-lg hover-lift transition-all duration-500">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-500/20">
                        <Lightbulb className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100">
                          {t("story_mode.concepts")}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Learn the key ideas explained simply
                        </p>
                      </div>
                    </div>

                    <style>{`
                      @keyframes slideInUp {
                        from {
                          opacity: 0;
                          transform: translateY(20px);
                        }
                        to {
                          opacity: 1;
                          transform: translateY(0);
                        }
                      }
                      
                      .concept-card {
                        animation: slideInUp 0.6s ease-out forwards;
                      }
                    `}</style>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(result.conceptsExplained).map(
                        ([concept, definition], i) => (
                          <div
                            key={i}
                            className="concept-card group relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-xl"
                            style={{
                              animationDelay: `${i * 0.1}s`,
                              background: `linear-gradient(135deg, ${
                                [
                                  "from-blue-50 to-cyan-50",
                                  "from-purple-50 to-pink-50",
                                  "from-green-50 to-emerald-50",
                                  "from-orange-50 to-yellow-50",
                                  "from-indigo-50 to-blue-50",
                                  "from-rose-50 to-red-50",
                                ][i % 6]
                              }) dark:to-transparent`,
                            }}
                          >
                            {/* Gradient Border Effect */}
                            <div
                              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              style={{
                                background: `linear-gradient(135deg, 
                                  ${
                                    [
                                      "#0099ff66",
                                      "#a855f766",
                                      "#10b98166",
                                      "#f97316b3",
                                      "#4f46e566",
                                      "#e11d4866",
                                    ][i % 6]
                                  }, 
                                  transparent)`,
                                padding: "2px",
                              }}
                            />

                            {/* Card Content */}
                            <div className="relative p-5 rounded-xl bg-white/80 dark:bg-dark-900/80 backdrop-blur-sm border border-current/10 group-hover:border-current/30 transition-all duration-300 h-full">
                              {/* Icon Badge */}
                              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div
                                  className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                                  style={{
                                    background: `linear-gradient(135deg, 
                                      ${
                                        [
                                          "#06b6d4",
                                          "#d946ef",
                                          "#10b981",
                                          "#f97316",
                                          "#6366f1",
                                          "#e11d48",
                                        ][i % 6]
                                      }, 
                                      ${
                                        [
                                          "#0ea5e9",
                                          "#ec4899",
                                          "#34d399",
                                          "#fb923c",
                                          "#818cf8",
                                          "#f43f5e",
                                        ][i % 6]
                                      })`,
                                  }}
                                >
                                  ✨
                                </div>
                              </div>

                              {/* Concept Title */}
                              <div className="mb-3 pr-8">
                                <p
                                  className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-transparent group-hover:bg-clip-text group-hover:font-black transition-all duration-300"
                                  style={{
                                    backgroundImage: `linear-gradient(135deg, 
                                       ${
                                         [
                                           "#06b6d4",
                                           "#d946ef",
                                           "#10b981",
                                           "#f97316",
                                           "#6366f1",
                                           "#e11d48",
                                         ][i % 6]
                                       }, 
                                       ${
                                         [
                                           "#0ea5e9",
                                           "#ec4899",
                                           "#34d399",
                                           "#fb923c",
                                           "#818cf8",
                                           "#f43f5e",
                                         ][i % 6]
                                       })`,
                                    backgroundClip: "text",
                                    WebkitBackgroundClip: "text",
                                  }}
                                >
                                  {concept}
                                </p>
                              </div>

                              {/* Definition */}
                              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-all duration-300 line-clamp-4 group-hover:line-clamp-none">
                                {definition}
                              </p>

                              {/* Animated Line Bottom */}
                              <div
                                className="h-0.5 mt-4 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                                style={{
                                  background: `linear-gradient(90deg, 
                                    ${
                                      [
                                        "#06b6d4",
                                        "#d946ef",
                                        "#10b981",
                                        "#f97316",
                                        "#6366f1",
                                        "#e11d48",
                                      ][i % 6]
                                    }, 
                                    ${
                                      [
                                        "#0ea5e9",
                                        "#ec4899",
                                        "#34d399",
                                        "#fb923c",
                                        "#818cf8",
                                        "#f43f5e",
                                      ][i % 6]
                                    }, 
                                    transparent)`,
                                }}
                              />
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

              {result.funFact && (
                <div className="group rounded-2xl overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-white dark:from-purple-900/20 dark:via-pink-900/20 dark:to-dark-900 border-2 border-purple-200 dark:border-purple-500/30 shadow-lg hover:shadow-2xl transition-all duration-500 p-8">
                  <style>{`
                    @keyframes bounce-soft {
                      0%, 100% {
                        transform: translateY(0);
                      }
                      50% {
                        transform: translateY(-4px);
                      }
                    }
                    
                    @keyframes shimmer {
                      0% {
                        background-position: -1000px 0;
                      }
                      100% {
                        background-position: 1000px 0;
                      }
                    }
                    
                    .fun-fact-icon {
                      animation: bounce-soft 2s ease-in-out infinite;
                    }
                  `}</style>

                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-500/20 fun-fact-icon">
                      <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-3 group-hover:from-purple-700 group-hover:to-pink-700 transition-all duration-300">
                        {t("story_mode.fun_fact")} ✨
                      </h3>
                      <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors duration-300 px-4 py-3 rounded-lg bg-white/50 dark:bg-dark-800/50 border-l-4 border-purple-400 dark:border-purple-600 relative overflow-hidden">
                        <span className="relative z-10">{result.funFact}</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-200/0 via-purple-200/20 to-purple-200/0 dark:from-purple-800/0 dark:via-purple-800/20 dark:to-purple-800/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </p>
                    </div>
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
