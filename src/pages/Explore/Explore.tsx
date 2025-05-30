import { useEffect, useState, useRef } from "react";
import MapboxMap, { NavigationControl, Source, Layer } from "react-map-gl";
import { useMap } from "react-map-gl";
import { ImmutableLike } from "react-map-gl/dist/esm/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFlagCheckered,
  faLocationCrosshairs,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { MapMarker } from "./MapMarker";
import { getCurrentLocation } from "@/lib/utils";
import { layers } from "@/lib/layers";
import { useUserTrackStore } from "@/lib/store/userTrackStore";
import { useDialogStore } from "@/lib/store/useDialogStore";

import { env } from "../../../env";
import { SavedTracksDrawer } from "./SavedTracksDrawer";

import { MapConfigurations } from "./MapConfigurations";
import { getUserLocations } from "@/api/get-locations";
import { useQuery } from "@tanstack/react-query";
import trackFinishIcon from "@/assets/pennant-flag.png";
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
  const cleanSelectedTrack = useUserTrackStore(
    (state: any) => state.cleanSelectedTrack
  );

  const { exploreMap } = useMap();
  const { data: userLocations, isLoading: isLoadingUserLocations } = useQuery({
    queryKey: ["get-user-locations"],
    queryFn: getUserLocations,
  });
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
    const { coordinates } = track;
    const [longitude, latitude] = coordinates[0];
    exploreMap?.flyTo({ center: [longitude, latitude], zoom: 19 });
    setOpenSavedTracksDrawer(false);
  }

  function areCoordinatesEqual(
    coord1: number[],
    coord2: number[],
    epsilon = 1e-6
  ): boolean {
    if (!coord1 || !coord2) return false;
    const latEqual = Math.abs(coord1[0] - coord2[0]) < epsilon;
    const longEqual = Math.abs(coord1[1] - coord2[1]) < epsilon;

    return latEqual && longEqual;
  }

  function renderLocationIconBasedOnType(location): any {
    switch (location.type) {
      case "generic":
        return (
          <FontAwesomeIcon
            className="text-4xl text-primary"
            icon={faLocationDot}
          />
        );
      case "track-finish":
        if (
          areCoordinatesEqual(
            location?.coordinates,
            selectedSaveTrack?.coordinates[
              selectedSaveTrack?.coordinates.length - 1
            ]
          )
        ) {
          return <img src={trackFinishIcon} className="h-8" />;
        }
        break;
      case "track-start":
        return <FontAwesomeIcon icon={faFlagCheckered} className="h-8" />;
    }
  }

  function handleSavedTrackClose() {
    cleanSelectedTrack();
  }

  return (
    <div className="flex flex-col w-screen h-screen items-center justify-center relative">
      {!displayTrackSavingPopOver &&
        !openSavedTracksDrawer &&
        !selectedSaveTrack && (
          <div
            onClick={() => setOpenSavedTracksDrawer(true)}
            className="bg-primary text-white font-bold rounded-xl p-4 flex flex-col gap-4 items-center absolute top-20 left-auto z-50"
          >
            <h1>Open saved Tracks</h1>
          </div>
        )}
      {selectedSaveTrack && (
        <div
          onClick={() => setOpenSavedTracksDrawer(true)}
          className="bg-primary text-white font-bold rounded-xl p-4 flex flex-col gap-4 items-center absolute top-20 left-auto z-50"
        >
          <h1>{selectedSaveTrack.title}</h1>
          <div
            className="underline cursor-pointer"
            onClick={handleSavedTrackClose}
          >
            Close
          </div>
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
          {!isLoadingUserLocations &&
            userLocations.map((location) => (
              <MapMarker
                key={location._id}
                longitude={location.coordinates[0]}
                latitude={location.coordinates[1]}
              >
                <div>{renderLocationIconBasedOnType(location)}</div>
              </MapMarker>
            ))}
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
