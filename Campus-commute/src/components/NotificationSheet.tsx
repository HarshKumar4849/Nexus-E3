import { X, Bus, Clock, MapPin, Flag, Bell } from "lucide-react";
import type { LiveNotification } from "@/contexts/RouteContext";

interface NotificationSheetProps {
  open: boolean;
  onClose: () => void;
  notifications: LiveNotification[];
  onClear: () => void;
}

function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function getNotificationIcon(type: LiveNotification["type"]) {
  switch (type) {
    case "trip-started": return Bus;
    case "trip-ended": return Flag;
    case "bus-near-stop": return MapPin;
    default: return Bell;
  }
}

function getNotificationColor(type: LiveNotification["type"]) {
  switch (type) {
    case "trip-started": return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    case "trip-ended": return "bg-red-500/10 text-red-500";
    case "bus-near-stop": return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
    default: return "bg-primary/10 text-primary";
  }
}

const NotificationSheet = ({ open, onClose, notifications, onClear }: NotificationSheetProps) => {
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-foreground/20 z-30"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className="fixed right-0 top-0 bottom-0 w-80 bg-background z-40 shadow-xl animate-in slide-in-from-right duration-300">
        <div className="p-6 pt-16 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6 flex-shrink-0">
            <h2 className="text-xl font-bold text-foreground">Notifications</h2>
            <div className="flex items-center gap-2">
              {notifications.length > 0 && (
                <button 
                  onClick={onClear}
                  className="text-xs text-muted-foreground hover:text-foreground underline"
                >
                  Clear all
                </button>
              )}
              <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 scrollbar-hide">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-center">
                <Bell className="w-12 h-12 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground font-medium">No notifications yet</p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  Live alerts will appear here when your bus starts its trip
                </p>
              </div>
            ) : (
              notifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type);
                const colorClass = getNotificationColor(notification.type);
                return (
                  <div 
                    key={notification.id}
                    className="p-4 bg-muted rounded-2xl"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground text-sm">{notification.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatTimeAgo(notification.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationSheet;
