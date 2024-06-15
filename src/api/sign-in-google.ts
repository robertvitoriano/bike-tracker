import { api } from "@/lib/axios";
import { useAuthStore } from "@/lib/store/authStore";
export interface SignInBody {
  email: string;
  password: string;
}
export async function signInGoogle() {
  const loginResponse = await api.get("/auth/google/callback");
  useAuthStore.getState().setToken(loginResponse.data.token);
  useAuthStore.getState().setLoggedUser(loginResponse.data.user);

  console.log({ loginResponse });
}
