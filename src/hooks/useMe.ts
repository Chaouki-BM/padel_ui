"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAppeal,
  getBehaviour,
  getMe,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  updateProfile,
} from "@/services/me";
import type { UpdateProfileBody } from "@/schemas/auth";

export const meKeys = {
  all: ["me"] as const,
  account: () => [...meKeys.all, "account"] as const,
  notifications: (unreadOnly: boolean) =>
    [...meKeys.all, "notifications", unreadOnly] as const,
  behaviour: () => [...meKeys.all, "behaviour"] as const,
};

export function useMeAccount() {
  return useQuery({
    queryKey: meKeys.account(),
    queryFn: getMe,
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateProfileBody) => updateProfile(body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: meKeys.account() });
    },
  });
}

export function useNotifications(unreadOnly = false) {
  return useQuery({
    queryKey: meKeys.notifications(unreadOnly),
    queryFn: () => getNotifications(unreadOnly),
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: meKeys.all });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => markAllNotificationsRead(),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: meKeys.all });
    },
  });
}

export function useBehaviour() {
  return useQuery({
    queryKey: meKeys.behaviour(),
    queryFn: getBehaviour,
  });
}

export function useCreateAppeal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { sanctionId?: string; message: string }) =>
      createAppeal(input),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: meKeys.behaviour() });
    },
  });
}
