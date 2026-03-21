"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon, Menu, X, Zap } from "lucide-react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Subjects", href: "#subjects" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const onScroll = () => {
      const currentScrollY = window.scrollY;

      // Show navbar when at the top
      if (currentScrollY < 20) {
        setNavVisible(true);
        setScrolled(false);
      } else {
        // Scrolling down - hide navbar
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setNavVisible(false);
        }
        // Scrolling up - show navbar
        else if (currentScrollY < lastScrollY) {
          setNavVisible(true);
        }

        // Add background when scrolled
        setScrolled(currentScrollY > 20);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScrollY]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          navVisible ? "translate-y-0" : "-translate-y-full"
        } ${
          scrolled
            ? "bg-white/40 dark:bg-dark-900/40 backdrop-blur-2xl border-b border-white/20 dark:border-white/5 shadow-lg shadow-black/5"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center shadow-glow-sm group-hover:shadow-glow transition-all duration-300">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-lg tracking-tight text-gray-900 dark:text-white">
              Zen<span className="gradient-text">iith</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link, i) => {
              const isPage = link.href.startsWith("/");
              const cls =
                "px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-all duration-150 animate-fade-up";
              return isPage ? (
                <Link
                  key={link.label}
                  href={link.href}
                  style={{ animationDelay: `${i * 60}ms` }}
                  className={cls}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  style={{ animationDelay: `${i * 60}ms` }}
                  className={cls}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Dark Mode Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-all duration-200"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="w-4.5 h-4.5 w-[18px] h-[18px]" />
                ) : (
                  <Moon className="w-[18px] h-[18px]" />
                )}
              </button>
            )}

            <div className="hidden md:flex items-center gap-2">
              <Link href="/login" className="btn-ghost text-sm">
                Sign In
              </Link>
              <Link href="/register" className="btn-primary text-sm px-5 py-2">
                Get Started →
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-all"
            >
              {menuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/20 dark:border-white/5 bg-white/40 dark:bg-dark-900/40 backdrop-blur-2xl animate-slide-down">
            <div className="px-6 py-4 space-y-1">
              {navLinks.map((link, i) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  style={{ animationDelay: `${i * 60}ms` }}
                  className="block px-4 py-3 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-all animate-slide-right"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-3 border-t border-gray-100 dark:border-white/5 flex flex-col gap-2">
                <Link
                  href="/login"
                  className="btn-secondary text-sm text-center"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="btn-primary text-sm text-center"
                >
                  Get Started →
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}
