import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { Apple } from "lucide-react";
import MobileLayout from "@/components/MobileLayout";
import AuthCard from "@/components/AuthCard";
import FormInput from "@/components/FormInput";
import GradientButton from "@/components/GradientButton";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useGoogleLogin } from "@react-oauth/google";

const emailSchema = z.string().email("Invalid email address").refine((email) => {
  const domain = email.split("@")[1];
  return domain?.endsWith("gmail.com") || domain?.endsWith(".ac.in") || domain?.endsWith(".edu");
}, "Only gmail.com, .ac.in, or .edu emails allowed");

const passwordSchema = z.string().min(8, "Password must be at least 8 characters");

const Login = () => {
  const navigate = useNavigate();
  const { login, pendingRole } = useAuth();
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  // --- Real Google OAuth Integration ---
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        toast({
          title: "Google Auth Success",
          description: "Fetching your profile details...",
        });

        // 1. Fetch user details securely from Google API using the access token
        const userInfoRes = await fetch(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenResponse.access_token}`,
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}`, Accept: 'application/json' } }
        );
        
        if (!userInfoRes.ok) throw new Error("Failed to fetch Google profile");
        
        const googleUser = await userInfoRes.json();
        const socialEmail = googleUser.email;
        const socialName = googleUser.name || "Google User";
        const role = pendingRole || "student"; 
        
        // Use a secure dummy password for social accounts since they are verified by Google
        const socialPassword = "OAuthGeneratedPassword!123";

        const registeredAccounts = JSON.parse(
          localStorage.getItem("campus-commute-accounts") || "[]"
        );
        
        let account = registeredAccounts.find((acc: any) => acc.email === socialEmail && acc.role === role);
        
        // 2. If the user doesn't exist, we construct a real account securely from Google's verified data
        if (!account) {
          const newAccount = {
            email: socialEmail,
            password: socialPassword,
            role: role,
            fullName: socialName,
            routeNo: role === "driver" ? "CUTTACK-1-A" : undefined,
            profileImage: googleUser.picture, // Save their real Google avatar
          };
          registeredAccounts.push(newAccount);
          localStorage.setItem("campus-commute-accounts", JSON.stringify(registeredAccounts));
        }
        
        // 3. Log into App context
        const success = await login(socialEmail, socialPassword, role);
        
        if (success) {
          toast({
            title: `Welcome, ${socialName}!`,
            description: "Successfully authenticated with Google",
          });
          navigate(role === "driver" ? "/driver-home" : "/home");
        } else {
          throw new Error("Local login sync failed");
        }
      } catch (err) {
        console.error(err);
        toast({
          title: "Setup Incomplete",
          description: "Google Authentication failed. Did you add the VITE_GOOGLE_CLIENT_ID?",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      toast({
        title: "Login Failed",
        description: "You cancelled the Google login popup or it failed.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  });

  const handleSocialLogin = (provider: string) => {
    if (provider === "Google") {
      handleGoogleLogin();
    } else {
      toast({
        title: `${provider} Login`,
        description: "Apple login requires enterprise developer account. Only Google is implemented.",
      });
    }
  };

  return (
    <MobileLayout>
      <AuthCard>
        <div className="flex flex-col min-h-[calc(100vh-5rem)]">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground text-center mt-8 mb-2">
              Log In
            </h1>
            <p className="text-muted-foreground text-center mb-10">
              Please provide the details below to log in
            </p>

            <div className="space-y-4 mb-6">
              <FormInput
                placeholder="Enter your Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
              />
              <FormInput
                placeholder="Enter Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                showPasswordToggle
                error={errors.password}
              />
            </div>

            <div className="flex items-center justify-between mb-8">
              <label className="flex items-center gap-2 cursor-pointer">
                <div 
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    rememberMe ? "bg-primary border-primary" : "border-muted-foreground"
                  }`}
                >
                  {rememberMe && (
                    <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                  )}
                </div>
                <span className="text-sm text-foreground">Remember Me</span>
              </label>
              <Link 
                to="/forgot-password" 
                className="text-sm text-foreground hover:underline"
              >
                Forgot Password ?
              </Link>
            </div>

            <GradientButton onClick={handleLogin} disabled={isLoading}>
              {isLoading ? "Logging in..." : "Log In"}
            </GradientButton>

            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-border" />
              <span className="text-muted-foreground text-sm">Or continue With</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <div className="flex gap-4 mb-8">
              <button
                onClick={() => handleSocialLogin("Google")}
                className="flex-1 py-3 px-4 border-2 border-foreground/20 rounded-full text-foreground font-medium hover:bg-muted transition-colors flex items-center justify-center gap-2"
              >
              {/* Google G Logo SVG */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button
              onClick={() => handleSocialLogin("Apple")}
              className="flex-1 py-3 px-4 border-2 border-foreground/20 rounded-full text-foreground font-medium hover:bg-muted transition-colors flex items-center justify-center gap-2"
            >
              <Apple size={20} />
              Apple
            </button>
          </div>
        </div>

        <p className="text-center text-muted-foreground">
          Don't have an account?{" "}
          <Link 
            to={pendingRole === "driver" ? "/driver-signup" : "/student-signup"} 
            className="text-foreground font-medium hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
      </AuthCard>
    </MobileLayout>
  );
};

export default Login;
