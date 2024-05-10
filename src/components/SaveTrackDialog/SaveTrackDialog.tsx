import {
  DialogContent,
  DialogTitle,
  DialogDescription,
  Dialog,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { DialogHeader } from "../ui/dialog";
import { Input } from "../ui/input";
import { useDialogStore } from "@/lib/store/useDialogStore";
import { useUserTrackStore } from "@/lib/store/userTrackStore";
import { ITrack, storeUserTrack } from "@/api/store-user-track";
import { useMap } from "react-map-gl";
export function SaveTrackDialog() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<{ title: string }>();
  const { mutateAsync: storeUserTrackFn } = useMutation({
    mutationFn: storeUserTrack,
  });

  const displayTrackSavingPopOver = useDialogStore(
    (state: any) => state.displayTrackSavingPopOver
  );
  const userCurrentTrack = useUserTrackStore(
    (state: any) => state.userCurrentTrack
  );
  const toggleTrackSavingPopOver = useDialogStore(
    (state: any) => state.toggleTrackSavingPopOver
  );
  const cleanCurrentTrack = useUserTrackStore(
    (state: any) => state.cleanCurrentTrack
  );
  const currentTrackTime = useUserTrackStore(
    (state: any) => state.currentTrackTime
  );
  const clearCurrentTrackTime = useUserTrackStore(
    (state: any) => state.clearCurrentTrackTime
  );
  const currentTrackDistance = useUserTrackStore(
    (state: any) => state.currentTrackDistance
  );
  const toggleTakingScreenShot = useUserTrackStore(
    (state: any) => state.toggleTakingScreenShot
  );
  const { recordingMap } = useMap();
  async function handleTrackSaving(data) {
    toggleTakingScreenShot();
    const centerPosition = userCurrentTrack[userCurrentTrack.length / 2];
    recordingMap.setCenter(centerPosition);
    const fileUrl = recordingMap.getCanvas().toDataURL() as unknown as File;
    const trackData: ITrack = {
      title: data.title,
      coordinates: userCurrentTrack,
      time: currentTrackTime,
      distance: currentTrackDistance,
      image: fileUrl,
    };
    await storeUserTrackFn(trackData);
    cleanCurrentTrack();
    clearCurrentTrackTime();
    toggleTrackSavingPopOver();
    toggleTakingScreenShot();
  }

  return (
    <Dialog open={displayTrackSavingPopOver}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Track</DialogTitle>
          <DialogDescription>Save your new track!</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleTrackSaving)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Track Title
              </Label>
              <Input id="title" className="col-span-3" {...register("title")} />
            </div>
          </div>
          <Button
            type="submit"
            disabled={isSubmitting || userCurrentTrack.length <= 1}
          >
            Save new track
          </Button>
          {!isSubmitting && userCurrentTrack.length <= 1 && (
            <span className="text-red-500">
              Current track is not long enough to be saved, ride more!
            </span>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
