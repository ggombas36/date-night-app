import React from "react";
import "../styles/scrollbar.css";

interface DateNightCardProps {
  children: React.ReactNode;
  isMobile?: boolean;
}

export default function DateNightCard({ children, isMobile = false }: DateNightCardProps) {
  // Get current week's Friday
  const getCurrentFriday = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = day <= 5 ? 5 - day : 7 + 5 - day;
    
    const fridayDate = new Date(today);
    fridayDate.setDate(today.getDate() + diff);
    
    const year = fridayDate.getFullYear();
    const month = String(fridayDate.getMonth() + 1).padStart(2, '0');
    const date = String(fridayDate.getDate()).padStart(2, '0');
    
    return `${year}.${month}.${date}`;
  };

  // Store current Friday
  const currentFriday = getCurrentFriday();

  // Custom style for the card
  const cardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(4px)',
  };

  // Dark green color for text
  const textColor = "text-emerald-800";

  // Remove the inline scrollbar style and use CSS class instead

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
          {currentFriday}
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