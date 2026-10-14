# Migration ledger and deletion gate

Run `node scripts/content/legacy-inventory.mjs` to reproduce `content/modular/legacy-inventory.json` from the actual runtime lesson inventory and existing preserved structured artifacts. The test compares the complete report, not just totals. The inventory uses the same revised BDMM runtime composition as app.js and includes original static, workshop, math, preserved active/archive and developer-published lessons.

Initial totals: **63 lessons, 542 questions, 195 activity entries, 167 source-reference dependencies, 24 safety-critical questions**. The preserved subset remains **33 lessons / 336 questions**. There are five bibliographic source candidates, one explicit edition label; these are not five independently verified editions. Duplicate concepts/taxonomy/conflicts are unclassified. The report records structured-analysis counts without copying storage paths, job/account identifiers, extracted source prose or learner records.

All **967** lesson/question/activity/reference mapping entries currently have `REQUIRES_REVIEW`, no targets and no credit. Each question key is qualified by its legacy lesson because short question IDs can be shared across lessons. Existing activity IDs are retained; activities without IDs have explicitly labeled renderer-position inventory keys, not newly invented graded identities. Actual workshop checkpoint IDs remain included. JSON-representation hashes and original module byte hashes preserve before/after comparison without rewriting legacy objects.

Zero lessons and zero evidence claims are migrated at this initial inventory milestone. Titles are topic candidates, not a reviewed taxonomy. Existing source analysis remains durable in its original repository artifact, excluded from public build assets. Raw PDFs are unavailable; source-derived meaning not represented by those artifacts cannot be reconstructed or certified. Preserve that limitation throughout extraction.

Next migrate evidence/source locators and reviewed canonical topics, then semantic blocks/objectives and independent assessments for Resistors and DMM. Create explicit equivalent-credit mappings only when meaning and rubric are unchanged. Changed assessments preserve history without unearned credit. Historical progress read tests retain every old answer key, review timestamp and unknown field through the unchanged existing progress migrator.

## Demolition remains blocked

The owner conditionally authorizes deletion of obsolete lesson content/code on the development branch after full mapping/source coverage, readable historical progress, usable pilots, schema/provenance/assessment/desktop/mobile tests, no dependent old routes, a pre-demolition tag, tested rollback and verified staging. This milestone satisfies none of the remaining content/pilot/route-deletion gates. `demolitionAllowed` is false. Never treat an inventory disposition or schema contract as completed migration.

Production data, stable V2/V1/history, shared simulation/assets, provenance and migration maps are outside demolition authorization. No raw-source cleanup is authorized here. Before any future cleanup report source locators, evidence coverage and unresolved gaps; do not claim unavailable source content was verified.

Rollback currently means reverting the additive modular-development files; existing lessons, storage and routes have no migration to undo. Before actual route replacement, test original backup plus new event/bundle round trips and preserve every conflict. A frontend rollback cannot restore a separately changed database.
