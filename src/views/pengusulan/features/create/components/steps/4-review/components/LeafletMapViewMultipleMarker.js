import React, { useState } from "react";

//leaflet
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png").default,
  iconUrl: require("leaflet/dist/images/marker-icon.png").default,
  shadowUrl: require("leaflet/dist/images/marker-shadow.png").default,
});
const mapDefault = [-8.670458, 115.212631];
const mapZoomDefault = 10;

const LeafletMapViewMultipleMarker = (props) => {
  const { coordinates, style } = props;
  const [mapZoom] = useState(mapZoomDefault);

  return (
    <MapContainer
      center={
        coordinates.length > 0
          ? [coordinates[0].latitude, coordinates[0].longitude]
          : mapDefault
      }
      zoom={mapZoom}
      style={{ height: "300px", zIndex: 0, ...style }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {coordinates.length > 0
        ? coordinates.map((coordinate) => (
            <Marker
              key={coordinate.id}
              position={[coordinate.latitude, coordinate.longitude]}
            >
              <Popup>{coordinate?.displayText || "Titik lokasi"}</Popup>
            </Marker>
          ))
        : null}
    </MapContainer>
  );
};

export default LeafletMapViewMultipleMarker;
