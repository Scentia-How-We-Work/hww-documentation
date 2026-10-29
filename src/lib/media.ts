import type { LinkCard, MediaItem } from "./types";

/** Whether a workflows or wireframes item is a link card rather than an image. */
export function isLinkCard(item: MediaItem): item is LinkCard {
  return "link" in item;
}
