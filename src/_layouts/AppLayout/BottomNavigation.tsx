import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay, faCirclePause } from "@fortawesome/free-solid-svg-icons";
import { useUserTrackStore } from "@/lib/store/userTrackStore";
import { useDialogStore } from "@/lib/store/useDialogStore";
export const BottomNavigation = () => {
  const isTrackingPosition = useUserTrackStore(
    (state: any) => state.isTrackingPosition
  );
  const toggleTrackingPosition = useUserTrackStore(
    (state: any) => state.toggleTrackingPosition
  );
  const toggleUserLocationMarker = useUserTrackStore(
    (state: any) => state.toggleUserLocationMarker
  );
  const isUserLocationMarkerShowing = useUserTrackStore(
    (state: any) => state.isUserLocationMarkerShowing
  );

  const cleanSelectedTrack = useUserTrackStore(
    (state: any) => state.cleanSelectedTrack
  );

  const togglePauseTrackPopOver = useDialogStore(
    (state: any) => state.togglePauseTrackPopOver
  );

  function startTrackingUserPosition() {
    if (!isUserLocationMarkerShowing) {
      toggleUserLocationMarker();
    }
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
    togglePauseTrackPopOver();
    toggleTrackingPosition();
  }

  return (
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
  );
};
