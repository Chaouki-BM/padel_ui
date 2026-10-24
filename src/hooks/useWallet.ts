"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getWallet, purchaseTokens } from "@/services/wallet";
import { paymentKeys } from "@/hooks/usePayments";

export const walletKeys = {
  all: ["wallet"] as const,
  me: () => [...walletKeys.all, "me"] as const,
};

export function useWallet() {
  return useQuery({
    queryKey: walletKeys.me(),
    queryFn: getWallet,
  });
}

export function usePurchaseTokens() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (tokens: number) => purchaseTokens(tokens),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: walletKeys.all });
      void qc.invalidateQueries({ queryKey: paymentKeys.all });
    },
  });
}
