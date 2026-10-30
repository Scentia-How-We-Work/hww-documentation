// Validates every PRD and TDS file in src/content/projects (rules in src/lib/validate.ts), then
// parses every Mermaid diagram so a broken one fails here rather than on the page.
// Usage: pnpm validate
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { JSDOM } from "jsdom";
import { prdDiagrams } from "../src/lib/media";
import { parseDocPath } from "../src/lib/projects";
import { prdSchema, tdsSchema } from "../src/lib/schemas";
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

function diagramsIn(file: { path: string; text: string }) {
  const kind = parseDocPath(file.path)?.kind;
  if (kind === "tds") {
    const tds = tdsSchema.safeParse(JSON.parse(file.text));
    return tds.success ? mermaidBlocks(tds.data) : [];
  }
  if (kind === "prd") {
    const prd = prdSchema.safeParse(JSON.parse(file.text));
    return prd.success ? prdDiagrams(prd.data) : [];
  }
  return [];
}

for (const file of files) {
  for (const { field, code } of diagramsIn(file)) {
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
