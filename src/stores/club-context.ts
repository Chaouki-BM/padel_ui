"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type ClubContextState = {
  activeClubId: string | null;
  setActiveClubId: (id: string | null) => void;
};

export const useClubContextStore = create<ClubContextState>()(
  persist(
    (set) => ({
      activeClubId: null,
      setActiveClubId: (id) => set({ activeClubId: id }),
    }),
    { name: "padel-club-context" },
  ),
);
