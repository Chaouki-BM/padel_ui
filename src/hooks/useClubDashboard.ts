import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  advanceEventBracket,
  cancelClubEvent,
  checkInBooking,
  createBlockedSlot,
  createClubEvent,
  createClubPromotion,
  createCourt,
  createEventWalkInTeam,
  type CreateClubEventBody,
  type CourtPriceRule,
  defaultWeekSchedules,
  deleteBlockedSlot,
  getBlockedSlots,
  getClubBookings,
  getClubCourts,
  getClubDashboard,
  getClubEvents,
  getClubOffers,
  getClubPlayers,
  getMyClubs,
  getPlayerBehaviour,
  markNoShow,
  nextEventRound,
  patchClubEvent,
  patchMyClub,
  publishClubEvent,
  putCourtPriceRules,
  putCourtSchedules,
  scoreEventMatch,
  startClubEvent,
  startEventBracket,
  startEventGroups,
  updateClubPromotion,
  updateCourt,
} from "@/services/club-dashboard";

const ROOT = ["club-dashboard"] as const;

export function useMyClubs() {
  return useQuery({
    queryKey: [...ROOT, "my-clubs"],
    queryFn: getMyClubs,
  });
}

export function useClubDashboard() {
  return useQuery({
    queryKey: [...ROOT],
    queryFn: getClubDashboard,
  });
}

export function useClubCourts() {
  return useQuery({
    queryKey: [...ROOT, "courts"],
    queryFn: getClubCourts,
  });
}

export function useClubPlayers() {
  return useQuery({
    queryKey: [...ROOT, "players"],
    queryFn: getClubPlayers,
  });
}

export function useClubEvents() {
  return useQuery({
    queryKey: [...ROOT, "events"],
    queryFn: getClubEvents,
  });
}

export function useClubOffers() {
  return useQuery({
    queryKey: [...ROOT, "offers"],
    queryFn: getClubOffers,
  });
}

export function useClubBookings(params?: {
  from?: string;
  to?: string;
  courtId?: string;
}) {
  return useQuery({
    queryKey: [
      ...ROOT,
      "bookings",
      params?.from ?? "",
      params?.to ?? "",
      params?.courtId ?? "",
    ],
    queryFn: () => getClubBookings(params),
  });
}

export function useBlockedSlots(courtId: string) {
  return useQuery({
    queryKey: [...ROOT, "blocked", courtId],
    queryFn: () => getBlockedSlots(courtId),
    enabled: courtId.length > 0,
  });
}

export function usePlayerBehaviour(playerId: string, enabled = false) {
  return useQuery({
    queryKey: [...ROOT, "behaviour", playerId],
    queryFn: () => getPlayerBehaviour(playerId),
    enabled: enabled && playerId.length > 0,
  });
}

function useInvalidateClub() {
  const qc = useQueryClient();
  return () => void qc.invalidateQueries({ queryKey: [...ROOT] });
}

export function useCreateCourt() {
  const invalidate = useInvalidateClub();
  return useMutation({
    mutationFn: (input: { name: string; type?: string }) => createCourt(input),
    onSuccess: invalidate,
  });
}

export function useUpdateCourt() {
  const invalidate = useInvalidateClub();
  return useMutation({
    mutationFn: (input: { courtId: string; body: Record<string, unknown> }) =>
      updateCourt(input.courtId, input.body),
    onSuccess: invalidate,
  });
}

export function usePutCourtSchedules() {
  const invalidate = useInvalidateClub();
  return useMutation({
    mutationFn: (courtId: string) =>
      putCourtSchedules(courtId, defaultWeekSchedules()),
    onSuccess: invalidate,
  });
}

export function usePutCourtPriceRules() {
  const invalidate = useInvalidateClub();
  return useMutation({
    mutationFn: (input: { courtId: string; rules: CourtPriceRule[] }) =>
      putCourtPriceRules(input.courtId, input.rules),
    onSuccess: invalidate,
  });
}

export function useCreateBlockedSlot() {
  const invalidate = useInvalidateClub();
  return useMutation({
    mutationFn: (input: {
      courtId: string;
      startsAt: string;
      endsAt: string;
      reason?: string;
    }) =>
      createBlockedSlot(input.courtId, {
        startsAt: input.startsAt,
        endsAt: input.endsAt,
        reason: input.reason,
      }),
    onSuccess: invalidate,
  });
}

export function useDeleteBlockedSlot() {
  const invalidate = useInvalidateClub();
  return useMutation({
    mutationFn: (input: { courtId: string; slotId: string }) =>
      deleteBlockedSlot(input.courtId, input.slotId),
    onSuccess: invalidate,
  });
}

export function usePatchMyClub() {
  const invalidate = useInvalidateClub();
  return useMutation({
    mutationFn: (body: Record<string, unknown>) => patchMyClub(body),
    onSuccess: invalidate,
  });
}

export function useCheckInBooking() {
  const invalidate = useInvalidateClub();
  return useMutation({
    mutationFn: (bookingId: string) => checkInBooking(bookingId),
    onSuccess: invalidate,
  });
}

export function useMarkNoShow() {
  const invalidate = useInvalidateClub();
  return useMutation({
    mutationFn: (bookingId: string) => markNoShow(bookingId),
    onSuccess: invalidate,
  });
}

export function useCreateClubEvent() {
  const invalidate = useInvalidateClub();
  return useMutation({
    mutationFn: (body: CreateClubEventBody) => createClubEvent(body),
    onSuccess: invalidate,
  });
}

export function usePublishClubEvent() {
  const invalidate = useInvalidateClub();
  return useMutation({
    mutationFn: (eventId: string) => publishClubEvent(eventId),
    onSuccess: invalidate,
  });
}

export function useStartClubEvent() {
  const invalidate = useInvalidateClub();
  return useMutation({
    mutationFn: (eventId: string) => startClubEvent(eventId),
    onSuccess: invalidate,
  });
}

export function useCancelClubEvent() {
  const invalidate = useInvalidateClub();
  return useMutation({
    mutationFn: (eventId: string) => cancelClubEvent(eventId),
    onSuccess: invalidate,
  });
}

export function usePatchClubEvent() {
  const invalidate = useInvalidateClub();
  return useMutation({
    mutationFn: (input: { eventId: string; body: Record<string, unknown> }) =>
      patchClubEvent(input.eventId, input.body),
    onSuccess: invalidate,
  });
}

export function useNextEventRound() {
  const invalidate = useInvalidateClub();
  return useMutation({
    mutationFn: (eventId: string) => nextEventRound(eventId),
    onSuccess: invalidate,
  });
}

export function useScoreEventMatch() {
  const invalidate = useInvalidateClub();
  return useMutation({
    mutationFn: (input: {
      eventId: string;
      matchId: string;
      scoreA: number;
      scoreB: number;
    }) =>
      scoreEventMatch(
        input.eventId,
        input.matchId,
        input.scoreA,
        input.scoreB,
      ),
    onSuccess: invalidate,
  });
}

export function useStartEventGroups() {
  const invalidate = useInvalidateClub();
  return useMutation({
    mutationFn: (input: { eventId: string; groupsCount?: number }) =>
      startEventGroups(input.eventId, input.groupsCount),
    onSuccess: invalidate,
  });
}

export function useStartEventBracket() {
  const invalidate = useInvalidateClub();
  return useMutation({
    mutationFn: (input: { eventId: string; fromGroups?: boolean }) =>
      startEventBracket(input.eventId, input.fromGroups),
    onSuccess: invalidate,
  });
}

export function useAdvanceEventBracket() {
  const invalidate = useInvalidateClub();
  return useMutation({
    mutationFn: (eventId: string) => advanceEventBracket(eventId),
    onSuccess: invalidate,
  });
}

export function useCreateEventWalkInTeam() {
  const invalidate = useInvalidateClub();
  return useMutation({
    mutationFn: (input: {
      eventId: string;
      name?: string;
      playerIds?: string[];
    }) =>
      createEventWalkInTeam(input.eventId, {
        name: input.name,
        playerIds: input.playerIds,
      }),
    onSuccess: invalidate,
  });
}

export function useCreateClubPromotion() {
  const invalidate = useInvalidateClub();
  return useMutation({
    mutationFn: (body: {
      code: string;
      type: "PERCENT" | "FIXED";
      value: number;
      maxUses?: number;
      minAmount?: number;
    }) => createClubPromotion(body),
    onSuccess: invalidate,
  });
}

export function useUpdateClubPromotion() {
  const invalidate = useInvalidateClub();
  return useMutation({
    mutationFn: (input: { id: string; body: Record<string, unknown> }) =>
      updateClubPromotion(input.id, input.body),
    onSuccess: invalidate,
  });
}
