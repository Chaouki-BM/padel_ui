import { useQuery } from "@tanstack/react-query";
import { getRankings } from "@/services/rankings";

export function useRankings(params?: { city?: string; take?: number }) {
  return useQuery({
    queryKey: ["rankings", params?.city ?? "", params?.take ?? 50],
    queryFn: () => getRankings({ take: 50, ...params }),
  });
}
