import { create } from "zustand";
interface IAuthStore {
  loggedUser: { name: string; email: string; username: string };
  token: string;
  setLoggedUser: Function;
  setToken: Function;
}
export const useAuthStore = create<IAuthStore>((set) => ({
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
