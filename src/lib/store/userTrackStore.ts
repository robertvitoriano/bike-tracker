import { create } from "zustand";

export const useUserTrackStore = create((set) => ({
  userCurrentTrack: localStorage.getItem("track")
    ? JSON.parse(localStorage.getItem("track"))
    : [],
  isTrackingPosition: false,
  toggleTrackingPosition: () =>
    set((state) => ({
      isTrackingPosition: !state.isTrackingPosition,
    })),
  addCoordinateToCurrentTrack: ([longitude, latitude]) =>
    set((state) => {
      localStorage.setItem(
        "track",
        JSON.stringify([...state.userCurrentTrack, [longitude, latitude]])
      );
      return {
        userCurrentTrack: [...state.userCurrentTrack, [longitude, latitude]],
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
