import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  children: ReactNode;
  className?: string;
}

const AuthCard = ({ children, className = "" }: AuthCardProps) => {
  return (
    <div
      className={cn(
        // Mobile: full screen, no curves, no border, no shadow — pure native app feel
        "w-full min-h-screen bg-background p-6 overflow-hidden relative scrollbar-hide",
        // Desktop: floating card with curves and shadow
        "md:min-h-0 md:max-w-[430px] md:mx-auto md:rounded-[2rem] md:border md:border-border md:bg-background/95 md:shadow-[0_30px_70px_-40px_rgba(15,23,42,0.35)] md:p-8",
        className
      )}
    >
      {children}
    </div>
  );
};

export default AuthCard;

