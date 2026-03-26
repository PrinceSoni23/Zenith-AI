"use client";

import React from "react";
import { LoaderProvider } from "@/context/LoaderContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { PageTransitionLoader } from "@/components/PageTransitionLoader";
import { GlobalClickInterceptor } from "@/components/GlobalClickInterceptor";

export function RootLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <LoaderProvider>
        <GlobalClickInterceptor />
        <PageTransitionLoader />
        {children}
      </LoaderProvider>
    </LanguageProvider>
  );
}
