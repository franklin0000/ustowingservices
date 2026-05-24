import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import { useEffect, useState } from 'react'
import L from 'leaflet'
import length from '@turf/length'
import { lineString } from '@turf/helpers'

// Minimalist Uber-style icons
const createDotIcon = (color, size = 16, isSquare = false) => L.divIcon({
  className: '',
  html: `<div style="
    width: ${size}px; height: ${size}px; 
    border-radius: ${isSquare ? '2px' : '50%'};
    background: ${color}; 
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  "></div>`,
  iconSize: [size, size],
  iconAnchor: [size / 2, size / 2],
})

const createCarIcon = () => L.divIcon({
  className: '',
  html: `<div style="
    width: 24px; height: 24px; 
    background-color: white; 
    border-radius: 50%;
    border: 2px solid #111827;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 2px 6px rgba(0,0,0,0.4);
  ">
    <div style="width: 12px; height: 6px; background-color: #111827; border-radius: 2px;"></div>
  </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
})

const clientIcon = createDotIcon('#111827', 16, true) // Black square
const driverIcon = createCarIcon()
const destinationIcon = createDotIcon('#ef4444', 16, true) // Red square

function FitBounds({ markers }) {
  const map = useMap()
  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]))
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 })
    }
  }, [markers, map])
  return null
}

function MapResizer() {
  const map = useMap()
  useEffect(() => {
    const t1 = setTimeout(() => map.invalidateSize(), 100)
    const t2 = setTimeout(() => map.invalidateSize(), 500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [map])
  return null
}

export default function MapView({ center = [19.4326, -99.1332], markers = [], connections = [], zoom = 13, className = '', disableRouting = false }) {
  const [routeCoords, setRouteCoords] = useState([])
  const [distanceKm, setDistanceKm] = useState(0)
  const [unit, setUnit] = useState('km') // 'km' or 'mi'

  useEffect(() => {
    if (disableRouting) {
      setRouteCoords([])
      setDistanceKm(0)
      return
    }

    // Build route: driver -> client -> destination (if present)
    const driver = markers.find(m => m.type === 'driver')
    const client = markers.find(m => m.type === 'client')
    const destination = markers.find(m => m.type === 'destination')

    let waypoints = []
    if (driver && client) waypoints.push(driver, client)
    else if (client) waypoints.push(client)
    else if (driver) waypoints.push(driver)

    if (destination) waypoints.push(destination)

    if (waypoints.length >= 2) {
      const coordsStr = waypoints.map(w => `${w.lng},${w.lat}`).join(';')
      const MAPBOX_TOKEN = 'pk.eyJ1IjoidXN0b3dpbmciLCJhIjoiY21waGl5OWcwMGduaDJxcHhoYXI0djVzNyJ9.UbE-OghawPl0CCNYxpbriA'
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordsStr}?geometries=geojson&overview=full&access_token=${MAPBOX_TOKEN}`
      fetch(url)
        .then(res => res.json())
        .then(data => {
          if (data.routes && data.routes[0]) {
            // OSRM returns [lng, lat], Leaflet needs [lat, lng]
            const geojsonCoords = data.routes[0].geometry.coordinates
            const coords = geojsonCoords.map(c => [c[1], c[0]])
            setRouteCoords(coords)

            if (geojsonCoords.length > 1) {
              const line = lineString(geojsonCoords)
              const len = length(line, { units: 'kilometers' })
              setDistanceKm(len)
            }
          }
        })
        .catch(console.error)
    } else {
      setRouteCoords([])
      setDistanceKm(0)
    }
  }, [markers, disableRouting])

  return (
    <div className={`rounded-3xl overflow-hidden relative bg-gray-900 ${className}`}>
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', minHeight: '300px' }} zoomControl={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>'
          url="https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoidXN0b3dpbmciLCJhIjoiY21waGl5OWcwMGduaDJxcHhoYXI0djVzNyJ9.UbE-OghawPl0CCNYxpbriA"
        />
        <MapResizer />
        {markers.length > 0 && <FitBounds markers={markers} />}
        
        {/* Dynamic single route (used by driver app) */}
        {routeCoords.length > 0 && (
          <Polyline 
            positions={routeCoords} 
            pathOptions={{ color: '#0ea5e9', weight: 5, opacity: 1, lineCap: 'round', lineJoin: 'round' }} 
          />
        )}

        {/* Custom manual connections (used by Admin Dashboard) */}
        {connections.length > 0 && connections.map((pts, idx) => (
          <Polyline 
            key={`conn-${idx}`} 
            positions={pts} 
            pathOptions={{ color: '#0ea5e9', weight: 3, dashArray: '8, 8', opacity: 0.7 }} 
          />
        ))}

        {markers.map((marker, i) => (
          <Marker
            key={i}
            position={[marker.lat, marker.lng]}
            icon={marker.type === 'client' ? clientIcon : (marker.type === 'driver' || marker.type === 'nearby_driver') ? driverIcon : destinationIcon}
          >
            {marker.label && (
              <Popup>
                <div className="text-sm font-medium text-gray-900">{marker.label}</div>
                {marker.sublabel && <div className="text-xs text-gray-500">{marker.sublabel}</div>}
              </Popup>
            )}
          </Marker>
        ))}
      </MapContainer>

      {/* Turf.js Distance Overlay */}
      {routeCoords.length > 0 && distanceKm > 0 && (
        <div className="absolute top-4 right-4 z-[400] bg-white rounded-xl shadow-lg p-3 border border-gray-100 flex flex-col items-center gap-1">
          <div className="text-2xl font-black text-gray-900">
            {unit === 'km' ? distanceKm.toFixed(1) : (distanceKm * 0.621371).toFixed(1)}
            <span className="text-sm font-semibold text-gray-500 ml-1">{unit === 'km' ? 'km' : 'mi'}</span>
          </div>
          <button 
            onClick={() => setUnit(u => u === 'km' ? 'mi' : 'km')}
            className="text-xs text-blue-600 font-bold hover:underline"
          >
            Switch to {unit === 'km' ? 'Miles' : 'Km'}
          </button>
        </div>
      )}
    </div>
  )
}
