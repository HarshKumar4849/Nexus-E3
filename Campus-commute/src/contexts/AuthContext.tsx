import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "student" | "driver" | "admin" | null;

interface UserData {
  email: string;
  fullName: string;
  role: UserRole;
  yearBatch?: string;
  routeNo?: string;
  timing?: string;
  selectedRoute?: number;
  password?: string;
  phoneNumber?: string;
  branch?: string;
  course?: string;
  semester?: string;
  profileImage?: string;
  busNumber?: string;
  licenseId?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null;
  pendingRole: UserRole;
  pendingEmail: string;
  pendingUserData: Partial<UserData>;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  setPendingRole: (role: UserRole) => void;
  setPendingEmail: (email: string) => void;
  setPendingUserData: (data: Partial<UserData>) => void;
  completeSignup: (data: Partial<UserData>) => Promise<boolean>;
  updateUser: (data: Partial<UserData>) => void;
  setSelectedRoute: (route: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [pendingRole, setPendingRole] = useState<UserRole>(null);
  const [pendingEmail, setPendingEmail] = useState("");
  const [pendingUserData, setPendingUserData] = useState<Partial<UserData>>({});

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:8000"}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        return false;
      }
      
      const data = await response.json();
      
      setIsAuthenticated(true);
      setUser({
        email: data.user.email,
        fullName: data.user.fullname || data.user.fullName || "",
        role: role,
        password: password,
      });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setPendingRole(null);
    setPendingEmail("");
    setPendingUserData({});
  };

  const completeSignup = async (data: Partial<UserData>) => {
    try {
      const payload = {
        fullname: pendingUserData.fullName || pendingUserData.email || "",
        email: pendingEmail,
        password: pendingUserData.password,
        regdNo: pendingUserData.yearBatch || "N/A"
      };

      const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:8000"}/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const responseData = await resp.json();

      if (resp.ok) {
        setIsAuthenticated(true);
        setUser({
          email: pendingEmail,
          fullName: pendingUserData.fullName || "",
          role: pendingRole,
          yearBatch: pendingUserData.yearBatch,
          routeNo: pendingUserData.routeNo,
          timing: pendingUserData.timing,
          ...data,
        });
        setPendingEmail("");
        setPendingUserData({});
        return { success: true };
      }
      return { success: false, error: responseData.error || responseData.message || "Registration failed" };
    } catch(err) {
      console.error(err);
      return { success: false, error: "Network error" };
    }
  };

  const updateUser = (data: Partial<UserData>) => {
    if (user) {
      const updated = { ...user, ...data };
      setUser(updated);

      // Persist updates to registered accounts in localStorage if present
      try {
        const registeredAccounts = JSON.parse(
          localStorage.getItem("campus-commute-accounts") || "[]"
        );
        const idx = registeredAccounts.findIndex((acc: any) => acc.email === user.email && acc.role === user.role);
        if (idx !== -1) {
          registeredAccounts[idx] = { ...registeredAccounts[idx], ...data };
          localStorage.setItem("campus-commute-accounts", JSON.stringify(registeredAccounts));
        }
      } catch (err) {
        // ignore
      }
    }
  };

  const setSelectedRoute = (route: number) => {
    if (user) {
      setUser({ ...user, selectedRoute: route });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        pendingRole,
        pendingEmail,
        pendingUserData,
        login,
        logout,
        setPendingRole,
        setPendingEmail,
        setPendingUserData,
        completeSignup,
        updateUser,
        setSelectedRoute,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
