import React from "react";
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
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
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function DateNightCard({ 
  children, 
  isMobile = false, 
  currentPlan,
  isAdmin = false,
  onEdit,
  onDelete
}: DateNightCardProps) {
  // Custom style for the card
  const cardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(4px)',
  };

  // Dark green color for text
  const textColor = "text-emerald-800";

  return (
    <div 
      className={`${isMobile ? 'h-[90vh] w-[95vw] mt-15' : 'h-[95vh] w-[60vw] max-w-xl'} rounded-xl 
                 ${isMobile ? 'shadow-lg' : 'shadow-xl'}
                 transition-all duration-300 ease-in-out overflow-hidden
                 ${isMobile ? 'hover:shadow-xl' : 'hover:shadow-2xl'}
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
          
          {/* Delete button - top left (same position but on left) */}
          <button
            onClick={onDelete}
            className="absolute top-2 left-2 bg-red-100/50 hover:bg-red-100/80 p-1.5 rounded-full transition-colors z-20 cursor-pointer"
            aria-label="Delete date plan"
          >
            <TrashIcon className="h-4 w-4 text-red-600" />
          </button>
        </>
      )}
      
      <h1 className={`${isMobile ? 'text-3xl md:text-4xl' : 'text-4xl'} font-bold text-center p-6 border-b border-gray-300/30 ${textColor} flex-shrink-0`}>
        OG's Date Night App
        <div className={`text-xl mt-2 ${textColor}`}>
          {currentPlan.date}
        </div>
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