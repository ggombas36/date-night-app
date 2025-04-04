interface DateNightContentProps {
  title?: string;
  description?: string;
  activities?: string[];
}
  
export default function DateNightContent({
  title = "Welcome to our week's Friday date night plan",
  description = "Tomorrow's date night plan: A dreamy stroll under the cherry blossoms on Gellért Hill, indulging in juicy burgers and banana pudding, and wrapping up the evening with a cozy dinner at Biang. Perfect vibes incoming! 🍒🍔🍌✨",
  activities = ["Meet at Vörösmarty square", "Walk and have burger & banana pouding at Buddy's", "Reach the top of the Gellért Hill", "Dinner at Biang"],
}: DateNightContentProps) {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Fixed header section - no scrolling */}
      <div className="w-full max-w-md space-y-4 px-2">
        <h2 className="text-2xl font-semibold text-emerald-800 text-center">
          {title}
        </h2>
        
        <p className="text-lg text-emerald-800 text-center">
          {description}
        </p>
      </div>
      
      {/* Content area */}
      <div className="w-full mt-4 px-2">
        {activities.length > 0 && (
          <div className="w-full max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-emerald-800 mb-3 text-center">
              The plan:
            </h3>
            <ul className="space-y-2 pb-4">
              {activities.map((activity, index) => (
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