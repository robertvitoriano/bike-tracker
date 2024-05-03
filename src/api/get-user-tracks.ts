import { api } from "@/lib/axios";
type Track = {
  title: string;
  _id: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  coordinates: [[number, number]];
};

export async function getUserTracks(): Promise<Track[]> {
  const response = await api.get<Track[]>("/tracks");
  return response.data;
}
