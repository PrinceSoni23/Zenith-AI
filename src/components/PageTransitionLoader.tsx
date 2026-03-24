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

  // Handle route changes - hide loader when page is ready
  useEffect(() => {
    const currentPath = pathname + searchParams.toString();

    // Only hide loader if route actually changed
    if (previousPathRef.current && previousPathRef.current !== currentPath) {
      // Route changed, hide loader after smooth delay
      setTimeout(() => {
        hideLoader();
      }, 300);
    }

    previousPathRef.current = currentPath;
  }, [pathname, searchParams, hideLoader]);

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
