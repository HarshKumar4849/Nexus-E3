import React, { createContext, useContext, useState, ReactNode } from "react";
// @ts-ignore - Importing JSON outside src is fine if Vite allows it, or we bypass types.
import routesDataRaw from "../../../backend/data/routes.json";

export interface Coordinate {
  lat: number;
  lng: number;
}

export interface Stop {
  name: string;
  coordinates: Coordinate;
  sequenceOrder: number;
  arrivalTime: string | null;
}

export interface BusRoute {
  busNumber: string;
  busName: string;
  routeName: string;
  startPoint: { name: string; coordinates: Coordinate };
  stoppages: Stop[];
  endPoint: { name: string; coordinates: Coordinate };
  classTime: string;
  arrivalBus: string;
  drivers: any[];
  isActive: boolean;
  remarks: string | null;
}

const routesData: BusRoute[] = routesDataRaw as BusRoute[];

interface RouteContextType {
  routes: BusRoute[];
  selectedRoute: BusRoute;
  setSelectedRoute: (route: BusRoute) => void;
  liveBusPosition: [number, number];
  setLiveBusPosition: React.Dispatch<React.SetStateAction<[number, number]>>;
}

const RouteContext = createContext<RouteContextType | undefined>(undefined);

export const RouteProvider = ({ children }: { children: ReactNode }) => {
  const [routes] = useState<BusRoute[]>(routesData);
  const [selectedRoute, setSelectedRoute] = useState<BusRoute>(routes[0]);
  
  // Default the live marker to the start point of whatever route is selected
  const [liveBusPosition, setLiveBusPosition] = useState<[number, number]>([
    routes[0].startPoint.coordinates.lat,
    routes[0].startPoint.coordinates.lng
  ]);

  return (
    <RouteContext.Provider
      value={{
        routes,
        selectedRoute,
        setSelectedRoute,
        liveBusPosition,
        setLiveBusPosition,
      }}
    >
      {children}
    </RouteContext.Provider>
  );
};

export const useRouteContext = (): RouteContextType => {
  const context = useContext(RouteContext);
  if (!context) {
    throw new Error("useRouteContext must be used within a RouteProvider");
  }
  return context;
};
