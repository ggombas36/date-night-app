import { useState } from "react";
import type { Photo } from "../types/Photo";

function PhotoCard({ photo }: { photo: Photo }) {
  const [failed, setFailed] = useState(false);

  return (
    <li className="min-w-0">
      <div className="aspect-[2/3] overflow-hidden rounded-xl bg-page">
        {failed ? (
          <div className="flex h-full items-center justify-center p-2 text-center text-muted">Photo not available</div>
        ) : (
          <img
            src={photo.path}
            alt={photo.title}
            width={480}
            height={720}
            loading="lazy"
            className="h-full w-full object-cover"
            onError={() => setFailed(true)}
          />
        )}
      </div>
      <p className="mt-2 font-semibold leading-snug [overflow-wrap:anywhere]">{photo.title}</p>
      <p className="italic text-muted">{photo.date}</p>
    </li>
  );
}

export default function Photos({ photos }: { photos: Photo[] }) {
  return (
    <section aria-labelledby="memories-title" className="rounded-[20px] bg-surface p-5 shadow-sheet md:p-8">
      <h2 id="memories-title" className="mb-5 text-[28px] font-semibold leading-tight md:text-[34px]">
        Memories
      </h2>
      {photos.length === 0 ? (
        <p className="text-muted">No photos yet.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-3 lg:grid-cols-4">
          {photos.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} />
          ))}
        </ul>
      )}
    </section>
  );
}
