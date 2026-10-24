import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type LevelCode } from "@/lib/constants";
import {
  completeCoachBooking,
  createCoachAssessment,
  defaultWeekdayAvailabilities,
  getCoachAvailabilities,
  getCoachSpaceAvailability,
  getCoachSpaceClients,
  getCoachSpaceDashboard,
  getCoachSpaceRequests,
  patchCoachProfile,
  type CoachProfilePatch,
  putCoachAvailabilities,
  updateCoachSpaceRequest,
} from "@/services/coach-space";

const ROOT = ["coach-space"] as const;

export function useCoachSpaceDashboard() {
  return useQuery({
    queryKey: [...ROOT, "dashboard"],
    queryFn: getCoachSpaceDashboard,
  });
}

export function useCoachSpaceRequests() {
  return useQuery({
    queryKey: [...ROOT, "requests"],
    queryFn: getCoachSpaceRequests,
  });
}

export function useCoachSpaceClients() {
  return useQuery({
    queryKey: [...ROOT, "clients"],
    queryFn: getCoachSpaceClients,
  });
}

export function useCoachSpaceAvailability(date: string) {
  return useQuery({
    queryKey: [...ROOT, "availability", date],
    queryFn: () => getCoachSpaceAvailability(date),
    enabled: date.length > 0,
  });
}

export function useCoachAvailabilities() {
  return useQuery({
    queryKey: [...ROOT, "availabilities"],
    queryFn: getCoachAvailabilities,
  });
}

function useInvalidateCoach() {
  const qc = useQueryClient();
  return () => void qc.invalidateQueries({ queryKey: [...ROOT] });
}

export function useUpdateCoachSpaceRequest() {
  const invalidate = useInvalidateCoach();
  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "accepted" | "declined";
    }) => updateCoachSpaceRequest(id, status),
    onSuccess: invalidate,
  });
}

export function useCompleteCoachBooking() {
  const invalidate = useInvalidateCoach();
  return useMutation({
    mutationFn: (id: string) => completeCoachBooking(id),
    onSuccess: invalidate,
  });
}

export function usePatchCoachProfile() {
  const invalidate = useInvalidateCoach();
  return useMutation({
    mutationFn: (body: CoachProfilePatch) => patchCoachProfile(body),
    onSuccess: invalidate,
  });
}

export function usePutCoachAvailabilities() {
  const invalidate = useInvalidateCoach();
  return useMutation({
    mutationFn: (windows?: Parameters<typeof putCoachAvailabilities>[0]) =>
      putCoachAvailabilities(windows ?? defaultWeekdayAvailabilities()),
    onSuccess: invalidate,
  });
}

export function useCreateCoachAssessment() {
  const invalidate = useInvalidateCoach();
  return useMutation({
    mutationFn: (input: {
      playerId: string;
      level: LevelCode;
      note?: string;
    }) => createCoachAssessment(input),
    onSuccess: invalidate,
  });
}
