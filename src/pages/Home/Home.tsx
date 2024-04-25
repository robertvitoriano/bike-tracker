import { useEffect, useState, useRef } from "react";
import MapboxMap, { NavigationControl, Source, Layer } from "react-map-gl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationCrosshairs } from "@fortawesome/free-solid-svg-icons";
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
  //@ts-ignore
  const [userPath, setUserPath] = useState<[[number, number]]>([]);
  const { mainMap } = useMap();
  const pathRef = useRef(null);

  useEffect(() => {
    loadInitialState();
  }, []);

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
          const pointAlreadyInUserPath = userPath.some(
            ([alreadyComputedLongitude, alreadyComputedLatitude]) =>
              alreadyComputedLatitude === latitude &&
              alreadyComputedLongitude === longitude
          );
          if (pointAlreadyInUserPath) return;
          //@ts-ignore
          setUserPath((prevPath) => [...prevPath, [longitude, latitude]]);
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
          <Source
            id="userPath"
            type="geojson"
            data={{
              type: "Feature",
              properties: {},
              geometry: { type: "LineString", coordinates: userPath },
            }}
            //@ts-ignore
            ref={pathRef}
          >
            <Layer
              id="userPath"
              type="line"
              source="userPath"
              layout={{ "line-join": "round", "line-cap": "round" }}
              paint={{ "line-color": "#007cbf", "line-width": 5 }}
            />
          </Source>
          {showUserLocationMarker && (
            <MapMarker {...userCurrentPosition}>
              <div className="h-4 w-4 rounded-full bg-[#007cbf] border border-solid border-white"></div>
            </MapMarker>
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
              className={`p-4 hover:bg-secondary cursor-pointer ${selectedLabel === url ? "bg-secondary" : "bg-primary"}`}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
