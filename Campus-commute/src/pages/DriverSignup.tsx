import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { Eye, EyeOff, KeyRound, Clock } from "lucide-react";
import MobileLayout from "@/components/MobileLayout";
import AuthCard from "@/components/AuthCard";
import FormInput from "@/components/FormInput";
import GradientButton from "@/components/GradientButton";
import { useAuth } from "@/contexts/AuthContext";
import { useRouteContext } from "@/contexts/RouteContext";
import { useToast } from "@/hooks/use-toast";

const nameSchema = z.string()
  .min(2, "Name must be at least 2 characters")
  .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters");

const emailSchema = z.string().email("Invalid email address");

// Popular preset timings for quick selection
const PRESET_TIMINGS = [
  "05:00 AM","05:30 AM","06:00 AM","06:30 AM",
  "07:00 AM","07:30 AM","08:00 AM","08:30 AM",
  "09:00 AM","09:30 AM","10:00 AM","10:30 AM",
  "11:00 AM","11:30 AM","12:00 PM","12:30 PM",
  "01:00 PM","01:30 PM","02:00 PM","02:30 PM",
  "03:00 PM","03:30 PM","04:00 PM","04:30 PM",
];

// ─── Custom Time Picker ───────────────────────────────────────────────────────
const TimePicker = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
  const [showPresets, setShowPresets] = useState(false);

  // Parse current value
  const parts = value.match(/^(\d{2}):(\d{2}) (AM|PM)$/);
  const [hour, setHour] = useState(parts?.[1] ?? "06");
  const [minute, setMinute] = useState(parts?.[2] ?? "00");
  const [period, setPeriod] = useState<"AM"|"PM">((parts?.[3] as "AM"|"PM") ?? "AM");

  const update = (h: string, m: string, p: string) => {
    onChange(`${h}:${m} ${p}`);
  };

  const hours   = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
  const minutes = ["00","05","10","15","20","25","30","35","40","45","50","55"];

  return (
    <div>
      <label className="block text-sm text-muted-foreground mb-2 flex items-center gap-2">
        <Clock className="w-4 h-4" /> Departure Timing
      </label>

      {/* ── Inline HR / MIN / AM-PM selectors ── */}
      <div className="flex gap-2 items-center mb-3">
        <div className="flex-1">
          <label className="text-xs text-muted-foreground block mb-1 text-center">Hour</label>
          <select value={hour} onChange={e => { setHour(e.target.value); update(e.target.value, minute, period); }}
            className="w-full px-3 py-3 bg-muted rounded-2xl text-foreground text-center font-semibold focus:border-primary focus:outline-none appearance-none cursor-pointer">
            {hours.map(h => <option key={h} value={h}>{h}</option>)}
          </select>
        </div>
        <span className="text-2xl font-bold text-foreground mt-4">:</span>
        <div className="flex-1">
          <label className="text-xs text-muted-foreground block mb-1 text-center">Min</label>
          <select value={minute} onChange={e => { setMinute(e.target.value); update(hour, e.target.value, period); }}
            className="w-full px-3 py-3 bg-muted rounded-2xl text-foreground text-center font-semibold focus:border-primary focus:outline-none appearance-none cursor-pointer">
            {minutes.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label className="text-xs text-muted-foreground block mb-1 text-center">Period</label>
          <div className="flex rounded-2xl overflow-hidden border-2 border-muted">
            {(["AM","PM"] as const).map(p => (
              <button key={p} type="button"
                onClick={() => { setPeriod(p); update(hour, minute, p); }}
                className={`flex-1 py-3 text-sm font-bold transition-colors ${period === p ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-background"}`}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Selected time display ── */}
      <div className="bg-primary/10 border border-primary/30 rounded-xl px-4 py-2 mb-3 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Selected Time</span>
        <span className="text-lg font-bold text-primary font-mono">{hour}:{minute} {period}</span>
      </div>

      {/* ── Presets toggle ── */}
      <button type="button" onClick={() => setShowPresets(!showPresets)}
        className="w-full text-xs text-primary hover:underline text-left px-1 mb-2">
        {showPresets ? "▲ Hide presets" : "▼ Show common departure times"}
      </button>

      {showPresets && (
        <div className="grid grid-cols-4 gap-1.5 max-h-40 overflow-y-auto pr-1">
          {PRESET_TIMINGS.map(t => (
            <button key={t} type="button"
              onClick={() => {
                const [time, p] = t.split(" ");
                const [h, m] = time.split(":");
                setHour(h); setMinute(m); setPeriod(p as "AM"|"PM");
                onChange(t); setShowPresets(false);
              }}
              className={`py-1.5 px-1 rounded-xl text-xs font-medium transition-colors text-center ${value === t ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-primary/20"}`}>
              {t}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
// ─────────────────────────────────────────────────────────────────────────────

const DriverSignup = () => {
  const navigate = useNavigate();
  const { setPendingEmail, setPendingUserData, pendingRole } = useAuth();
  const { routes } = useRouteContext();
  const { toast } = useToast();

  const [fullName, setFullName] = useState("");
  const [routeNo, setRouteNo] = useState("");
  const [timing, setTiming] = useState("06:00 AM");
  const [email, setEmail] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<{
    fullName?: string; routeNo?: string; timing?: string; email?: string; secretKey?: string;
  }>({});


  const validateForm = () => {
    const newErrors: typeof errors = {};
    try { nameSchema.parse(fullName); } catch (err: any) {
      if (err instanceof z.ZodError) newErrors.fullName = err.errors[0]?.message;
    }
    if (!routeNo) newErrors.routeNo = "Please select a route";
    if (!timing) newErrors.timing = "Please select a timing";
    try { emailSchema.parse(email); } catch (err: any) {
      if (err instanceof z.ZodError) newErrors.email = err.errors[0]?.message;
    }
    if (!secretKey.trim()) newErrors.secretKey = "Driver secret key is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateAccount = async () => {
    if (!validateForm()) return;
    if (!termsAccepted) {
      toast({ title: "Terms & Conditions", description: "Please accept the terms and conditions", variant: "destructive" });
      return;
    }

    // Verify the driver secret key with the backend
    setIsVerifying(true);
    try {
      const res = await fetch("http://localhost:8000/api/admin/verify-driver-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: secretKey.trim() }),
      });
      const data = await res.json();
      if (!data.valid) {
        setErrors(prev => ({ ...prev, secretKey: "Invalid driver secret key. Contact your admin." }));
        toast({ title: "Invalid Key", description: "The driver secret key is incorrect.", variant: "destructive" });
        return;
      }
    } catch (err) {
      toast({ title: "Network Error", description: "Could not verify driver key. Check backend.", variant: "destructive" });
      return;
    } finally {
      setIsVerifying(false);
    }

    // All good — proceed to password setup
    setPendingEmail(email);
    setPendingUserData({ fullName, routeNo, timing, role: pendingRole });
    navigate("/set-password");
  };

  return (
    <MobileLayout>
      <AuthCard>
        <div className="flex flex-col min-h-[calc(100vh-5rem)]">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground text-center mt-8 mb-2">Driver Sign Up</h1>
            <p className="text-muted-foreground text-center mb-10">
              Please provide the details below<br />to create your driver account
            </p>

            <form onSubmit={(e) => { e.preventDefault(); handleCreateAccount(); }}>
              <div className="space-y-4 mb-6">
              <FormInput
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value.replace(/[^a-zA-Z\s]/g, ""))}
                error={errors.fullName}
              />

              <div>
                <select
                  value={routeNo}
                  onChange={(e) => setRouteNo(e.target.value)}
                  className="w-full px-5 py-4 bg-muted rounded-full text-foreground border border-transparent focus:border-primary/30 focus:outline-none transition-colors appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select Bus Route</option>
                  {routes.map((route) => (
                    <option key={route.busNumber} value={route.busNumber}>{route.busName}</option>
                  ))}
                </select>
                {errors.routeNo && <p className="text-sm text-destructive mt-1 ml-4">{errors.routeNo}</p>}
              </div>

              <TimePicker value={timing} onChange={setTiming} />
              {errors.timing && <p className="text-sm text-destructive mt-1 ml-4">{errors.timing}</p>}

              <FormInput
                placeholder="Enter your Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
              />

              {/* Driver Secret Key */}
              <div>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type={showKey ? "text" : "password"}
                    placeholder="Driver Secret Key (from admin)"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-muted rounded-full text-foreground border border-transparent focus:border-primary/30 focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.secretKey && <p className="text-sm text-destructive mt-1 ml-4">{errors.secretKey}</p>}
                <p className="text-xs text-muted-foreground mt-1 ml-4">Ask your fleet admin for the driver secret key</p>
              </div>
            </div>

            <label className="flex items-start gap-3 mb-8 cursor-pointer">
              <div
                onClick={() => setTermsAccepted(!termsAccepted)}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                  termsAccepted ? "bg-primary border-primary" : "border-muted-foreground"
                }`}
              >
                {termsAccepted && <div className="w-2 h-2 bg-primary-foreground rounded-full" />}
              </div>
              <span className="text-sm text-foreground leading-relaxed">
                I agree with the{" "}
                <span className="underline">Terms and Conditions</span>
                {" "}and{" "}
                <span className="underline">Privacy Policy</span>
                {" "}of the app
              </span>
            </label>

            <GradientButton type="submit" disabled={isVerifying}>
              {isVerifying ? "Verifying Key..." : "Create Account"}
            </GradientButton>
            </form>
          </div>

          <p className="text-center text-muted-foreground mt-8">
            Already have an account?{" "}
            <Link to="/login" className="text-foreground font-medium hover:underline">Log In</Link>
          </p>
        </div>
      </AuthCard>
    </MobileLayout>
  );
};

export default DriverSignup;
