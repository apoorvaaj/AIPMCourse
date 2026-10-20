# Dashboard data guide (course owner)

How the **My course** dashboard (`dashboard.html`) gets its data, and how the cohort lead enters marks. Written for the course owner, not learners.

## 1. What the dashboard shows

| Area | Source | Who writes it |
|---|---|---|
| Signed-in email | Supabase sign-in session | The learner, by signing in |
| Checkpoint quiz progress (Quiz A, Quiz B) | `progress` table | The module page, automatically |
| Deliverable status (not started, drafting, submitted) | `progress` table | The module page, and the cohort lead on receipt |
| Deliverable, test and viva marks, and a note | `marks` table | **Cohort lead only** |
| Module mark and band | Calculated on the page | Nobody. Derived from the three marks |

**Module mark** = deliverable × 60% + test × 25% + viva × 15%, rounded. A resubmitted module is capped at 59% (Pass).

**Bands:** Distinction 75%+, Merit 60–74%, Pass 50–59%, Resubmit below 50%.

**Completion rule:** Merit or better on 9 of the 11 taught modules, plus a passed capstone defence.

## 2. Preview mode (now)

With no Supabase details in `CONFIG`, the dashboard runs in preview mode and offers two views:

- **Sample learner:** made-up progress, so you can see every state. Modules 1–2 are graded, Module 3 needs resubmission, and Module 4 is in progress.
- **My work in this browser:** reads what the learner has done on module pages in the same browser. It works only when the dashboard and module pages are served from the same site.

## 3. Database tables (for when you go live)

Create these in the Supabase SQL editor. Module `0` is Week 0; modules `1`–`12` are the programme.

```sql
-- Who is a cohort lead
create table public.staff (
  user_id uuid primary key references auth.users on delete cascade,
  role text not null check (role in ('cohort_lead'))
);

-- Learner progress: one row per learner per module
create table public.progress (
  user_id uuid not null references auth.users on delete cascade,
  module smallint not null check (module between 0 and 12),
  data jsonb not null default '{}',   -- { qa:{c,total,mast}, qb:{c,total,mast}, deliverable:'none'|'drafting'|'submitted' }
  updated_at timestamptz not null default now(),
  primary key (user_id, module)
);

-- Summative marks: entered by the cohort lead only
create table public.marks (
  user_id uuid not null references auth.users on delete cascade,
  module smallint not null check (module between 1 and 12),
  deliverable smallint check (deliverable between 0 and 100),
  test smallint check (test between 0 and 100),       -- test score out of 25, entered as a percentage
  viva smallint check (viva between 0 and 100),
  note text,
  resubmission boolean not null default false,
  marked_by uuid references auth.users,
  marked_at timestamptz not null default now(),
  primary key (user_id, module)
);

alter table public.staff    enable row level security;
alter table public.progress enable row level security;
alter table public.marks    enable row level security;

create or replace function public.is_cohort_lead() returns boolean
language sql stable security definer set search_path = public as
$$ select exists (select 1 from public.staff where user_id = auth.uid() and role = 'cohort_lead') $$;

-- Learners: read and write only their own progress
create policy "own progress read"   on public.progress for select using (user_id = auth.uid() or public.is_cohort_lead());
create policy "own progress insert" on public.progress for insert with check (user_id = auth.uid());
create policy "own progress update" on public.progress for update using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Marks: learners read their own; only cohort leads write
create policy "own marks read"     on public.marks for select using (user_id = auth.uid() or public.is_cohort_lead());
create policy "lead marks insert"  on public.marks for insert with check (public.is_cohort_lead());
create policy "lead marks update"  on public.marks for update using (public.is_cohort_lead()) with check (public.is_cohort_lead());

-- Staff list: only cohort leads can see it
create policy "staff read" on public.staff for select using (public.is_cohort_lead());
```

**Make someone a cohort lead.** They sign in once so their account exists. You then add their row in the Supabase dashboard (Table editor → `staff`). Only you, as project owner, can do this; nothing in the course pages can.

## 4. How the cohort lead enters marks

**Start now, with no build needed.** The cohort lead uses the Supabase Table editor on the `marks` table:

1. Find the learner's ID: Authentication → Users → search by email → copy the user ID.
2. Insert a row: `user_id`, `module`, `deliverable`, `test`, `viva`, `note`. Tick `resubmission` if it is a resubmitted piece.
3. The learner sees it on their dashboard the next time it loads.

Give cohort leads their own Supabase project member accounts with two-factor authentication turned on. Do not share the owner login.

**Later, an assessor page.** A simple marking page (learner list → module → three marks and a note) can replace the Table editor once you have more than one cohort. It uses the same tables and policies.

## 5. Things still to do before launch

- **Module pages must save to `progress`.** Module 1 currently saves only in the learner's browser. Each module page needs a small addition: write a summary row (`qa`, `qb`, `deliverable`) after each quiz change. Until then the dashboard reads Module 1 from the browser in preview mode.
- **Submitting deliverables.** Decide how learners hand in documents. The lightest option is a shared link to their own document, sent to the cohort lead. This keeps learners' work out of your database.
- **Close the access gap** described in the sign-in setup guide, so course pages are served only to signed-in learners.
- **Deletion requests:** deleting the user in Authentication → Users also removes their `progress` and `marks` rows (`on delete cascade`).

## 6. Personal data held

Email address (by Supabase Auth), quiz progress summaries, and marks with cohort lead notes. No names, employers or passwords. Cohort lead notes are personal data about the learner: keep them factual and about the work.
