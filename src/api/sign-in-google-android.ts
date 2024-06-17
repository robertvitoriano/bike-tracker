import { api } from "@/lib/axios";

export interface SignInGoogleBody {
  googleToken: string;
}

export async function signInLoginAndroid({ googleToken }: SignInGoogleBody) {
  try {
    const loginResponse = await api.post("/auth/google-android", {
      googleToken,
    });
    return loginResponse.data;
  } catch (error) {
    console.error("Error in signInLoginAndroid:", error);
    throw error;
  }
}
