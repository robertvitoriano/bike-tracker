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
