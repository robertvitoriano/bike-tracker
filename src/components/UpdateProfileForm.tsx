import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { updateProfile } from "@/api/update-profile";
import { useMutation } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

export function UpdateProfileForm() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<{ weight: number; name: string; username: string }>();
  const { mutateAsync: updateProfileFn } = useMutation({
    mutationFn: updateProfile,
  });

  function handleProfileUpdate(values) {
    console.log({ submittedValues: values });
  }

  return (
    <form
      onSubmit={handleSubmit(handleProfileUpdate)}
      className="w-full max-w-sm mx-auto"
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="name" className="w-24 text-right">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Ex: John Doe"
              {...register("name")}
              className="flex-1"
            />
          </div>
          <div className="flex items-center gap-4">
            <Label htmlFor="username" className="w-24 text-right">
              Username
            </Label>
            <Input
              id="username"
              placeholder="Ex: johndoe"
              {...register("username")}
              className="flex-1"
            />
          </div>
          <div className="flex items-center gap-4 relative">
            <Label htmlFor="weight" className="w-24 text-right">
              Weight
            </Label>
            <Input
              id="weight"
              placeholder="Ex: 65.3"
              {...register("weight")}
              className="flex-1"
            />
            <span className="font-bold absolute right-4 top-2">KG</span>
          </div>
        </div>
        <Button type="submit" disabled={isSubmitting}>
          Update
        </Button>
      </div>
    </form>
  );
}
