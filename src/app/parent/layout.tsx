"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import ParentSidebar from "@/components/parent/ParentSidebar";
import { Loader2 } from "lucide-react";

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const storedUser =
      typeof window !== "undefined" ? localStorage.getItem("user") : null;

    console.log("[Parent Layout] Token exists:", !!token);
    console.log("[Parent Layout] Stored user:", storedUser);

    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        console.log(
          "[Parent Layout] User role from localStorage:",
          userData.role,
        );
        if (userData.role !== "parent") {
          console.log(
            "[Parent Layout] User is not a parent! Redirecting to:",
            userData.role === "student" ? "/dashboard" : "/",
          );
          // Not a parent, redirect to appropriate dashboard
          router.push(userData.role === "student" ? "/dashboard" : "/");
        } else {
          console.log(
            "[Parent Layout] User is a parent ✅ - staying on parent page",
          );
        }
      } catch (e) {
        console.error("[Parent Layout] Error parsing user:", e);
        router.push("/login");
      }
    } else if (!token) {
      console.log("[Parent Layout] No token found - redirecting to login");
      router.push("/login?loginRequired=true");
    }

    setHydrated(true);
    setIsLoading(false);
  }, [router]);

  if (!hydrated || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-dark-950">
      <ParentSidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
