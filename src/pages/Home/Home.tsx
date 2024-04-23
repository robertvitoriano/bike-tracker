import { useEffect, useState } from "react";
import MapboxMap from "react-map-gl";
import { getCurrentLocation } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationCrosshairs } from "@fortawesome/free-solid-svg-icons";
import { useMap } from "react-map-gl";

export default function Home() {
  const [initialState, setInitialState] = useState({});
  const [permissionGranted, setPermissionGranted] = useState(false);
  useEffect(() => {
    loadInitialState();
  }, []);
  const { mainMap } = useMap();
  async function flyToCurrentPosition() {
    try {
      const { latitude, longitude } = await getCurrentLocation();
      mainMap?.flyTo({ center: [longitude, latitude] });
    } catch (error) {}
  }
  async function loadInitialState() {
    const { latitude, longitude } = await getCurrentLocation();
    setInitialState({ latitude, longitude, zoom: 14 });
    setPermissionGranted(true);
  }
  return (
    <div className="flex flex-col w-screen h-screen items-center justify-center relative">
      {permissionGranted ? (
        <MapboxMap
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
          initialViewState={initialState}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          id="mainMap"
        />
      ) : (
        <h1>You must give permission to get your location </h1>
      )}
      <div
        className="absolute right-3 bottom-28"
        onClick={flyToCurrentPosition}
      >
        <FontAwesomeIcon
          icon={faLocationCrosshairs}
          className="text-5xl text-primary"
        />
      </div>
    </div>
  );
}
