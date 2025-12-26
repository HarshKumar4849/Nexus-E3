import { useState, useEffect } from "react";
import { Menu, Bell, MapPin, ChevronUp, ChevronDown, Bus, Clock, AlertCircle } from "lucide-react";
import MobileLayout from "@/components/MobileLayout";
import GradientButton from "@/components/GradientButton";
import AppSidebar from "@/components/AppSidebar";
import NotificationSheet from "@/components/NotificationSheet";
import RouteDetailsModal from "@/components/RouteDetailsModal";
import RouteMap from "@/components/RouteMap";
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

interface Stop {
  name: string;
  time: string;
  status: "passed" | "current" | "upcoming";
}

const stops: Stop[] = [
  { name: "Kottur", time: "06:00 AM", status: "passed" },
  { name: "Guindy", time: "06:10 AM", status: "passed" },
  { name: "Saidapet", time: "06:15 AM", status: "current" },
  { name: "BSLR Mall", time: "06:20 AM", status: "upcoming" },
];

const Home = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [bottomSheetExpanded, setBottomSheetExpanded] = useState(true);
  const [eta, setEta] = useState<number>(10);
  const [routeInfo, setRouteInfo] = useState<Route | null>(null);
  const [showRouteDetails, setShowRouteDetails] = useState(false);

  // Fetch ETA and route info from admin routes
  useEffect(() => {
    try {
      const adminRoutes = JSON.parse(localStorage.getItem("adminRoutes") || "[]");
      if (user?.routeNo) {
        const route = adminRoutes.find((r: Route) => r.number === `Route ${user.routeNo}`);
        if (route) {
          setRouteInfo(route);
          if (route.eta) {
            setEta(route.eta);
          }
        }
      }
    } catch (err) {
      // Fallback to default ETA
      setEta(10);
    }
  }, [user?.routeNo]);

  // Prepare map stops with coordinates for the background map
  const mapStops = [
    { name: "Kottur", lat: 13.0827, lng: 80.2707, status: "passed" as const, time: "06:00 AM" },
    { name: "Guindy", lat: 13.0920, lng: 80.2707, status: "passed" as const, time: "06:10 AM" },
    { name: "Saidapet", lat: 13.0636, lng: 80.2347, status: "current" as const, time: "06:15 AM" },
    { name: "BSLR Mall", lat: 13.0346, lng: 80.2518, status: "upcoming" as const, time: "06:20 AM" },
  ];

  return (
    <MobileLayout>
      <div className="relative h-screen overflow-hidden">
        {/* Leaflet Map Background - Faded & Greyscale Effect */}
        <div className="absolute inset-0 z-0 opacity-40" style={{ filter: 'grayscale(100%)' }}>
          <RouteMap stops={mapStops} routeNumber="Route" />
        </div>

        {/* Overlay gradient for better readability */}
        <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-b from-background/30 via-background/20 to-background/50"></div>

        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 z-10 px-6 pt-12 pb-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2"
            >
              <Menu className="w-6 h-6 text-foreground" />
            </button>
            
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground">Your Current Location</span>
            </div>

            <button 
              onClick={() => setNotificationsOpen(true)}
              className="p-2 -mr-2 relative"
            >
              <Bell className="w-6 h-6 text-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            </button>
          </div>
        </div>

        {/* Status Chip with ETA */}
        <div className="absolute top-28 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-primary/90 text-primary-foreground px-4 py-2 rounded-full text-sm shadow-lg flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Reaching your stop in {eta} min</span>
          </div>
        </div>

        {/* Bus Icon on Map */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 z-10">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <Bus className="w-6 h-6 text-primary-foreground" />
          </div>
        </div>

        {/* Bottom Sheet */}
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl shadow-lg transition-all duration-300 z-20 ${
            bottomSheetExpanded ? "h-[55%]" : "h-32"
          }`}
        >
          <div className="px-6 pt-4">
            {/* Handle */}
            <button 
              onClick={() => setBottomSheetExpanded(!bottomSheetExpanded)}
              className="w-full flex justify-center mb-4"
            >
              {bottomSheetExpanded ? (
                <ChevronDown className="w-6 h-6 text-muted-foreground" />
              ) : (
                <ChevronUp className="w-6 h-6 text-muted-foreground" />
              )}
            </button>

            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-card-foreground">
                  {routeInfo?.number || "Route no.1"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {routeInfo?.stops?.length ? `${routeInfo.stops[0]} to ${routeInfo.stops[routeInfo.stops.length - 1]}` : "Kottur to Campus"}
                </p>
              </div>
              <div className="text-right">
                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                  <Bus className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* Route and ETA Info */}
            {bottomSheetExpanded && (
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-muted rounded-xl p-3">
                  <p className="text-xs text-muted-foreground mb-1">Timing</p>
                  <p className="text-sm font-medium text-foreground">
                    {routeInfo?.timing || "06:00 AM"}
                  </p>
                </div>
                <div className="bg-muted rounded-xl p-3 flex flex-col items-end">
  <p className="text-xs text-muted-foreground mb-1">
    ETA
  </p>
  <p className="text-sm font-medium text-foreground flex items-center gap-1">
    <Clock className="w-4 h-4 text-primary" />
    {eta} min
  </p>
</div>

                {routeInfo?.assignedBus && (
                  <div className="bg-muted rounded-xl p-3">
                    <p className="text-xs text-muted-foreground mb-1">Bus</p>
                    <p className="text-sm font-medium text-foreground">
                      {routeInfo.assignedBus}
                    </p>
                  </div>
                )}
                {routeInfo?.assignedDriver && (
                  <div className="bg-muted rounded-xl p-3">
                    <p className="text-xs text-muted-foreground mb-1">Driver</p>
                    <p className="text-sm font-medium text-foreground">
                      {routeInfo.assignedDriver}
                    </p>
                  </div>
                )}
              </div>
            )}

            {bottomSheetExpanded && (
              <>
                {/* Timeline */}
                <div className="space-y-0 mb-6">
                  {stops.map((stop, index) => (
                    <div key={stop.name} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div 
                          className={`w-4 h-4 rounded-full border-2 ${
                            stop.status === "passed" 
                              ? "bg-primary border-primary" 
                              : stop.status === "current"
                              ? "bg-primary border-primary animate-pulse"
                              : "bg-muted border-muted-foreground"
                          }`}
                        />
                        {index < stops.length - 1 && (
                          <div className={`w-0.5 h-8 ${
                            stop.status === "passed" ? "bg-primary" : "bg-muted"
                          }`} />
                        )}
                      </div>
                      <div className="flex-1 flex justify-between pb-6">
                        <span className={`text-sm ${
                          stop.status === "current" ? "text-primary font-medium" : "text-card-foreground"
                        }`}>
                          {stop.name}
                        </span>
                        <span className="text-sm text-muted-foreground">{stop.time}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <GradientButton 
                  onClick={() => setShowRouteDetails(true)}
                  className="w-full"
                >
                  View Route Details
                </GradientButton>
              </>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <AppSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Notifications */}
        <NotificationSheet 
          open={notificationsOpen} 
          onClose={() => setNotificationsOpen(false)} 
        />

        {/* Route Details Modal */}
        {routeInfo && (
          <RouteDetailsModal
            open={showRouteDetails}
            onClose={() => setShowRouteDetails(false)}
            routeNumber={routeInfo.number}
            stops={routeInfo.stops}
            timing={routeInfo.timing}
            eta={eta}
            assignedBus={routeInfo.assignedBus}
            assignedDriver={routeInfo.assignedDriver}
            conductorName={routeInfo.conductorName}
            conductorPhone={routeInfo.conductorPhone}
          />
        )}
      </div>
    </MobileLayout>
  );
};

export default Home;
