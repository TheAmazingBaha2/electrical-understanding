# Legacy archive and meaningful lesson overview redesign

**Scope:** \`draft/v2-dmm-companion\` only. No merges, production changes or Supabase schema changes.

## Lesson Overview: fewer, better cards
- Kept the approved **Overview, Learn, Interact, Quiz, Review** lesson tabs, plus the small-step Learn and Quiz layouts.
- Removed four redundant Overview cards that repeated "Learn / Interact / Quiz / Review" and merely explained the existing tabs.
- Each of the seven currently published lessons now opens with an **actual, subject-specific electrical question**, an SVG illustration relevant to its content, and a **revealable starting insight**. It also displays three source-grounded reference facts, the concrete lesson objective, and a context-specific equipment/safety consideration.
- Source grounding: EIM PreLab pp. 1–12 and DC 02 pp. 21–27 as previously supplied; existing L01–L05 topics and source material in \`lessons.js\`. Future lessons get a conservative general-purpose fallback, which must be improved before a new lesson is published.
- No score is awarded for expanding the starting insight; no question IDs, assessment logic or lesson progress records changed.

## CETa track: meaningful current cards and quiet legacy access
- The main CETa Preparation page now shows **Associate CET Study Guide** (9 units indexed / 22 chapter entries / 0 published guide companions) and **Competency & Exam Practice** (accurately marked planned) as the substantive cards.
- Removed the **Core CETa Course** card that was only a large link to Pilot Unit 1. The refreshed Core CETa sub-track remains **planned** in source catalog metadata, not shown as a false live course.
- Added a small **Legacy Lessons** link at the bottom of the CETa page, clearly separated from the main cards.
- The Legacy Lessons page contains the original L01–L05 lesson cards and progress; later lessons explicitly marked \`legacy:true\` or following archived Lxx IDs can join without altering the stored records. The old \`curriculum\` and \`core\` routes remain internal aliases to avoid breaking earlier navigation.
- Removed the prominent old **Pilot Unit 1** link in the persistent sidebar and the dashboard's "Resume L01" recommendation. The dashboard main action now points to the next available **EIM Basic** virtual lab, or to the Basic lab index after both virtual companions are passed.
- The dashboard still truthfully reports legacy achievements in its progress details, but the large hero ring now reflects currently available virtual lab companions instead of archived lessons.

## Stability and validation
- No changes to \`L01\`–\`L05\` IDs, Supabase table, pass criteria, source kit inventories or manual allocation policy.
- Cloudflare \`*.workers.dev\` preview still disables production Supabase writes, using browser-local trial progress.
- \`lesson-overviews.js\` is explicitly allowlisted in \`scripts/build.mjs\`, verified in deploy validation and syntax checks.
- GitHub Actions includes Node regression coverage and desktop/mobile browser tests for the archive, active CETa cards, lesson overview insight reveal, five tabs, physical-meter safety, and saved quiz responses.
- The source-review and progress guidance remain unchanged; no automatic content generation has been enabled.

## User check after Cloudflare finishes deployment
1. CETa tab: expect Study Guide and Exam Practice cards, plus small **Legacy Lessons** link at the bottom.
2. Legacy Lessons: expect L01–L05 with preserved local staging progress.
3. Basic lab → PreLab → Overview: expect a real 1 kΩ ±5% resistor scenario, value illustration, revealable key idea and practical details instead of four repeated tab names.
4. Learn/Interact/Quiz/Review should retain the small-step layout and existing answers.
5. On dashboard, main progress ring should reflect virtual EIM companions; completed earlier lessons remain visible as legacy evidence in detailed progress views.
