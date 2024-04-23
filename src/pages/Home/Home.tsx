import { useEffect, useState } from "react";
import MapboxMap from "react-map-gl";
import { getCurrentLocation } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationCrosshairs } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const [mapCoordinates, setMapCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  useEffect(() => {
    requestCurrentLocation();
  }, []);
  async function requestCurrentLocation() {
    try {
      const currentLocation = await getCurrentLocation();
      console.log({ currentLocation });
      setMapCoordinates(currentLocation);
    } catch (error) {}
  }
  return (
    <div className="flex flex-col w-screen h-screen items-center justify-center relative">
      {mapCoordinates ? (
        <MapboxMap
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
          initialViewState={{
            zoom: 14,
          }}
          latitude={mapCoordinates.latitude}
          longitude={mapCoordinates.longitude}
          mapStyle="mapbox://styles/mapbox/streets-v9"
        />
      ) : (
        <h1>You must give permission to get your location </h1>
      )}
      <div
        className="absolute right-3 bottom-28"
        onClick={requestCurrentLocation}
      >
        <FontAwesomeIcon
          icon={faLocationCrosshairs}
          className="text-5xl text-primary"
        />
      </div>
    </div>
  );
}
