import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Menu, Bell, MapPin, Clock, Bus } from 'lucide-react';

// Task 2: Dynamic Routing and Stops
const busStops = [
  { id: 1, name: 'Kottur', coords: [13.0232, 80.2435] },
  { id: 2, name: 'IT Park Road', coords: [13.0150, 80.2350] },
  { id: 3, name: 'Main Gate', coords: [13.0067, 80.2206] },
  { id: 4, name: 'Campus', coords: [12.9900, 80.2100] }
];

const polylineCoords: [number, number][] = busStops.map(stop => stop.coords as [number, number]);

// Fix Leaflet icons
const createStopIcon = (num: number) => L.divIcon({
  className: 'custom-stop-icon',
  html: `<div style="width: 32px; height: 32px; background-color: #e2e8f0; border: 3px solid #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #94a3b8; box-shadow: 0 2px 4px rgba(0,0,0,0.1); font-family: sans-serif;">${num}</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

const busIcon = L.divIcon({
  className: 'custom-bus-icon',
  html: `<div style="width: 44px; height: 44px; background-color: #0d9488; border: 3px solid #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2);"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/></svg></div>`,
  iconSize: [44, 44],
  iconAnchor: [22, 22]
});

// Calculate distance logic for interpolation
const lerp = (start: number, end: number, t: number) => start + (end - start) * t;

const LiveMap = () => {
  // Task 3: Real-Time Bus Marker & Movement
  const [currentBusLocation, setCurrentBusLocation] = useState<[number, number]>(polylineCoords[0]);
  const [segmentIndex, setSegmentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulator loop: Updates smoothly every 50ms
    const interval = setInterval(() => {
      setProgress((prev) => {
        let newProgress = prev + 0.02; // Speed of bus
        let newSegment = segmentIndex;

        if (newProgress >= 1) {
          newProgress = 0;
          newSegment += 1;
        }

        if (newSegment >= polylineCoords.length - 1) {
          newSegment = 0; // Loop back for simulation purposes
          newProgress = 0;
        }

        if (newSegment !== segmentIndex) {
          setSegmentIndex(newSegment);
        }

        // Interpolate location between current stop and next
        const currentStop = polylineCoords[newSegment];
        const nextStop = polylineCoords[newSegment + 1];
        
        const lat = lerp(currentStop[0], nextStop[0], newProgress);
        const lng = lerp(currentStop[1], nextStop[1], newProgress);
        
        setCurrentBusLocation([lat, lng]);
        
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [segmentIndex]);


  // Task 4: UI Overlays
  return (
    <div className="relative w-full h-screen bg-gray-50 overflow-hidden">
      
      {/* Task 1: MapContainer setup */}
      <MapContainer 
        center={polylineCoords[1]} 
        zoom={14} 
        zoomControl={false}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {/* Task 2: Render Stops */}
        {busStops.map((stop, index) => (
          <Marker 
            key={stop.id} 
            position={stop.coords as [number, number]} 
            icon={createStopIcon(index + 1)} 
          />
        ))}

        {/* Task 2: Polyline Route */}
        <Polyline 
          positions={polylineCoords} 
          pathOptions={{ color: '#cbd5e1', weight: 4, opacity: 0.8 }} 
        />
        
        {/* Dynamic completed polyline tracking the bus */}
        <Polyline 
          positions={[...polylineCoords.slice(0, segmentIndex + 1), currentBusLocation]} 
          pathOptions={{ color: '#0d9488', weight: 4, opacity: 1 }} 
        />

        {/* Task 3: Render Bus Marker */}
        <Marker position={currentBusLocation} icon={busIcon} />
      </MapContainer>

      {/* --- UI OVERLAYS (Absolute Positioning above map z-0) --- */}
      
      {/* 1. Top Left: Hamburger & Zoom (Hidden default zoom) */}
      <div className="absolute top-6 left-4 z-[1000]">
        <button className="bg-white p-3 rounded-xl shadow-md border border-gray-100 hover:bg-gray-50 active:scale-95 transition-all">
          <Menu className="w-6 h-6 text-gray-800" />
        </button>
      </div>

      {/* 2. Top Right: Notification Bell */}
      <div className="absolute top-6 right-4 z-[1000]">
        <button className="bg-white p-3 rounded-xl shadow-md border border-gray-100 relative hover:bg-gray-50 active:scale-95 transition-all">
          <Bell className="w-6 h-6 text-gray-800" />
          <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
        </button>
      </div>

      {/* 3. Center Top: Location Pill */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-[1000]">
        <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-gray-100 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-teal-600" />
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-gray-900 leading-none">Your Current Location</span>
            <span className="text-[10px] text-gray-500 mt-0.5">IT Park Road</span>
          </div>
        </div>
      </div>

      {/* 4. Center: Teal ETA Banner */}
      <div className="absolute top-28 left-1/2 -translate-x-1/2 z-[1000] w-max">
        <div className="bg-teal-700/95 backdrop-blur-md px-6 py-3 rounded-2xl shadow-lg flex items-center gap-3">
          <Clock className="w-5 h-5 text-teal-100" />
          <span className="text-white font-medium text-sm">Reaching your stop in 10 min</span>
        </div>
      </div>

      {/* 5. Bottom Sheet: Route Drawer */}
      <div className="absolute bottom-0 left-0 right-0 z-[1000] p-4 pb-8">
        <div className="bg-white rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.08)] p-6 pt-3 relative w-full max-w-md mx-auto">
          {/* Drawer Handle */}
          <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
          
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 leading-tight">Route no.1</h2>
              <p className="text-gray-500 text-sm mt-1 font-medium">Kottur to Campus</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-full">
              <Bus className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default LiveMap;
