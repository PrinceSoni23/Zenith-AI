"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useRef, useCallback } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { mentorApi } from "@/lib/api";
import { cacheService } from "@/lib/cacheService";
import toast from "react-hot-toast";
import { useTranslation } from "@/hooks/useTranslation";
import {
  MessageSquare,
  Loader2,
  Flame,
  Target,
  Quote,
  Heart,
  Star,
  RefreshCw,
  Send,
  Sparkles,
  Bot,
  User,
  BookOpen,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MentorMessage {
  greeting: string;
  todayMessage: string;
  feedback: string;
  encouragement: string;
  actionSuggestion: string;
  moodCheck: string;
  streakMessage: string;
  weeklyInsight: string;
  motivationalQuote: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  id: string;
}

const MOOD_OPTIONS = [
  "😊 Great",
  "😐 Okay",
  "😕 Struggling",
  "😴 Tired",
  "🤩 Excited",
];

const STARTER_PROMPTS = [
  "I'm feeling really stressed about my exams 😟",
  "Can you help me understand photosynthesis?",
  "I don't know how to manage my time for studies",
  "I'm struggling with maths, any tips?",
  "How do I stay motivated when I feel like giving up?",
  "Help me make a study plan for this week",
];

// ─── Chat Bubble ──────────────────────────────────────────────────────────────

function ChatBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";
  return (
    <div
      className={`flex items-end gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser
            ? "bg-gradient-to-br from-blue-500 to-indigo-600"
            : "bg-gradient-to-br from-orange-500 to-amber-500"
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-br-sm"
            : "bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700 text-slate-800 dark:text-slate-200 rounded-bl-sm shadow-sm"
        }`}
      >
        {msg.content}
      </div>
    </div>
  );
}

// ─── Typing indicator ─────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div className="flex items-end gap-2.5">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center flex-shrink-0">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1">
          <span
            className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MentorPage() {
  const { t, language } = useTranslation();
  const [tab, setTab] = useState<"brief" | "chat">("brief");

  // ── Daily Brief state ────────────────────────────────────────────────────
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [mentorData, setMentorData] = useState<MentorMessage | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodSaved, setMoodSaved] = useState(false);

  // ── Chat state ───────────────────────────────────────────────────────────
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hey! 👋 I'm your AI Mentor. I'm here for you — whether you need help understanding a topic, want to talk through some stress, or just need a study buddy. What's on your mind today?",
      id: "welcome",
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // ── Fetch daily brief ────────────────────────────────────────────────────
  const fetchMentorMessage = async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    try {
      const cacheKey = "mentor-daily-message";
      const cachePayload = { language };

      // Check cache if not refreshing
      if (!isRefresh) {
        const cached = cacheService.get<any>(cacheKey, cachePayload);
        if (cached) {
          setMentorData(cached.data);
          setLoading(false);
          return;
        }
      }

      // Fetch fresh data
      const res = await mentorApi.getMessage(language);

      // Store in cache
      cacheService.set<any>(
        cacheKey,
        cachePayload,
        { data: res.data.data },
        86400, // 24 hour TTL
      );

      setMentorData(res.data.data);
    } catch {
      toast.error(t("mentor.load_error"));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMentorMessage();
  }, []);

  // Scroll chat to bottom when messages change
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, streamingId]);

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    setMoodSaved(true);
    toast.success(t("mentor.mood_recorded"));
  };

  // ── Send chat message ────────────────────────────────────────────────────
  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isSending) return;

      const userMsg: ChatMessage = {
        role: "user",
        content: trimmed,
        id: Date.now().toString(),
      };
      const assistantId = `ai-${Date.now()}`;

      setChatMessages(prev => [...prev, userMsg]);
      setInput("");
      setIsSending(true);
      setStreamingId(assistantId);

      // Build history to send (exclude the welcome message id)
      const history = [...chatMessages, userMsg]
        .filter(m => m.id !== "welcome")
        .map(({ role, content }) => ({ role, content }));

      // Add empty assistant bubble for streaming
      setChatMessages(prev => [
        ...prev,
        { role: "assistant", content: "", id: assistantId },
      ]);

      try {
        const response = await mentorApi.chat(history, language);
        if (!response.ok) throw new Error("Chat request failed");

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        if (!reader) throw new Error("No response stream");

        let buffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const raw = line.slice(6).trim();
            if (raw === "[DONE]") break;
            try {
              const { delta } = JSON.parse(raw) as { delta: string };
              setChatMessages(prev =>
                prev.map(m =>
                  m.id === assistantId
                    ? { ...m, content: m.content + delta }
                    : m,
                ),
              );
            } catch {}
          }
        }
      } catch {
        setChatMessages(prev =>
          prev.map(m =>
            m.id === assistantId
              ? {
                  ...m,
                  content:
                    "Sorry, I couldn't connect right now. Please try again in a moment 🙏",
                }
              : m,
          ),
        );
        toast.error(t("mentor.connection_error"));
      } finally {
        setIsSending(false);
        setStreamingId(null);
        inputRef.current?.focus();
      }
    },
    [chatMessages, isSending],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // ── Loading screen ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex h-screen bg-slate-50 dark:bg-dark-950">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary-500 mx-auto mb-3" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t("mentor.preparing")}
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-dark-950">
      <Sidebar />
      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-8 max-w-3xl mx-auto">
            {/* ── Header ── */}
            <div className="mb-6 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/25">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
                    {t("mentor.title")}
                  </h1>
                  <p className="text-sm mt-0.5 text-slate-500 dark:text-slate-400">
                    {t("mentor.subtitle")}
                  </p>
                </div>
              </div>
              {tab === "brief" && (
                <button
                  onClick={() => fetchMentorMessage(true)}
                  disabled={refreshing}
                  className="flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 mt-2"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                  />
                  {t("mentor.refresh")}
                </button>
              )}
            </div>

            {/* ── Tabs ── */}
            <div className="flex gap-1 p-1 rounded-2xl bg-slate-200 dark:bg-dark-800 mb-6">
              <button
                onClick={() => setTab("brief")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                  tab === "brief"
                    ? "bg-white dark:bg-dark-900 text-slate-900 dark:text-slate-100 shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                {t("mentor.daily_brief")}
              </button>
              <button
                onClick={() => {
                  setTab("chat");
                  setTimeout(() => inputRef.current?.focus(), 100);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                  tab === "chat"
                    ? "bg-white dark:bg-dark-900 text-slate-900 dark:text-slate-100 shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                {t("mentor.chat")}
                {chatMessages.length > 1 && (
                  <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-black flex items-center justify-center">
                    {chatMessages.filter(m => m.role === "user").length}
                  </span>
                )}
              </button>
            </div>

            {/* ── Daily Brief Tab ── */}
            {tab === "brief" && mentorData && (
              <div className="space-y-5 animate-fade-in">
                <div className="rounded-2xl p-6 bg-gradient-to-br from-primary-600 to-primary-800">
                  <p className="text-primary-200 text-sm font-medium mb-1">
                    {mentorData.greeting}
                  </p>
                  <p className="text-white text-lg font-medium leading-relaxed">
                    {mentorData.todayMessage}
                  </p>
                </div>

                {mentorData.streakMessage && (
                  <div className="rounded-2xl p-5 flex items-center gap-3 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20">
                    <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-500/20">
                      <Flame className="w-5 h-5 text-orange-500" />
                    </div>
                    <p className="font-medium text-sm text-slate-800 dark:text-slate-200">
                      {mentorData.streakMessage}
                    </p>
                  </div>
                )}

                <div className="rounded-2xl p-5 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 hover-lift border-glow">
                  <div className="flex items-center gap-2 mb-4">
                    <Heart className="w-5 h-5 text-pink-500" />
                    <h3 className="font-bold text-slate-900 dark:text-slate-100">
                      {t("mentor.how_feeling")}
                    </h3>
                  </div>
                  {mentorData.moodCheck && (
                    <p className="text-sm mb-4 text-slate-500 dark:text-slate-400">
                      {mentorData.moodCheck}
                    </p>
                  )}
                  <div className="flex gap-2 flex-wrap">
                    {MOOD_OPTIONS.map(mood => (
                      <button
                        key={mood}
                        onClick={() => handleMoodSelect(mood)}
                        disabled={moodSaved}
                        className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                          selectedMood === mood
                            ? "bg-primary-50 dark:bg-primary-500/20 border-primary-400 dark:border-primary-500/50 text-primary-700 dark:text-primary-300 scale-105"
                            : "bg-white dark:bg-dark-800 border-slate-200 dark:border-dark-700 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {mood}
                      </button>
                    ))}
                  </div>
                  {moodSaved && selectedMood && (
                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                        ✓{" "}
                        {t("mentor.felt_dialog", {
                          mood:
                            selectedMood.split(" ")[1] ||
                            selectedMood.split(" ")[0],
                        })}
                      </p>
                      <button
                        onClick={() => {
                          setTab("chat");
                          setTimeout(() => {
                            sendMessage(`I'm feeling ${selectedMood} today`);
                          }, 200);
                        }}
                        className="text-xs text-orange-600 dark:text-orange-400 font-bold hover:underline flex items-center gap-1"
                      >
                        <MessageSquare className="w-3 h-3" />{" "}
                        {t("mentor.talk_about")}
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {mentorData.feedback && (
                    <div className="rounded-2xl p-5 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 hover-lift border-glow">
                      <div className="flex items-center gap-2 mb-3">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <h3 className="font-bold text-slate-900 dark:text-slate-100">
                          {t("mentor.recent_feedback")}
                        </h3>
                      </div>
                      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                        {mentorData.feedback}
                      </p>
                    </div>
                  )}
                  {mentorData.actionSuggestion && (
                    <div className="rounded-2xl p-5 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 hover-lift border-glow">
                      <div className="flex items-center gap-2 mb-3">
                        <Target className="w-5 h-5 text-blue-500" />
                        <h3 className="font-bold text-slate-900 dark:text-slate-100">
                          {t("mentor.today_action")}
                        </h3>
                      </div>
                      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                        {mentorData.actionSuggestion}
                      </p>
                    </div>
                  )}
                </div>

                {mentorData.encouragement && (
                  <div className="rounded-2xl p-5 bg-green-50 dark:bg-green-500/10 border-2 border-green-300 dark:border-green-500/30">
                    <p className="text-green-700 dark:text-green-400 font-semibold leading-relaxed">
                      {mentorData.encouragement}
                    </p>
                  </div>
                )}

                {mentorData.weeklyInsight && (
                  <div className="rounded-2xl p-5 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 hover-lift border-glow">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-5 h-5 text-violet-500" />
                      <h3 className="font-bold text-slate-900 dark:text-slate-100">
                        Weekly Insight
                      </h3>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {mentorData.weeklyInsight}
                    </p>
                  </div>
                )}

                {mentorData.motivationalQuote && (
                  <div className="rounded-2xl p-6 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20">
                    <div className="flex items-start gap-3">
                      <Quote className="w-6 h-6 text-purple-500 flex-shrink-0 mt-1" />
                      <p className="italic text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                        {mentorData.motivationalQuote}
                      </p>
                    </div>
                  </div>
                )}

                {/* CTA to chat */}
                <button
                  onClick={() => setTab("chat")}
                  className="w-full rounded-2xl p-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/25"
                >
                  <MessageSquare className="w-5 h-5" />
                  {t("mentor.chat_cta")}
                </button>
              </div>
            )}

            {/* ── Chat Tab ── */}
            {tab === "chat" && (
              <div className="flex flex-col h-[calc(100vh-280px)] min-h-[500px]">
                {/* Messages area */}
                <div className="flex-1 overflow-y-auto rounded-2xl bg-slate-100 dark:bg-dark-800 p-4 space-y-4 mb-3">
                  {chatMessages.map(msg => (
                    <ChatBubble key={msg.id} msg={msg} />
                  ))}
                  {isSending &&
                    !chatMessages.find(
                      m => m.id === streamingId && m.content,
                    ) && <TypingDots />}
                  <div ref={chatBottomRef} />
                </div>

                {/* Starter prompts — only show when only welcome message exists */}
                {chatMessages.length === 1 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {STARTER_PROMPTS.map(p => (
                      <button
                        key={p}
                        onClick={() => sendMessage(p)}
                        disabled={isSending}
                        className="px-3 py-1.5 rounded-xl bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 text-xs text-slate-600 dark:text-slate-300 font-medium hover:border-orange-400 dark:hover:border-orange-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input */}
                <div className="flex items-end gap-2">
                  <div className="flex-1 relative">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={isSending}
                      placeholder={t("mentor.type_message")}
                      rows={1}
                      style={{ resize: "none" }}
                      className="w-full rounded-2xl px-4 py-3 pr-12 text-sm bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 focus:outline-none focus:border-orange-400 dark:focus:border-orange-500 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
                      onInput={e => {
                        const t = e.currentTarget;
                        t.style.height = "auto";
                        t.style.height = `${Math.min(t.scrollHeight, 120)}px`;
                      }}
                    />
                  </div>
                  <button
                    onClick={() => sendMessage(input)}
                    disabled={!input.trim() || isSending}
                    className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/25 hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                  >
                    {isSending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-center text-[10px] text-slate-400 dark:text-slate-600 mt-2">
                  {t("mentor.session_memory")}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
