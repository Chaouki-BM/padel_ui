"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMyMatches,
  getRatingHistory,
  respondToMatch,
} from "@/services/matches";

export const matchKeys = {
  all: ["matches"] as const,
  mine: () => [...matchKeys.all, "me"] as const,
  rating: () => [...matchKeys.all, "rating-history"] as const,
};

export function useMyMatches() {
  return useQuery({
    queryKey: matchKeys.mine(),
    queryFn: getMyMatches,
  });
}

export function useRatingHistory() {
  return useQuery({
    queryKey: matchKeys.rating(),
    queryFn: getRatingHistory,
  });
}

export function useRespondToMatch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      id: string;
      action: "CONFIRM" | "CONTEST";
      note?: string;
    }) => respondToMatch(input.id, input.action, input.note),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: matchKeys.mine() });
    },
  });
}
