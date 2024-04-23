import { useEffect, useState } from "react";
import Map from "react-map-gl";
import { getCurrentLocation } from "./lib/utils";

export default function App() {
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
      setMapCoordinates(currentLocation);
    } catch (error) {}
  }
  return (
    <div className="flex flex-col w-screen h-screen items-center justify-center">
      {mapCoordinates ? (
        <Map
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
          initialViewState={{
            zoom: 14,
            latitude: mapCoordinates.latitude,
            longitude: mapCoordinates.longitude,
          }}
          mapStyle="mapbox://styles/mapbox/streets-v9"
        />
      ) : (
        <h1>You must give permission to get your location </h1>
      )}
    </div>
  );
}
