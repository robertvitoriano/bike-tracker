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
import { layers } from "@/lib/layers";
import { ImmutableLike } from "react-map-gl/dist/esm/types";

export default function Home() {
  type mapStyleType =
    | string
    | mapboxgl.Style
    | ImmutableLike<mapboxgl.Style>
    | undefined;

  const [initialState, setInitialState] = useState({});
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [showUserLocationMarker, setShowUserLocationMarker] = useState(false);
  const [userCurrentPosition, setUserCurrentPosition] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [selectedLabel, setSelectedLabel] = useState<mapStyleType>(
    layers.STREET.url
  );
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
      {showUserLocationMarker && (
        <>
          <h1 className="absolute top-20 left-auto z-50">
            Latitude: {userCurrentPosition.latitude}
          </h1>
          <h1 className="absolute top-24 left-auto z-50">
            longitude: {userCurrentPosition.longitude}
          </h1>
        </>
      )}
      {permissionGranted ? (
        <MapboxMap
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
          initialViewState={initialState}
          mapStyle={selectedLabel}
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
            style={{ position: "absolute", left: "0.75rem", bottom: "8rem" }}
          />
        </MapboxMap>
      ) : (
        <h1>You must give permission to get your location </h1>
      )}
      <div className="absolute right-3 bottom-32 flex flex-col gap-4">
        <FontAwesomeIcon
          icon={faLocationCrosshairs}
          className="text-5xl text-primary cursor-pointer"
          onClick={() => {
            flyToUserCurrentPosition();
            startTrackingUserPosition();
          }}
        />
        <div className="">
          {Object.entries(layers).map(([_, { label, url }]) => (
            <div
              onClick={() => setSelectedLabel(url)}
              className={`p-4 hover:bg-secondary ${selectedLabel === url ? "bg-secondary" : "bg-primary"}`}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
