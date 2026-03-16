"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";
import {
  Zap,
  User,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  Loader2,
  GraduationCap,
  Users,
  Eye,
  EyeOff,
} from "lucide-react";

// Prevent static generation for this page
export const dynamic = "force-dynamic";

const CLASS_LEVELS = [
  "Nursery",
  "LKG",
  "UKG",
  "Class 1",
  "Class 2",
  "Class 3",
  "Class 4",
  "Class 5",
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
  "Class 11",
  "Class 12",
];
const BOARDS = ["CBSE", "ICSE", "State", "IB", "IGCSE", "Other"];
const SUBJECTS = [
  "Mathematics",
  "Science",
  "English",
  "Social Studies",
  "Hindi",
  "Physics",
  "Chemistry",
  "Biology",
  "History",
  "Geography",
  "Computer Science",
];

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth, isAuthenticated, initializeFromStorage } = useAuthStore();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [wasAlreadyLoggedIn, setWasAlreadyLoggedIn] = useState(false);

  // Hydrate from localStorage and redirect if already logged in
  useEffect(() => {
    initializeFromStorage();
    const isAlreadyLoggedIn =
      typeof window !== "undefined" && !!localStorage.getItem("token");
    setWasAlreadyLoggedIn(isAlreadyLoggedIn);
    setHydrated(true);
  }, [initializeFromStorage]);

  useEffect(() => {
    if (!hydrated) return;
    if (wasAlreadyLoggedIn && isAuthenticated) {
      toast.success("You are already logged in", { duration: 2000 });
      router.push("/dashboard");
    }
  }, [isAuthenticated, router, hydrated, wasAlreadyLoggedIn]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student" as "student" | "parent",
    classLevel: "Class 6",
    board: "CBSE",
    subjects: [] as string[],
    preferredLanguage: "English",
  });

  const updateForm = (key: string, value: unknown) =>
    setForm(prev => ({ ...prev, [key]: value }));
  const toggleSubject = (subject: string) => {
    setForm(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject],
    }));
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      const res = await authApi.register(form);
      const { token, user } = res.data;
      setAuth(user, token);
      toast.success(`Welcome, ${user.name}! Let's start learning! 🎓`);
      router.push("/dashboard");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const totalSteps = form.role === "student" ? 2 : 1;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-dark-950">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full bg-primary-500/5 blur-3xl" />
        <div className="absolute bottom-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full bg-purple-500/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-up stagger-1">
          <div className="flex items-center justify-between gap-4 mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-black text-xl gradient-text">Zenith</span>
            </Link>
            <Link
              href="/"
              className="px-3 py-1.5 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-dark-800 hover:bg-slate-300 dark:hover:bg-dark-700 transition-colors"
            >
              ← Home
            </Link>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100">
            Create your account
          </h1>
          <p className="text-sm mt-2 text-slate-500 dark:text-slate-400">
            Already have one?{" "}
            <Link
              href="/login"
              className="text-primary-600 dark:text-primary-400 font-semibold hover:text-primary-500 transition-colors"
            >
              Sign in
            </Link>
          </p>

          {/* Step indicator */}
          {totalSteps > 1 && (
            <div className="flex items-center justify-center gap-2 mt-5">
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map(s => (
                <div
                  key={s}
                  className={`h-2 rounded-full transition-all duration-500 ease-out ${
                    s <= step
                      ? "bg-primary-500 w-8 shadow-glow-sm"
                      : "w-4 bg-slate-300 dark:bg-dark-700"
                  }`}
                />
              ))}
              <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">
                Step {step} of {totalSteps}
              </span>
            </div>
          )}
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 animate-scale-in stagger-2">
          {/* Step 1 — Basic Info */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-up">
              <h2 className="font-bold text-lg text-slate-900 dark:text-slate-100">
                Basic Info
              </h2>

              {/* Role selector */}
              <div className="animate-fade-up stagger-3">
                <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                  I am a
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(
                    [
                      {
                        value: "student",
                        label: "Student",
                        icon: GraduationCap,
                      },
                      { value: "parent", label: "Parent", icon: Users },
                    ] as const
                  ).map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => updateForm("role", value)}
                      className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 font-semibold text-sm transition-all duration-200 active:scale-95 ${
                        form.role === value
                          ? "border-primary-500 bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 scale-[1.02]"
                          : "border-slate-200 dark:border-dark-700 text-slate-500 dark:text-slate-400 hover:border-primary-300 dark:hover:border-primary-700 hover:scale-[1.02]"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="animate-fade-up stagger-4">
                <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                  <input
                    className="input-field pl-10"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={e => updateForm("name", e.target.value)}
                  />
                </div>
              </div>

              <div className="animate-fade-up stagger-5">
                <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                  <input
                    type="email"
                    className="input-field pl-10"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={e => updateForm("email", e.target.value)}
                  />
                </div>
              </div>

              <div className="animate-fade-up stagger-6">
                <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="input-field pl-10 pr-10"
                    placeholder="Min 8 characters"
                    value={form.password}
                    onChange={e => updateForm("password", e.target.value)}
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

              <div className="animate-fade-up stagger-7">
                <button
                  type="button"
                  onClick={() =>
                    form.role === "student" ? setStep(2) : handleRegister()
                  }
                  disabled={
                    !form.name || !form.email || !form.password || loading
                  }
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Creating…
                    </>
                  ) : form.role === "parent" ? (
                    <>
                      Create Account <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Next <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 2 — Student Details */}
          {step === 2 && form.role === "student" && (
            <div className="space-y-5">
              <h2 className="font-bold text-lg text-slate-900 dark:text-slate-100">
                Personalize Your Learning
              </h2>

              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                  Class
                </label>
                <select
                  className="input-field"
                  value={form.classLevel}
                  onChange={e => updateForm("classLevel", e.target.value)}
                >
                  {CLASS_LEVELS.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                  Board
                </label>
                <div className="flex flex-wrap gap-2">
                  {BOARDS.map(b => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => updateForm("board", b)}
                      className={`px-3 py-1.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                        form.board === b
                          ? "border-primary-500 bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400"
                          : "border-slate-200 dark:border-dark-700 text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                  Subjects{" "}
                  <span className="font-normal text-slate-400 dark:text-slate-500">
                    ({form.subjects.length} selected)
                  </span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {SUBJECTS.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSubject(s)}
                      className={`px-3 py-1.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                        form.subjects.includes(s)
                          ? "border-primary-500 bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400"
                          : "border-slate-200 dark:border-dark-700 text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-80 bg-slate-100 dark:bg-dark-800 border border-slate-200 dark:border-dark-700 text-slate-700 dark:text-slate-300"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="button"
                  onClick={handleRegister}
                  disabled={loading}
                  className="flex-1 btn-primary flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Creating…
                    </>
                  ) : (
                    <>
                      Start Learning <Zap className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
