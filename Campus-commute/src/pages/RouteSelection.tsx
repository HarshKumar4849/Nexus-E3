import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bus, ChevronLeft, ChevronRight, Clock, MapPin } from "lucide-react";
import MobileLayout from "@/components/MobileLayout";
import GradientButton from "@/components/GradientButton";
import BackButton from "@/components/BackButton";
import { useAuth } from "@/contexts/AuthContext";

interface Route {
  id: string;
  number: string;
  stops: string[];
  timing: string;
  assignedBus?: string;
  assignedDriver?: string;
  conductorName?: string;
  conductorPhone?: string;
  eta?: number;
}

const initialRoutes = [
  { id: 1, name: "Route no.1" },
  { id: 2, name: "Route no.2" },
  { id: 3, name: "Route no.3" },
  { id: 4, name: "Route no.4" },
  { id: 5, name: "Route no.5" },
  { id: 6, name: "Route no.6" },
  { id: 7, name: "Route no.7" },
  { id: 8, name: "Route no.8" },
  { id: 9, name: "Route no.9" },
  { id: 10, name: "Route no.10" },
];

const RouteSelection = () => {
  const navigate = useNavigate();
  const { setSelectedRoute } = useAuth();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [routes, setRoutes] = useState<(typeof initialRoutes[0] | Route)[]>(initialRoutes);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [selectedRouteDetails, setSelectedRouteDetails] = useState<Route | null>(null);

  // Load routes from localStorage or use default
  useEffect(() => {
    const savedRoutes = localStorage.getItem("adminRoutes");
    if (savedRoutes) {
      try {
        const parsedRoutes = JSON.parse(savedRoutes);
        if (parsedRoutes.length > 0) {
          setRoutes(parsedRoutes);
        }
      } catch {
        setRoutes(initialRoutes);
      }
    }
  }, []);

  const handleSelectRoute = (routeId: number | string) => {
    setSelectedId(routeId as number);
    
    // Try to find route details from admin routes
    const savedRoutes = localStorage.getItem("adminRoutes");
    if (savedRoutes) {
      try {
        const parsedRoutes = JSON.parse(savedRoutes) as Route[];
        const routeNum = typeof routeId === "string" ? routeId : `Route ${routeId}`;
        const route = parsedRoutes.find((r: Route) => r.number === routeNum);
        if (route) {
          setSelectedRouteDetails(route);
        }
      } catch {
        setSelectedRouteDetails(null);
      }
    }
  };

  const handleContinue = () => {
    if (selectedId) {
      setSelectedRoute(selectedId);
      navigate("/home");
    }
  };

  const handleScroll = (direction: "left" | "right") => {
    const container = document.getElementById("routes-container");
    if (container) {
      const scrollAmount = 90;
      if (direction === "left") {
        container.scrollLeft -= scrollAmount;
        setScrollPosition(container.scrollLeft);
      } else {
        container.scrollLeft += scrollAmount;
        setScrollPosition(container.scrollLeft);
      }
    }
  };

  return (
    <MobileLayout>
      <div className="flex flex-col min-h-screen px-8 py-6">
        <BackButton />
        
        <div className="flex-1 pt-8">
          <h1 className="text-3xl font-bold text-foreground text-center mb-8">
            Campus Commute
          </h1>
          
          <h2 className="text-xl text-muted-foreground text-center mb-8">
            Select Your Bus Route
          </h2>

          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={() => handleScroll("left")}
              className="p-2 hover:bg-muted rounded-full transition-colors flex-shrink-0"
            >
              <ChevronLeft className="w-6 h-6 text-foreground" />
            </button>

            <div
              id="routes-container"
              className="flex gap-4 overflow-x-auto pb-4 flex-1 scroll-smooth"
              style={{ scrollBehavior: "smooth" }}
            >
              {routes.map((route) => (
                <button
                  key={route.id}
                  onClick={() => handleSelectRoute(route.id)}
                  className={`flex flex-col items-center min-w-[70px] transition-all ${
                    selectedId === route.id ? "scale-110" : ""
                  }`}
                >
                  <div 
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                      selectedId === route.id 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Bus className="w-7 h-7" />
                  </div>
                  <span className={`text-sm mt-2 text-center ${
                    selectedId === route.id ? "text-foreground font-medium" : "text-muted-foreground"
                  }`}>
                    {"number" in route ? route.number : route.name}
                  </span>
                </button>
              ))}
            </div>

            <button
              onClick={() => handleScroll("right")}
              className="p-2 hover:bg-muted rounded-full transition-colors flex-shrink-0"
            >
              <ChevronRight className="w-6 h-6 text-foreground" />
            </button>
          </div>

          {/* Selected Route Details */}
          {selectedRouteDetails && (
            <div className="mt-8 bg-muted rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                {selectedRouteDetails.number}
              </h3>

              {/* Stops */}
              <div>
                <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Route Stops
                </p>
                <p className="text-sm text-foreground">
                  {selectedRouteDetails.stops.join(" → ")}
                </p>
              </div>

              {/* Timing & ETA */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Timing
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {selectedRouteDetails.timing}
                  </p>
                </div>
                {selectedRouteDetails.eta && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      ETA
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {selectedRouteDetails.eta} min
                    </p>
                  </div>
                )}
              </div>

              {/* Bus & Driver Info */}
              {(selectedRouteDetails.assignedBus || selectedRouteDetails.assignedDriver) && (
                <div className="grid grid-cols-2 gap-3">
                  {selectedRouteDetails.assignedBus && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Bus</p>
                      <p className="text-sm font-medium text-foreground">
                        {selectedRouteDetails.assignedBus}
                      </p>
                    </div>
                  )}
                  {selectedRouteDetails.assignedDriver && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Driver</p>
                      <p className="text-sm font-medium text-foreground">
                        {selectedRouteDetails.assignedDriver}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Conductor Info */}
              {selectedRouteDetails.conductorName && (
                <div className="pt-2 border-t border-background">
                  <p className="text-xs text-muted-foreground mb-2">Conductor</p>
                  <p className="text-sm text-foreground">
                    {selectedRouteDetails.conductorName}
                  </p>
                  {selectedRouteDetails.conductorPhone && (
                    <p className="text-xs text-primary mt-1">
                      {selectedRouteDetails.conductorPhone}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="mt-12">
            <GradientButton 
              onClick={handleContinue}
              disabled={!selectedId}
            >
              Continue
            </GradientButton>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default RouteSelection;
