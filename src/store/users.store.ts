import lotussApi from "@/lib/axios";
import { create } from "zustand";

interface UsersState {
  users: User[];
  getUsers: (token: string) => void;
}

const useUsersStore = create<UsersState>((set) => ({
  users: [],
  getUsers: async (token: string) => {
    const res = await lotussApi("/usuarios", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    set({ users: res.data });
  },
}));

export default useUsersStore;
