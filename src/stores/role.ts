import { type Role } from "@/lib/constants";
import { create } from "zustand";

type RoleState = {
  role: Role;
  setRole: (role: Role) => void;
};

export const useRoleStore = create<RoleState>((set) => ({
  role: "player",
  setRole: (role) => set({ role }),
}));
