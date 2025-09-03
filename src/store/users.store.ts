import lotussApi from "@/lib/axios";
import { AxiosError } from "axios";
import { create } from "zustand";

interface UsersState {
  users: User[];
  user: User | null;
  error: boolean;
  getUsers: (token: string) => void;
  setUser: (id: number, token: string) => void;
  setUserData: (user: User) => void;
  updateUserCredits: (amount: number) => void;
}

const useUsersStore = create<UsersState>((set) => ({
  users: [],
  user: null,
  error: false,
  getUsers: async (token: string) => {
    const res = await lotussApi("/usuarios", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    set({ users: res.data });
  },
  setUser: async (id: number, token: string) => {
    try {
      const userActive = await lotussApi(`/usuarios/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({ user: userActive.data });
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          console.log(error.response.data);
          set({ error: true });
        }
      }
    }
  },
  setUserData: (user: User) => {
    set({ user: user });
  },
  updateUserCredits: (amount: number) => {
    set((state) => ({
      user: state.user ? { ...state.user, creditos: state.user.creditos - amount } : null
    }));
  },
}));

export default useUsersStore;
