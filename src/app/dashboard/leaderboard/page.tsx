"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useCallback } from "react";
import { leaderboardApi } from "@/lib/api";
import Link from "next/link";
import Sidebar from "@/components/dashboard/Sidebar";
import {
  Trophy,
  Flame,
  RefreshCw,
  Users,
  Clock,
  Zap,
  Crown,
} from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  weeklyScore: number;
  totalScore: number;
  streakDays: number;
  badges: string[];
  isMe: boolean;
  medal: string | null;
}

interface LeaderboardData {
  entries: LeaderboardEntry[];
  myRank: number | null;
  myEntry: LeaderboardEntry | null;
  totalParticipants: number;
  resetIn: number;
  board: string;
  classLevel: string;
  weekStart: string;
}

// ── Countdown hook ────────────────────────────────────────────────────────────

function useCountdown(ms: number) {
  const [remaining, setRemaining] = useState(ms);
  useEffect(() => {
    setRemaining(ms);
    const t = setInterval(() => setRemaining(p => Math.max(0, p - 1000)), 1000);
    return () => clearInterval(t);
  }, [ms]);
  return {
    days: Math.floor(remaining / 86400000),
    hours: Math.floor((remaining % 86400000) / 3600000),
    minutes: Math.floor((remaining % 3600000) / 60000),
    seconds: Math.floor((remaining % 60000) / 1000),
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const PODIUM_ORDER = [1, 0, 2]; // silver, gold, bronze visual order

const PODIUM_CONFIG = {
  1: {
    bar: "h-32",
    ring: "border-yellow-400",
    bg: "bg-yellow-500/10",
    text: "text-yellow-400",
    glow: "shadow-yellow-500/20",
    crown: true,
    emoji: "🥇",
  },
  2: {
    bar: "h-20",
    ring: "border-slate-400",
    bg: "bg-slate-500/10",
    text: "text-slate-300",
    glow: "shadow-slate-400/10",
    crown: false,
    emoji: "🥈",
  },
  3: {
    bar: "h-14",
    ring: "border-amber-600",
    bg: "bg-amber-700/10",
    text: "text-amber-500",
    glow: "shadow-amber-600/10",
    crown: false,
    emoji: "🥉",
  },
} as const;

function initials(name: string) {
  return name
    .split(" ")
    .map(w => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LeaderboardPage() {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    setError(null);
    try {
      const res = await leaderboardApi.getLeaderboard();
      setData(res.data.data);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e?.response?.data?.message || "Failed to load leaderboard");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const { days, hours, minutes, seconds } = useCountdown(data?.resetIn ?? 0);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex h-screen bg-slate-50 dark:bg-dark-950">
        <Sidebar />
        <main className="flex-1 overflow-y-auto flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Trophy className="w-12 h-12 text-yellow-400" />
              <span className="absolute inset-0 rounded-full animate-ping bg-yellow-400/20" />
            </div>
            <p className="text-slate-400 text-sm tracking-wide">
              Loading leaderboard…
            </p>
          </div>
        </main>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (error || !data) {
    return (
      <div className="flex h-screen bg-slate-50 dark:bg-dark-950">
        <Sidebar />
        <main className="flex-1 overflow-y-auto flex items-center justify-center">
          <div className="text-center space-y-4 px-6">
            <Trophy className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto" />
            <p className="text-slate-700 dark:text-slate-300 font-semibold">
              Couldn&apos;t load leaderboard
            </p>
            <p className="text-slate-500 text-sm">{error}</p>
            <button
              onClick={() => load()}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors"
            >
              Try again
            </button>
          </div>
        </main>
      </div>
    );
  }

  const top3 = data.entries.slice(0, 3);
  const rest = data.entries.slice(3);
  const podium = PODIUM_ORDER.map(i => top3[i]).filter(Boolean);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-dark-950">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8 max-w-2xl mx-auto space-y-5 pb-24">
          {/* ── Header ──────────────────────────────────────────────────── */}
          <div className="flex items-start justify-between animate-fade-up stagger-1">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Crown className="w-4 h-4 text-yellow-500" />
                <span className="text-xs font-semibold uppercase tracking-widest text-yellow-600 dark:text-yellow-400/80">
                  Weekly Rankings
                </span>
              </div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Leaderboard
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                {data.board} · Class {data.classLevel} ·{" "}
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  {data.totalParticipants} students
                </span>
              </p>
            </div>
            <button
              onClick={() => load(true)}
              disabled={refreshing}
              className="mt-1 p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white transition-all disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw
                className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              />
            </button>
          </div>

          {/* My Standing Card */}
          {data.myEntry && (
            <div className="rounded-2xl border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-600/10 p-4 animate-fade-up stagger-2">
              <p className="text-xs uppercase tracking-widest text-indigo-500 dark:text-indigo-400 mb-3 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> Your Standing This Week
              </p>
              <div className="flex items-center gap-4">
                {/* Big rank */}
                <div className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 shrink-0 shadow-lg shadow-indigo-500/20">
                  <span className="text-xs text-indigo-200 font-semibold leading-none">
                    Rank
                  </span>
                  <span className="text-2xl font-black text-white leading-tight">
                    #{data.myRank}
                  </span>
                </div>

                {/* Stats */}
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-white dark:bg-white/5 border border-indigo-100 dark:border-indigo-500/20 px-3 py-2">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      XP this week
                    </p>
                    <p className="text-base font-black text-indigo-600 dark:text-indigo-300">
                      {data.myEntry.weeklyScore}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white dark:bg-white/5 border border-indigo-100 dark:border-indigo-500/20 px-3 py-2">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Streak
                    </p>
                    <p className="text-base font-black text-orange-500 dark:text-orange-400 flex items-center gap-1">
                      <Flame className="w-4 h-4" />
                      {data.myEntry.streakDays}d
                    </p>
                  </div>
                </div>
              </div>

              {/* Gap to person above */}
              {data.myRank &&
                data.myRank > 1 &&
                (() => {
                  const above = data.entries[data.myRank - 2]; // rank above = index myRank-2
                  if (!above) return null;
                  const gap = above.weeklyScore - data.myEntry!.weeklyScore;
                  return (
                    <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                      {gap > 0 ? (
                        <>
                          You&apos;re{" "}
                          <span className="text-indigo-600 dark:text-indigo-300 font-bold">
                            {gap} XP
                          </span>{" "}
                          behind{" "}
                          <span className="font-semibold text-slate-700 dark:text-slate-200">
                            {above.name.split(" ")[0]}
                          </span>{" "}
                          (#{above.rank}) — keep going! 🔥
                        </>
                      ) : (
                        <>
                          You&apos;re tied with the person above you — push
                          harder! 💪
                        </>
                      )}
                    </p>
                  );
                })()}
            </div>
          )}

          {/* ── Countdown ───────────────────────────────────────────────── */}
          <div className="rounded-2xl border border-slate-200 dark:border-white/[0.07] bg-white dark:bg-white/[0.03] p-4 animate-fade-up stagger-2">
            <div className="flex items-center gap-2 mb-3 text-slate-400 dark:text-slate-500 text-xs uppercase tracking-widest">
              <Clock className="w-3.5 h-3.5" />
              Resets on Monday
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { val: days, label: "Days" },
                { val: hours, label: "Hours" },
                { val: minutes, label: "Mins" },
                { val: seconds, label: "Secs" },
              ].map(({ val, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center justify-center bg-slate-50 dark:bg-white/[0.04] rounded-xl py-3 border border-slate-100 dark:border-white/[0.06]"
                >
                  <span className="text-2xl font-black tabular-nums text-slate-900 dark:text-white">
                    {String(val).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-0.5">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Podium ──────────────────────────────────────────────────── */}
          {podium.length > 0 && (
            <div className="rounded-2xl border border-slate-200 dark:border-white/[0.07] bg-white dark:bg-white/[0.02] p-5 animate-fade-up stagger-3">
              <p className="text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-6 text-center">
                🏆 This Week&apos;s Top 3
              </p>
              <div className="flex items-end justify-center gap-4">
                {podium.map(entry => {
                  const cfg = PODIUM_CONFIG[entry.rank as 1 | 2 | 3];
                  return (
                    <div
                      key={entry.userId}
                      className="flex flex-col items-center gap-2"
                      style={{ flex: entry.rank === 1 ? 1.2 : 1 }}
                    >
                      {cfg.crown && (
                        <Crown
                          className="w-5 h-5 text-yellow-400 mb-0.5"
                          style={{ animation: "bounce 2s infinite" }}
                        />
                      )}

                      <div
                        className={`
                        relative rounded-full border-2 flex items-center justify-center font-bold
                        ${cfg.bg} ${cfg.ring} ${cfg.text} shadow-lg ${cfg.glow}
                        ${entry.rank === 1 ? "w-16 h-16 text-lg" : "w-12 h-12 text-sm"}
                        ${entry.isMe ? "ring-2 ring-offset-2 ring-offset-white dark:ring-offset-dark-950 ring-indigo-400" : ""}
                      `}
                      >
                        {initials(entry.name)}
                        <span className="absolute -bottom-2 -right-1 text-sm leading-none">
                          {cfg.emoji}
                        </span>
                      </div>

                      <div className="text-center mt-1.5">
                        <p
                          className={`text-xs font-bold truncate max-w-[72px] ${entry.isMe ? "text-indigo-500 dark:text-indigo-300" : "text-slate-700 dark:text-slate-200"}`}
                        >
                          {entry.isMe ? "You" : entry.name.split(" ")[0]}
                        </p>
                        <p className={`text-sm font-black ${cfg.text}`}>
                          {entry.weeklyScore}
                          <span className="text-xs font-semibold ml-0.5 opacity-70">
                            XP
                          </span>
                        </p>
                        {entry.streakDays > 0 && (
                          <p className="text-[10px] text-orange-500 dark:text-orange-400 flex items-center justify-center gap-0.5 mt-0.5">
                            <Flame className="w-2.5 h-2.5" />
                            {entry.streakDays}d
                          </p>
                        )}
                      </div>

                      <div
                        className={`
                        w-full ${cfg.bar} rounded-t-xl border-t border-x flex items-center justify-center
                        ${
                          entry.rank === 1
                            ? "bg-gradient-to-b from-yellow-500/25 to-yellow-900/5 border-yellow-500/30"
                            : entry.rank === 2
                              ? "bg-gradient-to-b from-slate-400/20 to-slate-800/5 border-slate-300/30 dark:border-slate-500/20"
                              : "bg-gradient-to-b from-amber-700/20 to-amber-900/5 border-amber-600/20"
                        }
                      `}
                      >
                        <span
                          className={`text-lg font-black opacity-30 ${cfg.text}`}
                        >
                          {entry.rank}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Rankings 4th onwards ────────────────────────────────────── */}
          {rest.length > 0 && (
            <div className="space-y-1.5 animate-fade-up stagger-4">
              <p className="text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500 px-1 mb-3">
                Rankings
              </p>
              {rest.map((entry, idx) => {
                // Show a "···" gap separator when jumping to user's row and they're not adjacent
                const prevEntry = rest[idx - 1];
                const showGap =
                  entry.isMe && prevEntry && entry.rank - prevEntry.rank > 1;
                return (
                  <div key={entry.userId}>
                    {showGap && (
                      <div className="flex items-center gap-2 py-2 px-4">
                        <div className="flex-1 border-t border-dashed border-slate-200 dark:border-white/10" />
                        <span className="text-xs text-slate-400 dark:text-slate-600 font-mono">
                          ···
                        </span>
                        <div className="flex-1 border-t border-dashed border-slate-200 dark:border-white/10" />
                      </div>
                    )}
                    <div
                      className={`
                        relative flex items-center gap-3 px-4 py-3 rounded-xl border transition-all
                        ${
                          entry.isMe
                            ? "bg-indigo-50 dark:bg-indigo-600/10 border-indigo-200 dark:border-indigo-500/40 shadow-sm"
                            : "bg-white dark:bg-white/[0.025] border-slate-100 dark:border-white/[0.05] hover:bg-slate-50 dark:hover:bg-white/[0.05] hover:border-slate-200 dark:hover:border-white/10"
                        }
                      `}
                    >
                      {entry.isMe && (
                        <span className="absolute left-0 top-2 bottom-2 w-0.5 bg-indigo-500 rounded-full" />
                      )}

                      <div
                        className={`w-7 text-center text-xs font-black shrink-0 tabular-nums ${entry.isMe ? "text-indigo-500 dark:text-indigo-400" : "text-slate-400 dark:text-slate-600"}`}
                      >
                        {entry.rank}
                      </div>

                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${entry.isMe ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-white/[0.08] text-slate-600 dark:text-slate-300"}`}
                      >
                        {initials(entry.name)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-semibold truncate leading-tight ${entry.isMe ? "text-indigo-700 dark:text-indigo-200" : "text-slate-700 dark:text-slate-200"}`}
                        >
                          {entry.isMe ? `${entry.name} (You)` : entry.name}
                        </p>
                        {entry.streakDays > 0 && (
                          <p className="text-[11px] text-orange-500 dark:text-orange-400 flex items-center gap-1 mt-0.5">
                            <Flame className="w-3 h-3" />
                            {entry.streakDays} day streak
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <p
                          className={`text-sm font-black tabular-nums ${entry.isMe ? "text-indigo-600 dark:text-indigo-300" : "text-slate-700 dark:text-slate-200"}`}
                        >
                          {entry.weeklyScore}
                          <span className="text-xs font-semibold ml-0.5 opacity-60">
                            XP
                          </span>
                        </p>
                        {data.entries[0]?.weeklyScore > 0 && (
                          <div className="w-16 h-1 rounded-full bg-slate-100 dark:bg-white/[0.06] overflow-hidden">
                            <div
                              className={`h-full rounded-full ${entry.isMe ? "bg-indigo-500" : "bg-slate-300 dark:bg-slate-600"}`}
                              style={{
                                width: `${Math.max(4, (entry.weeklyScore / data.entries[0].weeklyScore) * 100)}%`,
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Empty state ─────────────────────────────────────────────── */}
          {data.entries.length === 0 && (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.07] flex items-center justify-center">
                <Trophy className="w-8 h-8 text-slate-400 dark:text-slate-600" />
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-300 font-semibold">
                  No activity yet
                </p>
                <p className="text-slate-500 text-sm mt-1">
                  Complete daily missions to earn XP and climb the board!
                </p>
              </div>
              <Link
                href="/dashboard"
                className="mt-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors"
              >
                Go to Missions →
              </Link>
            </div>
          )}

          {/* ── Badge legend ─────────────────────────────────────────────── */}
          <div className="rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.02] p-4">
            <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-yellow-500" />
              Badges awarded on Monday reset
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[
                {
                  emoji: "🥇",
                  label: "Weekly Champion",
                  color:
                    "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/20",
                },
                {
                  emoji: "🥈",
                  label: "Runner-up",
                  color:
                    "text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-500/10 border-slate-200 dark:border-slate-500/20",
                },
                {
                  emoji: "🥉",
                  label: "Third Place",
                  color:
                    "text-amber-700 dark:text-amber-500 bg-amber-50 dark:bg-amber-700/10 border-amber-200 dark:border-amber-700/20",
                },
              ].map(b => (
                <div
                  key={b.label}
                  className={`rounded-xl border px-3 py-2.5 text-center ${b.color}`}
                >
                  <div className="text-xl mb-1">{b.emoji}</div>
                  <p className="text-[10px] font-semibold leading-tight opacity-80">
                    {b.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* ── Sticky "You" row — shown when not in top 3 ───────────────────── */}
      {data.myRank && data.myRank > 3 && data.myEntry && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-xl px-4 z-30">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/95 dark:bg-indigo-950/95 border border-indigo-200 dark:border-indigo-500/50 backdrop-blur-md shadow-xl shadow-indigo-100/50 dark:shadow-indigo-900/40">
            <div className="flex flex-col items-center w-8 shrink-0">
              <span className="text-[10px] text-indigo-400 dark:text-indigo-500 font-semibold leading-none">
                YOU
              </span>
              <span className="text-sm font-black text-indigo-600 dark:text-indigo-300">
                #{data.myRank}
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
              {initials(data.myEntry.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-700 dark:text-indigo-200 truncate leading-tight">
                {data.myEntry.name}
              </p>
              {(() => {
                const above = data.entries[data.myRank - 2];
                if (!above) return null;
                const gap = above.weeklyScore - data.myEntry!.weeklyScore;
                return (
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                    {gap > 0
                      ? `${gap} XP behind ${above.name.split(" ")[0]} (#${above.rank})`
                      : "Tied with rank above!"}
                  </p>
                );
              })()}
            </div>
            <p className="text-sm font-black text-indigo-600 dark:text-indigo-300 shrink-0">
              {data.myEntry.weeklyScore}
              <span className="text-xs font-semibold ml-0.5 opacity-60">
                XP
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
