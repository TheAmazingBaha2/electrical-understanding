# Cloudflare Workers staging — branch/build troubleshooting

**Staging Worker:** \`eu-v2-staging\` — deliberately separate from \`electrical-understanding\` and the live GitHub Pages site.  
**Staging branch:** \`draft/v2-dmm-companion\` — do **not** merge into \`main\` to test.  
**Status:** Repository code/build protection configured. Cloudflare account-level Build triggers, Access policy, and actual deployed URL must be inspected/confirmed from the Cloudflare dashboard; they cannot be changed solely by editing this repository.

## Recommended Cloudflare Workers Builds settings

Inside Workers & Pages → **eu-v2-staging** → Settings → Builds:

| Field | Value |
| --- | --- |
| Git repository | \`TheAmazingBaha2/electrical-understanding\` |
| Production branch (for THIS staging Worker) | \`draft/v2-dmm-companion\` |
| Build command | \`npm run build\` |
| Deploy command | \`npx wrangler deploy\` |
| Preview command (optional) | \`npx wrangler preview\` |
| Root directory | \`/\` |
| Build watch path includes | \`*\` |
| Build disabled | Off |
| Production build trigger branch includes | \`draft/v2-dmm-companion\` |
| Production build trigger branch excludes | none |
| Preview builds | Optional — only needed for branches **other than** \`draft/v2-dmm-companion\` |

**A successful push to the staging Worker's production branch deploys to its regular \`workers.dev\` URL.** This is **not** a "Worker Preview" deployment in the separate Previews tab. No \`npx wrangler preview\` command is required to serve the selected staging branch at that regular URL.

**Do not change the staging Worker to use \`main\` or your existing \`electrical-understanding\` Worker.**

## Cloudflare helper's three issues explained

1. **Manual redeploys showed \`main\`.** A retry can rebuild the original source of a prior build, or a separate manual deployment might have selected the default branch. The *only trustworthy evidence* for our new staging release is a fresh Git-triggered build showing both branch \`draft/v2-dmm-companion\` and the correct new commit SHA in the build's details. Cloudflare's Builds API also accepts a branch in a manual trigger, so "all manual builds always select main" is not a universal platform rule.
2. **No Preview builds.** The only included branch was the production branch of THIS staging Worker; it is therefore expected to produce production builds, *not* branch Preview entries. **No config fix is needed to get the v2 testing URL.** To also test other branches, configure a separate Preview trigger for an intentional pattern like \`preview/*\`; don't turn on all branches merely to make the current staging branch visible. A change to \`branch_includes\` is a Cloudflare-side setting, not a GitHub repository setting.
3. **\`wrangler preview\` produced no Preview.** It has to be executed in a running environment with authenticated Cloudflare credentials, a compatible Wrangler release and a valid config. It is **not** a command field for the user's ordinary browser. With Git integration, enable Preview builds (for non-production branches) if/when needed; Cloudflare then executes it.

## Branch safety safeguard

\`scripts/build.mjs\` checks \`WORKERS_CI_BRANCH\` **only when Cloudflare Workers Builds sets \`WORKERS_CI=1\`**, and fails if the branch is anything other than:
- \`draft/v2-dmm-companion\`, or
- \`preview/*\` (intentional optional previews).

The build copies an explicit allowlist of static files into \`dist/\` and emits \`dist/build-info.json\` containing the source branch and commit. No private scanned material or documentation is published in static assets.

After deployment, open the staging domain's \`/build-info.json\` and verify:
- \`worker\` is \`eu-v2-staging\`;
- \`branch\` is \`draft/v2-dmm-companion\`;
- \`commit\` is the recent draft-branch commit shown by GitHub.

On \`*.workers.dev\` and \`*.pages.dev\`, the browser deliberately **disables production Supabase authentication and cloud progress writes**. Staging progress is device-local until a **separate test backend** is provided. Browser-local practice across phone and desktop does not sync yet.

## Privacy gate

Separately enable **Cloudflare Access for all traffic** to the staging Worker's URL and any preview domains. Allow only the user's authorized email. "Access protected" must be tested in a signed-out/incognito session. This account-side Cloudflare configuration is not represented by \`wrangler.jsonc\` and cannot be guaranteed by a GitHub commit.

## Troubleshooting checkpoints

1. Cloudflare Workers & Pages → eu-v2-staging → **Deployments / Builds**. Confirm latest build was **triggered by a Git push** and displays \`draft/v2-dmm-companion\` with the intended SHA. Do not use Retry on an earlier \`main\` deployment to prove the new configuration.
2. Check logs for \`Workers staging build ready\` followed by \`Build source: draft/v2-dmm-companion @ <commit>\`.
3. Check the deployed website's \`/build-info.json\` through your authorized Cloudflare Access login.
4. If no build appeared, inspect Build trigger's \`branch_includes\`, build watch paths and whether the Git integration is enabled. Source pushes do not bypass Cloudflare-side trigger restrictions.
5. If a build failed, share the **error log**, not API keys, secret values, or passwords. A build failure is not proof that production GitHub Pages was changed.
6. If the site shows legacy v1, inspect which commit/branch was deployed before changing source code.
7. Only after staging works should you arrange a separate preview trigger if you plan to test \`preview/*\` branches. Don't use your ordinary \`main\` branch for extra staging previews.

### Relevant official documents
- https://developers.cloudflare.com/workers/ci-cd/builds/build-branches/
- https://developers.cloudflare.com/workers/ci-cd/builds/api-reference/
- https://developers.cloudflare.com/changelog/post/2025-06-10-default-env-vars/
- https://developers.cloudflare.com/workers/previews/examples/
