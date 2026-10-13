# Compact dashboard and mobile navigation — 2026-10-13

User requested smaller phone cards, charts nested within collapsible book/title boxes, expandable lesson charts, dashboard navigation instead of the top section bar, and TBD for sections without graded exercises.

Implemented native book → chapter → lesson disclosures. Large charts and study actions are inside expanded panels; collapsed lesson descriptions take one line, while reference pages remain between description and progress. Section links occupy a compact responsive grid. Account/sync and the sidebar/mobile menu remain accessible, with one top Dashboard return. Published inventory and shared grading totals determine section availability. Review can show scheduled checks; its broader format remains undecided. No source, question, answer, review-date, cloud schema or paid prompt changes.

Verification: syntax checks, 206 unit/contract tests, build and deployment validation. Browser checks cover 320/390/1440px navigation, keyboard disclosures, hidden charts, touch target size, page overflow and existing lesson/workshop/quiz/sync flows using local or mocked services. No paid API calls or real learner writes. Staging publication is gated on the exact commit's complete CI; production is outside this change.

Educational content and missing page references are unchanged. No new design questions are blocking this requested presentation change.

CI follow-up: the first run exposed a race in the new test navigation helper: its position check sampled the mobile drawer during its closing transition. Navigation now checks the drawer's explicit open state; Playwright still performs normal visible, stable button clicks. The application itself was not changed for this test race.
