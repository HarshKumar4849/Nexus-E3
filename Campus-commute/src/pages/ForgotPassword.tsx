import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import MobileLayout from "@/components/MobileLayout";
import FormInput from "@/components/FormInput";
import GradientButton from "@/components/GradientButton";
import BackButton from "@/components/BackButton";
import { useToast } from "@/hooks/use-toast";

const emailSchema = z.string().email("Invalid email address");

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [resendCount, setResendCount] = useState(3);

  const handleSendOTP = () => {
    try {
      emailSchema.parse(email);
      setError("");
      setStep("otp");
      toast({
        title: "OTP Sent",
        description: "A verification code has been sent to your email",
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0]?.message || "Invalid email");
      }
    }
  };

  const handleVerifyOTP = () => {
    const fullOtp = otp.join("");
    if (fullOtp.length !== 4) {
      toast({
        title: "Invalid OTP",
        description: "Please enter all 4 digits",
        variant: "destructive",
      });
      return;
    }
    navigate("/reset-password");
  };

  const handleResend = () => {
    if (resendCount <= 0) return;
    setResendCount(resendCount - 1);
    setOtp(["", "", "", ""]);
    toast({
      title: "OTP Resent",
      description: "A new verification code has been sent",
    });
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
  };

  return (
    <MobileLayout>
      <div className="flex flex-col min-h-screen px-8 py-6">
        <BackButton />
        
        <div className="flex-1 pt-8">
          <h1 className="text-2xl font-bold text-foreground text-center mb-4">
            {step === "email" ? "Reset Password" : "Verification Code"}
          </h1>

          {step === "email" ? (
            <>
              <p className="text-muted-foreground text-center mb-8">
                Enter your email to receive a verification code
              </p>
              <FormInput
                placeholder="Enter your Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error}
              />
              <div className="mt-8">
                <GradientButton onClick={handleSendOTP}>
                  Send OTP
                </GradientButton>
              </div>
            </>
          ) : (
            <>
              <p className="text-muted-foreground text-center mb-8">
                Enter the 4-digit code sent to {email}
              </p>
              <div className="flex justify-center gap-4 mb-8">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    className="w-16 h-16 text-center text-2xl font-semibold bg-background border-2 border-muted rounded-2xl focus:border-primary focus:outline-none"
                  />
                ))}
              </div>
              <GradientButton onClick={handleVerifyOTP}>
                Verify
              </GradientButton>
              <p className="text-center text-muted-foreground mt-6">
                Didn't receive code?{" "}
                <button 
                  onClick={handleResend}
                  className="text-foreground font-medium"
                  disabled={resendCount <= 0}
                >
                  Resend({resendCount} left)
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

export default ForgotPassword;
