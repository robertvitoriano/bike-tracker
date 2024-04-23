export interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number | null;
  altitudeAccuracy?: number | null;
  heading?: number | null;
  speed?: number | null;
}

export interface Position {
  coords: Coordinates;
  timestamp: number;
}

export interface MapViewportProps {
  latitude: number;
  longitude: number;
  zoom: number;
  maxZoom: number;
  minZoom: number;
}
