import React, { useState } from "react";
import "../styles/scrollbar.css";
import { dateApiService } from "../services/dateApiServices";

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

interface DateOptionsProps {
  options: DateOption[];
  setOptions: (options: DateOption[]) => void;
}

const DateOptions: React.FC<DateOptionsProps> = ({ options, setOptions }) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const areOptionsEdited = options.every((opt) => opt.edited);

  const handleCardClick = (id: string) => {
    setExpandedIds((prev) => {
      const newIds = new Set(prev);
      if (newIds.has(id)) {
        newIds.delete(id);
      } else {
        newIds.add(id);
      }
      return newIds;
    });
  };

  const handleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!areOptionsEdited) {
      const updatedOptions = options.map((option) => ({
        ...option,
        selected: option.id === id,
      }));
      setOptions(updatedOptions);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      const updatedOptions = options.map((option) => ({
        ...option,
        edited: true,
      }));

      const success = await dateApiService.updateOptions(updatedOptions);
      if (!success) {
        throw new Error("Failed to update options");
      }
      // Optional: Show success message
      setOptions(updatedOptions);
    } catch (err) {
      setError("Failed to save selection");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto custom-scrollbar px-2">
        <div className="space-y-3 py-2">
          {options.map((option) => (
            <div
              key={option.id}
              onClick={() => handleCardClick(option.id)}
              className={`w-full md:w-[95%] mx-auto backdrop-blur-md bg-white/40 rounded-xl shadow-lg 
                       transition-all duration-300 ease-in-out cursor-pointer 
                       ${
                         expandedIds.has(option.id) ? "h-[250px]" : "h-[60px]"
                       }`}
            >
              <div className="h-full flex flex-col">
                {/* Updated header with better vertical alignment */}
                <div className="flex items-center justify-start h-[60px] px-4">
                  <div
                    onClick={(e) => handleSelect(option.id, e)}
                    className="relative flex items-center justify-center"
                  >
                    <input
                      type="checkbox"
                      checked={option.selected}
                      onChange={(e) => handleSelect(option.id, e as any)}
                      className="appearance-none w-6 h-6 rounded-lg border-2 border-emerald-600 
                             checked:bg-emerald-600 checked:border-transparent
                             cursor-pointer transition-colors duration-200
                             focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0
                             bg-white/50 hover:bg-emerald-100"
                    />
                    {option.selected && (
                      <svg
                        className="absolute inset-0 w-6 h-6 text-white pointer-events-none"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-emerald-800 ml-4">
                    {option.title}
                  </h3>
                </div>

                {/* Expanded content */}
                <div
                  className={`px-4 text-emerald-700 overflow-y-auto custom-scrollbar
             transition-all duration-300 ${
               expandedIds.has(option.id)
                 ? "opacity-100 flex-1"
                 : "opacity-0 h-0"
             }`}
                >
                  <div className="relative">
                    {/* Image - Moved to right */}
                    <div className="float-right ml-4 mb-2">
                      <img
                        src={option.image}
                        alt={option.title}
                        className="w-[150px] h-[100px] object-cover rounded-lg shadow-md"
                      />
                    </div>

                    {/* Info text - Will wrap around the image */}
                    <p className="text-sm">{option.info}</p>

                    {/* Clear float and add bottom content */}
                    <div className="clear-both pt-4 space-y-2">
                      {/* Location */}
                      <p className="text-sm flex items-center gap-1">
                        <span className="text-emerald-700">📍</span>
                        <span>{option.location}</span>
                      </p>

                      {/* Instagram link */}
                      <a
                        href={option.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1 w-fit"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                        Visit Instagram
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save button */}
      <div className="flex justify-center p-2 border-t border-gray-300/30">
        <button
          onClick={handleSave}
          disabled={
            isLoading ||
            !options.some((opt) => opt.selected) ||
            areOptionsEdited
          }
          className={`w-48 ${
            isLoading ||
            !options.some((opt) => opt.selected) ||
            areOptionsEdited
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-emerald-600 hover:bg-emerald-700"
          } text-white py-2 rounded-md transition-colors`}
        >
          {isLoading
            ? "Saving..."
            : areOptionsEdited
            ? "Selection Saved"
            : "Save Selection"}
        </button>
      </div>
      {error && (
        <p className="text-red-500 text-sm text-center mt-2">{error}</p>
      )}
    </div>
  );
};

export default DateOptions;
