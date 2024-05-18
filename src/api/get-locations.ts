import { api } from "@/lib/axios";
type ILocation = {
  images: Array<string>;
  visibility: "public" | "private";
  _id: string;
  title: string;
  userId: string;
  createdAt: string;
  coordinates: [number, number];
};

export async function getUserLocations(): Promise<ILocation[]> {
  const response = await api.get<ILocation[]>("/locations");
  return response.data;
}
