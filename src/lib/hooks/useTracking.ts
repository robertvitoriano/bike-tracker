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
  const { mainMap } = useMap();

  let tracktTimerId: NodeJS.Timeout;
  let watchId: number;

  useEffect(() => {
    if (isTrackingPosition) {
      tracktTimerId = setInterval(() => updateCurrentTrackTime(), 1000);
      const tolerance = 0.00001; // Adjust as needed based on your accuracy requirements

      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          mainMap?.flyTo({ center: [longitude, latitude] });
          const pointAlreadyInUserPath = userCurrentTrack.some(
            ([alreadyComputedLongitude, alreadyComputedLatitude]) =>
              Math.abs(alreadyComputedLatitude - latitude) < tolerance &&
              Math.abs(alreadyComputedLongitude - longitude) < tolerance
          );

          if (pointAlreadyInUserPath) return;

          setUserCurrentPosition({ longitude, latitude });
          addCoordinateToCurrentTrack([longitude, latitude]);
          updateCurrentTrackDistance();
        },
        (error) => {
          console.error("Error watching position:", error);
        }
      );
      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    } else {
      if (watchId) navigator.geolocation.clearWatch(watchId);
      if (tracktTimerId) clearInterval(tracktTimerId);
    }
  }, [isTrackingPosition]);
}
