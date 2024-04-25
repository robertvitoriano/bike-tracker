interface Layer {
  url: string;
  label: string;
}

interface Layers {
  SATELLITE: Layer;
  STREET: Layer;
}

export const layers: Layers = {
  SATELLITE: {
    url: "mapbox://styles/mapbox/satellite-v9",
    label: "Satellite",
  },
  STREET: {
    url: "mapbox://styles/mapbox/streets-v12",
    label: "Urban",
  },
};
