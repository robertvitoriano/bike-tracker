import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Position } from "./types/geolocationTypes";
import { Geolocation } from "@capacitor/geolocation";
import { Capacitor } from "@capacitor/core";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCurrentLocation(): Promise<{
  latitude: number;
  longitude: number;
}> {
  return new Promise((resolve, reject) => {
    if (navigator?.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: Position) => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
        },
        () => reject(null)
      );
    } else if (Capacitor.isPluginAvailable("Geolocation")) {
      Geolocation.getCurrentPosition().then(
        (position: Position) => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
        },
        (error) => {
          console.error(error);
          reject(null);
        }
      );
    } else {
      reject(null);
    }
  });
}

export function getFormattedTime(totalTimeInSeconds) {
  if (typeof totalTimeInSeconds !== "number") return "00:00:00";
  const timeInHours = addLeadingZero(Math.floor(totalTimeInSeconds / 3600));
  const timeInMinutes = addLeadingZero(
    Math.floor((totalTimeInSeconds % 3600) / 60)
  );
  const timeInSeconds = addLeadingZero(Math.floor(totalTimeInSeconds % 60));

  return `${timeInHours}:${timeInMinutes}:${timeInSeconds}`;
}
function addLeadingZero(num) {
  return num < 10 ? "0" + num : num;
}
