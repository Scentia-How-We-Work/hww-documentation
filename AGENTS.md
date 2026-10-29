## Stack: React + Vite SPA (no deploy config yet)

A client-side React app in TypeScript, built with Vite and styled with Tailwind CSS. It has no server
code and reads no environment variables: PRD content is bundled from `src/content/projects/*.json`
at build time. The standards target Cloudflare Workers (`.scentia.json` stack `c3:react`), but
there's no `wrangler.jsonc` yet: see docs/DEPLOY.md. Check the framework's current docs before
writing framework code: APIs may differ from your training data.
