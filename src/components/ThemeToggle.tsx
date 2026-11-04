import { ComputerDesktopIcon, MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useTheme, type ThemePreference } from "../hooks/useTheme";

const LABEL: Record<ThemePreference, string> = { system: "System", light: "Day", dark: "Night" };
const NEXT: Record<ThemePreference, ThemePreference> = { system: "light", light: "dark", dark: "system" };

export default function ThemeToggle() {
  const { preference, cycle } = useTheme();
  const Icon = preference === "light" ? SunIcon : preference === "dark" ? MoonIcon : ComputerDesktopIcon;

  return (
    <button
      type="button"
      onClick={cycle}
      className="btn-text"
      aria-label={`Theme: ${LABEL[preference]}. Switch to ${LABEL[NEXT[preference]]}.`}
    >
      <Icon className="size-5" aria-hidden="true" />
      <span className="hidden sm:inline">{LABEL[preference]}</span>
    </button>
  );
}
