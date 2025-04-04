import { useState, useEffect } from "react";
import desktopBackground from "../assets/background/week_1_desktop.png";
import mobileBackground from "../assets/background/week_1_phone.png";
import DateNightCard from "../components/DateNightCard";
import DateNightContent from "../components/DateNightContent";
import Login from "../components/Login";
import { authService } from "../services/authService";
import AuthButton from "../components/AuthButton";
import datePlans from "../data/datePlans.json";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPlanIndex, setCurrentPlanIndex] = useState(0);

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

  const handlePrevious = () => {
    setCurrentPlanIndex(prev => Math.min(prev + 1, datePlans.length - 1));
  };

  const handleNext = () => {
    setCurrentPlanIndex(prev => Math.max(prev - 1, 0));
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

  // Get the current plan to display
  const currentPlan = datePlans[currentPlanIndex];

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
          <DateNightCard isMobile={true} currentPlan={currentPlan}>
            <DateNightContent 
              currentPlan={currentPlan}
              onPrevious={handlePrevious}
              onNext={handleNext}
              hasPrevious={currentPlanIndex < datePlans.length - 1}
              hasNext={currentPlanIndex > 0}
            />
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
          <DateNightCard currentPlan={currentPlan}>
            <DateNightContent 
              currentPlan={currentPlan}
              onPrevious={handlePrevious}
              onNext={handleNext}
              hasPrevious={currentPlanIndex < datePlans.length - 1}
              hasNext={currentPlanIndex > 0}
            />
          </DateNightCard>
        </div>
      </div>
    </>
  );
}