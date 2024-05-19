import { api } from "@/lib/axios";
export async function deleteTrack(trackId: string) {
  await api.delete(`/tracks/${trackId}`);
}
