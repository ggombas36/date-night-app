import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { SealMark } from "./SealMark";
import ThemeToggle from "./ThemeToggle";
import Wordmark from "./Wordmark";

export default function Header({ onLogout }: { onLogout: () => void }) {
  return (
    <header className="sticky top-0 z-30 border-b border-rule bg-surface/92">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-2 px-4">
        <div className="flex min-w-0 items-center gap-2 text-seal">
          <SealMark small className="size-8 shrink-0" />
          <Wordmark className="truncate text-ink" />
        </div>
        <div className="flex items-center">
          <ThemeToggle />
          <button type="button" onClick={onLogout} className="btn-text">
            <ArrowRightStartOnRectangleIcon className="size-5 sm:hidden" aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">Log out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
