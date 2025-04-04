import { useState, useEffect } from "react";
import desktopBackground from "../assets/background/week_1_desktop.png";
import mobileBackground from "../assets/background/week_1_phone.png";
import DateNightCard from "../components/DateNightCard";
import DateNightContent from "../components/DateNightContent";
import Login from "../components/Login";
import { authService } from "../services/authService";
import AuthButton from "../components/AuthButton";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check initial auth state
    setIsAuthenticated(authService.isAuthenticated());

    // Set up auto-logout check
    const checkAuth = () => {
      if (!authService.isAuthenticated() && isAuthenticated) {
        setIsAuthenticated(false);
      }
    };

    // Check auth status every minute
    const interval = setInterval(checkAuth, 60000);

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, [isAuthenticated]);
  
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div
        className="w-screen h-screen bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{ backgroundImage: `url(${desktopBackground})` }}
      >
        <Login onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <>
      {/* Mobile view */}
      <div
        className="w-screen h-screen bg-cover bg-center bg-no-repeat md:hidden overflow-hidden"
        style={{ backgroundImage: `url(${mobileBackground})` }}
      >
        <AuthButton 
          isAuthenticated={true} 
          onLogout={handleLogout}
        />
        <div className="flex items-center justify-center h-full">
          <DateNightCard isMobile={true}>
            <DateNightContent />
          </DateNightCard>
        </div>
      </div>

      {/* Desktop view */}
      <div
        className="hidden md:block w-screen h-screen bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{ backgroundImage: `url(${desktopBackground})` }}
      >
        <AuthButton 
          isAuthenticated={true} 
          onLogout={handleLogout}
        />
        <div className="flex items-center justify-center h-full">
          <DateNightCard>
            <DateNightContent />
          </DateNightCard>
        </div>
      </div>
    </>
  );
}