import React, { useState } from 'react';

interface DatePlan {
  id: string;
  title: string;
  date: string;
  description: string;
  activities: string[];
}

interface EditModalProps {
  currentPlan: DatePlan;
  onClose: () => void;
  onSave: (editedPlan: DatePlan) => void;
  isMobile?: boolean;
  isNew?: boolean;
}

export default function EditModal({ 
  currentPlan,
  onClose,
  onSave,
  isMobile = false,
  isNew = false
}: EditModalProps) {
  const [editedPlan, setEditedPlan] = useState<DatePlan>({...currentPlan});
  const [activities, setActivities] = useState<string[]>([...currentPlan.activities]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedPlan(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle activity changes
  const handleActivityChange = (index: number, value: string) => {
    const newActivities = [...activities];
    newActivities[index] = value;
    setActivities(newActivities);
    
    setEditedPlan(prev => ({
      ...prev,
      activities: newActivities
    }));
  };

  // Add new activity
  const addActivity = () => {
    setActivities(prev => [...prev, '']);
    setEditedPlan(prev => ({
      ...prev,
      activities: [...prev.activities, '']
    }));
  };

  // Remove activity
  const removeActivity = (index: number) => {
    const newActivities = activities.filter((_, i) => i !== index);
    setActivities(newActivities);
    
    setEditedPlan(prev => ({
      ...prev,
      activities: newActivities
    }));
  };

  // Save changes
  const handleSave = () => {
    // For new plans, generate an ID based on the date
    if (isNew) {
      const newPlan = {
        ...editedPlan,
        id: editedPlan.date.replace(/\./g, '-')
      };
      onSave(newPlan);
    } else {
      onSave(editedPlan);
    }
    onClose();
  };

  // Modal style - with enhanced blur effect
  const modalStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(10px)',
  };

  // Overlay style with stronger blur
  const overlayStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(8px)',
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50"
      style={overlayStyle}
      onClick={() => onClose()}
    >
      {/* Modal content - stop propagation to prevent closing when clicking inside */}
      <div 
        className={`${isMobile ? 'h-[90vh] w-[95vw]' : 'h-[95vh] w-[60vw] max-w-xl'} rounded-xl 
                 shadow-2xl overflow-auto`}
        style={modalStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6 border-b border-gray-300/30 pb-4">
            <h2 className="text-2xl font-bold text-emerald-800">
              {isNew ? "Add New Date Plan" : "Edit Date Plan"}
            </h2>
            <button 
              onClick={onClose}
              className="text-emerald-800 hover:text-emerald-600 text-2xl font-bold cursor-pointer"
              aria-label="Close edit modal"
            >
              ×
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <form className="space-y-4 text-emerald-800">
              <div>
                <label className="block mb-1 font-medium">Date (YYYY.MM.DD)</label>
                <input
                  type="text"
                  name="date"
                  value={editedPlan.date}
                  onChange={handleChange}
                  className="w-full p-2 bg-white/70 rounded border border-emerald-200"
                  placeholder="YYYY.MM.DD"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Title</label>
                <input
                  type="text"
                  name="title"
                  value={editedPlan.title}
                  onChange={handleChange}
                  className="w-full p-2 bg-white/70 rounded border border-emerald-200"
                  placeholder="Enter a title for the date"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Description</label>
                <textarea
                  name="description"
                  value={editedPlan.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full p-2 bg-white/70 rounded border border-emerald-200"
                  placeholder="Enter a description of the date"
                ></textarea>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-medium">Activities</label>
                  <button
                    type="button"
                    onClick={addActivity}
                    className="text-emerald-700 hover:text-emerald-500 font-medium text-sm cursor-pointer"
                  >
                    + Add Activity
                  </button>
                </div>
                
                <div className="space-y-2">
                  {activities.map((activity, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={activity}
                        onChange={(e) => handleActivityChange(index, e.target.value)}
                        className="flex-1 p-2 bg-white/70 rounded border border-emerald-200"
                        placeholder={`Activity ${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeActivity(index)}
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                        disabled={activities.length <= 1}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </form>
          </div>

          <div className="mt-6 border-t border-gray-300/30 pt-4">
            <button
              onClick={handleSave}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors cursor-pointer"
            >
              {isNew ? "Add Date Plan" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}