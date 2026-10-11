# Electrical Understanding

CETa learning workbench with lessons, interactive circuits, knowledge checks, and review scheduling.

## Publish the existing GitHub repository on Cloudflare

In the [Cloudflare dashboard](https://dash.cloudflare.com/), open **Workers & Pages → Create application → Import a repository** and select `TheAmazingBaha2/electrical-understanding`.

Use these settings:

| Setting | Value |
| --- | --- |
| Worker name | `electrical-understanding` |
| Production branch | `main` |
| Root directory | Repository root |
| Build command | `npm run build` |
| Deploy command | `npm run deploy` |

Cloudflare installs the dependencies from `package-lock.json`. The build copies only the seven public app assets into `dist/`. After the first successful deployment, open the HTTPS `workers.dev` URL shown by Cloudflare. Future pushes to `main` are deployed through the connected repository.

Alternatively, the button below starts Cloudflare's guided flow, which creates a **new copy of this repository** in your GitHub account:

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/TheAmazingBaha2/electrical-understanding)

## Local development and deployment

Use a supported Node.js LTS version (Node 24 recommended).

```sh
npm ci
npm run check
npm run dev
```

For a deployment from an authenticated development environment:

```sh
npm run deploy
```

The deployment URL depends on the Cloudflare account's Workers subdomain and is reported after deployment; this repository does not assume one.

## Phone and desktop access

Open the same deployed HTTPS URL on both devices. Bookmark it on desktop; on a phone, use the browser's **Add to Home Screen** option where available. Local practice progress stays in that browser. Sign in to the same study account on each device to use the app's existing cloud sync.

The app requires an internet connection for cloud sync and does not include an offline service worker.

## Cloudflare agent setup

Official instructions: <https://developers.cloudflare.com/agent-setup/prompt.md>.

Cloudflare skills and the MCP server are installed separately in the developer's agent environment, not in the website. MCP authentication requires network access to Cloudflare and account authorization. Installing skills or registering the server does not deploy this site.
