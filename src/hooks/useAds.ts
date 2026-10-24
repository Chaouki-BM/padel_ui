import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAdminAdvertisement,
  getAdminAdvertisements,
  getAds,
  patchAdminAdvertisement,
  previewPromotion,
} from "@/services/ads";

export function useAds(placement: string) {
  return useQuery({
    queryKey: ["ads", placement],
    queryFn: () => getAds(placement),
    enabled: placement.length > 0,
  });
}

export function usePreviewPromotion() {
  return useMutation({
    mutationFn: (input: { code: string; amount?: number }) =>
      previewPromotion(input),
  });
}

export function useAdminAdvertisements() {
  return useQuery({
    queryKey: ["admin", "advertisements"],
    queryFn: getAdminAdvertisements,
  });
}

export function useCreateAdminAdvertisement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      title: string;
      imageUrl?: string;
      placement?: string;
      href?: string;
    }) => createAdminAdvertisement(body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "advertisements"] });
      void qc.invalidateQueries({ queryKey: ["ads"] });
    },
  });
}

export function usePatchAdminAdvertisement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { id: string; body: Record<string, unknown> }) =>
      patchAdminAdvertisement(input.id, input.body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin", "advertisements"] });
      void qc.invalidateQueries({ queryKey: ["ads"] });
    },
  });
}
