# Mathematics Companion: dependent fourth track (staging)

## Design

A **flat fourth track with no subtracks**, visible in desktop/mobile navigation, the course-path menu, and the dashboard. Its lesson list follows the underlying CETa, textbook and hands-on source lessons. Mathematics topics unlock whenever at least one mapped source lesson is itself reachable, even before that source lesson is completed. This lets a learner study the math when they first encounter the concept. Math completion is never a prerequisite for the other three tracks.

Cross-links appear in each related source lesson: "Math behind this topic". The Math view also links back to the underlying theory, textbook, or lab lesson, with unavailable sources disabled. The shared Review queue includes math questions when due.

## Currently authored original companions

| Stable ID | Topic | Related published source lessons |
|---|---|---|
| MATH-001 | Scale, prefixes, powers of ten | CETA-G03-01, L01 |
| MATH-002 | Rearranging Ohm's law and verifying units | L03, EIM-BEC-PRELAB |
| MATH-003 | Series and parallel networks, ratios, equivalent resistance | L04, EIM-BEC-DC02 |
| MATH-004 | Meter tolerance, relative error and display resolution | BDMM-01, BDMM-02, L02 |
| MATH-005 | Power, time, energy, efficiency | L01, L03, EIM-BEC-DC02 |
| MATH-006 | Frequency, period, RC cutoff | L05 |

Each has four concept stages, two or three math explorers with live equations and substitutions (13 explorers total), and six individually graded checks. Worked examples are independently authored as math enrichment, not transcribed from a textbook scan or presented as verified source-derived claims.

Existing source IDs, Math IDs and every question ID are permanent: never rename IDs when moving pages or redesigning layouts. Add new IDs when introducing new concepts. The initial set has 36 unique math question IDs.

## Progress and dependency rules

- Source dependency is based on the **existing source lesson unlock function**, not arbitrary elapsed time, page visits or AI predictions. MATH-003 follows L04 or EIM-BEC-DC02 once accessible; MATH-006 follows L05.
- Unlocking math does not require other math lessons to pass. Completing math does not change the gating of source lessons.
- Math progress is saved under `MATH-...` records through the existing `ProgressStore` and its conflict-aware cloud sync; no new Supabase tables, production secrets or schema migrations.
- Dashboard math progress counts only companions currently reachable. The overall chart includes available math checks, not planned or locked material.
- All sliders and calculations execute locally and offline. No AI token spending is needed to read math lessons, explore examples, or submit quizzes.

## Expanding math as the rest of the curriculum grows

When approving a new chapter, scanned lesson or lab unit, **review its equations, prerequisites and units** alongside the theory. If an existing companion already covers that mathematics, add the new source's permanent lesson ID to its `sourceLessonIds` array; it automatically appears as a related entry and becomes reachable under the same gate.

If the new material needs a distinct math idea (for example, phasors, logarithmic decibels, impedance or transistor curves), author a **new reviewed math lesson with a new permanent MATH-### ID**, explanatory worked steps, a live explorer and numerically checked quiz items. Record its links to the released source lessons; do not silently rewrite a previous math lesson or grading rule. The math track's view derives the available list and progress counts from the source links, so it updates as those source lessons unlock.

Scan-to-lesson generation currently creates **private, ungraded drafts only**. It does not auto-publish generated math, assign course math scores, or run Astra/Sol just to update the math track. Integrating scan interpretation with math companion suggestions can be considered in a later reviewed workflow; never spend API credits automatically or publish questionable equations without human approval.

## Test acceptance

GitHub CI includes source, layout, progress and responsive browser coverage:
- `tests/math-track.test.mjs`: unique IDs, correct source links, stage-based unlocking, preservation of L01-L05, independent progress, and offline explorer contract.
- `tests/math-browser.mjs`: source-math navigation, phone size, real numeric input, slider recalculation, persisted MATH-001 answer, and absence of writes to original lesson IDs.
- `tests/v2-smoke.test.mjs` and `tests/browser-smoke.mjs`: four tracks and corresponding progress charts plus all prior legacy, book and lab tests.

Staging only: GitHub development branch `draft/v2-dmm-companion`. Production GitHub Pages and production Supabase remain unchanged.
