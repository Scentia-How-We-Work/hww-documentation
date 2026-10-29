import { parseDocPath, type DocPath } from "./projects";
import { prdSchema, tdsSchema } from "./schemas";
import { STANDARD_SECTIONS } from "./tds";
import type { Block, Tds, VersionInfo } from "./types";

// Validates every content file (scripts/validate-content.ts reads them; CI runs it). Errors name
// the file and the field, e.g. "…/tds/v1.json › sections.3.blocks.2.columns: …".

export type ContentFile = { path: string; text: string };

const LAYOUT = "Use projects/<id>/prd/v<n>.json or projects/<id>/tds/v<n>.json";

export function validateContent(files: ContentFile[]): string[] {
  const errors: string[] = [];
  const located: { file: ContentFile; doc: DocPath }[] = [];

  for (const file of files) {
    const doc = parseDocPath(file.path);
    if (doc) located.push({ file, doc });
    else errors.push(`${file.path}: not a document file. ${LAYOUT}`);
  }

  for (const { file, doc } of located) {
    let data: unknown;
    try {
      data = JSON.parse(file.text);
    } catch (error) {
      errors.push(`${file.path}: not valid JSON (${(error as Error).message})`);
      continue;
    }

    const result = (doc.kind === "prd" ? prdSchema : tdsSchema).safeParse(data);
    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path.join(".");
        errors.push(`${file.path}${field ? ` › ${field}` : ""}: ${issue.message}`);
      }
      continue;
    }

    const at = (field: string, message: string) => `${file.path} › ${field}: ${message}`;
    errors.push(...versionErrors(result.data.version, doc.version).map(([f, m]) => at(f, m)));
    if (doc.kind === "tds") {
      const tds = result.data as Tds;
      errors.push(...tdsErrors(tds).map(([f, m]) => at(f, m)));
      const prdVersions = located.filter(
        (other) => other.doc.projectId === doc.projectId && other.doc.kind === "prd",
      );
      if (tds.prdVersion && !prdVersions.some((other) => other.doc.version === tds.prdVersion)) {
        errors.push(at("prdVersion", `PRD v${tds.prdVersion} doesn't exist for this project`));
      }
    }
  }

  return [...errors, ...gapErrors(located.map(({ file }) => file.path))];
}

type FieldError = [field: string, message: string];

function versionErrors(version: VersionInfo, fileVersion: number): FieldError[] {
  const errors: FieldError[] = [];
  if (version.number !== fileVersion) {
    errors.push(["version.number", `is ${version.number} but the file is v${fileVersion}`]);
  }
  if (version.status === "Approved" && !version.approvedBy) {
    errors.push(["version.approvedBy", "required when the status is Approved"]);
  }
  return errors;
}

function tdsErrors(tds: Tds): FieldError[] {
  const errors: FieldError[] = [];
  const name = (section: { number: string; title: string }) =>
    `"${section.number} ${section.title}"`;

  const count = Math.max(tds.sections.length, STANDARD_SECTIONS.length);
  for (let i = 0; i < count; i++) {
    const section = tds.sections[i];
    const standard = STANDARD_SECTIONS[i];
    if (!section) errors.push(["sections", `missing ${name(standard)}`]);
    else if (!standard) errors.push([`sections.${i}`, `unexpected section ${name(section)}`]);
    else if (section.number !== standard.number || section.title !== standard.title) {
      errors.push([`sections.${i}`, `expected ${name(standard)}, found ${name(section)}`]);
    }
  }

  tds.sections.forEach((section, i) => {
    const subsections = section.subsections ?? [];
    if (section.blocks.length === 0 && subsections.length === 0) {
      errors.push([`sections.${i}`, 'is empty. Write "N/A — reason" rather than leaving it empty']);
    }
    errors.push(...tableErrors(section.blocks, `sections.${i}`));
    subsections.forEach((subsection, s) => {
      const field = `sections.${i}.subsections.${s}`;
      if (!subsection.number.startsWith(`${section.number}.`)) {
        errors.push([
          `${field}.number`,
          `"${subsection.number}" should start with "${section.number}."`,
        ]);
      }
      errors.push(...tableErrors(subsection.blocks, field));
    });
  });

  return errors;
}

function tableErrors(blocks: Block[], field: string): FieldError[] {
  return blocks.flatMap((block, b) =>
    block.type !== "table"
      ? []
      : block.rows.flatMap((row, r): FieldError[] =>
          row.length === block.columns.length
            ? []
            : [
                [
                  `${field}.blocks.${b}.rows.${r}`,
                  `has ${row.length} cells but the table has ${block.columns.length} columns`,
                ],
              ],
        ),
  );
}

/** Each document's versions must run v1, v2, v3… with none missing. */
function gapErrors(paths: string[]): string[] {
  const byDocument = new Map<string, number[]>();
  for (const path of paths) {
    const folder = path.replace(/\/v\d+\.json$/, "");
    byDocument.set(folder, [...(byDocument.get(folder) ?? []), parseDocPath(path)!.version]);
  }

  return [...byDocument].flatMap(([folder, versions]) => {
    const missing: string[] = [];
    for (let v = 1; v < Math.max(...versions); v++) {
      if (!versions.includes(v)) missing.push(`v${v}`);
    }
    return missing.length === 0
      ? []
      : [`${folder}: versions must run v1, v2, v3… with no gaps (missing ${missing.join(", ")})`];
  });
}
