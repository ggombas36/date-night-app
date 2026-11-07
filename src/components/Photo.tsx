import { useMemo, useState } from "react";
import { BarsArrowDownIcon, BarsArrowUpIcon } from "@heroicons/react/24/outline";
import type { Photo } from "../types/Photo";

function parseDateScore(dateStr: string): number {
  if (!dateStr) return 0;
  const clean = dateStr.replace(/\.$/, "");
  const parts = clean.split(".").map(Number);
  const year = parts[0] || 0;
  const month = parts[1] || 1;
  const day = parts[2] || 1;
  return year * 10000 + month * 100 + day;
}

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
  const [order, setOrder] = useState<"asc" | "desc">(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("photos_order");
      if (stored === "asc" || stored === "desc") return stored;
    }
    return "asc";
  });

  const handleOrderChange = (next: "asc" | "desc") => {
    setOrder(next);
    try {
      localStorage.setItem("photos_order", next);
    } catch {
      // ignore
    }
  };

  const sortedPhotos = useMemo(() => {
    return [...photos].sort((a, b) => {
      const scoreA = parseDateScore(a.date);
      const scoreB = parseDateScore(b.date);
      if (scoreA !== scoreB) {
        return order === "asc" ? scoreA - scoreB : scoreB - scoreA;
      }
      return 0;
    });
  }, [photos, order]);

  return (
    <section aria-labelledby="memories-title" className="rounded-[20px] bg-surface p-5 shadow-sheet md:p-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 id="memories-title" className="text-[28px] font-semibold leading-tight md:text-[34px]">
          Memories
        </h2>
        {photos.length > 1 && (
          <div
            role="group"
            aria-label="Sort memories by date"
            className="inline-flex items-center rounded-xl border border-rule bg-page/70 p-1 text-xs font-semibold sm:text-sm"
          >
            <button
              type="button"
              onClick={() => handleOrderChange("asc")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-all ${
                order === "asc"
                  ? "bg-surface text-ink shadow-sm"
                  : "text-muted hover:text-ink"
              }`}
              aria-pressed={order === "asc"}
              title="Oldest first"
            >
              <BarsArrowUpIcon className="size-4 text-accent" aria-hidden="true" />
              <span>Date ↑</span>
            </button>
            <button
              type="button"
              onClick={() => handleOrderChange("desc")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-all ${
                order === "desc"
                  ? "bg-surface text-ink shadow-sm"
                  : "text-muted hover:text-ink"
              }`}
              aria-pressed={order === "desc"}
              title="Newest first"
            >
              <BarsArrowDownIcon className="size-4 text-accent" aria-hidden="true" />
              <span>Date ↓</span>
            </button>
          </div>
        )}
      </div>
      {sortedPhotos.length === 0 ? (
        <p className="text-muted">No photos yet.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-3 lg:grid-cols-4">
          {sortedPhotos.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} />
          ))}
        </ul>
      )}
    </section>
  );
}
