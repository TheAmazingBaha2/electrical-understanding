# Single-level dashboard and subsection bars — 2026-10-13

User follow-up supersedes the previous nested book/chapter/lesson disclosure design. Preserve overall chapter pies; replace only subsection/lesson pies with horizontal bars.

Books now have static compact headings. Chapters are the only expandable level, exposing lesson descriptions, reading references, bars, written correct/attempted/mastered counts and study/review actions together. Bars use the existing shared current-check totals and cyan correct / amber needs-review / blue unanswered segments. Accessible progress values describe each segment. Source contents use the same reference → bar → counts order. Overall chapter pies, sidebar widths and navigation remain intact.

No lesson/question IDs, source evidence, answers, review dates, cloud records, approvals, backend code or paid calls changed. No content regeneration.

Local verification: syntax checks, all 206 unit/contract tests, static build, deployment allowlist validation and diff whitespace checks pass. Updated existing desktop/mobile browser suites cover one disclosure level, retained chapter pies, visible subsection bars, reference/bar/count order, lesson routes, 44px phone actions and overflow at 320/390/1440px. Local preview is unavailable under the Sites managed-preview rules because no control-browser skill is exposed; complete browser verification runs in GitHub CI. Staging promotion is gated on complete CI for the exact pushed commit. Production remains outside this update.
