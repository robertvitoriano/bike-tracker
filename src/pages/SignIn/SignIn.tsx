import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signIn } from "@/api/sign-in";
import { signInGoogle } from "@/api/sign-in-google";
import googleIcon from "@/assets/Logo-google-icon.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useAuthStore } from "@/lib/store/authStore";
import { getProfile } from "@/api/get-profile";
import { signInLoginAndroid } from "@/api/sign-in-google-android";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { Device } from "@capacitor/device";
import { env } from "../../../env";

const signInForm = z.object({
  email: z.string(),
  password: z.string(),
});

type SignInForm = z.infer<typeof signInForm>;

export const SignIn = () => {
  const setToken = useAuthStore((state: any) => state.setToken);
  const token = useAuthStore((state: any) => state.token);
  const setLoggedUser = useAuthStore((state: any) => state.setLoggedUser);
  const { data: profile } = useQuery({
    queryKey: ["get-profile"],
    queryFn: getProfile,
    enabled: !!token,
  });

  useEffect(() => {
    GoogleAuth.initialize({
      clientId: env.VITE_GOOGLE_CLIENT_ID,
      scopes: ["profile", "email"],
      grantOfflineAccess: true,
    });

    verifyGoogleLogin();
  }, []);

  useEffect(() => {
    handleGoogleLoginSuccess();
  }, [profile]);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignInForm>();

  const { mutateAsync: signFn } = useMutation({
    mutationFn: signIn,
  });

  const { mutateAsync: signInGoogleFn } = useMutation({
    mutationFn: signInGoogle,
  });

  const { mutateAsync: signInLoginAndroidFn } = useMutation({
    mutationFn: signInLoginAndroid,
  });

  const navigate = useNavigate();

  async function handleSignIn(data: SignInForm) {
    try {
      await signFn({
        email: data.email,
        password: data.password,
      });
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSignInGoogleAndroid() {
    try {
      const googleResponse = await GoogleAuth.signIn();

      //@ts-ignore
      const googleToken = googleResponse.authentication.accessToken;
      await signInLoginAndroidFn({ googleToken });
      navigate("/");
    } catch (error) {
      console.error("Google Sign-In Error:" + JSON.stringify(error));
    }
  }

  async function handleGoogleLogin() {
    const info = await Device.getInfo();
    const platform = info.platform;
    if (platform === "android") {
      await handleSignInGoogleAndroid();
    }
    if (platform === "web") {
      await signInGoogleFn();
    }
  }

  function handleGoogleLoginSuccess() {
    if (profile) {
      setLoggedUser(profile);
      navigate("/");
    }
  }

  async function verifyGoogleLogin() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      setToken(token);
    }
  }

  return (
    <div className="w-full h-fit flex justify-center items-center flex-col gap-8">
      <h1 className="text-white font-bold text-2xl">
        Sign in and start to ride!
      </h1>
      <form
        onSubmit={handleSubmit(handleSignIn)}
        className="p-4 bg-secondary rounded-md flex items-center flex-col gap-4"
      >
        <h1 className="text-white font-bold text-2xl">Bike Tracker</h1>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" {...register("password")} />
        </div>
        <Button type="submit" disabled={isSubmitting}>
          Sign In
        </Button>
      </form>
      <div
        className="p-4 flex gap-4 items-center bg-white rounded-full cursor-pointer"
        onClick={handleGoogleLogin}
      >
        <img src={googleIcon} className="h-8 w-8 rounded-full" />
        <span>Continue with Google</span>
      </div>
      <span
        className="cursor-pointer text-white hover:underline"
        onClick={() => navigate("/sign-up")}
      >
        Don't have an account yet ? click here to sign up!
      </span>
    </div>
  );
};
