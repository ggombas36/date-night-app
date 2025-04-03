import { useState, useEffect } from "react";
import desktopBackground from "../assets/background/week_1_desktop.png";
import mobileBackground from "../assets/background/week_1_phone.png";
import DateNightCard from "../components/DateNightCard";
import DateNightContent from "../components/DateNightContent";
import Login from "../components/Login";
import { authService } from "../services/authService";

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

  if (!isAuthenticated) {
    return (
      <div
        className="w-screen h-screen bg-cover bg-center bg-no-repeat"
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
        className="w-screen h-screen bg-cover bg-center bg-no-repeat md:hidden"
        style={{ backgroundImage: `url(${mobileBackground})` }}
      >
        <div className="flex items-center justify-center h-full">
          <DateNightCard isMobile={true}>
            <DateNightContent />
          </DateNightCard>
        </div>
      </div>

      {/* Desktop view */}
      <div
        className="hidden md:block w-screen h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${desktopBackground})` }}
      >
        <div className="flex items-center justify-center h-full">
          <DateNightCard>
            <DateNightContent />
          </DateNightCard>
        </div>
      </div>
    </>
  );
}
