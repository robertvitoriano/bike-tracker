import { api } from "@/lib/axios";
export interface ITrack {
  coordinates: [[number, number]];
  title: string;
  distance: number;
  time: number;
}

export async function storeUserTrack(track: ITrack) {
  await api.post("/tracks", track);
}
