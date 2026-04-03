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
  characters: { name: string; role: string }[];
  moralOrLesson: string;
  conceptsExplained: string[];
  discussionQuestions: string[];
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
            <div className="space-y-5 animate-fade-in">
              <div className="rounded-2xl p-6 bg-white dark:bg-dark-900 border-2 border-violet-200 dark:border-violet-500/30">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-violet-500" />
                  <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
                    {result.storyTitle}
                  </h3>
                </div>
                {result.story.split("\n").map(
                  (p, i) =>
                    p.trim() && (
                      <p
                        key={i}
                        className="leading-relaxed mb-3 last:mb-0 text-sm text-slate-700 dark:text-slate-300"
                      >
                        {p}
                      </p>
                    ),
                )}
              </div>

              {result.characters && result.characters.length > 0 && (
                <div className="rounded-2xl p-6 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 hover-lift border-glow">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-blue-500" />
                    <h3 className="font-bold text-slate-900 dark:text-slate-100">
                      {t("story_mode.characters")}
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {result.characters.map((char, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20"
                      >
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm flex-shrink-0">
                          {char.name?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                            {char.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {char.role}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-2xl p-6 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <h3 className="font-bold text-yellow-600 dark:text-yellow-400">
                    {t("story_mode.moral")}
                  </h3>
                </div>
                <p className="italic leading-relaxed text-sm text-slate-700 dark:text-slate-300">
                  &quot;{result.moralOrLesson}&quot;
                </p>
              </div>

              {result.conceptsExplained &&
                result.conceptsExplained.length > 0 && (
                  <div className="rounded-2xl p-6 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 hover-lift border-glow">
                    <div className="flex items-center gap-2 mb-4">
                      <Lightbulb className="w-5 h-5 text-yellow-500" />
                      <h3 className="font-bold text-slate-900 dark:text-slate-100">
                        {t("story_mode.concepts")}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {result.conceptsExplained.map((c, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 rounded-full text-sm font-semibold bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {result.discussionQuestions &&
                result.discussionQuestions.length > 0 && (
                  <div className="rounded-2xl p-6 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 hover-lift border-glow">
                    <div className="flex items-center gap-2 mb-4">
                      <MessageCircle className="w-5 h-5 text-green-500" />
                      <h3 className="font-bold text-slate-900 dark:text-slate-100">
                        {t("story_mode.discussion")}
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {result.discussionQuestions.map((q, i) => (
                        <div
                          key={i}
                          className="flex gap-3 p-3 rounded-xl bg-green-50 dark:bg-green-500/10"
                        >
                          <span className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 text-sm font-bold flex items-center justify-center flex-shrink-0">
                            {i + 1}
                          </span>
                          <p className="text-sm text-slate-700 dark:text-slate-300">
                            {q}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {result.funFact && (
                <div className="rounded-2xl p-6 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    <h3 className="font-bold text-purple-600 dark:text-purple-400">
                      {t("story_mode.fun_fact")}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {result.funFact}
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
