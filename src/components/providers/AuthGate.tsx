"use client";

import { type ReactNode, useEffect, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { isPlayerAuthRequired, loginPath } from "@/lib/auth";
import { useSessionStore } from "@/stores/session";

function subscribeHydration(onStoreChange: () => void) {
  return useSessionStore.persist.onFinishHydration(onStoreChange);
}

export function AuthGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useSessionStore((s) => s.isAuthenticated);
  const hydrated = useSyncExternalStore(
    subscribeHydration,
    () => useSessionStore.persist.hasHydrated(),
    () => false,
  );
  const needsAuth = isPlayerAuthRequired(pathname);

  useEffect(() => {
    if (!hydrated) return;
    if (needsAuth && !isAuthenticated) {
      router.replace(loginPath(pathname));
    }
  }, [hydrated, isAuthenticated, needsAuth, pathname, router]);

  if (!hydrated || (needsAuth && !isAuthenticated)) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm font-medium text-slate-500">
        …
      </div>
    );
  }

  return <>{children}</>;
}
