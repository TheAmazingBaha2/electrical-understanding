# Electronic Learning Workbench V2 — Production Release Checklist

> **Status:** Two-group layout implemented on the V2 staging development branch as of 2026-10-12; production site remains unchanged.
> **Production activation:** Only after explicit user approval for the V2 production release. This staging preview reorganizes navigation and display, not content, lesson IDs, or user answers.

## Required: Split Legacy Lessons into two peer groups

When preparing the V2 production release, make **Legacy Lessons** display two distinct, equally accessible groups (cards or tabs side by side on desktop; stacked or segmented on mobile):

1. **Legacy Group 1 — Original CETa Pilot**: preserve existing L01–L05 pilot lessons, their experiments, IDs, answers and existing progress.
2. **Legacy Group 2 — Original / Unreferenced Lessons**: move all other lessons that have no *verified source attribution* or page-backed reference for the subject matter taught. Preserve all their instructional content and interaction functionality; label them as original teaching or unverified source context, never imply they were extracted from a book.

**Definition of properly referenced:** verified publication/edition where known; appropriate printed pages or a verifiable specific section, and evidence that the actual content used was reviewed. A reading suggestion, a title without page references, a topic-index or table-of-contents page, or a vague `references` array does **not** qualify by itself. Don't manufacture citations merely to keep a lesson in an active track. For source-independent content with no book reference, classify as unreferenced even when technically sound.

**Initial audit candidates (not automatic migration decisions):**
- L01–L05 remain Group 1, even if their generic recommended-reading references mention a textbook.
- `math-lessons.js`: explicitly source-independent mathematics companions; audit for Group 2. If their removal would empty the Mathematics track, leave a clear link from Mathematics to the legacy group or supply *new*, genuinely sourced replacements first; do not erase accessible math practice.
- `ceta-lessons.js` / `CETA-G03-01`: existing companion was written against a Chapter 3 table-of-contents topic and not scanned chapter prose. A TOC page number is not a page citation to the lesson's actual instructional substance. Audit for Group 2 unless subsequently supported by verified pages.
- `book-lessons.js` (Geier DMM, Chapter 6 pp. 97–99) and `lab-lessons.js` (EIM PreLab pp. 1–12, DC 02 pp. 21–27) have specific known source ranges: check provenance and retain in source tracks when verified; no automatic grandfathering.
- Any subsequently generated, manually approved lesson whose book/page metadata is absent, invented, vague, or unverified also belongs in the unreferenced group until corrected.

### Release implementation rules

- Implement the classification by **presentation and stable archival metadata**, not by regenerating lessons or changing their primary IDs. Keep question IDs, answer records, review dates, existing progress keys, and cloud-sync behavior intact.
- Exclude archived unreferenced items from active **source-specific** lists and misleading source-coverage counters, but preserve the ability to launch the original lessons from the second Legacy group. Do not show a source citation as verified where there isn't one.
- Retain the separate **Review & Reinforcement** track. Do not merge unreferenced legacy courses into reinforcement; that track is for source-grounded alternative perspectives and practice.
- On small screens, both Legacy groups must be clearly named, navigable and accessible without horizontal overflow.
- Before changing production, back up progress, list every ID being moved, and compare pre/post counts and saved review due dates.
- Test existing lesson and question links, saved scores, completion state, unlock dependencies, cross-track math links, spaced review, and phone/desktop synchronization.
- Never reinitialize user progress or change private Supabase production storage when reorganizing the UI. Explicit user approval is required for any database migration or production changes.

### Release sign-off

- [x] Inventory current built-in lesson IDs and identify 5 pilots, 6 source-independent math lessons, and 1 TOC-only CETa companion. Recheck source provenance before production.
- [ ] Review uncertain classifications (especially Mathematics and the Chapter 3 TOC-only companion) with the user.
- [x] Implement Legacy Group 1 and Legacy Group 2 as sibling sections on staging (5 original pilots + 7 unreferenced companions).
- [ ] Preserve routes, IDs, completions, answers, scheduled reviews, and offline/local/cloud backups.
- [ ] Confirm sourced lessons stay in the appropriate Exam, Textbook, or Laboratory tracks.
- [ ] Confirm Review & Reinforcement is unchanged.
- [ ] Verify mobile/desktop presentation and regression-test sample saved study progress.
- [ ] Obtain explicit user approval, then perform the V2 production release.

### Current staging classification (2026-10-12)

- **Group 1 (5):** L01, L02, L03, L04, L05.
- **Group 2 (7):** CETA-G03-01, MATH-001, MATH-002, MATH-003, MATH-004, MATH-005, MATH-006.
- **Remain active pending provenance recheck:** BDMM-01, BDMM-02, EIM-BEC-PRELAB and EIM-BEC-DC02 (known referenced manual ranges).
- **UI paths:** Legacy in sidebar/mobile navigation; the Mathematics Companion and CETa Study Guide provide Legacy Group 2 links; both groups share the Legacy page, side by side on wide displays and stacked on phones.
- **No migration of saved progress:** Stable lesson/question IDs are retained and original source code remains available. This is a presentation-only reorganization.

### AI pipeline financial reliability gate (added October 12, 2026)

- [x] Keep staging isolated from production credentials, study progress, and lesson publishing.
- [x] Preserve completed stages, model responses and request IDs where the provider returns them.
- [x] Prevent two active paid model requests per scan in the database.
- [x] Require explicit confirmation of paid retries, including risk of earlier unknown billing.
- [x] Move source citation and approved-inventory checks before new model quota reservations.
- [x] Provide a read-only **Check pipeline readiness (free)** action that creates no provider request or quota reservation.
- [x] Refuse automatic resubmission of running jobs without a saved provider response ID.
- [ ] Run free readiness preflight from signed-in desktop and mobile browsers, including on the earlier interrupted chapter scan after saving book/pages metadata.
- [ ] With explicit owner authorization for API spending, run one small, single-page end-to-end test: Sol planning, Astra extraction, Sol drafting, Astra review, and human approval. Keep a cost ledger for each stage; never silently retry failed provider requests.
- [ ] Interrupt/resume a **test** in-progress request and confirm that the same provider response ID is retrieved without a second generation. Don't intentionally interrupt a production source scan.
- [ ] Check real provider billing against the site's estimates, including timeout/502 behavior and model-specific input/output rates; no code can guarantee a provider will never charge for incomplete work.
- [ ] Verify that new book/page references and Review & Reinforcement routing survive the full approval pipeline.
- [ ] Obtain explicit approval before publishing V2 to production.
