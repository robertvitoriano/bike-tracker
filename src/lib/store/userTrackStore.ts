import { create } from "zustand";
import { getDistance } from "geojson-tools";
import { mockCoordinates } from "@/assets/mock-coordinates";
export const useUserTrackStore = create((set) => ({
  userCurrentTrack: mockCoordinates,
  isTrackingPosition: false,
  selectedSaveTrack: null,
  currentTrackTime: 0,
  currentTrackDistance: 0,
  isTakingScreenShot: false,
  toggleTakingScreenShot: () =>
    set((state) => ({
      isTakingScreenShot: !state.isTakingScreenShot,
    })),
  updateCurrentTrackTime: () =>
    set((state) => {
      return { currentTrackTime: state.currentTrackTime + 1 };
    }),
  updateCurrentTrackDistance: () =>
    set((state) => {
      return { currentTrackDistance: getDistance(mockCoordinates, 4) };
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
        userCurrentTrack: mockCoordinates,
      };
    }),
  cleanCurrentTrack: () =>
    set(() => {
      return {
        userCurrentTrack: mockCoordinates,
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
