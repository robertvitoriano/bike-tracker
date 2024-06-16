import { useAuthStore } from "@/lib/store/authStore";

export function Profile() {
  const loggedUser = useAuthStore((state: any) => state.loggedUser);

  return (
    <div className="flex flex-col w-screen h-screen items-center justify-center relative bg-primary">
      <h1>{loggedUser.name}</h1>
      <img src={loggedUser.avatar} />
    </div>
  );
}
