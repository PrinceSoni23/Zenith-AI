"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      <select
        value={language}
        onChange={e =>
          setLanguage(e.target.value as "english" | "hinglish" | "hindi")
        }
        className="px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="english">🇬🇧 English</option>
        <option value="hinglish">🇮🇳 Hinglish</option>
        <option value="hindi">हिंदी</option>
      </select>
    </div>
  );
}
