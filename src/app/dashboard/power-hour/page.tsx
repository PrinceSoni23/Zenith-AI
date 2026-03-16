"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { streakApi } from "@/lib/api";
import toast from "react-hot-toast";
import { Zap, Lock, X, Clock, Star, Flame, CheckCircle2 } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface PowerHourData {
  powerHourActive: boolean;
  powerHourEnds: string | null;
  powerHourTime: string | null;
  powerHourSetThisMonth: boolean;
}

// ── Countdown hook ────────────────────────────────────────────────────────────

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

// ── Active Banner ─────────────────────────────────────────────────────────────

function ActiveBanner({
  powerHourEnds,
  onDismiss,
}: {
  powerHourEnds: string;
  onDismiss: () => void;
}) {
  const endsAt = new Date(powerHourEnds);
  const { mins, secs, msLeft } = useCountdown(endsAt);
  if (msLeft === 0) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border px-5 py-4 bg-gradient-to-r from-yellow-400/10 via-amber-400/10 to-orange-400/10 dark:from-yellow-500/15 dark:via-amber-500/15 dark:to-orange-500/15 border-yellow-400/40 dark:border-yellow-500/30 shadow-lg shadow-yellow-400/10 animate-fade-up">
      {/* shimmer sweep */}
      <div className="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer_2.5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-yellow-300/10 to-transparent" />

      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* icon + text */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-full bg-yellow-400/30 animate-ping" />
            <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-md shadow-yellow-500/30">
              <Zap className="w-6 h-6 text-white fill-white" />
            </div>
          </div>
          <div className="min-w-0">
            <p className="text-base font-black text-yellow-700 dark:text-yellow-300 flex items-center gap-2 flex-wrap">
              ⚡ Power Hour is Active!
              <span className="text-xs font-semibold text-yellow-600 dark:text-yellow-400 bg-yellow-400/15 dark:bg-yellow-400/20 px-2 py-0.5 rounded-full border border-yellow-400/30">
                2× XP on every task
              </span>
            </p>
            <p className="text-sm text-yellow-600/80 dark:text-yellow-400/70 mt-0.5">
              Head to Dashboard and complete missions now to earn double XP!
            </p>
          </div>
        </div>

        {/* countdown + dismiss */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1">
            <div className="flex flex-col items-center bg-yellow-500/15 dark:bg-yellow-400/10 rounded-xl px-3 py-2 border border-yellow-400/20 min-w-[48px]">
              <span className="text-2xl font-black tabular-nums text-yellow-700 dark:text-yellow-300 leading-none">
                {String(mins).padStart(2, "0")}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-yellow-600/60 dark:text-yellow-400/50 mt-0.5">
                min
              </span>
            </div>
            <span className="text-yellow-500 font-black text-2xl leading-none mb-3">
              :
            </span>
            <div className="flex flex-col items-center bg-yellow-500/15 dark:bg-yellow-400/10 rounded-xl px-3 py-2 border border-yellow-400/20 min-w-[48px]">
              <span className="text-2xl font-black tabular-nums text-yellow-700 dark:text-yellow-300 leading-none">
                {String(secs).padStart(2, "0")}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-yellow-600/60 dark:text-yellow-400/50 mt-0.5">
                sec
              </span>
            </div>
          </div>
          <button
            onClick={onDismiss}
            className="p-1.5 rounded-lg text-yellow-600/60 dark:text-yellow-400/50 hover:text-yellow-700 dark:hover:text-yellow-300 hover:bg-yellow-400/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* draining progress bar */}
      <div className="mt-4 h-2 rounded-full bg-yellow-400/15 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-1000"
          style={{ width: `${(msLeft / (60 * 60 * 1000)) * 100}%` }}
        />
      </div>
    </div>
  );
}

// ── Schedule Card ─────────────────────────────────────────────────────────────

function ScheduleCard({
  powerHourTime,
  powerHourSetThisMonth,
  onLocked,
}: {
  powerHourTime?: string | null;
  powerHourSetThisMonth?: boolean;
  onLocked: (time: string) => void;
}) {
  const [hour, setHour] = useState(20);
  const [minute, setMinute] = useState(0);
  const [saving, setSaving] = useState(false);

  const now = new Date();
  const firstOfNext = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const daysLeft = Math.ceil(
    (firstOfNext.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );
  const resetDateLabel = firstOfNext.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
  });

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

  // ── LOCKED STATE ────────────────────────────────────────────────────────────
  if (powerHourSetThisMonth && powerHourTime) {
    const [lockedH, lockedM] = powerHourTime.split(":").map(Number);

    return (
      <div className="rounded-2xl border border-yellow-400/30 dark:border-yellow-500/20 bg-yellow-400/5 dark:bg-yellow-500/5 px-6 py-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center flex-shrink-0 shadow shadow-yellow-400/30">
            <Zap className="w-6 h-6 text-white fill-white" />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-dark-900 flex items-center justify-center border border-yellow-400/40">
              <Lock className="w-3 h-3 text-yellow-500" />
            </div>
          </div>
          <div>
            <p className="text-base font-black text-yellow-700 dark:text-yellow-300">
              ⚡ Power Hour — Locked In
            </p>
            <p className="text-sm text-yellow-600/70 dark:text-yellow-400/60">
              Fires every day at{" "}
              <span className="font-bold font-mono text-yellow-700 dark:text-yellow-300">
                {fmtTime(powerHourTime)}
              </span>{" "}
              for 60 minutes
            </p>
          </div>
        </div>

        {/* Greyed-out read-only pickers */}
        <div className="flex items-center gap-3 flex-wrap mb-4 opacity-50 pointer-events-none select-none">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
              Hour
            </label>
            <select
              disabled
              value={lockedH}
              className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-dark-700 bg-slate-100 dark:bg-dark-800 text-sm font-bold text-slate-500 dark:text-slate-500 cursor-not-allowed"
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
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
              Minute
            </label>
            <select
              disabled
              value={lockedM}
              className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-dark-700 bg-slate-100 dark:bg-dark-800 text-sm font-bold text-slate-500 dark:text-slate-500 cursor-not-allowed"
            >
              {[0, 15, 30, 45].map(m => (
                <option key={m} value={m}>
                  :{String(m).padStart(2, "0")}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wider text-transparent select-none">
              Go
            </label>
            <button
              disabled
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-dark-700 text-slate-400 text-sm font-black cursor-not-allowed"
            >
              <Lock className="w-4 h-4" />
              Locked
            </button>
          </div>
        </div>

        {/* Cannot-change notice */}
        <div className="flex items-start gap-2 rounded-xl bg-yellow-400/10 dark:bg-yellow-500/10 border border-yellow-400/20 px-4 py-3">
          <Lock className="w-4 h-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-700 dark:text-yellow-400 leading-snug">
            This cannot be changed until{" "}
            <span className="font-bold">{resetDateLabel}</span>. You have{" "}
            <span className="font-bold">
              {daysLeft} day{daysLeft !== 1 ? "s" : ""}
            </span>{" "}
            of 2× XP remaining this month!
          </p>
        </div>
      </div>
    );
  }

  // ── UNLOCKED STATE ──────────────────────────────────────────────────────────
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-dark-700 bg-white dark:bg-dark-900 px-6 py-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center flex-shrink-0 shadow shadow-yellow-400/20">
          <Zap className="w-6 h-6 text-white fill-white" />
        </div>
        <div>
          <p className="text-base font-black text-slate-900 dark:text-slate-100">
            Set Your Power Hour
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Pick a time — every day this month you get{" "}
            <span className="text-yellow-600 dark:text-yellow-400 font-bold">
              2× XP
            </span>{" "}
            for 1 hour.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap mb-4">
        {/* Hour picker */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
            Hour
          </label>
          <select
            value={hour}
            onChange={e => setHour(Number(e.target.value))}
            className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-dark-700 bg-slate-50 dark:bg-dark-800 text-sm font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-yellow-400/40"
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
        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
            Minute
          </label>
          <select
            value={minute}
            onChange={e => setMinute(Number(e.target.value))}
            className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-dark-700 bg-slate-50 dark:bg-dark-800 text-sm font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-yellow-400/40"
          >
            {[0, 15, 30, 45].map(m => (
              <option key={m} value={m}>
                :{String(m).padStart(2, "0")}
              </option>
            ))}
          </select>
        </div>

        {/* Lock In button */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase tracking-wider text-transparent select-none">
            Go
          </label>
          <button
            onClick={handleLock}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-sm font-black shadow shadow-yellow-400/30 hover:opacity-90 active:scale-95 transition-all disabled:opacity-60"
          >
            <Lock className="w-4 h-4" />
            {saving ? "Saving…" : "Lock In"}
          </button>
        </div>

        <p className="text-xs text-slate-400 dark:text-slate-500 self-end pb-2.5">
          {daysLeft} day{daysLeft !== 1 ? "s" : ""} remaining
        </p>
      </div>

      {/* Warning */}
      <div className="flex items-start gap-2 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-4 py-2.5">
        <Lock className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-red-600 dark:text-red-400 leading-snug">
          <span className="font-bold">Choose carefully —</span> this is locked
          until <span className="font-bold">{resetDateLabel}</span> and cannot
          be changed until then.
        </p>
      </div>
    </div>
  );
}

// ── How It Works explainer ────────────────────────────────────────────────────

const howItWorks = [
  {
    icon: Clock,
    color: "text-blue-500",
    bg: "bg-blue-500/10 dark:bg-blue-500/15",
    title: "Pick Your Time Once",
    desc: "Choose any hour of the day. This becomes your personal Power Hour for the entire month.",
  },
  {
    icon: Zap,
    color: "text-yellow-500",
    bg: "bg-yellow-400/10 dark:bg-yellow-500/15",
    title: "Auto-Activates Daily",
    desc: "Every day at your chosen time, Power Hour activates automatically for exactly 60 minutes.",
  },
  {
    icon: Star,
    color: "text-purple-500",
    bg: "bg-purple-500/10 dark:bg-purple-500/15",
    title: "2× XP on All Tasks",
    desc: "Complete any mission during Power Hour and earn double XP — stack it with your streak!",
  },
  {
    icon: Flame,
    color: "text-orange-500",
    bg: "bg-orange-500/10 dark:bg-orange-500/15",
    title: "Build a Habit",
    desc: "Locking in a time forces you to study at the same hour every day, building a strong habit.",
  },
  {
    icon: CheckCircle2,
    color: "text-green-500",
    bg: "bg-green-500/10 dark:bg-green-500/15",
    title: "Resets Monthly",
    desc: "On the 1st of every month your schedule clears, so you can pick a new time that suits you.",
  },
];

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function PowerHourPage() {
  const [data, setData] = useState<PowerHourData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [streakRes, scheduleRes] = await Promise.all([
          streakApi.getStreak(),
          streakApi.getPowerHourSchedule(),
        ]);
        const streak = streakRes.data.data;
        const schedule = scheduleRes.data;
        setData({
          powerHourActive: streak.powerHourActive ?? false,
          powerHourEnds: streak.powerHourEnds ?? null,
          powerHourTime: schedule.time ?? streak.powerHourTime ?? null,
          powerHourSetThisMonth:
            schedule.setThisMonth ?? streak.powerHourSetThisMonth ?? false,
        });
      } catch {
        toast.error("Failed to load Power Hour data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleLocked = (time: string) => {
    setData(prev =>
      prev
        ? { ...prev, powerHourTime: time, powerHourSetThisMonth: true }
        : prev,
    );
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-dark-950 overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
          {/* ── Page Header ─────────────────────────────────────────────── */}
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow shadow-yellow-400/30">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
                  Power Hour
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Your daily 2× XP boost window
                </p>
              </div>
            </div>
          </div>

          {/* ── Loading skeleton ─────────────────────────────────────────── */}
          {loading && (
            <div className="space-y-4">
              <div className="h-20 rounded-2xl bg-slate-200 dark:bg-dark-800 animate-pulse" />
              <div className="h-40 rounded-2xl bg-slate-200 dark:bg-dark-800 animate-pulse" />
            </div>
          )}

          {!loading && data && (
            <>
              {/* ── Active banner ──────────────────────────────────────── */}
              {data.powerHourActive && data.powerHourEnds && !dismissed && (
                <ActiveBanner
                  powerHourEnds={data.powerHourEnds}
                  onDismiss={() => setDismissed(true)}
                />
              )}

              {/* ── Not active pill ────────────────────────────────────── */}
              {!data.powerHourActive && data.powerHourTime && (
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-100 dark:bg-dark-800 border border-slate-200 dark:border-dark-700">
                  <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Power Hour is{" "}
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      inactive
                    </span>{" "}
                    right now. It will fire at{" "}
                    <span className="font-bold font-mono text-yellow-600 dark:text-yellow-400">
                      {(() => {
                        const [h, m] = (data.powerHourTime ?? "0:0")
                          .split(":")
                          .map(Number);
                        const period = h >= 12 ? "PM" : "AM";
                        return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${period}`;
                      })()}
                    </span>{" "}
                    today.
                  </p>
                </div>
              )}

              {/* ── Schedule card ──────────────────────────────────────── */}
              <ScheduleCard
                powerHourTime={data.powerHourTime}
                powerHourSetThisMonth={data.powerHourSetThisMonth}
                onLocked={handleLocked}
              />

              {/* ── How it works ───────────────────────────────────────── */}
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 px-1">
                  How It Works
                </h2>
                <div className="rounded-2xl border border-slate-200 dark:border-dark-700 bg-white dark:bg-dark-900 divide-y divide-slate-100 dark:divide-dark-800 overflow-hidden">
                  {howItWorks.map((item, i) => (
                    <div key={i} className="flex items-start gap-4 px-5 py-4">
                      <div
                        className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0`}
                      >
                        <item.icon className={`w-4.5 h-4.5 ${item.color}`} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                          {item.title}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
