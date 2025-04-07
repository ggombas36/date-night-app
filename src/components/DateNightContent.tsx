import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface DatePlan {
  id: string;
  title: string;
  description: string;
  activities: string[];
  is_deleted?: boolean;
}

interface DateNightContentProps {
  currentPlan: DatePlan;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}
  
export default function DateNightContent({
  currentPlan,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext
}: DateNightContentProps) {
  return (
    <div className="flex flex-col items-center w-full h-full">
      {/* Title section with navigation buttons */}
      <div className="w-full relative flex justify-center items-center mb-4 px-2">
        {/* Left navigation button */}
        {hasPrevious && (
          <button 
            onClick={onPrevious}
            className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-white/30 p-1.5 rounded-full hover:bg-white/50 transition-colors duration-200"
            aria-label="Previous date plan"
          >
            <ChevronLeftIcon className="h-5 w-5 text-emerald-800 font-bold" />
          </button>
        )}
        
        {/* Title */}
        <h2 className="text-2xl font-semibold text-emerald-800 text-center px-10">
          {currentPlan.title}
        </h2>
        
        {/* Right navigation button */}
        {hasNext && (
          <button 
            onClick={onNext}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-white/30 p-1.5 rounded-full hover:bg-white/50 transition-colors duration-200"
            aria-label="Next date plan"
          >
            <ChevronRightIcon className="h-5 w-5 text-emerald-800 font-bold" />
          </button>
        )}
      </div>

      {/* Content section */}
      <div className="w-full max-w-md space-y-4 px-6">
        <p className="text-lg text-emerald-800 text-center">
          {currentPlan.description}
        </p>
      </div>
      
      {/* Activity list */}
      <div className="w-full mt-4 px-6">
        {currentPlan.activities.length > 0 && (
          <div className="w-full max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-emerald-800 mb-3 text-center">
              The plan:
            </h3>
            <ul className="space-y-2 pb-4">
              {currentPlan.activities.map((activity, index) => (
                <li key={index} className="text-emerald-800 flex items-start">
                  <span className="mr-2 flex-shrink-0 text-emerald-600">•</span>
                  <span className="text-left">{activity}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}