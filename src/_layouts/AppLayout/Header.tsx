import { Input } from "@/components/ui/input";
import { useLocation } from "react-router-dom";
export const Header = () => {
  const location = useLocation();
  return (
    <div className="w-full bg-transparent flex p-2 gap-2 items-center fixed top-0 z-50">
      {location.pathname === "/explore" && (
        <Input
          className="bg-secondary outline-none"
          placeholder="You can search here"
        />
      )}
    </div>
  );
};
