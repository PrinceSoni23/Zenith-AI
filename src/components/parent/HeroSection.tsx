"use client";

interface HeroSectionProps {
  userName: string;
  lastRefresh: Date;
}

export default function HeroSection({
  userName,
  lastRefresh,
}: HeroSectionProps) {
  return (
    <div className="relative mb-12 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-teal-400/20 to-blue-400/20 rounded-full blur-3xl translate-y-1/2 translate-x-1/2 animate-pulse" />

      {/* Content */}
      <div className="relative z-10 flex items-start justify-between gap-8">
        <div className="flex-1 animate-fade-in">
          {/* Welcome text with gradient */}
          <h1 className="text-5xl md:text-6xl font-black mb-3 leading-tight group">
            <span className="inline-block bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 dark:from-purple-400 dark:via-pink-400 dark:to-red-400 text-transparent bg-clip-text">
              Welcome Back,
            </span>
            <br />
            <span className="inline-block text-slate-900 dark:text-slate-100 mt-2 group-hover:scale-105 transition-transform duration-300">
              {userName} 👋
            </span>
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
            Monitor your children's learning journey in real-time. Get insights
            into their progress and watch them grow.
          </p>

          {/* Stats badges */}
          <div className="flex flex-wrap gap-3 mt-6">
            <div className="px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-500/20 dark:to-emerald-500/20 border border-green-200 dark:border-green-500/50 text-sm font-semibold text-green-700 dark:text-green-300">
              ✅ Real-time Updates
            </div>
            <div className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-500/20 dark:to-cyan-500/20 border border-blue-200 dark:border-blue-500/50 text-sm font-semibold text-blue-700 dark:text-blue-300">
              📊 Advanced Analytics
            </div>
            <div className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-500/20 dark:to-pink-500/20 border border-purple-200 dark:border-purple-500/50 text-sm font-semibold text-purple-700 dark:text-purple-300">
              🎯 Personalized Insights
            </div>
          </div>
        </div>

        {/* Right side - Last refresh info with animation */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Animated circle background */}
            <div className="w-48 h-48 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-500/10 dark:to-pink-500/10 border-2 border-purple-200 dark:border-purple-500/30 flex flex-col items-center justify-center animate-float">
              {/* Pulsing dot */}
              <div className="absolute w-4 h-4 rounded-full bg-green-500 animate-ping" />
              <div className="absolute w-4 h-4 rounded-full bg-green-500" />

              {/* Info text */}
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">
                  Last Updated
                </p>
                <p className="text-2xl font-black text-slate-900 dark:text-slate-100">
                  {lastRefresh.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                  🔄 Auto-refresh every 30s
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}
