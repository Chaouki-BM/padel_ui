"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cancelSubscription,
  createSubscription,
  getMySubscriptions,
  getSubscriptionPlans,
} from "@/services/subscriptions";

export const subscriptionKeys = {
  all: ["subscriptions"] as const,
  plans: () => [...subscriptionKeys.all, "plans"] as const,
  mine: () => [...subscriptionKeys.all, "me"] as const,
};

export function useSubscriptionPlans() {
  return useQuery({
    queryKey: subscriptionKeys.plans(),
    queryFn: getSubscriptionPlans,
  });
}

export function useMySubscriptions() {
  return useQuery({
    queryKey: subscriptionKeys.mine(),
    queryFn: getMySubscriptions,
  });
}

export function useCreateSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (plan: string) => createSubscription(plan),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: subscriptionKeys.mine() });
    },
  });
}

export function useCancelSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelSubscription(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: subscriptionKeys.mine() });
    },
  });
}
