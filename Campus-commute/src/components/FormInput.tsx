import { InputHTMLAttributes, useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  showPasswordToggle?: boolean;
  showLockIcon?: boolean;
}

const FormInput = ({
  label,
  error,
  showPasswordToggle,
  showLockIcon,
  type = "text",
  className,
  ...props
}: FormInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = showPasswordToggle ? (showPassword ? "text" : "password") : type;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm text-muted-foreground mb-2">{label}</label>
      )}
      <div className="relative">
        {showLockIcon && (
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        )}
        <input
          type={inputType}
          className={cn(
            "w-full px-5 py-4 bg-muted rounded-xl md:rounded-full text-foreground placeholder:text-muted-foreground border border-transparent focus:border-primary/30 focus:outline-none transition-colors",
            showLockIcon && "pl-12",
            showPasswordToggle && "pr-12",
            error && "border-destructive",
            className
          )}
          {...props}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </button>
        )}
      </div>
      {error && <p className="text-sm text-destructive mt-1 ml-4">{error}</p>}
    </div>
  );
};

export default FormInput;
