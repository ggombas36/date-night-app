import React from "react";
import "../styles/scrollbar.css";

export interface Photo {
  id: string;
  path: string;
  title: string;
  date: string;
}

interface PhotosProps {
  photos: Photo[];
}

const Photos: React.FC<PhotosProps> = ({ photos }) => {
  const cardStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(4px)",
  };

  return (
    <div className="fixed inset-0 mt-[70px] mb-[20px] mx-auto max-w-[90%] flex flex-col">
      <div
        className="flex-1 rounded-xl shadow-lg overflow-hidden"
        style={cardStyle}
      >
        <h2 className="text-3xl z-5 font-bold px-4 py-2 text-center text-emerald-800 sticky top-0 border-b border-emerald-100/20">
          Photo Memories
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 h-[calc(100%-4rem)] overflow-y-auto custom-scrollbar">
          {photos.map((photo) => (
            <div key={photo.id} className="flex flex-col items-center">
              <div className="relative w-[200px] h-[250px] overflow-hidden rounded-md shadow-md hover:shadow-lg transition-shadow">
                <img
                  src={photo.path}
                  alt={photo.title}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/200x250?text=No+Image";
                  }}
                />
              </div>
              <div className="w-full text-center mt-2">
                <p className="text-sm font-medium text-emerald-900">
                  {photo.title}
                </p>
                <p className="text-xs text-emerald-700">{photo.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Photos;
