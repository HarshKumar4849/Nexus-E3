import React from 'react';
import { Bus, Navigation } from 'lucide-react';
import type { BusRoute } from '../../data/busRoutes';

interface RouteSelectorProps {
  routes: BusRoute[];
  selectedRoute: BusRoute;
  onSelectRoute: (route: BusRoute) => void;
}

const RouteSelector: React.FC<RouteSelectorProps> = ({ routes, selectedRoute, onSelectRoute }) => {
  return (
    <div className="w-full overflow-x-auto py-4 px-4 bg-white shadow-sm border-b no-scrollbar touch-pan-x" style={{ scrollbarWidth: 'none' }}>
      <div className="flex gap-4 min-w-max">
        {routes.map((route) => {
          const isSelected = selectedRoute.busNumber === route.busNumber;
          return (
            <button
              key={route.busNumber}
              onClick={() => onSelectRoute(route)}
              className={`relative flex items-center gap-3 px-6 py-3 rounded-full border-2 transition-all duration-300 ${
                isSelected 
                  ? 'border-teal-600 bg-teal-50 text-teal-900 shadow-md transform scale-105' 
                  : 'border-gray-200 bg-white text-gray-500 hover:border-teal-300 hover:bg-gray-50'
              }`}
            >
              <div className={`p-2 rounded-full ${isSelected ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                <Bus className="w-4 h-4" />
              </div>
              <div className="flex flex-col items-start">
                <span className={`text-sm font-bold tracking-tight ${isSelected ? 'text-teal-900' : 'text-gray-700'}`}>
                  {route.busName}
                </span>
                <span className="text-[10px] uppercase font-semibold text-gray-400">
                  {route.classTime.split(' TO ')[0]} Departure
                </span>
              </div>
              
              {isSelected && (
                <div className="absolute -top-1 -right-1 bg-teal-600 text-white rounded-full p-1 shadow-sm">
                  <Navigation className="w-3 h-3" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RouteSelector;
