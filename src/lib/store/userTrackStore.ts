import { create } from "zustand";

export const useUserTrackStore = create((set) => ({
  userCurrentTrack: [],
  isTrackingPosition: false,
  selectedSaveTrack: {},
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
  userCurrentPosition: { latitude: 0, longitude: 0 },
  setUserCurrentPosition: ({ longitude, latitude }) => {
    console.log("TRY TO SET USER CURRENT POSITIION", { longitude, latitude });
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
