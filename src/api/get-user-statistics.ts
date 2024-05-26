import { api } from "@/lib/axios";
type TrackStatistics = {
  totalOfTracks: number;
  totalTime: number;
  totalDistance: number;
  averageSpeed: number;
};

export async function getUserStatistics(): Promise<TrackStatistics> {
  const response = await api.get<TrackStatistics>("/tracks/statistics");
  return response.data;
}
