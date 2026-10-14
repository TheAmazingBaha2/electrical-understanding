# Durable V3 checkpoint

Branch: draft/v2-dmm-companion. Verified upstream base: 9c63daf8585f110c5714e0315c70659e1e75f97d. Local checkout reconstructed with exact upstream tree ac878d3ec33f2f0aed3a206d5fc7c9a890dc8bcd; upstream Git history is available through the connector, shell proxy unavailable.

Phase 1 implemented locally: preserved 33 lessons/336 question IDs; removed active authoring navigation/imports/bundles; disabled tutor calls; prepared backend tombstones; recorded current production storage/DB/security audit and exact pending cleanup manifest. Tests: 23 test files pass with EU_SYNTHETIC_SERIES=/tmp/eu-synthetic-series.json (generated from existing author-chapter3.py); check/build/allowlist pass. Browser/server sockets blocked locally. No production/V1 changes, paid calls, deployment, raw deletion or schema mutation.

Next: implement controlled package schema/validator/integration and reusable widget registry; shared DC circuit and adaptive local project shell; add browser acceptance suite for repository lessons and retired entry points; run applicable verification, publish tested branch commits through GitHub connector and inspect exact-commit CI before any staging promotion. Keep this checkpoint current with commit SHAs, defects and actual results.

Approval gates: any production gateway/policy change, exact raw deletion, empty bucket retirement, new development Supabase costs, paid tutor enablement, behavior/grading changes to existing widgets, production release. Review docs/v3/PHASE1_AUDIT.md and production plan before crossing gates. No approvals obtained for those gates.
