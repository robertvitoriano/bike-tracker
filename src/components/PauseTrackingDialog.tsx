import {
  DialogContent,
  DialogTitle,
  DialogDescription,
  Dialog,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { DialogHeader } from "./ui/dialog";
import { useUserTrackStore } from "@/lib/store/userTrackStore";
import { useDialogStore } from "@/lib/store/useDialogStore";
export function PauseTrackingDialog() {
  const cleanCurrentTrack = useUserTrackStore(
    (state: any) => state.cleanCurrentTrack,
  );
  const clearCurrentTrackDistance = useUserTrackStore(
    (state: any) => state.clearCurrentTrackDistance,
  );
  const clearCurrentTrackTime = useUserTrackStore(
    (state: any) => state.clearCurrentTrackTime,
  );
  const toggleTrackSavingPopOver = useDialogStore(
    (state: any) => state.toggleTrackSavingPopOver,
  );
  const toggleTrackingPosition = useUserTrackStore(
    (state: any) => state.toggleTrackingPosition,
  );
  const togglePauseTrackPopOver = useDialogStore(
    (state: any) => state.togglePauseTrackPopOver,
  );
  const displayPauseTrackPopOver = useDialogStore(
    (state: any) => state.displayPauseTrackPopOver,
  );
  function handleResumeTrackingButtonClick() {
    toggleTrackingPosition();
    togglePauseTrackPopOver();
  }
  function handleTrackSaveButtonClick() {
    toggleTrackSavingPopOver();
    togglePauseTrackPopOver();
  }

  function handleTrackDiscardButtonClick() {
    cleanCurrentTrack();
    clearCurrentTrackDistance();
    clearCurrentTrackTime();
    togglePauseTrackPopOver();
  }
  return (
    <Dialog open={displayPauseTrackPopOver}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tracking pause</DialogTitle>
          <DialogDescription>The tracking has been paused!</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button onClick={handleResumeTrackingButtonClick}>Resume</Button>
          <Button onClick={handleTrackDiscardButtonClick}>Discard track</Button>
          <Button onClick={handleTrackSaveButtonClick}>
            Save current track
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
