import { useQuery } from "@tanstack/react-query";
import { getClubBySlug } from "@/services/clubs";

export function useClub(slug: string) {
  return useQuery({
    queryKey: ["clubs", slug],
    queryFn: () => getClubBySlug(slug),
    enabled: slug.length > 0,
  });
}
