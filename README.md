# PRD and TDS Store

A React app that turns each project's Product Requirements Document (PRD) and Technical Design
Specification (TDS) into clean, responsive microsites.

A single app holds many projects. Each project has a PRD, a TDS or both, and every version of each
is its own JSON file, separate from the reusable page structure and styling. Merged versions never
change: a change is a new version.

## Tech Stack

- React
- Vite
- TypeScript
- Tailwind CSS
- Mermaid (diagrams in the TDS)
- Zod (content validation)

**Tier:** POC (see `.scentia.json`). Follows the
[Scentia coding standards](https://github.com/Scentia-How-We-Work/coding-standards).

## Setup

Once per machine, install the team Claude Code plugin and the tools that `preflight` checks for:

```bash
brew install gitleaks gh && corepack enable pnpm
gh auth login
gh auth setup-git         # lets git clone the internal standards repo with your gh login
claude plugin marketplace add Scentia-How-We-Work/coding-standards
claude plugin install scentia@scentia
```

Then in this repo:

```bash
pnpm install
pnpm dev                  # serves the local `testing` branch at http://localhost:5173
```

## Dev workflow

The root checkout stays on the local-only `testing` branch. New work happens in
`worktrees/<branch>`, and finished work is merged into `testing` to try it out, then sent as a PR.
In Claude Code: `/scentia:start-work`, `/scentia:integrate-testing`, `/scentia:finish-work`.

## Scripts

| Script                           | Purpose                                                                           |
| -------------------------------- | --------------------------------------------------------------------------------- |
| `pnpm dev` / `build` / `preview` | Vite dev server / production build / serve the build locally                      |
| `pnpm test`                      | Vitest unit tests for the pure lib engine (`src/lib`), with coverage thresholds   |
| `pnpm validate`                  | Validate every PRD and TDS file, including parsing every Mermaid diagram          |
| `pnpm check:versions [base]`     | Fail if a version already on `base` (default `origin/main`) was edited or removed |
| `pnpm format` / `format:check`   | Prettier: format everything / check formatting                                    |
| `pnpm lint` / `typecheck`        | ESLint (including lib purity rules) / TypeScript (app, and `scripts/` separately) |

CI and the pre-push hook run `validate` and `check:versions` alongside the other checks.

Docs: [docs/SPEC.md](docs/SPEC.md) (requirements, source of truth) and
[docs/DEPLOY.md](docs/DEPLOY.md) (GitHub Pages, published from `main`).

## Content layout

```text
src/content/projects/
├── partner-pack-portals/
│   ├── prd/v1.json
│   └── tds/v1.json
├── example-invoice-automation/
│   └── prd/v1.json          # a TDS can be added later
└── template/
    ├── prd/v1.json          # blank PRD to copy
    └── tds/v1.json          # blank TDS to copy (from the Notion TDS template)
```

The folder name is the project id. Every file starts with a version header:

```json
"version": {
  "number": 1,
  "date": "2026-10-29",
  "status": "Draft",
  "author": "Erin Smith",
  "changes": "What changed in this version and why"
}
```

`status` is Draft, In review, Approved or Superseded; an Approved version also needs `approvedBy`.

## Adding a project

1. Create `src/content/projects/<my-project>/` and copy `template/prd/v1.json` into
   `<my-project>/prd/v1.json`, `template/tds/v1.json` into `<my-project>/tds/v1.json`, or both.
2. Fill in the content and the version header. In a TDS, set `prdVersion` to the PRD version it's
   written against, and keep every section: write "N/A — reason" in one that doesn't apply.
3. For PRD images, add files to `public/` (e.g. `public/my-project/workflow.png`) and reference
   them by path (`"image": "/my-project/workflow.png"`). Full URLs also work. To link to something
   instead, such as a live mock-up, use a link card in `workflows` or `wireframes`:
   `{ "link": "https://…", "title": "…", "description": "…" }`.
4. Run `pnpm validate`, then `pnpm dev` to check the pages.

## Changing a document

Never edit a version that's on `main`: CI fails if you do. Copy the latest file to the next
number (`v1.json` → `v2.json`), make the changes, and update its version header (`number`, `date`,
`status`, `author`, `changes`). Approving a document is also a new version, with `status:
"Approved"` and `approvedBy`. Until the PR merges, you can keep editing the new file.

## Writing a TDS

TDS content is a list of blocks in each section and subsection:

| Block       | Shape                                                                          |
| ----------- | ------------------------------------------------------------------------------ |
| `text`      | `{ "type": "text", "text": "…" }`                                              |
| `heading`   | `{ "type": "heading", "text": "…" }`                                           |
| `list`      | `{ "type": "list", "ordered": true, "items": ["…"] }`                          |
| `table`     | `{ "type": "table", "columns": ["…"], "rows": [["…"]] }`                       |
| `mermaid`   | `{ "type": "mermaid", "title": "…", "code": "flowchart LR\n  a --> b" }`       |
| `callout`   | `{ "type": "callout", "tone": "info", "text": "…" }` (info, guidance, warning) |
| `checklist` | `{ "type": "checklist", "items": [{ "text": "…", "done": false }] }`           |

Text can use `**bold**`, `*italic*`, `` `code` `` and `[links](https://…)`. In Mermaid sequence
diagrams, write a semicolon in a message as `#59;`; a bare `;` ends the statement.

## Viewing documents

```text
http://localhost:5173/?project=partner-pack-portals              # latest PRD (or TDS if no PRD)
http://localhost:5173/?project=partner-pack-portals&doc=tds      # latest TDS
http://localhost:5173/?project=partner-pack-portals&doc=prd&v=1  # PRD v1
```

With no project in the URL (or an unknown id), the app lists every project. Each page's navigation
switches between the PRD and TDS and between versions, and links back to the list.

## Project Structure

```text
scripts/             # validate-content.ts and check-versions.ts (run with tsx)
src/
├── assets/          # App-level images
├── components/      # PrdPage, TdsPage, Blocks, Mermaid, DocSwitcher and shared pieces
├── content/
│   ├── projects/    # <id>/prd/v<n>.json and <id>/tds/v<n>.json
│   └── projects.ts  # Loads every version file
├── hooks/           # Section snapping
├── lib/             # Pure, unit-tested logic: types, schemas, validation, versions, routing
├── App.tsx          # Picks the project list, PRD page or TDS page from the URL
├── App.css
├── index.css
└── main.tsx
```
