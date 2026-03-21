import { Suspense } from "react";

// Prevent static generation for this page
export const dynamic = "force-dynamic";

import { RegisterContent } from "../register-content";

export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterLoadingFallback />}>
      <RegisterContent />
    </Suspense>
  );
}

function RegisterLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-dark-950">
      <div className="relative w-full max-w-lg">
        <div className="rounded-2xl p-8 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 animate-pulse">
          <div className="h-8 bg-slate-200 dark:bg-dark-700 rounded-lg mb-6" />
          <div className="space-y-4">
            <div className="h-12 bg-slate-200 dark:bg-dark-700 rounded-lg" />
            <div className="h-12 bg-slate-200 dark:bg-dark-700 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
