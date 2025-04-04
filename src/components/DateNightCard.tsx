import React from "react";
import "../styles/scrollbar.css";

interface DatePlan {
  id: string;
  title: string;
  date: string;
  description: string;
  activities: string[];
}

interface DateNightCardProps {
  children: React.ReactNode;
  isMobile?: boolean;
  currentPlan: DatePlan;
}

export default function DateNightCard({ children, isMobile = false, currentPlan }: DateNightCardProps) {
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
                 flex flex-col`}
      style={cardStyle}
    >
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