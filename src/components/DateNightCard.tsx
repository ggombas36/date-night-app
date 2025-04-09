import React from "react";
import {
  PencilIcon,
  TrashIcon,
  ArrowUturnUpIcon,
} from "@heroicons/react/24/solid";
import "../styles/scrollbar.css";

interface DatePlan {
  id: string;
  title: string;
  date: string;
  description: string;
  activities: string[];
  is_deleted?: boolean;
}

interface DateNightCardProps {
  children: React.ReactNode;
  isMobile?: boolean;
  currentPlan: DatePlan;
  isAdmin?: boolean;
  isDeleted?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onRestore?: (id: string) => void;
}

export default function DateNightCard({
  children,
  isMobile = false,
  currentPlan,
  isAdmin = false,
  isDeleted = false,
  onEdit,
  onDelete,
  onRestore,
}: DateNightCardProps) {
  // Custom style for the card
  const cardStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(4px)",
  };

  // Dark green color for text
  const textColor = "text-emerald-800";

  return (
    <div
      className={`${
        isMobile ? "h-[90vh] w-[95vw] mt-15" : "h-[95vh] w-[60vw] max-w-xl"
      } rounded-xl 
      ${isMobile ? "shadow-lg" : "shadow-xl"}
      transition-all duration-300 ease-in-out overflow-hidden
      ${isMobile ? "hover:shadow-xl" : "hover:shadow-2xl"}
      ${isDeleted ? "opacity-75" : ""}
      flex flex-col relative`}
      style={cardStyle}
    >
      {isAdmin && (
        <>
          {/* Edit button - top right */}
          <button
            onClick={onEdit}
            className="absolute top-2 right-2 bg-emerald-100/50 hover:bg-emerald-100/80 p-1.5 rounded-full transition-colors z-20 cursor-pointer"
            aria-label="Edit date plan"
          >
            <PencilIcon className="h-4 w-4 text-emerald-800" />
          </button>

          {/* Delete/Restore button - top left */}
          {isDeleted ? (
            <button
              onClick={() => onRestore?.(currentPlan.id)}
              className="absolute top-2 left-2 bg-blue-100/50 hover:bg-blue-100/80 p-1.5 rounded-full transition-colors z-20 cursor-pointer"
              aria-label="Restore date plan"
            >
              <ArrowUturnUpIcon className="h-4 w-4 text-blue-600" />
            </button>
          ) : (
            <button
              onClick={onDelete}
              className="absolute top-2 left-2 bg-red-100/50 hover:bg-red-100/80 p-1.5 rounded-full transition-colors z-20 cursor-pointer"
              aria-label="Delete date plan"
            >
              <TrashIcon className="h-4 w-4 text-red-600" />
            </button>
          )}
        </>
      )}

      {/* Deleted status indicator */}
      {isDeleted && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-[-30deg] border-4 border-red-500/30 rounded-xl px-8 py-2 text-red-500/60 text-2xl font-bold">
          DELETED
        </div>
      )}

      <h1
        className={`${
          isMobile ? "text-3xl md:text-4xl" : "text-4xl"
        } font-bold text-center p-6 border-b border-gray-300/30 ${textColor} flex-shrink-0`}
      >
        OG's Date Night App
        <div className={`text-xl mt-2 ${textColor}`}>{currentPlan.date}</div>
      </h1>
      <div className="flex-1 overflow-hidden flex items-start justify-center">
        <div
          className={`w-full h-full overflow-y-auto p-2 ${textColor} custom-scrollbar`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
