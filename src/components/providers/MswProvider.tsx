"use client";

import { type ReactNode, useEffect, useState } from "react";

function shouldEnableMsw(): boolean {
  if (process.env.NODE_ENV !== "development") {
    return false;
  }
  return process.env.NEXT_PUBLIC_USE_MSW === "true";
}

export function MswProvider({ children }: { children: ReactNode }) {
  const useMsw = shouldEnableMsw();
  const [ready, setReady] = useState(!useMsw);

  useEffect(() => {
    if (!useMsw) {
      return;
    }

    async function enableMocking() {
      const { getWorker } = await import("@/mocks/browser");
      const worker = await getWorker();
      if (worker) {
        try {
          await worker.start({
            quiet: true,
          });
        } catch (err) {
          if (
            !(err instanceof Error) ||
            !err.message.includes("already replaced")
          ) {
            throw err;
          }
        }
      }
      setReady(true);
    }

    void enableMocking();
  }, [useMsw]);

  if (!ready) {
    return null;
  }

  return <>{children}</>;
}
