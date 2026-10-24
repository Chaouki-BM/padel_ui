import { useQuery } from "@tanstack/react-query";
import {
  getCoachAvailability,
  getCoachById,
  getCoaches,
} from "@/services/coaches";

export function useCoaches(params?: { city?: string }) {
  return useQuery({
    queryKey: ["coaches", params?.city ?? ""],
    queryFn: () => getCoaches(params),
  });
}

export function useCoach(id: string) {
  return useQuery({
    queryKey: ["coaches", id],
    queryFn: () => getCoachById(id),
    enabled: id.length > 0,
  });
}

export function useCoachAvailability(
  id: string,
  date: string,
  sessionMinutes: number,
) {
  return useQuery({
    queryKey: ["coach-availability", id, date, sessionMinutes],
    queryFn: () => getCoachAvailability(id, date, sessionMinutes),
    enabled: id.length > 0 && date.length > 0,
  });
}
