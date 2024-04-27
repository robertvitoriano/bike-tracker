import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay, faCirclePause } from "@fortawesome/free-solid-svg-icons";
import { useUserTrackStore } from "@/lib/store/userTrackStore";
import { Popover, PopoverContent } from "@/components/ui/popover";
export const BottomNavigation = () => {
  let watchId: number;
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
  useEffect(() => {
    if (isTrackingPosition) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const pointAlreadyInUserPath = userCurrentTrack.some(
            ([alreadyComputedLongitude, alreadyComputedLatitude]) =>
              alreadyComputedLatitude === latitude &&
              alreadyComputedLongitude === longitude
          );
          if (pointAlreadyInUserPath) return;

          setUserCurrentPosition({ longitude, latitude });
          addCoordinateToCurrentTrack([longitude, latitude]);
          console.log("USER POSITION SHOULD UPDATE");
        },
        (error) => {
          console.error("Error watching position:", error);
        }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [isTrackingPosition]);

  const [displayTrackSavingPopOver, setDisplayTrackingSavingPopOver] =
    useState(false);
  const [newTrackTitle, setNewTrackTitle] = useState("");

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
    setDisplayTrackingSavingPopOver(false);
  }

  function handleStartTrackingButtonClick() {
    toggleTrackingPosition();
    if (!isTrackingPosition) {
      startTrackingUserPosition();
      return;
    }
  }
  function handleStopTrackingButtonClick() {
    setDisplayTrackingSavingPopOver(true);
    toggleTrackingPosition();
  }
  return (
    <>
      <div className="w-full bg-primary flex px-2 py-1  gap-2 items-center justify-center fixed bottom-0 z-50">
        {isTrackingPosition ? (
          <FontAwesomeIcon
            icon={faCirclePause}
            className={`bg-white rounded-full text-4xl cursor-pointer text-red-500`}
            onClick={handleStopTrackingButtonClick}
          />
        ) : (
          <FontAwesomeIcon
            icon={faCirclePlay}
            className={`bg-white rounded-full text-4xl cursor-pointer text-green-500`}
            onClick={handleStartTrackingButtonClick}
          />
        )}
      </div>
      <Popover>
        <PopoverContent>
          {displayTrackSavingPopOver && (
            <div>
              <h2>Modal Title</h2>
              <p>Modal content goes here.</p>
              <input
                value={newTrackTitle}
                onChange={(e) => setNewTrackTitle(e.target.value)}
              />

              {newTrackTitle && (
                <button onClick={handleTrackSaving}>Save</button>
              )}
              <button onClick={() => setDisplayTrackingSavingPopOver(false)}>
                Discard
              </button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </>
  );
};
