import { useEffect, useState, useRef } from "react";
import MapboxMap, { NavigationControl, Source, Layer } from "react-map-gl";
import { useMap } from "react-map-gl";
import { ImmutableLike } from "react-map-gl/dist/esm/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationCrosshairs } from "@fortawesome/free-solid-svg-icons";
import { MapMarker } from "./MapMarker";
import { getCurrentLocation, getFormattedTime } from "@/lib/utils";
import { layers } from "@/lib/layers";
import { useUserTrackStore } from "@/lib/store/userTrackStore";
import { env } from "../../../env";
import { useTracking } from "@/lib/hooks/useTracking";

import { MapConfigurations } from "./MapConfigurations";
export default function Record() {
  type mapStyleType =
    | string
    | mapboxgl.Style
    | ImmutableLike<mapboxgl.Style>
    | undefined;

  const [initialState, setInitialState] = useState({});
  const [permissionGranted, setPermissionGranted] = useState(false);

  const [selectedLayer, setSelectedLayer] = useState<mapStyleType>(
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

  const currentTrackTime = useUserTrackStore(
    (state: any) => state.currentTrackTime
  );
  const currentTrackDistance = useUserTrackStore(
    (state: any) => state.currentTrackDistance
  );
  const { recordingMap } = useMap();
  const pathRef = useRef(null);

  useTracking();

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
    recordingMap?.flyTo({ center: [longitude, latitude], zoom: 19 });
  }

  async function handleUserTracking() {
    await flyToUserCurrentPosition();
    if (!isUserLocationMarkerShowing) {
      toggleUserLocationMarker();
    }
  }
  function getTrackToBeDisplayed() {
    if (isTrackingPosition) {
      return userCurrentTrack;
    }
  }

  return (
    <div className="flex flex-col w-screen h-screen items-center justify-center relative">
      {isTrackingPosition && (
        <div className="bg-primary text-white font-bold rounded-xl p-4 flex flex-col gap-4 items-center absolute top-20 left-auto z-50">
          <h1>Time elapsed: {getFormattedTime(currentTrackTime)}</h1>
          {currentTrackDistance < 1 ? (
            <h1>
              Total Distance: {(currentTrackDistance * 1000).toFixed(2)} meters
            </h1>
          ) : (
            <h1>Total Distance: {currentTrackDistance.toFixed(2)} Km</h1>
          )}
        </div>
      )}
      {permissionGranted ? (
        <MapboxMap
          mapboxAccessToken={env.VITE_MAPBOX_TOKEN}
          initialViewState={initialState}
          mapStyle={selectedLayer}
          id="recordingMap"
        >
          {isTrackingPosition && (
            <Source
              id="userPath"
              type="geojson"
              data={{
                type: "Feature",
                properties: {},
                geometry: {
                  type: "LineString",
                  coordinates: getTrackToBeDisplayed(),
                },
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
        <div className="bg-white p-4 rounded-full flex items-center justify-center">
          <FontAwesomeIcon
            icon={faLocationCrosshairs}
            className="text-2xl cursor-pointer"
            onClick={handleUserTracking}
          />
        </div>
        <div className="bg-white p-4 rounded-full flex items-center justify-center">
          <MapConfigurations
            selectedLayer={selectedLayer}
            setSelectedLayer={setSelectedLayer}
          />
        </div>
      </div>
    </div>
  );
}
