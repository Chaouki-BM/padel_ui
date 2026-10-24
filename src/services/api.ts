import { useSessionStore } from "@/stores/session";

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly requestId: string | null;
  readonly messages: string[];

  constructor(
    status: number,
    code: string,
    message: string,
    options?: { requestId?: string | null; messages?: string[] },
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.requestId = options?.requestId ?? null;
    this.messages = options?.messages ?? [message];
  }
}

export type ApiFetchOptions = RequestInit & {
  /** Skip Authorization header (login, register, refresh). */
  skipAuth?: boolean;
  /** Do not attempt token refresh on 401. */
  skipRefresh?: boolean;
};

function isMswMode(): boolean {
  return process.env.NEXT_PUBLIC_USE_MSW === "true";
}

function getBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_API_URL;
  if (configured && configured.length > 0) {
    return configured.replace(/\/$/, "");
  }
  // Offline MSW: same-origin `/api/v1/...` intercepted by the worker
  if (isMswMode()) {
    return "";
  }
  if (typeof window === "undefined") {
    return "http://localhost:3000/api/v1";
  }
  return "";
}

function resolvePath(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  // When MSW is on without an absolute API URL, hit same-origin /api/v1/*
  if (isMswMode() && !process.env.NEXT_PUBLIC_API_URL) {
    if (normalized.startsWith("/api/v1") || normalized.startsWith("/api/")) {
      return normalized;
    }
    return `/api/v1${normalized}`;
  }
  return normalized;
}

function formatErrorMessage(message: unknown): { text: string; messages: string[] } {
  if (Array.isArray(message)) {
    const messages = message.map(String);
    return { text: messages.join(", "), messages };
  }
  if (typeof message === "string" && message.length > 0) {
    return { text: message, messages: [message] };
  }
  return { text: "http_error", messages: ["http_error"] };
}

async function parseError(response: Response): Promise<ApiError> {
  try {
    const body: unknown = await response.json();
    if (body && typeof body === "object") {
      const record = body as Record<string, unknown>;
      const { text, messages } = formatErrorMessage(record.message);
      const code =
        typeof record.error === "string" ? record.error : "http_error";
      const requestId =
        typeof record.requestId === "string" ? record.requestId : null;
      return new ApiError(response.status, code, text, { requestId, messages });
    }
  } catch {
    // fall through
  }
  return new ApiError(response.status, "http_error", response.statusText || "http_error");
}

async function parseBody<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T;
  }
  const text = await response.text();
  if (!text) {
    return undefined as T;
  }
  return JSON.parse(text) as T;
}

let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const refreshToken = useSessionStore.getState().refreshToken;
    if (!refreshToken) {
      useSessionStore.getState().logout();
      return false;
    }

    try {
      const url = `${getBaseUrl()}/auth/refresh`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        useSessionStore.getState().logout();
        return false;
      }

      const data = (await response.json()) as {
        accessToken?: string;
        refreshToken?: string;
      };

      if (!data.accessToken || !data.refreshToken) {
        useSessionStore.getState().logout();
        return false;
      }

      useSessionStore.getState().setTokens(data.accessToken, data.refreshToken);
      return true;
    } catch {
      useSessionStore.getState().logout();
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export async function apiFetch<T>(
  path: string,
  init?: ApiFetchOptions,
): Promise<T> {
  const { skipAuth, skipRefresh, ...requestInit } = init ?? {};
  const url = `${getBaseUrl()}${resolvePath(path)}`;

  const headers = new Headers(requestInit.headers);
  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }
  if (
    requestInit.body !== undefined &&
    !(requestInit.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  if (!skipAuth) {
    const accessToken = useSessionStore.getState().accessToken;
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
  }

  const response = await fetch(url, { ...requestInit, headers });

  if (
    response.status === 401 &&
    !skipAuth &&
    !skipRefresh &&
    useSessionStore.getState().refreshToken
  ) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return apiFetch<T>(path, { ...init, skipRefresh: true });
    }
  }

  if (!response.ok) {
    throw await parseError(response);
  }

  return parseBody<T>(response);
}
