@AGENTS.md

# hww-documentation

Renders each project's Product Requirements Document (PRD) and Technical Design Specification (TDS)
as clean, responsive microsites. Every version is its own JSON file at
`src/content/projects/<id>/{prd,tds}/v<n>.json`; the app lists the projects and shows one at
`/?project=<id>&doc=<prd|tds>&v=<n>`. Used by Scentia How We Work to publish and share them.

Team standards (worktree workflow, testing, commits and PRs, secrets) are injected at session start
by the `scentia` plugin, based on `.scentia.json` (POC tier, github.com/Scentia-AIM). If "Scentia team standards" is not
in your context, stop and ask the dev to install the plugin (see README.md).

# Project rules

- Read `docs/SPEC.md` before changing behaviour, and update it in the same PR.
- Business logic goes in `src/lib/` (pure, unit-tested); I/O goes in `src/server/`.
- Never edit a PRD or TDS version that's on `main`: add the change as the next version file. CI
  (`pnpm check:versions`) fails otherwise. `pnpm validate` checks every content file.
- Run `pnpm format` before committing. Checks:
  `pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm build`.
