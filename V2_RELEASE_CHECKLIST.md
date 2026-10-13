# V2 production release — 2026-10-13

Authorized by James: back up V1, make V2 official, retain existing staging for V3.

## Preserved data and code

- V1 source: `backup/v1-2026-10-13`, commit `27762b29eb5a2d92ae6e449e9392e883f3832aaf`.
- V1 database `wwvpzyqcgwlwcetwlime` remains intact (five progress rows captured).
- Official V2 uses the existing `hkwmtjhgrskidaizamwy` database, retaining seven progress rows, 36 history records, approved source/lesson material, attempts, budgets and book metadata. No IDs or accounts are remapped.
- Private data backup: `Electrical-Workbench-V1-V2-Data-Backup-2026-10-13.zip`, SHA256 `15342b73294a45d5a675671cd29df5bbb9896eeb82f64f45fed0f7491de920a3`.
- Snapshot excludes auth credentials/API secrets and uploaded scan binaries. Both existing databases and uploaded storage remain intact.

## Destinations

- Official: https://theamazingbaha2.github.io/electrical-understanding/
- Cloudflare official Worker: `electrical-understanding`, branch `main`.
- V3 staging: https://eu-v2-staging.vanguardcorbett.workers.dev/, branch `draft/v2-dmm-companion`.
- V3 must not write official V2 data. Until a dedicated V3 backend is configured, staging runs local practice with cloud/paid AI disabled.

## Release gates

- [x] V1 source backup branch created before production changes.
- [x] V1 and V2 private application-data snapshot saved and checked.
- [x] Production frontend accepts only exact official hosts and rejects V3 staging.
- [x] Stable grading IDs, caches, accounts, raw scans, approvals, conflicts and histories preserved.
- [x] Local syntax/unit/build/deployment checks passed (207 tests).
- [ ] Exact release commit CI: all unit and eleven phone/desktop suites.
- [ ] Production Edge CORS deployed/read back for official origins; no paid calls.
- [ ] Auth Site URL/additional redirects include exact official URLs.
- [ ] Official frontend deployed and served commit verified.
- [ ] V3 staging isolated and served development commit verified.

Previously completed live sync and chapter pipeline checks remain valid; no new paid test is authorized or required for this release.

## Rollback

Keep both databases intact. To restore the V1 frontend, use the preserved V1 commit on main and its original V1 database configuration; never point V1 at the V2 schema or overwrite V2 progress. Prefer an earlier V2 release for V2 issues because it preserves current schema-3 documents. Data restore uses owner-scoped conflict-aware import or a reviewed revision-incrementing transaction; never blindly replace newer rows with this snapshot. Stop development access to V2 before any future V3 migration. Do not delete backup branches, databases, uploaded scans or histories.
