import { apiRoleToApp } from "@/lib/api-role";
import {
  authTokensSchema,
  forgotPasswordBodySchema,
  meAccountSchema,
  resetPasswordBodySchema,
  verifyEmailBodySchema,
  type LoginBody,
  type RegisterBody,
} from "@/schemas/auth";
import { ApiError, apiFetch } from "@/services/api";
import { useRoleStore } from "@/stores/role";
import { useSessionStore, type SessionUser } from "@/stores/session";

function toSessionUser(account: {
  id: string;
  email: string;
  role: string;
  emailVerified?: boolean;
  firstName?: string | null;
  lastName?: string | null;
  profile?: {
    firstName?: string | null;
    lastName?: string | null;
  } | null;
}): SessionUser {
  return {
    id: account.id,
    email: account.email,
    role: apiRoleToApp(account.role),
    firstName: account.profile?.firstName ?? account.firstName ?? null,
    lastName: account.profile?.lastName ?? account.lastName ?? null,
    emailVerified: account.emailVerified ?? false,
  };
}

async function applyTokensAndLoadMe(
  accessToken: string,
  refreshToken: string,
): Promise<SessionUser> {
  useSessionStore.getState().setTokens(accessToken, refreshToken);
  const me = await apiFetch<unknown>("/me");
  const account = meAccountSchema.parse(me);
  const user = toSessionUser(account);
  useSessionStore.getState().setUser(user);
  useRoleStore.getState().setRole(user.role);
  return user;
}

export async function login(body: LoginBody): Promise<SessionUser> {
  const raw = await apiFetch<unknown>("/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
    skipAuth: true,
    skipRefresh: true,
  });
  const tokens = authTokensSchema.parse(raw);
  return applyTokensAndLoadMe(tokens.accessToken, tokens.refreshToken);
}

export async function register(body: RegisterBody): Promise<SessionUser> {
  const raw = await apiFetch<unknown>("/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
    skipAuth: true,
    skipRefresh: true,
  });
  const tokens = authTokensSchema.parse(raw);
  return applyTokensAndLoadMe(tokens.accessToken, tokens.refreshToken);
}

export async function forgotPassword(email: string): Promise<void> {
  const body = forgotPasswordBodySchema.parse({ email });
  await apiFetch<unknown>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(body),
    skipAuth: true,
    skipRefresh: true,
  });
}

export async function resetPassword(
  token: string,
  password: string,
): Promise<void> {
  const body = resetPasswordBodySchema.parse({ token, password });
  await apiFetch<unknown>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(body),
    skipAuth: true,
    skipRefresh: true,
  });
}

export async function verifyEmail(token: string): Promise<void> {
  const body = verifyEmailBodySchema.parse({ token });
  await apiFetch<unknown>("/auth/verify-email", {
    method: "POST",
    body: JSON.stringify(body),
    skipAuth: true,
    skipRefresh: true,
  });
}

export async function resendVerification(): Promise<void> {
  await apiFetch<unknown>("/me/resend-verification", {
    method: "POST",
  });
}

/** Calls API logout when possible, always clears local session. */
export async function signOut(): Promise<void> {
  const refreshToken = useSessionStore.getState().refreshToken;
  try {
    if (refreshToken) {
      await apiFetch<unknown>("/auth/logout", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
        skipRefresh: true,
      });
    }
  } catch (err) {
    if (!(err instanceof ApiError)) {
      // ignore network errors on logout
    }
  } finally {
    useSessionStore.getState().logout();
  }
}
