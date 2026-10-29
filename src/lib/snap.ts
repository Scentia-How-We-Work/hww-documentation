// Section snapping for the PRD page, done in code so the snap can ease in gently. Same rules as CSS
// mandatory snapping: a scroll always settles on a section start, except inside a section taller
// than the viewport, which scrolls freely and can also settle on its bottom edge.

/** A section's snap position (its top, less any scroll margin) and its height, in pixels. */
export type SnapArea = { start: number; height: number };

/** Where a scroll that came to rest at `position` should settle, or null if it should stay put. */
export function snapTarget(
  position: number,
  viewport: number,
  maxScroll: number,
  areas: SnapArea[],
): number | null {
  const candidates: number[] = [];
  for (const { start, height } of areas) {
    const end = start + height - viewport;
    if (height > viewport && position >= start && position <= end) return null;
    candidates.push(start);
    if (height > viewport) candidates.push(end);
  }

  let nearest: number | null = null;
  for (const candidate of candidates) {
    const clamped = Math.min(Math.max(candidate, 0), maxScroll);
    if (nearest === null || Math.abs(clamped - position) < Math.abs(nearest - position)) {
      nearest = clamped;
    }
  }
  return nearest === null || Math.abs(nearest - position) < 1 ? null : nearest;
}

/** Ease-in-out curve: progress from 0 to 1 that starts and ends slowly. */
export function easeInOutCubic(progress: number): number {
  const t = Math.min(Math.max(progress, 0), 1);
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}
