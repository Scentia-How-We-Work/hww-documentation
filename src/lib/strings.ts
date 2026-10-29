// Example lib module: pure, fully unit-tested. Replace it with the app's own business logic.

/** Lower-case, dash-separated slug of `text` (ASCII letters and digits only). */
export function slugify(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
