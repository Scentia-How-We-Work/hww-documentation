import { useEffect, type RefObject } from "react";
import { easeInOutCubic, snapTarget, type SnapArea } from "../lib/snap";

// A scroll counts as finished once no scroll events have arrived for this long
const SETTLE_MS = 150;
// How long the snap takes to glide into place
const DURATION_MS = 600;

// Snap the scroll container to its <section>s once scrolling stops, easing into place instead of
// the browser's abrupt CSS snap. Scrolling, touching or pressing a key stops a snap in progress.
export function useSectionSnap(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!ref.current) return;
    const container: HTMLElement = ref.current;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let settleTimer: number | undefined;
    let frame: number | undefined;
    let holding = false;

    function areas(): SnapArea[] {
      const origin = container.getBoundingClientRect().top - container.scrollTop;
      return Array.from(container.querySelectorAll("section")).map((section) => {
        const rect = section.getBoundingClientRect();
        const margin = parseFloat(getComputedStyle(section).scrollMarginTop) || 0;
        return { start: rect.top - origin - margin, height: rect.height + margin };
      });
    }

    function stop() {
      if (frame !== undefined) cancelAnimationFrame(frame);
      frame = undefined;
    }

    function glideTo(target: number) {
      if (reduceMotion.matches) {
        container.scrollTo({ top: target, behavior: "instant" });
        return;
      }
      const from = container.scrollTop;
      const startedAt = performance.now();
      const step = (now: number) => {
        const progress = (now - startedAt) / DURATION_MS;
        const top = from + (target - from) * easeInOutCubic(progress);
        container.scrollTo({ top, behavior: "instant" });
        frame = progress < 1 ? requestAnimationFrame(step) : undefined;
      };
      frame = requestAnimationFrame(step);
    }

    function settle() {
      if (holding || frame !== undefined) return;
      const { scrollTop, clientHeight, scrollHeight } = container;
      const target = snapTarget(scrollTop, clientHeight, scrollHeight - clientHeight, areas());
      if (target !== null) glideTo(target);
    }

    function onScroll() {
      if (frame !== undefined) return;
      clearTimeout(settleTimer);
      settleTimer = window.setTimeout(settle, SETTLE_MS);
    }

    function hold() {
      holding = true;
      stop();
    }

    function release() {
      if (!holding) return;
      holding = false;
      onScroll();
    }

    // A mouse button held down may be dragging the scrollbar, so wait for it to be released
    function onPointerDown(event: PointerEvent) {
      if (event.pointerType === "mouse") hold();
    }

    const passive = { passive: true };
    container.addEventListener("scroll", onScroll, passive);
    container.addEventListener("wheel", stop, passive);
    container.addEventListener("touchstart", hold, passive);
    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("touchend", release);
    window.addEventListener("pointerup", release);
    window.addEventListener("keydown", stop);

    return () => {
      clearTimeout(settleTimer);
      stop();
      container.removeEventListener("scroll", onScroll);
      container.removeEventListener("wheel", stop);
      container.removeEventListener("touchstart", hold);
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("touchend", release);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("keydown", stop);
    };
  }, [ref]);
}
