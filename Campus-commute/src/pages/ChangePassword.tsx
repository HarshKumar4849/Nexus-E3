import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import MobileLayout from "@/components/MobileLayout";
import FormInput from "@/components/FormInput";
import GradientButton from "@/components/GradientButton";
import BackButton from "@/components/BackButton";
import { useToast } from "@/hooks/use-toast";

const passwordSchema = z.string().min(8, "Password must be at least 8 characters");

const ChangePassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ currentPassword?: string; newPassword?: string; confirmPassword?: string }>({});
  const [attempts, setAttempts] = useState(0);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const validateForm = () => {
    const newErrors: { currentPassword?: string; newPassword?: string; confirmPassword?: string } = {};

    // Simulate wrong current password check
    if (currentPassword !== "password123") {
      newErrors.currentPassword = "Current password is incorrect";
      setAttempts(prev => prev + 1);
      if (attempts >= 0) {
        setShowForgotPassword(true);
      }
    }

    try {
      passwordSchema.parse(newPassword);
    } catch (err) {
      if (err instanceof z.ZodError) {
        newErrors.newPassword = err.errors[0]?.message;
      }
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    toast({
      title: "Password Changed",
      description: "Your password has been successfully updated",
    });
    navigate("/settings");
  };

  return (
    <MobileLayout>
      <div className="flex flex-col min-h-screen px-8 py-6">
        <BackButton to="/settings" />
        
        <div className="flex-1 pt-8">
          <h1 className="text-2xl font-bold text-foreground text-center mb-8">
            Change Password
          </h1>

          <div className="space-y-6">
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Current Password</label>
              <FormInput
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                showPasswordToggle
                error={errors.currentPassword}
              />
              {showForgotPassword && (
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-primary hover:underline mt-2 inline-block"
                >
                  Forgot Password?
                </Link>
              )}
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-2">New Password</label>
              <FormInput
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                showPasswordToggle
                error={errors.newPassword}
              />
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-2">Confirm Password</label>
              <FormInput
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                showPasswordToggle
                error={errors.confirmPassword}
              />
            </div>
          </div>

          <div className="mt-12">
            <GradientButton onClick={handleSubmit}>
              Update Password
            </GradientButton>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default ChangePassword;
