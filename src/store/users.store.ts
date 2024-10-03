import lotussApi from "@/lib/axios";
import { create } from "zustand";

interface UsersState {
  users: User[];
  user: User | null;
  getUsers: (token: string) => void;
  setUser: (id: number, token: string) => void;
}

const useUsersStore = create<UsersState>((set) => ({
  users: [],
  user: null,
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
      console.log(error);
    }
  },
}));

export default useUsersStore;
