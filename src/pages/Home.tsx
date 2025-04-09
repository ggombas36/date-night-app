import { useState, useEffect } from "react";
import desktopBackground from "../assets/background/week_1_desktop.png";
import mobileBackground from "../assets/background/week_1_phone.png";
import DateNightCard from "../components/DateNightCard";
import DateNightContent from "../components/DateNightContent";
import EditModal from "../components/EditModal";
import Login from "../components/Login";
import AuthButton from "../components/AuthButton";
import datePlans from "../data/datePlans.json";
import { useAuth } from "../context/AuthContext";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useApi } from "../hooks/useAPI";

interface DatePlan {
  id: string;
  title: string;
  date: string;
  description: string;
  activities: string[];
  is_deleted?: boolean;
}

export default function Home() {
  const api = useApi();

  const { isAuthenticated, isAdmin, logout } = useAuth();
  const [currentPlanIndex, setCurrentPlanIndex] = useState(0);

  // Initialize plans with is_deleted property if not present
  const [plans, setPlans] = useState<DatePlan[]>([]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  const activePlans = isAdmin ? plans : plans.filter((plan) => !plan.is_deleted);

  useEffect(() => {
    const loadPlans = async () => {
      if (isAuthenticated) {
        try {
          const fetchedPlans = isAdmin 
          ? await api.getAllPlans()
          : await api.getActivePlans();
          if (fetchedPlans && fetchedPlans.length > 0) {
            setPlans(fetchedPlans);
          }
        } catch (error) {
          console.error("Error loading plans:", error);
        }
      }
    };

    loadPlans();
  }, [isAuthenticated, isAdmin]);

  // Check if we're in mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  useEffect(() => {
    if (currentPlanIndex >= activePlans.length && activePlans.length > 0) {
      setCurrentPlanIndex(0);
    }
  }, [activePlans.length, currentPlanIndex]);

  const handlePrevious = () => {
    setCurrentPlanIndex((prev) => Math.min(prev + 1, activePlans.length - 1));
  };

  const handleNext = () => {
    setCurrentPlanIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleEditOpen = () => {
    setIsAddingNew(false);
    setShowEditModal(true);
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setShowEditModal(true);
  };

  const handleEditClose = () => {
    setShowEditModal(false);
  };

  const handleDeletePlan = async () => {
    if (activePlans.length <= 1) {
      alert("Cannot delete the last date plan.");
      return;
    }

    const planToDelete = activePlans[currentPlanIndex];
    const success = await api.deletePlan(planToDelete.id);

    if (success) {
      const updatedPlans = isAdmin ? await api.getAllPlans() : await api.getActivePlans();
      setPlans(updatedPlans);

      if (currentPlanIndex >= activePlans.length - 1) {
        setCurrentPlanIndex(0);
      }
    }
  };

  const handleSavePlan = async (editedPlan: DatePlan) => {
    if (isAddingNew) {
      const newPlan = await api.createPlan(editedPlan);
      if (newPlan) {
        const updatedPlans = isAdmin ? await api.getAllPlans() : await api.getActivePlans();
        setPlans(updatedPlans);
        setCurrentPlanIndex(0);
      }
    } else {
      const updated = await api.updatePlan(
        activePlans[currentPlanIndex].id,
        editedPlan
      );
      if (updated) {
        const updatedPlans = isAdmin ? await api.getAllPlans() : await api.getActivePlans();
        setPlans(updatedPlans);
      }
    }

    setShowEditModal(false);
  };

  const handleRestorePlan = async (id: string) => {
    try {
      const success = await api.updatePlan(id, { is_deleted: false });
      if (success) {
        // Fetch updated plans
        const updatedPlans = await api.getAllPlans();
        setPlans(updatedPlans);
        
        // Reset current index if needed
        if (currentPlanIndex >= updatedPlans.length) {
          setCurrentPlanIndex(0);
        }
      }
    } catch (error) {
      console.error("Error restoring plan:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div
        className="w-screen h-screen bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{ backgroundImage: `url(${desktopBackground})` }}
      >
        <div className="absolute top-0 left-0 right-0 text-center">
          <span className="text-xs text-emerald-800 font-medium bg-white/40 px-2 py-0.1 rounded-b">
            © 2025.04.07. Date night app V1.2
          </span>
        </div>
        <Login />
      </div>
    );
  }

  // Make sure we have active plans to display
  if (activePlans.length === 0) {
    // All plans are deleted, create a default one
    const defaultPlan: DatePlan = {
      id: new Date().toISOString(),
      title: "No Plans Available",
      date: new Date().toISOString().split("T")[0].replace(/-/g, "."),
      description:
        "All date plans have been deleted. Add a new one to get started.",
      activities: ["Add a new date plan"],
      is_deleted: false,
    };

    setPlans([defaultPlan, ...plans]);
    setCurrentPlanIndex(0);

    return <div>Loading...</div>; // temporary while state updates
  }

  // Get the current plan to display
  const currentPlan = activePlans[currentPlanIndex];

  // Create empty plan template for new dates
  const emptyPlan: DatePlan = {
    id: new Date().toISOString(),
    title: "",
    date: new Date().toISOString().split("T")[0].replace(/-/g, "."),
    description: "",
    activities: [""],
    is_deleted: false,
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 mt-[-8px] text-center z-10">
        <span className="text-[10px] text-emerald-800 font-small bg-white/40 px-2 py-0 rounded-b">
          © 2025.04.07. Date night app V1.2
        </span>
      </div>

      {/* Add Date button (only visible if admin) */}
      {isAdmin && (
        <button
          onClick={handleAddNew}
          className="absolute top-4 left-4 z-10 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded transition-colors duration-300 cursor-pointer flex items-center gap-1"
        >
          <PlusIcon className="h-4 w-4" />
          Add Date
        </button>
      )}

      {/* Edit/Add Modal */}
      {showEditModal && (
        <EditModal
          currentPlan={isAddingNew ? emptyPlan : currentPlan}
          onClose={handleEditClose}
          onSave={handleSavePlan}
          isMobile={isMobileView}
          isNew={isAddingNew}
        />
      )}

      {/* Mobile view */}
      <div
        className="w-screen h-screen bg-cover bg-center bg-no-repeat md:hidden overflow-hidden"
        style={{ backgroundImage: `url(${mobileBackground})` }}
      >
        <AuthButton isAuthenticated={true} onLogout={logout} />
        <div className="flex items-center justify-center h-full">
          <DateNightCard
            isMobile={true}
            currentPlan={currentPlan}
            isAdmin={isAdmin}
            onEdit={handleEditOpen}
            onDelete={handleDeletePlan}
            onRestore={handleRestorePlan}
            isDeleted={currentPlan.is_deleted}
          >
            <DateNightContent
              currentPlan={currentPlan}
              onPrevious={handlePrevious}
              onNext={handleNext}
              hasPrevious={currentPlanIndex < activePlans.length - 1}
              hasNext={currentPlanIndex > 0}
              isDeleted={currentPlan.is_deleted}
            />
          </DateNightCard>
        </div>
      </div>

      {/* Desktop view */}
      <div
        className="hidden md:block w-screen h-screen bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{ backgroundImage: `url(${desktopBackground})` }}
      >
        <AuthButton isAuthenticated={true} onLogout={logout} />
        <div className="flex items-center justify-center h-full">
          <DateNightCard
            currentPlan={currentPlan}
            isAdmin={isAdmin}
            onEdit={handleEditOpen}
            onDelete={handleDeletePlan}
            onRestore={handleRestorePlan}
            isDeleted={currentPlan.is_deleted}
          >
            <DateNightContent
              currentPlan={currentPlan}
              onPrevious={handlePrevious}
              onNext={handleNext}
              hasPrevious={currentPlanIndex < activePlans.length - 1}
              hasNext={currentPlanIndex > 0}
              isDeleted={currentPlan.is_deleted}
            />
          </DateNightCard>
        </div>
      </div>
    </>
  );
}
