import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "outline";
  fullWidth?: boolean;
}

const GradientButton = ({
  children,
  variant = "primary",
  fullWidth = true,
  className,
  disabled,
  ...props
}: GradientButtonProps) => {
  const baseClasses = "py-4 px-8 rounded-xl md:rounded-full font-medium text-lg transition-all duration-300 shadow-lg";

  const variantClasses = {
    primary: disabled
      ? "bg-muted-foreground/50 text-primary-foreground cursor-not-allowed"
      : "text-primary-foreground [background:var(--gradient-primary)] hover:opacity-90 active:scale-[0.98]",
    outline: "border-2 border-foreground bg-transparent text-foreground hover:bg-foreground/5",
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        fullWidth && "w-full",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default GradientButton;
