import { useQuery } from "@tanstack/react-query";
import { getClubAvailability } from "@/services/availability";

export function useAvailability(
  slug: string,
  date: string,
  courtType: string,
  durationMin = 90,
) {
  return useQuery({
    queryKey: ["availability", slug, date, courtType, durationMin],
    queryFn: () => getClubAvailability(slug, date, durationMin, courtType),
    enabled: slug.length > 0 && date.length > 0,
  });
}
