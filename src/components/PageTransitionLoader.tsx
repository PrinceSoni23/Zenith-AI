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

  // Handle route changes - hide loader when page is ready
  useEffect(() => {
    const currentPath = pathname + searchParams.toString();

    // Clear any existing timeout
    if (loaderTimeoutRef.current) {
      clearTimeout(loaderTimeoutRef.current);
      loaderTimeoutRef.current = null;
    }

    // Only hide loader if route actually changed
    if (previousPathRef.current && previousPathRef.current !== currentPath) {
      // Route changed, hide loader after smooth delay
      loaderTimeoutRef.current = setTimeout(() => {
        hideLoader();
        loaderTimeoutRef.current = null;
      }, 300);
    } else if (isLoading && previousPathRef.current) {
      // Same route clicked - hide loader after timeout to prevent infinite loader
      loaderTimeoutRef.current = setTimeout(() => {
        hideLoader();
        loaderTimeoutRef.current = null;
      }, 1500);
    }

    previousPathRef.current = currentPath;

    return () => {
      if (loaderTimeoutRef.current) {
        clearTimeout(loaderTimeoutRef.current);
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
