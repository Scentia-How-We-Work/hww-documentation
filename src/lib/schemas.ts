import { z } from "zod";
import type { Block, Prd, Tds, VersionInfo } from "./types";

// Zod schemas for the content files, matching types.ts. Objects are strict, so a misspelt field
// fails validation instead of being silently ignored.

const text = z.string().trim().min(1);

export const versionSchema = z.strictObject({
  number: z.int().min(1),
  date: z.iso.date(),
  status: z.enum(["Draft", "In review", "Approved", "Superseded"]),
  author: text,
  approvedBy: text.optional(),
  changes: text,
}) satisfies z.ZodType<VersionInfo>;

const person = z.strictObject({ name: z.string(), role: z.string(), email: z.string() });

const mediaItem = z.union([
  z.strictObject({ image: z.string(), alt: z.string() }),
  z.strictObject({ link: z.url(), title: z.string(), description: z.string() }),
  z.strictObject({ mermaid: text, title: text.optional(), description: text.optional() }),
]);

// The parts of a business case; the summary alone isn't enough
const BUSINESS_CASE_PARTS = [
  "comparison",
  "baseline",
  "expectedImprovement",
  "commercialBenefit",
  "benefits",
] as const;

export const prdSchema = z.strictObject({
  version: versionSchema,
  pageTitle: text,
  overview: z.strictObject({
    title: z.string(),
    team: z.string(),
    contributors: z.array(person),
    stakeholders: z.array(person),
    primaryContact: person,
    targetDelivery: z.string(),
  }),
  problem: z.strictObject({
    headline: z.string(),
    currentState: z.string(),
    strategicAlignment: z.string(),
    businessCase: z
      .strictObject({
        summary: text.optional(),
        comparison: z
          .array(z.strictObject({ area: text, today: text, future: text }))
          .min(1)
          .optional(),
        baseline: z
          .array(z.strictObject({ metric: z.string(), currentState: z.string() }))
          .optional(),
        expectedImprovement: z
          .array(
            z.strictObject({
              metric: z.string(),
              currentState: z.string(),
              target: z.string(),
              improvement: z.string(),
            }),
          )
          .optional(),
        commercialBenefit: z
          .strictObject({
            title: z.string(),
            timeSaving: z.string(),
            costBenefit: z.string(),
          })
          .optional(),
        benefits: z
          .array(
            z.strictObject({
              figure: text,
              label: text,
              description: text,
              status: text.optional(),
            }),
          )
          .min(1)
          .optional(),
      })
      .refine(
        (businessCase) => BUSINESS_CASE_PARTS.some((part) => businessCase[part] !== undefined),
        {
          message: `needs at least one of ${BUSINESS_CASE_PARTS.slice(0, -1).join(", ")} or ${BUSINESS_CASE_PARTS.at(-1)}`,
        },
      ),
  }),
  solution: z.strictObject({
    futureState: z.string(),
    workflows: z.array(mediaItem),
    keyFeatures: z.array(z.string()),
    wireframes: z.array(mediaItem),
  }),
  scope: z.strictObject({ goals: z.array(z.string()), nonGoals: z.array(z.string()) }),
  milestones: z.array(
    z.strictObject({ target: z.string(), milestone: z.string(), description: z.string() }),
  ),
  risks: z.array(
    z.strictObject({
      risk: z.string(),
      impact: z.string(),
      likelihood: z.string(),
      mitigation: z.string(),
    }),
  ),
  dependencies: z.array(
    z.strictObject({
      dependency: z.string(),
      requirement: z.string(),
      owner: z.string(),
      status: z.string(),
    }),
  ),
  assumptions: z.array(z.string()),
}) satisfies z.ZodType<Prd>;

const block = z.discriminatedUnion("type", [
  z.strictObject({ type: z.literal("text"), text }),
  z.strictObject({ type: z.literal("heading"), text }),
  z.strictObject({
    type: z.literal("list"),
    ordered: z.boolean().optional(),
    items: z.array(text).min(1),
  }),
  z.strictObject({
    type: z.literal("table"),
    columns: z.array(z.string()).min(1),
    rows: z.array(z.array(z.string())),
  }),
  z.strictObject({ type: z.literal("mermaid"), title: text.optional(), code: text }),
  z.strictObject({
    type: z.literal("callout"),
    tone: z.enum(["info", "guidance", "warning"]),
    text,
  }),
  z.strictObject({
    type: z.literal("checklist"),
    items: z.array(z.strictObject({ text, done: z.boolean() })).min(1),
  }),
]) satisfies z.ZodType<Block>;

const subsection = z.strictObject({ number: text, title: text, blocks: z.array(block) });

export const tdsSchema = z.strictObject({
  version: versionSchema,
  prdVersion: z.int().min(1).optional(),
  documentControl: z.strictObject({
    project: text,
    tier: text,
    approver: text,
    reviewers: text,
    related: z.array(z.strictObject({ label: text, url: z.url() })),
  }),
  intro: z.array(block).optional(),
  sections: z.array(
    z.strictObject({
      number: text,
      title: text,
      blocks: z.array(block),
      subsections: z.array(subsection).optional(),
    }),
  ),
}) satisfies z.ZodType<Tds>;
