import React, { createContext, useContext, useState, ReactNode } from "react";

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target?: string; // CSS selector for highlighting
  position?: "top" | "bottom" | "left" | "right" | "center";
  action?: "click" | "scroll" | "wait";
  actionTarget?: string;
  highlightPadding?: number;
}

export interface PageTutorial {
  pageId: string;
  pageName: string;
  steps: TutorialStep[];
  autoStart?: boolean; // Start tutorial for first-time users
}

interface TutorialContextType {
  activeTutorial: PageTutorial | null;
  currentStepIndex: number;
  isOpen: boolean;
  completedTutorials: Set<string>;

  // Methods
  startTutorial: (tutorial: PageTutorial) => void;
  nextStep: () => void;
  previousStep: () => void;
  endTutorial: () => void;
  skipTutorial: () => void;
  markTutorialAsCompleted: (pageId: string) => void;
  isTutorialCompleted: (pageId: string) => boolean;
}

const TutorialContext = createContext<TutorialContextType | undefined>(
  undefined,
);

export function TutorialProvider({ children }: { children: ReactNode }) {
  const [activeTutorial, setActiveTutorial] = useState<PageTutorial | null>(
    null,
  );
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [completedTutorials, setCompletedTutorials] = useState<Set<string>>(
    new Set(),
  );

  const startTutorial = (tutorial: PageTutorial) => {
    setActiveTutorial(tutorial);
    setCurrentStepIndex(0);
    setIsOpen(true);
  };

  const nextStep = () => {
    if (activeTutorial && currentStepIndex < activeTutorial.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      endTutorial();
      if (activeTutorial) {
        markTutorialAsCompleted(activeTutorial.pageId);
      }
    }
  };

  const previousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const endTutorial = () => {
    setIsOpen(false);
    setActiveTutorial(null);
    setCurrentStepIndex(0);
  };

  const skipTutorial = () => {
    if (activeTutorial) {
      markTutorialAsCompleted(activeTutorial.pageId);
    }
    endTutorial();
  };

  const markTutorialAsCompleted = (pageId: string) => {
    setCompletedTutorials(prev => {
      const updated = new Set(prev);
      updated.add(pageId);
      return updated;
    });
    // Optional: Save to localStorage for persistence
    if (typeof window !== "undefined") {
      const key = `tutorial_completed_${pageId}`;
      localStorage.setItem(key, "true");
    }
  };

  const isTutorialCompleted = (pageId: string): boolean => {
    // Check in-memory first
    if (completedTutorials.has(pageId)) return true;

    // Check localStorage
    if (typeof window !== "undefined") {
      const key = `tutorial_completed_${pageId}`;
      return localStorage.getItem(key) === "true";
    }
    return false;
  };

  const value: TutorialContextType = {
    activeTutorial,
    currentStepIndex,
    isOpen,
    completedTutorials,
    startTutorial,
    nextStep,
    previousStep,
    endTutorial,
    skipTutorial,
    markTutorialAsCompleted,
    isTutorialCompleted,
  };

  return (
    <TutorialContext.Provider value={value}>
      {children}
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error("useTutorial must be used within TutorialProvider");
  }
  return context;
}
