import { create } from "zustand";

export const useUserTrackStore = create((set) => ({
  userCurrentTrack: [],
  isTrackingPosition: false,
  selectedSaveTrack: null,
  currentTrackTime: 0,
  setCurrentTrackTime: (updatedTime) =>
    set(() => ({ currentTrackTime: updatedTime })),
  selectSavedTrack: (savedTrack) =>
    set(() => ({
      selectedSaveTrack: savedTrack,
    })),
  toggleTrackingPosition: () =>
    set((state) => ({
      isTrackingPosition: !state.isTrackingPosition,
    })),
  addCoordinateToCurrentTrack: ([longitude, latitude]) =>
    set((state) => {
      return {
        userCurrentTrack: [...state.userCurrentTrack, [longitude, latitude]],
      };
    }),
  cleanCurrentTrack: () =>
    set(() => {
      return {
        userCurrentTrack: [],
      };
    }),
  cleanSelectedTrack: () =>
    set(() => {
      return {
        selectedSaveTrack: null,
      };
    }),
  userCurrentPosition: { latitude: 0, longitude: 0 },
  setUserCurrentPosition: ({ longitude, latitude }) => {
    set(() => ({
      userCurrentPosition: { longitude, latitude },
    }));
  },
  isUserLocationMarkerShowing: false,
  toggleUserLocationMarker: () =>
    set((state) => ({
      isUserLocationMarkerShowing: !state.isUserLocationMarkerShowing,
    })),
}));
