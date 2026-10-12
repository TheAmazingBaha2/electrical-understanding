# Electrical Understanding — Private GPT model evaluation staging

Status: deployed private **staging-only** endpoint and browser tester; **paid provider connection intentionally disabled** until the developer configures `OPENAI_API_KEY` in Supabase secrets and approves API billing. No GitHub production branch changes or production Supabase changes.

## Systems connected

- Frontend: `Account → Private AI model tests` in `draft/v2-dmm-companion` only. Module `ai-model-lab.js`. No progress or quizzes are modified.
- Private backend: `https://hkwmtjhgrskidaizamwy.supabase.co/functions/v1/ai-model-lab` with JWT verification enabled, deployed only into **staging Supabase**.
- OpenAI API: Responses API `POST https://api.openai.com/v1/responses`, `store:false`, no tools, output limited to 700 tokens, low reasoning. GPT model allowlist `gpt-6-luna`, `gpt-6.1-sol`, and `gpt-6-astra` (premium, max 2 runs/rolling 24 hours). No arbitrary prompts, uploads or user-provided model IDs.
- Evaluation fixtures: twelve original low-voltage electronics questions in `supabase/functions/ai-model-lab/cases.ts`, spanning basic CETa computations, DMMs, safety and audio. Simple string checks are **heuristics, not grading**; the actual response requires human review for truthfulness and physical safety. Costs shown are estimates based on published Standard API token prices and response usage.
- The static site only receives UI code, never backend source or API key. The public staging Supabase publishable key is allowed by design; no elevated credentials in web assets.

## Private authorization

- Backend verifies the caller's bearer JWT through the Supabase Auth service; never trusts a user-supplied email or ID.
- A separate `ai_test_allowed_users` table contains the **single existing authorized staging account**, inserted through a database operator query; the ID is not committed into the repository. RLS allows a user to select only their own allowlist row; ordinary authenticated clients cannot insert/update/delete it.
- If that verified user is not allowed, returns HTTP 403 and never calls OpenAI.
- `ai_test_reserve` RPC enforces atomic per-user quotas using PostgreSQL advisory transaction locks before a provider request: 2 per minute, 6 per hour, 24 per rolling 24h.
- `ai_test_request_log` is RLS protected with no client table access. Only the vetted `SECURITY DEFINER` RPC may insert quota reservations after verifying `auth.uid()` against the allowlist. This intentional privilege is confined to quota reservations; the security advisor may warn about an exposed definer function even though its own auth check is mandatory.
- CORS allows only the exact staging workers.dev origin; this is an *additional browser restriction*, not an authorization control. Valid JWT + owner allowlist is the actual security boundary.
- The API also validates fixed scenario IDs, fixed model IDs, request size, and server-side upper output limits. No arbitrary prompts, model overrides, hidden paid tools, or Astra routes exist.
- The server returns only sanitized response content/metrics; it never relays provider credentials.
- While the secret is absent, authorized `status` works, but `run` returns HTTP 503 **before quota reservation and before any paid API request**.

## Needed from the owner to enable paid tests

1. In [OpenAI Platform](https://platform.openai.com/), create a **separate API project** for Electrical Understanding (different from ChatGPT Plus billing). Configure a *hard project spending limit*—suggest **$10 monthly**—and an early warning at $5. Confirm the account is allowed to call `gpt-6-luna` and `gpt-6.1-sol`. Do not buy credits until you want to use the API. If a model is unavailable, adjust the server allowlist only after checking model entitlements.
2. Create one **project-scoped API secret key** for that project. Do not put it in the chat, GitHub, `config.js`, a screenshot or a website field.
3. In **only the staging Supabase project** `hkwmtjhgrskidaizamwy`, visit [Edge Function Secrets](https://supabase.com/dashboard/project/hkwmtjhgrskidaizamwy/settings/functions) and add **`OPENAI_API_KEY`** with that value. If the dashboard navigates differently, use Edge Functions → Secrets. The Edge Function reads the secret dynamically without committing it anywhere.
4. Refresh the staging site `https://eu-v2-staging.vanguardcorbett.workers.dev/`, open Account → Private AI model tests. Status should change to **Ready** once the secret is usable. A configured key is not itself evidence the account has credits/models; run one manual test and inspect its result or provider error.
5. Compare the same fixed scenario with Luna, Sol, and Astra (premium). Astra's estimated Standard API cost is $10 per million input tokens and $50 per million output tokens for short context, before any applicable other fees. Results show answer, latency, tokens, cost estimate and rudimentary expected-string matches. Actual correctness and safety require manual reading.

## Regression checks and safeguards

- `tests/ai-model-lab.test.mjs`: authorization, owner-only UI, secret fail-closed, fixed model whitelist, quota SQL, 12 scenarios, stable site progress.
- `tests/ai-model-lab-browser.mjs`: fully mocked browser integration; verifies model selection, response display and mobile size without paid inference.
- `tests/deploy.validation.mjs` and `scripts/build.mjs`: ensure only public UI is shipped; Edge Function and SQL migrations stay server-side.
- Supabase SQL privilege checks: the allowlist has exactly one user; anonymous role cannot read it or execute the reservation function; ordinary authenticated users cannot add owners or fabricate request logs.
- The staging Edge Function is configured `verify_jwt:true`. No API calls have been run without a secret.
- The model UI is reachable from Account only after sign-in; raw function URLs are protected regardless of visible navigation.

## Outstanding before declaring provider-connected end-to-end

- Owner configures the project-scoped OpenAI key and spending controls manually in the corresponding platform dashboards. There is no tool available in this chat to create secrets in those external accounts; do not ask for the raw key here.
- Test one authorized **real** inference with the owner signed in; verify HTTP status and model output. Then verify that a second Supabase user receives 403 and an anonymous request receives 401 (or platform JWT rejection), before allowing broader lesson-tutor access.
- Review 12 scenario responses for factual accuracy and hazardous probing advice. A simple keyword match is not a formal evaluation.
- Enforce additional monthly spend protection at the OpenAI project level; app quota is a second line of defense, not a billing stop.
- Current backend is a private **evaluation endpoint only**, not an automatic lesson generator, automatic quiz grader, or general chatbot. Any future use of AI for production learning requires separate acceptance and versioned progress-safe rollout.

## Astra evaluation update (2026-10-11)

GPT-6 Astra was added to the server/model selector upon owner request. The original per-user request quotas remain 2/min, 6/hour and 24/rolling 24h, and an additional Astra-only maximum of **2 per rolling 24 hours** is enforced atomically at the DB reservation step. This change is versioned by `supabase/migrations/20261011214000_enable_astra_benchmarks.sql`; the original migration is retained. The OpenAI model ID is `gpt-6-astra`, with published standard short-context token rates $10 input / $50 output per million tokens. A visible warning accompanies the selection. Browser tests simulate all three models without incurring charges. Existing production and saved learning progress are unaffected.

## Mobile dialogue and floating study tutor (2026-10-11)

- The Model Lab now shows the full benchmark **question before a run** (from the owner's protected status endpoint) and renders each question/model-answer pair in readable, wrapping dialogue panels. The result scrolls into view on small screens. Up to ten recent results are retained in the current browser session's module memory; switching accounts clears them. No results alter graded learning history.
- A collapsible **⚡ Study tutor** launcher appears on the staging site for signed-in users on all study views. The panel persists while switching lessons, has a separate scrollable conversation, Clear/New and Close buttons, a message entry area, and a Luna/Sol selector. Model-generated text uses DOM textContent rather than unsafe HTML rendering. On sign-out, it clears and hides.
- During a lesson, the tutor may receive its short *catalog title* and *description* as context. It does not automatically read scans, upload textbook pages, inspect lesson answers or write progress. The floating conversation is intentionally **temporary in browser memory** and not synced across devices or saved to the database.
- The same server-side staging Edge Function has a bounded `chat` action. It checks JWT and the **one-user allowlist** before any inference. The chat path only allows Luna/Sol, validates each message (maximum 800 characters), accepts at most eight prior short dialogue messages, limits total history, and caps each response at 1,400 output tokens. Astra remains available in **fixed Model Lab scenarios only** to avoid accidental premium chat spending.
- Chat and Model Lab share the existing atomic quota: **2 calls/minute, 6 calls/hour and 24 calls per rolling day**. Astra has a stricter 2 per rolling day limit. Every Send/Run is a conscious billable request. No autonomous background model usage.
- Browser regression tests `tests/ai-chat-browser.mjs` and `tests/ai-model-lab-browser.mjs` use mocked model responses to verify question display, multi-paragraph answers, scrollable chat on phones, navigation persistence, and signed-out state without using credits.
- If you want more than six paid chat responses per hour during daily use, revise the quota and budget together in a separately approved change. For now, safety and controlled trial spending take priority.
