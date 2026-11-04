import { useCallback, useEffect, useState } from "react";

export type ThemePreference = "system" | "light" | "dark";

const ORDER: ThemePreference[] = ["system", "light", "dark"];

function readPreference(): ThemePreference {
  try {
    const stored = localStorage.getItem("theme");
    return stored === "light" || stored === "dark" ? stored : "system";
  } catch {
    return "system";
  }
}

function resolve(preference: ThemePreference): "light" | "dark" {
  if (preference !== "system") return preference;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function apply(preference: ThemePreference, animate: boolean) {
  const theme = resolve(preference);
  const update = () => {
    document.documentElement.dataset.theme = theme;
  };
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (animate && !reduced && "startViewTransition" in document) {
    (document as Document & { startViewTransition: (cb: () => void) => unknown }).startViewTransition(update);
  } else {
    update();
  }
}

export function useTheme() {
  const [preference, setPreference] = useState<ThemePreference>(readPreference);

  // Follow the system setting while the preference is "system".
  useEffect(() => {
    if (preference !== "system") return;
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => apply("system", false);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [preference]);

  const cycle = useCallback(() => {
    const next = ORDER[(ORDER.indexOf(preference) + 1) % ORDER.length];
    setPreference(next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* storage blocked: the choice lasts until reload */
    }
    apply(next, true);
  }, [preference]);

  return { preference, cycle };
}
