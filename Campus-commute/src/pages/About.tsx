import { Bus } from "lucide-react";
import MobileLayout from "@/components/MobileLayout";
import BackButton from "@/components/BackButton";

const About = () => {
  return (
    <MobileLayout>
      <div className="flex flex-col min-h-screen px-8 py-6">
        <BackButton to="/settings" />
        
        <div className="flex-1 pt-8">
          <h1 className="text-2xl font-bold text-foreground text-center mb-8">
            About the App
          </h1>

          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Bus className="w-10 h-10 text-primary" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-2">Campus Commute</h2>
            <p className="text-muted-foreground">Version 1.0.0</p>
          </div>

          <div className="space-y-6">
            <div className="bg-muted rounded-2xl p-4">
              <h3 className="font-medium text-foreground mb-2">About</h3>
              <p className="text-sm text-muted-foreground">
                Campus Commute is a smart real-time bus tracking application designed for students and drivers. 
                Track your campus bus in real-time, get arrival notifications, and never miss your ride again.
              </p>
            </div>

            <div className="bg-muted rounded-2xl p-4">
              <h3 className="font-medium text-foreground mb-2">Features</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Real-time bus tracking</li>
                <li>• Push notifications for arrivals</li>
                <li>• Route information and timings</li>
                <li>• Driver contact details</li>
                <li>• Multiple route support</li>
              </ul>
            </div>

            <div className="bg-muted rounded-2xl p-4">
              <h3 className="font-medium text-foreground mb-2">Developed by</h3>
              <p className="text-sm text-muted-foreground">
                Campus Transport Department
              </p>
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default About;
