"use client";

import React, { useEffect, useState, useRef } from "react";
import { ChevronRight, ChevronLeft, X, Check, Sparkles } from "lucide-react";
import { useTutorial } from "@/context/TutorialContext";
import confetti from "canvas-confetti";

interface ElementPosition {
  top: number;
  left: number;
  width: number;
  height: number;
}

export function TutorialOverlay() {
  const {
    activeTutorial,
    currentStepIndex,
    isOpen,
    nextStep,
    previousStep,
    endTutorial,
    skipTutorial,
  } = useTutorial();

  const [elementPosition, setElementPosition] =
    useState<ElementPosition | null>(null);
  const [viewportSize, setViewportSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });
  const [showCompletion, setShowCompletion] = useState(false);

  // Direct refs for real-time DOM updates (not relying on React state batching)
  const highlightBoxRef = useRef<HTMLDivElement>(null);

  const currentStep = activeTutorial?.steps[currentStepIndex];

  // Keep ref in sync with current step
  const currentStepRef = useRef(currentStep);

  const isLastStep =
    activeTutorial && currentStepIndex === activeTutorial.steps.length - 1;
  const isFirstStep = currentStepIndex === 0;

  // Keep ref in sync with current step
  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);

  useEffect(() => {
    if (!currentStep?.target) {
      setElementPosition(null);
      if (highlightBoxRef.current) {
        highlightBoxRef.current.style.display = "none";
      }
      return;
    }

    let animationFrameId: number | null = null;

    const updateHighlightPosition = () => {
      try {
        if (!currentStepRef.current?.target) {
          if (highlightBoxRef.current) {
            highlightBoxRef.current.style.display = "none";
          }
          return;
        }

        const element = document.querySelector(currentStepRef.current.target);
        if (!element || !highlightBoxRef.current) {
          if (highlightBoxRef.current) {
            highlightBoxRef.current.style.display = "none";
          }
          return;
        }

        const rect = element.getBoundingClientRect();
        const padding = currentStepRef.current.highlightPadding || 8;

        // Calculate desired position
        let top = rect.top - padding;
        let left = rect.left - padding;
        let width = rect.width + padding * 2;
        let height = rect.height + padding * 2;

        // Check if element is visible in viewport
        const elementBottomEdge = rect.top + rect.height;
        const elementRightEdge = rect.left + rect.width;

        const isPartiallyVisible =
          elementBottomEdge > 0 &&
          rect.top < window.innerHeight &&
          elementRightEdge > 0 &&
          rect.left < window.innerWidth;

        if (!isPartiallyVisible) {
          highlightBoxRef.current.style.display = "none";
          return;
        }

        // Clamp vertical position and height
        const minMargin = 5; // Safety margin from edges

        if (top < minMargin) {
          // Going off top - shift down
          top = minMargin;
        }

        if (top + height > window.innerHeight - minMargin) {
          // Going off bottom - check if we need to reduce height
          const maxAvailableHeight = window.innerHeight - top - minMargin;
          if (maxAvailableHeight > 0) {
            height = maxAvailableHeight;
          } else {
            // Can't fit - shift up
            top = Math.max(minMargin, window.innerHeight - height - minMargin);
          }
        }

        // Clamp horizontal position and width
        if (left < minMargin) {
          // Going off left - shift right
          left = minMargin;
        }

        if (left + width > window.innerWidth - minMargin) {
          // Going off right - check if we need to reduce width
          const maxAvailableWidth = window.innerWidth - left - minMargin;
          if (maxAvailableWidth > 0) {
            width = maxAvailableWidth;
          } else {
            // Can't fit - shift left
            left = Math.max(minMargin, window.innerWidth - width - minMargin);
          }
        }

        // Ensure minimum dimensions
        height = Math.max(height, 20);
        width = Math.max(width, 20);

        // Directly update DOM for real-time responsiveness
        highlightBoxRef.current.style.display = "block";
        highlightBoxRef.current.style.top = `${top}px`;
        highlightBoxRef.current.style.left = `${left}px`;
        highlightBoxRef.current.style.width = `${width}px`;
        highlightBoxRef.current.style.height = `${height}px`;

        // Also update state for tooltip positioning
        setElementPosition({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });
      } catch (error) {
        console.error("Error updating tutorial highlight:", error);
      }
    };

    // Continuous RAF loop for real-time tracking
    const continuousUpdate = () => {
      updateHighlightPosition();
      animationFrameId = requestAnimationFrame(continuousUpdate);
    };

    // Start continuous updates
    animationFrameId = requestAnimationFrame(continuousUpdate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [currentStep?.target]);

  const handleNextStep = () => {
    if (isLastStep) {
      // Trigger completion animation
      setShowCompletion(true);

      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      // After animation, close tutorial
      setTimeout(() => {
        endTutorial();
        setShowCompletion(false);
      }, 2000);
    } else {
      nextStep();
    }
  };

  if (!isOpen || !activeTutorial || !currentStep) return null;

  const padding = currentStep.highlightPadding || 8;
  const position = currentStep.position || "bottom";

  // Calculate tooltip position with smart viewport clamping
  const getTooltipPosition = (): React.CSSProperties => {
    if (!elementPosition) {
      // Center on screen if no target element
      return {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 10001,
        maxWidth: "280px",
        maxHeight: "300px",
      };
    }

    const tooltipMargin = 12;
    const tooltipWidth = 280; // Smaller compact size
    const tooltipMaxHeight = 300; // Reduced height for compact design
    const padding = currentStep.highlightPadding || 8;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const safeZone = 20; // safety margin from edges

    let top = 0;
    let left = 0;
    let transform = "";
    let needsHorizontalClamp = false;
    let needsVerticalClamp = false;

    switch (position) {
      case "bottom":
        top =
          elementPosition.top +
          elementPosition.height +
          padding +
          tooltipMargin;
        left = elementPosition.left + elementPosition.width / 2;
        transform = "translateX(-50%)";
        break;
      case "top":
        top = elementPosition.top - padding - tooltipMargin - tooltipMaxHeight;
        left = elementPosition.left + elementPosition.width / 2;
        transform = "translateX(-50%)";
        break;
      case "left":
        top = elementPosition.top + elementPosition.height / 2;
        left = elementPosition.left - padding - tooltipMargin - tooltipWidth;
        transform = "translateY(-50%)";
        break;
      case "right":
        top = elementPosition.top + elementPosition.height / 2;
        left =
          elementPosition.left +
          elementPosition.width +
          padding +
          tooltipMargin;
        transform = "translateY(-50%)";
        break;
      default:
        // center positioning
        top = elementPosition.top + elementPosition.height / 2;
        left = elementPosition.left + elementPosition.width / 2;
        transform = "translate(-50%, -50%)";
    }

    // Horizontal clamping: Keep tooltip within viewport with safety margin
    const leftBound = left - tooltipWidth / 2;
    const rightBound = left + tooltipWidth / 2;

    if (leftBound < safeZone) {
      left = safeZone + tooltipWidth / 2;
      needsHorizontalClamp = true;
    } else if (rightBound > viewportWidth - safeZone) {
      left = viewportWidth - safeZone - tooltipWidth / 2;
      needsHorizontalClamp = true;
    }

    // Vertical clamping: Keep tooltip within viewport with safety margin
    const topBound = top;
    const bottomBound = top + tooltipMaxHeight;

    if (topBound < safeZone) {
      top = safeZone;
      needsVerticalClamp = true;
    } else if (bottomBound > viewportHeight - safeZone) {
      top = Math.max(safeZone, viewportHeight - tooltipMaxHeight - safeZone);
      needsVerticalClamp = true;
    }

    // Remove transform if we had to clamp (to avoid double-offsetting)
    if (needsHorizontalClamp && transform.includes("translateX")) {
      transform = transform.replace("translateX(-50%)", "");
    }
    if (needsVerticalClamp && transform.includes("translateY")) {
      transform = transform.replace("translateY(-50%)", "");
    }

    return {
      position: "fixed",
      top,
      left,
      transform: transform || undefined,
      zIndex: 10001,
      maxWidth: `${Math.min(280, viewportWidth - safeZone * 2)}px`,
      maxHeight: `${Math.min(tooltipMaxHeight, viewportHeight - safeZone * 2)}px`,
    };
  };

  if (showCompletion) {
    return (
      <>
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999]" />
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10001,
            width: "90%",
            maxWidth: "400px",
          }}
        >
          <div
            className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl shadow-2xl border border-green-200 dark:border-green-800/50"
            style={{
              padding: "2rem",
            }}
          >
            {/* Success Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50">
                <Check className="w-10 h-10 text-white" />
              </div>
            </div>

            {/* Text Content */}
            <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3 text-center">
              Tutorial Complete!
            </h2>
            <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 mb-8 text-center leading-relaxed">
              You've learned all about{" "}
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {activeTutorial.pageName}
              </span>
              . Excellent work! 🎉
            </p>

            {/* Achievement Badge */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/40 border border-green-300 dark:border-green-700">
                <Sparkles className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                  Achievement Unlocked
                </span>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={endTutorial}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-base rounded-xl hover:shadow-lg hover:shadow-green-500/50 transition-all duration-200 active:scale-95 transform hover:scale-105"
            >
              Continue Exploring
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Blur Overlays - Everything except highlighted element is blurred */}
      {elementPosition && currentStep?.target && (
        <>
          {/* Top Blur */}
          <div
            className="fixed left-0 right-0 z-[9998] pointer-events-auto"
            style={{
              top: 0,
              height: Math.max(0, elementPosition.top - 8),
              backdropFilter: "blur(6px)",
              backgroundColor: "rgba(0, 0, 0, 0.3)",
            }}
          />

          {/* Bottom Blur */}
          <div
            className="fixed left-0 right-0 z-[9998] pointer-events-auto"
            style={{
              top: elementPosition.top + elementPosition.height + 8,
              bottom: 0,
              backdropFilter: "blur(6px)",
              backgroundColor: "rgba(0, 0, 0, 0.3)",
            }}
          />

          {/* Left Blur */}
          <div
            className="fixed top-0 bottom-0 z-[9998] pointer-events-auto"
            style={{
              left: 0,
              width: Math.max(0, elementPosition.left - 8),
              backdropFilter: "blur(6px)",
              backgroundColor: "rgba(0, 0, 0, 0.3)",
            }}
          />

          {/* Right Blur */}
          <div
            className="fixed top-0 bottom-0 z-[9998] pointer-events-auto"
            style={{
              left: elementPosition.left + elementPosition.width + 8,
              right: 0,
              backdropFilter: "blur(6px)",
              backgroundColor: "rgba(0, 0, 0, 0.3)",
            }}
          />
        </>
      )}

      {/* Subtle vignette effect when no target - No blur, no overlay to freeze background */}
      {!elementPosition && (
        <div
          className="fixed inset-0 pointer-events-none z-[9999]"
          style={{
            background:
              "radial-gradient(circle at center, transparent 30%, rgba(0, 0, 0, 0.1) 100%)",
          }}
        />
      )}

      {/* Highlight element with glow effect - Direct DOM ref for real-time updates */}
      <div
        ref={highlightBoxRef}
        className="fixed z-[10000] rounded-lg border-2 border-blue-500 shadow-lg shadow-blue-500/50 pointer-events-none"
        style={{
          display: "none",
          boxShadow:
            "0 0 20px 4px rgba(59, 130, 246, 0.6), inset 0 0 20px 2px rgba(59, 130, 246, 0.1)",
          transition: "none", // No transition for fluid real-time movement
        }}
      />

      {/* Tooltip - Tutorial Card, compact design, no scrolling needed */}
      <div
        className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 rounded-xl shadow-2xl border-2 border-blue-300 dark:border-blue-600 z-[10001] animate-in fade-in zoom-in-95 flex flex-col hover:shadow-3xl hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 backdrop-blur-sm"
        style={{
          ...getTooltipPosition(),
          maxHeight: "auto",
          overflow: "visible",
          maxWidth: "340px",
        }}
      >
        {/* Header with step indicator and close button - Compact */}
        <div className="flex items-center justify-between px-3 pt-3 pb-1.5 flex-shrink-0 gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold flex items-center justify-center animate-pulse shadow-lg flex-shrink-0">
              {currentStepIndex + 1}
            </div>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-300 whitespace-nowrap">
              Step {currentStepIndex + 1}/{activeTutorial.steps.length}
            </span>
          </div>
          <button
            onClick={endTutorial}
            className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-full text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-all duration-200 transform hover:scale-110 flex-shrink-0"
          >
            <X className="w-3 h-3" />
          </button>
        </div>

        {/* Content area - Compact and concise */}
        <div className="px-3 py-2">
          {/* Title - Full content */}
          <h3 className="text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-1 break-words">
            {currentStep.title}
          </h3>
          {/* Description - Full content */}
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-snug break-words">
            {currentStep.description}
          </p>
        </div>

        {/* Progress bar - Slim */}
        <div className="mx-3 mb-2 h-1 bg-slate-200 dark:bg-slate-700 overflow-hidden rounded-full">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 transition-all duration-500 rounded-full shadow-lg shadow-blue-500/50"
            style={{
              width: `${((currentStepIndex + 1) / activeTutorial.steps.length) * 100}%`,
            }}
          />
        </div>

        {/* Action buttons - Compact layout */}
        <div className="flex gap-1.5 items-center justify-between px-3 pb-3 pt-1 flex-shrink-0">
          <button
            onClick={skipTutorial}
            className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-200 hover:underline"
          >
            Skip
          </button>

          <div className="flex gap-1">
            <button
              onClick={previousStep}
              disabled={isFirstStep}
              className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transform hover:scale-110 active:scale-95"
              title="Previous step"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleNextStep}
              className={`flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-200 transform hover:scale-110 active:scale-95 ${
                isLastStep
                  ? "bg-gradient-to-r from-green-400 to-green-600 text-white hover:shadow-lg hover:shadow-green-500/50"
                  : "bg-gradient-to-r from-blue-400 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/50"
              }`}
              title={isLastStep ? "Complete tutorial" : "Next step"}
            >
              {isLastStep ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
