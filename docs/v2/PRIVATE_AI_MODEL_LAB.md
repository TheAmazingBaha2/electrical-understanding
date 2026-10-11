# Electrical Understanding — Private GPT model evaluation staging

Status: deployed private **staging-only** endpoint and browser tester; **paid provider connection intentionally disabled** until the developer configures `OPENAI_API_KEY` in Supabase secrets and approves API billing. No GitHub production branch changes or production Supabase changes.

## Systems connected

- Frontend: `Account → Private AI model tests` in `draft/v2-dmm-companion` only. Module `ai-model-lab.js`. No progress or quizzes are modified.
- Private backend: `https://hkwmtjhgrskidaizamwy.supabase.co/functions/v1/ai-model-lab` with JWT verification enabled, deployed only into **staging Supabase**.
- OpenAI API: Responses API `POST https://api.openai.com/v1/responses`, `store:false`, no tools, output limited to 700 tokens, low reasoning. GPT model allowlist `gpt-6-luna` and `gpt-6.1-sol`. No arbitrary prompts, uploads or user-provided model IDs.
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
5. Compare the same fixed scenario first with Luna, then Sol. Results show answer, latency, tokens, cost estimate and rudimentary expected-string matches. Actual correctness and safety require manual reading.

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
