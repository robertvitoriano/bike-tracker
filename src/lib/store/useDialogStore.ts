import { create } from "zustand";

export const useDialogStore = create((set) => ({
  displayTrackSavingPopOver: false,
  toggleTrackSavingPopOver: () =>
    set((state) => ({
      displayTrackSavingPopOver: !state.displayTrackSavingPopOver,
    })),
  displayPauseTrackPopOver: false,
  togglePauseTrackPopOver: () =>
    set((state) => ({
      displayPauseTrackPopOver: !state.displayPauseTrackPopOver,
    })),
}));
