import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Shield, CheckCircle, XCircle } from "lucide-react";
import MobileLayout from "@/components/MobileLayout";
import AuthCard from "@/components/AuthCard";
import FormInput from "@/components/FormInput";
import GradientButton from "@/components/GradientButton";
import BackButton from "@/components/BackButton";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const passwordSchema = z.string().min(8, "Password must be at least 8 characters");

// ─── Password strength helper ────────────────────────────────────────────────
type Strength = "empty" | "weak" | "medium" | "strong";

const getStrength = (pw: string): Strength => {
  if (!pw) return "empty";
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return "weak";
  if (score <= 3) return "medium";
  return "strong";
};

const strengthConfig: Record<Strength, { label: string; color: string; bars: number }> = {
  empty:  { label: "",        color: "bg-muted",        bars: 0 },
  weak:   { label: "Weak",   color: "bg-red-500",      bars: 1 },
  medium: { label: "Medium", color: "bg-amber-500",    bars: 2 },
  strong: { label: "Strong", color: "bg-emerald-500",  bars: 3 },
};

const rules = [
  { label: "At least 8 characters",   test: (pw: string) => pw.length >= 8 },
  { label: "One uppercase letter",    test: (pw: string) => /[A-Z]/.test(pw) },
  { label: "One number",              test: (pw: string) => /[0-9]/.test(pw) },
  { label: "One special character",   test: (pw: string) => /[^A-Za-z0-9]/.test(pw) },
];

const PasswordStrengthBar = ({ password }: { password: string }) => {
  const strength = getStrength(password);
  const cfg = strengthConfig[strength];
  if (!password) return null;

  return (
    <div className="mt-3 space-y-2">
      {/* Bar */}
      <div className="flex gap-1.5">
        {[1, 2, 3].map(i => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i <= cfg.bars ? cfg.color : "bg-muted"}`} />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className={`text-xs font-semibold ${strength === "strong" ? "text-emerald-500" : strength === "medium" ? "text-amber-500" : "text-red-500"}`}>
          {cfg.label}
        </span>
        {strength === "strong" && <span className="text-[10px] text-emerald-500">✓ Great password!</span>}
      </div>
      {/* Rules checklist */}
      <div className="grid grid-cols-2 gap-1 pt-1">
        {rules.map(r => {
          const ok = r.test(password);
          return (
            <div key={r.label} className="flex items-center gap-1.5">
              {ok
                ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                : <XCircle className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />}
              <span className={`text-[10px] ${ok ? "text-foreground" : "text-muted-foreground"}`}>{r.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
// ─────────────────────────────────────────────────────────────────────────────

const SetPassword = () => {
  const navigate = useNavigate();
  const { pendingUserData, pendingEmail, pendingRole, setPendingUserData } = useAuth();
  const { toast } = useToast();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ newPassword?: string; confirmPassword?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: { newPassword?: string; confirmPassword?: string } = {};
    try {
      passwordSchema.parse(newPassword);
    } catch (err) {
      if (err instanceof z.ZodError) newErrors.newPassword = err.errors[0]?.message;
    }
    if (newPassword !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;
    setPendingUserData({ ...pendingUserData, password: newPassword });

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/user/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: pendingEmail }),
      });
      if (!response.ok) throw new Error("Failed to send OTP");

      const data = await response.json();
      toast({ title: "Code Sent", description: "We've sent a verification code to your email." });
      navigate("/otp-verification", data.emailFailed && data.otp ? { state: { fallbackOtp: data.otp } } : undefined);
    } catch (err: any) {
      toast({ title: "Error", description: "Failed to send verification code. Check your backend connection.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MobileLayout>
      <AuthCard>
        <div className="flex flex-col min-h-[calc(100vh-5rem)]">
          <div className="flex items-center justify-between mb-6">
            <BackButton />
          </div>
          <div className="flex-1 pt-2">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground text-center mb-2">Set Password</h1>
            <p className="text-muted-foreground text-center mb-8">Create a strong password for your account</p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">New Password</label>
                <FormInput
                  type="password"
                  placeholder="••••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  showPasswordToggle
                  showLockIcon
                  error={errors.newPassword}
                />
                <PasswordStrengthBar password={newPassword} />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">Confirm Password</label>
                <FormInput
                  type="password"
                  placeholder="••••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  showPasswordToggle
                  showLockIcon
                  error={errors.confirmPassword}
                />
                {confirmPassword && newPassword === confirmPassword && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-xs text-emerald-500">Passwords match</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-10">
              <GradientButton onClick={handleSignUp} disabled={isLoading}>
                {isLoading ? "Sending code..." : "Create Account"}
              </GradientButton>
            </div>
          </div>
        </div>
      </AuthCard>
    </MobileLayout>
  );
};

export default SetPassword;
