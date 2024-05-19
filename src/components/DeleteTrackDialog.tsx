import {
  DialogContent,
  DialogTitle,
  DialogDescription,
  Dialog,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { DialogHeader } from "./ui/dialog";

export function DeleteTrackDialog({ open, onDelete, onCancel, deleting }) {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete track</DialogTitle>
          <DialogDescription>
            Do you really want to delete the track ?
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-4">
          <Button onClick={onDelete} className="bg-red-500" disabled={deleting}>
            Delete
          </Button>
          <Button onClick={onCancel} className="bg-muted text-primary">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
