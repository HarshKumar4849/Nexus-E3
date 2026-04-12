import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { BusRoute } from '../../data/busRoutes';

// Re-center component
const RecenterAutomatically = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 13);
  }, [lat, lng, map]);
  return null;
};

// Map Icons
const StartIcon = L.divIcon({
  className: '',
  html: `<div style="width:24px;height:24px;background-color:#10b981;border:3px solid white;border-radius:50%;box-shadow:0 2px 4px rgba(0,0,0,0.3);"></div>`,
  iconAnchor: [12, 12]
});

const EndIcon = L.divIcon({
  className: '',
  html: `<div style="width:24px;height:24px;background-color:#ef4444;border:3px solid white;border-radius:50%;box-shadow:0 2px 4px rgba(0,0,0,0.3);"></div>`,
  iconAnchor: [12, 12]
});

const BusIcon = L.divIcon({
  className: 'custom-bus-icon',
  html: `<div style="width:40px;height:40px;background-color:#0f766e;border:3px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 6px rgba(0,0,0,0.3);"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/></svg></div>`,
  iconAnchor: [20, 20]
});

interface LiveRouteMapProps {
  route: BusRoute;
  liveBusPosition: [number, number];
}

const LiveRouteMap: React.FC<LiveRouteMapProps> = ({ route, liveBusPosition }) => {
  const coords: [number, number][] = route.stoppages.map(stop => [stop.coordinates.lat, stop.coordinates.lng]);
  const startPoint = coords[0];
  const endPoint = coords[coords.length - 1];

  return (
    <div className="w-full h-full relative z-0 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      <MapContainer 
        center={startPoint} 
        zoom={13} 
        zoomControl={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        <RecenterAutomatically lat={startPoint[0]} lng={startPoint[1]} />

        {/* Dynamic Route Polyline */}
        <Polyline 
          positions={coords} 
          pathOptions={{ color: '#0d9488', weight: 4, opacity: 0.8 }} 
        />

        {/* Markers */}
        <Marker position={startPoint} icon={StartIcon} />
        <Marker position={endPoint} icon={EndIcon} />
        
        {/* Animated Live Bus Marker */}
        <Marker position={liveBusPosition} icon={BusIcon} />

      </MapContainer>
    </div>
  );
};

export default LiveRouteMap;
