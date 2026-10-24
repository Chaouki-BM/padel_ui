import { type Role } from "@/lib/constants";

export function canAccess(role: Role, allowed: readonly Role[]): boolean {
  return allowed.includes(role);
}
