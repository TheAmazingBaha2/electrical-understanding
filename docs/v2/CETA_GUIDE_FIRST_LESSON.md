# Associate CET Study Guide — First Active Companion

**Status:** Original companion lesson \`CETA-G03-01\` implemented in \`draft/v2-dmm-companion\` (2026-10-11). Production branch not modified.  
**Source confirmed:** The two photographs of the user's study guide table of contents show **Unit 2 — DC Electronics**, **Chapter 3 — Basic Math used in Electronic Service & Decibels**, starting on **printed page 16**. Subtopic list includes powers of ten. The two TOC photographs establish the manual's **nine units and 22 chapters**, not the full content of any chapter.

## First published teaching scope (narrow by design)

**CETA-G03-01 — Engineering Prefixes: Think in Powers of Ten**:
- Five original, small-step concepts: SI prefixes; positive/negative powers of ten; scientific notation; conversion to base units; unit sanity check in an ideal low-voltage Ohm's-law example.
- Five working SVG mini-labs in \`ceta-widgets.js\`: prefix ladder, exponent shift, notation equivalents, component unit conversions, modeled current/dissipation.
- Ten original scored questions in \`ceta-lessons.js\`, with numeric, multiple-choice and a written rubric exercise, including a safety-critical unit/rating question. This follows the same **Overview → Learn → Interact → Quiz → Review** tab layout as the lab and textbook tracks.
- Source-independent instructions throughout: the lesson's wording and examples are original, aligned with standard SI definitions and mathematics. **No content is attributed to unseen study-guide prose.** This is a powers-of-ten companion, **not** the entirety of Chapter 3.

### Safe course boundaries
- The guide's 22-chapter map remains visible. Only one Chapter 3 topic has a live companion; all other chapter topic lessons remain **indexed, not published**.
- New progress records use stable key \`CETA-G03-01\` and existing \`lesson_progress\` structure; they do not overwrite original archived \`L01–L05\`, EIM basic \`EIM-BEC-*\` or textbook \`BDMM-*\` records.
- Independent guide completion does not unlock or block another track.
- \`*.workers.dev\` and \`*.pages.dev\` staging remain device-local with **production Supabase sync disabled**. Separate staging backend needed for cross-device trial sync.
- All physical hookup examples are hypothetical; calculate but do not assume rating or electrical safety. No mains exercises or exposure to energized equipment.
- No library scans or requests have been added. Future source-specific chapters will prompt for relevant pages only when genuinely necessary. **Do not request the whole book merely to extend the table of contents.**
- The core CETa rebuild remains planned and old L01–L05 remain in the low-key **Legacy Lessons** archive. Competency & Exam Practice is still planned. Published guide lessons are a separate, navigable sub-track.

## Validation and release
- \`tests/v2-smoke.test.mjs\` covers TOC fidelity, 10 questions, five interactive designs, and correctly isolated progress aggregation.
- \`tests/browser-smoke.mjs\` checks desktop and phone UI, Study Guide navigation, actual SVG conversion, answer storage, textbook and lab records retained.
- \`scripts/build.mjs\` allowlists \`ceta-lessons.js\` and \`ceta-widgets.js\` as public website assets. No PDFs, textbook scans or credentials are published.
- The automated draft-branch build triggers staging updates in Cloudflare. GitHub test success does **not** verify that Cloudflare Access has been enabled or a deployed URL is serving this specific commit.

**Suggested learner trial:** CETa → Associate CET Study Guide → Unit 2 Chapter 3 foundation lesson → one concept per Learn step → Interact (five) → Quiz (ten) → Review. Try kΩ ↔ Ω and mA ↔ A, then look for your independent CETa Guide dashboard ring.

## Next scope decisions

Two supported routes, requiring no immediate manual scan:
1. Develop another **original teaching slice** covering Chapter 3's next listed topics (Ohm's Law or Power) but transparently label it as original topic training until the chapter pages are provided.
2. When the learner chooses **source-exact chapter companion coverage**, request only the chosen chapter's relevant pages (starting Chapter 3 printed p. 16 and up to—but not including—Chapter 4 p. 25 as a suggested page range), along with any figures necessary, before claiming source-specific worked examples.

Never copy or publish the user's copyrighted study-guide pages.
