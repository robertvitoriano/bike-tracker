import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay, faCirclePause } from "@fortawesome/free-solid-svg-icons";
import { useUserTrackStore } from "@/lib/store/userTrackStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { useMap } from "react-map-gl";
import { SaveTrackDialog } from "@/components/SaveTrackDialog";
import { useDialogStore } from "@/lib/store/useDialogStore";
export const BottomNavigation = () => {
  let watchId: number;
  let tracktTimerId: NodeJS.Timeout;
  const [displayPauseTrackPopOver, setDisplayPauseTrackPopOver] =
    useState(false);
  const addCoordinateToCurrentTrack = useUserTrackStore(
    (state: any) => state.addCoordinateToCurrentTrack
  );
  const userCurrentTrack = useUserTrackStore(
    (state: any) => state.userCurrentTrack
  );
  const isTrackingPosition = useUserTrackStore(
    (state: any) => state.isTrackingPosition
  );
  const toggleTrackingPosition = useUserTrackStore(
    (state: any) => state.toggleTrackingPosition
  );
  const setUserCurrentPosition = useUserTrackStore(
    (state: any) => state.setUserCurrentPosition
  );
  const toggleUserLocationMarker = useUserTrackStore(
    (state: any) => state.toggleUserLocationMarker
  );
  const isUserLocationMarkerShowing = useUserTrackStore(
    (state: any) => state.isUserLocationMarkerShowing
  );
  const cleanCurrentTrack = useUserTrackStore(
    (state: any) => state.cleanCurrentTrack
  );
  const cleanSelectedTrack = useUserTrackStore(
    (state: any) => state.cleanSelectedTrack
  );
  const currentTrackTime = useUserTrackStore(
    (state: any) => state.currentTrackTime
  );
  const setCurrentTrackTime = useUserTrackStore(
    (state: any) => state.setCurrentTrackTime
  );
  const toggleTrackSavingPopOver = useDialogStore(
    (state: any) => state.toggleTrackSavingPopOver
  );
  const { mainMap } = useMap();

  useEffect(() => {
    if (isTrackingPosition) {
      tracktTimerId = setInterval(
        () => setCurrentTrackTime(currentTrackTime + 1),
        1000
      );
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          mainMap?.flyTo({ center: [longitude, latitude] });
          const pointAlreadyInUserPath = userCurrentTrack.some(
            ([alreadyComputedLongitude, alreadyComputedLatitude]) =>
              alreadyComputedLatitude === latitude &&
              alreadyComputedLongitude === longitude
          );
          if (pointAlreadyInUserPath) return;

          setUserCurrentPosition({ longitude, latitude });
          addCoordinateToCurrentTrack([longitude, latitude]);
        },
        (error) => {
          console.error("Error watching position:", error);
        }
      );
      return () => {
        stopTimer();
        navigator.geolocation.clearWatch(watchId);
      };
    }
  }, [isTrackingPosition]);

  function startTrackingUserPosition() {
    if (isTrackingPosition) {
      navigator.geolocation.clearWatch(watchId);
    }
    if (!isUserLocationMarkerShowing) {
      toggleUserLocationMarker();
    }
  }

  function stopTimer() {
    clearInterval(tracktTimerId);
  }

  function handleStartTrackingButtonClick() {
    cleanSelectedTrack();
    toggleTrackingPosition();
    if (!isTrackingPosition) {
      startTrackingUserPosition();
      return;
    }
  }
  function handlePauseTrackingButtonClick() {
    setDisplayPauseTrackPopOver(true);
    toggleTrackingPosition();
    stopTimer();
  }
  function handleResumeTrackingButtonClick() {
    toggleTrackingPosition();
    setDisplayPauseTrackPopOver(false);
  }
  function handleTrackSaveButtonClick() {
    toggleTrackSavingPopOver();
    setDisplayPauseTrackPopOver(false);
  }

  function handleTrackDiscardButtonClick() {
    cleanCurrentTrack();
    setDisplayPauseTrackPopOver(false);
  }

  return (
    <>
      <SaveTrackDialog />

      <div className="w-full bg-primary flex px-2 py-1  gap-2 items-center justify-center fixed bottom-0 z-50">
        {isTrackingPosition ? (
          <FontAwesomeIcon
            icon={faCirclePause}
            className={`bg-white rounded-full text-4xl cursor-pointer text-red-500`}
            onClick={handlePauseTrackingButtonClick}
          />
        ) : (
          <FontAwesomeIcon
            icon={faCirclePlay}
            className={`bg-white rounded-full text-4xl cursor-pointer text-green-500`}
            onClick={handleStartTrackingButtonClick}
          />
        )}
      </div>
      <Dialog open={displayPauseTrackPopOver}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tracking pause</DialogTitle>
            <DialogDescription>The tracking has been paused!</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button onClick={handleResumeTrackingButtonClick}>Resume</Button>
            <Button onClick={handleTrackDiscardButtonClick}>
              Discard track
            </Button>
            <Button onClick={handleTrackSaveButtonClick}>
              Save current track
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
