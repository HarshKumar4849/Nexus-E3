import MobileLayout from "@/components/MobileLayout";
import BackButton from "@/components/BackButton";
import { useAuth } from "@/contexts/AuthContext";
import { MapPin, Clock } from "lucide-react";

const DriverStopDetails = () => {
  const { user } = useAuth();

  // Try to get stops from admin saved routes
  const savedRoutes = JSON.parse(localStorage.getItem("campus-commute-routes") || "[]");
  const myRoute = savedRoutes.find((r: any) => String(r.id) === String(user?.routeNo));

  const stops = myRoute?.stops || [
    { name: "Kottur", time: "06:00 AM" },
    { name: "Guindy", time: "06:10 AM" },
    { name: "Saidapet", time: "06:15 AM" },
    { name: "BSLR Mall", time: "06:20 AM" },
  ];

  return (
    <MobileLayout>
      <div className="flex flex-col min-h-screen px-8 py-6">
        <BackButton to="/driver-home" />

        <div className="flex-1 pt-8">
          <h1 className="text-2xl font-bold text-foreground text-center mb-8">Stop Details</h1>

          <div className="space-y-4">
            {stops.map((stop: any, idx: number) => (
              <div key={stop.name} className="bg-muted rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">{idx === 0 ? "Start" : idx === stops.length - 1 ? "End" : `Stop ${idx + 1}`}</p>
                    <p className="text-foreground font-medium">{stop.name}</p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{stop.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default DriverStopDetails;
