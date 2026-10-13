# Electronic Learning Workbench V2

Official personal electronics learning site: https://theamazingbaha2.github.io/electrical-understanding/

`main` holds official V2. Its Cloudflare Worker is `electrical-understanding`; build with `npm run build`, deploy with `npx wrangler deploy`. Root assets also support the existing GitHub Pages branch deployment. Only exact official hosts can connect to the current private learning database.

The unchanged staging URL https://eu-v2-staging.vanguardcorbett.workers.dev/ and `draft/v2-dmm-companion` branch are reserved for V3 development. Development must not write official learning records; cloud/AI testing requires a separately configured backend.

V1 source is preserved on `backup/v1-2026-10-13`. Both prior databases and source uploads remain intact. Release backup details and rollback procedures are in V2_RELEASE_CHECKLIST.md.

Use `npm run check`, `npm test`, `npm run build`, and `node tests/deploy.validation.mjs`. Complete CI must pass on the exact source commit before publishing. Backend changes require separate deployment and readback. Tests use local or mocked services, never paid inference or real learner-progress writes.
