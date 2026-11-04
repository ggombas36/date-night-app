import { useCallback, useState } from "react";

const key = (id: string) => `opened:${id}`;

function wasOpened(id: string): boolean {
  try {
    return localStorage.getItem(key(id)) === "1";
  } catch {
    return false;
  }
}

/** Which seals were broken on this device. A per-device convenience, so blocked storage is fine. */
export function useOpenedSeals() {
  const [session, setSession] = useState<Set<string>>(new Set());

  const isOpened = useCallback((id: string) => session.has(id) || wasOpened(id), [session]);

  const markOpened = useCallback((id: string) => {
    setSession((prev) => new Set(prev).add(id));
    try {
      localStorage.setItem(key(id), "1");
    } catch {
      /* storage blocked: the seal stays open for this visit */
    }
  }, []);

  return { isOpened, markOpened };
}
