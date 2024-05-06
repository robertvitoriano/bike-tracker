import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleStop,
  faHouse,
  faMap,
} from "@fortawesome/free-solid-svg-icons";
import { useUserTrackStore } from "@/lib/store/userTrackStore";
import { useDialogStore } from "@/lib/store/useDialogStore";
import { useNavigate, useLocation } from "react-router-dom";
import { navigationLinks } from "./navigationLinks";
export const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
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
    navigate("/record");
    if (!isTrackingPosition) {
      startTrackingUserPosition();
      return;
    }
  }
  function handlePauseTrackingButtonClick() {
    togglePauseTrackPopOver();
    toggleTrackingPosition();
  }
  console.log({ location });

  return (
    <>
      {
        <div className="w-full bg-primary flex justify-between items-end p-2 fixed bottom-0 z-50 gap-8">
          <div className="flex gap-8">
            {navigationLinks.slice(0, 2).map((link) => (
              <FontAwesomeIcon
                icon={link.icon}
                className={`text-[1.5rem] ${location.pathname === link.path && "text-secondary"} cursor-pointer `}
                onClick={() => navigate(link.path)}
              />
            ))}
          </div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
            {isTrackingPosition ? (
              <FontAwesomeIcon
                icon={faCircleStop}
                className="bg-white rounded-full text-5xl cursor-pointer text-red-500"
                onClick={handlePauseTrackingButtonClick}
              />
            ) : (
              <div
                className="bg-red-500 rounded-full cursor-pointer flex justify-center items-center text-white text-sm h-12 w-12"
                onClick={handleStartTrackingButtonClick}
              >
                <span>Rec</span>
              </div>
            )}
          </div>
          {navigationLinks.slice(2, navigationLinks.length).map((link) => (
            <FontAwesomeIcon
              icon={link.icon}
              className={`text-[1.5rem] ${location.pathname === link.path && "text-secondary"} cursor-pointer `}
              onClick={() => navigate(link.path)}
            />
          ))}
        </div>
      }
    </>
  );
};
