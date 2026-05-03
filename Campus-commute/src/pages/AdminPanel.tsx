import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, ChevronUp, ChevronDown, Save, Users, Settings } from "lucide-react";
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

interface AdminSettings {
  adminName: string;
  adminPhone: string;
  dutyInstructions: string;
}

interface Driver {
  _id: string;
  fullname: string;
  email: string;
  routeNo?: string;
  phone?: string;
}

const AdminPanel = () => {
  const { toast } = useToast();
  
  // States
  const [activeTab, setActiveTab] = useState<"settings" | "routes" | "drivers">("settings");
  
  // Settings State
  const [adminSettings, setAdminSettings] = useState<AdminSettings>({
    adminName: "", adminPhone: "", dutyInstructions: ""
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  
  // Drivers State
  const [drivers, setDrivers] = useState<Driver[]>([]);
  
  // Routes State
  const [routes, setRoutes] = useState<Route[]>([]);
  const [showAddRoute, setShowAddRoute] = useState(false);
  const [expandedRoute, setExpandedRoute] = useState<string | null>(null);
  const [editingRoute, setEditingRoute] = useState<string | null>(null);

  // Form states for Routes
  const [routeNumber, setRouteNumber] = useState("");
  const [stops, setStops] = useState("");
  const [timing, setTiming] = useState("");
  const [assignedBus, setAssignedBus] = useState("");
  const [assignedDriver, setAssignedDriver] = useState("");
  const [conductorName, setConductorName] = useState("");
  const [conductorPhone, setConductorPhone] = useState("");
  const [eta, setEta] = useState("");

  // Load Initial Data
  useEffect(() => {
    fetchSettings();
    fetchDrivers();
    
    const savedRoutes = localStorage.getItem("adminRoutes");
    if (savedRoutes) {
      try { setRoutes(JSON.parse(savedRoutes)); } catch { setRoutes([]); }
    }
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/admin/settings", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        if (data.settings) setAdminSettings(data.settings);
      }
    } catch (error) {
      console.error("Failed to fetch settings", error);
    }
  };

  const fetchDrivers = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/admin/drivers", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        if (data.drivers) setDrivers(data.drivers);
      }
    } catch (error) {
      console.error("Failed to fetch drivers", error);
    }
  };

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    try {
      const res = await fetch("http://localhost:8000/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(adminSettings)
      });
      if (res.ok) {
        toast({ title: "Success", description: "Admin settings updated successfully." });
      } else {
        throw new Error("Failed to update");
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to update admin settings.", variant: "destructive" });
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleUpdateDriverRoute = async (driverId: string, newRouteNo: string) => {
    try {
      const res = await fetch("http://localhost:8000/api/admin/drivers/assign", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ driverId, routeNo: newRouteNo })
      });
      if (res.ok) {
        toast({ title: "Driver Assigned", description: `Driver assigned to Route ${newRouteNo}` });
        fetchDrivers(); // Refresh list
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to assign driver.", variant: "destructive" });
    }
  };

  // --- Routes Logic ---
  const saveRoutes = (newRoutes: Route[]) => {
    localStorage.setItem("adminRoutes", JSON.stringify(newRoutes));
    setRoutes(newRoutes);
  };

  const handleAddRoute = () => {
    if (!routeNumber.trim() || !stops.trim() || !timing.trim()) {
      toast({ title: "Validation Error", description: "Please fill all required fields", variant: "destructive" });
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
    saveRoutes([...routes, newRoute]);
    resetRouteForm();
    toast({ title: "Route Added", description: `Route ${routeNumber} has been added successfully` });
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
      toast({ title: "Validation Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }
    const newRoutes = routes.map((r) => r.id === editingRoute ? {
      ...r, number: routeNumber, stops: stops.split(",").map((s) => s.trim()), timing,
      assignedBus: assignedBus || undefined, assignedDriver: assignedDriver || undefined,
      conductorName: conductorName || undefined, conductorPhone: conductorPhone || undefined,
      eta: eta ? parseInt(eta) : undefined,
    } : r);
    saveRoutes(newRoutes);
    resetRouteForm();
    toast({ title: "Route Updated", description: "Route has been updated successfully" });
  };

  const handleDeleteRoute = (routeId: string) => {
    saveRoutes(routes.filter((r) => r.id !== routeId));
    toast({ title: "Route Deleted", description: "Route has been deleted successfully" });
  };

  const resetRouteForm = () => {
    setShowAddRoute(false); setEditingRoute(null); setRouteNumber(""); setStops("");
    setTiming(""); setAssignedBus(""); setAssignedDriver(""); setConductorName("");
    setConductorPhone(""); setEta("");
  };

  return (
    <MobileLayout>
      <div className="flex flex-col min-h-screen px-4 sm:px-8 py-6">
        <BackButton to="/" />

        <div className="flex-1 pt-8">
          <h1 className="text-2xl font-bold text-foreground text-center mb-6">Admin Panel</h1>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mb-6 bg-muted p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab("settings")}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 ${activeTab === "settings" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
            >
              <Settings size={16} /> Global
            </button>
            <button
              onClick={() => setActiveTab("drivers")}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 ${activeTab === "drivers" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
            >
              <Users size={16} /> Drivers
            </button>
            <button
              onClick={() => setActiveTab("routes")}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 ${activeTab === "routes" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
            >
              <Plus size={16} /> Routes
            </button>
          </div>

          {/* Tab Content: Settings */}
          {activeTab === "settings" && (
            <div className="bg-muted rounded-2xl p-6 mb-8 space-y-4">
              <h2 className="text-lg font-semibold text-foreground mb-4">Global Admin Settings</h2>
              <FormInput 
                label="Admin Name (Displayed to Drivers)" 
                value={adminSettings.adminName} 
                onChange={(e) => setAdminSettings({...adminSettings, adminName: e.target.value})} 
              />
              <FormInput 
                label="Admin Phone Number" 
                value={adminSettings.adminPhone} 
                onChange={(e) => setAdminSettings({...adminSettings, adminPhone: e.target.value})} 
              />
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Global Duty Instructions</label>
                <textarea
                  value={adminSettings.dutyInstructions}
                  onChange={(e) => setAdminSettings({...adminSettings, dutyInstructions: e.target.value})}
                  className="w-full bg-background border-2 border-muted rounded-2xl p-3 text-foreground focus:border-primary focus:outline-none"
                  rows={4}
                />
              </div>
              <GradientButton onClick={handleSaveSettings} disabled={isSavingSettings} className="w-full mt-4">
                <Save size={18} className="mr-2 inline" /> {isSavingSettings ? "Saving..." : "Save Global Settings"}
              </GradientButton>
            </div>
          )}

          {/* Tab Content: Drivers */}
          {activeTab === "drivers" && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground mb-4">Manage Drivers ({drivers.length})</h2>
              {drivers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No drivers found.</div>
              ) : (
                drivers.map(driver => (
                  <div key={driver._id} className="bg-muted rounded-2xl p-4 flex flex-col gap-3">
                    <div>
                      <p className="font-semibold text-foreground">{driver.fullname}</p>
                      <p className="text-sm text-muted-foreground">{driver.email}</p>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">Assign Route No.</label>
                      <div className="flex gap-2">
                        <input 
                          type="text"
                          defaultValue={driver.routeNo || ""}
                          placeholder="e.g. CUTTACK-1-A"
                          className="flex-1 bg-background border-2 border-muted rounded-xl px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                          onBlur={(e) => {
                            if (e.target.value !== driver.routeNo) {
                              handleUpdateDriverRoute(driver._id, e.target.value);
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab Content: Routes */}
          {activeTab === "routes" && (
            <div className="space-y-4">
              {!showAddRoute && editingRoute === null && (
                <button
                  onClick={() => setShowAddRoute(true)}
                  className="w-full mb-6 py-3 px-4 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center gap-2 hover:opacity-90 transition-opacity font-medium"
                >
                  <Plus size={20} /> Add New Route
                </button>
              )}

              {(showAddRoute || editingRoute) && (
                <div className="bg-muted rounded-2xl p-6 mb-8">
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    {editingRoute ? "Edit Route" : "Add New Route"}
                  </h2>
                  <div className="space-y-4">
                    <FormInput label="Route Number" placeholder="e.g., Route 5" value={routeNumber} onChange={(e) => setRouteNumber(e.target.value)} />
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">Stops (comma-separated)</label>
                      <textarea placeholder="e.g., Stop A, Stop B, Stop C" value={stops} onChange={(e) => setStops(e.target.value)} className="w-full bg-background border-2 border-muted rounded-2xl p-3 text-foreground focus:border-primary focus:outline-none" rows={3} />
                    </div>
                    <FormInput label="Timing" placeholder="e.g., 06:00 AM" value={timing} onChange={(e) => setTiming(e.target.value)} />
                    <FormInput label="ETA (minutes, Optional)" type="number" placeholder="e.g., 15" value={eta} onChange={(e) => setEta(e.target.value)} />
                    <div className="flex gap-2 pt-4">
                      <GradientButton onClick={editingRoute ? handleUpdateRoute : handleAddRoute} className="flex-1">
                        {editingRoute ? "Update" : "Add"} Route
                      </GradientButton>
                      <button onClick={resetRouteForm} className="flex-1 py-3 px-4 border-2 border-foreground/20 rounded-2xl text-foreground font-medium hover:bg-muted transition-colors">Cancel</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Routes List */}
              {routes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No routes added yet.</div>
              ) : (
                routes.map((route) => (
                  <div key={route.id} className="bg-muted rounded-2xl overflow-hidden mb-3">
                    <button onClick={() => setExpandedRoute(expandedRoute === route.id ? null : route.id)} className="w-full p-4 flex items-center justify-between hover:bg-background/50 transition-colors">
                      <div className="text-left flex-1">
                        <p className="font-semibold text-foreground">{route.number}</p>
                        <p className="text-sm text-muted-foreground">{route.timing}</p>
                      </div>
                      {expandedRoute === route.id ? <ChevronUp className="text-muted-foreground" /> : <ChevronDown className="text-muted-foreground" />}
                    </button>
                    {expandedRoute === route.id && (
                      <div className="px-4 pb-4 space-y-3 border-t border-background pt-3">
                        <p className="text-sm text-muted-foreground">Stops: <span className="text-foreground">{route.stops.join(" → ")}</span></p>
                        {route.eta && <p className="text-sm text-muted-foreground">ETA: <span className="text-foreground">{route.eta} min</span></p>}
                        <div className="flex gap-2 pt-2">
                          <button onClick={() => handleEditRoute(route.id)} className="flex-1 py-2 px-3 rounded-xl bg-primary/20 text-primary flex items-center justify-center gap-2 hover:bg-primary/30"><Edit2 size={16} /> Edit</button>
                          <button onClick={() => handleDeleteRoute(route.id)} className="flex-1 py-2 px-3 rounded-xl bg-destructive/20 text-destructive flex items-center justify-center gap-2 hover:bg-destructive/30"><Trash2 size={16} /> Delete</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

        </div>
      </div>
    </MobileLayout>
  );
};

export default AdminPanel;
