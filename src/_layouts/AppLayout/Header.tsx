import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Input } from "@/components/ui/input";
export const Header = () => {
  return (
    <div className="w-full bg-primary flex p-2 gap-2 items-center fixed top-0 z-50">
      <FontAwesomeIcon icon={faBars} className=" text-4xl text-secondary" />
      <Input className="bg-secondary outline-none" />
    </div>
  );
};
