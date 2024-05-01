import { api } from "@/lib/axios";
export interface signUpBody {
  email: string;
  password: string;
}
export async function signUp({ email, password }: signUpBody) {
  const loginResponse = await api.post("/users/login", { email, password });
}
