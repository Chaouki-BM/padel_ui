import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const ROUTE_GROUPS = [
  {
    titleKey: "devLanding.public",
    routes: [
      { href: "/", label: "/ (marketplace)" },
      { href: "/clubs/tunis", label: "/clubs/tunis" },
      { href: "/club/padel-city", label: "/club/padel-city" },
      { href: "/coach/ahmed", label: "/coach/ahmed" },
      { href: "/events", label: "/events" },
      { href: "/event/americano-2025", label: "/event/americano-2025" },
      { href: "/tournaments", label: "/tournaments" },
    ],
  },
  {
    titleKey: "devLanding.auth",
    routes: [
      { href: "/login", label: "/login" },
      { href: "/register", label: "/register" },
      { href: "/verify-otp", label: "/verify-otp" },
      { href: "/forgot-password", label: "/forgot-password" },
    ],
  },
  {
    titleKey: "devLanding.player",
    routes: [
      { href: "/player/home", label: "/player/home" },
      { href: "/player/clubs", label: "/player/clubs" },
      { href: "/player/book/padel-elite-gammarth", label: "/player/book/…" },
      { href: "/player/bookings", label: "/player/bookings" },
      { href: "/player/open-matches", label: "/player/open-matches" },
      { href: "/player/profile", label: "/player/profile" },
    ],
  },
  {
    titleKey: "devLanding.club",
    routes: [
      { href: "/club-dashboard/overview", label: "/club-dashboard/overview" },
    ],
  },
  {
    titleKey: "devLanding.coach",
    routes: [
      { href: "/coach-space/profile", label: "/coach-space/profile" },
    ],
  },
  {
    titleKey: "devLanding.admin",
    routes: [
      { href: "/admin/overview", label: "/admin/overview" },
    ],
  },
  {
    titleKey: "devLanding.sponsor",
    routes: [
      { href: "/sponsor/campaigns", label: "/sponsor/campaigns" },
    ],
  },
];

export default function DevLandingPage() {
  const t = useTranslations();

  return (
    <div className="px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">{t("devLanding.title")}</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {ROUTE_GROUPS.map((group) => (
          <section key={group.titleKey} className="rounded-lg border p-4">
            <h2 className="mb-3 text-lg font-semibold">{t(group.titleKey)}</h2>
            <ul className="space-y-1">
              {group.routes.map((route) => (
                <li key={route.href}>
                  <Link
                    href={route.href}
                    className="text-sm text-primary underline-offset-4 hover:underline"
                  >
                    {route.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
