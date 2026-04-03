"use client";

import React from "react";
import { HelpCircle, X } from "lucide-react";
import { useTutorial, PageTutorial } from "@/context/TutorialContext";

interface HelpButtonProps {
  tutorial: PageTutorial;
  className?: string;
}

export function HelpButton({ tutorial, className = "" }: HelpButtonProps) {
  const { startTutorial, isTutorialCompleted } = useTutorial();

  // Determine icon appearance based on completion status
  const isCompleted = isTutorialCompleted(tutorial.pageId);

  const handleClick = () => {
    startTutorial(tutorial);
  };

  return (
    <button
      onClick={handleClick}
      title={`Learn about ${tutorial.pageName}`}
      className={`
        relative
        p-2.5
        rounded-full
        transition-all
        duration-200
        hover:scale-110
        active:scale-95
        ${
          isCompleted
            ? "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 ring-2 ring-blue-300 dark:ring-blue-700 animate-pulse"
        }
        ${className}
      `}
      aria-label="Help and tutorial"
    >
      <HelpCircle className="w-5 h-5" />

      {/* Badge indicator for new tutorials */}
      {!isCompleted && (
        <span className="absolute top-0 right-0 w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse"></span>
      )}
    </button>
  );
}
