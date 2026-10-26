import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import React, { useEffect, useState, useCallback, useRef } from 'react'
import L from 'leaflet'
import length from '@turf/length'
import { lineString } from '@turf/helpers'
import { Navigation, Crosshair } from 'lucide-react'

// Default center: Miami, FL (US Towing Services operations)
const DEFAULT_CENTER = [25.7617, -80.1918]

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

const createMyLocationIcon = () => L.divIcon({
  className: '',
  html: `<div style="position: relative; width: 22px; height: 22px;">
    <div style="position: absolute; inset: -4px; border-radius: 50%; background: rgba(59, 130, 246, 0.35); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
    <div style="position: relative; width: 22px; height: 22px; border-radius: 50%; background: #3b82f6; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.4);"></div>
  </div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
})

const clientIcon = createDotIcon('#111827', 16, true) // Black square
const driverIcon = createCarIcon()
const destinationIcon = createDotIcon('#ef4444', 16, true) // Red square
const myLocationIcon = createMyLocationIcon()

function FitBounds({ markers }) {
  const map = useMap()
  useEffect(() => {
    if (!markers || markers.length === 0) return
    try {
      if (markers.length === 1) {
        map.setView([markers[0].lat, markers[0].lng], Math.max(map.getZoom(), 14), { animate: true })
      } else {
        const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]))
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 })
        }
      }
    } catch (e) {
      console.warn('FitBounds error:', e)
    }
  }, [markers, map])
  return null
}

function MapRecenter({ center, zoom }) {
  const map = useMap()
  useEffect(() => {
    if (Array.isArray(center) && center.length === 2 &&
        typeof center[0] === 'number' && !isNaN(center[0]) &&
        typeof center[1] === 'number' && !isNaN(center[1])) {
      try {
        map.setView(center, zoom || map.getZoom() || 13, { animate: true })
      } catch (e) {
        console.warn('MapRecenter error:', e)
      }
    }
  }, [center?.[0], center?.[1], zoom, map])
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

function MapController({ onMapReady }) {
  const map = useMap()
  useEffect(() => {
    if (onMapReady) onMapReady(map)
  }, [map, onMapReady])
  return null
}

class MapErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch(err) {
    console.warn('Map rendering caught error:', err)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full min-h-[300px] bg-gray-900 border border-gray-800 rounded-3xl flex flex-col items-center justify-center p-6 text-center">
          <Navigation className="w-10 h-10 text-gray-600 mb-2" />
          <p className="text-gray-300 font-semibold text-sm">Vista de mapa no disponible</p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
            className="mt-3 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-xs text-gray-300 rounded-xl transition"
          >
            Reintentar carga
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default function MapView({
  center = DEFAULT_CENTER,
  markers = [],
  connections = [],
  zoom = 13,
  className = '',
  disableRouting = false,
  showLocateButton = true,
  onLocationFound = null
}) {
  const [routeCoords, setRouteCoords] = useState([])
  const [distanceKm, setDistanceKm] = useState(0)
  const [unit, setUnit] = useState('mi') // Default to miles for US
  const [userGps, setUserGps] = useState(null)
  const [locating, setLocating] = useState(false)
  const mapRef = useRef(null)

  // Ensure center is valid numbers
  const safeCenter = (
    Array.isArray(center) &&
    typeof center[0] === 'number' && !isNaN(center[0]) &&
    typeof center[1] === 'number' && !isNaN(center[1])
  ) ? center : DEFAULT_CENTER

  // Sanitize markers to guarantee Leaflet never receives null/undefined/NaN
  const validMarkers = (markers || [])
    .filter(m => m && 
      typeof m.lat === 'number' && !isNaN(m.lat) && isFinite(m.lat) &&
      typeof m.lng === 'number' && !isNaN(m.lng) && isFinite(m.lng)
    )

  // Automatic immediate geolocation on mount if no markers exist
  useEffect(() => {
    if ('geolocation' in navigator && validMarkers.length === 0) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
          setUserGps(coords)
          if (mapRef.current) {
            mapRef.current.setView([coords.lat, coords.lng], 14, { animate: true })
          }
          if (onLocationFound) onLocationFound(coords)
        },
        () => {},
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 10000 }
      )
    }
  }, [])

  // Interactive "Locate Me" handler
  const handleLocateMe = useCallback(() => {
    if (!('geolocation' in navigator)) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false)
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setUserGps(coords)
        if (mapRef.current) {
          mapRef.current.setView([coords.lat, coords.lng], 15, { animate: true })
        }
        if (onLocationFound) onLocationFound(coords)
      },
      (err) => {
        setLocating(false)
        console.warn('Geolocation error:', err.message)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }, [onLocationFound])

  useEffect(() => {
    if (disableRouting) {
      setRouteCoords([])
      setDistanceKm(0)
      return
    }

    // Build route: driver -> client -> destination (if present)
    const driver = validMarkers.find(m => m.type === 'driver')
    const client = validMarkers.find(m => m.type === 'client')
    const destination = validMarkers.find(m => m.type === 'destination')

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
  }, [validMarkers, disableRouting])

  // Combine user GPS marker if available and not already marked
  const allDisplayMarkers = [...validMarkers]
  if (userGps && !allDisplayMarkers.some(m => m.type === 'driver' || m.type === 'client')) {
    allDisplayMarkers.push({
      lat: userGps.lat,
      lng: userGps.lng,
      type: 'my_location',
      label: 'Tu ubicación actual'
    })
  }

  return (
    <MapErrorBoundary>
      <div className={`rounded-3xl overflow-hidden relative bg-gray-900 ${className}`}>
      <MapContainer
        center={safeCenter}
        zoom={zoom}
        style={{ height: '100%', minHeight: '300px' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>'
          url="https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoidXN0b3dpbmciLCJhIjoiY21waGl5OWcwMGduaDJxcHhoYXI0djVzNyJ9.UbE-OghawPl0CCNYxpbriA"
        />
        <MapController onMapReady={(map) => { mapRef.current = map }} />
        <MapResizer />
        <MapRecenter center={safeCenter} zoom={zoom} />
        {allDisplayMarkers.length > 0 && <FitBounds markers={allDisplayMarkers} />}
        
        {/* Dynamic single route */}
        {routeCoords.length > 0 && (
          <Polyline 
            positions={routeCoords} 
            pathOptions={{ color: '#0ea5e9', weight: 5, opacity: 1, lineCap: 'round', lineJoin: 'round' }} 
          />
        )}

        {/* Custom manual connections */}
        {connections.length > 0 && connections.map((pts, idx) => (
          <Polyline 
            key={`conn-${idx}`} 
            positions={pts} 
            pathOptions={{ color: '#0ea5e9', weight: 3, dashArray: '8, 8', opacity: 0.7 }} 
          />
        ))}

        {allDisplayMarkers.map((marker, i) => {
          const icon = marker.type === 'my_location'
            ? myLocationIcon
            : marker.type === 'client'
              ? clientIcon
              : (marker.type === 'driver' || marker.type === 'nearby_driver')
                ? driverIcon
                : destinationIcon

          return (
            <Marker
              key={`m-${i}-${marker.lat}-${marker.lng}`}
              position={[marker.lat, marker.lng]}
              icon={icon}
            >
              {marker.label && (
                <Popup>
                  <div className="text-sm font-semibold text-gray-900">{marker.label}</div>
                  {marker.sublabel && <div className="text-xs text-gray-500 mt-0.5">{marker.sublabel}</div>}
                </Popup>
              )}
            </Marker>
          )
        })}
      </MapContainer>

      {/* Floating "Locate Me" Button */}
      {showLocateButton && (
        <button
          type="button"
          onClick={handleLocateMe}
          title="Centrar en mi ubicación actual"
          aria-label="Centrar en mi ubicación actual"
          className="absolute bottom-5 right-5 z-[400] w-11 h-11 bg-white hover:bg-gray-100 active:scale-95 text-gray-800 rounded-full shadow-xl border border-gray-200 flex items-center justify-center transition-all group"
        >
          <Crosshair className={`w-5 h-5 text-brand-600 transition-transform ${locating ? 'animate-spin' : 'group-hover:scale-110'}`} />
        </button>
      )}

      {/* Turf.js Distance Overlay */}
      {routeCoords.length > 0 && distanceKm > 0 && (
        <div className="absolute top-4 right-4 z-[400] bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-3 border border-gray-100 flex flex-col items-center gap-1">
          <div className="text-xl font-black text-gray-900">
            {unit === 'mi' ? (distanceKm * 0.621371).toFixed(1) : distanceKm.toFixed(1)}
            <span className="text-xs font-semibold text-gray-500 ml-1">{unit === 'mi' ? 'mi' : 'km'}</span>
          </div>
          <button 
            type="button"
            onClick={() => setUnit(u => u === 'mi' ? 'km' : 'mi')}
            className="text-[11px] text-brand-600 font-bold hover:underline"
          >
            Ver en {unit === 'mi' ? 'Km' : 'Millas'}
          </button>
        </div>
      )}
      </div>
    </MapErrorBoundary>
  )
}
