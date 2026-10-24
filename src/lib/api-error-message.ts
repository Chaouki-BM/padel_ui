import { ApiError } from "@/services/api";

export function getApiErrorMessage(
  err: unknown,
  fallback: string,
): string {
  if (err instanceof ApiError) {
    return err.message || fallback;
  }
  if (err instanceof Error && err.message) {
    return err.message;
  }
  return fallback;
}
