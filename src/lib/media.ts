import type { Diagram, LinkCard, MediaItem, Prd } from "./types";

/** Whether a workflows or wireframes item is a link card rather than an image or diagram. */
export function isLinkCard(item: MediaItem): item is LinkCard {
  return "link" in item;
}

/** Whether a workflows or wireframes item is a Mermaid diagram. */
export function isDiagram(item: MediaItem): item is Diagram {
  return "mermaid" in item;
}

/** Every Mermaid diagram in a PRD with its field, so validation can parse each one. */
export function prdDiagrams(prd: Prd): { field: string; code: string }[] {
  const { workflows, wireframes } = prd.solution;
  return [
    ...workflows.map((item, i) => ({ item, field: `solution.workflows.${i}` })),
    ...wireframes.map((item, i) => ({ item, field: `solution.wireframes.${i}` })),
  ].flatMap(({ item, field }) => (isDiagram(item) ? [{ field, code: item.mermaid }] : []));
}
