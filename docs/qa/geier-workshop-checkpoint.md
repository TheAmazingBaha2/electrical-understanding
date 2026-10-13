# Geier workshop companions — October 13, 2026

James authorized building the proposed Chapter 2 workshop series, keeping book → chapter → workshop dropdowns and the existing dashboard/five-tab engine. Each workshop must mix task-appropriate presentation methods, with flexible length and counts. He also requested additions from the earlier Chapter 6 first major section, expecting that chapter to grow later.

## Sources and boundaries

- Recovered the user's six-page `Scan_20261010_142800_optimized.pdf`, contents ix–xiv. Reviewed page images to establish all 15 chapter headings and starts. Chapter 6 is **Working Your Weapons: Using Test Equipment**, not a chapter titled Digital Multimeter.
- Reviewed `Book 10-13-26.pdf`, Chapter 2 **Setting Up Shop: Tools of the Trade**, printed pp.5–47. Text was extracted with local OCR and images inspected; some photographed edges are cropped/curved. Do not infer exact lost text. No source images or book passages are published.
- Recovered/reviewed `Scan_20261010_150044_optimized.pdf`, seven scanned pages, Chapter 6 DMM pp.97–103. The page 103 ESR opening is outside this authored addition. No unseen scope/other Chapter 6 sections are taught or claimed covered.
- Manufacturer/safety supplements clarify scope acquisition/grounding, true-RMS meter limits, instrument-dependent open indications, soldering heat transfer and flux fumes. Verified official Tektronix, Fluke, Hakko and HSE material; references are linked in the tool reference. Stale prices and universal product/solvent claims are not assessment targets.

## Content and structure

`geier-catalog.js` provides the supplied 15-chapter list. `geier-workshops.js` contains independent explanations, cases, citations and a searchable 30-card reference.

Chapter 2: GEIER-C2-W01–W10 cover bench layout, evidence/tool selection, resolution/accuracy, waveform reading, scope limits/probes, solder/removal preparation, documentation/handling, supplies, specialized equipment and an integrated preparation case. GEIER-C2-W11 is the final concise summary with ten takeaways and twelve selectable checks. Counts are this version's design, not future quotas. Chapter 2 totals: 11 entries, 66 quiz questions and 26 required activity checkpoints.

Chapter 6: original BDMM-01 and BDMM-02 remain byte-for-byte unchanged. New independent GEIER-C6-W03–W05 add AC/RMS interpretation; unpowered resistance/continuity/diode reasoning; and series current preparation/burden. Additions total 24 selectable questions and 11 activity checkpoints. The original introductory lessons retain their old progress/availability rules; the new workshops are independently available. Both chapter menu and dashboard disclose partial Chapter 6 scope. There is no Chapter 6 final summary or invented coverage. Future subsection uploads append new stable IDs to this same chapter. Chapter-next navigation stays within its source chapter, including BDMM-02 → the new AC workshop.

Every ordinary workshop combines at least two presentation kinds. Local reviewed renderers support bench-layout controls, inspection selections, matching, reorderable steps, connected cases, instrument simulations and reference search. Workshops are self-paced, without a minutes field or length/count validator. No essays are required. Summary is deliberately short and exempt from activity requirements.

Dashboard/menu use the existing shared source inventory and curriculum metadata. New chapter pies count real quiz IDs plus required activity IDs. A checkpoint must be checked and saved; reference browsing is optional and never mastery. Required activity completion plus existing graded-quiz/safety criteria govern workshop completion. All demonstrations are virtual; no hands-on competency certification is implied.

## Preservation and future authoring

No production settings, migrations, auth/RLS/storage policies, financial controls, model dispatch, raw sources or real learner data are changed. No paid provider call is used. New activity results are additive `workshopChecks` inside the existing lesson progress JSON, transported through the same Web Locks, backup, owner-isolation, revision checks and whole-document conflict handling. Unknown/stale activity IDs do not affect current totals. Old question IDs, answers, review dates and original lessons stay intact.

AGENTS.md and the teaching/design contract record mixed-method, flexible-length workshops and partial-parent-chapter rules for future chat work. Shared paid teaching contract v4 conveys the same educational intent using its existing supported schema/simulators, never arbitrary executable widgets. Existing provider bounds remain technical constraints, not desired lesson lengths. Backend logic/validation and paid recovery stages are unchanged; only the shared instructions change.

## Verification

203 local unit tests pass, including current numerical models, blocked unsafe preparation, validator rejection of incomplete/wrong activities, all authored correct activity configurations, stable source placement, final summary ordering, same-chapter next routing, activity/quiz completion and weighted dashboard totals. Existing storage import/export, mocked two-device cloud synchronization and concurrent-copy conflict handling preserve checkpoint values alongside old answers/review dates.

Desktop/phone Chromium verification passes every new required activity and all existing affected suites (source navigation/private C3, original lab/DMM workbenches, persistence, AI lab/chat, scan controls, math and adaptive lessons). New browser tests exercise wrong/correct attempts, reload/control recovery, reference search on Overview, all ordering/case widgets, quiz completion, chapter return, old BDMM answer preservation and responsive widths. Cloud/provider services are mocked or blocked; no real progress is written. Internal screenshots inspected for bench, waveform and ordering views. Syntax/build/allowlisted-module and isolated staging deployment validation pass.

The dedicated staging build must still pass complete CI on the exact pushed commit before frontend promotion. Changed staging Edge source must be deployed and read back byte-for-byte independently; frontend publication does not deploy it. Verify the live build-info SHA and new module availability before reporting publication. Production stays untouched.
