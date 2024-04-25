import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Marker } from "react-map-gl";

interface UserLocationMarkerProps {
  img?: any;
  icon?: any;
  className?: string;
  latitude: number;
  longitude: number;
  anchor?: any;
  children?: any;
}

export function MapMarker({
  img = null,
  icon = null,
  className,
  latitude,
  longitude,
  anchor = "top",
  children,
}: UserLocationMarkerProps) {
  return (
    <Marker
      longitude={longitude}
      latitude={latitude}
      anchor={anchor}
      pitchAlignment="map"
    >
      {icon && <FontAwesomeIcon icon={icon} className={className} />}
      {img && <img src={img} />}
      {children && children}
    </Marker>
  );
}
