import MobileLayout from "@/components/MobileLayout";
import BackButton from "@/components/BackButton";

const stops = [
  { name: "Kottur", time: "06:00 AM", distance: "0 km" },
  { name: "Guindy", time: "06:10 AM", distance: "3.5 km" },
  { name: "Saidapet", time: "06:15 AM", distance: "5.2 km" },
  { name: "BSLR Mall", time: "06:20 AM", distance: "7.0 km" },
  { name: "T Nagar", time: "06:30 AM", distance: "9.5 km" },
  { name: "Campus", time: "06:45 AM", distance: "12.0 km" },
];

const StoppageDetails = () => {
  return (
    <MobileLayout>
      <div className="flex flex-col min-h-screen px-8 py-6">
        <BackButton to="/home" />
        
        <div className="flex-1 pt-8">
          <h1 className="text-2xl font-bold text-foreground text-center mb-2">
            Stoppage Details
          </h1>
          <p className="text-muted-foreground text-center mb-8">Route no.1 - Kottur to Campus</p>

          <div className="space-y-0">
            {stops.map((stop, index) => (
              <div key={stop.name} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-primary border-2 border-primary" />
                  {index < stops.length - 1 && (
                    <div className="w-0.5 h-16 bg-primary/30" />
                  )}
                </div>
                <div className="flex-1 bg-muted rounded-2xl p-4 mb-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-foreground">{stop.name}</h3>
                    <span className="text-sm text-primary">{stop.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{stop.distance} from start</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default StoppageDetails;
