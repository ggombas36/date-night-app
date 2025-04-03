import React from "react";

interface DateNightCardProps {
  children: React.ReactNode;
  isMobile?: boolean;
}

export default function DateNightCard({ children, isMobile = false }: DateNightCardProps) {
  // Get current week's Friday
  const getCurrentFriday = () => {
    const today = new Date();
    const day = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 5 = Friday, 6 = Saturday
    const diff = day <= 5 ? 5 - day : 7 + 5 - day; // Calculate days until Friday (or next Friday if today is Saturday)
    
    const fridayDate = new Date(today);
    fridayDate.setDate(today.getDate() + diff);
    
    // Format as YYYY.MM.DD
    const year = fridayDate.getFullYear();
    const month = String(fridayDate.getMonth() + 1).padStart(2, '0'); // +1 because months are 0-indexed
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

  return (
    <div 
      className={`${isMobile ? 'h-[95vh] w-[95vw]' : 'h-[95vh] w-[60vw]'} rounded-xl 
                 ${isMobile ? 'shadow-lg' : 'shadow-xl'}
                 transition-all duration-300 ease-in-out overflow-hidden
                 ${isMobile ? 'hover:shadow-xl' : 'hover:shadow-2xl'}
                 flex flex-col`}
      style={cardStyle}
    >
      <h1 className={`${isMobile ? 'text-3xl md:text-4xl' : 'text-4xl'} font-bold text-center p-6 border-b border-gray-300/30 ${textColor}`}>
        OG's Date Night App
        <div className={`text-xl mt-2 ${textColor}`}>
          {currentFriday}
        </div>
      </h1>
      <div className="flex-1 flex items-start justify-center p-2">
        <div className={`text-xl text-center ${textColor}`}>
          {children}
        </div>
      </div>
    </div>
  );
}