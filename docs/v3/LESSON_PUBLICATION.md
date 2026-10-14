# Lesson packages v1

ChatGPT authors lessons; the workbench teaches them. Export an explicitly owner-approved JSON artifact matching `content/lesson-package.schema.json`. Repository tools never fetch ChatGPT conversations and there is no website upload/generation service. The schema defines stable lesson/question IDs, source book/edition/chapter/printed pages, evidence references, curriculum/dashboard placement, objectives, sections, worked steps, discussion/prediction checkpoints, multiple activities and versioned widget references/configuration, quiz answers/rubrics/tolerances/safety flags, prerequisites and review rules. Counts are flexible. Plain text is escaped; no package HTML, JavaScript or arbitrary code is accepted.

1. Owner reviews and approves the completed artifact in ChatGPT.
2. Developer receives the supplied file and runs `node scripts/content/publish-package.mjs /path/to/approved.json`.
3. Deterministic validator rejects malformed structure, unresolved references/prerequisites, duplicate IDs, unsupported grading/review rules and unsupported widget versions/configurations. Existing stable IDs cannot be overwritten through this importer. Workshop/shared-circuit entries currently require reviewed native adapters; their registry presence is not a promise of package configuration support.
4. Review `content/packages` and `published-lessons.js` diff. Run checks/tests/build. Preview in isolated V3 staging only after exact-commit CI passes.
5. Owner tests five tabs, interactions, references, grading and phone behavior. Approve a future release separately.

Approval metadata is an attestation supplied with the artifact, not authentication or proof of electrical correctness. Deterministic checks cannot certify textbook interpretation, every safety instruction or pedagogical quality. Human technical review is mandatory. Supported quiz types are existing choice/number/reflection; safety-critical checks cannot be self-certified reflections. Review behavior remains 80% plus all safety checks, missed 1 day, first success 7 days, retry success 21 days. New packages do not alter old results.

Preserved approvals are a separate compatibility archive. `node scripts/content/preserve-approved.mjs` reproduces `approved-lessons.js` exactly from the original structured export and inventory fingerprints. Never run new-package validation to silently rewrite old content or discard unknown fields. Source export is not a public asset; only renderable approved lesson output is allowlisted. No private scan or owner/progress identity is published.

## Widget reuse and refinement

Search `searchWidgets`/`widgetFor` first; check capabilities, version, config, limits and compatibility; configure or propose a reusable enhancement before building replacements. Registry lookup is local and deterministic. Existing lessons continue through their original adapters. `content/widget-improvements.json` is the developer-managed queue for owner suggestions, bugs, capabilities, priority, proposed changes, affected lessons/projects, compatibility and test requirements. Critical safety/correctness comes first; batch ordinary work. Any behavior/grading/compatibility change requires owner approval and a version decision, with old graded results retained.

## Desktop and mobile modules

Schema 1 packages and historical practical/quiz IDs remain unchanged. New schema 2 packages use `content/lesson-package-v2.schema.json`; read [DESKTOP_MOBILE_ARCHITECTURE.md](DESKTOP_MOBILE_ARCHITECTURE.md) for independently versioned `labs.desktop` and `labs.mobile`, deterministic assessments and the owner-approved `either` completion policy. Both module activity IDs must be distinct from common quiz and other activity IDs. The same developer publication command validates both versions; no website authoring or automatic ChatGPT access is added. Preview both modules with the device-local Lab presentation override before owner approval. Do not retrofit approved lessons or reinterpret historical workshop scores.
