# Preview Supabase synchronization

The draft branch connects exclusively to Supabase project `hkwmtjhgrskidaizamwy` when opened on a `*.workers.dev` or `*.pages.dev` staging hostname.

## Completed automatically
- Separate staging project confirmed.
- Dedicated `public.lesson_progress` table created with authenticated-user row-level security (RLS), matching existing `user_id` / `lesson_id` / `data` / `updated_at` schema.
- Enabled `config.js` with the **staging-only publishable browser key**, no secret/service-role credentials.
- Updated `app.js` to enable Supabase authentication and sync only when both conditions hold: Cloudflare staging hostname AND the exact staging-project URL. Any other hostname fails closed to local practice.
- Staging signed-in progress uses `eu_staging_progress_v1_<user id>` device cache keys; legacy L01–L05 and production DB data remain unchanged.
- Sign-in, submit/save, return-online/visibility refresh, and explicit Refresh progress now use the separate project.
- Older anonymous local practice remains local until the user chooses **Import this device's local practice** after signing in.
- Build refuses to deploy if the staging config includes the production project ref. The public key is intentionally browser-readable; RLS provides data protection.

## One-time Supabase Authentication configuration required
The staging Supabase project has separate Auth users and redirect rules from production. In the **preview project only**, go to Supabase Dashboard → Authentication → URL Configuration:
1. Set **Site URL** to the *exact, currently working* Cloudflare staging URL (for example, `https://eu-v2-staging.<your-subdomain>.workers.dev`).
2. Under **Redirect URLs**, add exactly that same URL and, if necessary, its trailing-slash form. Do not wildcard all `workers.dev` users.
3. Leave the production Supabase Auth configuration untouched.
4. In Authentication → Providers → Email, make sure email sign-in (OTP/magic link) is enabled and permitted. Follow Supabase email-provider quota limits if applicable.

## Manual end-to-end verification
1. Wait for a successful Cloudflare staging deployment of the new draft commit.
2. On phone open staging → Account → enter authorized email → request magic link; open the emailed link on the same device. Confirm Account says staging cloud connected.
3. Complete **one new nonessential graded check**. Watch for “Saved to cloud.”
4. On desktop open the *same* staging URL, sign into the **staging Supabase project** with the same email (its auth user is independent of the production account), then use Account → Refresh cloud progress.
5. Confirm that the answer and dashboard progress from phone appear on desktop, then submit a *different lesson's question* from desktop and refresh on phone. Verify the second answer appears.
6. If you already have browser-only staged practice to preserve, sign in and explicitly choose **Import this device's local practice**. Do **not** import production exports into the preview unless you expressly want a disposable staging copy.
7. Test offline → answer → online → refresh; refresh should push local newer records (based on lesson-level `updatedAt`) and download cloud changes.
8. Test separate users with different addresses if desired; RLS restricts each to its own rows.

## Known limitations
- The login email may come from Supabase's built-in mail service; free SMTP delivery limits apply, and some delivery providers may require custom SMTP for reliable use.
- Sync uses **lesson-level last-write-wins** on stale changes. Simultaneously editing *the same lesson* from two devices can cause an answer to be superseded. Avoid concurrent answers to the same lesson until per-question conflict resolution is implemented and tested.
- Cloudflare Access protection must be configured separately; this database separation does not itself make the staging site private.
- Browser smoke tests cannot prove email delivery or live OAuth/session round trips; complete the manual acceptance test before relying on staging sync.
- Production `main`, production Supabase project `wwvpzyqcgwlwcetwlime`, and existing learner data have not been modified.

## Durable storage update (2026-10-11)

The timestamp / last-write-wins description above is historical. The draft now uses schema-3 documents, atomic cloud revisions, non-destructive conflict review, scoped local recovery points, and append-only cloud history. Read [DURABLE_PROGRESS.md](DURABLE_PROGRESS.md) for the implemented protections, limitations, test procedure, recovery and eventual production approval requirements. The staging migration is applied; no production migration or deployment was performed.
