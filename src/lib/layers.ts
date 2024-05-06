import satelliteImage from "@/assets/satellite-map-layer.png";
import regularMapImage from "@/assets/regular-map-layer.png";

interface Layer {
  image: string;
  url: string;
  label: string;
}

interface Layers {
  SATELLITE: Layer;
  STREET: Layer;
}

export const layers: Layers = {
  STREET: {
    image: regularMapImage,
    url: "mapbox://styles/mapbox/streets-v12",
    label: "Standard",
  },
  SATELLITE: {
    image: satelliteImage,
    url: "mapbox://styles/mapbox/satellite-v9",
    label: "Satellite",
  },
};
