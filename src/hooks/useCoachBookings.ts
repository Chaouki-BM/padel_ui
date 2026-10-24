"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  bookCoach,
  cancelCoachBooking,
  getMyCoachBookings,
  type CreateCoachBookingBody,
} from "@/services/coach-bookings";

export const coachBookingKeys = {
  all: ["coach-bookings"] as const,
  mine: () => [...coachBookingKeys.all, "me"] as const,
};

export function useMyCoachBookings() {
  return useQuery({
    queryKey: coachBookingKeys.mine(),
    queryFn: getMyCoachBookings,
  });
}

export function useBookCoach() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { coachId: string; body: CreateCoachBookingBody }) =>
      bookCoach(input.coachId, input.body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: coachBookingKeys.all });
    },
  });
}

export function useCancelCoachBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelCoachBooking(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: coachBookingKeys.all });
    },
  });
}
