import { useEffect, useState } from "react";
import { FREE_EXTRA_PROMOTION } from "@/config/promotions";

const MAX_TIMER_DELAY_MS = 2_147_000_000;

/**
 * Keeps promotion UI accurate when a tab remains open across a launch or expiry boundary.
 */
export function usePromotionNow() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let timerId: number | undefined;

    const scheduleBoundaryRefresh = () => {
      if (timerId !== undefined) window.clearTimeout(timerId);
      const current = Date.now();
      const nextBoundary = [
        new Date(FREE_EXTRA_PROMOTION.startsAt).getTime(),
        new Date(FREE_EXTRA_PROMOTION.endsAt).getTime(),
      ]
        .filter((boundary) => boundary > current)
        .sort((a, b) => a - b)[0];
      const delay = nextBoundary
        ? Math.min(Math.max(nextBoundary - current + 250, 250), MAX_TIMER_DELAY_MS)
        : MAX_TIMER_DELAY_MS;

      timerId = window.setTimeout(() => {
        setNow(new Date());
        scheduleBoundaryRefresh();
      }, delay);
    };

    const refresh = () => {
      setNow(new Date());
      scheduleBoundaryRefresh();
    };

    scheduleBoundaryRefresh();
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);

    return () => {
      if (timerId !== undefined) window.clearTimeout(timerId);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  return now;
}
