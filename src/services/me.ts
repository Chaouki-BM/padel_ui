import {
  appealBodySchema,
  behaviourResponseSchema,
  meAccountSchema,
  notificationsResponseSchema,
  updateProfileBodySchema,
  type UpdateProfileBody,
} from "@/schemas/auth";
import { apiFetch } from "@/services/api";

export async function getMe() {
  const raw = await apiFetch<unknown>("/me");
  return meAccountSchema.parse(raw);
}

export async function updateProfile(body: UpdateProfileBody) {
  const payload = updateProfileBodySchema.parse(body);
  const raw = await apiFetch<unknown>("/me/profile", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return meAccountSchema.parse(raw);
}

export async function getNotifications(unreadOnly = false) {
  const qs = unreadOnly ? "?unread=true" : "";
  const raw = await apiFetch<unknown>(`/me/notifications${qs}`);
  return notificationsResponseSchema.parse(raw);
}

export async function markNotificationRead(id: string): Promise<void> {
  await apiFetch<unknown>(`/me/notifications/${id}/read`, {
    method: "PATCH",
  });
}

export async function markAllNotificationsRead(): Promise<void> {
  await apiFetch<unknown>("/me/notifications/read-all", {
    method: "POST",
  });
}

export async function getBehaviour() {
  const raw = await apiFetch<unknown>("/me/behaviour");
  return behaviourResponseSchema.parse(raw);
}

export async function createAppeal(input: {
  sanctionId?: string;
  message: string;
}) {
  const body = appealBodySchema.parse(input);
  return apiFetch<unknown>("/me/appeals", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
