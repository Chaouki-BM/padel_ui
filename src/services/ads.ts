import {
  asBoolean,
  asNumber,
  asRecord,
  asString,
  unwrapList,
  unwrapOne,
} from "@/lib/api-unwrap";
import { apiFetch } from "@/services/api";

export type AdBanner = {
  id: string;
  title: string;
  imageUrl: string;
  href: string | null;
  placement: string;
  active: boolean;
};

function mapAd(rawUnknown: unknown): AdBanner {
  const raw = asRecord(rawUnknown);
  return {
    id: asString(raw.id),
    title: asString(raw.title, asString(raw.name, "Pub")),
    imageUrl: asString(raw.imageUrl, asString(raw.image, "")),
    href: raw.href === null || raw.href === undefined ? null : asString(raw.href),
    placement: asString(raw.placement, "HOME"),
    active: asBoolean(raw.active, asBoolean(raw.isActive, true)),
  };
}

export async function getAds(placement: string): Promise<AdBanner[]> {
  const search = new URLSearchParams({ placement });
  const payload = await apiFetch<unknown>(`/ads?${search.toString()}`, {
    skipAuth: true,
  });
  return unwrapList(payload).map(mapAd).filter((a) => a.active);
}

export async function getAdminAdvertisements(): Promise<AdBanner[]> {
  const payload = await apiFetch<unknown>("/admin/advertisements");
  return unwrapList(payload).map(mapAd);
}

export async function createAdminAdvertisement(body: {
  title: string;
  imageUrl?: string;
  placement?: string;
  href?: string;
}): Promise<AdBanner> {
  const payload = await apiFetch<unknown>("/admin/advertisements", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return mapAd(unwrapOne(payload));
}

export async function patchAdminAdvertisement(
  id: string,
  body: Record<string, unknown>,
): Promise<AdBanner> {
  const payload = await apiFetch<unknown>(
    `/admin/advertisements/${encodeURIComponent(id)}`,
    { method: "PATCH", body: JSON.stringify(body) },
  );
  return mapAd(unwrapOne(payload));
}

export type PromoPreview = {
  code: string;
  valid: boolean;
  discountAmount: number;
  finalAmount: number | null;
  message: string;
};

export async function previewPromotion(input: {
  code: string;
  amount?: number;
}): Promise<PromoPreview> {
  const payload = await apiFetch<unknown>("/promotions/preview", {
    method: "POST",
    body: JSON.stringify(input),
  });
  const raw = asRecord(unwrapOne(payload));
  return {
    code: asString(raw.code, input.code),
    valid: asBoolean(raw.valid, asBoolean(raw.ok, false)),
    discountAmount: asNumber(raw.discountAmount, asNumber(raw.discount, 0)),
    finalAmount:
      raw.finalAmount === null || raw.finalAmount === undefined
        ? null
        : asNumber(raw.finalAmount),
    message: asString(raw.message, asString(raw.error, "")),
  };
}
