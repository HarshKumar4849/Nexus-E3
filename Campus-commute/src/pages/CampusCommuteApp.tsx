import React, { useState, useEffect } from 'react';
import RouteSelector from '../components/tracker/RouteSelector';
import StoppageTimeline from '../components/tracker/StoppageTimeline';
import LiveRouteMap from '../components/tracker/LiveRouteMap';
import { busRoutes } from '../data/busRoutes';
import { ShieldAlert } from 'lucide-react';

const CampusCommuteApp = () => {
  // Global State
  const [selectedRoute, setSelectedRoute] = useState(busRoutes[0]);
  const [liveBusPosition, setLiveBusPosition] = useState<[number, number]>([
    busRoutes[0].startPoint.coordinates.lat,
    busRoutes[0].startPoint.coordinates.lng
  ]);

  // Sync bus position to route's start point immediately when route changes
  useEffect(() => {
    setLiveBusPosition([
      selectedRoute.startPoint.coordinates.lat,
      selectedRoute.startPoint.coordinates.lng
    ]);
  }, [selectedRoute]);

  // WebSocket / Live Tracking Prep Placeholder
  useEffect(() => {
    // PREP: In a real environment, you connect to your websocket here
    // const socket = io('https://your-backend');
    // socket.on('driver-location', (data) => setLiveBusPosition([data.lat, data.lng]));
    
    // For verification: we simulate the bus moving slightly to prove marker reactivity
    const interval = setInterval(() => {
      setLiveBusPosition(prev => [prev[0] + 0.0001, prev[1] + 0.0001]);
    }, 2000);

    return () => clearInterval(interval);
  }, [selectedRoute]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row pb-6 md:pb-0 overflow-hidden">
      
      {/* Mobile-First Layout Wrapper */}
      <div className="w-full md:w-[400px] flex flex-col h-screen overflow-y-auto bg-gray-50 border-r border-gray-200 z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        
        {/* Header */}
        <div className="px-6 py-6 bg-white border-b border-gray-100">
          <h1 className="text-2xl font-black tracking-tight text-gray-900">Live Tracker</h1>
          <p className="text-gray-500 text-sm mt-1">Select your bus route to track the driver in real-time.</p>
        </div>

        {/* Horizontal Carousel (Route Selector) */}
        <RouteSelector 
          routes={busRoutes} 
          selectedRoute={selectedRoute} 
          onSelectRoute={setSelectedRoute} 
        />

        {/* Route Meta Alert */}
        <div className="px-4 py-4">
          <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 flex gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0" />
            <span className="text-xs text-amber-800 font-medium">
              {selectedRoute.remarks || "No active remarks from dispatcher."}
            </span>
          </div>
        </div>

        {/* Vertical Timeline */}
        <div className="px-4 pb-8 flex-1">
          <StoppageTimeline route={selectedRoute} />
        </div>

      </div>

      {/* Interactive Map Wrapper */}
      <div className="flex-1 h-[50vh] md:h-screen p-0 md:p-4 bg-gray-100 relative">
        <LiveRouteMap 
          route={selectedRoute} 
          liveBusPosition={liveBusPosition} 
        />
        
        {/* Floating Info Pill on Map */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-[1000] hidden md:block">
          <div className="bg-white/90 backdrop-blur shadow-sm px-6 py-2 rounded-full border border-gray-100">
            <span className="font-bold text-gray-900">{selectedRoute.busName}</span>
            <span className="mx-2 text-gray-300">|</span>
            <span className="text-teal-600 font-semibold">{selectedRoute.arrivalBus}</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CampusCommuteApp;
