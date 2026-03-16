"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Inner component that uses useSearchParams - wrapped in Suspense
function ProtectedRouteContent({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading, initializeFromStorage } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate auth state from localStorage on mount
  useEffect(() => {
    setMounted(true);
    initializeFromStorage();
    setHydrated(true);
  }, [initializeFromStorage]);

  useEffect(() => {
    if (!hydrated || isLoading) return;

    if (!isAuthenticated) {
      // Store the redirect URL to return after login
      const redirectUrl = `${pathname}${searchParams.toString() ? "?" + searchParams.toString() : ""}`;
      sessionStorage.setItem("redirectAfterLogin", redirectUrl);

      // Redirect to login with a flag in the URL
      router.push("/login?loginRequired=true");
    }
  }, [isAuthenticated, isLoading, hydrated, pathname, searchParams, router]);

  if (!mounted || isLoading || !hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      }
    >
      <ProtectedRouteContent>{children}</ProtectedRouteContent>
    </Suspense>
  );
}
