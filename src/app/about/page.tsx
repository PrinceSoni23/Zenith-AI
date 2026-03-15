"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  PieChart,
  Pie,
  Cell,
  Sector,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  Brain,
  BookOpen,
  Calculator,
  Calendar,
  Sparkles,
  RefreshCw,
  PenTool,
  HelpCircle,
  MessageSquare,
  Users,
  ArrowRight,
  Zap,
  Target,
  TrendingUp,
  Clock,
  Star,
  CheckCircle,
  Camera,
  Flame,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// ── Data ─────────────────────────────────────────────────────────────────────

const features = [
  {
    id: "power-hour",
    icon: Flame,
    label: "Power Hour",
    pain: "I can't focus — I get distracted every 5 minutes",
    tagline: "60 minutes of deep, distraction-free AI study",
    color: "from-red-500 to-orange-600",
    accent: "#ef4444",
    lightBg: "bg-red-50 dark:bg-red-500/10",
    border: "border-red-200 dark:border-red-500/30",
    details: [
      "Structured 60-minute focused study sessions",
      "AI assigns the right task for each 15-min block",
      "Streak tracking to build daily study habits",
      "Celebrates wins and keeps you motivated",
    ],
    stat: "3× productivity boost",
    href: "/dashboard/power-hour",
  },
  {
    id: "class-translator",
    icon: Brain,
    label: "AI Class Translator",
    pain: "I don't understand what teacher taught",
    tagline: "Never leave class confused again",
    color: "from-indigo-500 to-purple-600",
    accent: "#6366f1",
    lightBg: "bg-indigo-50 dark:bg-indigo-500/10",
    border: "border-indigo-200 dark:border-indigo-500/30",
    details: [
      "Type today's topic in plain words",
      "Get an ultra-simple explanation instantly",
      "Real-life analogies that click in seconds",
      "Supports Hindi, Hinglish & English",
    ],
    stat: "4× faster understanding",
    href: "/dashboard/class-translator",
  },
  {
    id: "smart-notes",
    icon: Camera,
    label: "Vision Lens",
    pain: "I don't understand diagrams or images",
    tagline: "Snap it. Ask it. Understand it.",
    color: "from-violet-500 to-cyan-600",
    accent: "#7c3aed",
    lightBg: "bg-violet-50 dark:bg-violet-500/10",
    border: "border-violet-200 dark:border-violet-500/30",
    details: [
      "Upload any diagram, textbook page or whiteboard photo",
      "Ask anything about the image in plain English",
      "AI explains with key points and study tips",
      "Works with science diagrams, maps, equations and more",
    ],
    stat: "Instant visual understanding",
    href: "/dashboard/smart-notes",
  },
  {
    id: "maths-helper",
    icon: Calculator,
    label: "Maths Step-By-Step Solver",
    pain: "Maths scares me",
    tagline: "Hint or full solution — your choice",
    color: "from-orange-500 to-amber-600",
    accent: "#f97316",
    lightBg: "bg-orange-50 dark:bg-orange-500/10",
    border: "border-orange-200 dark:border-orange-500/30",
    details: [
      "Choose hint mode or full step-by-step walkthrough",
      "Each step explained in plain, simple language",
      "Visual diagrams where needed",
      "Encourages thinking — not just copying answers",
    ],
    stat: "No more maths anxiety",
    href: "/dashboard/maths-helper",
  },
  {
    id: "study-planner",
    icon: Calendar,
    label: "Micro-Study Planner",
    pain: "I waste time and don't study daily",
    tagline: "Tiny tasks. Big consistency.",
    color: "from-blue-500 to-cyan-600",
    accent: "#3b82f6",
    lightBg: "bg-blue-50 dark:bg-blue-500/10",
    border: "border-blue-200 dark:border-blue-500/30",
    details: [
      "No boring timetables — just daily micro-tasks",
      '"Read 2 pages", "Revise 3 formulas" etc.',
      "Streaks, badges & virtual rewards",
      "AI adapts the plan based on your progress",
    ],
    stat: "3× study consistency",
    href: "/dashboard/study-planner",
  },
  {
    id: "story-mode",
    icon: Sparkles,
    label: "Story Mode Learning",
    pain: "Books feel boring and heavy",
    tagline: "Turn any chapter into a story",
    color: "from-pink-500 to-rose-600",
    accent: "#ec4899",
    lightBg: "bg-pink-50 dark:bg-pink-500/10",
    border: "border-pink-200 dark:border-pink-500/30",
    details: [
      "History chapters become gripping narratives",
      "Physics explained as a friendly conversation",
      "Daily-life examples woven into every concept",
      "Learning becomes fun — not painful",
    ],
    stat: "80% more engagement",
    href: "/dashboard/story-mode",
  },
  {
    id: "revision",
    icon: RefreshCw,
    label: "Auto Revision System",
    pain: "I forget what I studied yesterday",
    tagline: "Spaced repetition on autopilot",
    color: "from-violet-500 to-purple-600",
    accent: "#8b5cf6",
    lightBg: "bg-violet-50 dark:bg-violet-500/10",
    border: "border-violet-200 dark:border-violet-500/30",
    details: [
      "AI tracks everything you've studied",
      "Flash cards tuned to your weak spots",
      "2-minute recall tasks every day",
      "Built-in spaced repetition science",
    ],
    stat: "5–10 min/day, huge impact",
    href: "/dashboard/revision",
  },
  {
    id: "writing-coach",
    icon: PenTool,
    label: "AI Writing Coach",
    pain: "I can't write English answers properly",
    tagline: "Better writing, better marks",
    color: "from-rose-500 to-pink-600",
    accent: "#f43f5e",
    lightBg: "bg-rose-50 dark:bg-rose-500/10",
    border: "border-rose-200 dark:border-rose-500/30",
    details: [
      "Corrects grammar, spelling & structure",
      "Explains every mistake — not just marks it",
      "Essays, letters, exam answers — all covered",
      "School-friendly vocabulary improvement",
    ],
    stat: "2 grade improvement avg",
    href: "/dashboard/writing-coach",
  },
  {
    id: "question-generator",
    icon: HelpCircle,
    label: "AI Question Generator",
    pain: "I don't know how to practise effectively",
    tagline: "From any chapter — easy to hard",
    color: "from-sky-500 to-blue-600",
    accent: "#0ea5e9",
    lightBg: "bg-sky-50 dark:bg-sky-500/10",
    border: "border-sky-200 dark:border-sky-500/30",
    details: [
      "Generates easy → hard questions on any topic",
      '"Why" and higher-order thinking questions included',
      "Perfect exam preparation companion",
      "Builds natural curiosity about subjects",
    ],
    stat: "500+ question types",
    href: "/dashboard/question-generator",
  },
  {
    id: "mentor",
    icon: MessageSquare,
    label: "AI Personal Mentor",
    pain: "I get no personal attention",
    tagline: "A friendly teacher — always available",
    color: "from-amber-500 to-orange-600",
    accent: "#f59e0b",
    lightBg: "bg-amber-50 dark:bg-amber-500/10",
    border: "border-amber-200 dark:border-amber-500/30",
    details: [
      "Tracks your progress across all subjects",
      "Gives gentle, encouraging feedback",
      "Adapts its tone — never robotic or strict",
      "Like having a private tutor at zero cost",
    ],
    stat: "24/7 availability",
    href: "/dashboard/mentor",
  },
  {
    id: "parent",
    icon: Users,
    label: "Parent Insight Dashboard",
    pain: "Parents don't understand how I study",
    tagline: "Learning focus — not marks pressure",
    color: "from-teal-500 to-cyan-600",
    accent: "#14b8a6",
    lightBg: "bg-teal-50 dark:bg-teal-500/10",
    border: "border-teal-200 dark:border-teal-500/30",
    details: [
      "Parents see what child studied today",
      "Weak subject breakdown at a glance",
      "Consistency score — not marks-based",
      "Schools and parents love this transparency",
    ],
    stat: "Schools love this feature",
    href: "/dashboard/parent",
  },
];

const radarData = [
  { subject: "Understanding", score: 95 },
  { subject: "Vision", score: 88 },
  { subject: "Planning", score: 92 },
  { subject: "Revision", score: 90 },
  { subject: "Writing", score: 85 },
  { subject: "Maths", score: 93 },
];

const painPieData = [
  { name: "Can't focus / distracted", value: 24, color: "#ef4444" },
  { name: "Don't understand class", value: 26, color: "#6366f1" },
  { name: "No study plan", value: 20, color: "#3b82f6" },
  { name: "Forget material", value: 16, color: "#8b5cf6" },
  { name: "Maths fear", value: 14, color: "#f97316" },
];

const improvementData = [
  { week: "Wk 1", score: 42 },
  { week: "Wk 2", score: 55 },
  { week: "Wk 3", score: 63 },
  { week: "Wk 4", score: 71 },
  { week: "Wk 5", score: 78 },
  { week: "Wk 6", score: 86 },
  { week: "Wk 7", score: 91 },
  { week: "Wk 8", score: 96 },
];

const subjectData = [
  { subject: "Maths", before: 45, after: 82 },
  { subject: "Science", before: 52, after: 88 },
  { subject: "English", before: 60, after: 91 },
  { subject: "History", before: 38, after: 79 },
  { subject: "Geography", before: 55, after: 85 },
];

const stats = [
  { value: "11", label: "AI Modules", icon: Zap, suffix: "+" },
  { value: "4", label: "Language Support", icon: Star, suffix: "×" },
  { value: "500", label: "Question Types", icon: HelpCircle, suffix: "+" },
  { value: "24", label: "Hours Available", icon: Clock, suffix: "/7" },
  { value: "100", label: "Subjects Covered", icon: BookOpen, suffix: "%" },
  {
    value: "3",
    label: "Study Consistency Boost",
    icon: TrendingUp,
    suffix: "×",
  },
];

// ── Custom Tooltip ────────────────────────────────────────────────────────────
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; name: string }[];
  label?: string;
}) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-white/10 rounded-xl px-3 py-2 shadow-xl text-xs">
        <p className="font-bold text-slate-200 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-slate-400">
            {p.name}:{" "}
            <span className="font-semibold text-white">{p.value}%</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
}

// ── Custom Pie Tooltip ────────────────────────────────────────────────────────
function PieTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { name: string; value: number; payload: { color: string } }[];
}) {
  if (active && payload && payload.length) {
    const d = payload[0];
    return (
      <div
        className="shadow-2xl rounded-2xl overflow-hidden"
        style={{ minWidth: 180 }}
      >
        {/* Coloured top bar */}
        <div className="h-1.5 w-full" style={{ background: d.payload.color }} />
        <div className="bg-gray-900 border border-white/10 px-4 py-3">
          {/* Dot + name */}
          <div className="flex items-center gap-2 mb-2">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ background: d.payload.color }}
            />
            <p className="text-xs font-semibold text-slate-100 leading-snug">
              {d.name}
            </p>
          </div>
          {/* Big percentage */}
          <p
            className="text-3xl font-black leading-none"
            style={{ color: d.payload.color }}
          >
            {d.value}%
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            of students affected
          </p>
        </div>
      </div>
    );
  }
  return null;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const chartsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance
      gsap.fromTo(
        ".hero-title span",
        { opacity: 0, y: 60, skewY: 4 },
        {
          opacity: 1,
          y: 0,
          skewY: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          delay: 0.2,
        },
      );
      gsap.fromTo(
        ".hero-sub",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.8, ease: "power2.out" },
      );
      gsap.fromTo(
        ".hero-badge",
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          delay: 0.3,
          ease: "back.out(1.7)",
          stagger: 0.08,
        },
      );

      // Floating orbs
      gsap.to(".orb-1", {
        x: 30,
        y: -20,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".orb-2", {
        x: -25,
        y: 25,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1,
      });
      gsap.to(".orb-3", {
        x: 15,
        y: 30,
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 2,
      });

      // Stats counter animation
      gsap.fromTo(
        ".stat-card",
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 80%",
          },
        },
      );

      // Section headings
      gsap.utils.toArray<HTMLElement>(".section-heading").forEach(el => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          },
        );
      });

      // Feature cards — alternating left/right slide
      featureRefs.current.forEach((el, i) => {
        if (!el) return;
        const fromLeft = i % 2 === 0;
        gsap.fromTo(
          el,
          { opacity: 0, x: fromLeft ? -60 : 60, y: 20 },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 82%",
            },
          },
        );
      });

      // Chart section
      gsap.fromTo(
        ".chart-card",
        { opacity: 0, y: 50, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: chartsRef.current,
            start: "top 80%",
          },
        },
      );

      // CTA section
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 85%",
          },
        },
      );

      // Parallax on pain labels
      gsap.utils.toArray<HTMLElement>(".pain-label").forEach(el => {
        gsap.fromTo(
          el,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 90%" },
          },
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 overflow-x-hidden">
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center pt-20 pb-8 overflow-hidden"
      >
        {/* Background gradient blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb-1 absolute top-20 left-[10%] w-80 h-80 rounded-full opacity-20 blur-3xl bg-indigo-500" />
          <div className="orb-2 absolute top-40 right-[15%] w-96 h-96 rounded-full opacity-15 blur-3xl bg-purple-500" />
          <div className="orb-3 absolute bottom-20 left-[40%] w-72 h-72 rounded-full opacity-20 blur-3xl bg-cyan-500" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          {/* Badge strip */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            {[
              "NUR → Class 12",
              "CBSE · ICSE · State",
              "AI-Powered",
              "Always Available",
            ].map(b => (
              <span
                key={b}
                className="hero-badge inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-white/80 dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 backdrop-blur-sm shadow-sm"
              >
                <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                {b}
              </span>
            ))}
          </div>

          <h1 className="hero-title text-5xl md:text-7xl font-black leading-[1.05] tracking-tight text-slate-900 dark:text-white mb-5">
            <span className="block">Every Student's</span>
            <span className="block bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              AI Learning
            </span>
            <span className="block">Companion</span>
          </h1>

          <p className="hero-sub max-w-2xl mx-auto text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
            11 AI-powered modules built around the{" "}
            <span className="font-bold text-slate-900 dark:text-white">
              real pain points
            </span>{" "}
            every school student faces — from focusing in class to getting
            parents involved.
          </p>

          <div className="hero-sub flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/register"
              className="btn-primary px-8 py-3 text-base rounded-2xl"
            >
              Start AI Journey <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#features"
              className="btn-secondary px-8 py-3 text-base rounded-2xl"
            >
              Explore Features
            </Link>
          </div>

          {/* Scrolling module chips */}
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {features.map(f => (
              <span
                key={f.id}
                className="px-3 py-1 rounded-xl text-xs font-semibold bg-white dark:bg-white/[0.06] border border-slate-200 dark:border-white/15 text-slate-700 dark:text-slate-300"
              >
                {f.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────────── */}
      <section ref={statsRef} className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="section-heading text-center text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-12">
            Built for{" "}
            <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              real impact
            </span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {stats.map(s => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className="stat-card rounded-2xl p-5 text-center bg-white/70 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/8 backdrop-blur-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">
                    {s.value}
                    <span className="text-indigo-500">{s.suffix}</span>
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-tight">
                    {s.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CHARTS SECTION ────────────────────────────────────────────────── */}
      <section ref={chartsRef} className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="section-heading text-center text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">
            Why students{" "}
            <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              struggle
            </span>{" "}
            — and how we fix it
          </h2>
          <p className="section-heading text-center text-slate-500 dark:text-slate-400 mb-14 max-w-xl mx-auto">
            Data-backed insights into the exact problems our 11 modules solve
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Pie — pain point distribution */}
            <div className="chart-card lg:col-span-1 rounded-3xl p-6 bg-white/70 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/8 shadow-sm backdrop-blur-sm">
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
                Top Student Pain Points
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                % of students affected by each issue
              </p>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={painPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                    activeShape={(props: {
                      cx?: number;
                      cy?: number;
                      innerRadius?: number;
                      outerRadius?: number;
                      startAngle?: number;
                      endAngle?: number;
                      fill?: string;
                    }) => (
                      <Sector
                        cx={props.cx ?? 0}
                        cy={props.cy ?? 0}
                        innerRadius={props.innerRadius ?? 0}
                        outerRadius={(props.outerRadius ?? 0) + 8}
                        startAngle={props.startAngle ?? 0}
                        endAngle={props.endAngle ?? 0}
                        fill={props.fill ?? "#6366f1"}
                      />
                    )}
                  >
                    {painPieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} opacity={0.9} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-3">
                {painPieData.map(d => (
                  <div key={d.name} className="flex items-center gap-2 text-xs">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: d.color }}
                    />
                    <span className="text-slate-600 dark:text-slate-300 flex-1 truncate">
                      {d.name}
                    </span>
                    <span
                      className="font-bold text-xs tabular-nums"
                      style={{ color: d.color }}
                    >
                      {d.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Area — improvement over time */}
            <div className="chart-card lg:col-span-2 rounded-3xl p-6 bg-white/70 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/8 shadow-sm backdrop-blur-sm">
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
                Student Performance Over 8 Weeks
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                Average score improvement with daily AI usage
              </p>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart
                  data={improvementData}
                  margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="week"
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                    domain={[30, 100]}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(15,23,42,0.9)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      fontSize: "12px",
                      color: "#e2e8f0",
                    }}
                    formatter={(val: number | undefined) => [
                      `${val ?? 0}`,
                      "Score",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    fill="url(#perfGrad)"
                    dot={{ fill: "#6366f1", r: 4, strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: "#818cf8" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar — before/after by subject */}
            <div className="chart-card rounded-3xl p-6 bg-white/70 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/8 shadow-sm backdrop-blur-sm">
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
                Before vs After — By Subject
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                Average test scores before and after using Zenith
              </p>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart
                  data={subjectData}
                  margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                  barGap={4}
                >
                  <XAxis
                    dataKey="subject"
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                    domain={[0, 100]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="before"
                    name="Before"
                    fill="#475569"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={22}
                  />
                  <Bar
                    dataKey="after"
                    name="After"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={22}
                  >
                    {subjectData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={
                          [
                            "#6366f1",
                            "#10b981",
                            "#f43f5e",
                            "#f97316",
                            "#3b82f6",
                          ][i]
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-4 mt-3 justify-center text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-slate-400 dark:bg-slate-600" />{" "}
                  Before
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-indigo-500" /> After
                </span>
              </div>
            </div>

            {/* Radar — skill coverage */}
            <div className="chart-card rounded-3xl p-6 bg-white/70 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/8 shadow-sm backdrop-blur-sm">
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
                AI Coverage Across Skills
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                How effectively each learning dimension is addressed
              </p>
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart
                  data={radarData}
                  margin={{ top: 10, right: 20, bottom: 10, left: 20 }}
                >
                  <PolarGrid stroke="rgba(148,163,184,0.2)" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={false}
                    axisLine={false}
                  />
                  <Radar
                    name="Coverage"
                    dataKey="score"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.25}
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#8b5cf6", strokeWidth: 0 }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(15,23,42,0.9)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      fontSize: "12px",
                      color: "#e2e8f0",
                    }}
                    formatter={(val: number | undefined) => [
                      `${val ?? 0}%`,
                      "Score",
                    ]}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES DEEP DIVE ────────────────────────────────────────────── */}
      <section id="features" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="section-heading text-center text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">
            11 modules.{" "}
            <span className="bg-gradient-to-r from-indigo-500 to-cyan-500 bg-clip-text text-transparent">
              11 problems solved.
            </span>
          </h2>
          <p className="section-heading text-center text-slate-500 dark:text-slate-400 mb-20 max-w-xl mx-auto">
            Every module is built around a specific, real pain point every
            school student faces.
          </p>

          <div className="space-y-20">
            {features.map((f, i) => {
              const Icon = f.icon;
              const isEven = i % 2 === 0;
              return (
                <div
                  key={f.id}
                  ref={el => {
                    featureRefs.current[i] = el;
                  }}
                  className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-10 lg:gap-16`}
                >
                  {/* Visual side */}
                  <div className="w-full lg:w-5/12 flex-shrink-0">
                    <div
                      className={`rounded-3xl p-8 ${f.lightBg} border ${f.border} relative overflow-hidden`}
                    >
                      {/* Background number */}
                      <span
                        className="absolute -right-4 -bottom-6 text-[120px] font-black leading-none select-none pointer-events-none opacity-[0.06]"
                        style={{ color: f.accent }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>

                      {/* Pain label */}
                      <div className="pain-label inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 bg-white/60 dark:bg-black/40 border border-white/40 dark:border-white/15 text-slate-700 dark:text-slate-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                        Pain: {f.pain}
                      </div>

                      {/* Icon + title */}
                      <div className="flex items-center gap-4 mb-6">
                        <div
                          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center shadow-lg flex-shrink-0`}
                        >
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-slate-900 dark:text-white">
                            {f.label}
                          </h3>
                          <p
                            className="text-sm font-medium mt-0.5"
                            style={{ color: f.accent }}
                          >
                            {f.tagline}
                          </p>
                        </div>
                      </div>

                      {/* Details */}
                      <ul className="space-y-3 mb-8">
                        {f.details.map(d => (
                          <li
                            key={d}
                            className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-200"
                          >
                            <div
                              className="w-5 h-5 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center"
                              style={{ background: `${f.accent}25` }}
                            >
                              <CheckCircle
                                className="w-3 h-3"
                                style={{ color: f.accent }}
                              />
                            </div>
                            {d}
                          </li>
                        ))}
                      </ul>

                      {/* Stat pill */}
                      <div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-white"
                        style={{
                          background: `linear-gradient(135deg, ${f.accent}, ${f.accent}bb)`,
                        }}
                      >
                        <Target className="w-4 h-4" />
                        {f.stat}
                      </div>
                    </div>
                  </div>

                  {/* Text side */}
                  <div className="w-full lg:w-7/12">
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className="text-6xl font-black opacity-15 leading-none"
                        style={{ color: f.accent }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="h-px flex-1 bg-gradient-to-r from-slate-200 dark:from-slate-700 to-transparent" />
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3 leading-tight">
                      {f.label}
                    </h3>
                    <p
                      className="text-lg font-semibold mb-5"
                      style={{ color: f.accent }}
                    >
                      "{f.pain}"
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed mb-8">
                      {f.tagline}. This module was built specifically to solve
                      this exact daily frustration that{" "}
                      <span className="font-semibold text-slate-900 dark:text-white">
                        millions of school students
                      </span>{" "}
                      face across India — whether they're in Class 3 or Class
                      12.
                    </p>

                    <Link
                      href={f.href}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                      style={{
                        background: `linear-gradient(135deg, ${f.accent}, ${f.accent}cc)`,
                        boxShadow: `0 4px 20px ${f.accent}40`,
                      }}
                    >
                      Try {f.label} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="section-heading text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">
            Up and running in{" "}
            <span className="bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
              60 seconds
            </span>
          </h2>
          <p className="section-heading text-slate-500 dark:text-slate-400 mb-16 max-w-md mx-auto">
            No setup, no confusion. Just open, pick a module, and start
            learning.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create your profile",
                desc: "Choose your class (NUR–12), board (CBSE/ICSE/State) and subjects in under 60 seconds.",
                color: "#6366f1",
              },
              {
                step: "02",
                title: "Pick today's module",
                desc: "Use Power Hour for deep focus, Class Translator after school, Maths Helper for homework, or Vision Lens for diagrams.",
                color: "#10b981",
              },
              {
                step: "03",
                title: "AI adapts to you",
                desc: "Your Mentor learns your weak spots and builds a personalised micro-plan around your gaps.",
                color: "#f59e0b",
              },
            ].map(s => (
              <div
                key={s.step}
                className="stat-card relative rounded-3xl p-8 bg-white dark:bg-gray-900 border border-slate-200 dark:border-white/8 text-left"
              >
                <span
                  className="text-6xl font-black leading-none block mb-4 opacity-15"
                  style={{ color: s.color }}
                >
                  {s.step}
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3">
                  {s.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {s.desc}
                </p>
                <div
                  className="absolute top-6 right-6 w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: `${s.color}20` }}
                >
                  <CheckCircle className="w-4 h-4" style={{ color: s.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOR PARENTS ───────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-teal-50 dark:bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-500/30 mb-6">
              <Users className="w-4 h-4" />
              For Parents
            </div>
            <h2 className="section-heading text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">
              Know exactly how your child{" "}
              <span className="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                is studying.
              </span>
            </h2>
            <p className="section-heading text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
              No marks. No pressure. Just clear, honest progress — visible to
              you in seconds.
            </p>
          </div>

          {/* Feature grid */}
          <div className="grid md:grid-cols-2 gap-5 mb-12">
            {[
              {
                icon: "🔥",
                title: "Live Streak Visibility",
                desc: "See your child's daily study streak. A 7-day streak means 7 days of real effort — not 7 days of exam cramming.",
                tag: "Consistency, not marks",
              },
              {
                icon: "📊",
                title: "AI Progress Report",
                desc: '"Priya studied 4 sessions this week, averaging 35 min each. Strong in Chemistry. Needs work on Algebra." — Generated automatically.',
                tag: "Plain English, no jargon",
              },
              {
                icon: "🎯",
                title: "Weak Topic Breakdown",
                desc: 'Specific knowledge gaps surfaced by AI — so you can have an informed conversation, not a vague "study harder" one.',
                tag: "Actionable insight",
              },
              {
                icon: "🔒",
                title: "Separate Parent Account",
                desc: "Link to your child's profile without sharing passwords. Read-only access — you see everything, change nothing.",
                tag: "Privacy-first design",
              },
            ].map(item => (
              <div
                key={item.title}
                className="stat-card group flex gap-5 p-6 rounded-2xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-white/8 hover:border-teal-300 dark:hover:border-teal-500/40 transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center text-2xl flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <h3 className="font-black text-base text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-500/20">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom callout bar */}
          <div
            className="relative rounded-2xl overflow-hidden p-7 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-teal-200 dark:border-teal-500/30"
            style={{
              background:
                "linear-gradient(135deg, rgba(20,184,166,0.07) 0%, rgba(6,182,212,0.07) 100%)",
            }}
          >
            <div>
              <p className="font-black text-xl text-slate-900 dark:text-white mb-1">
                Your child studies. You stay informed. 🤝
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No nagging needed — the data speaks for itself.
              </p>
            </div>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl text-sm font-bold text-white whitespace-nowrap transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              style={{
                background: "linear-gradient(135deg, #14b8a6, #06b6d4)",
                boxShadow: "0 4px 20px rgba(20,184,166,0.35)",
              }}
            >
              Create parent account <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-24">
        <div ref={ctaRef} className="max-w-4xl mx-auto px-6 text-center">
          <div
            className="relative rounded-3xl overflow-hidden p-12 md:p-20 border border-indigo-200 dark:border-indigo-500/30"
            style={{
              background:
                "linear-gradient(135deg, rgba(99,102,241,0.07) 0%, rgba(139,92,246,0.07) 50%, rgba(236,72,153,0.05) 100%)",
            }}
          >
            {/* Background orbs */}
            <div className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-20 blur-3xl bg-indigo-400 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full opacity-20 blur-3xl bg-purple-400 translate-x-1/2 translate-y-1/2 pointer-events-none" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 mb-8">
                <Sparkles className="w-4 h-4" />
                24/7 AI Support
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
                Ready to study{" "}
                <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  smarter?
                </span>
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-xl mx-auto leading-relaxed">
                Join thousands of students using Zenith to understand more,
                remember more, and stress less.
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Link
                  href="/register"
                  className="btn-primary px-10 py-3.5 text-base rounded-2xl"
                >
                  Start your Smart Journey <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/"
                  className="btn-secondary px-8 py-3.5 text-base rounded-2xl"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 dark:border-white/5 py-10 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-slate-700 dark:text-slate-300">
              Zenith
            </span>
            <span>— AI Learning Companion for every student</span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              About
            </Link>
            <Link
              href="/login"
              className="hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
