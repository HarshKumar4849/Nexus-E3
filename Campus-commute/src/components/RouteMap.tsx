import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { io } from 'socket.io-client';
import { useRouteContext } from '../contexts/RouteContext';
import { useToast } from '@/hooks/use-toast';

// Helper to auto-recenter the map on the live position or start position
const RecenterMap = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], 14, { animate: true, duration: 1 });
    }
  }, [lat, lng, map]);
  return null;
};

// Map Icon Defines
const StartIcon = L.divIcon({
  className: '',
  html: `<div style="width:20px;height:20px;background-color:#10b981;border:3px solid white;border-radius:50%;box-shadow:0 2px 4px rgba(0,0,0,0.3);"></div>`,
  iconAnchor: [10, 10]
});

const EndIcon = L.divIcon({
  className: '',
  html: `<div style="width:24px;height:24px;background-color:#ef4444;border:3px solid white;border-radius:50%;box-shadow:0 2px 4px rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center;"><div style="width:8px;height:8px;background:white;border-radius:50%"></div></div>`,
  iconAnchor: [12, 12]
});

const BusIcon = L.divIcon({
  className: 'live-bus-marker',
  html: `<div style="width:40px;height:40px;background-color:#0f766e;border:3px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 10px rgba(0,0,0,0.4);"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/></svg></div>`,
  iconAnchor: [20, 20]
});

const RouteMap: React.FC<any> = () => {
  const { selectedRoute, liveBusPosition, setLiveBusPosition } = useRouteContext();
  const { toast } = useToast();
  
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [visitedStops, setVisitedStops] = useState<Set<string>>(new Set());

  // 1. OSRM Road Snap Hook
  useEffect(() => {
    // Generate valid OSRM coord string: lng,lat;lng,lat
    const coordsString = selectedRoute.stoppages
      .map(s => \`\${s.coordinates.lng},\${s.coordinates.lat}\`)
      .join(';');
      
    // Call strict route API
    fetch(\`https://router.project-osrm.org/route/v1/driving/\${coordsString}?overview=full&geometries=geojson\`)
      .then(r => r.json())
      .then(data => {
        if (data.routes && data.routes[0]) {
          setGeoJsonData(data.routes[0].geometry);
        } else {
          setGeoJsonData(null); // Fallback to polyline if no roads found
        }
      })
      .catch((e) => {
        console.error("OSRM Route Failed:", e);
        setGeoJsonData(null);
      });
      
    // Reset visited stops on route change
    setVisitedStops(new Set());
  }, [selectedRoute]);

  // 2. Websocket Bus Driver Connection
  useEffect(() => {
    const socketURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
    const socket = io(socketURL);

    // Dynamic marker update
    socket.on('driver-location-update', (data: { routeId: string, lat: number, lng: number }) => {
      if (data.routeId === selectedRoute.busNumber) {
         setLiveBusPosition([data.lat, data.lng]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedRoute, setLiveBusPosition]);

  // 3. Proximity Geofencing Toasting
  useEffect(() => {
    if (!liveBusPosition) return;

    try {
      const busLatLng = L.latLng(liveBusPosition[0], liveBusPosition[1]);

      for (const stop of selectedRoute.stoppages) {
        if (visitedStops.has(stop.name)) continue;

        const stopLatLng = L.latLng(stop.coordinates.lat, stop.coordinates.lng);
        const distanceMeters = busLatLng.distanceTo(stopLatLng);

        // If Bus falls natively under 500 meters of an unvisited node
        if (distanceMeters < 500) {
          toast({
            title: "Upcoming Stop Warning",
            description: \`\${stop.name} - Arriving Shortly!\`,
          });
          
          setVisitedStops(prev => {
            const newSet = new Set(prev);
            newSet.add(stop.name);
            return newSet;
          });
          
          // Break to prevent rapid firing overlapping toasts for tight clusters
          break;
        }
      }
    } catch (err) {
      console.error(err);
    }
  }, [liveBusPosition, selectedRoute, visitedStops, toast]);

  // Raw Fallback line
  const rawFallbackCoords: [number, number][] = selectedRoute.stoppages.map(stop => [
    stop.coordinates.lat, 
    stop.coordinates.lng
  ]);

  const startPoint = rawFallbackCoords[0];
  const endPoint = rawFallbackCoords[rawFallbackCoords.length - 1];

  return (
    <div className="w-full h-full min-h-[50vh] relative z-0">
      
      {/* Dynamic CSS Injection to smoothly slide the Leaflet wrapper div 
          preventing rigid socket frame-jumping natively */}
      <style>{\`
        .live-bus-marker {
          transition: transform 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) !important;
        }
      \`}</style>

      <MapContainer 
        center={startPoint} 
        zoom={14} 
        zoomControl={false}
        className="w-full h-full min-h-screen z-0"
      >
        {/* Base Layer */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {/* 
          Placeholder Traffic TileLayer - Mapbox/TomTom
          Uncomment and hook KEY later for real-time red/yellow traffic densities 
        */}
        {/* <TileLayer 
          url="https://api.mapbox.com/styles/v1/mapbox/navigation-guidance-day-v4/tiles/{z}/{x}/{y}?access_token=YOUR_MAPBOX_KEY" 
          opacity={0.5} 
          zIndex={10} 
        /> */}

        <RecenterMap lat={startPoint[0]} lng={startPoint[1]} />

        {/* Draw GeoJSON if OSRM returned success, otherwise raw Polyline fallback */}
        {geoJsonData ? (
           <GeoJSON 
            key={selectedRoute.busNumber + "geojson"}
            data={geoJsonData} 
            style={{ color: '#0d9488', weight: 6, opacity: 0.9, lineCap: 'round', lineJoin: 'round' }} 
          />
        ) : (
           <Polyline 
            positions={rawFallbackCoords} 
            pathOptions={{ color: '#0d9488', weight: 5, opacity: 0.7, dashArray: '10, 10' }} 
          />
        )}

        {/* Nodes */}
        {startPoint && <Marker position={startPoint} icon={StartIcon} />}
        {endPoint && <Marker position={endPoint} icon={EndIcon} />}
        
        {/* Live Animating Marker */}
        {liveBusPosition && liveBusPosition[0] !== undefined && (
           <Marker position={liveBusPosition} icon={BusIcon}></Marker>
        )}

      </MapContainer>
    </div>
  );
};

export default RouteMap;
