# Electrical Understanding v2.0 — Visual Dashboard Specification

**Status:** UI / data-design draft, not implemented or live.  
**Theme preference:** User favors **light blues and cyan**, and wants the brand/icon to show a **sequence of lightning bolts in distinguishable shades of yellow**. The chart system must stay legible on mobile and desktop.

## Design direction

- Primary shell: deep navy for visually calm contrast; panels at two slightly lighter navy levels.
- Main accents: pale ice blue **#E6F7FF**, sky blue **#83CFFF**, cyan **#35E0F2**, sea-glass **#6FE5E6**. Blue/cyan highlight active selections, interactive ranges, information and mastery.
- Brand/favicons: **three staggered lightning bolts** in yellow family (**#FFF0A6**, **#FFD84D**, **#F5AF27**) on dark navy; remain identifiable at 16×16 and as an installed-app icon. Avoid making every chart yellow.
- Good typography, balanced whitespace and compact but readable charts; no decorative animation that interferes with lessons. Motion reduced if OS requests it.
- Color cannot be the only signal for safety/grade/scan status. Include icons/labels and contrast checks.

## Dashboard navigation

**Desktop:** fixed/collapsible left navigation, "Resume" and Scan Inbox surfaced above fold, a generous content column with responsive 2–3-column charts.

**Mobile:** compact bottom or drawer navigation, easily reached "Resume", cards and charts stacked, controls sized for touch, no tiny axis labels, expandable per-sub-track drilldown.

**Overview:** Current lesson / what next; primary CETa readiness summary; per-track progress; today's reviews and source requests; weekly learning trend.

**Track page:** Separate overview per top-level track and sub-track. Example Track 3 shows only **Basic Electric Circuits** as current focus; Analog is staged after §2.1, FPGA and RP2040 waiting.

## Suggested chart modules

| Widget | What it actually measures | Display |
|---|---|---|
| Current syllabus coverage | Completed **released/assigned** material vs current bounded syllabus scope | Donut or progress ring with numerator/denominator and scope label |
| Track/sub-track progression | Units/chapters started, lessons completed, next ready, paused/unavailable | Stacked bars and sub-track cards; distinguish waiting from failure |
| Skills and competency evidence | Per-skill understanding, calculations, hands-on verification, retention, and date last demonstrated | Heatmap/matrix plus optional radar; accessible tabular view |
| Quiz performance | Attempted assessed questions, first-try accuracy, latest score and improvement over time | Line/area trend, clearly separating diagnostic baseline from ongoing results |
| Study momentum | Days studied, lessons/reviews completed, hands-on experiments finished | Calendar heatmap + weekly activity line |
| Review queue | Due today, next 7 days, overdue by age and topic | Urgency chart with linked exercises |
| Hardware proficiency | Simulated vs built vs measured vs troubleshot by EIM manual; experiments completed | Multiple-step lab progress cards |
| Source readiness | Verified page coverage, current requested scans, uploads in review, chapters awaiting source | Small actionable Scan Inbox, not an intimidating blank completion chart |
| Lesson pipeline health | Last six-hour check, latest published, queued drafts, validation failures, cost status | Quiet status strip with timestamps and actionable error text |

### Avoid misleading "overall completion" percentages

More original lessons may be created as the course expands, so completion percentages can shrink when content is added. Separate:
1. **Known / assigned curriculum progress** (as-of date and current published+planned scope)
2. **Study hours and activity milestones** (monotonic historical facts)
3. **Skill mastery / retention** (can improve or decay with new evidence)
4. **Exam readiness** (only from qualified CETa-aligned evidence; never infer a pass prediction from arbitrary lessons).

Do not count unopened books, staged Analog, queued FPGA/RP2040, or units awaiting book delivery as failures or overdue work. Change in denominator must be explained ("3 new lessons were added this week").

The previous **40-question CETa diagnostic** may seed initial weak-area categories, but should be labeled informal, approximate, and dated. Do not invent progress for lessons that have not yet been attempted or pretend its rough score came from the website.

## User interaction and drilldowns

- Tap a chart slice/bar/heatmap cell to open a filtered list of the exact lessons or results included in it.
- Hover on desktop or tap on mobile for value, denominator, timeframe, how score was calculated and link to resume.
- "What should I study next?" uses only current **active** sub-track eligibility and pending due reviews, balancing readiness and learner choice.
- Independent per-source progress plus cross-source **skill mastery**: meeting a skill in CETa, a book, and lab contributes labeled evidence to the matrix but does not auto-complete the three separate exercises.
- Notes and actual measurements are private and cloud-synced; generated content stays separate from evidence.
- Charts must remain informative when no user data exists: use "Not started / no results yet" states rather than invented percentages or random demo data in production.

## Backend fields anticipated

\`tracks\`, \`subtracks\`, \`units\`, \`lessons\`, \`lesson_versions\`, \`lesson_progress\`, \`question_attempts\`, \`concept_evidence\`, \`lab_experiments\`, \`lab_measurements\`, \`review_schedule\`, \`source_sections\`, \`scan_requests\`, \`content_generation_jobs\`, \`audit_log\`, all authenticated with appropriate access policies. Schema names are illustrative and must be reviewed against the existing Supabase project **before migration**.

Refresh learner-facing stats after saved responses, uploads, completions, or sync. Show last sync timestamp and error/offline state. Validate screen-reader labels, reduced-motion behavior, desktop/mobile breakpoints and chart math.
