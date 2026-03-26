"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { agentApi, studyLogApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";
import { useTranslation } from "@/hooks/useTranslation";
import {
  RotateCcw,
  Brain,
  Zap,
  FileText,
  Lightbulb,
  Clock,
  Calendar,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BookOpen,
  Filter,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  X,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StudyLogEntry {
  _id: string;
  subject: string;
  topic: string;
  moduleUsed: string;
  durationMinutes: number;
  date: string;
}

interface TopicGroup {
  topic: string;
  subject: string;
  totalMinutes: number;
  sessions: number;
  lastStudied: string;
  dates: string[];
}

interface FlashCard {
  front: string;
  back: string;
}
interface RecallQuestion {
  question: string;
  answer: string;
  difficulty: string;
}
interface RevisionResult {
  recallQuestions: RecallQuestion[];
  flashCards: FlashCard[];
  quickSummary: string;
  revisionTips: string[];
  estimatedRevisionTime: number;
}

type TimeFilter = "1week" | "2weeks" | "3weeks" | "1month";

// ─── Cache helpers ────────────────────────────────────────────────────────────

const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function getCacheKey(userId: string, topic: string, subject: string) {
  return `rev_cache_${userId}_${subject}_${topic}`
    .replace(/\s+/g, "_")
    .toLowerCase();
}

function readCache(key: string): RevisionResult | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { data, expiresAt } = JSON.parse(raw);
    if (Date.now() > expiresAt) {
      localStorage.removeItem(key);
      return null;
    }
    return data as RevisionResult;
  } catch {
    return null;
  }
}

function writeCache(key: string, data: RevisionResult) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      key,
      JSON.stringify({ data, expiresAt: Date.now() + CACHE_TTL_MS }),
    );
  } catch {}
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FlipCard({ card, index }: { card: FlashCard; index: number }) {
  const { t } = useTranslation();
  const [flipped, setFlipped] = useState(false);
  const colors = [
    {
      border: "border-violet-400 dark:border-violet-500",
      bg: "bg-violet-50 dark:bg-violet-900/30",
      text: "text-violet-600 dark:text-violet-400",
    },
    {
      border: "border-blue-400 dark:border-blue-500",
      bg: "bg-blue-50 dark:bg-blue-900/30",
      text: "text-blue-600 dark:text-blue-400",
    },
    {
      border: "border-teal-400 dark:border-teal-500",
      bg: "bg-teal-50 dark:bg-teal-900/30",
      text: "text-teal-600 dark:text-teal-400",
    },
    {
      border: "border-pink-400 dark:border-pink-500",
      bg: "bg-pink-50 dark:bg-pink-900/30",
      text: "text-pink-600 dark:text-pink-400",
    },
  ];
  const c = colors[index % colors.length];
  return (
    <button
      type="button"
      onClick={() => setFlipped(f => !f)}
      className="w-full text-left cursor-pointer rounded-2xl group transition-transform hover:scale-[1.02] active:scale-[0.98]"
    >
      {!flipped ? (
        <div className="rounded-2xl p-5 min-h-[160px] flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-900 shadow-sm group-hover:border-slate-300 dark:group-hover:border-slate-600 transition-colors">
          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
            <BookOpen className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-xs uppercase tracking-widest font-bold mb-2 text-slate-400 dark:text-slate-500">
            {t("revision.tap_to_reveal")}
          </p>
          <p className="font-semibold text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
            {card.front}
          </p>
        </div>
      ) : (
        <div
          className={`rounded-2xl p-5 min-h-[160px] flex flex-col items-center justify-center text-center border-2 ${c.border} ${c.bg} shadow-sm transition-colors`}
        >
          <p
            className={`text-xs uppercase tracking-widest font-bold mb-2 ${c.text}`}
          >
            Answer ✓
          </p>
          <p className="font-semibold text-sm text-slate-800 dark:text-slate-100 leading-relaxed">
            {card.back}
          </p>
        </div>
      )}
    </button>
  );
}

function RecallQuestionItem({
  q,
  index,
  diffClass,
}: {
  q: RecallQuestion;
  index: number;
  diffClass: string;
}) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-900 overflow-hidden transition-all">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <p className="font-medium flex-1 text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold mr-2 flex-shrink-0">
              {index + 1}
            </span>
            {q.question}
          </p>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0 capitalize ${diffClass}`}
          >
            {q.difficulty}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setRevealed(r => !r)}
          className="mt-3 ml-8 flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-500 font-semibold transition-colors"
        >
          {revealed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" /> Hide Answer
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" /> Reveal Answer
            </>
          )}
        </button>
      </div>
      {revealed && (
        <div className="px-4 pb-4 ml-8">
          <div className="p-3 rounded-xl border-l-4 border-blue-500 text-sm bg-blue-50 dark:bg-blue-500/10 text-slate-700 dark:text-slate-300 leading-relaxed">
            {q.answer}
          </div>
        </div>
      )}
    </div>
  );
}

function TopicCard({
  group,
  onRevise,
  loadingTopic,
  isCached,
}: {
  group: TopicGroup;
  onRevise: (g: TopicGroup) => void;
  loadingTopic: string | null;
  isCached: boolean;
}) {
  const { t } = useTranslation();
  const isLoading = loadingTopic === `${group.subject}-${group.topic}`;
  const subjectColors: Record<string, string> = {
    maths: "from-blue-500 to-indigo-500",
    mathematics: "from-blue-500 to-indigo-500",
    chemistry: "from-green-500 to-teal-500",
    physics: "from-orange-500 to-amber-500",
    biology: "from-emerald-500 to-lime-500",
    english: "from-pink-500 to-rose-500",
    history: "from-amber-500 to-yellow-500",
    geography: "from-cyan-500 to-sky-500",
    default: "from-violet-500 to-purple-500",
  };
  const gradient =
    subjectColors[(group.subject || "").toLowerCase()] ?? subjectColors.default;

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  };

  return (
    <div className="group relative rounded-2xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-lg transition-all duration-200 overflow-hidden">
      {/* left accent bar */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${gradient} rounded-l-2xl`}
      />
      <div className="p-4 pl-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r ${gradient} text-white`}
              >
                {group.subject}
              </span>
              {isCached && (
                <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" /> {t("revision.cached")}
                </span>
              )}
            </div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base truncate mt-1">
              {group.topic}
            </h3>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                {group.totalMinutes} {t("common.time_min")} {t("revision.total")}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <BookOpen className="w-3.5 h-3.5" />
                {group.sessions} {group.sessions !== 1 ? t("revision.sessions") : t("revision.session")}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                Last: {formatDate(group.lastStudied)}
              </span>
            </div>
            {group.dates.length > 1 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {group.dates.slice(0, 4).map((d, i) => (
                  <span
                    key={i}
                    className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full"
                  >
                    {formatDate(d)}
                  </span>
                ))}
                {group.dates.length > 4 && (
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">
                    +{group.dates.length - 4} more
                  </span>
                )}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => onRevise(group)}
            disabled={!!loadingTopic}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
              isLoading
                ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                : `bg-gradient-to-r ${gradient} text-white hover:opacity-90 hover:shadow-md active:scale-95`
            }`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Loading...
              </>
            ) : isCached ? (
              <>
                <Sparkles className="w-3.5 h-3.5" /> Revise
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5" /> Auto Revise
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function RevisionPage() {
  const { t } = useTranslation();
  const user = useAuthStore(s => s.user);
  const [logs, setLogs] = useState<StudyLogEntry[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("1month");
  const [loadingTopic, setLoadingTopic] = useState<string | null>(null);
  const [activeResult, setActiveResult] = useState<{
    result: RevisionResult;
    topic: string;
    subject: string;
  } | null>(null);
  const [sessionKey, setSessionKey] = useState(0);
  const [cachedTopics, setCachedTopics] = useState<Set<string>>(new Set());

  // ── Load study logs ──────────────────────────────────────────────────────
  const fetchLogs = useCallback(async () => {
    setLogsLoading(true);
    try {
      const res = await studyLogApi.getAll({ limit: 500 });
      setLogs(res.data.data as StudyLogEntry[]);
    } catch {
      toast.error(t("revision.load_error"));
    } finally {
      setLogsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // ── Detect cached topics ─────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    const cached = new Set<string>();
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith(`rev_cache_${user.id}`)) {
        const raw = localStorage.getItem(k);
        if (raw) {
          try {
            const { expiresAt } = JSON.parse(raw);
            if (Date.now() < expiresAt) cached.add(k);
          } catch {}
        }
      }
    }
    setCachedTopics(cached);
  }, [user]);

  // ── Filter & group topics ────────────────────────────────────────────────
  const filterDays: Record<TimeFilter, number> = {
    "1week": 7,
    "2weeks": 14,
    "3weeks": 21,
    "1month": 31,
  };

  const filteredLogs = logs.filter(l => {
    const days = filterDays[timeFilter];
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return new Date(l.date) >= cutoff;
  });

  const topicMap: Record<string, TopicGroup> = {};
  for (const log of filteredLogs) {
    const key = `${log.subject}||${log.topic}`;
    if (!topicMap[key]) {
      topicMap[key] = {
        topic: log.topic,
        subject: log.subject,
        totalMinutes: 0,
        sessions: 0,
        lastStudied: log.date,
        dates: [],
      };
    }
    topicMap[key].totalMinutes += log.durationMinutes || 0;
    topicMap[key].sessions += 1;
    topicMap[key].dates.push(log.date);
    if (new Date(log.date) > new Date(topicMap[key].lastStudied)) {
      topicMap[key].lastStudied = log.date;
    }
  }

  const topicGroups = Object.values(topicMap).sort(
    (a, b) =>
      new Date(b.lastStudied).getTime() - new Date(a.lastStudied).getTime(),
  );

  // ── Auto-revise handler ──────────────────────────────────────────────────
  const handleRevise = async (group: TopicGroup) => {
    const key = `${group.subject}-${group.topic}`;
    setLoadingTopic(key);

    const cacheKey = user
      ? getCacheKey(user.id, group.topic, group.subject)
      : null;
    if (cacheKey) {
      const cached = readCache(cacheKey);
      if (cached) {
        setActiveResult({
          result: cached,
          topic: group.topic,
          subject: group.subject,
        });
        setSessionKey(k => k + 1);
        setLoadingTopic(null);
        toast.success(t("revision.loaded_cached"));
        return;
      }
    }

    try {
      const res = await agentApi.dispatch("revision", {
        content: `Auto-revise: ${group.topic}`,
        subject: group.subject,
        topic: group.topic,
      });
      const result = res.data.data as RevisionResult;
      setActiveResult({ result, topic: group.topic, subject: group.subject });
      setSessionKey(k => k + 1);
      toast.success(t("revision.ready"));
      if (cacheKey) {
        writeCache(cacheKey, result);
        setCachedTopics(prev => new Set(prev).add(cacheKey));
      }
    } catch {
      toast.error(t("revision.error"));
    } finally {
      setLoadingTopic(null);
    }
  };

  const difficultyClass = (d: string) =>
    d === "easy"
      ? "text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-500/20"
      : d === "medium"
        ? "text-yellow-700 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-500/20"
        : "text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-500/20";

  const filterLabels: Record<TimeFilter, string> = {
    "1week": "Past Week",
    "2weeks": "Past 2 Weeks",
    "3weeks": "Past 3 Weeks",
    "1month": "Past Month",
  };

  const totalMinutesFiltered = topicGroups.reduce(
    (s, g) => s + g.totalMinutes,
    0,
  );

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-dark-950">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8 max-w-4xl mx-auto">
          {/* ── Header ── */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-blue-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                <RotateCcw className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
                  Auto Revision
                </h1>
                <p className="text-sm mt-0.5 text-slate-500 dark:text-slate-400">
                  Pick any topic you've studied — AI will generate your revision
                  instantly ✨
                </p>
              </div>
            </div>

            {/* Stats strip */}
            {!logsLoading && topicGroups.length > 0 && (
              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="rounded-2xl p-4 bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-md shadow-violet-500/20">
                  <p className="text-2xl font-black">{topicGroups.length}</p>
                  <p className="text-xs font-semibold text-violet-200 mt-0.5">
                    Topics Studied
                  </p>
                </div>
                <div className="rounded-2xl p-4 bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-md shadow-blue-500/20">
                  <p className="text-2xl font-black">{totalMinutesFiltered}</p>
                  <p className="text-xs font-semibold text-blue-200 mt-0.5">
                    Minutes Total
                  </p>
                </div>
                <div className="rounded-2xl p-4 bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/20">
                  <p className="text-2xl font-black">{cachedTopics.size}</p>
                  <p className="text-xs font-semibold text-emerald-200 mt-0.5">
                    Cached Briefs
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── Time Filter ── */}
          <div className="mb-6 flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
              <Filter className="w-4 h-4" />
              Filter by:
            </div>
            {(["1week", "2weeks", "3weeks", "1month"] as TimeFilter[]).map(
              f => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setTimeFilter(f)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-150 ${
                    timeFilter === f
                      ? "bg-violet-600 text-white shadow-md shadow-violet-500/30 scale-105"
                      : "bg-white dark:bg-dark-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-dark-700 hover:border-violet-300 dark:hover:border-violet-600"
                  }`}
                >
                  {filterLabels[f]}
                </button>
              ),
            )}
          </div>

          {/* ── Topic List ── */}
          {logsLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-14 h-14 rounded-2xl bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center animate-pulse">
                <Brain className="w-7 h-7 text-violet-500" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                Loading your study history…
              </p>
            </div>
          ) : topicGroups.length === 0 ? (
            <div className="rounded-2xl p-10 text-center bg-white dark:bg-dark-900 border border-dashed border-slate-200 dark:border-slate-700">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-2">
                No study sessions found
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                You haven't logged any study sessions in the{" "}
                {filterLabels[timeFilter].toLowerCase()}. Try a wider range or
                study more topics!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {topicGroups.map(group => {
                const ck = user
                  ? getCacheKey(user.id, group.topic, group.subject)
                  : "";
                return (
                  <TopicCard
                    key={`${group.subject}-${group.topic}`}
                    group={group}
                    onRevise={handleRevise}
                    loadingTopic={loadingTopic}
                    isCached={cachedTopics.has(ck)}
                  />
                );
              })}
            </div>
          )}

          {/* ── Revision Result Drawer ── */}
          {activeResult && (
            <div
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4"
              onClick={() => setActiveResult(null)}
            >
              <div
                className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-dark-900 shadow-2xl"
                onClick={e => e.stopPropagation()}
              >
                {/* Modal header */}
                <div className="sticky top-0 z-10 flex items-center justify-between p-5 bg-white dark:bg-dark-900 border-b border-slate-200 dark:border-dark-700 rounded-t-3xl">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-violet-500 uppercase tracking-wider">
                        {activeResult.subject}
                      </p>
                      <h2 className="font-black text-slate-900 dark:text-slate-100 text-base leading-tight">
                        {activeResult.topic}
                      </h2>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveResult(null)}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-4 h-4 text-slate-500" />
                  </button>
                </div>

                <div className="p-5 space-y-5">
                  {/* Quick Summary */}
                  <div className="rounded-2xl p-5 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-500/10 dark:to-purple-500/10 border border-violet-200 dark:border-violet-500/20">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-violet-500" />
                        <h3 className="font-bold text-violet-700 dark:text-violet-400">
                          Quick Summary
                        </h3>
                      </div>
                      {activeResult.result.estimatedRevisionTime && (
                        <span className="flex items-center gap-1 text-xs text-violet-600 dark:text-violet-400 bg-white dark:bg-violet-500/20 px-3 py-1 rounded-full font-bold shadow-sm">
                          <Clock className="w-3.5 h-3.5" />~
                          {activeResult.result.estimatedRevisionTime} min
                        </span>
                      )}
                    </div>
                    <p className="leading-relaxed text-sm text-slate-700 dark:text-slate-300">
                      {activeResult.result.quickSummary}
                    </p>
                  </div>

                  {/* Recall Questions */}
                  {activeResult.result.recallQuestions?.length > 0 && (
                    <div className="rounded-2xl p-5 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700">
                      <div className="flex items-center gap-2 mb-4">
                        <Brain className="w-5 h-5 text-blue-500" />
                        <h3 className="font-bold text-slate-900 dark:text-slate-100">
                          Recall Questions
                        </h3>
                        <span className="ml-auto text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full font-semibold">
                          {activeResult.result.recallQuestions.length} Qs
                        </span>
                      </div>
                      <div className="space-y-3">
                        {activeResult.result.recallQuestions.map((q, i) => (
                          <RecallQuestionItem
                            key={`${sessionKey}-q-${i}`}
                            q={q}
                            index={i}
                            diffClass={difficultyClass(q.difficulty)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Flash Cards */}
                  {activeResult.result.flashCards?.length > 0 && (
                    <div className="rounded-2xl p-5 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Zap className="w-5 h-5 text-yellow-500" />
                          <h3 className="font-bold text-slate-900 dark:text-slate-100">
                            Flash Cards
                          </h3>
                        </div>
                        <span className="text-xs text-slate-400 font-semibold">
                          Tap to flip
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {activeResult.result.flashCards.map((card, i) => (
                          <FlipCard
                            key={`${sessionKey}-c-${i}`}
                            card={card}
                            index={i}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Revision Tips */}
                  {activeResult.result.revisionTips?.length > 0 && (
                    <div className="rounded-2xl p-5 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
                      <div className="flex items-center gap-2 mb-4">
                        <Lightbulb className="w-5 h-5 text-amber-500" />
                        <h3 className="font-bold text-amber-700 dark:text-amber-400">
                          Revision Tips
                        </h3>
                      </div>
                      <ul className="space-y-2.5">
                        {activeResult.result.revisionTips.map((tip, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300"
                          >
                            <ArrowRight className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
