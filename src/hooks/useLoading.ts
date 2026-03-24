"use client";

import { useContext } from "react";
import { LoaderContext } from "@/context/LoaderContext";

export function useLoading() {
  const context = useContext(LoaderContext);

  if (!context) {
    throw new Error("useLoading must be used within LoaderProvider");
  }

  return context;
}
