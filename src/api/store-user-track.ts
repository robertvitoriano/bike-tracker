import { api } from "@/lib/axios";
export interface ITrack {
  coordinates: [[number, number]];
  title: string;
}

export async function storeUserTrack(track: ITrack) {
  const response = await api.post("/tracks", track);

  return response.data;
}
