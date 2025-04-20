import { create } from "zustand";

interface LoginState {
  showLogin: boolean;
  setShowLogin: (value: boolean) => void;
}

export const useLoginStore = create<LoginState>((set) => ({
  showLogin: false,
  setShowLogin: (value: boolean) => set({ showLogin: value }),
}));
