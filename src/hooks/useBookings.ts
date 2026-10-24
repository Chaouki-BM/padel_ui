"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cancelBooking,
  createBooking,
  getBooking,
  getMyBookings,
  type CreateBookingBody,
} from "@/services/bookings";

export const bookingKeys = {
  all: ["bookings"] as const,
  mine: (scope: "upcoming" | "past") =>
    [...bookingKeys.all, "me", scope] as const,
  detail: (id: string) => [...bookingKeys.all, id] as const,
};

export function useMyBookings(scope: "upcoming" | "past") {
  return useQuery({
    queryKey: bookingKeys.mine(scope),
    queryFn: () => getMyBookings(scope),
  });
}

export function useBooking(id: string, options?: { refetchInterval?: number | false }) {
  return useQuery({
    queryKey: bookingKeys.detail(id),
    queryFn: () => getBooking(id),
    enabled: id.length > 0,
    refetchInterval: options?.refetchInterval,
  });
}

export function useCreateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateBookingBody) => createBooking(body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: bookingKeys.all });
    },
  });
}

export function useCancelBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { id: string; reason?: string }) =>
      cancelBooking(input.id, input.reason),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: bookingKeys.all });
    },
  });
}
