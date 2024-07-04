import {
  DialogContent,
  DialogTitle,
  DialogDescription,
  Dialog,
} from "@/components/ui/dialog";
import { DialogHeader } from "./ui/dialog";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { updateProfile } from "@/api/update-profile";
import { useMutation } from "@tanstack/react-query";
import { Button } from "./ui/button";

export function RequestWeightDialog({ open, onSubmit, onCancel, submitting }) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<{ weight: number }>();
  const { mutateAsync: updateProfileFn } = useMutation({
    mutationFn: updateProfile,
  });
  function handleProfileUpdate(values) {
    console.log({ submittedValues: values });
  }
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Weight</DialogTitle>
          <DialogDescription>Add your current weight bellow</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleProfileUpdate)}>
          <div className="flex gap-4">
            <Input placeholder="Ex: 65.3" {...register("weight")} />
            <span className="font-bold">KG</span>
          </div>
          <Button type="submit" disabled={isSubmitting} />
        </form>
      </DialogContent>
    </Dialog>
  );
}
