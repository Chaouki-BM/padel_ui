import { type Role, ROLES } from "@/lib/constants";

const API_TO_APP: Record<string, Role> = {
  PLAYER: "player",
  CLUB: "club",
  COACH: "coach",
  ADMIN: "admin",
  SPONSOR: "sponsor",
};

export function apiRoleToApp(role: string): Role {
  const mapped = API_TO_APP[role.toUpperCase()];
  if (mapped) return mapped;
  const lower = role.toLowerCase();
  if ((ROLES as readonly string[]).includes(lower)) {
    return lower as Role;
  }
  return "player";
}

export function appRoleToApi(role: Role): string {
  return role.toUpperCase();
}
