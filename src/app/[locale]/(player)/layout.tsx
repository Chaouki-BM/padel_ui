import { type ReactNode } from "react";
import { AuthGate } from "@/components/providers/AuthGate";
import { PlayerShell } from "@/components/layout/PlayerShell";

export default function PlayerLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGate>
      <PlayerShell>{children}</PlayerShell>
    </AuthGate>
  );
}
