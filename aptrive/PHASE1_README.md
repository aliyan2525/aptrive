# Aptrive — Phase 1 delivery: Admin CMS foundation + CSV importer

> **Update:** fixes a Vercel build failure (`Property 'file_name' does
> not exist on type 'never'`) — see "Changelog" at the bottom if you
> already applied the first version of this delivery.

This extends your existing project — nothing here rebuilds or replaces
`auth`, `dashboard`, `onboarding`, the merit calculator, or the public
Library pages. It adds an `/admin` area on top of your existing
`subjects -> practice_sets -> questions -> question_options` schema.

## How to apply this

All paths below mirror your repo exactly — copy each file into the
matching path, overwriting where noted.

**New files** (just copy in):
```
supabase/migrations/0005_admin_cms_foundation.sql
lib/admin/auth.ts
lib/admin/catalog.ts
lib/admin/csv.ts
lib/admin/questions.ts
lib/admin/import.ts
app/admin/**  (entire new tree: layout, page, actions.ts, questions/*, import/*)
components/admin/**  (entire new tree)
```

**Modified files** (replace your existing copy with this one — each
change is additive and explained inline as a comment at the change
site):
```
lib/database.types.ts       — adds new fields/tables (see §2 below)
lib/supabase/middleware.ts  — adds "/admin" to PROTECTED_PREFIXES
components/Header.tsx       — fetches profile role, passes isStaff to UserMenu
components/UserMenu.tsx     — shows an "Admin" link when isStaff
```

### 1. Run the migration

```bash
supabase db push
# or paste supabase/migrations/0005_admin_cms_foundation.sql into the
# Supabase SQL editor if you're not using the CLI locally
```

### 2. (Optional) regenerate types instead of using the hand-authored ones

`lib/database.types.ts` here is hand-edited to match the migration,
same as your existing file. If you'd rather generate it:

```bash
supabase gen types typescript --local > lib/database.types.ts
```
then re-add the `QuestionStatus` / `PracticeSetStatus` / `ImportBatchStatus`
/ `ImportRowStatus` string-literal exports at the top, since the CLI
output won't include those convenience aliases.

### 3. Give yourself a staff role

The admin area gates on `profiles.role` (via your existing `is_staff()`
helper: `instructor`, `content_manager`, or `administrator`). Promote
your own account in the Supabase SQL editor:

```sql
update public.profiles set role = 'administrator' where id = '<your auth.users id>';
```

### 4. Visit `/admin`

You should see the overview, a "New question" form, and "Import".

---

## 2. What the migration actually changes

- `questions` gains: `status` (draft/in_review/published/archived,
  **defaults to `published`** so your existing seeded questions stay
  visible), `source`, `source_year`, `tags`, `ai_generated`,
  `human_reviewed`, `current_version`, `created_by`, `reviewed_by`,
  `duplicated_from_id`.
- `practice_sets` gains the same `status` lifecycle (draft/published/archived).
- New tables: `question_versions` (append-only, auto-populated by a
  trigger on every meaningful edit), `import_batches` +
  `import_batch_rows` (the CSV pipeline's audit trail).
- **RLS change**: `questions_select_all` / `practice_sets_select_all` /
  `question_options_select_all` are replaced with policies that only
  show `status = 'published'` rows to non-staff — staff (your existing
  `is_staff()`) still see everything, including drafts. This is the
  one behavioral change existing users could notice: any question or
  practice set you create through the CMS starts as a **draft** and
  is invisible to students until you click "Publish".

## 3. What's in this delivery

- **Admin CMS**: `/admin` (content-health dashboard), `/admin/questions`
  (searchable/filterable table — plain GET params, no client JS needed
  for filtering), `/admin/questions/new` and `/admin/questions/[id]/edit`
  (shared form component), `/admin/questions/[id]/versions` (version
  history viewer backed by the auto-snapshot trigger).
- **CSV importer**: `/admin/import` (upload) → validate (duplicate
  detection against existing questions in the target practice set, plus
  within-file duplicates; required-field and option-count checks) →
  `/admin/import/[batchId]` (per-row preview with errors/warnings) →
  commit (imports valid + warning rows as drafts, one row at a time so
  a bad row doesn't abort the batch) → rollback (only allowed while
  every imported question is still an untouched draft).
- **Question actions**: Publish / unpublish / archive / duplicate,
  directly on the edit page.

## 4. Deliberately deferred (not in Phase 1)

To keep this shippable without adding new dependencies or restructuring
your existing question model:

- **Single-choice only** — your existing `question_options` +
  `enforce_single_correct_option` trigger assume one correct answer.
  Multiple-answer and numeric-answer question types are a schema change
  (new `question_type` column + form branching) — worth doing in Phase 2
  once you're ready for mock-exam scoring to handle them too.
- **No LaTeX/Markdown rendering in the editor** — the question text
  field is a plain textarea. Wiring up a live-preview pane (e.g.
  `react-markdown` + `KaTeX`) needs new dependencies; the field already
  stores raw markdown/LaTeX text so this is a pure add-on later, not a
  data migration.
- **CSV only** — the importer is CSV-first per the roadmap; XLSX/JSON
  support is a follow-up (add `papaparse`/`xlsx` and reuse the same
  `validateCsvRows` → `ValidatedRow` shape).
- **No image upload** — `question_images` / Storage bucket wiring
  wasn't part of this pass.
- **No fine-grained role permissions** — every staff role
  (`instructor`/`content_manager`/`administrator`) can do everything in
  the CMS, matching your existing `is_staff()` RLS policy exactly. If
  you want e.g. only `administrator` to be able to publish, that needs
  a new RLS policy plus an app-level check to match — flag it if you
  want that next.

## 5. Expected CSV column format (documented in the importer UI too)

```
prompt, option_a, option_b, option_c, option_d, option_e, option_f,
correct_option, explanation, difficulty, topic, chapter,
time_estimate_seconds, source, source_year, tags
```

- `option_c`–`option_f` are optional (2–6 options total).
- `correct_option` is a letter A–F pointing at a non-empty option.
- `difficulty` must be exactly `Easy`, `Medium`, or `Hard`.
- `tags` is comma-separated, optional.
- One CSV file imports into **one** practice set, chosen at upload time.

## 6. Changelog

**v1.1** — fixed a TypeScript build failure on Vercel:
`Type error: Property 'file_name' does not exist on type 'never'` in
`app/admin/import/[batchId]/page.tsx`.

Root cause: this project's `lib/database.types.ts` is hand-authored and
doesn't include Supabase's generated `Relationships` metadata. Without
it, embedded/joined selects (e.g. `.select("*, practice_sets(title)")`)
can't be type-inferred by `@supabase/supabase-js`, and the joined
fields silently collapse to `never`. Your existing `lib/dashboard-data.ts`
already works around this by casting query results to a hand-written
type — `lib/admin/questions.ts` and `lib/admin/import.ts` now do the
same (`QuestionListRow`, `ImportBatchRow`). No behavior change, no
migration change — if you only grabbed the first version, replace
those two files (or just re-extract this zip over your project).

**v1.0** — initial Phase 1 delivery.
