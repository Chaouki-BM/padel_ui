import { type ReactNode } from "react";
import { CoachShell } from "@/components/layout/CoachShell";

export default function CoachLayout({ children }: { children: ReactNode }) {
  return <CoachShell>{children}</CoachShell>;
}
