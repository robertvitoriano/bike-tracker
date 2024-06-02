import { signUp } from "@/api/sign-up";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  async function handleSignUp(data: SignUpForm) {
    try {
      await signUpFn({
        name: data.name,
        username: data.username,
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
      <h1 className="text-white font-bold text-2xl">Create your account!</h1>
      <form
        onSubmit={handleSubmit(handleSignUp)}
        className="p-4 bg-secondary rounded-md flex items-center flex-col gap-4"
      >
        <h1 className="text-white font-bold text-2xl">Bike Tracker</h1>
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" type="name" {...register("name")} />
        </div>{" "}
        <div>
          <Label htmlFor="username">Username</Label>
          <Input id="username" type="username" {...register("username")} />
        </div>
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
        onClick={() => navigate("/sign-in")}
      >
        Already have an account ? click here to sign in!
      </span>
    </div>
  );
};
