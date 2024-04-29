import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay, faCirclePause } from "@fortawesome/free-solid-svg-icons";
import { useUserTrackStore } from "@/lib/store/userTrackStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useDialogStore } from "@/lib/store/useDialogStore";
import { useMap } from "react-map-gl";
export const BottomNavigation = () => {
  let watchId: number;

  const [newTrackTitle, setNewTrackTitle] = useState("");
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
  const displayTrackSavingPopOver = useDialogStore(
    (state: any) => state.displayTrackSavingPopOver
  );
  const toggleTrackSavingPopOver = useDialogStore(
    (state: any) => state.toggleTrackSavingPopOver
  );

  const { mainMap } = useMap();

  useEffect(() => {
    if (isTrackingPosition) {
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
      return () => navigator.geolocation.clearWatch(watchId);
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

  function handleTrackSaving() {
    if (localStorage.getItem("tracks")) {
      localStorage.setItem(
        "tracks",
        JSON.stringify([
          ...JSON.parse(localStorage.getItem("tracks")),
          {
            title: newTrackTitle,
            coordinates: userCurrentTrack,
          },
        ])
      );
    } else {
      localStorage.setItem(
        "tracks",
        JSON.stringify([
          {
            title: newTrackTitle,
            coordinates: userCurrentTrack,
          },
        ])
      );
    }
    cleanCurrentTrack();

    toggleTrackSavingPopOver();
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
      <Dialog open={displayTrackSavingPopOver}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Save Track</DialogTitle>
            <DialogDescription>Save your new track!</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="trackTitle" className="text-right">
                Track Title
              </Label>
              <Input
                id="trackTitle"
                value={newTrackTitle}
                className="col-span-3"
                onChange={(e) => setNewTrackTitle(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleTrackSaving}>Save new track</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
