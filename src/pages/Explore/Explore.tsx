import { useEffect, useState, useRef } from "react";
import MapboxMap, { NavigationControl, Source, Layer } from "react-map-gl";
import { useMap } from "react-map-gl";
import { ImmutableLike } from "react-map-gl/dist/esm/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationCrosshairs } from "@fortawesome/free-solid-svg-icons";
import { MapMarker } from "./MapMarker";
import { getCurrentLocation } from "@/lib/utils";
import { layers } from "@/lib/layers";
import { useUserTrackStore } from "@/lib/store/userTrackStore";
import { useDialogStore } from "@/lib/store/useDialogStore";

import { env } from "../../../env";
import { SavedTracksDrawer } from "./SavedTracksDrawer";

import { MapConfigurations } from "./MapConfigurations";
export function Explore() {
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
  const [openSavedTracksDrawer, setOpenSavedTracksDrawer] =
    useState<boolean>(false);
  const [savedTrackSelected, setSavedTrackSelected] = useState(false);

  const userCurrentPosition = useUserTrackStore(
    (state: any) => state.userCurrentPosition
  );
  const setUserCurrentPosition = useUserTrackStore(
    (state: any) => state.setUserCurrentPosition
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
  const selectedSaveTrack = useUserTrackStore(
    (state: any) => state.selectedSaveTrack
  );
  const selectSavedTrack = useUserTrackStore(
    (state: any) => state.selectSavedTrack
  );

  const { exploreMap } = useMap();
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
    exploreMap?.flyTo({ center: [longitude, latitude], zoom: 19 });
  }

  async function handleUserTracking() {
    await flyToUserCurrentPosition();
    if (!isUserLocationMarkerShowing) {
      toggleUserLocationMarker();
    }
  }
  function getTrackToBeDisplayed() {
    return selectedSaveTrack?.coordinates || [];
  }
  function handleSavedTrackSelection(track) {
    selectSavedTrack(track);
    setSavedTrackSelected(true);
    if (!isUserLocationMarkerShowing) toggleUserLocationMarker();
    const { coordinates } = track;
    const [longitude, latitude] = coordinates[0];
    exploreMap?.flyTo({ center: [longitude, latitude], zoom: 19 });
    setOpenSavedTracksDrawer(false);
  }

  return (
    <div className="flex flex-col w-screen h-screen items-center justify-center relative">
      {!displayTrackSavingPopOver && !openSavedTracksDrawer && (
        <div
          onClick={() => setOpenSavedTracksDrawer(true)}
          className="bg-primary text-white font-bold rounded-xl p-4 flex flex-col gap-4 items-center absolute top-20 left-auto z-50"
        >
          <h1>Open saved Tracks</h1>
        </div>
      )}
      <SavedTracksDrawer
        open={openSavedTracksDrawer}
        handleSavedTrackSelection={handleSavedTrackSelection}
        onClose={() => setOpenSavedTracksDrawer(false)}
      />
      {permissionGranted ? (
        <MapboxMap
          mapboxAccessToken={env.VITE_MAPBOX_TOKEN}
          initialViewState={initialState}
          mapStyle={selectedLayer}
          id="exploreMap"
        >
          {savedTrackSelected && (
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
                className={`h-4 w-4 rounded-full bg-[#007cbf] border border-solid border-white`}
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
