import { useAuthStore } from "@/lib/store/authStore";
import { useNavigate } from "react-router-dom";
export function Profile() {
  const loggedUser = useAuthStore((state: any) => state.loggedUser);
  const setLoggedUser = useAuthStore((state: any) => state.setLoggedUser);
  const setToken = useAuthStore((state: any) => state.setToken);
  const navigate = useNavigate();

  function handleLoggout() {
    setLoggedUser(null);
    setToken("");
    navigate("/");
  }
  return (
    <div className="flex flex-col w-screen h-screen items-center gap-10 relative bg-secondary pt-8">
      <h1 className="text-2xl text-primary">{loggedUser.name}</h1>
      <img src={loggedUser.avatar} className="h-44 w-44 rounded-full" />
      <div
        className="text-secondary bg-primary hover:text-primary hover:bg-secondary hover:border hover:border-primary cursor-pointer py-4 px-6 rounded-full"
        onClick={handleLoggout}
      >
        <span className="text-2xl">LOGOUT</span>
      </div>
    </div>
  );
}
