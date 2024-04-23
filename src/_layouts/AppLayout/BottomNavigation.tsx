import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay } from "@fortawesome/free-solid-svg-icons";
export const BottomNavigation = () => {
  return (
    <div className="w-full bg-primary flex px-2 py-1  gap-2 items-center justify-center fixed bottom-0 z-50">
      <FontAwesomeIcon
        icon={faCirclePlay}
        className="text-secondary text-5xl"
      />
    </div>
  );
};
