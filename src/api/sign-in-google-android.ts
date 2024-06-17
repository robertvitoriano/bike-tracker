import { api } from "@/lib/axios";
import { useAuthStore } from "@/lib/store/authStore";

export interface SignInGoogleBody {
  googleToken: string;
}

export async function signInLoginAndroid({ googleToken }: SignInGoogleBody) {
  try {
    const loginResponse = await api.post("/auth/google-android", {
      googleToken,
    });
    if (loginResponse.data.data) {
      useAuthStore.getState().setToken(loginResponse.data.data.token);
      useAuthStore.getState().setLoggedUser(loginResponse.data.data.user);
      return loginResponse.data.data;
    }
    useAuthStore.getState().setToken(loginResponse.data.token);
    useAuthStore.getState().setLoggedUser(loginResponse.data.user);
    return loginResponse.data;
  } catch (error) {
    console.error("Error in signInLoginAndroid:", error);
    throw error;
  }
}
