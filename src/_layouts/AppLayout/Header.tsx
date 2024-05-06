import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Input } from "@/components/ui/input";
import { useLocation } from "react-router-dom";
export const Header = () => {
  const location = useLocation();
  return (
    <div className="w-full bg-primary flex p-2 gap-2 items-center fixed top-0 z-50">
      <FontAwesomeIcon icon={faBars} className=" text-4xl text-secondary" />
      {location.pathname === "/explore" && (
        <Input className="bg-secondary outline-none" />
      )}
    </div>
  );
};
