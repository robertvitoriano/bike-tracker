import { api } from "@/lib/axios";
import { useAuthStore } from "@/lib/store/authStore";
export interface signUpBody {
  email: string;
  password: string;
  name: string;
  username: string;
}
export async function signUp({ email, password, name, username }: signUpBody) {
  const signUpResponse = await api.post("/users", {
    email,
    password,
    name,
    username,
  });
  useAuthStore.getState().setToken(signUpResponse.data.token);
  useAuthStore.getState().setLoggedUser(signUpResponse.data.token);
}
