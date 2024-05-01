import { create } from "zustand";

export const useAuthStore = create((set) => ({
  loggedUser: null,
  token: "",
  setLoggedUser: (loggedUser) =>
    set(() => ({
      loggedUser,
    })),
  setToken: (token) =>
    set(() => ({
      token,
    })),
}));
