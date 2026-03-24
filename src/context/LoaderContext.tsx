"use client";

import React, { createContext, useState, useCallback } from "react";

interface LoaderContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  showLoader: () => void;
  hideLoader: () => void;
  message?: string;
  setMessage: (message: string | undefined) => void;
}

export const LoaderContext = createContext<LoaderContextType | undefined>(
  undefined,
);

export function LoaderProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | undefined>();

  const showLoader = useCallback(() => {
    setIsLoading(true);
  }, []);

  const hideLoader = useCallback(() => {
    setIsLoading(false);
    setMessage(undefined);
  }, []);

  const value: LoaderContextType = {
    isLoading,
    setIsLoading,
    showLoader,
    hideLoader,
    message,
    setMessage,
  };

  return (
    <LoaderContext.Provider value={value}>{children}</LoaderContext.Provider>
  );
}
