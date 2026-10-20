# AI Product Management Programme

A 14-week programme that teaches the decisions behind products built on artificial intelligence (AI): whether to use AI at all, how to specify behaviour that varies, how to test it, how to pay for it, how to govern it, and how to defend a launch decision. Every assignment uses one fictional case company, Harbourview Polyclinics, a Singapore primary-care group.

Version: handbook v2.0 · 20 October 2026

## Repository layout

```
docs/                  Learner website (static HTML, no build step)
  index.html           Programme handbook and module map
  login.html           Email one-time-code sign-in (preview mode until connected)
  dashboard.html       "My course" progress and marks page
  week-00.html         Week 0 orientation and baseline
  module-01.html       Module 1 · The AI product role and lifecycle
  module-02.html       Module 2 · Technical fluency for product decisions

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

## Learner flow

Handbook → Sign in → My course → Week 0 → Module 1 → Module 2. Every learner page shares one navigation bar, and Week 0 and each module end with Previous / Next links.

## Status

| Item | Status |
|---|---|
| Handbook, sign-in, dashboard | Done (preview mode) |
| Week 0 | Live (pilot version); rewrite for a general audience later |
| Modules 1–2 | Done |
| Module 1 assessor pack | To do |
| Modules 3–12 | To do |

## Known gaps

- "Why this course" links to the page on the main site: `https://apoorvaaj.github.io/learn-ai-product-management.html`. That page should carry a "Start the course" button pointing to `/AIPMCourse/`.
- `week-00.html` is linked and live, but it is a pilot version that still refers to the original learner's own products (Attic, Quaestio, BeatKeeper, MealPartner). Rewrite it for a general audience.
- Sign-in and the dashboard run in preview mode until Supabase details are added (see `course-owner/login-setup.html`).
- Static hosting does not stop someone reading course pages directly; see section 2 of the sign-in setup guide.
- Learner progress is saved in each learner's own browser until the database step is done.

## Credits

Structure draws on public outlines of: Duke University's AI Product Management Specialization (Coursera); Marily Nika's AI Product Management Bootcamp (Maven); Hamel Husain and Shreya Shankar's AI Evals course (Maven); Reforge's AI courses; Product School's AI Product Certification. Harbourview Polyclinics and all its figures are fictional.
