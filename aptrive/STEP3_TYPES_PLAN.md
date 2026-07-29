# Step 3 — Regenerating `lib/database.types.ts`

## Why I can't do this one myself

This needs a real connection to your Supabase project (or at minimum a local
Postgres with every migration applied) so the CLI can introspect the actual
schema — foreign keys, relationship metadata, enum types — and emit correct
types from it. This sandbox has no network access and no Postgres, so there's
nothing for me to introspect. Hand-writing a "regenerated" version myself
would just be re-guessing the same file by another route, which is the exact
problem this step exists to fix.

## What's actually wrong today

`lib/database.types.ts` (2,678 lines) is hand-maintained, and it shows: most
tables have `Relationships: []` even where a real foreign key exists (e.g.
`chapters.subject_id -> subjects.id`), because that metadata was never filled
in by hand. Supabase's typed query builder uses `Relationships` to resolve
`.insert()`/`.update()` payload types — without it, those calls fall back to
`never`, which is why 42 call sites across the app have an
`as any`/`eslint-disable ... no-explicit-any` next to a `.from(table)` call
(see `app/admin/catalog/actions.ts`, `app/contact/actions.ts`,
`lib/repositories/*.ts` for examples — several even have a comment pointing
at this exact cause).

## Steps to run (needs Supabase CLI + a linked project or local Docker stack)

```bash
# Option A — against your live/linked project (recommended, gets the real
# deployed schema, not just what's in the migrations folder):
supabase login
supabase link --project-ref <your-project-ref>
supabase gen types typescript --linked > lib/database.types.ts

# Option B — against local Docker, if migrations/ is authoritative:
supabase start
supabase gen types typescript --local > lib/database.types.ts
```

## After regenerating

1. Run `npm run build` (or `tsc --noEmit` if you add a `typecheck` script) —
   regenerating will very likely surface real type mismatches the hand-authored
   file was masking, not just fix the `any` casts.
2. Grep for `as any` and `no-explicit-any` across `app/` and `lib/` and remove
   each one, letting the real generated types flow through
   `.insert()`/`.update()`/`.select()`. Expect most of the 42 to disappear on
   their own once `Relationships` is populated; a handful may need the call
   site adjusted (e.g. a payload shape that was quietly wrong under the old
   loose types).
3. Run `npm test` and `npm run test:db` (see `TESTING.md`) before merging —
   this is exactly the kind of repo-wide change the new test suite exists to
   catch regressions from, per the original ordering (tests before the type
   refactor).
4. Do this as its own PR, separate from the zod/rate-limiter changes, since a
   regenerated types file will touch far more surface area than either of
   those and is easiest to review in isolation.
