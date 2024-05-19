import { useMutation, useQuery } from "@tanstack/react-query";
import { getUserTracks } from "@/api/get-user-tracks";
import {
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  Drawer,
} from "@/components/ui/drawer";
import { getFormattedTime } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRoute, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { deleteTrack } from "@/api/delete-track";
import { DeleteTrackDialog } from "@/components/DeleteTrackDialog";
import { toast } from "sonner";

interface IProps {
  open: boolean;
  handleSavedTrackSelection: Function;
  onClose: Function;
}
export function SavedTracksDrawer(props: IProps) {
  const { open, handleSavedTrackSelection, onClose } = props;
  const [trackIdToBeDeleted, setTrackIdToBeDeleted] = useState<string>();
  const [showTrackDeleteDialog, setShowTrackDeleteDialog] = useState<boolean>();
  const { data: userSavedTracks } = useQuery({
    queryKey: ["get-user-tracks"],
    queryFn: getUserTracks,
  });
  const { mutateAsync: deleteTrackFn, isPending: isPendingTrackDeletion } =
    useMutation({
      mutationFn: deleteTrack,
    });
  async function handleTrackDelete() {
    await deleteTrackFn(trackIdToBeDeleted);
    setTrackIdToBeDeleted("");
    toast.success("Track successfully deleted");
  }
  async function closeTrackDeletionDialog() {
    setShowTrackDeleteDialog(false);
    setTrackIdToBeDeleted("");
  }
  function openTrackDeletionDialog(trackId: string) {
    setTrackIdToBeDeleted(trackId);
    setShowTrackDeleteDialog(true);
  }
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
                    className="border-b-2 bg-white p-4  flex justify-between"
                    key={track._id}
                  >
                    <div>
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
                    </div>
                    <div className="flex gap-4">
                      <FontAwesomeIcon
                        icon={faRoute}
                        className="text-2xl text-primary cursor-pointer"
                        onClick={() => handleSavedTrackSelection(track)}
                      />
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="text-2xl text-red-500 cursor-pointer"
                        onClick={() => openTrackDeletionDialog(track._id)}
                      />
                    </div>
                  </li>
                ))}
            </ul>
          </DrawerHeader>
        </div>
      </DrawerContent>
      <DeleteTrackDialog
        open={showTrackDeleteDialog}
        deleting={isPendingTrackDeletion}
        onCancel={closeTrackDeletionDialog}
        onDelete={handleTrackDelete}
      />
    </Drawer>
  );
}
