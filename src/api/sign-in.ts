import { api } from "@/lib/axios";
import { useAuthStore } from "@/lib/store/authStore";
export interface SignInBody {
  email: string;
  password: string;
}
export async function signIn({ email, password }: SignInBody) {
  const loginResponse = await api.post("/users/login", { email, password });
  useAuthStore.getState().setToken(loginResponse.data.token);
  useAuthStore.getState().setLoggedUser(loginResponse.data.user);

  console.log({ loginResponse });
}
