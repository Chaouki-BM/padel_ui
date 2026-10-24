import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createEventTeam,
  getEventBySlug,
  getEventDetailBundle,
  getEvents,
  registerForEvent,
  withdrawFromEvent,
} from "@/services/events";

export function useEvents(params?: { city?: string; type?: string }) {
  return useQuery({
    queryKey: ["events", params?.city ?? "", params?.type ?? ""],
    queryFn: () => getEvents(params),
  });
}

export function useEvent(slug: string) {
  return useQuery({
    queryKey: ["events", slug],
    queryFn: () => getEventBySlug(slug),
    enabled: slug.length > 0,
  });
}

export function useEventDetail(slug: string) {
  return useQuery({
    queryKey: ["events", slug, "detail"],
    queryFn: () => getEventDetailBundle(slug),
    enabled: slug.length > 0,
  });
}

export function useRegisterForEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      slug: string;
      paymentMode?: "CARD" | "ON_SITE";
    }) => registerForEvent(input.slug, input.paymentMode),
    onSuccess: (_d, vars) => {
      void qc.invalidateQueries({ queryKey: ["events", vars.slug] });
    },
  });
}

export function useWithdrawFromEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (slug: string) => withdrawFromEvent(slug),
    onSuccess: (_d, slug) => {
      void qc.invalidateQueries({ queryKey: ["events", slug] });
    },
  });
}

export function useCreateEventTeam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { slug: string; partnerId: string; name?: string }) =>
      createEventTeam(input.slug, input.partnerId, input.name),
    onSuccess: (_d, vars) => {
      void qc.invalidateQueries({ queryKey: ["events", vars.slug] });
    },
  });
}
