import { api } from "@/lib/axios";
export interface IProfile {
  name: string;
  username: string;
  weight: number;
}
export async function updateProfile(data: {
  name: string;
  username: string;
  weight: number;
}) {
  const profileUpdateResponse = await api.patch<IProfile>(`/users`, data);
  return profileUpdateResponse;
}
