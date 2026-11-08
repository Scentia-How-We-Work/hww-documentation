// Mermaid scales a diagram down to fit its box, which leaves a large one unreadable on a phone.
// Below this share of its natural size it stops shrinking, and the box scrolls sideways instead.
const MIN_SCALE = 0.7;

/** The narrowest a rendered Mermaid SVG should get, in pixels, or null if its width isn't known. */
export function diagramMinWidth(svg: string): number | null {
  const match = /max-width:\s*([\d.]+)px/.exec(svg);
  if (!match) return null;
  return Math.floor(Number(match[1]) * MIN_SCALE);
}
