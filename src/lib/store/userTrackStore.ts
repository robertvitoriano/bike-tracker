import { create } from "zustand";
import { getDistance } from "geojson-tools";
export const useUserTrackStore = create((set) => ({
  userCurrentTrack: [],
  isTrackingPosition: false,
  selectedSaveTrack: null,
  currentTrackTime: 0,
  currentTrackDistance: 0,
  updateCurrentTrackTime: () =>
    set((state) => {
      return { currentTrackTime: state.currentTrackTime + 1 };
    }),
  updateCurrentTrackDistance: () =>
    set((state) => {
      return { currentTrackDistance: getDistance(state.userCurrentTrack, 4) };
    }),
  clearCurrentTrackDistance: () =>
    set(() => ({
      currentTrackDistance: 0,
    })),
  clearCurrentTrackTime: () =>
    set(() => ({
      currentTrackTime: 0,
    })),
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
