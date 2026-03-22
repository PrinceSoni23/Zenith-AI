"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import {
  ArrowRight,
  Sparkles,
  Brain,
  Camera,
  Calculator,
  Calendar,
  RefreshCw,
  PenTool,
  HelpCircle,
  MessageSquare,
  Users,
  CheckCircle,
  Zap,
  Star,
  TrendingUp,
  Flame,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Flame,
    label: "Power Hour",
    desc: "60 min of AI-guided deep focus — no distractions",
    color: "from-red-500 to-orange-600",
    href: "/dashboard/power-hour",
  },
  {
    icon: Brain,
    label: "Understand Class",
    desc: "Simplifies any lesson into your language instantly",
    color: "from-indigo-500 to-purple-600",
    href: "/dashboard/class-translator",
  },
  {
    icon: Camera,
    label: "Vision Lens",
    desc: "Upload any image or diagram and ask AI to explain it",
    color: "from-violet-500 to-cyan-500",
    href: "/dashboard/smart-notes",
  },
  {
    icon: Calculator,
    label: "Maths Helper",
    desc: "Step-by-step solver with hints mode",
    color: "from-orange-500 to-amber-600",
    href: "/dashboard/maths-helper",
  },
  {
    icon: Calendar,
    label: "Study Planner",
    desc: "Personalised daily micro-tasks for you",
    color: "from-blue-500 to-cyan-600",
    href: "/dashboard/study-planner",
  },
  {
    icon: Sparkles,
    label: "Story Mode",
    desc: "Chapters taught through engaging stories",
    color: "from-pink-500 to-rose-600",
    href: "/dashboard/story-mode",
  },
  {
    icon: RefreshCw,
    label: "Auto Revision",
    desc: "Flash cards & recall from your weak spots",
    color: "from-violet-500 to-purple-600",
    href: "/dashboard/revision",
  },
  {
    icon: PenTool,
    label: "Writing Coach",
    desc: "AI edits your essays and exam answers",
    color: "from-rose-500 to-pink-600",
    href: "/dashboard/writing-coach",
  },
  {
    icon: HelpCircle,
    label: "Question Bank",
    desc: "Easy to hard questions on any topic",
    color: "from-sky-500 to-blue-600",
    href: "/dashboard/question-generator",
  },
  {
    icon: MessageSquare,
    label: "AI Mentor",
    desc: "Daily personalised motivation & guidance",
    color: "from-amber-500 to-orange-600",
    href: "/dashboard/mentor",
  },
  {
    icon: Users,
    label: "Parent Dashboard",
    desc: "Weekly AI reports for parents",
    color: "from-teal-500 to-cyan-600",
    href: "/dashboard/parent",
  },
];

const stats = [
  { value: "11+", label: "AI Modules", icon: Zap },
  { value: "CBSE/ICSE", label: "All Boards", icon: CheckCircle },
  { value: "NUR → 12", label: "Every Class", icon: TrendingUp },
  { value: "24/7", label: "Always Available", icon: Star },
];

const steps = [
  {
    step: "01",
    title: "Create your profile",
    desc: "Pick your class, board, and subjects in under 60 seconds.",
  },
  {
    step: "02",
    title: "Start any module",
    desc: "Use Power Hour for deep focus, Vision Lens for diagrams, Maths Helper for homework — whatever you need today.",
  },
  {
    step: "03",
    title: "AI tracks & adapts",
    desc: "Your mentor learns your weak spots and builds your daily plan around them.",
  },
];

const subjects = [
  "Maths",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Hindi",
  "History",
  "Geography",
  "Economics",
  "Computer Science",
  "Sanskrit",
  "Political Science",
];

/* Free Unsplash images — served directly, unoptimized */
const testimonials = [
  {
    img: "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=80&h=80&fit=crop&crop=face&auto=format",
    name: "Aarav Sharma",
    grade: "Class 10 · CBSE",
    quote:
      "My Maths score jumped from 62 to 91 in one month. The step-by-step solver finally made algebra click for me.",
    module: "Maths Helper",
    featured: true,
  },
  {
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face&auto=format",
    name: "Rohan Mehta",
    grade: "Class 12 · ICSE",
    quote: "Story Mode made History actually fun. I passed with distinction.",
    module: "Story Mode",
    featured: false,
  },
  {
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face&auto=format",
    name: "Riya Patel",
    grade: "Class 8 · State Board",
    quote:
      "The Writing Coach fixed my essays — my teacher was genuinely shocked at the improvement.",
    module: "Writing Coach",
    featured: false,
  },
  {
    img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&fit=crop&crop=face&auto=format",
    name: "Kabir Singh",
    grade: "Class 11 · CBSE",
    quote:
      "Power Hour is insane. I get more done in 60 minutes than I used to in an entire evening.",
    module: "Power Hour",
    featured: false,
  },
  {
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&crop=face&auto=format",
    name: "Priya Nair",
    grade: "Class 9 · ICSE",
    quote:
      "I uploaded a confusing biology diagram and Vision Lens explained every part in seconds. Magical.",
    module: "Vision Lens",
    featured: true,
  },
  {
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face&auto=format",
    name: "Dev Agarwal",
    grade: "Class 12 · CBSE",
    quote:
      "Auto Revision drilled my weak topics every day. Boards were way less stressful.",
    module: "Auto Revision",
    featured: false,
  },
];

/* ── Testimonial Chat Bubbles component ───────────────────── */
type Testimonial = {
  img: string;
  name: string;
  grade: string;
  quote: string;
  module: string;
  featured: boolean;
};

function TestimonialChat({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <div className="flex flex-col gap-5 max-w-lg mx-auto">
      {testimonials.map((t, i) => {
        const isRight = i % 2 !== 0;
        return (
          <div
            key={t.name}
            className={`testi-card flex items-end gap-3 ${isRight ? "flex-row-reverse" : "flex-row"}`}
            style={{ animation: `fadeSlideUp 0.4s ease ${i * 0.07}s both` }}
          >
            {/* Avatar */}
            <div className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-white/20 shrink-0 mb-1">
              <Image
                src={t.img}
                alt={t.name}
                fill
                className="object-cover"
                sizes="36px"
                unoptimized
              />
            </div>

            {/* Bubble */}
            <div
              className={`relative max-w-[78%] flex flex-col gap-1.5 ${isRight ? "items-end" : "items-start"}`}
            >
              {/* Name + module */}
              <div
                className={`flex items-center gap-2 ${isRight ? "flex-row-reverse" : "flex-row"}`}
              >
                <span className="text-[11px] font-bold text-white/70">
                  {t.name.split(" ")[0]}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.08] text-white/40 border border-white/[0.07] font-medium">
                  {t.module}
                </span>
              </div>

              {/* Message bubble */}
              <div
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed text-white/90 shadow-lg ${
                  isRight
                    ? "rounded-br-sm bg-gradient-to-br from-indigo-600 to-violet-600"
                    : "rounded-bl-sm bg-white/[0.08] border border-white/[0.10]"
                }`}
              >
                {t.quote}
              </div>

              {/* Stars + grade */}
              <div
                className={`flex items-center gap-2 ${isRight ? "flex-row-reverse" : "flex-row"}`}
              >
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, si) => (
                    <Star
                      key={si}
                      className="w-3 h-3 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-[10px] text-white/30">{t.grade}</span>
              </div>
            </div>
          </div>
        );
      })}

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<HTMLElement>(null);
  const testiRef = useRef<HTMLElement>(null);
  const subjectsRef = useRef<HTMLElement>(null);
  const ctaSectionRef = useRef<HTMLElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /* ── Custom magnetic cursor ─────────────────────────── */
    const cursorDot = cursorRef.current?.querySelector(
      ".c-dot",
    ) as HTMLElement | null;
    const cursorRing = cursorRef.current?.querySelector(
      ".c-ring",
    ) as HTMLElement | null;
    if (cursorDot && cursorRing) {
      let mx = 0,
        my = 0,
        rx = 0,
        ry = 0;
      const onMove = (e: MouseEvent) => {
        mx = e.clientX;
        my = e.clientY;
        gsap.set(cursorDot, { x: mx, y: my });
      };
      window.addEventListener("mousemove", onMove);
      const tick = gsap.ticker.add(() => {
        rx += (mx - rx) * 0.1;
        ry += (my - ry) * 0.1;
        gsap.set(cursorRing, { x: rx, y: ry });
      });
      const hoverEls = document.querySelectorAll("a, button");
      hoverEls.forEach(el => {
        el.addEventListener("mouseenter", () =>
          gsap.to(cursorRing, { scale: 2.2, opacity: 0.5, duration: 0.3 }),
        );
        el.addEventListener("mouseleave", () =>
          gsap.to(cursorRing, { scale: 1, opacity: 1, duration: 0.3 }),
        );
      });
      return () => {
        window.removeEventListener("mousemove", onMove);
        gsap.ticker.remove(tick);
        ScrollTrigger.getAll().forEach(st => st.kill());
      };
    }

    /* ── Hero entrance ───────────────────────────────────── */
    const els = [
      badgeRef.current,
      h1Ref.current,
      subRef.current,
      ctaRef.current,
      heroImgRef.current,
      statsRef.current,
    ];
    gsap.set(els, { autoAlpha: 0, y: 40 });
    gsap.set(heroImgRef.current, { autoAlpha: 0, x: 60, y: 0 });

    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.to(badgeRef.current, { autoAlpha: 1, y: 0, duration: 0.8, delay: 0.15 })
      .to(h1Ref.current, { autoAlpha: 1, y: 0, duration: 0.9 }, "-=0.5")
      .to(subRef.current, { autoAlpha: 1, y: 0, duration: 0.7 }, "-=0.5")
      .to(ctaRef.current, { autoAlpha: 1, y: 0, duration: 0.7 }, "-=0.45")
      .to(
        heroImgRef.current,
        { autoAlpha: 1, x: 0, duration: 1.0, ease: "power3.out" },
        "-=0.6",
      )
      .to(statsRef.current, { autoAlpha: 1, y: 0, duration: 0.7 }, "-=0.5");

    /* Floating chips bobbing */
    gsap.to(".float-chip", {
      y: -10,
      duration: 2.4,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      stagger: { each: 0.7, from: "random" },
    });

    /* Parallax orbs on scroll */
    gsap.to(".hero-orb-1", {
      scrollTrigger: { trigger: heroRef.current, scrub: 1.5 },
      y: -140,
      x: -50,
    });
    gsap.to(".hero-orb-2", {
      scrollTrigger: { trigger: heroRef.current, scrub: 1.5 },
      y: -80,
      x: 50,
    });

    /* ── Features stagger ─────────────────────────────────── */
    if (featuresRef.current) {
      gsap.from(featuresRef.current.querySelectorAll(".feat-card"), {
        scrollTrigger: { trigger: featuresRef.current, start: "top 78%" },
        y: 70,
        autoAlpha: 0,
        duration: 0.65,
        ease: "power3.out",
        stagger: 0.07,
      });
    }

    /* ── Section headings ────────────────────────────────── */
    document.querySelectorAll(".gsap-heading").forEach(el => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: "top 82%" },
        y: 40,
        autoAlpha: 0,
        duration: 0.8,
        ease: "power3.out",
      });
    });

    /* ── Steps pop ───────────────────────────────────────── */
    if (stepsRef.current) {
      gsap.from(stepsRef.current.querySelectorAll(".step-card"), {
        scrollTrigger: { trigger: stepsRef.current, start: "top 72%" },
        scale: 0.85,
        autoAlpha: 0,
        duration: 0.6,
        ease: "back.out(1.6)",
        stagger: 0.15,
      });
    }

    /* ── Testimonials slide in ────────────────────────────── */
    if (testiRef.current) {
      gsap.from(testiRef.current.querySelectorAll(".testi-card"), {
        scrollTrigger: { trigger: testiRef.current, start: "top 75%" },
        x: 60,
        autoAlpha: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.12,
      });
    }

    /* ── Subject pills cascade ──────────────────────────── */
    if (subjectsRef.current) {
      gsap.from(subjectsRef.current.querySelectorAll(".subj-pill"), {
        scrollTrigger: { trigger: subjectsRef.current, start: "top 80%" },
        scale: 0,
        autoAlpha: 0,
        duration: 0.35,
        ease: "back.out(2)",
        stagger: 0.05,
      });
    }

    /* ── CTA zoom-in ─────────────────────────────────────── */
    if (ctaSectionRef.current) {
      gsap.from(ctaSectionRef.current.querySelector(".cta-box"), {
        scrollTrigger: { trigger: ctaSectionRef.current, start: "top 78%" },
        scale: 0.9,
        autoAlpha: 0,
        duration: 0.9,
        ease: "power3.out",
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-slate-100 overflow-x-hidden">
      {/* Custom cursor */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed inset-0 z-[9999] hidden lg:block"
      >
        <div className="c-dot absolute w-2 h-2 rounded-full bg-primary-500 -translate-x-1/2 -translate-y-1/2" />
        <div className="c-ring absolute w-8 h-8 rounded-full border-2 border-primary-500/60 -translate-x-1/2 -translate-y-1/2" />
      </div>

      <Navbar />

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        id="hero"
        className="relative min-h-screen flex items-center pt-20 pb-16 px-6 overflow-hidden"
      >
        <div className="hero-orb-1 glow-orb w-[700px] h-[700px] bg-primary-500 -top-60 -left-60 opacity-[0.18] dark:opacity-25" />
        <div className="hero-orb-2 glow-orb w-[600px] h-[600px] bg-accent-purple -top-40 -right-60 opacity-[0.12] dark:opacity-20" />
        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(99,102,241,1) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,1) 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative w-full max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Copy */}
            <div className="text-center lg:text-left">
              <div
                ref={badgeRef}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold mb-8 bg-primary-500/10 border-primary-500/30 text-primary-500 dark:text-primary-400"
              >
                <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
                Enterprise-Grade AI · Your Competitive Edge
              </div>

              <h1
                ref={h1Ref}
                className="text-5xl md:text-6xl xl:text-7xl font-black leading-[1.05] tracking-tight mb-6"
              >
                <span className="text-slate-900 dark:text-white">
                  Dominate Your Exams.
                </span>
                <br />
                <span className="gradient-text">Master Every Subject.</span>
              </h1>

              <p
                ref={subRef}
                className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed"
              >
                Get premium AI tutoring with 11+ specialised modules for a
                fraction of traditional tuition cost. Your child learns 24/7
                with modules for{" "}
                <strong className="text-slate-700 dark:text-slate-300">
                  Maths, Science, Languages & more
                </strong>{" "}
                — all in one place.
              </p>

              <p className="text-lg md:text-xl font-black text-slate-900 dark:text-white max-w-2xl mx-auto lg:mx-0 mb-8">
                Reach Your Peak with{" "}
                <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                  Zenith
                </span>
              </p>

              <div
                ref={ctaRef}
                className="flex items-center justify-center lg:justify-start gap-4 flex-wrap mt-[16vh]"
              >
                <Link
                  href="/register"
                  className="btn-primary text-base px-8 py-3.5 rounded-2xl group"
                >
                  Start Learning{" "}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/login"
                  className="btn-secondary text-base px-8 py-3.5 rounded-2xl"
                >
                  Sign In
                </Link>
              </div>
            </div>

            {/* Hero illustration + floating chips */}
            <div
              ref={heroImgRef}
              className="relative flex justify-center lg:justify-end"
            >
              <div className="relative w-full max-w-lg">
                <Image
                  src="/images/hero-student.svg"
                  alt="Zenith dashboard preview"
                  width={480}
                  height={520}
                  priority
                  className="w-full h-auto drop-shadow-2xl"
                />

                {/* Floating achievement chips */}
                <div className="float-chip absolute -top-4 -left-6 bg-white dark:bg-dark-900 rounded-2xl px-4 py-3 shadow-xl border border-slate-100 dark:border-dark-700 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-sm shrink-0">
                    🏆
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      96% on Maths!
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      New personal best
                    </p>
                  </div>
                </div>

                <div className="float-chip absolute bottom-4 -left-10 bg-white dark:bg-dark-900 rounded-2xl px-4 py-3 shadow-xl border border-slate-100 dark:border-dark-700 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-sm shrink-0">
                    🔥
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      14-day streak
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      Keep it up!
                    </p>
                  </div>
                </div>

                <div className="float-chip absolute top-1/3 -right-8 bg-white dark:bg-dark-900 rounded-2xl px-4 py-3 shadow-xl border border-slate-100 dark:border-dark-700 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-sm shrink-0">
                    🤖
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      AI Mentor
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      Daily plan ready
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div
            ref={statsRef}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {stats.map(s => (
              <div
                key={s.label}
                className="group relative card-glass text-center py-6 px-4 rounded-2xl border border-primary-500/15 overflow-hidden cursor-default
                  transition-all duration-300 hover:-translate-y-2 hover:border-primary-500/40 hover:shadow-lg hover:shadow-primary-500/10"
              >
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary-500/60 to-purple-500/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="w-10 h-10 rounded-xl bg-primary-500/10 dark:bg-primary-500/15 border border-primary-500/20 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary-500/20 transition-colors duration-300">
                  <s.icon className="w-5 h-5 text-primary-500 dark:text-primary-400" />
                </div>
                <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {s.value}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PROBLEM/SOLUTION SECTION ═════════════════════════ */}
      <section className="py-28 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* PROBLEM SIDE */}
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-8 leading-tight">
                Is your child…
              </h2>

              <div className="space-y-6">
                {[
                  {
                    icon: "😰",
                    title: "Struggling with weak topics?",
                    desc: "Keeps retaking exams on the same subjects",
                  },
                  {
                    icon: "🤐",
                    title: "Afraid to ask questions?",
                    desc: "Feels shy or embarrassed in class",
                  },
                  {
                    icon: "🧠",
                    title: "Forgetting what they study?",
                    desc: "Learns today, forgets by test day",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex gap-4 p-5 rounded-2xl bg-slate-100/50 dark:bg-dark-900/60 border border-slate-200 dark:border-dark-800 hover:border-primary-500/40 transition-all duration-300"
                  >
                    <span className="text-4xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SOLUTION SIDE */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold mb-6 bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                💡 The Solution
              </div>

              <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-8 leading-tight">
                Meet the AI Tutor <br />
                <span className="gradient-text">That Never Gets Tired</span>
              </h3>

              <div className="space-y-6">
                {[
                  {
                    icon: "⚡",
                    title: "Solves doubts instantly",
                    desc: "AI responds 24/7 — no waiting for a teacher",
                  },
                  {
                    icon: "🎓",
                    title: "Explains like a teacher",
                    desc: "Breaks down concepts step-by-step in simple language",
                  },
                  {
                    icon: "🎯",
                    title: "Adapts to your child",
                    desc: "Learns weak areas and personalises every session",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex gap-4 p-5 rounded-2xl bg-gradient-to-br from-primary-500/10 to-purple-500/10 dark:from-primary-500/15 dark:to-purple-500/15 border border-primary-500/20 dark:border-primary-500/30 hover:border-primary-500/50 transition-all duration-300"
                  >
                    <span className="text-3xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                        {item.title}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ IMPACT STATEMENT ════════════════════════════════ */}
      <section className="py-28 px-6 overflow-hidden bg-gradient-to-br from-slate-900 via-primary-900/50 to-slate-950 dark:from-[#0a0a12] dark:via-primary-950/40 dark:to-[#06060a]">
        <div className="max-w-4xl mx-auto text-center relative">
          {/* Background orb */}
          <div className="absolute inset-0 flex justify-center pointer-events-none">
            <div className="glow-orb w-96 h-96 bg-primary-500 opacity-10 blur-3xl rounded-full" />
          </div>

          <div className="relative">
            <h2 className="text-4xl md:text-5xl xl:text-6xl font-black leading-tight mb-8 text-white">
              It's not that your child
              <br />
              <span className="text-slate-400">isn't working hard…</span>
              <br />
              they just don't have the{" "}
              <span className="gradient-text">right system.</span>
            </h2>

            <p className="text-4xl md:text-5xl xl:text-6xl font-black mb-12">
              <span className="gradient-text">Zenith AI</span>{" "}
              <span className="text-white">changes that.</span>
            </p>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                href="/register"
                className="btn-primary text-lg px-10 py-4 rounded-2xl group"
              >
                Start Free Trial{" "}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="btn-secondary text-lg px-10 py-4 rounded-2xl"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ AI IN ACTION — bento showcase ═════════════════════ */}
      <section className="py-28 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          {/* Heading */}
          <div className="gsap-heading text-center mb-16">
            <span className="badge mb-4">See It In Action</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
              Every module. <span className="gradient-text">One goal.</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto text-base">
              Real AI responses. Real student problems. Solved in seconds.
            </p>
          </div>

          {/* ── Bento grid ───────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-auto">
            {/* 1 — Power Hour timer card (tall, spans 1 col) */}
            <div className="gsap-heading group relative rounded-3xl overflow-hidden border border-red-500/20 bg-gradient-to-br from-red-950/60 via-orange-950/50 to-slate-950/80 p-6 flex flex-col gap-4 hover:border-red-500/50 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg shadow-red-500/30">
                  <Flame className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white text-sm font-bold">Power Hour</p>
                  <p className="text-red-400/70 text-xs">Deep focus session</p>
                </div>
                <span className="ml-auto flex items-center gap-1.5 text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                  LIVE
                </span>
              </div>
              {/* Circular timer */}
              <div className="relative flex items-center justify-center py-4">
                <svg className="w-36 h-36 -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="rgba(239,68,68,0.12)"
                    strokeWidth="6"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="url(#timerGrad)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray="263.9"
                    strokeDashoffset="72"
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient
                      id="timerGrad"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="100%" stopColor="#f97316" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute text-center">
                  <p className="text-3xl font-black text-white tabular-nums">
                    47:23
                  </p>
                  <p className="text-red-400/70 text-xs font-medium">
                    remaining
                  </p>
                </div>
              </div>
              {/* Task list */}
              <div className="relative space-y-2">
                {[
                  { label: "Algebra — quadratics", done: true, time: "15m" },
                  { label: "Biology — Chapter 6", done: true, time: "15m" },
                  { label: "Essay introduction", done: false, time: "15m" },
                  { label: "History MCQ drill", done: false, time: "15m" },
                ].map((t, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs transition-colors ${t.done ? "bg-white/[0.03]" : i === 2 ? "bg-red-500/10 border border-red-500/20" : "bg-white/[0.02]"}`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center ${t.done ? "bg-emerald-500" : i === 2 ? "bg-red-500/20 border-2 border-red-400" : "border border-white/20"}`}
                    >
                      {t.done && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <span
                      className={
                        t.done
                          ? "text-white/30 line-through flex-1"
                          : "text-white/80 flex-1"
                      }
                    >
                      {t.label}
                    </span>
                    <span className="text-white/25 font-mono">{t.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2 — Vision Lens card (wide, spans 2 cols on lg) */}
            <div className="gsap-heading lg:col-span-2 group relative rounded-3xl overflow-hidden border border-violet-500/20 bg-gradient-to-br from-violet-950/60 via-slate-950/80 to-cyan-950/50 p-6 flex flex-col gap-5 hover:border-violet-500/40 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />
              <div className="relative flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white text-sm font-bold">Vision Lens</p>
                  <p className="text-violet-400/70 text-xs">
                    Analysing uploaded diagram…
                  </p>
                </div>
              </div>
              <div className="relative flex flex-col sm:flex-row gap-4">
                {/* Fake uploaded image */}
                <div className="relative flex-shrink-0 w-full sm:w-44 h-36 rounded-2xl overflow-hidden border border-violet-500/20 bg-violet-950/50 flex items-center justify-center">
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 30% 40%, #7c3aed 0%, transparent 60%), radial-gradient(circle at 70% 60%, #06b6d4 0%, transparent 60%)",
                    }}
                  ></div>
                  <div className="relative text-center p-3">
                    <div className="w-12 h-12 rounded-full border-2 border-violet-400/50 mx-auto mb-1 flex items-center justify-center">
                      <div className="w-5 h-5 rounded-full border-2 border-cyan-400/60" />
                    </div>
                    <div className="space-y-1">
                      {["Nucleus", "Mitochondria", "Cell Wall"].map(l => (
                        <div
                          key={l}
                          className="flex items-center gap-1 text-[10px] text-violet-300/70"
                        >
                          <span className="w-1 h-1 rounded-full bg-violet-400/60" />
                          {l}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 text-[10px] bg-violet-500/20 border border-violet-500/30 text-violet-300 px-1.5 py-0.5 rounded-full font-medium">
                    cell.jpg
                  </div>
                </div>
                {/* AI explanation */}
                <div className="flex-1 space-y-2.5">
                  <p className="text-xs text-violet-300/60 font-medium uppercase tracking-wider">
                    AI Explanation
                  </p>
                  <p className="text-white/85 text-sm leading-relaxed">
                    This is a{" "}
                    <span className="text-cyan-400 font-semibold">
                      plant cell
                    </span>
                    . The large green oval is the{" "}
                    <span className="text-violet-400 font-semibold">
                      nucleus
                    </span>{" "}
                    — it controls everything the cell does, like the cell's
                    brain.
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {["Nucleus", "Cell membrane", "Chloroplast", "Vacuole"].map(
                      kp => (
                        <span
                          key={kp}
                          className="text-[11px] px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 font-medium"
                        >
                          {kp}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 3 — Maths solver card */}
            <div className="gsap-heading group relative rounded-3xl overflow-hidden border border-orange-500/20 bg-gradient-to-br from-orange-950/60 via-amber-950/40 to-slate-950/80 p-6 flex flex-col gap-4 hover:border-orange-500/40 transition-all duration-300 hover:-translate-y-1">
              <div className="relative flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
                  <Calculator className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white text-sm font-bold">Maths Helper</p>
                  <p className="text-orange-400/70 text-xs">
                    Step-by-step solution
                  </p>
                </div>
              </div>
              {/* Terminal-style solver */}
              <div className="relative rounded-2xl bg-black/40 border border-white/5 p-4 font-mono text-xs space-y-2 overflow-hidden">
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                  <span className="ml-2 text-white/20 text-[10px]">
                    maths-helper.ai
                  </span>
                </div>
                <p className="text-orange-400/60">
                  {">"} Solve: x² - 5x + 6 = 0
                </p>
                <div className="space-y-1 text-white/70">
                  <p>
                    <span className="text-orange-400">Step 1</span> Find two
                    numbers that multiply to{" "}
                    <span className="text-amber-400">+6</span> and add to{" "}
                    <span className="text-amber-400">-5</span>
                  </p>
                  <p className="pl-4 text-white/50">
                    → Those numbers are{" "}
                    <span className="text-green-400">-2</span> and{" "}
                    <span className="text-green-400">-3</span>
                  </p>
                  <p>
                    <span className="text-orange-400">Step 2</span> Factor:{" "}
                    <span className="text-white">(x - 2)(x - 3) = 0</span>
                  </p>
                  <p>
                    <span className="text-orange-400">Step 3</span> So x ={" "}
                    <span className="text-emerald-400 font-bold">2</span> or x ={" "}
                    <span className="text-emerald-400 font-bold">3</span> ✓
                  </p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            </div>

            {/* 4 — Story Mode card */}
            <div className="gsap-heading group relative rounded-3xl overflow-hidden border border-pink-500/20 bg-gradient-to-br from-pink-950/60 via-rose-950/40 to-slate-950/80 p-6 flex flex-col gap-4 hover:border-pink-500/40 transition-all duration-300 hover:-translate-y-1">
              <div className="relative flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg shadow-pink-500/30">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white text-sm font-bold">Story Mode</p>
                  <p className="text-pink-400/70 text-xs">
                    Chapter 12 — French Revolution
                  </p>
                </div>
              </div>
              <div className="relative rounded-2xl bg-white/[0.04] border border-white/8 p-4 text-sm leading-relaxed text-white/75 italic">
                <span className="text-pink-400 not-italic font-bold">
                  🎬 Scene opens: Paris, 1789.
                </span>
                <span className="block mt-2">
                  The bread queues stretched for miles. Marie, a baker's
                  daughter, watched nobles ride past in golden carriages while
                  her family hadn't eaten in two days...
                </span>
                <span className="block mt-2 text-pink-300/60 not-italic text-xs">
                  → This is the Third Estate's frustration that sparked the
                  Revolution
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/40">
                <span className="flex items-center gap-1">
                  <span className="text-pink-400">●</span> Story
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-white/20">●</span> Concept
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-white/20">●</span> Quiz
                </span>
              </div>
            </div>

            {/* 5 — Stats row card (wide) */}
            <div className="gsap-heading lg:col-span-1 group relative rounded-3xl overflow-hidden border border-primary-500/20 bg-gradient-to-br from-indigo-950/80 via-slate-950/90 to-purple-950/60 p-6 flex flex-col justify-between gap-6 hover:border-primary-500/40 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-primary-500/10 blur-3xl pointer-events-none" />
              <div className="relative">
                <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-4">
                  Platform results
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      val: "96%",
                      label: "Score boost",
                      color: "text-emerald-400",
                    },
                    {
                      val: "14d",
                      label: "Avg streak",
                      color: "text-amber-400",
                    },
                    { val: "11+", label: "Modules", color: "text-primary-400" },
                  ].map(s => (
                    <div
                      key={s.label}
                      className="rounded-2xl bg-white/[0.04] border border-white/5 p-3 text-center"
                    >
                      <p
                        className={`text-2xl font-black ${s.color} tabular-nums`}
                      >
                        {s.val}
                      </p>
                      <p className="text-white/30 text-[11px] mt-0.5">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative flex flex-col gap-2">
                <p className="text-white/40 text-xs font-semibold uppercase tracking-widest">
                  Active now
                </p>
                <div className="flex items-center gap-2">
                  {["A", "R", "P", "K", "S"].map((l, i) => (
                    <div
                      key={i}
                      className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-[11px] font-bold text-white ring-2 ring-slate-950 -ml-1 first:ml-0"
                    >
                      {l}
                    </div>
                  ))}
                  <span className="text-xs text-white/40 ml-1">
                    +2.4k students online
                  </span>
                </div>
              </div>
              <Link
                href="/register"
                className="relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-indigo-600 text-white font-bold px-5 py-3 rounded-2xl text-sm hover:shadow-glow hover:scale-[1.02] transition-all duration-200 group/btn"
              >
                Start for free
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FEATURES ══════════════════════════════════════════ */}
      <section
        ref={featuresRef}
        id="features"
        className="relative py-32 overflow-hidden bg-slate-950 dark:bg-slate-950"
      >
        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
            backgroundSize: "200px 200px",
          }}
        />

        {/* Big ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full bg-primary-600/10 blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6">
          {/* ── Header ──────────────────────────────────────── */}
          <div className="gsap-heading text-center mb-20 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-400 text-xs font-bold uppercase tracking-widest mb-6">
              <Zap className="w-3 h-3" /> 11 AI Modules
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.0] tracking-tight mb-6">
              Pick your problem.
              <br />
              <span className="bg-gradient-to-r from-primary-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                We've built the fix.
              </span>
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
              11 laser-focused AI tools. Each one built around a single struggle
              every Indian school student actually faces.
            </p>
          </div>

          {/* ── Mosaic grid ─────────────────────────────────── */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {features.map((f, i) => {
              const tags = [
                "Deep Focus",
                "Class Help",
                "Visual AI",
                "Step Solver",
                "Daily Plan",
                "Storytelling",
                "Smart Recall",
                "Essay Coach",
                "Exam Prep",
                "1-on-1 AI",
                "Parent View",
              ];
              const sizes = [
                "col-span-2 row-span-2", // Power Hour — big
                "", // Understand Class
                "", // Vision Lens
                "", // Maths
                "", // Study Planner
                "col-span-2", // Story Mode — wide
                "", // Auto Revision
                "", // Writing Coach
                "", // Question Bank
                "", // AI Mentor
                "", // Parent
              ];
              return (
                <Link
                  href={f.href}
                  key={f.label}
                  className={`feat-card group relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/[0.07] bg-white/[0.03] hover:border-white/20 transition-all duration-500 cursor-pointer flex flex-col justify-between ${i === 0 ? "min-h-[240px] sm:min-h-[320px]" : "min-h-[120px] sm:min-h-[160px]"} p-3 sm:p-5 ${sizes[i]}`}
                  style={{ isolation: "isolate" }}
                >
                  {/* Gradient reveal on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                    style={{
                      background: `radial-gradient(ellipse at 30% 40%, var(--glow-color, rgba(99,102,241,0.18)) 0%, transparent 70%)`,
                    }}
                  />

                  {/* Big number watermark */}
                  <span
                    className="absolute -right-2 -bottom-3 text-[48px] sm:text-[80px] font-black leading-none select-none pointer-events-none tabular-nums"
                    style={{
                      color: "rgba(255,255,255,0.07)",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Power Hour — decorative timer fill for the top space */}
                  {i === 0 && (
                    <div className="flex absolute inset-x-3 sm:inset-x-5 top-3 sm:top-5 bottom-[72px] sm:bottom-[88px] flex-col gap-1.5 sm:gap-2.5 pointer-events-none">
                      <div className="flex items-center justify-between">
                        <div
                          className={`w-7 h-7 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-[-4deg] transition-all duration-300`}
                        >
                          <f.icon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                        </div>
                        <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-white/25 group-hover:text-white/50 transition-colors duration-300">
                          {tags[0]}
                        </span>
                      </div>
                      <div className="flex items-center justify-center py-0.5 sm:py-1">
                        <div className="relative">
                          <svg
                            className="w-12 h-12 sm:w-20 sm:h-20 -rotate-90 opacity-80"
                            viewBox="0 0 100 100"
                          >
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              stroke="rgba(239,68,68,0.12)"
                              strokeWidth="5"
                            />
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              stroke="url(#phGrad)"
                              strokeWidth="5"
                              strokeLinecap="round"
                              strokeDasharray="251.3"
                              strokeDashoffset="68"
                            />
                            <defs>
                              <linearGradient
                                id="phGrad"
                                x1="0%"
                                y1="0%"
                                x2="100%"
                                y2="0%"
                              >
                                <stop offset="0%" stopColor="#ef4444" />
                                <stop offset="100%" stopColor="#f97316" />
                              </linearGradient>
                            </defs>
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-[10px] sm:text-base font-black text-white tabular-nums">
                              47:23
                            </span>
                            <span className="text-[7px] sm:text-[9px] text-red-400/70 font-medium">
                              remaining
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-0.5 sm:space-y-1">
                        {[
                          { label: "Algebra — quadratics", done: true },
                          { label: "Biology — Ch. 6", done: true },
                          {
                            label: "Essay introduction",
                            done: false,
                            active: true,
                          },
                          { label: "History MCQ drill", done: false },
                        ].map((t, ti) => (
                          <div
                            key={ti}
                            className={`flex items-center gap-1 sm:gap-2 rounded-md sm:rounded-lg px-1.5 sm:px-2 py-0.5 sm:py-1 text-[9px] sm:text-[11px] ${t.active ? "bg-red-500/10 border border-red-500/20" : "bg-white/[0.03]"}`}
                          >
                            <div
                              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0 flex items-center justify-center ${t.done ? "bg-emerald-500" : t.active ? "border-2 border-red-400" : "border border-white/20"}`}
                            >
                              {t.done && (
                                <CheckCircle className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-white" />
                              )}
                            </div>
                            <span
                              className={
                                t.done
                                  ? "text-white/40 truncate"
                                  : "text-white/60 truncate"
                              }
                            >
                              {t.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Top: icon + tag — all cards except Power Hour */}
                  {i !== 0 && (
                    <div className="relative flex items-start justify-between gap-2">
                      <div
                        className={`w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-[-4deg] transition-all duration-300 shrink-0`}
                      >
                        <f.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-white/25 group-hover:text-white/50 transition-colors duration-300 text-right leading-tight">
                        {tags[i]}
                      </span>
                    </div>
                  )}

                  {/* Bottom: label + desc + arrow */}
                  {i === 0 ? (
                    <div className="absolute bottom-3 sm:bottom-5 left-3 sm:left-5 right-3 sm:right-5">
                      <h3 className="font-black text-white text-[11px] sm:text-sm mb-0.5 sm:mb-1 group-hover:text-white transition-colors">
                        {f.label}
                      </h3>
                      <p className="text-white/40 text-[9px] sm:text-xs leading-snug group-hover:text-white/60 transition-colors duration-300 line-clamp-2">
                        {f.desc}
                      </p>
                      <div className="flex items-center gap-1 mt-1.5 sm:mt-3 text-[9px] sm:text-xs font-semibold text-white/20 group-hover:text-primary-400 transition-all duration-300 -translate-x-1 group-hover:translate-x-0">
                        Open module{" "}
                        <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      </div>
                    </div>
                  ) : (
                    <div className="relative mt-2 sm:mt-4">
                      <h3 className="font-black text-white text-[11px] sm:text-sm mb-0.5 sm:mb-1 group-hover:text-white transition-colors">
                        {f.label}
                      </h3>
                      <p className="text-white/40 text-[9px] sm:text-xs leading-snug group-hover:text-white/60 transition-colors duration-300 line-clamp-2">
                        {f.desc}
                      </p>
                      <div className="flex items-center gap-1 mt-1.5 sm:mt-3 text-[9px] sm:text-xs font-semibold text-white/20 group-hover:text-primary-400 transition-all duration-300 -translate-x-1 group-hover:translate-x-0">
                        Open module{" "}
                        <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      </div>
                    </div>
                  )}

                  {/* Bottom edge gradient line */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r ${f.color} opacity-0 group-hover:opacity-80 transition-opacity duration-500`}
                  />
                </Link>
              );
            })}
          </div>

          {/* ── Bottom banner ───────────────────────────────── */}
          <div className="gsap-heading mt-10 relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-transparent to-violet-500/5 pointer-events-none" />
            <div className="relative">
              <p className="text-white font-black text-xl mb-1">
                All 11 modules. One account. Always free.
              </p>
              <p className="text-slate-400 text-sm">
                No credit card. No setup. Just pick a module and start.
              </p>
            </div>
            <Link
              href="/register"
              className="relative inline-flex items-center gap-2.5 bg-white text-slate-900 font-bold px-7 py-3.5 rounded-xl text-sm hover:bg-slate-100 transition-all duration-200 hover:scale-105 shrink-0 group"
            >
              <Zap className="w-4 h-4 text-primary-600" />
              Start learning free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══════════════════════════════════════ */}
      <section
        ref={testiRef}
        className="relative py-28 px-6 overflow-hidden bg-slate-950"
      >
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[140px] pointer-events-none" />

        <div className="relative max-w-2xl mx-auto">
          {/* Header */}
          <div className="gsap-heading text-center mb-14">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-5">
              ★ Student Reviews
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              What students are{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                saying
              </span>
            </h2>
            <p className="text-slate-400 mt-4 text-base">
              Real messages from real students across India.
            </p>
          </div>

          {/* Phone frame */}
          <div className="relative mx-auto max-w-sm">
            {/* Phone shell */}
            <div className="rounded-[2.5rem] border border-white/10 bg-[#0f0f12] shadow-2xl overflow-hidden">
              {/* Status bar */}
              <div className="flex items-center justify-between px-6 pt-4 pb-2">
                <span className="text-[11px] font-semibold text-white/40">
                  9:41
                </span>
                <div className="w-20 h-5 bg-black rounded-full" />
                <div className="flex gap-1 items-center">
                  <div className="w-3.5 h-2 rounded-sm border border-white/30 relative">
                    <div className="absolute inset-[2px] right-[3px] bg-white/40 rounded-[1px]" />
                  </div>
                </div>
              </div>
              {/* Chat header */}
              <div className="flex items-center gap-3 px-5 py-3 border-b border-white/[0.07]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-black">
                  AI
                </div>
                <div>
                  <p className="text-sm font-bold text-white leading-tight">
                    Zenith Reviews
                  </p>
                  <p className="text-[10px] text-emerald-400">
                    ● 12,000+ students active
                  </p>
                </div>
              </div>
              {/* Chat scroll area */}
              <div className="px-4 py-5 max-h-[480px] overflow-y-auto scrollbar-hide">
                <TestimonialChat testimonials={testimonials} />
              </div>

              {/* Input bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-t border-white/[0.07] bg-[#0f0f12]">
                <div className="flex-1 bg-white/[0.06] rounded-full px-4 py-2 text-[12px] text-white/25 border border-white/[0.08]">
                  Message…
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0">
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </div>
              </div>

              {/* Home indicator */}
              <div className="flex justify-center pb-2 pt-1">
                <div className="w-24 h-1 bg-white/20 rounded-full" />
              </div>
            </div>

            {/* Glow under phone */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-64 h-12 bg-indigo-600/30 blur-2xl rounded-full pointer-events-none" />
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══════════════════════════════════════ */}
      <section
        ref={stepsRef}
        id="how-it-works"
        className="relative py-24 overflow-hidden bg-[#06060a]"
      >
        {/* Dot grid bg */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(rgba(99,102,241,0.15) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage:
              "radial-gradient(ellipse 90% 90% at 50% 50%, black 30%, transparent 100%)",
          }}
        />

        <div className="max-w-7xl mx-auto relative px-4 sm:px-6">
          {/* Header */}
          <div className="gsap-heading text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-400 text-xs font-bold uppercase tracking-widest mb-5">
              <Zap className="w-3 h-3" /> How It Works
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
              From sign-up to{" "}
              <span className="bg-gradient-to-r from-primary-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                results
              </span>
            </h2>
            <p className="text-slate-400 text-lg max-w-lg mx-auto">
              Four steps. Your AI tutor builds itself around you —
              automatically.
            </p>
          </div>

          {/* ── Horizontal stepper — scrollable on mobile ── */}
          <div className="overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="min-w-[700px] sm:min-w-0">
              {/* ── Top connector row ── */}
              <div className="grid grid-cols-4 mb-8">
                {[
                  {
                    num: "01",
                    grad: "from-primary-500 to-violet-600",
                    shadow: "shadow-primary-500/40",
                    ring: "ring-primary-500/30",
                  },
                  {
                    num: "02",
                    grad: "from-violet-500 to-fuchsia-500",
                    shadow: "shadow-violet-500/40",
                    ring: "ring-violet-500/30",
                  },
                  {
                    num: "03",
                    grad: "from-cyan-500 to-blue-500",
                    shadow: "shadow-cyan-500/40",
                    ring: "ring-cyan-500/30",
                  },
                  {
                    num: "04",
                    grad: "from-emerald-500 to-teal-500",
                    shadow: "shadow-emerald-500/40",
                    ring: "ring-emerald-500/30",
                  },
                ].map((s, i) => (
                  <div key={s.num} className="flex items-center">
                    {/* Connector line before (hidden for first) */}
                    <div
                      className={`flex-1 h-px ${i === 0 ? "opacity-0" : ""} bg-gradient-to-r from-white/10 to-white/10`}
                    />
                    {/* Number bubble */}
                    <div className="relative shrink-0">
                      <div
                        className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.grad} flex items-center justify-center shadow-lg ${s.shadow} ring-4 ring-[#06060a] relative z-10`}
                      >
                        <span className="text-white font-black text-sm tabular-nums">
                          {s.num}
                        </span>
                      </div>
                      {/* Glow pulse */}
                      <div
                        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${s.grad} blur-xl opacity-30`}
                      />
                    </div>
                    {/* Connector line after (hidden for last) */}
                    <div
                      className={`flex-1 h-px ${i === 3 ? "opacity-0" : ""} bg-gradient-to-r from-white/10 to-white/10`}
                    />
                  </div>
                ))}
              </div>

              {/* ── Step cards row ── */}
              <div className="grid grid-cols-4 gap-3 sm:gap-4">
                {/* Step 01 — Profile */}
                <div className="group flex flex-col gap-0 rounded-2xl border border-white/[0.07] bg-white/[0.025] hover:border-primary-500/35 hover:bg-white/[0.04] transition-all duration-300 overflow-hidden">
                  <div className="h-[2px] bg-gradient-to-r from-primary-500 to-violet-600 opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                  {/* Text block */}
                  <div className="p-4 sm:p-5 flex flex-col gap-2 border-b border-white/[0.05]">
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary-400">
                      Step 01
                    </p>
                    <h3 className="text-sm sm:text-base font-black text-white leading-snug">
                      Create your profile
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">
                      Set your class, board &amp; subjects. The AI personalises
                      everything around you.
                    </p>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {["CBSE / ICSE", "Class 1–12"].map(t => (
                        <span
                          key={t}
                          className="text-[9px] text-white/30 bg-white/[0.04] border border-white/[0.07] px-2 py-0.5 rounded-md font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  {/* Mini mock */}
                  <div className="p-3 sm:p-4 bg-[#0a0a10] flex-1">
                    <div className="rounded-xl border border-white/[0.06] bg-[#0d0d15] overflow-hidden">
                      <div className="flex gap-1 px-3 py-2 border-b border-white/[0.05]">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500/50 mt-0.5" />
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/50 mt-0.5" />
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500/50 mt-0.5" />
                        <span className="ml-2 text-white/15 text-[9px] font-mono">
                          / setup
                        </span>
                      </div>
                      <div className="p-3 space-y-1.5">
                        <div className="grid grid-cols-2 gap-1">
                          {[
                            ["Name", "Aarav Sharma"],
                            ["Class", "Class 10"],
                            ["Board", "CBSE"],
                            ["City", "Mumbai"],
                          ].map(([l, v]) => (
                            <div
                              key={l}
                              className="rounded-lg bg-white/[0.04] border border-white/[0.05] px-2 py-1.5"
                            >
                              <p className="text-[8px] text-white/20">{l}</p>
                              <p className="text-[10px] font-semibold text-white/70">
                                {v}
                              </p>
                            </div>
                          ))}
                        </div>
                        <div className="rounded-lg bg-white/[0.03] border border-white/[0.05] px-2 py-1.5">
                          <p className="text-[8px] text-white/20 mb-1">
                            Subjects
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {["Maths", "Physics", "Chemistry"].map(s => (
                              <span
                                key={s}
                                className="text-[8px] px-1.5 py-0.5 rounded-full bg-primary-500/15 border border-primary-500/20 text-primary-300 font-medium"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="w-full py-1.5 rounded-lg bg-gradient-to-r from-primary-500 to-violet-600 text-white font-bold text-[9px] flex items-center justify-center gap-1">
                          <CheckCircle className="w-2.5 h-2.5" /> Save &amp;
                          continue
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 02 — Modules */}
                <div className="group flex flex-col gap-0 rounded-2xl border border-white/[0.07] bg-white/[0.025] hover:border-violet-500/35 hover:bg-white/[0.04] transition-all duration-300 overflow-hidden">
                  <div className="h-[2px] bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="p-4 sm:p-5 flex flex-col gap-2 border-b border-white/[0.05]">
                    <p className="text-[10px] font-black uppercase tracking-widest text-violet-400">
                      Step 02
                    </p>
                    <h3 className="text-sm sm:text-base font-black text-white leading-snug">
                      Pick a module
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">
                      11 AI tools, each laser-focused on one challenge. Open any
                      — the AI is ready.
                    </p>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {["11 modules", "Instant start"].map(t => (
                        <span
                          key={t}
                          className="text-[9px] text-white/30 bg-white/[0.04] border border-white/[0.07] px-2 py-0.5 rounded-md font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 sm:p-4 bg-[#0a0a10] flex-1">
                    <div className="rounded-xl border border-white/[0.06] bg-[#0d0d15] overflow-hidden">
                      <div className="flex gap-1 px-3 py-2 border-b border-white/[0.05]">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500/50 mt-0.5" />
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/50 mt-0.5" />
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500/50 mt-0.5" />
                        <span className="ml-2 text-white/15 text-[9px] font-mono">
                          / dashboard
                        </span>
                      </div>
                      <div className="p-3">
                        <p className="text-[8px] text-white/20 uppercase tracking-widest mb-2">
                          Your modules
                        </p>
                        <div className="grid grid-cols-2 gap-1">
                          {[
                            {
                              e: "🔥",
                              n: "Power Hour",
                              a: true,
                              c: "border-red-500/30 bg-red-500/10 text-white",
                            },
                            {
                              e: "🧠",
                              n: "Understand",
                              a: false,
                              c: "border-white/[0.05] bg-white/[0.02] text-white/40",
                            },
                            {
                              e: "📷",
                              n: "Vision Lens",
                              a: false,
                              c: "border-white/[0.05] bg-white/[0.02] text-white/40",
                            },
                            {
                              e: "🧮",
                              n: "Maths Helper",
                              a: false,
                              c: "border-white/[0.05] bg-white/[0.02] text-white/40",
                            },
                            {
                              e: "✍️",
                              n: "Writing Coach",
                              a: false,
                              c: "border-white/[0.05] bg-white/[0.02] text-white/40",
                            },
                            {
                              e: "🤖",
                              n: "AI Mentor",
                              a: false,
                              c: "border-violet-500/20 bg-violet-500/8 text-white/50",
                            },
                          ].map(m => (
                            <div
                              key={m.n}
                              className={`flex items-center gap-1.5 rounded-lg border px-2 py-1.5 text-[9px] ${m.c} ${m.a ? "ring-1 ring-red-500/25" : ""}`}
                            >
                              <span>{m.e}</span>
                              <span className="font-semibold truncate leading-tight">
                                {m.n}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 03 — AI Session */}
                <div className="group flex flex-col gap-0 rounded-2xl border border-white/[0.07] bg-white/[0.025] hover:border-cyan-500/35 hover:bg-white/[0.04] transition-all duration-300 overflow-hidden">
                  <div className="h-[2px] bg-gradient-to-r from-cyan-500 to-blue-500 opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="p-4 sm:p-5 flex flex-col gap-2 border-b border-white/[0.05]">
                    <p className="text-[10px] font-black uppercase tracking-widest text-cyan-400">
                      Step 03
                    </p>
                    <h3 className="text-sm sm:text-base font-black text-white leading-snug">
                      Study &amp; AI adapts
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">
                      Every session is tracked. Weak spots are flagged and your
                      plan is rebuilt automatically.
                    </p>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {["Weak topic AI", "Live updates"].map(t => (
                        <span
                          key={t}
                          className="text-[9px] text-white/30 bg-white/[0.04] border border-white/[0.07] px-2 py-0.5 rounded-md font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 sm:p-4 bg-[#0a0a10] flex-1">
                    <div className="rounded-xl border border-white/[0.06] bg-[#0d0d15] overflow-hidden">
                      <div className="flex gap-1 items-center px-3 py-2 border-b border-white/[0.05]">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/50" />
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
                        <span className="ml-2 text-white/15 text-[9px] font-mono">
                          / insights
                        </span>
                        <span className="ml-auto text-[8px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/15 px-1.5 py-0.5 rounded-full">
                          Updated
                        </span>
                      </div>
                      <div className="p-3 space-y-2">
                        <p className="text-[9px] text-white/50 italic leading-snug">
                          "Aarav is strong in Algebra. Needs work on Organic
                          Chem &amp; Grammar."
                          <span className="block text-cyan-400/60 not-italic mt-0.5">
                            — AI Mentor
                          </span>
                        </p>
                        <div className="space-y-1.5">
                          {[
                            {
                              s: "Algebra",
                              p: 84,
                              c: "from-emerald-500 to-green-400",
                            },
                            {
                              s: "Organic Chem",
                              p: 51,
                              c: "from-amber-500 to-orange-400",
                            },
                            {
                              s: "Grammar",
                              p: 35,
                              c: "from-red-500 to-rose-400",
                            },
                          ].map(bar => (
                            <div key={bar.s}>
                              <div className="flex justify-between text-[9px] mb-0.5">
                                <span className="text-white/35">{bar.s}</span>
                                <span className="text-white/20 tabular-nums">
                                  {bar.p}%
                                </span>
                              </div>
                              <div className="h-1 rounded-full bg-white/[0.06]">
                                <div
                                  className={`h-full rounded-full bg-gradient-to-r ${bar.c}`}
                                  style={{ width: `${bar.p}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                        <p className="text-[9px] text-cyan-400/70 flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                          2 topics added to Power Hour
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 04 — Streaks */}
                <div className="group flex flex-col gap-0 rounded-2xl border border-white/[0.07] bg-white/[0.025] hover:border-emerald-500/35 hover:bg-white/[0.04] transition-all duration-300 overflow-hidden">
                  <div className="h-[2px] bg-gradient-to-r from-emerald-500 to-teal-500 opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="p-4 sm:p-5 flex flex-col gap-2 border-b border-white/[0.05]">
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                      Step 04
                    </p>
                    <h3 className="text-sm sm:text-base font-black text-white leading-snug">
                      Build streaks &amp; grow
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">
                      Every session builds your streak. Leaderboards and parent
                      reports keep you consistent.
                    </p>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {["Daily streaks", "Leaderboard"].map(t => (
                        <span
                          key={t}
                          className="text-[9px] text-white/30 bg-white/[0.04] border border-white/[0.07] px-2 py-0.5 rounded-md font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 sm:p-4 bg-[#0a0a10] flex-1">
                    <div className="rounded-xl border border-white/[0.06] bg-[#0d0d15] overflow-hidden">
                      <div className="flex gap-1 px-3 py-2 border-b border-white/[0.05]">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500/50 mt-0.5" />
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/50 mt-0.5" />
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500/50 mt-0.5" />
                        <span className="ml-2 text-white/15 text-[9px] font-mono">
                          / streaks
                        </span>
                      </div>
                      <div className="p-3 space-y-2">
                        <div className="flex items-center gap-2 rounded-lg bg-orange-500/10 border border-orange-500/20 px-2.5 py-2">
                          <span className="text-base">🔥</span>
                          <div className="min-w-0">
                            <p className="text-white font-black text-xs leading-none">
                              14-day streak
                            </p>
                            <p className="text-orange-400/60 text-[9px] mt-0.5">
                              2 sessions today
                            </p>
                          </div>
                          <span className="ml-auto text-[9px] font-bold text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded-full border border-orange-500/20 shrink-0">
                            +50 XP
                          </span>
                        </div>
                        <div className="space-y-1">
                          {[
                            {
                              rank: "🥇",
                              name: "Aarav S.",
                              pts: "2,840 XP",
                              you: true,
                            },
                            {
                              rank: "🥈",
                              name: "Priya K.",
                              pts: "2,710 XP",
                              you: false,
                            },
                            {
                              rank: "🥉",
                              name: "Rohan M.",
                              pts: "2,650 XP",
                              you: false,
                            },
                          ].map(row => (
                            <div
                              key={row.name}
                              className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[9px] ${row.you ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-white/[0.02]"}`}
                            >
                              <span className="text-xs">{row.rank}</span>
                              <span
                                className={`font-semibold flex-1 ${row.you ? "text-white" : "text-white/35"}`}
                              >
                                {row.name}
                              </span>
                              {row.you && (
                                <span className="text-[8px] text-emerald-400 bg-emerald-500/15 px-1 py-0.5 rounded-full font-bold">
                                  You
                                </span>
                              )}
                              <span className="text-white/20 tabular-nums">
                                {row.pts}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Mobile scroll hint */}
              <p className="text-center text-[11px] text-white/20 mt-4 sm:hidden">
                ← swipe to see all steps →
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2.5 bg-gradient-to-r from-primary-500 to-violet-600 text-white font-bold px-8 py-4 rounded-2xl hover:scale-105 hover:shadow-glow transition-all duration-200 group/cta text-base"
            >
              Start your journey
              <ArrowRight className="w-4 h-4 group-hover/cta:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
            >
              Already have an account →
            </Link>
          </div>
        </div>
      </section>

      {/* ══ SUBJECTS ══════════════════════════════════════════ */}
      <section ref={subjectsRef} id="subjects" className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="card-glass text-center py-12 relative overflow-hidden border border-primary-500/20">
            <div className="glow-orb w-80 h-80 bg-primary-500 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20" />
            <div className="relative">
              <p className="gsap-heading text-sm font-semibold text-primary-400 mb-6 uppercase tracking-widest">
                Covers All Subjects
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                {subjects.map(sub => (
                  <span
                    key={sub}
                    className="subj-pill px-4 py-2 rounded-xl text-sm font-semibold bg-primary-500/10 border border-primary-500/25 text-primary-500 dark:text-primary-400 hover:bg-primary-500/20 hover:scale-105 transition-all duration-200 cursor-default"
                  >
                    {sub}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FOR PARENTS ════════════════════════════════════════ */}
      <section className="relative py-24 px-4 sm:px-6 overflow-hidden bg-gradient-to-br from-slate-50 via-teal-50/40 to-cyan-50/30 dark:from-[#07100f] dark:via-[#081412] dark:to-[#06060a]">
        {/* Soft ambient blobs */}
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-teal-400/10 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-cyan-400/10 blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative">
          {/* ── Header ── */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-teal-500/10 border border-teal-500/25 text-teal-600 dark:text-teal-400 mb-5">
              <Users className="w-3.5 h-3.5" /> For Parents
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-4 leading-tight">
              Always know how your child{" "}
              <span className="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                is really doing.
              </span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto">
              No report cards. No surprises. Just a clear, honest picture of
              your child's progress — updated after every session.
            </p>
          </div>

          {/* ── Main layout: phone left, features right ── */}
          <div className="grid lg:grid-cols-[420px_1fr] gap-10 lg:gap-16 items-center">
            {/* ── Left: Parent dashboard phone mock ── */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Glow behind phone */}
                <div className="absolute inset-0 bg-teal-400/20 blur-3xl rounded-full scale-75 pointer-events-none" />

                {/* Phone frame */}
                <div className="relative w-[280px] rounded-[2.2rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1412] shadow-2xl overflow-hidden">
                  {/* Status bar */}
                  <div className="flex items-center justify-between px-6 pt-4 pb-2 bg-white dark:bg-[#0d1412]">
                    <span className="text-[11px] font-semibold text-slate-400 dark:text-white/30">
                      9:41
                    </span>
                    <div className="w-16 h-4 bg-black rounded-full" />
                    <div className="w-3.5 h-2 rounded-sm border border-slate-300 dark:border-white/30 relative">
                      <div className="absolute inset-[2px] right-[3px] bg-slate-300 dark:bg-white/40 rounded-[1px]" />
                    </div>
                  </div>

                  {/* App header */}
                  <div className="px-5 pt-2 pb-4 bg-gradient-to-br from-teal-500 to-cyan-600">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-white/70 text-[10px] font-semibold uppercase tracking-widest">
                          Parent Dashboard
                        </p>
                        <p className="text-white font-black text-base leading-tight">
                          Priya's Progress
                        </p>
                      </div>
                      <div className="w-9 h-9 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-sm font-black text-white">
                        P
                      </div>
                    </div>
                    {/* Streak highlight */}
                    <div className="rounded-xl bg-white/15 border border-white/20 px-3 py-2 flex items-center gap-3">
                      <span className="text-xl">🔥</span>
                      <div>
                        <p className="text-white font-black text-sm leading-none">
                          12-day streak
                        </p>
                        <p className="text-white/60 text-[10px] mt-0.5">
                          Studied every day this week
                        </p>
                      </div>
                      <span className="ml-auto text-[10px] font-bold text-teal-100 bg-white/10 px-2 py-0.5 rounded-full border border-white/20">
                        ON TRACK
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="px-4 py-4 space-y-3 bg-slate-50 dark:bg-[#0d1412]">
                    {/* This week */}
                    <div className="rounded-xl border border-slate-200 dark:border-white/[0.07] bg-white dark:bg-white/[0.03] p-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/25 mb-2">
                        This week
                      </p>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        {[
                          {
                            val: "4",
                            label: "Sessions",
                            color: "text-teal-600 dark:text-teal-400",
                          },
                          {
                            val: "35m",
                            label: "Avg time",
                            color: "text-cyan-600 dark:text-cyan-400",
                          },
                          {
                            val: "92%",
                            label: "Score avg",
                            color: "text-emerald-600 dark:text-emerald-400",
                          },
                        ].map(s => (
                          <div
                            key={s.label}
                            className="rounded-lg bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.05] py-2"
                          >
                            <p className={`font-black text-sm ${s.color}`}>
                              {s.val}
                            </p>
                            <p className="text-[9px] text-slate-400 dark:text-white/25 mt-0.5">
                              {s.label}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Subject progress */}
                    <div className="rounded-xl border border-slate-200 dark:border-white/[0.07] bg-white dark:bg-white/[0.03] p-3 space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/25 mb-1">
                        Subject strengths
                      </p>
                      {[
                        {
                          s: "Chemistry",
                          p: 88,
                          c: "from-teal-500 to-emerald-400",
                        },
                        {
                          s: "Algebra",
                          p: 56,
                          c: "from-amber-400 to-orange-400",
                        },
                        { s: "History", p: 72, c: "from-cyan-500 to-blue-400" },
                      ].map(bar => (
                        <div key={bar.s}>
                          <div className="flex justify-between text-[10px] mb-0.5">
                            <span className="text-slate-500 dark:text-white/40 font-medium">
                              {bar.s}
                            </span>
                            <span className="text-slate-400 dark:text-white/25 tabular-nums">
                              {bar.p}%
                            </span>
                          </div>
                          <div className="h-1.5 rounded-full bg-slate-100 dark:bg-white/[0.06]">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${bar.c}`}
                              style={{ width: `${bar.p}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* AI note */}
                    <div className="rounded-xl border border-teal-200 dark:border-teal-500/20 bg-teal-50 dark:bg-teal-500/5 p-3">
                      <p className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest mb-1">
                        AI Summary
                      </p>
                      <p className="text-[11px] text-slate-600 dark:text-white/50 leading-relaxed italic">
                        "Priya is excelling in Chemistry but needs more practice
                        on Algebra. 3 sessions this week — great consistency."
                      </p>
                    </div>
                  </div>

                  {/* Home bar */}
                  <div className="flex justify-center py-2 bg-slate-50 dark:bg-[#0d1412]">
                    <div className="w-20 h-1 bg-slate-200 dark:bg-white/20 rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right: Feature list ── */}
            <div className="flex flex-col gap-5">
              {[
                {
                  emoji: "🔥",
                  title: "See if your child actually studied",
                  desc: "A daily streak tells you more than any report card. 12 days in a row means 12 days of real effort — not last-minute cramming.",
                  tag: "Streak tracking",
                  tagColor:
                    "text-orange-600 dark:text-orange-400 bg-orange-500/10 border-orange-400/20",
                  border: "hover:border-orange-400/30",
                },
                {
                  emoji: "📊",
                  title: "Weekly report, in plain language",
                  desc: '"Priya studied 4 sessions this week, averaging 35 min each. Strong in Chemistry. Needs work on Algebra." — Written by AI, automatically.',
                  tag: "Auto-generated",
                  tagColor:
                    "text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-400/20",
                  border: "hover:border-cyan-400/30",
                },
                {
                  emoji: "🎯",
                  title: "Know exactly where they're struggling",
                  desc: 'No more vague "study harder" conversations. The AI surfaces the exact topics your child needs help with, so you can actually support them.',
                  tag: "Weak topic AI",
                  tagColor:
                    "text-violet-600 dark:text-violet-400 bg-violet-500/10 border-violet-400/20",
                  border: "hover:border-violet-400/30",
                },
                {
                  emoji: "🔒",
                  title: "Your own account — no password sharing",
                  desc: "Link directly to your child's profile with read-only access. You see everything, they keep their privacy, nothing gets changed.",
                  tag: "Privacy-first",
                  tagColor:
                    "text-teal-600 dark:text-teal-400 bg-teal-500/10 border-teal-400/20",
                  border: "hover:border-teal-400/30",
                },
              ].map((item, i) => (
                <div
                  key={item.title}
                  className={`group flex items-start gap-4 p-5 rounded-2xl border border-slate-200 dark:border-white/[0.07] bg-white dark:bg-white/[0.02] ${item.border} hover:shadow-sm transition-all duration-300 hover:-translate-y-0.5`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-100 dark:border-white/[0.07] flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform duration-300">
                    {item.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-black text-sm text-slate-900 dark:text-white leading-snug">
                        {item.title}
                      </h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.tagColor} shrink-0`}
                      >
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}

              {/* CTA */}
              <div className="flex items-center gap-4 mt-2 flex-wrap">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2.5 text-white font-bold px-6 py-3.5 rounded-2xl text-sm hover:scale-105 hover:shadow-lg transition-all duration-200 group/cta"
                  style={{
                    background: "linear-gradient(135deg, #14b8a6, #06b6d4)",
                  }}
                >
                  Create parent account
                  <ArrowRight className="w-4 h-4 group-hover/cta:translate-x-1 transition-transform" />
                </Link>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Takes 2 minutes · No credit card
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CTA ═══════════════════════════════════════════════ */}
      <section ref={ctaSectionRef} className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="cta-box relative rounded-3xl overflow-hidden p-12 text-center bg-gradient-to-br from-[#312e81] via-[#1e1b4b] to-[#0f0d2a]">
            <div className="glow-orb w-64 h-64 bg-primary-500 left-1/4 -top-20 opacity-40" />
            <div className="glow-orb w-48 h-48 bg-accent-purple right-1/4 -bottom-10 opacity-30" />
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-6 animate-bounce-gentle">
                <Zap className="w-8 h-8 text-primary-300" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Start Studying Smarter
              </h2>
              <p className="text-indigo-300 text-lg mb-8 max-w-xl mx-auto">
                Join students from CBSE, ICSE, and State boards already using AI
                to study smarter and achieve more.
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 bg-white text-indigo-900 font-bold px-8 py-3.5 rounded-2xl hover:bg-indigo-50 transition-all hover:scale-105 hover:shadow-glow group"
                >
                  Get Started{" "}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-indigo-300 hover:text-white font-semibold transition-colors px-4 py-3.5"
                >
                  Already have an account →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ════════════════════════════════════════════ */}
      <footer className="border-t border-slate-200 dark:border-dark-700 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-slate-700 dark:text-slate-300">
              Zen<span className="gradient-text">ith</span>
            </span>
          </div>
          <p className="text-sm text-slate-400">
            AI Learning Companion · Built for every student
          </p>
          <div className="flex gap-6 text-sm text-slate-400">
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
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
