import { api } from "@/lib/axios";
export interface ITrack {
  coordinates: [[number, number]];
  title: string;
}

export async function storeUserTrack(track: ITrack) {
  await api.post("/tracks", track);
}
