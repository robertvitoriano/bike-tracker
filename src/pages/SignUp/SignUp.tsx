import { signUp } from "@/api/sign-up";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

const signUpForm = z.object({
  email: z.string(),
  password: z.string(),
  username: z.string(),
  name: z.string(),
});

type SignUpForm = z.infer<typeof signUpForm>;

export const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignUpForm>();
  const { mutateAsync: signUpFn } = useMutation({
    mutationFn: signUp,
  });
  async function handleSignUp(data: SignInForm) {
    try {
      await signUpFn({
        name: data.name,
        username: data.username,
        email: data.email,
        password: data.password,
      });
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className="w-full h-full flex justify-center items-center flex-col gap-8">
      <h1 className="text-white font-bold text-2xl">
        Sign in and start to ride!
      </h1>
      <form
        onSubmit={handleSubmit(handleSignUp)}
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
    </div>
  );
};
