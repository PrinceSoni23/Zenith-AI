import { useEffect } from "react";
import { useTutorial, PageTutorial } from "@/context/TutorialContext";

/**
 * Hook to auto-start tutorial for first-time users on a page
 * @param tutorial - The tutorial configuration for this page
 * @param autoStart - Whether to automatically show tutorial on first visit
 */
export function usePageTutorial(
  tutorial: PageTutorial,
  autoStart: boolean = false,
) {
  const { startTutorial, isTutorialCompleted } = useTutorial();

  useEffect(() => {
    if (autoStart && !isTutorialCompleted(tutorial.pageId)) {
      // Optionally auto-start, or just make tutorial available
      // Uncomment below to auto-start on first visit:
      // startTutorial(tutorial);
    }
  }, [tutorial, autoStart, startTutorial, isTutorialCompleted]);

  return { startTutorial, isTutorialCompleted };
}
