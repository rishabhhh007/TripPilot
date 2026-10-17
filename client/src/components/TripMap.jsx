import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import { allStops } from "../utils/itinerary.js";

// Numbered round marker (a divIcon avoids Leaflet's default-image problems with bundlers).
function numberedIcon(n) {
  return L.divIcon({
    className: "",
    html: `<div class="stop-marker">${n}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
}

// Zoom the map so every stop is visible whenever the stops change.
function FitToStops({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points.length > 0) map.fitBounds(points, { padding: [40, 40] });
  }, [points, map]);
  return null;
}

export default function TripMap({ itinerary }) {
  const stops = allStops(itinerary);
  const points = stops.map((s) => [s.lat, s.lng]);

  return (
    <div className="card overflow-hidden">
      <div className="h-[380px] w-full">
        <MapContainer center={points[0] || [20.59, 78.96]} zoom={6} scrollWheelZoom={false} className="h-full w-full">
          {/* Free OpenStreetMap tiles */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Polyline positions={points} pathOptions={{ color: "#059669", weight: 4, opacity: 0.75, dashArray: "6 8" }} />
          {stops.map((stop, i) => (
            <Marker key={stop.id} position={[stop.lat, stop.lng]} icon={numberedIcon(i + 1)}>
              <Popup>
                <strong>{stop.name}</strong>
                <br />
                {stop.time} · {stop.category}
              </Popup>
            </Marker>
          ))}
          <FitToStops points={points} />
        </MapContainer>
      </div>
      <p className="border-t border-line px-4 py-2 text-xs text-navy-soft">
        Dashed line connects stops in order (straight lines). Real road routing arrives with the Routes API.
      </p>
    </div>
  );
}
