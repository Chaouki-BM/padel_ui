import {
  asBoolean,
  asNumber,
  asRecord,
  asString,
  unwrapList,
  unwrapOne,
} from "@/lib/api-unwrap";
import { apiFetch } from "@/services/api";

export type SubscriptionPlan = {
  id: string;
  code: string;
  name: string;
  price: number;
  interval: string;
  description: string;
};

export type MySubscription = {
  id: string;
  plan: string;
  status: string;
  renews: boolean;
  paymentId: string | null;
};

function mapPlan(rawUnknown: unknown): SubscriptionPlan {
  const raw = asRecord(rawUnknown);
  return {
    id: asString(raw.id, asString(raw.code, asString(raw.plan))),
    code: asString(raw.code, asString(raw.plan, asString(raw.id))),
    name: asString(raw.name, asString(raw.title, asString(raw.code, "Plan"))),
    price: asNumber(raw.price, asNumber(raw.amount, 0)),
    interval: asString(raw.interval, asString(raw.period, "month")),
    description: asString(raw.description, asString(raw.summary)),
  };
}

function mapSub(rawUnknown: unknown): MySubscription {
  const raw = asRecord(rawUnknown);
  return {
    id: asString(raw.id),
    plan: asString(raw.plan, asString(asRecord(raw.planDetails).code, "—")),
    status: asString(raw.status, "ACTIVE").toUpperCase(),
    renews: asBoolean(raw.renews, asBoolean(raw.autoRenew, true)),
    paymentId:
      raw.paymentId === null || raw.paymentId === undefined
        ? null
        : asString(raw.paymentId),
  };
}

export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  const payload = await apiFetch<unknown>("/subscriptions/plans", {
    skipAuth: true,
  });
  return unwrapList(payload).map(mapPlan);
}

export async function getMySubscriptions(): Promise<MySubscription[]> {
  const payload = await apiFetch<unknown>("/me/subscriptions");
  return unwrapList(payload).map(mapSub);
}

export async function createSubscription(
  plan: string,
): Promise<MySubscription> {
  const payload = await apiFetch<unknown>("/me/subscriptions", {
    method: "POST",
    body: JSON.stringify({ plan }),
  });
  return mapSub(unwrapOne(payload));
}

export async function cancelSubscription(id: string): Promise<MySubscription> {
  const payload = await apiFetch<unknown>(
    `/me/subscriptions/${encodeURIComponent(id)}/cancel`,
    { method: "POST" },
  );
  return mapSub(unwrapOne(payload));
}
