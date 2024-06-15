import { env } from "./../../env";

export async function signInGoogle() {
  window.open(`${env.VITE_API_URL}/auth/google/callback`, "_self");
}
