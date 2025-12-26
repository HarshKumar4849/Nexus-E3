import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, ChevronUp, ChevronDown } from "lucide-react";
import MobileLayout from "@/components/MobileLayout";
import FormInput from "@/components/FormInput";
import GradientButton from "@/components/GradientButton";
import BackButton from "@/components/BackButton";
import { useToast } from "@/hooks/use-toast";

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

const AdminPanel = () => {
  const { toast } = useToast();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [showAddRoute, setShowAddRoute] = useState(false);
  const [expandedRoute, setExpandedRoute] = useState<string | null>(null);
  const [editingRoute, setEditingRoute] = useState<string | null>(null);

  // Form states
  const [routeNumber, setRouteNumber] = useState("");
  const [stops, setStops] = useState("");
  const [timing, setTiming] = useState("");
  const [assignedBus, setAssignedBus] = useState("");
  const [assignedDriver, setAssignedDriver] = useState("");
  const [conductorName, setConductorName] = useState("");
  const [conductorPhone, setConductorPhone] = useState("");
  const [eta, setEta] = useState("");

  // Load routes from localStorage
  useEffect(() => {
    const savedRoutes = localStorage.getItem("adminRoutes");
    if (savedRoutes) {
      try {
        setRoutes(JSON.parse(savedRoutes));
      } catch {
        setRoutes([]);
      }
    }
  }, []);

  // Save routes to localStorage
  const saveRoutes = (newRoutes: Route[]) => {
    localStorage.setItem("adminRoutes", JSON.stringify(newRoutes));
    setRoutes(newRoutes);
  };

  const handleAddRoute = () => {
    if (!routeNumber.trim() || !stops.trim() || !timing.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    const newRoute: Route = {
      id: Date.now().toString(),
      number: routeNumber,
      stops: stops.split(",").map((s) => s.trim()),
      timing,
      assignedBus: assignedBus || undefined,
      assignedDriver: assignedDriver || undefined,
      conductorName: conductorName || undefined,
      conductorPhone: conductorPhone || undefined,
      eta: eta ? parseInt(eta) : undefined,
    };

    const newRoutes = [...routes, newRoute];
    saveRoutes(newRoutes);

    // Reset form
    setRouteNumber("");
    setStops("");
    setTiming("");
    setAssignedBus("");
    setAssignedDriver("");
    setConductorName("");
    setConductorPhone("");
    setEta("");
    setShowAddRoute(false);

    toast({
      title: "Route Added",
      description: `Route ${routeNumber} has been added successfully`,
    });
  };

  const handleEditRoute = (routeId: string) => {
    const route = routes.find((r) => r.id === routeId);
    if (route) {
      setRouteNumber(route.number);
      setStops(route.stops.join(", "));
      setTiming(route.timing);
      setAssignedBus(route.assignedBus || "");
      setAssignedDriver(route.assignedDriver || "");
      setConductorName(route.conductorName || "");
      setConductorPhone(route.conductorPhone || "");
      setEta(route.eta ? route.eta.toString() : "");
      setEditingRoute(routeId);
    }
  };

  const handleUpdateRoute = () => {
    if (!routeNumber.trim() || !stops.trim() || !timing.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    const newRoutes = routes.map((r) =>
      r.id === editingRoute
        ? {
            ...r,
            number: routeNumber,
            stops: stops.split(",").map((s) => s.trim()),
            timing,
            assignedBus: assignedBus || undefined,
            assignedDriver: assignedDriver || undefined,
            conductorName: conductorName || undefined,
            conductorPhone: conductorPhone || undefined,
            eta: eta ? parseInt(eta) : undefined,
          }
        : r
    );

    saveRoutes(newRoutes);

    // Reset form
    setRouteNumber("");
    setStops("");
    setTiming("");
    setAssignedBus("");
    setAssignedDriver("");
    setConductorName("");
    setConductorPhone("");
    setEta("");
    setEditingRoute(null);

    toast({
      title: "Route Updated",
      description: "Route has been updated successfully",
    });
  };

  const handleDeleteRoute = (routeId: string) => {
    const newRoutes = routes.filter((r) => r.id !== routeId);
    saveRoutes(newRoutes);
    toast({
      title: "Route Deleted",
      description: "Route has been deleted successfully",
    });
  };

  return (
    <MobileLayout>
      <div className="flex flex-col min-h-screen px-8 py-6">
        <BackButton to="/" />

        <div className="flex-1 pt-8">
          <h1 className="text-2xl font-bold text-foreground text-center mb-8">
            Admin Panel
          </h1>

          {!showAddRoute && editingRoute === null && (
            <button
              onClick={() => setShowAddRoute(true)}
              className="w-full mb-8 py-3 px-4 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center gap-2 hover:opacity-90 transition-opacity font-medium"
            >
              <Plus size={20} />
              Add New Route
            </button>
          )}

          {/* Add/Edit Route Form */}
          {(showAddRoute || editingRoute) && (
            <div className="bg-muted rounded-2xl p-6 mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                {editingRoute ? "Edit Route" : "Add New Route"}
              </h2>

              <div className="space-y-4">
                <FormInput
                  label="Route Number"
                  placeholder="e.g., Route 5"
                  value={routeNumber}
                  onChange={(e) => setRouteNumber(e.target.value)}
                />

                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    Stops (comma-separated)
                  </label>
                  <textarea
                    placeholder="e.g., Stop A, Stop B, Stop C"
                    value={stops}
                    onChange={(e) => setStops(e.target.value)}
                    className="w-full bg-background border-2 border-muted rounded-2xl p-3 text-foreground focus:border-primary focus:outline-none"
                    rows={3}
                  />
                </div>

                <FormInput
                  label="Timing"
                  placeholder="e.g., 06:00 AM"
                  value={timing}
                  onChange={(e) => setTiming(e.target.value)}
                />

                <FormInput
                  label="Assigned Bus (Optional)"
                  placeholder="e.g., TN 01 AB 1234"
                  value={assignedBus}
                  onChange={(e) => setAssignedBus(e.target.value)}
                />

                <FormInput
                  label="Assigned Driver (Optional)"
                  placeholder="e.g., Driver Name"
                  value={assignedDriver}
                  onChange={(e) => setAssignedDriver(e.target.value)}
                />

                <FormInput
                  label="Conductor Name (Optional)"
                  placeholder="e.g., Conductor Name"
                  value={conductorName}
                  onChange={(e) => setConductorName(e.target.value)}
                />

                <FormInput
                  label="Conductor Phone (Optional)"
                  placeholder="e.g., +91 9876543210"
                  value={conductorPhone}
                  onChange={(e) => setConductorPhone(e.target.value)}
                />

                <FormInput
                  label="ETA (minutes, Optional)"
                  type="number"
                  placeholder="e.g., 15"
                  value={eta}
                  onChange={(e) => setEta(e.target.value)}
                />

                <div className="flex gap-2 pt-4">
                  <GradientButton
                    onClick={editingRoute ? handleUpdateRoute : handleAddRoute}
                    className="flex-1"
                  >
                    {editingRoute ? "Update" : "Add"} Route
                  </GradientButton>
                  <button
                    onClick={() => {
                      setShowAddRoute(false);
                      setEditingRoute(null);
                      setRouteNumber("");
                      setStops("");
                      setTiming("");
                      setAssignedBus("");
                      setAssignedDriver("");
                    }}
                    className="flex-1 py-3 px-4 border-2 border-foreground/20 rounded-2xl text-foreground font-medium hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Routes List */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Routes ({routes.length})
            </h2>

            {routes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No routes added yet.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Click "Add New Route" to get started.
                </p>
              </div>
            ) : (
              routes.map((route) => (
                <div key={route.id} className="bg-muted rounded-2xl overflow-hidden">
                  <button
                    onClick={() =>
                      setExpandedRoute(
                        expandedRoute === route.id ? null : route.id
                      )
                    }
                    className="w-full p-4 flex items-center justify-between hover:bg-background/50 transition-colors"
                  >
                    <div className="text-left flex-1">
                      <p className="font-semibold text-foreground">
                        {route.number}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {route.timing}
                      </p>
                    </div>
                    {expandedRoute === route.id ? (
                      <ChevronUp className="text-muted-foreground" />
                    ) : (
                      <ChevronDown className="text-muted-foreground" />
                    )}
                  </button>

                  {expandedRoute === route.id && (
                    <div className="px-4 pb-4 space-y-3 border-t border-background">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Stops
                        </p>
                        <p className="text-foreground text-sm">
                          {route.stops.join(" → ")}
                        </p>
                      </div>

                      {route.assignedBus && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            Assigned Bus
                          </p>
                          <p className="text-foreground text-sm">
                            {route.assignedBus}
                          </p>
                        </div>
                      )}

                      {route.assignedDriver && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            Assigned Driver
                          </p>
                          <p className="text-foreground text-sm">
                            {route.assignedDriver}
                          </p>
                        </div>
                      )}

                      {route.conductorName && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            Conductor Name
                          </p>
                          <p className="text-foreground text-sm">
                            {route.conductorName}
                          </p>
                        </div>
                      )}

                      {route.conductorPhone && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            Conductor Phone
                          </p>
                          <p className="text-foreground text-sm">
                            {route.conductorPhone}
                          </p>
                        </div>
                      )}

                      {route.eta && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            Estimated Time (minutes)
                          </p>
                          <p className="text-foreground text-sm">
                            {route.eta} min
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2 pt-4">
                        <button
                          onClick={() => handleEditRoute(route.id)}
                          className="flex-1 py-2 px-3 rounded-xl bg-primary/20 text-primary flex items-center justify-center gap-2 hover:bg-primary/30 transition-colors"
                        >
                          <Edit2 size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteRoute(route.id)}
                          className="flex-1 py-2 px-3 rounded-xl bg-destructive/20 text-destructive flex items-center justify-center gap-2 hover:bg-destructive/30 transition-colors"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default AdminPanel;
