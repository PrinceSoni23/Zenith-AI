"use client";

import React from "react";
import { LoaderProvider } from "@/context/LoaderContext";
import { PageTransitionLoader } from "@/components/PageTransitionLoader";
import { GlobalClickInterceptor } from "@/components/GlobalClickInterceptor";

export function RootLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <LoaderProvider>
      <GlobalClickInterceptor />
      <PageTransitionLoader />
      {children}
    </LoaderProvider>
  );
}
