import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Marker } from "react-map-gl";

interface UserLocationMarkerProps {
  img?: any;
  icon?: any;
  className?: string;
  latitude: number;
  longitude: number;
  anchor?: any;
}

export function MapMarker({
  img = null,
  icon = null,
  className,
  latitude,
  longitude,
  anchor = "top",
}: UserLocationMarkerProps) {
  return (
    <Marker
      longitude={longitude}
      latitude={latitude}
      anchor={anchor}
      pitchAlignment="map"
      offset={[220, -900]}
    >
      {icon && <FontAwesomeIcon icon={icon} className={className} />}
      {img && <img src={img} />}
    </Marker>
  );
}
