import { CalendarDaysIcon, PhotoIcon } from "@heroicons/react/24/outline";

export type Tab = "next" | "memories";

const TABS: { id: Tab; label: string; Icon: typeof PhotoIcon }[] = [
  { id: "next", label: "Next date", Icon: CalendarDaysIcon },
  { id: "memories", label: "Memories", Icon: PhotoIcon },
];

interface TabBarProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

/** Fixed to the bottom on phones, sticky under the header from 768 px. */
export default function TabBar({ active, onChange }: TabBarProps) {
  return (
    <nav
      aria-label="Sections"
      className="fixed inset-x-0 bottom-0 z-20 border-t border-rule bg-surface/92 pb-[env(safe-area-inset-bottom)] md:sticky md:top-14 md:bottom-auto md:border-t-0 md:border-b"
    >
      <ul className="mx-auto flex max-w-5xl">
        {TABS.map(({ id, label, Icon }) => (
          <li key={id} className="flex-1">
            <button
              type="button"
              onClick={() => onChange(id)}
              aria-current={active === id ? "page" : undefined}
              className={`flex h-12 w-full items-center justify-center gap-2 border-b-2 font-semibold md:border-b-2 ${
                active === id ? "border-accent text-accent" : "border-transparent text-muted hover:text-ink"
              }`}
              style={{ fontSize: 15 }}
            >
              <Icon className="size-5" aria-hidden="true" />
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
