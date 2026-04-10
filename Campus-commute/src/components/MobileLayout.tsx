import { ReactNode } from "react";

interface MobileLayoutProps {
  children: ReactNode;
  className?: string;
}

const MobileLayout = ({ children, className = "" }: MobileLayoutProps) => {
  return (
    <div className="min-h-screen bg-background md:flex md:items-center md:justify-center md:bg-muted/50">
      <div className={`w-full min-h-screen md:max-w-none md:w-full bg-background relative overflow-hidden ${className}`}>
        {children}
      </div>
    </div>
  );
};

export default MobileLayout;

