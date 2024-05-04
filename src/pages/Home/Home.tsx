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
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { env } from "./../../../env";
import { useQuery } from "@tanstack/react-query";
import { getUserTracks } from "@/api/get-user-tracks";
import { getDistance } from "geojson-tools";
import { useTracking } from "@/lib/hooks/useTracking";
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
  const [openSavedTracksDrawer, setOpenSavedTracksDrawer] =
    useState<boolean>(false);
  const [savedTrackSelected, setSavedTrackSelected] = useState(false);
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
  const selectedSaveTrack = useUserTrackStore(
    (state: any) => state.selectedSaveTrack
  );
  const selectSavedTrack = useUserTrackStore(
    (state: any) => state.selectSavedTrack
  );
  const currentTrackTime = useUserTrackStore(
    (state: any) => state.currentTrackTime
  );
  const currentTrackDistance = useUserTrackStore(
    (state: any) => state.currentTrackDistance
  );
  const { mainMap } = useMap();
  const pathRef = useRef(null);
  const timeInSeconds = useRef(0);
  const timeInMinutes = useRef(0);
  const timeInHours = useRef(0);

  timeInHours.current = addLeadingZero(Math.floor(currentTrackTime / 3600));
  timeInMinutes.current = addLeadingZero(
    Math.floor((currentTrackTime % 3600) / 60)
  );
  timeInSeconds.current = addLeadingZero(Math.floor(currentTrackTime % 60));
  const { data: userSavedTracks } = useQuery({
    queryKey: ["get-user-tracks"],
    queryFn: getUserTracks,
  });

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
    mainMap?.flyTo({ center: [longitude, latitude], zoom: 19 });
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
    return selectedSaveTrack?.coordinates || [];
  }
  function handleSavedTrackSelection(track) {
    selectSavedTrack(track);
    setSavedTrackSelected(true);
    if (!isUserLocationMarkerShowing) toggleUserLocationMarker();
    const { coordinates } = track;
    const [longitude, latitude] = coordinates[0];
    mainMap?.flyTo({ center: [longitude, latitude], zoom: 19 });
    setOpenSavedTracksDrawer(false);
    console.log(getDistance(coordinates, 2));
  }
  function addLeadingZero(num) {
    return num < 10 ? "0" + num : num;
  }
  return (
    <div className="flex flex-col w-screen h-screen items-center justify-center relative">
      <Drawer
        direction="right"
        open={openSavedTracksDrawer}
        onClose={() => setOpenSavedTracksDrawer(false)}
      >
        <DrawerContent>
          <div>
            <DrawerHeader>
              <DrawerTitle>Saved Tracks</DrawerTitle>
              <DrawerDescription>
                Select one of the tracks you saved
              </DrawerDescription>
              <ul>
                {userSavedTracks &&
                  userSavedTracks.map((track) => (
                    <li
                      className="border-b-2 bg-white p-4 cursor-pointer"
                      onClick={() => handleSavedTrackSelection(track)}
                      key={track._id}
                    >
                      <h3>{track.title}</h3>
                      <h3>
                        Tempo: <strong>{track.time}</strong> segundos
                      </h3>
                    </li>
                  ))}
              </ul>
            </DrawerHeader>
          </div>
        </DrawerContent>
      </Drawer>
      {isTrackingPosition && (
        <div className="bg-primary text-white font-bold rounded-xl p-4 flex flex-col gap-4 items-center absolute top-20 left-auto z-50">
          <h1>
            Time elapsed: {timeInHours.current}:{timeInMinutes.current}:
            {timeInSeconds.current}
          </h1>
          {currentTrackDistance < 1 ? (
            <h1>Total Distance: {currentTrackDistance * 1000} meters</h1>
          ) : (
            <h1>Total Distance: {currentTrackDistance} Km</h1>
          )}
        </div>
      )}
      {!isTrackingPosition &&
        !displayTrackSavingPopOver &&
        !openSavedTracksDrawer && (
          <div
            onClick={() => setOpenSavedTracksDrawer(true)}
            className="bg-primary text-white font-bold rounded-xl p-4 flex flex-col gap-4 items-center absolute top-20 left-auto z-50"
          >
            <h1>Open saved Tracks</h1>
          </div>
        )}
      {permissionGranted ? (
        <MapboxMap
          mapboxAccessToken={env.VITE_MAPBOX_TOKEN}
          initialViewState={initialState}
          mapStyle={selectedLabel}
          id="mainMap"
        >
          {(isTrackingPosition || savedTrackSelected) && (
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
