"use client";

interface PremiumChildCardProps {
  id: string;
  name: string;
  classLevel: string;
  consistencyScore: number;
  topSubject: string;
  weakSubject: string;
  weeklyActivity: number;
  onViewDetails: (childId: string) => void;
}

export default function PremiumChildCard({
  id,
  name,
  classLevel,
  consistencyScore,
  topSubject,
  weakSubject,
  weeklyActivity,
  onViewDetails,
}: PremiumChildCardProps) {
  const initials = name
    .split(" ")
    .map(n => n.charAt(0))
    .join("");

  const scoreColor =
    consistencyScore >= 75
      ? "text-green-600 dark:text-green-400 from-green-500 to-emerald-500"
      : consistencyScore >= 50
        ? "text-yellow-600 dark:text-yellow-400 from-yellow-500 to-orange-500"
        : "text-red-600 dark:text-red-400 from-red-500 to-orange-500";

  const scoreGradient =
    consistencyScore >= 75
      ? "from-green-500 to-emerald-500"
      : consistencyScore >= 50
        ? "from-yellow-500 to-orange-500"
        : "from-red-500 to-orange-500";

  return (
    <div
      className="group relative overflow-hidden rounded-3xl p-6 bg-white dark:bg-slate-800/50
      border-2 border-slate-200 dark:border-slate-700 shadow-lg transition-all duration-500
      hover:shadow-2xl hover:border-purple-400 dark:hover:border-purple-500 animate-fade-in"
    >
      {/* Animated background gradient on hover */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-teal-500/10
        opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
      />

      {/* Decorative animated blob */}
      <div
        className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-gradient-to-br from-purple-400 to-pink-400
        opacity-0 group-hover:opacity-5 transition-opacity duration-500 animate-pulse pointer-events-none"
      />

      <div className="relative z-10">
        {/* Header with avatar and name */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex-1">
            <h3
              className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-transparent
            group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-500
            group-hover:bg-clip-text transition-all duration-300"
            >
              {name}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {classLevel}
            </p>
          </div>

          {/* Animated avatar */}
          <div className="relative">
            <div
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-red-500
              flex items-center justify-center text-white font-bold text-lg shadow-lg
              transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300"
            >
              {initials}
            </div>
            <div
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-red-500
              opacity-0 group-hover:opacity-20 blur-lg group-hover:animate-pulse transition-opacity duration-300 -z-10"
            />
          </div>
        </div>

        {/* Learning score section */}
        <div
          className="mb-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-700
        group-hover:bg-gradient-to-r group-hover:from-purple-500/10 group-hover:to-teal-500/10 transition-colors duration-300"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              📚 Learning Score
            </span>
            <span className={`text-2xl font-black ${scoreColor}`}>
              {consistencyScore}%
            </span>
          </div>

          {/* Animated progress bar */}
          <div className="h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${scoreGradient} shadow-lg
              transition-all duration-700 ease-out origin-left`}
              style={{
                width: `${consistencyScore}%`,
                animation: `slideIn 1s ease-out`,
              }}
            />
          </div>
        </div>

        {/* Subject cards */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {/* Strong in */}
          <div
            className="p-3 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-500/10 dark:to-emerald-500/10
            border border-green-200 dark:border-green-500/30 group-hover:scale-105 transition-transform duration-300"
          >
            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mb-1">
              ✨ Strong In
            </p>
            <p className="text-sm font-bold text-green-700 dark:text-green-300 truncate">
              {topSubject}
            </p>
          </div>

          {/* Focus on */}
          <div
            className="p-3 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-500/10 dark:to-red-500/10
            border border-orange-200 dark:border-orange-500/30 group-hover:scale-105 transition-transform duration-300"
          >
            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mb-1">
              ⚡ Focus On
            </p>
            <p className="text-sm font-bold text-orange-700 dark:text-orange-300 truncate">
              {weakSubject}
            </p>
          </div>
        </div>

        {/* Activity stats */}
        <div
          className="flex items-center justify-between mb-6 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/30
        border border-slate-200 dark:border-slate-700"
        >
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Weekly Activity
            </p>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {weeklyActivity}h
            </p>
          </div>
          <div className="text-3xl">⏰</div>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => onViewDetails(id)}
          className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600
          hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transform hover:scale-105
          transition-all duration-300 active:scale-95 relative overflow-hidden group/btn"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            View Analytics
            <span className="group-hover/btn:translate-x-1 transition-transform duration-300">
              →
            </span>
          </span>
          <div
            className="absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-400 opacity-0
            group-hover/btn:opacity-20 transition-opacity duration-300"
          />
        </button>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            width: 0;
            opacity: 0;
          }
          to {
            width: var(--tw-translate-x);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
