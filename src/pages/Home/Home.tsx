import { useEffect, useState } from "react";
import MapboxMap, { NavigationControl } from "react-map-gl";

import { getCurrentLocation } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBicycle,
  faLocationCrosshairs,
} from "@fortawesome/free-solid-svg-icons";
import { useMap } from "react-map-gl";
import { MapMarker } from "./MapMarker";

export default function Home() {
  const [initialState, setInitialState] = useState({});
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [showUserLocationMarker, setShowUserLocationMarker] = useState(false);
  const [userCurrentPosition, setUserCurrentPosition] = useState<{
    latitude: number;
    longitude: number;
  }>({ latitude: 0, longitude: 0 });
  const [updatedTimes, setUpdatedTimes] = useState(0);
  useEffect(() => {
    loadInitialState();
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (showUserLocationMarker) {
      intervalId = setInterval(() => {
        setUserCurrentPosition((prevPosition) => ({
          latitude: prevPosition.latitude + 0.0005,
          longitude: prevPosition.longitude,
        }));
      }, 500);
    }

    return () => clearInterval(intervalId);
  }, [showUserLocationMarker]);
  const { mainMap } = useMap();
  async function flyToUserCurrentPosition() {
    try {
      if (!showUserLocationMarker) {
        const { latitude, longitude } = await getCurrentLocation();
        mainMap?.flyTo({ center: [longitude, latitude] });
        setUserCurrentPosition({ latitude, longitude });
        setShowUserLocationMarker(true);
        return;
      }
      mainMap?.flyTo({
        center: [userCurrentPosition.longitude, userCurrentPosition.latitude],
      });
    } catch (error) {}
  }
  async function loadInitialState() {
    const { latitude, longitude } = await getCurrentLocation();
    setInitialState({ latitude, longitude, zoom: 14 });
    setPermissionGranted(true);
  }
  async function watchUserPostionChanges() {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setUserCurrentPosition({ latitude, longitude });
        console.log({ position });
        setUpdatedTimes(updatedTimes + 1);
      },
      (error) => console.error(error)
    );

    return () => navigator.geolocation.clearWatch(watchId);
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
      <div
        className="absolute right-3 bottom-28"
        onClick={flyToUserCurrentPosition}
      >
        <FontAwesomeIcon
          icon={faLocationCrosshairs}
          className="text-5xl text-primary"
        />
      </div>
    </div>
  );
}
