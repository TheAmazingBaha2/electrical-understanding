# Dashboard categories and title-card navigation — 2026-10-13

User requested books as subdivisions of study categories, removal of Browse contents buttons, right-side arrows and whole-card navigation, category descriptions, and order Textbook Companions → Labs → Exam Prep → Math → Review.

Dashboard now has static category containers with brief descriptions and clickable category headings. Book/guide title cards are subdivisions inside their respective category and perform the old Browse contents navigation. Right-side navigation arrows distinguish route cards from chapter disclosure chevrons. Chapters remain the only expandable level; their overall pies and lesson bars stay intact. Empty categories show TBD, and future approved sources populate the matching category through the shared inventory. Sidebar uses the same category order and labels and retains persistent resizing.

No curriculum identities, saved answers, review dates, source attribution, human approvals, backend schema/code or paid generation changed.

Local verification: syntax, all 206 unit/contract tests, build, deployment allowlist and whitespace checks pass. Updated existing dashboard browser suite checks category and sidebar order, nested source membership, title-card routing, absent Browse contents buttons, arrows, one disclosure level, existing bars/pies, phone targets and responsive overflow. Source suite uses the new Exam Prep breadcrumb label. Local preview unavailable without the control-browser skill; complete eleven-suite Chromium verification runs in GitHub CI before staging promotion. Production remains outside this update.
