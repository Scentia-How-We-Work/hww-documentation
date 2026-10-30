# hww-documentation: specification

Source of truth for behaviour. Update it in the same PR as any behaviour change.

## Goals

Renders each project's Product Requirements Document (PRD) and Technical Design Specification (TDS)
as clean, responsive microsites. Each document is versioned: every version is its own JSON file in
`src/content/projects/<id>/`, and a merged version never changes. The app lists every project and
shows one at `/?project=<id>`. Used by Scentia How We Work to publish and share PRDs and TDSs.

## Users

## Features

- **Project list** at `/`: every project except the template, under a "Documentation" heading, sorted by name
  (the latest PRD's overview title, or the TDS's project name if there's no PRD), with its team and target delivery (from the PRD) and the latest
  version of each document, e.g. "PRD v2 · TDS v1". An unknown `?project=` id shows the list with a
  "No project found" message.
- **Document URLs:** `/?project=<id>&doc=<prd|tds>&v=<n>`.
  - Without `doc`, the PRD shows, or the TDS when there's no PRD. Asking for a document the project
    doesn't have shows the other one.
  - Without `v`, the latest version shows. An unknown `v` shows the latest version with a "There's no
    v<n>" message; an older version shows a message linking to the latest.
- **PRD/TDS switch and version picker** in the side navigation. A project can have a PRD, a TDS or
  both, added at different times; a document it doesn't have yet shows greyed out. The picker lists
  every version of the current document, newest first, with its status and date.
- **PRD page:** nine numbered sections (Overview, The Problem, The Solution, Scope, Timeline, Risks,
  Dependencies, Assumptions, Version History) with side navigation. Version History lists every
  version up to the one shown.
- **TDS page:** section 0, Document control (from `documentControl` and the version headers, with
  the approval log and a link to the PRD version the TDS was written against), then the standard
  sections 1–17 and appendices A–C, each with its subsections. Content is blocks: text, headings,
  bulleted and numbered lists, tables, Mermaid diagrams, callouts (info, guidance, warning) and
  checklists. TDS text can use `**bold**`, `*italic*`, `` `code` `` and `[links](https://…)`; links
  open in a new tab, and only http, https and mailto links are made links.
- **Mermaid diagrams:** the Mermaid library loads only on pages that have a diagram. Diagrams follow
  the light/dark theme, redrawing when it changes. A diagram that can't be drawn shows the error and
  its source.
- **Section snapping:** when scrolling stops, the page glides (about 600 ms, ease-in-out) to the
  nearest section start. Sections taller than the screen scroll freely and can also settle on
  their bottom edge. Scrolling, touching or a key press stops a glide; with reduced motion it
  snaps instantly.
- **Media:** the Workflows and Mock-ups items in The Solution (`workflows` and `wireframes` in the JSON) are each an image, a Mermaid
  diagram or a link card. Images and diagrams are shown full width, in their order in the JSON; link
  cards are shown after them in a grid and open their link in a new tab.
- **Levels:** table cells reading Low, Medium or High (any case) show as coloured tags, in PRD and
  TDS tables.
- **Dates** show as DD/MM/YYYY.
- **Theme:** light, dark or system, remembered in `localStorage`.

## Integrations

None at runtime. Link cards and TDS links point at external pages (for example the mock-ups on
https://scentia-aim.github.io/HWW-Mock-Ups/ and Notion) but nothing is fetched from them.

## Hosting

Published on GitHub Pages at https://scentia-how-we-work.github.io/hww-documentation/, built and
deployed from `main` (docs/DEPLOY.md). The site lives under a subpath, so in-app links stay relative
(`?project=…`, `./`) and never start with `/`.

## Data

One folder per project in `src/content/projects/`, bundled at build time. The folder name is the
project id.

```text
src/content/projects/<id>/prd/v1.json, v2.json, …
src/content/projects/<id>/tds/v1.json, v2.json, …
```

- **Version header:** every file starts with `version`: `{ number, date (YYYY-MM-DD), status
(Draft | In review | Approved | Superseded), author, approvedBy?, changes }`. The approval log is
  the list of every version's header.
- **PRD:** the `Prd` type in `src/lib/types.ts`. A media item is an image (`{ "image", "alt" }`), a
  Mermaid diagram (`{ "mermaid", "title"?, "description"? }`, with the title and description shown
  above the diagram) or a link card (`{ "link", "title", "description" }`).
- **TDS:** the `Tds` type in `src/lib/types.ts`: the version header, `prdVersion` (optional, the PRD
  version it was written against), `documentControl` (project, tier, approver, reviewers, related
  links), optional `intro` blocks and the `sections`. Sections follow the Technical Design Spec
  template in Notion; the list is `STANDARD_SECTIONS` in `src/lib/tds.ts`.
- **Template:** the `template` project holds a blank PRD and TDS to copy. It isn't on the project
  list, but `?project=template` opens it.

### Validation (`pnpm validate`, run in CI and on pre-push)

Every file under `src/content/projects/` must pass, or CI fails:

- It sits at `<id>/prd/v<n>.json` or `<id>/tds/v<n>.json` and is valid JSON.
- It matches its schema (`src/lib/schemas.ts`). Objects are strict, so an unknown or misspelt field
  fails.
- `version.number` matches the file name, and `approvedBy` is set when the status is Approved.
- Each document's versions run v1, v2, v3… with no gaps.
- A TDS has exactly the standard sections, in order. No section is empty (write "N/A — reason").
  Subsection numbers start with their section's number. Every table row has one cell per column.
  `prdVersion`, when set, names a PRD version that exists.
- Every Mermaid diagram parses, in a TDS or in a PRD's workflows and mock-ups.

### Versions never change (`pnpm check:versions`, run in CI and on pre-push)

Comparing the branch with `main`, CI fails if a version file that's already on `main` is edited,
deleted or renamed. A change goes in as a new version file. Files that are new in the branch can
still change until it merges.

The one exception is a project listed in `RETIRED_PROJECTS` (`src/lib/versions.ts`): its versions
may be deleted, though still never edited or renamed. Only `example-invoice-automation`, the demo
project, is listed.

## Non-goals

- Editing documents in the app: they're edited as JSON in the repo.
- Syncing with Notion. The Partner Packs TDS was imported from Notion once.

## Open questions
