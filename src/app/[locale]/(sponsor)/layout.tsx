import { type ReactNode } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";

const NAV_ITEMS = [
  { href: "/sponsor/campaigns", labelKey: "pages.sponsor.campaigns" },
  { href: "/sponsor/assets", labelKey: "pages.sponsor.assets" },
];

export default function SponsorLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardShell navItems={NAV_ITEMS} titleKey="devLanding.sponsor">
      {children}
    </DashboardShell>
  );
}
