import { Phone, Mail, MapPin, Clock } from "lucide-react";
import MobileLayout from "@/components/MobileLayout";
import BackButton from "@/components/BackButton";

const Support = () => {
  return (
    <MobileLayout>
      <div className="flex flex-col min-h-screen px-8 py-6">
        <BackButton to="/settings" />
        
        <div className="flex-1 pt-8">
          <h1 className="text-2xl font-bold text-foreground text-center mb-8">
            Help & Support
          </h1>

          <div className="space-y-4">
            <div className="bg-muted rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="text-foreground font-medium">+91 98765 43210</p>
                </div>
              </div>
              <button 
                onClick={() => window.location.href = "tel:+919876543210"}
                className="w-full bg-primary text-primary-foreground rounded-full py-2 text-sm font-medium"
              >
                Call Now
              </button>
            </div>

            <div className="bg-muted rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-foreground font-medium">support@campuscommute.com</p>
                </div>
              </div>
              <button 
                onClick={() => window.location.href = "mailto:support@campuscommute.com"}
                className="w-full bg-primary text-primary-foreground rounded-full py-2 text-sm font-medium"
              >
                Send Email
              </button>
            </div>

            <div className="bg-muted rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Office Address</p>
                  <p className="text-foreground font-medium">Transport Department, Main Campus</p>
                </div>
              </div>
            </div>

            <div className="bg-muted rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Working Hours</p>
                  <p className="text-foreground font-medium">Mon - Fri: 9:00 AM - 5:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Support;
