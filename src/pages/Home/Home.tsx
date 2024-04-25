import { useEffect, useState } from "react";
import MapboxMap, { NavigationControl } from "react-map-gl";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBicycle,
  faLocationCrosshairs,
} from "@fortawesome/free-solid-svg-icons";
import { useMap } from "react-map-gl";
import { MapMarker } from "./MapMarker";
import { getCurrentLocation } from "@/lib/utils";

export default function Home() {
  const [initialState, setInitialState] = useState({});
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [showUserLocationMarker, setShowUserLocationMarker] = useState(false);
  const [userCurrentPosition, setUserCurrentPosition] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [updatedTimes, setUpdatedTimes] = useState(0);

  useEffect(() => {
    loadInitialState();
  }, []);
  const { mainMap } = useMap();

  async function loadInitialState() {
    try {
      const { latitude, longitude } = await getCurrentLocation();
      setInitialState({ latitude, longitude, zoom: 14 });
      setPermissionGranted(true);
    } catch (error) {
      console.error("Error getting initial location:", error);
    }
  }

  function startTrackingUserPosition() {
    if (!showUserLocationMarker) {
      setShowUserLocationMarker(true);
      navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserCurrentPosition({ latitude, longitude });
          setUpdatedTimes((prev) => prev + 1);
        },
        (error) => {
          console.error("Error watching position:", error);
        }
      );
    }
  }

  async function flyToUserCurrentPosition() {
    const { latitude, longitude } = await getCurrentLocation();
    mainMap?.flyTo({ center: [longitude, latitude] });
  }

  return (
    <div className="flex flex-col w-screen h-screen items-center justify-center relative">
      <h1 className="absolute top-20 left-auto z-50">
        Updated Times: {updatedTimes}
      </h1>
      {permissionGranted ? (
        <MapboxMap
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
          initialViewState={initialState}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          id="mainMap"
        >
          {showUserLocationMarker && (
            <MapMarker
              icon={faBicycle}
              {...userCurrentPosition}
              className="text-primary text-2xl cursor-pointer"
            />
          )}
          <NavigationControl
            position="bottom-left"
            style={{ marginBottom: "4rem" }}
          />
        </MapboxMap>
      ) : (
        <h1>You must give permission to get your location </h1>
      )}
      <div className="absolute right-3 bottom-28">
        <FontAwesomeIcon
          icon={faLocationCrosshairs}
          className="text-5xl text-primary cursor-pointer"
          onClick={() => {
            flyToUserCurrentPosition();
            startTrackingUserPosition();
          }}
        />
      </div>
    </div>
  );
}
