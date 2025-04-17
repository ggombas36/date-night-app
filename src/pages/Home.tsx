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
import { dateApiService } from "../services/dateApiServices";
import Photos from "../components/Photo"; // Make sure the path matches your file name
import { photos } from "../data/photos";
import { PlusIcon, PhotoIcon, CalendarDaysIcon } from "@heroicons/react/24/solid";

interface DatePlan {
  id: string;
  title: string;
  date: string;
  description: string;
  activities: string[];
  is_deleted?: boolean;
}

interface DateOption {
  id: string;
  title: string;
  info: string;
  selected: boolean;
  image: string;
  link: string;
  location: string;
  edited: boolean;
}

export default function Home() {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const [currentPlanIndex, setCurrentPlanIndex] = useState(0);
  const [showPhotos, setShowPhotos] = useState(false);
  const [options, setOptions] = useState<DateOption[]>([]);

  const togglePhotos = () => {
    setShowPhotos(!showPhotos);
  };

  // Initialize plans with is_deleted property if not present
  const [plans, setPlans] = useState<DatePlan[]>(
    datePlans.map((plan) => ({
      ...plan,
      is_deleted: plan.is_deleted || false,
    }))
  );

  const version = "© 2025.04.17. Date night app V2.3.0";

  const [showEditModal, setShowEditModal] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  // Filter out deleted plans for display
  const activePlans = plans.filter((plan) => !plan.is_deleted);

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
    const fetchPlans = async () => {
      try {
        const fetchedPlans = await dateApiService.getAllPlans();
        if (Array.isArray(fetchedPlans)) {
          setPlans(
            fetchedPlans.map((plan) => ({
              ...plan,
              is_deleted: plan.is_deleted || false,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching plans:", error);
        // Fallback to local JSON if API fails
        setPlans(
          datePlans.map((plan) => ({
            ...plan,
            is_deleted: plan.is_deleted || false,
          }))
        );
      }
    };

    fetchPlans();
  }, []);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const fetchedOptions = await dateApiService.getAllOptions();
        if (Array.isArray(fetchedOptions)) {
          setOptions(fetchedOptions);
        }
      } catch (error) {
        console.error("Error fetching options:", error);
        // // Fallback to local JSON if API fails
        // setOptions(dateOptions);
      }
    };

    fetchOptions();
  }, []);

  // Reset current index if plans change (e.g., after delete)
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
    const updatedPlans = plans.map((plan) =>
      plan.id === planToDelete.id ? { ...plan, is_deleted: true } : plan
    );

    const success = await dateApiService.updatePlans(updatedPlans);
    if (success) {
      setPlans(updatedPlans);
      if (currentPlanIndex >= activePlans.length - 1) {
        setCurrentPlanIndex(0);
      }
    }
  };

  const handleSavePlan = async (editedPlan: DatePlan) => {
    let updatedPlans: DatePlan[];

    if (isAddingNew) {
      const newPlan = {
        ...editedPlan,
        is_deleted: false,
      };
      updatedPlans = [newPlan, ...plans];
    } else {
      updatedPlans = plans.map((plan) =>
        plan.id === activePlans[currentPlanIndex].id
          ? { ...editedPlan, is_deleted: false }
          : plan
      );
    }

    const success = await dateApiService.updatePlans(updatedPlans);
    if (success) {
      setPlans(updatedPlans);
      if (isAddingNew) {
        setCurrentPlanIndex(0);
      }
    }
    setShowEditModal(false);
  };

  if (!isAuthenticated) {
    return (
      <div
        className="w-screen h-screen bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{ backgroundImage: `url(${desktopBackground})` }}
      >
        <div className="absolute top-0 left-0 right-0 text-center">
          <span className="text-xs text-emerald-800 font-medium bg-white/40 px-2 py-0.1 rounded-b">
            {version}
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
          {version}
        </span>
      </div>

      {/* Top left buttons */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        {isAdmin && (
          <button
            onClick={handleAddNew}
            className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded transition-colors duration-300 cursor-pointer flex items-center gap-1"
          >
            <PlusIcon className="h-4 w-4" />
            Add Date
          </button>
        )}
        <button
          onClick={togglePhotos}
          className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded transition-colors duration-300 cursor-pointer flex items-center gap-1"
        >
          {showPhotos ? (
            <>
              <CalendarDaysIcon className="h-4 w-4" />
              Date Plans
            </>
          ) : (
            <>
              <PhotoIcon className="h-4 w-4" />
              Photos
            </>
          )}
        </button>
      </div>

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
          {showPhotos ? (
            <Photos photos={photos} />
          ) : (
            <DateNightCard
              isMobile={true}
              currentPlan={currentPlan}
              isAdmin={isAdmin}
              onEdit={handleEditOpen}
              onDelete={handleDeletePlan}
              options={options}
              setOptions={setOptions}
            >
              <DateNightContent
                currentPlan={currentPlan}
                onPrevious={handlePrevious}
                onNext={handleNext}
                hasPrevious={currentPlanIndex < activePlans.length - 1}
                hasNext={currentPlanIndex > 0}
              />
            </DateNightCard>
          )}
        </div>
      </div>

      {/* Desktop view */}
      <div
        className="hidden md:block w-screen h-screen bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{ backgroundImage: `url(${desktopBackground})` }}
      >
        <AuthButton isAuthenticated={true} onLogout={logout} />
        <div className="flex items-center justify-center h-full">
          {showPhotos ? (
            <Photos photos={photos} />
          ) : (
            <DateNightCard
              currentPlan={currentPlan}
              isAdmin={isAdmin}
              onEdit={handleEditOpen}
              onDelete={handleDeletePlan}
              options={options}
              setOptions={setOptions}
            >
              <DateNightContent
                currentPlan={currentPlan}
                onPrevious={handlePrevious}
                onNext={handleNext}
                hasPrevious={currentPlanIndex < activePlans.length - 1}
                hasNext={currentPlanIndex > 0}
              />
            </DateNightCard>
          )}
        </div>
      </div>
    </>
  );
}
