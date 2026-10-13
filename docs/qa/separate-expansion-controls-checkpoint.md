# Separate navigation and expansion controls — 2026-10-13

User reported that the category/book arrows navigated rather than expanded and requested a larger separate arrow area to avoid mis-tapping the contents link.

Each category and book header now uses two sibling native buttons. The title/description retains contents navigation. The right-hand arrow button has a visibly divided 72px desktop / 76px phone area and expands/collapses only its associated panel, with aria-expanded, aria-controls and an action label. No nested interactive elements or shared redirect handler. Session-only UI state preserves category/book expansion across rerenders and navigation without writing learner data. Chapter arrows also have larger target areas; lesson rows stay flat, overall chapter pies and subsection bars stay intact.

No lesson identities, quiz answers, workshop checks, source references, review dates, cloud records, paid requests or backend changes.

Local verification: syntax, 206 unit/contract tests, static build, deployment validation and whitespace checks pass. Updated dashboard browser suite verifies arrow dimensions and nonoverlapping targets, category/book collapse without route changes, Enter/Space expansion, retained pie/bar rendering, title navigation and 320/390/1440px overflow. Existing eleven-suite CI must pass on the exact pushed commit before staging frontend promotion. Local preview remains unavailable under the managed Sites preview rules without control-browser. Production is outside this update.
