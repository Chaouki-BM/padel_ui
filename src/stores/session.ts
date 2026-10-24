"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type Role } from "@/lib/constants";

export type SessionUser = {
  id: string;
  email: string;
  role: Role;
  firstName: string | null;
  lastName: string | null;
  emailVerified: boolean;
};

type SessionState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: SessionUser | null;
  isAuthenticated: boolean;
  displayName: string | null;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: SessionUser) => void;
  setSession: (payload: {
    accessToken: string;
    refreshToken: string;
    user: SessionUser;
  }) => void;
  /** Local clear only — prefer `signOut()` from auth service for API logout. */
  logout: () => void;
};

function displayNameFromUser(user: SessionUser): string {
  const parts = [user.firstName, user.lastName].filter(Boolean);
  if (parts.length > 0) return parts.join(" ");
  return user.email;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      displayName: null,
      setTokens: (accessToken, refreshToken) =>
        set({
          accessToken,
          refreshToken,
          isAuthenticated: Boolean(accessToken),
        }),
      setUser: (user) =>
        set({
          user,
          displayName: displayNameFromUser(user),
          isAuthenticated: true,
        }),
      setSession: ({ accessToken, refreshToken, user }) =>
        set({
          accessToken,
          refreshToken,
          user,
          displayName: displayNameFromUser(user),
          isAuthenticated: true,
        }),
      logout: () =>
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          displayName: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "padel-session",
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        displayName: state.displayName,
      }),
    },
  ),
);
