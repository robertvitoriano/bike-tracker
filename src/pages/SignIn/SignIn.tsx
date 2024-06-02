import { signIn } from "@/api/sign-in";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
const signInForm = z.object({
  email: z.string(),
  password: z.string(),
});

type SignInForm = z.infer<typeof signInForm>;

export const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignInForm>();
  const { mutateAsync: signFn } = useMutation({
    mutationFn: signIn,
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
      <span
        className=" cursor-pointer text-white hover:underline"
        onClick={() => navigate("/sign-up")}
      >
        Don't have an account yet ? click here to sign up!
      </span>
    </div>
  );
};
