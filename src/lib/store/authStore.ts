import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
interface IAuthStore {
  loggedUser: { name: string; email: string; username: string };
  token: string;
  setLoggedUser: Function;
  setToken: Function;
}
export const useAuthStore = create<IAuthStore>(
  //@ts-ignore
  persist(
    (set) => ({
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
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
