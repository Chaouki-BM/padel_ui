"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cancelOpenMatch,
  createOpenMatch,
  getOpenMatchById,
  getOpenMatches,
  joinOpenMatch,
  leaveOpenMatch,
  payOpenMatch,
  submitOpenMatchResult,
  type CreateOpenMatchBody,
  type OpenMatchResultBody,
} from "@/services/open-matches";

export const openMatchKeys = {
  all: ["open-matches"] as const,
  list: (params?: { city?: string; clubId?: string; type?: string }) =>
    [
      ...openMatchKeys.all,
      "list",
      params?.city ?? "",
      params?.clubId ?? "",
      params?.type ?? "",
    ] as const,
  detail: (id: string) => [...openMatchKeys.all, id] as const,
};

export function useOpenMatches(params?: {
  city?: string;
  clubId?: string;
  type?: string;
}) {
  return useQuery({
    queryKey: openMatchKeys.list(params),
    queryFn: () => getOpenMatches(params),
  });
}

export function useOpenMatch(id: string) {
  return useQuery({
    queryKey: openMatchKeys.detail(id),
    queryFn: () => getOpenMatchById(id),
    enabled: id.length > 0,
  });
}

export function useCreateOpenMatch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateOpenMatchBody) => createOpenMatch(body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: openMatchKeys.all });
    },
  });
}

export function useJoinOpenMatch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => joinOpenMatch(id),
    onSuccess: (_data, id) => {
      void qc.invalidateQueries({ queryKey: openMatchKeys.all });
      void qc.invalidateQueries({ queryKey: openMatchKeys.detail(id) });
    },
  });
}

export function useLeaveOpenMatch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => leaveOpenMatch(id),
    onSuccess: (_data, id) => {
      void qc.invalidateQueries({ queryKey: openMatchKeys.all });
      void qc.invalidateQueries({ queryKey: openMatchKeys.detail(id) });
    },
  });
}

export function usePayOpenMatch() {
  return useMutation({
    mutationFn: (id: string) => payOpenMatch(id),
  });
}

export function useCancelOpenMatch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelOpenMatch(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: openMatchKeys.all });
    },
  });
}

export function useSubmitOpenMatchResult() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { id: string; body: OpenMatchResultBody }) =>
      submitOpenMatchResult(input.id, input.body),
    onSuccess: (_d, vars) => {
      void qc.invalidateQueries({ queryKey: openMatchKeys.detail(vars.id) });
    },
  });
}
