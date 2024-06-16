import { api } from "@/lib/axios";
type User = {
  _id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
};

export async function getProfile(): Promise<User> {
  const response = await api.get<User>("/users/me");
  return response.data;
}
