"use client";

import React, { useEffect } from "react";
import { useLoading } from "@/hooks/useLoading";

/**
 * Global click interceptor that shows loader immediately on:
 * - Link clicks (navigation)
 * - Button clicks (navigation)
 * - Any navigation action
 */
export function GlobalClickInterceptor() {
  const { showLoader } = useLoading();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Find the closest link element
      const link = target.closest("a");

      if (link) {
        const href = link.getAttribute("href");

        // Only intercept internal navigation
        if (
          href &&
          !href.startsWith("http") &&
          !href.startsWith("mailto") &&
          !href.startsWith("tel")
        ) {
          // Check if it's not a hash-only link
          if (!href.startsWith("#")) {
            showLoader();
          }
        }
        return;
      }

      // Check for button elements that might trigger navigation
      const button = target.closest("button");
      if (button) {
        // Check if button has data-href attribute (custom navigation)
        const dataHref = button.getAttribute("data-href");
        if (dataHref) {
          showLoader();
        }
      }
    };

    // Add listener to document
    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [showLoader]);

  return null;
}
