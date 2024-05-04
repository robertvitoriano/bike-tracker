import { api } from "@/lib/axios";
type Track = {
  _id: string;
  time: number;
  title: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  coordinates: [[number, number]];
  distance: number;
};

export async function getUserTracks(): Promise<Track[]> {
  const response = await api.get<Track[]>("/tracks");
  return response.data;
}
