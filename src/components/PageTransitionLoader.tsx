"use client";

import React, { Suspense, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useLoading } from "@/hooks/useLoading";
import { Loader } from "@/components/GlobalLoader";

function PageTransitionLoaderContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isLoading, hideLoader } = useLoading();
  const previousPathRef = useRef<string>("");
  const loaderTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initialTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle route changes - hide loader when page is ready
  useEffect(() => {
    const currentPath = pathname + searchParams.toString();

    // Always clean up previous timeouts
    if (loaderTimeoutRef.current) {
      clearTimeout(loaderTimeoutRef.current);
      loaderTimeoutRef.current = null;
    }
    if (initialTimeoutRef.current) {
      clearTimeout(initialTimeoutRef.current);
      initialTimeoutRef.current = null;
    }

    if (!isLoading) {
      previousPathRef.current = currentPath;
      return;
    }

    // Loader is on
    if (!previousPathRef.current) {
      // Haven't set previousPath yet - first effect run (loader just turned on)
      previousPathRef.current = currentPath;
      // Set initial timeout for same-link clicks
      initialTimeoutRef.current = setTimeout(() => {
        hideLoader();
        initialTimeoutRef.current = null;
      }, 1500);
      return;
    }

    // Check if route changed
    if (previousPathRef.current !== currentPath) {
      // Route changed! Clear the initial timeout and set shorter one for navigation
      if (initialTimeoutRef.current) {
        clearTimeout(initialTimeoutRef.current);
        initialTimeoutRef.current = null;
      }
      loaderTimeoutRef.current = setTimeout(() => {
        hideLoader();
      }, 300);
    }

    previousPathRef.current = currentPath;

    return () => {
      if (loaderTimeoutRef.current) {
        clearTimeout(loaderTimeoutRef.current);
      }
      if (initialTimeoutRef.current) {
        clearTimeout(initialTimeoutRef.current);
      }
    };
  }, [pathname, searchParams, hideLoader, isLoading]);

  if (!isLoading) return null;

  return <Loader message="Navigating..." />;
}

export function PageTransitionLoader() {
  return (
    <Suspense fallback={null}>
      <PageTransitionLoaderContent />
    </Suspense>
  );
}
