import { useQuery } from "@tanstack/react-query";
import { getClubReviews, getClubs } from "@/services/clubs";

export function useClubs(params?: { city?: string; q?: string }) {
  return useQuery({
    queryKey: ["clubs", params?.city ?? "", params?.q ?? ""],
    queryFn: () => getClubs(params),
  });
}

export function useClubReviews(slug: string) {
  return useQuery({
    queryKey: ["clubs", slug, "reviews"],
    queryFn: () => getClubReviews(slug),
    enabled: slug.length > 0,
  });
}
