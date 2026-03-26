"use client";

export const dynamic = "force-dynamic";

import { useState, useRef } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { agentApi } from "@/lib/api";
import toast from "react-hot-toast";
import { useTranslation } from "@/hooks/useTranslation";
import {
  Camera,
  Loader2,
  Sparkles,
  Upload,
  MessageSquare,
  X,
  ImageIcon,
  Send,
  Lightbulb,
  BookOpen,
  AlertCircle,
} from "lucide-react";

const QUICK_PROMPT_KEYS = [
  "vision_lens.explain",
  "vision_lens.related_topic",
  "vision_lens.summarize",
  "vision_lens.questions",
  "vision_lens.memorise",
];

interface VisionResult {
  explanation: string;
  keyPoints?: string[];
  relatedTopics?: string[];
  studyTip?: string;
}

export default function VisionLensPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<VisionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error(t("vision_lens.error_upload_image"));
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = e => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
    setResult(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleAsk = async () => {
    if (!imageFile) return toast.error(t("vision_lens.error_upload_image_first"));
    if (!question.trim()) return toast.error(t("common.enter_question"));

    setLoading(true);
    try {
      const base64 = imagePreview?.split(",")[1] ?? "";
      const mimeType = imageFile.type;

      const res = await agentApi.dispatch("vision-lens", {
        imageBase64: base64,
        mimeType,
        question: question.trim(),
      });

      setResult(res.data.data as VisionResult);
      toast.success(t("vision_lens.success_analysed"));
    } catch {
      toast.error(t("vision_lens.error_analyse"));
    } finally {
      setLoading(false);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-dark-950">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8 max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center gap-4 animate-fade-up stagger-1">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center animate-bounce-gentle">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
                {t("sidebar.vision_lens")}
              </h1>
              <p className="text-sm mt-0.5 text-slate-500 dark:text-slate-400">
                {t("vision_lens.subtitle")}
              </p>
            </div>
          </div>

          {/* Upload area */}
          <div className="rounded-2xl p-6 mb-6 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 animate-fade-up stagger-2">
            {!imagePreview ? (
              <div
                ref={dropRef}
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-4 py-12 border-2 border-dashed border-slate-300 dark:border-dark-600 rounded-xl cursor-pointer hover:border-violet-400 dark:hover:border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-500/5 transition-all duration-200"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-100 to-cyan-100 dark:from-violet-500/20 dark:to-cyan-500/20 flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-violet-500" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-slate-700 dark:text-slate-300">
                    {t("vision_lens.drop_image")}{" "}
                    <span className="text-violet-600 dark:text-violet-400 underline underline-offset-2">
                      {t("common.browse")}
                    </span>
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    {t("vision_lens.supported")}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Upload className="w-3.5 h-3.5" /> {t("vision_lens.click_drag")}
                </div>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Uploaded"
                  className="w-full max-h-72 object-contain rounded-xl border border-slate-200 dark:border-dark-700 bg-slate-50 dark:bg-dark-800"
                />
                <button
                  onClick={clearImage}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-slate-900/60 hover:bg-red-500 text-white flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <p className="mt-2 text-xs text-center text-slate-400 dark:text-slate-500">
                  {imageFile?.name}
                </p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
          </div>

          {/* Quick prompts */}
          <div className="mb-4 animate-fade-up stagger-3">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
              {t("vision_lens.quick_questions")}
            </p>
            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPT_KEYS.map(key => (
                <button
                  key={key}
                  onClick={() => setQuestion(t(key))}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 ${
                    question === t(key)
                      ? "bg-violet-600 text-white border-violet-600"
                      : "bg-white dark:bg-dark-900 border-slate-200 dark:border-dark-700 text-slate-600 dark:text-slate-400 hover:border-violet-400 hover:text-violet-600 dark:hover:text-violet-400"
                  }`}
                >
                  {t(key)}
                </button>
              ))}
            </div>
          </div>

          {/* Question input */}
          <div className="rounded-2xl p-6 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 animate-fade-up stagger-4">
            <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
              <MessageSquare className="w-4 h-4 inline mr-1.5 text-violet-500" />
              {t("vision_lens.your_question")}
            </label>
            <div className="flex gap-3">
              <input
                className="input-field flex-1"
                placeholder={t("vision_lens.question_placeholder")}
                value={question}
                onChange={e => setQuestion(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleAsk()}
              />
              <button
                onClick={handleAsk}
                disabled={loading || !imageFile}
                className="btn-primary flex items-center gap-2 px-5 shrink-0"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {loading ? t("common.analysing") : t("common.ask")}
              </button>
            </div>
          </div>

          {/* Result */}
          {result && (
            <div className="mt-6 space-y-4 animate-fade-in">
              {result.explanation && (
                <div className="rounded-2xl p-6 bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-violet-500" />
                    <h3 className="font-bold text-violet-700 dark:text-violet-300">
                      {t("vision_lens.ai_explanation")}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                    {result.explanation}
                  </p>
                </div>
              )}

              {result.keyPoints && result.keyPoints.length > 0 && (
                <div className="rounded-2xl p-6 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-5 h-5 text-cyan-500" />
                    <h3 className="font-bold text-slate-900 dark:text-slate-100">
                      {t("vision_lens.key_points")}
                    </h3>
                  </div>
                  <ul className="space-y-1.5">
                    {result.keyPoints.map((point, i) => (
                      <li
                        key={i}
                        className="text-sm text-slate-700 dark:text-slate-300 flex gap-2"
                      >
                        <span className="text-cyan-500 mt-0.5">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.relatedTopics && result.relatedTopics.length > 0 && (
                <div className="rounded-2xl p-6 bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-5 h-5 text-cyan-500" />
                    <h3 className="font-bold text-cyan-700 dark:text-cyan-300">
                      {t("vision_lens.related_topics")}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.relatedTopics.map((t, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {result.studyTip && (
                <div className="rounded-2xl p-6 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                    <h3 className="font-bold text-amber-700 dark:text-amber-300">
                      {t("vision_lens.study_tip")}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {result.studyTip}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
