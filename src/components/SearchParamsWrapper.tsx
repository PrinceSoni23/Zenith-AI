"use client";

import { Suspense, ReactNode } from "react";

interface SearchParamsWrapperProps {
  children: ReactNode;
}

export function SearchParamsWrapper({ children }: SearchParamsWrapperProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
