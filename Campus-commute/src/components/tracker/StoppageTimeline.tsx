import React from 'react';
import { MapPin, Navigation, Clock } from 'lucide-react';
import type { BusRoute } from '../../data/busRoutes';

interface StoppageTimelineProps {
  route: BusRoute;
}

const StoppageTimeline: React.FC<StoppageTimelineProps> = ({ route }) => {
  const stoppages = route.stoppages;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overscroll-contain overflow-y-auto max-h-[40vh] relative">
      <div className="flex items-center gap-2 mb-6">
        <Navigation className="w-5 h-5 text-teal-600" />
        <h2 className="text-lg font-bold text-gray-900">Route Stoppages</h2>
      </div>

      <div className="relative pl-2">
        {/* Continuous vertical line backdrop */}
        <div className="absolute left-6 top-3 bottom-8 w-0.5 bg-gray-200 z-0"></div>

        {stoppages.map((stop, index) => {
          const isFirst = index === 0;
          const isLast = index === stoppages.length - 1;
          const time = stop.arrivalTime || "TBD";
          
          return (
            <div key={`${stop.name}-${index}`} className="flex gap-6 mb-8 relative z-10 w-full group">
              {/* Timeline Node */}
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full border-4 border-white shadow-sm flex items-center justify-center relative z-10 transition-transform ${
                  isFirst ? 'bg-green-500 scale-110' : isLast ? 'bg-red-500 scale-110' : 'bg-gray-300 group-hover:bg-teal-400'
                }`}>
                  {isFirst || isLast ? (
                    <MapPin className="w-3 h-3 text-white" />
                  ) : (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
              </div>

              {/* Data Card */}
              <div className="flex-1 -mt-1 pb-2 border-b border-gray-50 border-dashed">
                <h3 className={`font-semibold tracking-tight ${isFirst || isLast ? 'text-gray-900 text-base' : 'text-gray-600 text-sm'}`}>
                  {stop.name}
                </h3>
                
                <div className="flex items-center gap-1.5 mt-1">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span className={`text-xs font-medium ${time === 'TBD' ? 'text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded' : 'text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded'}`}>
                    {time}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StoppageTimeline;
