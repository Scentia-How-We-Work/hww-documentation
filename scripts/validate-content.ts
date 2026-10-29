// Validates every PRD and TDS file in src/content/projects (rules in src/lib/validate.ts), then
// parses every Mermaid diagram so a broken one fails here rather than on the page.
// Usage: pnpm validate
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { JSDOM } from "jsdom";
import { parseDocPath } from "../src/lib/projects";
import { tdsSchema } from "../src/lib/schemas";
import { mermaidBlocks } from "../src/lib/tds";
import { validateContent } from "../src/lib/validate";

const root = join(import.meta.dirname, "..");
const contentDir = join(root, "src/content/projects");

const files = readdirSync(contentDir, { recursive: true, encoding: "utf8" })
  .filter((name) => name.endsWith(".json"))
  .sort()
  .map((name) => {
    const path = join(contentDir, name);
    return { path: relative(root, path), text: readFileSync(path, "utf8") };
  });

const errors = validateContent(files);

// Mermaid needs a DOM for some diagram types, so give it jsdom's before loading it
const { window } = new JSDOM("");
Object.assign(globalThis, { window, document: window.document });
const { default: mermaid } = await import("mermaid");

for (const file of files) {
  if (parseDocPath(file.path)?.kind !== "tds") continue;
  const tds = tdsSchema.safeParse(JSON.parse(file.text));
  if (!tds.success) continue;
  for (const { field, code } of mermaidBlocks(tds.data)) {
    try {
      await mermaid.parse(code);
    } catch (error) {
      const message = (error as Error).message.split("\n").slice(0, 3).join(" ");
      errors.push(`${file.path} › ${field}: the diagram doesn't parse (${message})`);
    }
  }
}

if (errors.length > 0) {
  console.error(`Content validation failed (${errors.length}):\n`);
  for (const error of errors) console.error(`  ${error}`);
  process.exit(1);
}
console.log(`Content valid: ${files.length} files.`);
