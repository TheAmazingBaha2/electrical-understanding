# Scan response recovery

The scan pipeline now creates background Responses API requests with `store:true` and persists the response ID immediately. Checking or resuming a queued/running request retrieves that same response, without a new generation or quota reservation.

Each attempt records its stage, starting job revision, provider request and response IDs, returned response body, output text, usage, status and error. Returned data is saved before JSON parsing and lesson validation. Incomplete and invalid responses are private recovery material, never approved source evidence.

The Scan Inbox shows permanent attempt details and a raw JSON download. Running attempts show **Resume / check saved request (no new AI call)**. Failed attempts show an explicit **paid** retry/continuation button. Continuations reuse available previous output with the original source and stage inputs, then produce a complete replacement object for validation; they do not resume a terminated generation token-for-token. An explicit retry has twice the normal output allowance, to give truncated responses room to finish. Successful stages, including Sol's planning brief, are reused.

Two devices cannot start active requests for the same scan simultaneously. Applying a validated checkpoint and marking its attempt applied is one database transaction. Network failures while checking a known response leave it recoverable. A submission interrupted before the provider response ID arrives is marked unknown; the app never silently resubmits it. A starting record stranded for two minutes becomes unknown on the next check.

Closing the browser does not cancel the provider's background request. Reopen and Resume to collect it. This is response-level recovery, not yet the proposed page-group streaming/extraction pipeline. Provider retention limits still apply; the durable local copy is written when a response is received or checked. A network error before any provider data arrives cannot manufacture an output checkpoint.

Storage: owner-only RLS on `scan_model_attempts`; browser has SELECT only. Server-only RPC applies validated results. Raw records cascade when the local scan is deleted. Provider-stored responses follow OpenAI retention separately.

Validation: mocked provider tests for background retrieval, malformed JSON, incomplete responses, provider/network errors, duplicate starts, quota failures and retry context. SQL rollback tests check atomic application, replay and access grants. No paid inference is used for automated tests.

Historical incident: the 2026-10-12 10:50:40 EDT Astra attempt returned HTTP 502 about 59 seconds later. The old UI's toast was hidden after 4.2 seconds and was not logged; no exact message or response was retained. A clearly labelled historical incident record preserves the known facts without fabricating missing output.
