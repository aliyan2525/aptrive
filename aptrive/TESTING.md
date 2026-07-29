# Testing

Two independent suites. Neither existed before this change (0 test files in the repo).

## 1. Unit tests — Vitest

Covers pure logic that doesn't need a database: `lib/services/scoring.ts::gradeAttempt`,
the client-side mirror of the grading RPC's correctness logic.

```bash
npm install        # pulls in vitest (added to devDependencies)
npm test           # one-shot run
npm run test:watch # watch mode
```

## 2. Database regression tests — pgTAP

Covers the actual write path: `public.record_attempt_and_update_progress()` (the grading
RPC) and `public.guard_practice_session_score_columns()` (the trigger that closed the
score-tampering gap). These are the two objects called out as priority #1 — this is the
regression net for the bug that was already found and fixed once.

```bash
supabase start      # local Docker stack (first run only, or if stopped)
npm run test:db      # runs supabase/tests/database/*.test.sql via pgTAP
```

Requires the [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started)
and Docker. `supabase test db` spins up a disposable Postgres, applies every migration in
`supabase/migrations/`, then runs the `.test.sql` files under `supabase/tests/database/`
inside a transaction that's rolled back afterward — nothing touches your real project.

Test files:
- `supabase/tests/database/practice_session_score_guard.test.sql` — the regression test
  for the score-tampering fix. Specifically checks: (a) the legitimate `completeSession()`
  shape still succeeds, (b) a forged `score_percent` that disagrees with `user_attempts`
  is rejected, (c) `correct_count`/`incorrect_count` are rejected on *any* change (this
  exact distinction — "matches a live count" vs. "not writable at all" — is what the
  second migration had to fix after the first version blocked every real call), and
  (d) RLS still blocks a non-owner from touching another user's session.
- `supabase/tests/database/record_attempt_and_update_progress.test.sql` — grading
  correctness (single-choice, numeric with tolerance), the revision/XP-netting behavior,
  and the auth/input-validation guards at the top of the function.

## What's verified vs. not

I don't have network access or a local Postgres/Docker in this sandbox, so I could not
actually run either suite here — `npm install` is blocked (registry returns 403) and
there's no `psql`/`docker` available. Both suites are written to the correct, standard
shape for this stack (Vitest for the former, Supabase's own pgTAP convention for the
latter) and I traced every assertion against the real migration files rather than
guessing, but please run `npm test` and `npm run test:db` yourself before trusting them
as a safety net — first-run typos in test fixtures (a wrong not-null column, a UUID
literal) are exactly the kind of thing that only shows up on actual execution.
