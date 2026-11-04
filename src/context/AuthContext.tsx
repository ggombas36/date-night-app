import { useState, useEffect, type ReactNode } from "react";
import { authService } from "../services/authService";
import { AuthContext } from "./authStore";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check the stored token now and every minute, so an expired token logs out.
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      setIsAdmin(authenticated ? authService.isAdmin() : false);
    };

    checkAuth();
    const interval = setInterval(checkAuth, 60000);
    return () => clearInterval(interval);
  }, []);

  const login = async (username: string, password: string) => {
    const success = await authService.login(username, password);
    if (success) {
      setIsAuthenticated(true);
      setIsAdmin(authService.isAdmin());
    }
    return success;
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  return <AuthContext.Provider value={{ isAuthenticated, isAdmin, login, logout }}>{children}</AuthContext.Provider>;
};
