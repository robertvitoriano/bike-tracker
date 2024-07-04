import { api } from "@/lib/axios";

export async function updateProfile(weight: number) {
  const profileUpdateResponse = await api.patch(`/users`, { weight });
  console.log(profileUpdateResponse);
}
