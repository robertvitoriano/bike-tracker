import { api } from "@/lib/axios";
export interface ITrack {
  coordinates: [[number, number]];
  title: string;
  distance: number;
  time: number;
  image: File;
  visibility: "public" | "private";
  startLocationTitle: string;
  finishLocationTitle: string;
}

export async function storeUserTrack(track: ITrack) {
  const formData = new FormData();
  formData.append("title", track.title);
  formData.append("distance", track.distance.toString());
  formData.append("time", track.time.toString());
  formData.append("image", track.image);
  formData.append("coordinates", JSON.stringify(track.coordinates));
  formData.append("visibility", track.visibility);
  formData.append("startLocationTitle", track.startLocationTitle);
  formData.append("finishLocationTitle", track.finishLocationTitle);

  await api.post("/tracks", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
