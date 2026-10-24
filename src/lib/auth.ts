export function loginPath(nextPath?: string | null): string {
  if (!nextPath || nextPath.length === 0) {
    return "/login";
  }
  return `/login?next=${encodeURIComponent(nextPath)}`;
}

export function registerPath(nextPath?: string | null): string {
  if (!nextPath || nextPath.length === 0) {
    return "/register";
  }
  return `/register?next=${encodeURIComponent(nextPath)}`;
}

export function safeNextPath(raw: string | null | undefined): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) {
    return "/player/home";
  }
  return raw;
}

/** Href that redirects guests to login with return path. */
export function authAwareHref(path: string, isAuthenticated: boolean): string {
  return isAuthenticated ? path : loginPath(path);
}

/** All `/player/*` routes require a session (dashboard). */
export function isPlayerAuthRequired(pathname: string): boolean {
  return pathname.startsWith("/player");
}
