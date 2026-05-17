"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { useMemo } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const convex = useMemo(
    () => (convexUrl ? new ConvexReactClient(convexUrl) : null),
    [convexUrl],
  );

  if (!convexUrl || !convex) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
        <div className="max-w-md rounded-lg border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
          <p className="text-sm font-semibold text-on-surface">
            Convex is not configured
          </p>
          <p className="mt-2 text-sm leading-6 text-on-surface-variant">
            Run Convex locally and make sure `NEXT_PUBLIC_CONVEX_URL` is set in
            `.env.local`.
          </p>
        </div>
      </main>
    );
  }

  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
