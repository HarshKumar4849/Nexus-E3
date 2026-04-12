import { ReactNode } from "react";

interface MobileLayoutProps {
  children: ReactNode;
  className?: string;
}

const MobileLayout = ({ children, className = "" }: MobileLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50">
      <div className={`w-full max-w-[430px] md:max-w-none md:w-full min-h-screen bg-background relative overflow-hidden ${className}`}>
        {children}
      </div>
    </div>
  );
};

export default MobileLayout;
