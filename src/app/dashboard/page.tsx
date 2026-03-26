"use client";

export const dynamic = "force-dynamic";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

import Sidebar from "@/components/dashboard/Sidebar";
import { dashboardApi, agentApi, streakApi, leaderboardApi } from "@/lib/api";
import {
  useDashboard,
  useStreak,
  useMissions,
  useDailyFlow,
  useCompleteTask,
  useLeaderboard,
} from "@/hooks/useDashboard";
import { useAuthStore } from "@/store/authStore";
import { useTranslation } from "@/hooks/useTranslation";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";
import {
  Brain,
  Camera,
  Calculator,
  Calendar,
  RefreshCw,
  HelpCircle,
  Zap,
  Target,
  CheckCircle2,
  Circle,
  Clock,
  Star,
  Trophy,
  Flame,
  ChevronRight,
  X,
  Lock,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface DashboardStats {
  streakDays: number;
  studyScore: number;
  totalStudyMinutes: number;
  weeklyMinutes: number;
  badges: string[];
}

interface Profile {
  classLevel: string;
  board: string;
  subjects: string[];
}

interface StreakData {
  streakDays: number;
  studyScore: number;
  studiedToday: boolean;
  last7Days: Record<string, boolean>;
  nextMilestone: number;
  xpToday: number;
  powerHourActive?: boolean;
  powerHourEnds?: string | null;
  powerHourTime?: string | null; // "HH:MM" chosen by user
  powerHourSetThisMonth?: boolean; // true if already locked in this month
  streakShields?: number; // earned at every 7-day milestone
}

interface Mission {
  _id: string;
  title: string;
  subject: string;
  estimatedMinutes: number;
  priority: string;
  scoreReward: number;
  isCompleted: boolean;
}

// ── Quick module tiles ────────────────────────────────────────────────────────

const quickModules = [
  {
    href: "/dashboard/class-translator",
    icon: Brain,
    label: "Understand Class",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    href: "/dashboard/smart-notes",
    icon: Camera,
    label: "Vision Lens",
    gradient: "from-violet-500 to-cyan-500",
  },
  {
    href: "/dashboard/maths-helper",
    icon: Calculator,
    label: "Maths Helper",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    href: "/dashboard/study-planner",
    icon: Calendar,
    label: "Study Planner",
    gradient: "from-orange-500 to-amber-500",
  },
  {
    href: "/dashboard/revision",
    icon: RefreshCw,
    label: "Auto Revision",
    gradient: "from-teal-500 to-cyan-600",
  },
  {
    href: "/dashboard/question-generator",
    icon: HelpCircle,
    label: "Question Bank",
    gradient: "from-rose-500 to-pink-600",
  },
];

// ── Power Hour countdown hook ─────────────────────────────────────────────────

function useCountdown(endsAt: Date | null) {
  const [msLeft, setMsLeft] = useState(() =>
    endsAt ? Math.max(0, endsAt.getTime() - Date.now()) : 0,
  );
  useEffect(() => {
    if (!endsAt) return;
    setMsLeft(Math.max(0, endsAt.getTime() - Date.now()));
    const t = setInterval(() => {
      const remaining = Math.max(0, endsAt.getTime() - Date.now());
      setMsLeft(remaining);
      if (remaining === 0) clearInterval(t);
    }, 1000);
    return () => clearInterval(t);
  }, [endsAt]);
  const totalSecs = Math.floor(msLeft / 1000);
  return { mins: Math.floor(totalSecs / 60), secs: totalSecs % 60, msLeft };
}

function PowerHourInline({
  powerHourEnds,
  onDismiss,
}: {
  powerHourEnds: string;
  onDismiss: () => void;
}) {
  const { t } = useTranslation();
  const endsAt = new Date(powerHourEnds);
  const { mins, secs, msLeft } = useCountdown(endsAt);
  if (msLeft === 0) return null;
  return (
    <div className="relative overflow-hidden rounded-2xl border px-3 sm:px-5 py-3 sm:py-3.5 bg-gradient-to-r from-yellow-400/10 via-amber-400/10 to-orange-400/10 dark:from-yellow-500/15 dark:via-amber-500/15 dark:to-orange-500/15 border-yellow-400/40 dark:border-yellow-500/30 shadow-lg shadow-yellow-400/10 animate-fade-up">
      {/* shimmer sweep */}
      <div className="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer_2.5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-yellow-300/10 to-transparent" />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        {/* left: icon + text */}
        <div className="flex items-start sm:items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="relative shrink-0 mt-0.5 sm:mt-0">
            <div className="absolute inset-0 rounded-full bg-yellow-400/30 animate-ping" />
            <div className="relative w-8 sm:w-9 h-8 sm:h-9 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-md shadow-yellow-500/30">
              <Zap className="w-4 sm:w-5 h-4 sm:h-5 text-white fill-white" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-black text-yellow-700 dark:text-yellow-300 flex items-center gap-1.5 flex-wrap">
              {t("dashboard.power_hour_active")}
              <span className="font-semibold text-yellow-600 dark:text-yellow-400 text-[10px] sm:text-xs bg-yellow-400/15 dark:bg-yellow-400/20 px-1.5 sm:px-2 py-0.5 rounded-full border border-yellow-400/30 flex-shrink-0">
                {t("dashboard.double_xp")}
              </span>
            </p>
            <p className="text-[11px] sm:text-xs text-yellow-600/80 dark:text-yellow-400/70 mt-0.5 line-clamp-1">
              {t("dashboard.complete_missions")}
            </p>
          </div>
        </div>

        {/* right: countdown + dismiss */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="flex items-center gap-1">
            <div className="flex flex-col items-center bg-yellow-500/15 dark:bg-yellow-400/10 rounded-lg px-1.5 sm:px-2 py-0.5 border border-yellow-400/20 min-w-[30px] sm:min-w-[36px]">
              <span className="text-sm sm:text-lg font-black tabular-nums text-yellow-700 dark:text-yellow-300 leading-none">
                {String(mins).padStart(2, "0")}
              </span>
              <span className="text-[7px] sm:text-[8px] uppercase tracking-wider text-yellow-600/60 dark:text-yellow-400/50">
                {t("common.time_min")}
              </span>
            </div>
            <span className="text-yellow-500 font-black text-sm sm:text-lg leading-none mb-1 sm:mb-2">
              :
            </span>
            <div className="flex flex-col items-center bg-yellow-500/15 dark:bg-yellow-400/10 rounded-lg px-1.5 sm:px-2 py-0.5 border border-yellow-400/20 min-w-[30px] sm:min-w-[36px]">
              <span className="text-sm sm:text-lg font-black tabular-nums text-yellow-700 dark:text-yellow-300 leading-none">
                {String(secs).padStart(2, "0")}
              </span>
              <span className="text-[7px] sm:text-[8px] uppercase tracking-wider text-yellow-600/60 dark:text-yellow-400/50">
                {t("common.time_sec")}
              </span>
            </div>
          </div>
          <button
            onClick={onDismiss}
            className="p-1 sm:p-1.5 rounded-lg text-yellow-600/60 dark:text-yellow-400/50 hover:text-yellow-700 dark:hover:text-yellow-300 hover:bg-yellow-400/10 transition-colors flex-shrink-0"
          >
            <X className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
          </button>
        </div>
      </div>

      {/* draining progress bar */}
      <div className="mt-2 sm:mt-3 h-1 rounded-full bg-yellow-400/15 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-1000"
          style={{ width: `${(msLeft / (60 * 60 * 1000)) * 100}%` }}
        />
      </div>
    </div>
  );
}

// ── Power Hour Schedule Card ──────────────────────────────────────────────────

function PowerHourScheduleCard({
  powerHourTime,
  powerHourSetThisMonth,
  onLocked,
}: {
  powerHourTime?: string | null;
  powerHourSetThisMonth?: boolean;
  onLocked: (time: string) => void;
}) {
  const { t } = useTranslation();
  const [hour, setHour] = useState(20);
  const [minute, setMinute] = useState(0);
  const [saving, setSaving] = useState(false);

  // Days left in current month (excluding today)
  const now = new Date();
  const firstOfNext = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const daysLeft = Math.ceil(
    (firstOfNext.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );
  const resetDateLabel = firstOfNext.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
  });

  // Format "HH:MM" → "8:00 PM"
  function fmtTime(hhmm: string) {
    const [h, m] = hhmm.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${String(m).padStart(2, "0")} ${period}`;
  }

  const handleLock = async () => {
    setSaving(true);
    try {
      const res = await streakApi.setPowerHourSchedule(hour, minute);
      onLocked(res.data.time);
      toast.success(res.data.message, { icon: "⚡", duration: 4000 });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Could not save schedule");
    } finally {
      setSaving(false);
    }
  };

  // ── LOCKED STATE — already set this month ────────────────────────────────
  if (powerHourSetThisMonth && powerHourTime) {
    const [lockedH, lockedM] = powerHourTime.split(":").map(Number);

    return (
      <div className="rounded-2xl border border-yellow-400/30 dark:border-yellow-500/20 bg-yellow-400/5 dark:bg-yellow-500/5 px-4 sm:px-5 py-4">
        {/* Header row */}
        <div className="flex items-start sm:items-center gap-2 sm:gap-3 mb-4">
          <div className="relative w-9 sm:w-10 h-9 sm:h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center flex-shrink-0 shadow shadow-yellow-400/30 mt-1 sm:mt-0">
            <Zap className="w-4 sm:w-5 h-4 sm:h-5 text-white fill-white" />
            {/* lock badge */}
            <div className="absolute -bottom-1 -right-1 w-3.5 sm:w-4 h-3.5 sm:h-4 rounded-full bg-white dark:bg-dark-900 flex items-center justify-center border border-yellow-400/40">
              <Lock className="w-2 sm:w-2.5 h-2 sm:h-2.5 text-yellow-500" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-black text-yellow-700 dark:text-yellow-300 flex items-center gap-1.5 flex-wrap">
              {t("dashboard.power_hour_locked_in")}
            </p>
            <p className="text-[11px] sm:text-xs text-yellow-600/70 dark:text-yellow-400/60 mt-0.5 line-clamp-2">
              {t("dashboard.fires_every_day_at")}{" "}
              <span className="font-bold font-mono text-yellow-700 dark:text-yellow-300">
                {fmtTime(powerHourTime)}
              </span>{" "}
              {t("dashboard.for_60_minutes")}
            </p>
          </div>
        </div>

        {/* Greyed-out read-only pickers */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 flex-wrap mb-3 opacity-50 pointer-events-none select-none">
          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <label className="text-[10px] uppercase tracking-wider text-slateate-400 font-semibold">
              {t("dashboard.hour")}
            </label>
            <select
              disabled
              value={lockedH}
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-slate-200 dark:border-dark-700 bg-slate-100 dark:bg-dark-800 text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-500 cursor-not-allowed"
            >
              {Array.from({ length: 24 }, (_, i) => {
                const period = i >= 12 ? "PM" : "AM";
                const h12 = i % 12 || 12;
                return (
                  <option key={i} value={i}>
                    {h12} {period}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <label className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
              {t("dashboard.minute")}
            </label>
            <select
              disabled
              value={lockedM}
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-slate-200 dark:border-dark-700 bg-slate-100 dark:bg-dark-800 text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-500 cursor-not-allowed"
            >
              {[0, 15, 30, 45].map(m => (
                <option key={m} value={m}>
                  :{String(m).padStart(2, "0")}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <label className="text-[10px] uppercase tracking-wider text-transparent select-none">
              Go
            </label>
            <button
              disabled
              className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-slate-200 dark:bg-dark-700 text-slate-400 text-xs sm:text-sm font-black cursor-not-allowed whitespace-nowrap w-full sm:w-auto"
            >
              <Lock className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
              <span>{t("dashboard.locked")}</span>
            </button>
          </div>
        </div>

        {/* Cannot-change notice */}
        <div className="flex items-start gap-2 rounded-xl bg-yellow-400/10 dark:bg-yellow-500/10 border border-yellow-400/20 px-2.5 sm:px-3 py-1.5 sm:py-2">
          <Lock className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] sm:text-xs text-yellow-700 dark:text-yellow-400 leading-snug">
            {t("dashboard.cannot_change_power_hour", {
              date: resetDateLabel,
              days: daysLeft,
            })}
          </p>
        </div>
      </div>
    );
  }

  // ── UNLOCKED STATE — pick a time ─────────────────────────────────────────
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-dark-700 bg-white dark:bg-dark-900 px-4 sm:px-5 py-4">
      <div className="flex items-start sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="w-8 sm:w-8 h-8 sm:h-8 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center flex-shrink-0 shadow shadow-yellow-400/20 mt-1 sm:mt-0">
          <Zap className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-white fill-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100">
            {t("dashboard.set_power_hour")}
          </p>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 leading-snug mt-0.5 line-clamp-2">
            {t("dashboard.power_hour_form_helper")} —{" "}
            <span className="text-yellow-600 dark:text-yellow-400 font-bold">
              {t("dashboard.double_xp")}
            </span>
            . {t("dashboard.lock_in_notice", { date: resetDateLabel })}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-2 sm:gap-3 flex-wrap">
        {/* Hour picker */}
        <div className="flex flex-col gap-1 w-full sm:w-auto">
          <label className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
            {t("dashboard.hour")}
          </label>
          <select
            value={hour}
            onChange={e => setHour(Number(e.target.value))}
            className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-slate-200 dark:border-dark-700 bg-slate-50 dark:bg-dark-800 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-yellow-400/40 w-full sm:w-auto"
          >
            {Array.from({ length: 24 }, (_, i) => {
              const period = i >= 12 ? "PM" : "AM";
              const h12 = i % 12 || 12;
              return (
                <option key={i} value={i}>
                  {h12} {period}
                </option>
              );
            })}
          </select>
        </div>

        {/* Minute picker */}
        <div className="flex flex-col gap-1 w-full sm:w-auto">
          <label className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
            {t("dashboard.minute")}
          </label>
          <select
            value={minute}
            onChange={e => setMinute(Number(e.target.value))}
            className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-slate-200 dark:border-dark-700 bg-slate-50 dark:bg-dark-800 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-yellow-400/40 w-full sm:w-auto"
          >
            {[0, 15, 30, 45].map(m => (
              <option key={m} value={m}>
                :{String(m).padStart(2, "0")}
              </option>
            ))}
          </select>
        </div>

        {/* Lock In button */}
        <div className="flex flex-col gap-1 w-full sm:w-auto">
          <label className="text-[10px] uppercase tracking-wider text-transparent select-none">
            Go
          </label>
          <button
            onClick={handleLock}
            disabled={saving}
            className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs sm:text-sm font-black shadow shadow-yellow-400/30 hover:opacity-90 active:scale-95 transition-all disabled:opacity-60 whitespace-nowrap w-full sm:w-auto"
          >
            <Lock className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
            {saving ? t("common.saving") : t("dashboard.lock_in")}
          </button>
        </div>

        <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 w-full sm:w-auto">
          {t("dashboard.power_hour_days_left", { days: daysLeft })}
        </p>
      </div>
    </div>
  );
}

// ── Milestone config ─────────────────────────────────────────────────────────

const MILESTONES: Record<
  number,
  {
    emoji: string;
    particles: string[];
    badge: string;
    title: string;
    subtitle: string;
    colors: [string, string];
    bg: string;
  }
> = {
  7: {
    emoji: "🔥",
    particles: ["🔥", "⭐", "✨", "💥", "🌟", "🔥", "⭐", "💫", "🔥", "✨"],
    badge: "milestone.7day_badge",
    title: "milestone.7day_title",
    subtitle: "milestone.7day_subtitle",
    colors: ["#f97316", "#ef4444"],
    bg: "from-orange-600/30 via-red-600/20 to-pink-600/20",
  },
  14: {
    emoji: "⚡",
    particles: ["⚡", "💜", "🌙", "✨", "⭐", "⚡", "💫", "🔮", "⚡", "🌟"],
    badge: "milestone.14day_badge",
    title: "milestone.14day_title",
    subtitle: "milestone.14day_subtitle",
    colors: ["#a855f7", "#6366f1"],
    bg: "from-purple-600/30 via-indigo-600/20 to-violet-600/20",
  },
  30: {
    emoji: "👑",
    particles: ["👑", "🌟", "💛", "✨", "🏆", "👑", "⭐", "💎", "👑", "🌟"],
    badge: "milestone.30day_badge",
    title: "milestone.30day_title",
    subtitle: "milestone.30day_subtitle",
    colors: ["#eab308", "#f97316"],
    bg: "from-yellow-500/30 via-amber-500/20 to-orange-500/20",
  },
};

// ── Floating particle ─────────────────────────────────────────────────────────

function FloatingParticle({
  emoji,
  x,
  delay,
  dur,
  rot,
  size,
}: {
  emoji: string;
  x: number;
  delay: number;
  dur: number;
  rot: number;
  size: number;
}) {
  return (
    <span
      className="absolute bottom-0 pointer-events-none select-none leading-none animate-[floatUp_var(--dur)_ease-out_var(--delay)_both]"
      style={
        {
          left: `${x}%`,
          fontSize: `${size}px`,
          "--dur": `${dur}s`,
          "--delay": `${delay}s`,
          "--rot": `${rot}deg`,
        } as React.CSSProperties
      }
    >
      {emoji}
    </span>
  );
}

// ── Milestone Celebration Modal ───────────────────────────────────────────────

function MilestoneCelebration({
  streak,
  onClose,
}: {
  streak: number;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const m = MILESTONES[streak];
  if (!m) return null;

  // Milestone-specific translation keys
  const milestoneData: Record<number, { titleKey: string; subtitleKey: string; badgeKey: string }> = {
    7: { titleKey: "milestone.7day_title", subtitleKey: "milestone.7day_subtitle", badgeKey: "milestone.7day_badge" },
    14: { titleKey: "milestone.14day_title", subtitleKey: "milestone.14day_subtitle", badgeKey: "milestone.14day_badge" },
    30: { titleKey: "milestone.30day_title", subtitleKey: "milestone.30day_subtitle", badgeKey: "milestone.30day_badge" },
  };

  const mData = milestoneData[streak] || { titleKey: m.title, subtitleKey: m.subtitle, badgeKey: m.badge };

  // ── Heavy confetti sequence ──────────────────────────────────────────────
  useEffect(() => {
    // 1. Immediate centre BOOM
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { x: 0.5, y: 0.5 },
      colors: [
        m.colors[0],
        m.colors[1],
        "#ffffff",
        "#fbbf24",
        "#34d399",
        "#f472b6",
      ],
      startVelocity: 60,
      scalar: 1.3,
      gravity: 0.8,
      ticks: 300,
    });

    // 2. 0.3s later — left + right cannon burst
    const t1 = setTimeout(() => {
      confetti({
        particleCount: 120,
        angle: 55,
        spread: 70,
        origin: { x: 0, y: 0.6 },
        colors: [m.colors[0], "#ffffff", "#fbbf24"],
        startVelocity: 55,
        scalar: 1.1,
      });
      confetti({
        particleCount: 120,
        angle: 125,
        spread: 70,
        origin: { x: 1, y: 0.6 },
        colors: [m.colors[1], "#ffffff", "#34d399"],
        startVelocity: 55,
        scalar: 1.1,
      });
    }, 300);

    // 3. 0.7s — top corners rain down
    const t2 = setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: -80,
        spread: 50,
        origin: { x: 0.1, y: 0 },
        startVelocity: 30,
        gravity: 1.2,
        colors: [m.colors[0], "#f472b6", "#fbbf24"],
      });
      confetti({
        particleCount: 80,
        angle: -100,
        spread: 50,
        origin: { x: 0.9, y: 0 },
        startVelocity: 30,
        gravity: 1.2,
        colors: [m.colors[1], "#34d399", "#ffffff"],
      });
    }, 700);

    // 4. 1.5s — second big centre burst
    const t3 = setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 120,
        origin: { x: 0.5, y: 0.4 },
        colors: [m.colors[0], m.colors[1], "#ffffff", "#fbbf24"],
        startVelocity: 50,
        scalar: 1.0,
        shapes: ["circle", "square"],
      });
    }, 1500);

    // 5. 2.5s — final sides sweep
    const t4 = setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 80,
        origin: { x: 0, y: 0.7 },
        colors: [m.colors[0], "#ffffff"],
      });
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 80,
        origin: { x: 1, y: 0.7 },
        colors: [m.colors[1], "#fbbf24"],
      });
      confetti({
        particleCount: 60,
        angle: 90,
        spread: 60,
        origin: { x: 0.5, y: 1.0 },
        startVelocity: 40,
        colors: ["#f472b6", "#34d399", "#ffffff"],
      });
    }, 2500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [m]);

  // Auto-close after 7 s
  useEffect(() => {
    const t = setTimeout(onClose, 7000);
    return () => clearTimeout(t);
  }, [onClose]);

  // Pre-generate stable particle positions
  const particles = Array.from({ length: 28 }, (_, i) => ({
    emoji: m.particles[i % m.particles.length],
    x: (i * 37 + 5) % 95,
    delay: (i * 0.22) % 2.8,
    dur: 2.6 + ((i * 0.13) % 1.4),
    rot: ((i * 53) % 60) - 30,
    size: 22 + ((i * 7) % 28),
  }));

  return (
    <div
      className="fixed inset-0 z-[60] overflow-hidden"
      style={{ animation: "fadeIn 0.2s ease both" }}
    >
      {/* ── Full-screen gradient backdrop ── */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${m.bg} backdrop-blur-md`}
        style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
        onClick={onClose}
      />

      {/* ── Floating emoji particles — full screen ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p, i) => (
          <FloatingParticle key={i} {...p} />
        ))}
      </div>

      {/* ── Pulsing glow rings in background ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className="absolute rounded-full border-2 opacity-20"
            style={{
              width: `${i * 28}vw`,
              height: `${i * 28}vw`,
              borderColor: m.colors[i % 2],
              animation: `pulseRing ${1.2 + i * 0.4}s ease-out ${i * 0.3}s infinite`,
            }}
          />
        ))}
      </div>

      {/* ── Floating celebratory words ── */}
      {[
        "milestone.amazing_word",
        "milestone.you_did_it_word",
        "milestone.legendary_word",
        "milestone.on_fire_word",
        "milestone.unstoppable_word",
      ].map((wordKey, i) => (
        <span
          key={i}
          className="absolute font-black text-white/10 select-none pointer-events-none uppercase tracking-widest"
          style={{
            fontSize: `${5 + (i % 3) * 2}vw`,
            left: `${(i * 21 + 3) % 70}%`,
            top: `${(i * 17 + 8) % 75}%`,
            transform: `rotate(${((i * 23) % 30) - 15}deg)`,
            animation: `fadeIn ${0.8 + i * 0.15}s ease both`,
            color: i % 2 === 0 ? m.colors[0] : m.colors[1],
            opacity: 0.12,
          }}
        >
          {t(wordKey)}
        </span>
      ))}

      {/* ── Centre card ── */}
      <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="relative w-full max-w-sm pointer-events-auto"
          style={{
            animation: "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.1s both",
          }}
        >
          {/* Card glow halo */}
          <div
            className="absolute inset-0 rounded-3xl blur-2xl opacity-40 scale-110"
            style={{
              background: `linear-gradient(135deg, ${m.colors[0]}, ${m.colors[1]})`,
            }}
          />

          <div
            className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            style={{ background: "rgba(15,23,42,0.92)" }}
          >
            {/* Top gradient bar */}
            <div
              className="h-1.5 w-full"
              style={{
                background: `linear-gradient(90deg, ${m.colors[0]}, ${m.colors[1]})`,
              }}
            />

            {/* Dismiss X */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="px-7 pt-8 pb-7 text-center">
              {/* Pulsing emoji */}
              <div className="relative inline-block mb-4">
                <div
                  className="absolute inset-0 rounded-full blur-xl opacity-60 animate-pulse"
                  style={{ background: m.colors[0], transform: "scale(1.4)" }}
                />
                <span
                  className="relative text-8xl leading-none select-none block animate-[wiggle_0.6s_ease-in-out_0.4s_both]"
                  style={{ filter: `drop-shadow(0 0 24px ${m.colors[0]})` }}
                >
                  {m.emoji}
                </span>
              </div>

              {/* Big streak number with shimmer */}
              <p
                className="text-7xl font-black leading-none mb-1 animate-[popIn_0.5s_cubic-bezier(0.34,1.56,0.64,1)_0.3s_both]"
                style={{
                  background: `linear-gradient(90deg, ${m.colors[0]}, ${m.colors[1]}, ${m.colors[0]})`,
                  backgroundSize: "200% auto",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  animation:
                    "popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.3s both, textShimmer 2s linear 0.8s infinite",
                }}
              >
                {streak}
              </p>
              <p className="text-white/50 text-sm font-bold uppercase tracking-widest mb-4">
                {t("milestone.day_streak_label")}
              </p>

              {/* Badge pill */}
              <div
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-white font-black text-sm mb-5 shadow-xl animate-[popIn_0.5s_cubic-bezier(0.34,1.56,0.64,1)_0.5s_both]"
                style={{
                  background: `linear-gradient(135deg, ${m.colors[0]}, ${m.colors[1]})`,
                }}
              >
                <Star className="w-4 h-4 fill-white" />
                {t(mData.badgeKey)}
              </div>

              {/* Title */}
              <h2
                className="text-2xl font-black mb-2 animate-[fadeIn_0.4s_ease_0.6s_both]"
                style={{ color: m.colors[0] }}
              >
                {t(mData.titleKey)}
              </h2>

              {/* Subtitle */}
              <p className="text-sm text-white/60 leading-relaxed mb-6 animate-[fadeIn_0.4s_ease_0.7s_both]">
                {t(mData.subtitleKey)}
              </p>

              {/* CTA */}
              <button
                onClick={onClose}
                className="w-full py-3.5 rounded-2xl text-white font-black text-sm tracking-wide hover:opacity-90 active:scale-[0.98] transition-all duration-150 shadow-xl animate-[fadeIn_0.4s_ease_0.8s_both]"
                style={{
                  background: `linear-gradient(135deg, ${m.colors[0]}, ${m.colors[1]})`,
                }}
              >
                {t("milestone.keep_it_up_cta")}
              </button>

              {/* Auto-dismiss hint */}
              <p className="text-white/25 text-xs mt-3 animate-[fadeIn_0.4s_ease_1.2s_both]">
                {t("milestone.auto_closes_hint")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { t } = useTranslation();
  
  // ── React Query hooks (with intelligent caching) ──
  const dashboardQuery = useDashboard();
  const streakQuery = useStreak();
  const missionsQuery = useMissions();
  const dailyFlowQuery = useDailyFlow(); // Loads AI data in parallel but can fall back to cache
  const leaderboardQuery = useLeaderboard(); // Non-blocking, loads in background

  const [mentorToast, setMentorToast] = useState(false);
  const [phDismissed, setPhDismissed] = useState(false);
  const [milestone, setMilestone] = useState<number | null>(null);
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [lastShownUserId, setLastShownUserId] = useState<string | null>(null);
  const { user } = useAuthStore();

  // Ensure hydration is complete before rendering greeting
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Extract data from queries
  const stats = dashboardQuery.data?.stats;
  const profile = dashboardQuery.data?.profile;
  const mentorMsg = dailyFlowQuery.data?.mentor;
  const streakData = streakQuery.data;
  const missions = missionsQuery.data?.missions || [];
  const lbData = leaderboardQuery.data;

  // DEBUG: Log query states
  useEffect(() => {
    console.log("[Dashboard] Daily Flow Query State:", {
      isLoading: dailyFlowQuery.isLoading,
      isError: dailyFlowQuery.isError,
      error: dailyFlowQuery.error,
      data: dailyFlowQuery.data,
      status: dailyFlowQuery.status,
    });
    console.log("[Dashboard] mentorMsg:", mentorMsg);
    console.log("[Dashboard] mentorToast:", mentorToast);
    console.log("[Dashboard] lastShownUserId:", lastShownUserId);
    console.log("[Dashboard] user.id:", user?.id);
  }, [dailyFlowQuery, mentorMsg, mentorToast, lastShownUserId, user?.id]);

  // FORCE SHOW - for testing
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).forceMentorToast = () => {
        console.log("[TEST] Forcing mentor toast to true");
        setMentorToast(true);
      };
      (window as any).getMentorData = () => {
        console.log("Mentor Data:", mentorMsg);
        console.log("Toast State:", mentorToast);
      };
      console.log(
        "[Dashboard] Test functions available: window.forceMentorToast() and window.getMentorData()",
      );
    }
  }, [mentorMsg, mentorToast]);

  const lbPreview = lbData
    ? {
        rank: lbData.myRank,
        top3: (lbData.entries as { name: string; weeklyScore: number }[]).slice(
          0,
          3,
        ),
      }
    : null;

  // Show mentor popup once per login (when user changes)
  useEffect(() => {
    if (user?.id && user.id !== lastShownUserId) {
      console.log("[Dashboard] New login detected! User:", user.id);
      setLastShownUserId(user.id);
      // Don't set mentorToast here - let the next effect handle it
    }
  }, [user?.id, lastShownUserId]);

  // Show mentor message on every login (once per user load)
  useEffect(() => {
    if (mentorMsg && user?.id && user.id !== lastShownUserId) {
      console.log("[Dashboard] Showing mentor message for user:", user.id);
      setTimeout(() => {
        console.log("[Dashboard] Displaying mentor toast...");
        setMentorToast(true);
      }, 500);
    }
  }, [mentorMsg, user?.id, lastShownUserId]);

  // Show milestone celebration when streak updates
  useEffect(() => {
    const currentStreak = streakData?.streakDays ?? 0;
    if (currentStreak in MILESTONES) {
      const lsKey = `milestone_celebrated_${currentStreak}`;
      if (!localStorage.getItem(lsKey)) {
        localStorage.setItem(lsKey, "1");
        setTimeout(() => setMilestone(currentStreak), 900);
      }
    }
  }, [streakData]);

  // ── Complete task with React Query mutation ──
  const completeTaskMutation = useCompleteTask();

  const handleCompleteTask = async (taskId: string) => {
    if (completingId) return;
    setCompletingId(taskId);
    try {
      const res = await completeTaskMutation.mutateAsync(taskId);
      const { xpEarned, newStreak, message, multiplierActive, shieldEarned } =
        res.data.data;

      toast.success(message, {
        icon: shieldEarned ? "🛡️" : multiplierActive ? "⚡" : "🔥",
        duration: 3500,
      });

      // Milestone celebration — 7, 14, 30 days
      if (newStreak in MILESTONES) {
        const lsKey = `milestone_celebrated_${newStreak}`;
        if (!localStorage.getItem(lsKey)) {
          localStorage.setItem(lsKey, "1");
          setTimeout(() => setMilestone(newStreak), 400);
        }
      }
    } catch {
      toast.error("Could not complete task");
    } finally {
      setCompletingId(null);
    }
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return t("greeting.morning");
    if (h < 17) return t("greeting.afternoon");
    return t("greeting.evening");
  };

  // Show initial loading state only while dashboard data is loading
  const isInitialLoading = dashboardQuery.isLoading;

  if (isInitialLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-dark-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 animate-pulse" />
          <p className="text-sm animate-pulse text-slate-500 dark:text-slate-400">
            {t("dashboard.loading")}
          </p>
        </div>
      </div>
    );
  }

  const completedMissions = missions.filter(
    (m: Mission) => m.isCompleted,
  ).length;
  const missionProgress =
    missions.length > 0 ? (completedMissions / missions.length) * 100 : 0;

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-dark-950">
      <Sidebar />

      {/* ── Milestone celebration ── */}
      {milestone !== null && (
        <MilestoneCelebration
          streak={milestone}
          onClose={() => setMilestone(null)}
        />
      )}

      {/* ── Mentor welcome modal — once per session ── */}
      {mentorToast && mentorMsg && (
        <>
          {console.log("[RENDER] Mentor modal IS RENDERING")}
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ animation: "fadeIn 0.2s ease both" }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setMentorToast(false)}
            />
            {/* Card */}
            <div
              className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700"
              style={{
                animation:
                  "slideInUp 0.35s cubic-bezier(0.34,1.56,0.64,1) both",
              }}
            >
              {/* Gradient top bar */}
              <div className="h-1.5 w-full bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500" />

              <div className="p-7">
                {/* Icon + heading */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary-500 dark:text-primary-400">
                      {t("mentor.title")}
                    </p>
                    <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 leading-tight">
                      {mentorMsg.greeting ||
                        `${t("greeting.hey")} ${user?.name?.split(" ")[0] || t("dashboard.default_user_name")} 👋`}
                    </h2>
                  </div>
                </div>

                {/* Message body */}
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 mb-4">
                  {mentorMsg.todayMessage}
                </p>

                {/* Action suggestion pill */}
                {mentorMsg.actionSuggestion && (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-primary-50 dark:bg-primary-500/10 border border-primary-100 dark:border-primary-500/20 mb-6">
                    <span className="text-base leading-none mt-0.5">💡</span>
                    <p className="text-sm font-semibold text-primary-700 dark:text-primary-300 leading-snug">
                      {mentorMsg.actionSuggestion}
                    </p>
                  </div>
                )}

                {/* CTA */}
                <button
                  onClick={() => setMentorToast(false)}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-primary-500 to-purple-600 text-white font-bold text-sm tracking-wide hover:opacity-90 active:scale-[0.98] transition-all duration-150"
                >
                  {t("mentor.modal_cta")}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <main className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-4 sm:space-y-6">
          {/* ── Header ── */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-0 animate-fade-up stagger-1">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                {isHydrated && greeting()},{" "}
                <span className="gradient-text">
                  {isHydrated && (user?.name?.split(" ")[0] || t("dashboard.default_user_name"))}
                </span>{" "}
                👋
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                {profile?.classLevel ? `${profile.classLevel} · ` : ""}
                {profile?.board
                  ? `${profile.board} Board`
                  : t("dashboard.setup_profile_hint")}
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 text-slate-700 dark:text-slate-300 hover-lift border-glow flex-shrink-0">
              <Target className="w-4 h-4 text-primary-500" />
              <span className="hidden sm:inline">{t("dashboard.level_up_mode_badge")}</span>
            </div>
          </div>

          {/* ── Power Hour Banner ── */}
          {streakData?.powerHourActive &&
            streakData.powerHourEnds &&
            !phDismissed && (
              <div className="-mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
                <PowerHourInline
                  powerHourEnds={streakData.powerHourEnds}
                  onDismiss={() => setPhDismissed(true)}
                />
              </div>
            )}

          {/* ── Streak Hero ── */}
          <StreakHero streakData={streakData} stats={stats} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* ── Today's Missions ── */}
            <MissionsTile
              missions={missions}
              completedCount={completedMissions}
              progress={missionProgress}
              completingId={completingId}
              onComplete={handleCompleteTask}
            />

            {/* ── Quick Modules ── */}
            <div className="rounded-2xl p-4 sm:p-6 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 animate-fade-up stagger-5">
              <div className="flex items-center gap-2 mb-4 sm:mb-5">
                <Zap className="w-5 h-5 text-primary-500" />
                <h2 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
                  {t("dashboard.quick_start")}
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2 sm:gap-3">
                {quickModules.map((mod, idx) => (
                  <Link
                    key={mod.href}
                    href={mod.href}
                    className={`group flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl transition-all duration-200 hover:scale-[1.03] bg-slate-50 dark:bg-dark-800 border border-slate-100 dark:border-dark-700 hover:border-primary-300 dark:hover:border-primary-700 animate-scale-in border-glow stagger-${idx + 1}`}
                  >
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br ${mod.gradient} flex items-center justify-center flex-shrink-0`}
                    >
                      <mod.icon className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-white" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold leading-tight text-slate-800 dark:text-slate-200 text-center sm:text-left">
                      {mod.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ── Leaderboard Teaser ── */}
          {lbPreview && (
            <div className="rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-indigo-900/40 to-purple-900/30 border border-indigo-500/20 animate-fade-up">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-3 sm:mb-4">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  <h2 className="font-bold text-sm sm:text-base text-slate-100">
                    {t("leaderboard.weekly")}
                  </h2>
                </div>
                <Link
                  href="/dashboard/leaderboard"
                  className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-semibold w-fit"
                >
                  {t("dashboard.leaderboard_full_board_link")} <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-2 mb-3 sm:mb-4">
                {lbPreview.top3.map((entry, i) => {
                  const medals = ["🥇", "🥈", "🥉"];
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm"
                    >
                      <span className="text-base w-4 flex-shrink-0">
                        {medals[i]}
                      </span>
                      <span className="flex-1 text-slate-200 truncate">
                        {entry.name}
                      </span>
                      <span className="text-indigo-300 font-bold tabular-nums flex-shrink-0">
                        {entry.weeklyScore} XP
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 pt-3 border-t border-white/10">
                <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-400">
                  <Flame className="w-4 h-4 text-orange-400 flex-shrink-0" />
                  {lbPreview.rank ? (
                    <span className="whitespace-nowrap">
                      {t("dashboard.leaderboard_your_rank", { rank: lbPreview.rank })}
                    </span>
                  ) : (
                    <span className="text-slate-500">
                      {t("dashboard.leaderboard_no_rank_hint")}
                    </span>
                  )}
                </div>
                <Link
                  href="/dashboard/leaderboard"
                  className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors w-fit"
                >
                  {t("common.view_all")}
                </Link>
              </div>
            </div>
          )}

          {/* ── Badges ── */}
          {stats?.badges && stats.badges.length > 0 && (
            <div className="rounded-2xl p-4 sm:p-6 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700">
              <h2 className="font-bold text-base sm:text-lg mb-3 sm:mb-4 text-slate-900 dark:text-slate-100">
                {t("dashboard.your_badges")}
              </h2>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {stats.badges.map((badge: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold bg-primary-50 dark:bg-primary-500/10 border border-primary-200 dark:border-primary-500/20 text-primary-700 dark:text-primary-400 whitespace-nowrap"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function todayKey() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

// ── Streak Hero Component ─────────────────────────────────────────────────────

function StreakHero({
  streakData,
  stats,
}: {
  streakData: StreakData | null;
  stats: DashboardStats | null;
}) {
  const { t } = useTranslation();
  const fireRef = useRef<HTMLSpanElement>(null);
  const streak = streakData?.streakDays ?? stats?.streakDays ?? 0;
  const xp = streakData?.xpToday ?? 0;
  const studiedToday = streakData?.studiedToday ?? false;
  const nextMilestone = streakData?.nextMilestone ?? 7;
  const xpProgress = Math.min((xp / (nextMilestone * 10)) * 100, 100);

  // Build 7-day dot array
  const dotDays: { label: string; active: boolean; isToday: boolean }[] = [];
  if (streakData?.last7Days) {
    const entries = Object.entries(streakData.last7Days).sort(([a], [b]) =>
      a < b ? -1 : 1,
    );
    const dayLabels = ["su", "mo", "tu", "we", "th", "fr", "sa"].map(day => t(`common.day_abbr_${day}`));
    entries.forEach(([dateStr, active]) => {
      const d = new Date(dateStr + "T12:00:00");
      const isToday = dateStr === todayKey();
      dotDays.push({ label: dayLabels[d.getDay()], active, isToday });
    });
  } else {
    // Skeleton dots
    ["su", "mo", "tu", "we", "th", "fr", "sa"].map(day => t(`common.day_abbr_${day}`)).forEach((label, i) =>
      dotDays.push({ label, active: false, isToday: i === 6 }),
    );
  }

  // Pulse fire when big streak
  useEffect(() => {
    if (streak >= 7 && fireRef.current) {
      fireRef.current.classList.add("animate-bounce");
    }
  }, [streak]);

  return (
    <div className="relative rounded-2xl overflow-hidden animate-fade-up stagger-2">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 opacity-90 dark:opacity-80" />
      {/* Subtle noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]" />

      <div className="relative p-4 sm:p-5 lg:p-7">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          {/* Fire + Streak number */}
          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
            <span
              ref={fireRef}
              className="text-4xl sm:text-5xl lg:text-6xl leading-none select-none"
              style={{ textShadow: "0 0 30px rgba(251,146,60,0.8)" }}
            >
              🔥
            </span>
            <div className="min-w-0">
              <div className="flex items-end gap-1.5 sm:gap-2">
                <p className="text-4xl sm:text-6xl lg:text-7xl font-black text-white leading-none tracking-tight flex-shrink-0">
                  {streak}
                </p>
                {/* ── Shield badge ── */}
                {(streakData?.streakShields ?? 0) > 0 ? (
                  <div
                    title={t("dashboard.shield_earned_tooltip", { 
                      count: streakData?.streakShields ?? 0 
                    })}
                    className="group relative mb-1 sm:mb-1.5 flex items-center gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-lg sm:rounded-xl bg-white/20 border border-white/30 backdrop-blur-sm cursor-default select-none hover:bg-white/30 transition-colors flex-shrink-0"
                  >
                    <span className="text-xs sm:text-base leading-none">
                      🛡️
                    </span>
                    <span className="text-xs sm:text-sm font-black text-white leading-none">
                      {streakData?.streakShields}
                    </span>
                    {/* tooltip */}
                    <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 sm:w-52 rounded-xl bg-slate-900 text-white text-xs font-medium px-2 sm:px-3 py-1.5 sm:py-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-xl z-10 text-center leading-snug">
                      {t("dashboard.streak_shield_singular")}
                      <br />
                      <span className="text-slate-300">
                        {t("dashboard.shield_earned_tooltip", { 
                          count: streakData?.streakShields ?? 0 
                        })}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div
                    title={t("dashboard.no_shields_yet_hint")}
                    className="group relative mb-1 sm:mb-1.5 flex items-center gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-lg sm:rounded-xl bg-white/10 border border-white/15 cursor-default select-none hover:bg-white/15 transition-colors flex-shrink-0"
                  >
                    <span className="text-xs sm:text-base leading-none opacity-40">
                      🛡️
                    </span>
                    <span className="text-xs sm:text-sm font-black text-white/40 leading-none">
                      0
                    </span>
                    {/* tooltip */}
                    <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 sm:w-52 rounded-xl bg-slate-900 text-white text-xs font-medium px-2 sm:px-3 py-1.5 sm:py-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-xl z-10 text-center leading-snug">
                      {t("dashboard.streak_shield_singular")}
                      <br />
                      <span className="text-slate-300">
                        {t("dashboard.no_shields_yet_hint")}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-white/80 text-xs sm:text-sm font-semibold mt-0.5 sm:mt-1 tracking-wide uppercase">
                {t("dashboard.day_streak_label")}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-16 bg-white/20 flex-shrink-0" />

          {/* Right column */}
          <div className="flex-1 min-w-0 space-y-3 sm:space-y-4">
            {/* 7-day activity dots */}
            <div>
              <p className="text-white/70 text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-1.5 sm:mb-2">
                {t("dashboard.last_7_days")}
              </p>
              <div className="flex gap-1.5 sm:gap-2">
                {dotDays.map((d, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-0.5 sm:gap-1"
                  >
                    <div
                      className={`w-6 sm:w-8 h-6 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300
                        ${d.isToday ? "ring-2 ring-white ring-offset-2 ring-offset-transparent scale-110" : ""}
                        ${
                          d.active
                            ? "bg-white shadow-lg shadow-white/30"
                            : "bg-white/20 border border-white/30"
                        }`}
                    >
                      {d.active && (
                        <span className="text-orange-500 text-[8px] sm:text-xs font-black">
                          ✓
                        </span>
                      )}
                    </div>
                    <span className="text-white/60 text-[8px] sm:text-[10px] font-medium">
                      {d.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* XP progress bar */}
            <div>
              <div className="flex items-center justify-between mb-1 sm:mb-1.5">
                <p className="text-white/70 text-[10px] sm:text-xs font-semibold uppercase tracking-widest">
                  {t("dashboard.xp_to")} {nextMilestone}{t("dashboard.day_badge_suffix")}
                </p>
                <p className="text-white text-[10px] sm:text-xs font-bold">
                  {xp} / {nextMilestone * 10} XP
                </p>
              </div>
              <div className="h-2 sm:h-2.5 rounded-full bg-white/20 overflow-hidden">
                <div
                  className="h-full rounded-full bg-white transition-all duration-700 ease-out"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Today's status badge */}
          <div className="flex-shrink-0 self-start sm:self-center">
            <div
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all duration-500 whitespace-nowrap ${
                studiedToday
                  ? "bg-white text-orange-600"
                  : "bg-white/20 border border-white/30 text-white"
              }`}
            >
              {studiedToday ? t("dashboard.done_today") : t("dashboard.not_yet")}
            </div>
            <p className="text-white/60 text-[10px] sm:text-xs text-center mt-1 sm:mt-1.5 font-medium">
              {t("dashboard.score_label")} {streakData?.studyScore ?? stats?.studyScore ?? 0} {t("common.points_abbr")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Missions Tile Component ───────────────────────────────────────────────────

function MissionsTile({
  missions,
  completedCount,
  progress,
  completingId,
  onComplete,
}: {
  missions: Mission[];
  completedCount: number;
  progress: number;
  completingId: string | null;
  onComplete: (id: string) => void;
}) {
  const { t } = useTranslation();
  const allDone = missions.length > 0 && completedCount === missions.length;

  return (
    <div className="rounded-2xl p-4 sm:p-6 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 animate-fade-up stagger-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 sm:justify-between mb-3 sm:mb-5">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-orange-500" />
          <h2 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">
            {t("dashboard.todays_missions")}
          </h2>
          {allDone && (
            <span className="text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 flex-shrink-0">
              {t("dashboard.all_done")}
            </span>
          )}
        </div>

        {/* Progress ring */}
        {missions.length > 0 && (
          <ProgressRing
            progress={progress}
            label={`${completedCount}/${missions.length}`}
          />
        )}
      </div>

      {/* XP progress bar */}
      {missions.length > 0 && (
        <div className="mb-3 sm:mb-4">
          <div className="h-1.5 rounded-full bg-slate-100 dark:bg-dark-700 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-400 to-rose-500 transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1">
            {completedCount === 0
              ? t("dashboard.missions_0_complete_msg")
              : allDone
                ? t("dashboard.missions_100_complete_msg")
                : t("dashboard.missions_partial_complete_msg", { 
                    remaining: missions.length - completedCount,
                    plural: missions.length - completedCount !== 1 ? "s" : ""
                  })}
          </p>
        </div>
      )}

      {/* Mission list */}
      {missions.length === 0 ? (
        <div className="text-center py-6 sm:py-8">
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t("dashboard.no_missions_empty_state")}
          </p>
          <Link
            href="/dashboard/study-planner"
            className="inline-block mt-2 sm:mt-3 text-xs sm:text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-500 transition-colors"
          >
            {t("dashboard.generate_plan_link")}
          </Link>
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-3">
          {missions.map((mission, i) => (
            <MissionCard
              key={mission._id}
              mission={mission}
              index={i}
              isCompleting={completingId === mission._id}
              onComplete={onComplete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Progress Ring ─────────────────────────────────────────────────────────────

function ProgressRing({
  progress,
  label,
}: {
  progress: number;
  label: string;
}) {
  const r = 18;
  const circ = 2 * Math.PI * r;
  const offset = circ - (progress / 100) * circ;
  return (
    <div className="relative w-10 sm:w-12 h-10 sm:h-12 flex-shrink-0">
      <svg className="w-10 sm:w-12 h-10 sm:h-12 -rotate-90" viewBox="0 0 44 44">
        <circle
          cx="22"
          cy="22"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          className="text-slate-100 dark:text-dark-700"
        />
        <circle
          cx="22"
          cy="22"
          r={r}
          fill="none"
          stroke="url(#ring-grad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.7s ease" }}
        />
        <defs>
          <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[9px] sm:text-[10px] font-black text-slate-700 dark:text-slate-300">
        {label}
      </span>
    </div>
  );
}

// ── Mission Card ──────────────────────────────────────────────────────────────

function MissionCard({
  mission,
  index,
  isCompleting,
  onComplete,
}: {
  mission: Mission;
  index: number;
  isCompleting: boolean;
  onComplete: (id: string) => void;
}) {
  const { t } = useTranslation();
  const done = mission.isCompleted;
  const priorityColors: Record<string, string> = {
    high: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10",
    medium:
      "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-500/10",
    low: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10",
  };
  const staggerCls = `stagger-${Math.min(index + 1, 8)}`;

  return (
    <div
      className={`group relative flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl transition-all duration-300 cursor-pointer border
        animate-slide-right ${staggerCls}
        ${
          done
            ? "bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/30 opacity-80"
            : "bg-slate-50 dark:bg-dark-800 border-slate-100 dark:border-dark-700 hover:border-orange-300 dark:hover:border-orange-700 hover:scale-[1.01]"
        }
        ${isCompleting ? "opacity-60 pointer-events-none" : ""}
      `}
      onClick={() => !done && !isCompleting && onComplete(mission._id)}
    >
      {/* Check button */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <div className="flex-shrink-0 transition-transform duration-200 group-hover:scale-110">
          {done ? (
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          ) : isCompleting ? (
            <div className="w-5 h-5 rounded-full border-2 border-orange-400 border-t-transparent animate-spin" />
          ) : (
            <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-orange-400 transition-colors" />
          )}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p
            className={`text-xs sm:text-sm font-semibold truncate ${
              done
                ? "line-through text-slate-400 dark:text-slate-500"
                : "text-slate-800 dark:text-slate-200"
            }`}
          >
            {mission.title}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
            <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
              {mission.subject}
            </span>
            <span className="text-slate-300 dark:text-slate-600 text-[10px] sm:text-xs">
              ·
            </span>
            <Clock className="w-3 h-3 text-slate-400 flex-shrink-0" />
            <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
              {mission.estimatedMinutes} {t("common.time_min")}
            </span>
          </div>
        </div>

        {/* XP badge + Priority */}
        <div className="flex gap-1.5 flex-shrink-0 sm:ml-auto">
          {/* XP badge */}
          <span className="flex items-center gap-0.5 px-1.5 sm:px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 text-[10px] sm:text-xs font-bold whitespace-nowrap">
            <Star className="w-3 h-3" />+{mission.scoreReward || 10}
          </span>
          {/* Priority */}
          <span
            className={`text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap ${
              priorityColors[mission.priority] ||
              "text-slate-500 bg-slate-100 dark:bg-dark-700"
            }`}
          >
            {mission.priority}
          </span>
        </div>
      </div>
    </div>
  );
}
