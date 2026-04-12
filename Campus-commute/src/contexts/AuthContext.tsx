import { createContext, useContext, useState, ReactNode } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export type UserRole = "student" | "driver" | "admin" | null;

interface UserData {
  email: string;
  fullName: string;
  role: UserRole;
  yearBatch?: string;
  routeNo?: string;
  timing?: string;
  selectedRoute?: number;
  phoneNumber?: string;
  branch?: string;
  course?: string;
  semester?: string;
  profileImage?: string;
  busNumber?: string;
  licenseId?: string;
  registrationNo?: string;
  busStop?: string;
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
  completeSignup: (data: Partial<UserData>) => void;
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

  // ====== LOGIN — calls real backend API ======
  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      const response = await fetch(`${BACKEND_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // required for cross-origin cookie (Vercel + Render)
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) return false;

      const data = await response.json();

      setIsAuthenticated(true);
      setUser({
        email: data.user.email,
        fullName: data.user.fullname || data.user.fullName || "",
        role: role, // role is determined by the login page selection on the frontend
        selectedRoute: 1,
      });

      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  // ====== LOGOUT — calls real backend API ======
  const logout = async () => {
    try {
      await fetch(`${BACKEND_URL}/user/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear state regardless of API response
      setIsAuthenticated(false);
      setUser(null);
      setPendingRole(null);
      setPendingEmail("");
      setPendingUserData({});
    }
  };

  // ====== COMPLETE SIGNUP — called after registration API flow ======
  const completeSignup = (data: Partial<UserData>) => {
    setIsAuthenticated(true);
    setUser({
      email: data.email || pendingEmail,
      fullName: data.fullName || pendingUserData.fullName || "",
      role: data.role || pendingRole,
      yearBatch: data.yearBatch || pendingUserData.yearBatch,
      routeNo: data.routeNo || pendingUserData.routeNo,
      timing: data.timing || pendingUserData.timing,
      selectedRoute: data.selectedRoute || 1,
      ...data,
    });
    setPendingEmail("");
    setPendingUserData({});
  };

  // ====== UPDATE USER — local state update only ======
  const updateUser = (data: Partial<UserData>) => {
    if (user) {
      setUser({ ...user, ...data });
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
