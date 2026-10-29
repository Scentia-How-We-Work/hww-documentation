# Deploying hww-documentation

> **Not set up yet.** This app has no `wrangler.jsonc` and isn't deployed as a Worker. Adding one
> (static assets from `dist/`, `account_id` pinned to the team account) is separate work; until
> then, the steps below describe the target setup.

The app runs as one Cloudflare Worker on the team account `cf19a34c4b44339d91604f31451b6416`
(https://dash.cloudflare.com/cf19a34c4b44339d91604f31451b6416/home), set as `account_id` in `wrangler.jsonc`.

## Before you deploy anything

```bash
npm i -g wrangler
wrangler login
wrangler whoami        # must list account cf19a34c4b44339d91604f31451b6416; ask an admin for access if not
```

## How deploys happen

[Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/) builds and deploys every
push to `main`. Set it up once in the dashboard: Workers & Pages → Create → Import a repository →
this repo, production branch `main`, build command `pnpm run build`, deploy command
`npx wrangler deploy`. Turn off builds for non-production branches unless the app has separate
preview secrets: previews would otherwise run against production data.

Workers Builds doesn't wait for GitHub Actions. It doesn't need to: branch protection only lets
commits reach `main` through a PR whose `ci` check passed.

## Secrets

Runtime config is stored as Worker secrets and carries over between deploys. Variable names are in
`.env.example`.

```bash
wrangler secret bulk .env.production   # a local, gitignored file with production values
wrangler secret list
```

Manual deploy (rarely needed): `pnpm run deploy`.
