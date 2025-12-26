import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Lock, Bell, MapPin, HelpCircle, Info, Phone, Moon, Sun, Trash2 } from "lucide-react";
import MobileLayout from "@/components/MobileLayout";
import BackButton from "@/components/BackButton";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/contexts/ThemeContext";
import DeleteAccountModal from "@/components/DeleteAccountModal";

const Settings = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [locationSharing, setLocationSharing] = useState(true);
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  return (
    <MobileLayout>
      <div className="flex flex-col min-h-screen px-8 py-6">
        <BackButton to="/home" />
        
        <div className="flex-1 pt-8">
          <h1 className="text-2xl font-bold text-foreground text-center mb-8">
            Settings
          </h1>

          {/* Appearance */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
              Appearance
            </h2>
            <div className="bg-muted rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-background">
                <div className="flex items-center gap-3">
                  {theme === "dark" ? (
                    <Moon className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <Sun className="w-5 h-5 text-muted-foreground" />
                  )}
                  <span className="text-foreground">Dark Mode</span>
                </div>
                <Switch 
                  checked={theme === "dark"}
                  onCheckedChange={toggleTheme}
                />
              </div>
            </div>
          </div>

          {/* Password & Security */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
              Password & Security
            </h2>
            <div className="bg-muted rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-background">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <span className="text-foreground">Location Sharing</span>
                </div>
                <Switch 
                  checked={locationSharing}
                  onCheckedChange={setLocationSharing}
                />
              </div>
              
              <button 
                onClick={() => navigate("/change-password")}
                className="flex items-center justify-between p-4 w-full border-b border-background hover:bg-background/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-muted-foreground" />
                  <span className="text-foreground">Change Password</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>

              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-muted-foreground" />
                  <span className="text-foreground">Notification Preference</span>
                </div>
                <Switch 
                  checked={notificationEnabled}
                  onCheckedChange={setNotificationEnabled}
                />
              </div>
            </div>
          </div>

          {/* Other Settings */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
              Other Settings
            </h2>
            <div className="bg-muted rounded-2xl overflow-hidden">
              <button 
                onClick={() => navigate("/faqs")}
                className="flex items-center justify-between p-4 w-full border-b border-background hover:bg-background/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-muted-foreground" />
                  <span className="text-foreground">FAQs</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>

              <button 
                onClick={() => navigate("/about")}
                className="flex items-center justify-between p-4 w-full hover:bg-background/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Info className="w-5 h-5 text-muted-foreground" />
                  <span className="text-foreground">About the App</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Help & Support */}
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
              Help & Support
            </h2>
            <div className="bg-muted rounded-2xl overflow-hidden">
              <button 
                onClick={() => navigate("/support")}
                className="flex items-center justify-between p-4 w-full hover:bg-background/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <span className="text-foreground">Contact Details</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="mt-8 pt-6 border-t border-border">
            <h2 className="text-sm font-semibold text-destructive mb-3 uppercase tracking-wide">
              Danger Zone
            </h2>
            <div className="bg-destructive/5 rounded-2xl overflow-hidden border border-destructive/20">
              <button 
                onClick={() => setDeleteModalOpen(true)}
                className="flex items-center justify-between p-4 w-full hover:bg-destructive/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Trash2 className="w-5 h-5 text-destructive" />
                  <span className="text-destructive font-medium">Delete Account</span>
                </div>
                <ChevronRight className="w-5 h-5 text-destructive" />
              </button>
            </div>
          </div>
        </div>

        <DeleteAccountModal 
          open={deleteModalOpen} 
          onOpenChange={setDeleteModalOpen}
        />
      </div>
    </MobileLayout>
  );
};

export default Settings;
