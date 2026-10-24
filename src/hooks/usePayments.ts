"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMyPayments,
  getPaymentReceipt,
  mockConfirmPayment,
  mockFailPayment,
} from "@/services/payments";
import { bookingKeys } from "@/hooks/useBookings";

export const paymentKeys = {
  all: ["payments"] as const,
  mine: () => [...paymentKeys.all, "me"] as const,
  receipt: (id: string) => [...paymentKeys.all, "receipt", id] as const,
};

export function useMyPayments() {
  return useQuery({
    queryKey: paymentKeys.mine(),
    queryFn: getMyPayments,
  });
}

export function usePaymentReceipt(paymentId: string) {
  return useQuery({
    queryKey: paymentKeys.receipt(paymentId),
    queryFn: () => getPaymentReceipt(paymentId),
    enabled: paymentId.length > 0,
  });
}

export function useMockConfirmPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (paymentId: string) => mockConfirmPayment(paymentId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: paymentKeys.all });
      void qc.invalidateQueries({ queryKey: bookingKeys.all });
    },
  });
}

export function useMockFailPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (paymentId: string) => mockFailPayment(paymentId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: paymentKeys.all });
      void qc.invalidateQueries({ queryKey: bookingKeys.all });
    },
  });
}
