# Deploying hww-documentation

## GitHub Pages (live)

The app is published at https://scentia-how-we-work.github.io/hww-documentation/.

`.github/workflows/pages.yml` runs on every push to `main` (and by hand from the Actions tab): it
builds with `pnpm build --base=/hww-documentation/` and deploys `dist/` with `actions/deploy-pages`.
The base is needed because a project site is served under `/<repo>/`; without it the built page asks
for `/assets/…` at the domain root and gets 404s.

One-time repo setting: Settings → Pages → Build and deployment → Source must be **GitHub Actions**.
"Deploy from a branch" publishes the raw source instead: `index.html` then loads `/src/main.tsx`,
which browsers can't run, and the page stays blank. To set it from the command line:

```bash
gh api -X PUT repos/Scentia-How-We-Work/hww-documentation/pages -f build_type=workflow
```

## Cloudflare Workers (target, not set up yet)

The team standards target Cloudflare Workers. This app has no `wrangler.jsonc` and isn't deployed as
a Worker. Adding one (static assets from `dist/`, `account_id` pinned to the team account) is
separate work; until then, the steps below describe the target setup. A Worker serves the app at the
domain root, so its build doesn't need the Pages base.

The app would run as one Cloudflare Worker on the team account `cf19a34c4b44339d91604f31451b6416`
(https://dash.cloudflare.com/cf19a34c4b44339d91604f31451b6416/home), set as `account_id` in
`wrangler.jsonc`.

### Before you deploy anything

```bash
npm i -g wrangler
wrangler login
wrangler whoami        # must list account cf19a34c4b44339d91604f31451b6416; ask an admin for access if not
```

### How deploys happen

[Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/) builds and deploys every
push to `main`. Set it up once in the dashboard: Workers & Pages → Create → Import a repository →
this repo, production branch `main`, build command `pnpm run build`, deploy command
`npx wrangler deploy`. Turn off builds for non-production branches unless the app has separate
preview secrets: previews would otherwise run against production data.

Workers Builds doesn't wait for GitHub Actions. It doesn't need to: branch protection only lets
commits reach `main` through a PR whose `ci` check passed.

### Secrets

Runtime config is stored as Worker secrets and carries over between deploys. Variable names are in
`.env.example`.

```bash
wrangler secret bulk .env.production   # a local, gitignored file with production values
wrangler secret list
```

Manual deploy (rarely needed): `pnpm run deploy`.
