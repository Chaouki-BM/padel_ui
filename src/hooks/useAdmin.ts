import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addClubManager,
  createAdminClub,
  createAdminCoach,
  createAdminPromotion,
  createAdminSponsor,
  createFederationImport,
  deleteAdminSetting,
  getAdminClubs,
  getAdminComplaints,
  getAdminDashboard,
  getAdminFinance,
  getAdminPayments,
  getAdminPromotions,
  getAdminSettings,
  getAdminUsers,
  getSponsorDashboard,
  listFederationImports,
  patchAdminClub,
  patchAdminMatchResult,
  patchCoachAssessPermission,
  putAdminSetting,
  removeClubManager,
  resolveAppeal,
  voidAdminMatch,
} from "@/services/admin";

const ROOT = ["admin"] as const;

export function useAdminDashboard() {
  return useQuery({
    queryKey: [...ROOT, "dashboard"],
    queryFn: getAdminDashboard,
  });
}

export function useAdminFinance(params?: { from?: string; to?: string }) {
  return useQuery({
    queryKey: [...ROOT, "finance", params?.from ?? "", params?.to ?? ""],
    queryFn: () => getAdminFinance(params),
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: [...ROOT, "users"],
    queryFn: getAdminUsers,
  });
}

export function useAdminClubs() {
  return useQuery({
    queryKey: [...ROOT, "clubs"],
    queryFn: getAdminClubs,
  });
}

export function useAdminPayments() {
  return useQuery({
    queryKey: [...ROOT, "payments"],
    queryFn: getAdminPayments,
  });
}

export function useAdminComplaints() {
  return useQuery({
    queryKey: [...ROOT, "complaints"],
    queryFn: getAdminComplaints,
  });
}

export function useSponsorDashboard() {
  return useQuery({
    queryKey: [...ROOT, "sponsors"],
    queryFn: getSponsorDashboard,
  });
}

export function useAdminSettings() {
  return useQuery({
    queryKey: [...ROOT, "settings"],
    queryFn: getAdminSettings,
  });
}

export function useAdminPromotions() {
  return useQuery({
    queryKey: [...ROOT, "promotions"],
    queryFn: getAdminPromotions,
  });
}

export function useFederationImports() {
  return useQuery({
    queryKey: [...ROOT, "federation"],
    queryFn: listFederationImports,
  });
}

function useInvalidateAdmin() {
  const qc = useQueryClient();
  return () => void qc.invalidateQueries({ queryKey: [...ROOT] });
}

export function useCreateAdminClub() {
  const invalidate = useInvalidateAdmin();
  return useMutation({
    mutationFn: (body: { name: string; city: string; slug?: string }) =>
      createAdminClub(body),
    onSuccess: invalidate,
  });
}

export function usePatchAdminClub() {
  const invalidate = useInvalidateAdmin();
  return useMutation({
    mutationFn: (input: { id: string; body: Record<string, unknown> }) =>
      patchAdminClub(input.id, input.body),
    onSuccess: invalidate,
  });
}

export function useAddClubManager() {
  const invalidate = useInvalidateAdmin();
  return useMutation({
    mutationFn: (input: { clubId: string; emailOrUserId: string }) =>
      addClubManager(input.clubId, input.emailOrUserId),
    onSuccess: invalidate,
  });
}

export function useRemoveClubManager() {
  const invalidate = useInvalidateAdmin();
  return useMutation({
    mutationFn: (input: { clubId: string; userId: string }) =>
      removeClubManager(input.clubId, input.userId),
    onSuccess: invalidate,
  });
}

export function useCreateAdminCoach() {
  const invalidate = useInvalidateAdmin();
  return useMutation({
    mutationFn: (body: {
      email: string;
      firstName: string;
      lastName: string;
      city?: string;
    }) => createAdminCoach(body),
    onSuccess: invalidate,
  });
}

export function usePatchCoachAssessPermission() {
  const invalidate = useInvalidateAdmin();
  return useMutation({
    mutationFn: (input: { coachId: string; allowed: boolean }) =>
      patchCoachAssessPermission(input.coachId, input.allowed),
    onSuccess: invalidate,
  });
}

export function useResolveAppeal() {
  const invalidate = useInvalidateAdmin();
  return useMutation({
    mutationFn: (input: { appealId: string; accept: boolean }) =>
      resolveAppeal(input.appealId, input.accept),
    onSuccess: invalidate,
  });
}

export function usePutAdminSetting() {
  const invalidate = useInvalidateAdmin();
  return useMutation({
    mutationFn: (input: { key: string; value: unknown }) =>
      putAdminSetting(input.key, input.value),
    onSuccess: invalidate,
  });
}

export function useDeleteAdminSetting() {
  const invalidate = useInvalidateAdmin();
  return useMutation({
    mutationFn: (key: string) => deleteAdminSetting(key),
    onSuccess: invalidate,
  });
}

export function useCreateAdminPromotion() {
  const invalidate = useInvalidateAdmin();
  return useMutation({
    mutationFn: (body: {
      code: string;
      type: "PERCENT" | "FIXED";
      value: number;
    }) => createAdminPromotion(body),
    onSuccess: invalidate,
  });
}

export function useCreateAdminSponsor() {
  const invalidate = useInvalidateAdmin();
  return useMutation({
    mutationFn: (body: { name: string; city?: string }) =>
      createAdminSponsor(body),
    onSuccess: invalidate,
  });
}

export function usePatchAdminMatchResult() {
  const invalidate = useInvalidateAdmin();
  return useMutation({
    mutationFn: (input: {
      matchId: string;
      scoreA: number;
      scoreB: number;
      note?: string;
    }) =>
      patchAdminMatchResult(input.matchId, {
        scoreA: input.scoreA,
        scoreB: input.scoreB,
        note: input.note,
      }),
    onSuccess: invalidate,
  });
}

export function useVoidAdminMatch() {
  const invalidate = useInvalidateAdmin();
  return useMutation({
    mutationFn: (matchId: string) => voidAdminMatch(matchId),
    onSuccess: invalidate,
  });
}

export function useCreateFederationImport() {
  const invalidate = useInvalidateAdmin();
  return useMutation({
    mutationFn: (body: { dryRun?: boolean; fileName?: string }) =>
      createFederationImport(body),
    onSuccess: invalidate,
  });
}
