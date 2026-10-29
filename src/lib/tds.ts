import type { Block, Tds } from "./types";

// Every TDS has these sections, in this order, after 0. Document control (from the Technical Design
// Spec template in Notion). A section that doesn't apply says "N/A — reason" rather than going.
export const STANDARD_SECTIONS = [
  { number: "1", title: "Overview" },
  { number: "2", title: "Architecture drivers" },
  { number: "3", title: "Architecture (C4 model)" },
  { number: "4", title: "Technology stack" },
  { number: "5", title: "Hosting and environments" },
  { number: "6", title: "Data model" },
  { number: "7", title: "Integrations" },
  { number: "8", title: "Application design" },
  { number: "9", title: "Identity and access" },
  { number: "10", title: "Security" },
  { number: "11", title: "Privacy and compliance" },
  { number: "12", title: "Audit" },
  { number: "13", title: "Logging, monitoring and alerting" },
  { number: "14", title: "Reliability and operations" },
  { number: "15", title: "Testing strategy" },
  { number: "16", title: "Delivery and rollout" },
  { number: "17", title: "Decisions, risks and open questions" },
  { number: "A", title: "Requirements traceability" },
  { number: "B", title: "Email catalogue" },
  { number: "C", title: "Permission matrix" },
] as const;

/** Every Mermaid diagram in a TDS with its field, so validation can parse each one. */
export function mermaidBlocks(tds: Tds): { field: string; code: string }[] {
  const found: { field: string; code: string }[] = [];
  const collect = (blocks: Block[], field: string) =>
    blocks.forEach((block, b) => {
      if (block.type === "mermaid") found.push({ field: `${field}.${b}`, code: block.code });
    });

  collect(tds.intro ?? [], "intro");
  tds.sections.forEach((section, i) => {
    collect(section.blocks, `sections.${i}.blocks`);
    section.subsections?.forEach((subsection, s) =>
      collect(subsection.blocks, `sections.${i}.subsections.${s}.blocks`),
    );
  });
  return found;
}

/** The page anchor for a section or subsection number, e.g. "3.6" becomes "section-3-6". */
export function sectionAnchor(number: string): string {
  return `section-${number.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}
