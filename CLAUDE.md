@AGENTS.md

# hww-documentation

Renders Product Requirements Documents (PRDs) as clean, responsive microsites. Each PRD is a JSON file in `src/content/projects/`; the app lists them all and shows one at `/?project=<id>`. Used by Scentia How We Work to publish and share PRDs.

Team standards (worktree workflow, testing, commits and PRs, secrets) are injected at session start
by the `scentia` plugin, based on `.scentia.json` (POC tier, github.com/Scentia-AIM). If "Scentia team standards" is not
in your context, stop and ask the dev to install the plugin (see README.md).

# Project rules

- Read `docs/SPEC.md` before changing behaviour, and update it in the same PR.
- Business logic goes in `src/lib/` (pure, unit-tested); I/O goes in `src/server/`.
- Run `pnpm format` before committing. Checks:
  `pnpm format:check && pnpm lint && pnpm typecheck && pnpm test && pnpm build`.
