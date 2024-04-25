import { create } from "zustand";

export const useUserTrackStore = create((set) => ({
  userCurrentTrack: [],
  isTrackingPosition: false,
  toggleTrackingPosition: () =>
    set((state) => ({
      isTrackingPosition: !state.isTrackingPosition,
    })),
  addCoordinateToCurrentTrack: ([longitude, latitude]) =>
    set((state) => ({
      userCurrentTrack: [...state.userCurrentTrack, [longitude, latitude]],
    })),
  userCurrentPosition: { latitude: 0, longitude: 0 },
  setUserCurrentPosition: ({ longitude, latitude }) => {
    console.log("TRY TO SET USER CURRENT POSITIION", { longitude, latitude });
    set(() => ({
      userCurrentPosition: { longitude, latitude },
    }));
  },
}));
