import { useEffect, useState, useRef } from "react";
import MapboxMap, { NavigationControl, Source, Layer } from "react-map-gl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationCrosshairs } from "@fortawesome/free-solid-svg-icons";
import { useMap } from "react-map-gl";
import { MapMarker } from "./MapMarker";
import { getCurrentLocation } from "@/lib/utils";
import { layers } from "@/lib/layers";
import { ImmutableLike } from "react-map-gl/dist/esm/types";
import { useUserTrackStore } from "@/lib/store/userTrackStore";
import { useDialogStore } from "@/lib/store/useDialogStore";

export default function Home() {
  type mapStyleType =
    | string
    | mapboxgl.Style
    | ImmutableLike<mapboxgl.Style>
    | undefined;

  const [initialState, setInitialState] = useState({});
  const [permissionGranted, setPermissionGranted] = useState(false);

  const [selectedLabel, setSelectedLabel] = useState<mapStyleType>(
    layers.STREET.url
  );
  const userCurrentTrack = useUserTrackStore(
    (state: any) => state.userCurrentTrack
  );
  const userCurrentPosition = useUserTrackStore(
    (state: any) => state.userCurrentPosition
  );
  const setUserCurrentPosition = useUserTrackStore(
    (state: any) => state.setUserCurrentPosition
  );
  const isTrackingPosition = useUserTrackStore(
    (state: any) => state.isTrackingPosition
  );
  const toggleUserLocationMarker = useUserTrackStore(
    (state: any) => state.toggleUserLocationMarker
  );
  const isUserLocationMarkerShowing = useUserTrackStore(
    (state: any) => state.isUserLocationMarkerShowing
  );
  const displayTrackSavingPopOver = useDialogStore(
    (state: any) => state.displayTrackSavingPopOver
  );

  const { mainMap } = useMap();
  const pathRef = useRef(null);

  useEffect(() => {
    loadInitialState();
  }, []);

  async function loadInitialState() {
    try {
      const { latitude, longitude } = await getCurrentLocation();
      setInitialState({ latitude, longitude, zoom: 14 });
      setUserCurrentPosition({ latitude, longitude });
      setPermissionGranted(true);
    } catch (error) {
      console.error("Error getting initial location:", error);
    }
  }

  async function flyToUserCurrentPosition() {
    const { latitude, longitude } = await getCurrentLocation();
    mainMap?.flyTo({ center: [longitude, latitude] });
  }

  async function handleUserTracking() {
    flyToUserCurrentPosition();
    if (!isUserLocationMarkerShowing) {
      toggleUserLocationMarker();
    }
  }
  return (
    <div className="flex flex-col w-screen h-screen items-center justify-center relative">
      {isTrackingPosition && (
        <div className="bg-primary text-white font-bold rounded-xl p-4 flex flex-col gap-4 items-center absolute top-20 left-auto z-50">
          <h1>Latitude: {userCurrentPosition.latitude}</h1>
          <h1>longitude: {userCurrentPosition.longitude}</h1>
        </div>
      )}
      {!isTrackingPosition && !displayTrackSavingPopOver && (
        <div className="bg-primary text-white font-bold rounded-xl p-4 flex flex-col gap-4 items-center absolute top-20 left-auto z-50">
          <h1>Open saved Tracks</h1>
        </div>
      )}
      {permissionGranted ? (
        <MapboxMap
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
          initialViewState={initialState}
          mapStyle={selectedLabel}
          id="mainMap"
        >
          {isTrackingPosition && (
            <Source
              id="userPath"
              type="geojson"
              data={{
                type: "Feature",
                properties: {},
                geometry: { type: "LineString", coordinates: userCurrentTrack },
              }}
              //@ts-ignore
              ref={pathRef}
            >
              <Layer
                id="userPath"
                type="line"
                source="userPath"
                layout={{ "line-join": "round", "line-cap": "round" }}
                paint={{ "line-color": "#0972aa", "line-width": 5 }}
              />
            </Source>
          )}
          {isUserLocationMarkerShowing && (
            <MapMarker {...userCurrentPosition}>
              <div
                className={`${isTrackingPosition ? "pulse" : ""} h-4 w-4 rounded-full bg-[#007cbf] border border-solid border-white`}
              ></div>
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
          onClick={handleUserTracking}
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
