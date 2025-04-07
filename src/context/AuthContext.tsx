import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isAdmin: false,
  login: async () => false,
  logout: () => {}
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check initial auth state
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        setIsAdmin(authService.isAdmin());
      } else {
        setIsAdmin(false);
      }
    };

    // Check immediately
    checkAuth();
    
    // Set up auto-logout check
    const interval = setInterval(checkAuth, 60000);

    // Cleanup on unmount
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

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};