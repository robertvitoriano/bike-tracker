import { useQuery } from "@tanstack/react-query";
import { getUserTracks } from "@/api/get-user-tracks";
import {
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  Drawer,
} from "@/components/ui/drawer";
import { getFormattedTime } from "@/lib/utils";
interface IProps {
  open: boolean;
  handleSavedTrackSelection: Function;
  onClose: Function;
}
export function SavedTracksDrawer(props: IProps) {
  const { open, handleSavedTrackSelection, onClose } = props;

  const { data: userSavedTracks } = useQuery({
    queryKey: ["get-user-tracks"],
    queryFn: getUserTracks,
  });

  return (
    <Drawer direction="right" open={open} onClose={() => onClose()}>
      <DrawerContent>
        <div>
          <DrawerHeader>
            <DrawerTitle>Saved Tracks</DrawerTitle>
            <DrawerDescription>
              Select one of the tracks you saved
            </DrawerDescription>
            <ul>
              {userSavedTracks &&
                userSavedTracks.map((track) => (
                  <li
                    className="border-b-2 bg-white p-4 cursor-pointer"
                    onClick={() => handleSavedTrackSelection(track)}
                    key={track._id}
                  >
                    <h3>{track.title}</h3>
                    <h3>
                      Time: <strong>{getFormattedTime(track.time)}</strong>
                    </h3>
                    <h3>
                      Distance:{" "}
                      <strong>
                        {track.distance < 1
                          ? track.distance * 1000 + " m"
                          : track.distance + " Km"}
                      </strong>
                    </h3>
                  </li>
                ))}
            </ul>
          </DrawerHeader>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
