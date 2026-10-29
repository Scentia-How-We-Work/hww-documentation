# PRD Template

A reusable React template for turning Product Requirements Documents into clean, responsive HTML microsites.

A single app can hold multiple PRDs. Each project's content lives in its own JSON file, separate from the reusable page structure and styling.

## Tech Stack

- React
- Vite
- TypeScript
- Tailwind CSS

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

| Script                           | Purpose                                                                         |
| -------------------------------- | ------------------------------------------------------------------------------- |
| `pnpm dev` / `build` / `preview` | Vite dev server / production build / serve the build locally                    |
| `pnpm test`                      | Vitest unit tests for the pure lib engine (`src/lib`), with coverage thresholds |
| `pnpm format` / `format:check`   | Prettier: format everything / check formatting                                  |
| `pnpm lint` / `typecheck`        | ESLint (including lib purity rules) / TypeScript                                |

Docs: [docs/SPEC.md](docs/SPEC.md) (requirements, source of truth) and
[docs/DEPLOY.md](docs/DEPLOY.md) (deploy target, not set up yet).

## Creating a New PRD

1. Copy `src/content/projects/template.json` to a new file, e.g. `src/content/projects/my-project.json`. The filename becomes the project's id.
2. Update the PRD content in the new file.
3. Add any workflow diagrams, wireframes, or other images to `public/` (e.g. `public/my-project/workflow.png`) and reference them by path in the JSON (`"image": "/my-project/workflow.png"`). Full URLs also work.
4. Run the project locally with `pnpm dev`.
5. Commit and publish the completed PRD.

## Multiple Projects

Every JSON file in `src/content/projects/` is picked up automatically. Projects are loaded from the URL using the `project` query parameter, which is the filename without `.json`:

```text
http://localhost:5173/?project=my-project
```

With no project in the URL (or an id that doesn't match a file), the app shows a list of all available projects. Each PRD's navigation has an "All projects" link back to the list.

## Project Structure

```text
src/
├── assets/          # App-level images
├── components/      # Reusable PRD components
├── content/
│   ├── projects/    # One JSON file per PRD
│   └── projects.ts  # Loads every project JSON
├── lib/             # Pure, unit-tested logic and the PRD types (types.ts)
├── App.tsx          # PRD page structure
├── App.css
├── index.css
└── main.tsx
```

## Components

The template uses reusable components for common PRD content, including:

- Navigation
- Header
- Sections
- Overview
- Text content
- Tables
- Ordered lists
- Commercial benefits
- Media / images

## PRD Structure

The template currently supports:

1. Overview
2. The Problem
3. The Solution
4. Scope
5. Timeline
6. Risks
7. Dependencies
8. Assumptions / Open Questions

Navigation links are generated from the configured sections and jump directly to the relevant part of the page.

## Editing Content

Project-specific content lives in the project's JSON file:

```text
src/content/projects/<project-id>.json
```

The React components control how that content is displayed, allowing the same design and structure to be reused across multiple PRDs.
