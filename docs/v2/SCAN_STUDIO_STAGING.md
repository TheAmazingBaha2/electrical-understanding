# Electrical Understanding: private scan-to-lesson studio (staging only)

The development branch now provides a staged workflow in Scan Inbox:

1. Upload a small PDF/JPEG/PNG/WebP textbook excerpt (at most 5 MB) into a private Supabase bucket. Explicitly acknowledge the later transfer of the source to OpenAI. Uploading does not call OpenAI.
2. Click **Astra analysis**: source image/PDF is sent to the private OpenAI Responses API, requesting evidence-tagged source facts, equations, safety notes and uncertainties.
3. Click **Sol draft**: generate structured explanations, goals, and worked questions based exclusively on that extraction, with validated source fact references.
4. Click **Astra review**: compare the original scan to the source extraction and Sol draft; flag inaccurate math, unsafe electrical guidance and unsupported claims. Blocked drafts return to Sol.
5. Click **Approve** after human review. The result is a read-only private companion, with permanent GEN-UUID lesson IDs and stable question IDs, not a new graded course lesson.

All paid stages require a manual click. Calls share the existing private quota (2/minute, 6/hour, 24/day) and Astra additionally has a limit of 2 per rolling 24 hours. Unsuccessful calls may still spend tokens and reserve quota. No autonomous scheduled lesson creation is enabled.

Backend: staging Supabase project hkwmtjhgrskidaizamwy, private storage bucket eu-private-scans, scan_lesson_jobs table, JWT-protected scan-lesson-pipeline Edge Function. The backend rechecks the user and a single authorized account allowlist. Browser clients have no direct write privileges to drafts. Source files are never served as public assets or committed to GitHub. Only the owner can download their originals.

Generated claims are model interpretations, not independent verification. Compare the result to the original pages, especially equations, component ratings and electrical safety. The site escapes model text instead of interpreting it as HTML.

This release intentionally does NOT modify lesson_progress, dynamically grade AI-generated questions, place drafts in existing CETa lesson sequences, or build interactive circuit widgets. Those features require additional validated design and a reviewed migration. Nothing is deployed to production.

Automated tests: npm run check; npm test; npm run build; deploy validation; Playwright scan-inbox-browser and existing mobile/desktop/persistence tests. UI tests use mocked model responses, so they incur no OpenAI charges. Live PDF/image OpenAI interoperability awaits a short, user-authorized scan test on staging.

For manual validation: open the staging site, sign in as the allowed user, open Scan Inbox, upload 1–3 clear pages, review source evidence after Astra, click Sol, then Astra review, inspect findings and approve. Observe token estimates, quotas and approval. Confirm the saved lesson persists after refresh, while the original course progress remains unchanged.

Source access design: https://supabase.com/docs/guides/storage/security/access-control
