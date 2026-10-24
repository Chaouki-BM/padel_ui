import { http, HttpResponse } from "msw";

let adSeq = 1;
type MockAd = {
  id: string;
  title: string;
  imageUrl: string;
  href: string | null;
  placement: string;
  active: boolean;
};
const ads: MockAd[] = [
  {
    id: "ad-1",
    title: "Tournoi Marsa Open",
    imageUrl:
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1200&q=80",
    href: null,
    placement: "HOME",
    active: true,
  },
];

export const adsHandlers = [
  http.get("*/api/v1/ads", ({ request }) => {
    const url = new URL(request.url);
    const placement = url.searchParams.get("placement");
    const items = placement
      ? ads.filter((a) => a.placement === placement && a.active)
      : ads.filter((a) => a.active);
    return HttpResponse.json({ items });
  }),

  http.post("*/api/v1/promotions/preview", async ({ request }) => {
    const body = (await request.json()) as {
      code?: string;
      amount?: number;
    };
    const code = String(body.code ?? "").toUpperCase();
    const amount = Number(body.amount ?? 100);
    if (code === "WELCOME10" || code === "PADEL10") {
      const discount = Math.round(amount * 0.1);
      return HttpResponse.json({
        code,
        valid: true,
        discountAmount: discount,
        finalAmount: amount - discount,
        message: "OK",
      });
    }
    return HttpResponse.json({
      code,
      valid: false,
      discountAmount: 0,
      finalAmount: amount,
      message: "Invalid code",
    });
  }),

  http.get("*/api/v1/admin/advertisements", () =>
    HttpResponse.json({ items: ads }),
  ),

  http.post("*/api/v1/admin/advertisements", async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const ad = {
      id: `ad-${adSeq++}`,
      title: String(body.title ?? "Pub"),
      imageUrl: String(body.imageUrl ?? ""),
      href: body.href ? String(body.href) : null,
      placement: String(body.placement ?? "HOME"),
      active: true,
    };
    ads.push(ad);
    return HttpResponse.json(ad, { status: 201 });
  }),

  http.patch("*/api/v1/admin/advertisements/:id", async ({ params, request }) => {
    const id = String(params.id);
    const body = (await request.json()) as Record<string, unknown>;
    const idx = ads.findIndex((a) => a.id === id);
    if (idx < 0) {
      return HttpResponse.json({ message: "Not found" }, { status: 404 });
    }
    ads[idx] = {
      ...ads[idx],
      title: typeof body.title === "string" ? body.title : ads[idx].title,
      active:
        typeof body.active === "boolean" ? body.active : ads[idx].active,
    };
    return HttpResponse.json(ads[idx]);
  }),
];
