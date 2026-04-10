// src/store/useAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  name: string;
  email: string;
  mobile?: string;
  avatar?: string;
};

type AuthState = {
  user: User | null;

  login: (user: User) => void;
  logout: () => void;
};

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      login: (user) =>
        set({
          user
        }),

      logout: () =>
        set({
          user: null,
        }),
    }),
    {
      name: "auth-store",
    }
  )
);

export default useAuthStore;