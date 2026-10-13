# Compact card sizing — 2026-10-13

User requested card heights around 60% of the prior layout and an arrow division about half as wide. Reduced category/book/chapter header padding and gaps, shortened category descriptions, and targeted 54px phone category headers. Arrow columns are now 44px instead of 72px desktop / 76px phone, preserving independent controls and phone tap targets. Long book titles wrap without clipping. Native expansion, title navigation, session state, category order, pies, bars and saved learning data remain unchanged.

Local syntax, 206 unit/contract tests, static build, deployment validation and whitespace checks pass. Existing dashboard browser checks now verify 44px nonoverlapping arrow controls, compact phone header height, expansion versus navigation, keyboard behavior and 320/390/1440px overflow. Complete eleven-suite CI on the exact pushed commit remains required before staging promotion. No backend changes, paid calls or production deployment.
