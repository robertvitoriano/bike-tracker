import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay, faCirclePause } from "@fortawesome/free-solid-svg-icons";
import { useUserTrackStore } from "@/lib/store/userTrackStore";
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
  useEffect(() => {
    if (isTrackingPosition) {
      const watchId = navigator.geolocation.watchPosition(
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

  function startTrackingUserPosition() {
    if (isTrackingPosition) {
      navigator.geolocation.clearWatch(watchId);
    }
    toggleTrackingPosition();
  }
  return (
    <div className="w-full bg-primary flex px-2 py-1  gap-2 items-center justify-center fixed bottom-0 z-50">
      <FontAwesomeIcon
        icon={isTrackingPosition ? faCirclePause : faCirclePlay}
        className="text-secondary text-4xl"
        onClick={startTrackingUserPosition}
      />
    </div>
  );
};
