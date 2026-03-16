"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";
import {
  Zap,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth, isAuthenticated, initializeFromStorage } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [toastShown, setToastShown] = useState(false);
  const [wasAlreadyLoggedIn, setWasAlreadyLoggedIn] = useState(false);

  // Hydrate from localStorage and redirect if already logged in
  useEffect(() => {
    initializeFromStorage();
    const isAlreadyLoggedIn = !!localStorage.getItem("token");
    setWasAlreadyLoggedIn(isAlreadyLoggedIn);
    setHydrated(true);
  }, [initializeFromStorage]);

  // Show toast if redirected from protected route (only once)
  useEffect(() => {
    if (hydrated && !toastShown && searchParams.get("loginRequired")) {
      toast.error("You need to login first", { duration: 2500 });
      setToastShown(true);
    }
  }, [hydrated, toastShown, searchParams]);

  // Redirect if already logged in at page load (not after login)
  useEffect(() => {
    if (!hydrated) return;
    if (wasAlreadyLoggedIn && isAuthenticated) {
      toast.success("You are already logged in", { duration: 2000 });
      router.push("/dashboard");
    }
  }, [isAuthenticated, router, hydrated, wasAlreadyLoggedIn]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Please fill in all fields");
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      const { token, user } = res.data;
      setAuth(user, token);
      toast.success(`Welcome back, ${user.name}! 👋`);

      // Check if there's a redirect URL stored
      const redirectUrl = sessionStorage.getItem("redirectAfterLogin");
      if (redirectUrl) {
        sessionStorage.removeItem("redirectAfterLogin");
        router.push(redirectUrl);
      } else {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(
        error.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-dark-950">
      {/* Left panel — decorative */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-purple-700">
        <div className="absolute top-[-80px] right-[-80px] w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-[-60px] left-[-60px] w-80 h-80 rounded-full bg-white/5 blur-3xl" />

        <div className="relative z-10 flex items-center justify-between animate-fade-up stagger-1">
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-black text-xl tracking-tight">
              Zenith
            </span>
          </Link>
          <Link
            href="/"
            className="px-4 py-2 rounded-lg text-white text-sm font-semibold bg-white/10 hover:bg-white/20 transition-colors"
          >
            ← Back Home
          </Link>
        </div>

        <div className="relative z-10 animate-slide-up">
          <h2 className="text-4xl font-black text-white leading-tight mb-4">
            Your AI-powered
            <br />
            study companion.
          </h2>
          <p className="text-primary-200 text-lg leading-relaxed">
            10 intelligent agents working together to make you unstoppable in
            every subject.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              { num: "10+", label: "AI Modules" },
              { num: "12", label: "Class Levels" },
              { num: "∞", label: "Questions" },
              { num: "24/7", label: "Available" },
            ].map((s, i) => (
              <div
                key={s.label}
                className={`bg-white/10 rounded-2xl p-4 animate-scale-in stagger-${i + 3} hover:bg-white/20 transition-colors duration-200`}
              >
                <p className="text-2xl font-black text-white">{s.num}</p>
                <p className="text-primary-200 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-primary-300 text-sm">
          © 2024 Zenith. Built for curious minds.
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-up">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 animate-scale-in stagger-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-xl gradient-text">Zenith</span>
          </div>

          <h1 className="text-3xl font-black mb-2 text-slate-900 dark:text-slate-100 animate-fade-up stagger-2">
            Welcome back
          </h1>
          <p className="text-sm mb-8 text-slate-500 dark:text-slate-400 animate-fade-up stagger-3">
            Sign in to continue your learning journey.{" "}
            <Link
              href="/register"
              className="text-primary-600 dark:text-primary-400 font-semibold hover:text-primary-500 transition-colors"
            >
              New here? Sign up
            </Link>
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="animate-fade-up stagger-4">
              <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                <input
                  type="email"
                  className="input-field pl-10"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="animate-fade-up stagger-5">
              <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="input-field pl-10 pr-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="animate-fade-up stagger-6">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 text-base py-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Signing in…
                  </>
                ) : (
                  <>
                    Sign In{" "}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 p-4 rounded-2xl text-sm bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 animate-fade-up stagger-7 hover-lift">
            <p className="font-semibold mb-1 text-slate-800 dark:text-slate-200">
              Demo credentials
            </p>
            <p className="text-slate-500 dark:text-slate-400">
              Email:{" "}
              <span className="font-mono text-slate-700 dark:text-slate-300">
                student@demo.com
              </span>
            </p>
            <p className="text-slate-500 dark:text-slate-400">
              Password:{" "}
              <span className="font-mono text-slate-700 dark:text-slate-300">
                password123
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
