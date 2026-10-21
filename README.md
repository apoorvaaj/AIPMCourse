# AI Product Management Programme

A 14-week programme that teaches the decisions behind products built on artificial intelligence (AI): whether to use AI at all, how to specify behaviour that varies, how to test it, how to pay for it, how to govern it, and how to defend a launch decision. Every assignment uses one fictional case company, Harbourview Polyclinics, a Singapore primary-care group.

Version: handbook v2.0 · 20 October 2026

## Repository layout

```
docs/                  Learner website (static HTML, no build step)
  assets/site.js       Shared settings, sign-in, navigation, unlocking, email submission
  assets/site.css      Shared styles for the above
  index.html           Public syllabus (programme handbook and module map)
  login.html           Email one-time-code sign-in (preview mode until connected)
  dashboard.html       "My course" progress and marks page
  week-00.html         Week 0 orientation and baseline
  module-01.html       Module 1 · The AI product role and lifecycle
  module-02.html       Module 2 · Technical fluency for product decisions
  …
  module-09.html       Module 9 · Unit economics and pricing of AI products

course-owner/          Instructions for the course owner and cohort leads. NOT for learners.
  login-setup.html             Connecting sign-in to Supabase
  dashboard-data-guide.md      Database tables, row-level security, entering marks
  module-02-assessor-pack.md   Module 2 answer keys, test paper, marking guide, viva cards
```

## Publishing the learner site with GitHub Pages

1. Push this repository to GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and the `/docs` folder, then save.
4. The site appears at `https://<your-username>.github.io/<repo-name>/` within a minute or two.

Only the `docs/` folder is published. The `course-owner/` folder is not served by GitHub Pages.

## Important: keep the repository private

`course-owner/module-02-assessor-pack.md` contains the end-of-module test paper, its answers and the viva cards. **If the repository is public, anyone can read them on GitHub**, even though they are not on the website. Either:

- keep this repository **private** (GitHub Pages from a private repository needs a paid GitHub plan), or
- keep `course-owner/` in a separate private repository and publish only `docs/` publicly.

## Assessment model (every module)

| Type | Component | Weight |
|---|---|---|
| Formative | Checkpoint quiz A (10 Yes/No + 3 short answer) and quiz B (5 Yes/No + 3 short answer), instant feedback, ungraded | — |
| Summative | Module deliverable | 60% |
| Summative | Closed-book end-of-module test (10 Yes/No + 5 short answer) | 25% |
| Summative | 10-minute viva | 15% |

Bands: Distinction 75%+ · Merit 60–74% · Pass 50–59% · Resubmit below 50%.

## How access works (level 1)

**Public pages:** the syllabus (`index.html`) and sign-in (`login.html`). The navigation shows *Why this course · Syllabus · Sign in*. Module cards show outcomes and a "Sign in to start" button, but no links into the course.

**Learner pages:** My course (`dashboard.html`), Week 0 and every module. A visitor who is not signed in is sent to sign-in and returned to the page afterwards. After sign-in the navigation shows *My course · Syllabus · Why this course*, plus the learner's email and *Sign out*.

**Self-paced unlocking:**

| Part | Opens when |
|---|---|
| Week 0 | Signed in |
| Module 1 | Week 0 answers emailed and the box ticked |
| Module N | Module N−1: both checkpoint quizzes at mastery, and the assignment emailed and the box ticked |

A locked page shows what is still needed, with a link back. The dashboard shows locked modules with the reason.

**Submission:** each Week 0 and module page ends with *Email my submission*. It copies the learner's work and opens an email to the course address with the subject `AIPM · <part> · <learner email>`; the learner attaches their document and ticks "I have emailed my submission". The address is set in `docs/assets/site.js` (`submitEmail`, currently `aipmcourse@aspira.work`). The course team replies to arrange the end-of-module test and viva.

**Course-owner tools:**
- Add `?unlock=all` to any page address to open every page in your browser for reviewing; `?unlock=none` turns it off.
- In preview mode (no Supabase details yet), sign in with any email and the code `123456`.
- When you publish Module 3, set `publishedModules: 3` in `site.js` and add `page:'module-03.html'` to Module 3 in `dashboard.html`.

**Limits of level 1:** this is a cosmetic gate. Anyone who knows a page address can bypass it by viewing the source, and progress and unlock state live in each learner's browser (clearing it, or switching device, resets them). Real protection needs level 2: a host that checks sign-in before serving pages (Cloudflare Pages or Netlify) and a private repository.

## Learner flow

Your main site → Syllabus → Start the course → Sign in → My course → Week 0 → email → Module 1 → quizzes + email → Module 2.

## Status

| Item | Status |
|---|---|
| Syllabus, sign-in, dashboard, level 1 access | Done (preview mode) |
| Week 0 | Live (pilot version); rewrite for a general audience later |
| Modules 1–9 | Done (Module 9 adds a starter workbook in `docs/assets/`) |
| Module 1 assessor pack | To do |
| Modules 10–12 | To do |

## Known gaps

- "Why this course" links to the page on the main site: `https://apoorvaaj.github.io/learn-ai-product-management.html`. That page should carry a "Start the course" button pointing to `/AIPMCourse/`.
- `week-00.html` is linked and live, but it is a pilot version that still refers to the original learner's own products (Attic, Quaestio, BeatKeeper, MealPartner). Rewrite it for a general audience.
- Sign-in runs in preview mode until Supabase details are added to `docs/assets/site.js` (see `course-owner/login-setup.html`).
- Access control is cosmetic (level 1); see "Limits of level 1" above.
- Learner progress and unlock state are saved in each learner's own browser until the database step is done.

## Credits

Structure draws on public outlines of: Duke University's AI Product Management Specialization (Coursera); Marily Nika's AI Product Management Bootcamp (Maven); Hamel Husain and Shreya Shankar's AI Evals course (Maven); Reforge's AI courses; Product School's AI Product Certification. Harbourview Polyclinics and all its figures are fictional.
