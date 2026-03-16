"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";

// Prevent static generation for dashboard pages
export const dynamic = "force-dynamic";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
