import { type ReactNode } from "react";
import { ClubShell } from "@/components/layout/ClubShell";

export default function ClubLayout({ children }: { children: ReactNode }) {
  return <ClubShell>{children}</ClubShell>;
}
