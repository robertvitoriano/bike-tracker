import { api } from "@/lib/axios";
export interface GetUserTracksResponse {
  title: string;
  _id: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  coordinates: [[number, number]];
}
export async function getUserTracks() {
  const response = await api.get<GetUserTracksResponse>("/tracks");

  console.log(response.data);
  return response.data;
}
