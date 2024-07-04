import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { IProfile, updateProfile } from "@/api/update-profile";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { getProfile } from "@/api/get-profile";
import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";

export function UpdateProfileForm() {
  const loggedUser = useAuthStore((state: any) => state.loggedUser);
  const setLoggedUser = useAuthStore((state: any) => state.setLoggedUser);
  const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["get-profile"],
    queryFn: getProfile,
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<{ weight: number; name: string; username: string }>({
    defaultValues: {
      weight: profileData?.weight ?? 0.0,
      name: profileData?.name ?? "",
      username: profileData?.username ?? "",
    },
  });

  const { mutateAsync: updateProfileFn } = useMutation({
    mutationFn: updateProfile,
  });

  async function handleProfileUpdate(values: IProfile) {
    try {
      const { data: updatedProfile }: IProfile | any =
        await updateProfileFn(values);
      setLoggedUser({ ...loggedUser, ...updatedProfile });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (profileData) {
      reset(profileData);
    }
  }, [profileData, reset]);

  if (isLoadingProfile) {
    return <div>Loading...</div>;
  }

  return (
    <form
      onSubmit={handleSubmit(handleProfileUpdate)}
      className="w-full max-w-sm mx-auto pt-4 p-8 bg-white rounded-lg"
    >
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Update Profile
      </h2>
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
              className="flex-1 px-4 py-2 border rounded-md focus:outline-none"
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
              className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
            />
          </div>
          <div className="flex items-center gap-4 relative">
            <Label htmlFor="weight" className="w-24 text-right text-gray-600">
              Weight
            </Label>
            <Input
              id="weight"
              placeholder="Ex: 65.3"
              {...register("weight")}
              className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
            />
            <span className="font-bold absolute right-4 top-2 text-gray-600">
              KG
            </span>
          </div>
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 text-white font-semibold rounded-md focus:outline-none focus:ring-2"
        >
          {isSubmitting ? "Updating..." : "Update"}
        </Button>
      </div>
    </form>
  );
}
