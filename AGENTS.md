# Electrical Understanding — durable product contract

Before changing this project, read `docs/v2/TEACHING_AND_DESIGN_CONTRACT.md` and the latest `docs/qa` checkpoint. Treat design requests as changes to presentation unless the user also requests a behavior or data change.

- Work on `draft/v2-dmm-companion` and isolated staging `hkwmtjhgrskidaizamwy`. Production release is a separate user decision.
- Preserve stable lesson/question IDs, source evidence/raw attempts, human approvals, answers, review dates, Legacy group assignments and cloud conflict handling. Never regenerate paid content to implement a visual change.
- Every future approved unit uses the shared five-tab lesson engine and approved inventory; its dashboard, progress and review routes come from server-owned metadata. Unapproved drafts are never active curriculum.
- Keep source grounding, high-confidence coverage, plain-language discussions, intermediate worked steps, predictions/debriefs and ten varied quiz questions in the paid prompt contract. Do not replace these with summaries or generic question banks.
- No design edit may enable a paid request on page load, refresh, sync, navigation or verification. New paid generations require the user's in-app authorization, an atomic reservation and durable attempt. Resume known requests freely; uncertain failures never retry automatically.
- Preserve the blue/cyan frosted layout and three yellow bolts unless the user requests a visual change. Show counts from actual published/approved lessons; archived items remain separate.
- Run `npm run check`, `npm test`, `npm run build`, `node tests/deploy.validation.mjs`. For UI changes run the affected Chromium suite and verify desktop/phone behavior. Changes to prompts/scan flow also require the workflow and prompt contract tests. Do not call paid providers as a regression test.
- Deploy frontend only after complete CI passes on the exact commit. Deploy/read back matching staging Edge source when it changes; never claim a frontend publish updates backend functions automatically.
- Record actual verification limits and unresolved design choices in the audit report. Automated prompts and same-model review cannot guarantee educational quality or source correctness.
