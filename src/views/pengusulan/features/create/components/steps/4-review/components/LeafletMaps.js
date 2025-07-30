import React, { useState } from "react"

//leaflet
import "leaflet/dist/leaflet.css"
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet"
import L from "leaflet"
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png").default,
  iconUrl: require("leaflet/dist/images/marker-icon.png").default,
  shadowUrl: require("leaflet/dist/images/marker-shadow.png").default
})
const mapDefault = [-8.670458, 115.212631]
const mapZoomDefault = 10

const ChangeView = ({ center, zoom }) => {
  const map = useMap()
  map.flyTo(center, zoom)
  return null
}

const LeafletMaps = (props) => {
  const { latitude, longitude } = props
  const [mapZoom] = useState(mapZoomDefault)

  return (
    <MapContainer
      center={
        !isNaN(longitude) && !isNaN(latitude)
          ? [latitude, longitude]
          : mapDefault
      }
      zoom={mapZoom}
      style={{ height: "300px", zIndex: 0 }}
    >
      <ChangeView
        center={
          !isNaN(longitude) && !isNaN(latitude)
            ? [latitude, longitude]
            : mapDefault
        }
        zoom={mapZoom}
      />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {!isNaN(longitude) && !isNaN(latitude) && (
        <Marker position={[latitude, longitude]}>
          <Popup>Titik lokasi</Popup>
        </Marker>
      )}
    </MapContainer>
  )
}

export default LeafletMaps
