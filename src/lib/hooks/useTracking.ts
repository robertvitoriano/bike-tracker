import { useEffect } from "react";
import { useMap } from "react-map-gl";
import { useUserTrackStore } from "../store/userTrackStore";
export function useTracking() {
  const setUserCurrentPosition = useUserTrackStore(
    (state: any) => state.setUserCurrentPosition
  );
  const updateCurrentTrackTime = useUserTrackStore(
    (state: any) => state.updateCurrentTrackTime
  );
  const updateCurrentTrackDistance = useUserTrackStore(
    (state: any) => state.updateCurrentTrackDistance
  );
  const addCoordinateToCurrentTrack = useUserTrackStore(
    (state: any) => state.addCoordinateToCurrentTrack
  );
  const userCurrentTrack = useUserTrackStore(
    (state: any) => state.userCurrentTrack
  );
  const isTrackingPosition = useUserTrackStore(
    (state: any) => state.isTrackingPosition
  );
  const { recordingMap } = useMap();

  let tracktTimerId: NodeJS.Timeout;
  let watchId: number;

  useEffect(() => {
    if (isTrackingPosition) {
      runPositionTracking();
    }
    return () => {
      stopTracking();
    };
  }, [isTrackingPosition]);

  function stopTracking() {
    if (watchId) navigator.geolocation.clearWatch(watchId);
    if (tracktTimerId) clearInterval(tracktTimerId);
  }
  function runPositionTracking() {
    tracktTimerId = setInterval(() => updateCurrentTrackTime(), 1000);
    watchId = navigator.geolocation.watchPosition(
      onWatchTracking,
      onWatchError
    );
  }
  function onWatchTracking(position) {
    const tolerance = 0.00001;

    const { latitude, longitude } = position.coords;

    recordingMap?.flyTo({ center: [longitude, latitude] });

    const pointAlreadyInUserPath = userCurrentTrack.some(
      ([alreadyComputedLongitude, alreadyComputedLatitude]) =>
        Math.abs(alreadyComputedLatitude - latitude) < tolerance &&
        Math.abs(alreadyComputedLongitude - longitude) < tolerance
    );

    if (pointAlreadyInUserPath) return;

    setUserCurrentPosition({ longitude, latitude });
    addCoordinateToCurrentTrack([longitude, latitude]);
    updateCurrentTrackDistance();
  }
  function onWatchError(error) {
    console.error("Error watching position:", error);
  }
  return {
    stopTracking,
  };
}
