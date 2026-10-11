# v2 UI refresh — Aurora Ice, paths dropdown and guided study tabs

**Implemented on \`draft/v2-dmm-companion\` (October 11, 2026).** Not merged to \`main\`. Cloudflare staging automatically deploys pushes if \`eu-v2-staging\` remains connected to the correct branch; browser sign-in and deployment status require independent confirmation in Cloudflare.

## What changed

- **Course Paths dropdown** in dashboard hero: shows all three top-level tracks and their independent sub-tracks. Opening the menu does not navigate. A clicked sub-track item opens its actual section. Escape and outside click dismiss the menu.
- **Persistent horizontal app tabs:** Dashboard, CETa, Textbooks, Laboratory, Reviews, Scan Inbox. Sidebar remains an additional navigation option. On phones, top tabs scroll horizontally.
- **Five lesson tabs:** Overview / Learn / Interact / Quiz / Review. Accessible tablist with arrow-key navigation and selected state.
- **Small study portions:** New EIM source-backed Learn pages show **one of five concept cards at a time**, followed by **one of five interactive activities at a time**. The Quiz section shows **one question at a time** with a question-number grid; Review lists question results and supports jumping back to a question. Older L01–L05 remain unchanged in their content and answer IDs, but use the new tab structure.
- **Real charts:** Three current-scope progress donut charts (CETa Pilot 0–5, virtual EIM companions 0–2, and 0–7 combined) plus a question-state pie chart (correct/incorrect/not attempted) built exclusively from existing answer records. Unreleased textbook content does not inflate denominators.
- **Aurora Ice theme:** crisp ice-white headings, translucent frosted navy/cyan cards, luminous gradients, restrained frosted highlights, ice-blue panel boundaries, richer progress rings and chart legend. Yellow multi-bolt icon remains unchanged.
- **Real SVG visual mini-labs:** circuit diagrams for series/voltage-division/parallel/open-branch exercises, dynamically updating resistor-color graphics, a simulated DMM dial/lead arrangement with unsafe indication, and a clickable breadboard allowing two probe selections. Source-independent original educational illustrations; **not** representations of verified kit hardware dimensions/ratings.
- **Four ungraded prediction minigames:** select the expected direction of change before comparing the explanation in series, voltage-divider, parallel resistance and open-fault activities. Ungraded concept checks never auto-complete a physical lab.
- **Tests and build:** Added \`lesson-tabs.js\`, \`lesson-view.js\`, \`lab-visuals.js\`, updated \`lab-widgets.js\`, \`app.js\`, \`v2-panels.js\`, \`styles.css\`, \`index.html\`, static asset allowlist and tests. GitHub Actions includes Node checks, build validation, headless Chromium desktop+phone visual smoke tests, screenshot artifacts, tab/content separation and local progress persistence.

## Privacy & safety

- Existing \`L01\`–\`L05\` IDs, \`lesson_progress\` schema and quiz answers remain intact. No database changes or migrations were made.
- Existing \`workers.dev\` / \`pages.dev\` production-Supabase-sync exclusion stays in place. Staging test progress is browser-local and cannot be used to assess desktop/phone sync until separate staging backend is configured.
- Virtual circuit visuals and feedback are educational. Unsafe meter hookups remain flagged. No automatic claim of physical experiment completion.
- No Cloudflare account Access policies or trigger settings were changed by these GitHub edits; private staging Access still must be confirmed separately.
- Do not merge draft PR or change production website without explicit approval.

## Later enhancement ideas

- Truly draggable instrument probes, responsive breadboard wire-routing and game-like fault investigation with checkpoints could be extended with Codex/Work after this first SVG upgrade is reviewed.
- Add more verified audio/electrical equipment 3D/vector renderings and instruments only as relevant sources are available.
- Add separate test Supabase project when staging cross-device progress synchronization is desired.

**Verification steps:** open the current \`eu-v2-staging\` worker's site after its Git-triggered deployment, use Course Paths dropdown -> Basic Electric Circuits -> PreLab -> Learn -> step through concept cards -> Interact -> try breadboard holes and meter mode -> Quiz -> submit a check -> Review -> return to Quiz. Navigate back to Dashboard to inspect three donut charts and the answer pie. Check phone and desktop. Use incognito to verify Cloudflare Access is protecting staging.
