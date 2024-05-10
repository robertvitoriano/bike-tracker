import {
  DialogContent,
  DialogTitle,
  DialogDescription,
  Dialog,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { DialogHeader } from "../ui/dialog";
import { Input } from "../ui/input";
import { useDialogStore } from "@/lib/store/useDialogStore";
import { useUserTrackStore } from "@/lib/store/userTrackStore";
import { ITrack, storeUserTrack } from "@/api/store-user-track";
import MapboxMap, { Source, Layer, useMap } from "react-map-gl";

import { layers } from "@/lib/layers";
import { useRef, useState } from "react";
import { Slider } from "../ui/slider";
import { env } from "../../../env";

export function SaveTrackDialog() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<{ title: string }>();
  const { mutateAsync: storeUserTrackFn } = useMutation({
    mutationFn: storeUserTrack,
  });

  const displayTrackSavingPopOver = useDialogStore(
    (state: any) => state.displayTrackSavingPopOver
  );
  const userCurrentTrack = useUserTrackStore(
    (state: any) => state.userCurrentTrack
  );
  const toggleTrackSavingPopOver = useDialogStore(
    (state: any) => state.toggleTrackSavingPopOver
  );
  const cleanCurrentTrack = useUserTrackStore(
    (state: any) => state.cleanCurrentTrack
  );
  const currentTrackTime = useUserTrackStore(
    (state: any) => state.currentTrackTime
  );
  const clearCurrentTrackTime = useUserTrackStore(
    (state: any) => state.clearCurrentTrackTime
  );
  const currentTrackDistance = useUserTrackStore(
    (state: any) => state.currentTrackDistance
  );

  const { trackSavingMap } = useMap();
  const pathRef = useRef(null);

  const [screenshotZoom, setScreenshotZoom] = useState(14);
  async function handleTrackSaving(data) {
    const fileUrl = trackSavingMap.getCanvas().toDataURL() as unknown as File;
    const trackData: ITrack = {
      title: data.title,
      coordinates: userCurrentTrack,
      time: currentTrackTime,
      distance: currentTrackDistance,
      image: fileUrl,
    };
    await storeUserTrackFn(trackData);
    cleanCurrentTrack();
    clearCurrentTrackTime();
    toggleTrackSavingPopOver();
  }

  const trackCenter =
    userCurrentTrack[Math.floor(userCurrentTrack.length / 2)] ||
    userCurrentTrack[0];

  return (
    <Dialog open={displayTrackSavingPopOver}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Track</DialogTitle>
          <DialogDescription>Save your new track!</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleTrackSaving)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Track Title
              </Label>
              <Input id="title" className="col-span-3" {...register("title")} />
            </div>
          </div>
          <div className="p-4 h-80 flex flex-col gap-4">
            {displayTrackSavingPopOver && (
              <MapboxMap
                mapboxAccessToken={env.VITE_MAPBOX_TOKEN}
                initialViewState={{
                  zoom: screenshotZoom,
                  longitude: trackCenter[0],
                  latitude: trackCenter[1],
                }}
                mapStyle={layers.STREET.url}
                id="trackSavingMap"
                preserveDrawingBuffer={true}
                zoom={screenshotZoom}
              >
                <Source
                  id="userPath"
                  type="geojson"
                  data={{
                    type: "Feature",
                    properties: {},
                    geometry: {
                      type: "LineString",
                      coordinates: userCurrentTrack,
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
              </MapboxMap>
            )}
            <Slider
              defaultValue={[13]}
              max={22}
              min={0}
              step={1}
              onValueChange={(e) => setScreenshotZoom(e[0])}
            />

            <Button
              type="submit"
              disabled={isSubmitting || userCurrentTrack.length <= 1}
            >
              Save new track
            </Button>
          </div>
          {!isSubmitting && userCurrentTrack.length <= 1 && (
            <span className="text-red-500">
              Current track is not long enough to be saved, ride more!
            </span>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
