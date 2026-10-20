# Module 2 assessor pack · Technical fluency for product decisions

**For the course owner and cohort leads only. Never publish this file on the learner site.**
Version 1.0 · 20 October 2026 · Learner page: `module-02.html`

Contents: 1. Module at a glance · 2. Checkpoint quiz keys · 3. Case pack figures (worked) · 4. Marking the decision record (60%) · 5. End-of-module test paper and marking guide (25%) · 6. Viva guide (15%) · 7. Setup notes

---

## 1. Module at a glance

| Item | Detail |
|---|---|
| Learning outcomes | (1) Choose between prompting, retrieval-augmented generation (RAG), fine-tuning, classical machine learning (ML) and agents, and defend the choice. (2) Trade off quality, cost and response time; calculate running cost. (3) Read a system diagram and find failure points; judge which prediction error matters more for a given action. |
| Draws on | Duke AI Product Management Specialization, course 2 (managing ML projects); Marily Nika's advanced course (technical trade-offs); Reforge AI Foundations; Anthropic, "Building effective agents"; Eugene Yan, "Patterns for Building LLM-based Systems & Products" |
| Case initiatives | A (medicine questions assistant) and D (missed-appointment predictor) |
| Deliverable | One document, ≤3 pages, with ADR-001 (assistant design) and ADR-002 (predictor use). ADR = architecture decision record. |
| Learner time | About 7 hours, plus a 1–2 hour optional lab |

---

## 2. Checkpoint quiz keys

These are already shown to learners as instant feedback. Listed here so the dashboard and any future database version stay in step with the page.

| Quiz | Answers in order | Mastery |
|---|---|---|
| A (10 Yes/No) | No, Yes, No, Yes, Yes, No, Yes, No, Yes, No | 8 of 10 |
| B (5 Yes/No) | Yes, No, Yes, No, No | 4 of 5 |

The page writes a summary to the browser key `progress:m2` in the shape the dashboard expects: `{ qa:{c,total,mast}, qb:{c,total,mast}, deliverable }`.

---

## 3. Case pack figures, worked

Use these to check learners' arithmetic. All prices and results are fictional.

### 3.1 Medicine assistant · running cost at 18,000 questions a month

Formula: (input tokens × input price + output tokens × output price) ÷ 1,000,000. Output is 250 tokens in every design.

| Design and model | Input tokens | S$ per question | S$ per 1,000 | Tokens per month | Fixed per month | Total per month | Per year |
|---|---|---|---|---|---|---|---|
| 1. Prompting only · Core | 1,260 | 0.01004 | 10.04 | 180.72 | 0 | 180.72 | 2,169 |
| 2a. Retrieval · Swift | 3,260 | 0.00180 | 1.80 | 32.47 | 300 | 332.47 | 3,990 |
| 2b. Retrieval · Core | 3,260 | 0.01804 | 18.04 | 324.72 | 300 | 624.72 | 7,497 |
| 2c. Retrieval · Summit | 3,260 | 0.09020 | 90.20 | 1,623.60 | 300 | 1,923.60 | 23,083 |
| 3. Fine-tuned Swift | 760 | 0.00161 | 1.61 | 28.94 | 1,500 | 1,528.94 | 18,347 |

One-off and recurring extras learners should add:

| Design | One-off | Recurring beyond the table |
|---|---|---|
| 1 | S$15,000 instructions | None, but it cannot use leaflets at all |
| 2 | S$25,000 leaflet preparation and indexing | Keeping leaflets current (a pharmacy cost the design exposes) |
| 3 | S$40,000 for 5,000 question-and-answer pairs + S$6,000 first training run | About 15 leaflets change a month; monthly retraining ≈ S$72,000 a year, and each change takes about 2 weeks, which **breaks the CIO's one-week rule** |

At 60,000 questions a month, design 2b costs about S$1,382 a month (S$1,082 in tokens). At 50% higher prices and 18,000 questions, 2b costs S$787 a month. Token costs are small next to the people costs in Module 1's estimate (S$60,000 a year to run); good learners notice this.

### 3.2 What a strong ADR-001 concludes

There is no single right answer, but a Distinction-level record usually lands close to this:

- **Rejects prompting only:** cannot use Harbourview's leaflets, cannot show a source, 7 harmful errors in 200.
- **Rejects fine-tuning:** cannot meet the one-week update rule; gave old advice in 9 of 12 updated cases; no source shown; highest ongoing cost once retraining is counted.
- **Rejects Summit:** patient data would be processed in the United States, which breaks a fixed rule. Quality gain over Core is small (93% vs 91%, same harmful errors) at 5 times the token price and 6.5 seconds per answer.
- **Chooses retrieval on Core (2b),** or argues for Swift with routing. A Swift-first answer is defensible if the learner routes higher-risk questions to Core or a pharmacist and accepts 4 harmful errors in 200 only with strong safeguards. Learners who choose 2a with no routing and no safeguards for its 4 harmful errors should not score above 2 on risk handling.
- **Hybrid design:** interaction questions ("is it safe with another medicine?") score only 70%, so the strongest records route them to a pharmacist by rule. Questions where the leaflet has no translation score 60%, so the strongest records either answer in English with an offer to message a pharmacist, or route them, until translation is done.
- **Identifies the overdue-leaflet problem as data, not model.** Requires review dates, an owner per leaflet, and blocking or flagging overdue leaflets in retrieval.

Failure points a strong record names (needs at least five):

| Step | Failure | Harm and who bears it | Safeguard |
|---|---|---|---|
| 2 Prescription lookup | Out-of-date or incomplete prescription | Patient advised about the wrong medicine | Show the medicine name being answered about; rule: no answer if the prescription record is older than a set limit |
| 3 Question check | Emergency described in words the list misses (for example, in Malay or Tamil) | Patient delays emergency care | Test the word list in all four languages; err on the side of escalation; review missed cases weekly |
| 4 Search | Wrong leaflet or overdue leaflet retrieved | Wrong instruction given with confidence | Leaflet freshness check; test questions in patients' own words; log retrieved passages |
| 5 Model | Bends or adds to the passage (hallucination) | Unsafe instruction | Answer check on doses and times (step 6); "no source, no answer" |
| 6 Answer check | Only checks numbers, not meaning (for example "do take" vs "do not take") | Unsafe instruction passes the check | Add negation and warning checks; pharmacist review sample |
| 7 Screen | Patient ignores "Ask a pharmacist" | Patient acts alone on a weak answer | Show uncertainty plainly; pharmacist reply target |
| 8 Review | Sample too small or nobody owns it | Errors accumulate unseen | Named owner, sample size, harmful-error threshold that pauses the service |

Revisit triggers that score well are measurable: harmful errors above a set number per 1,000 in weekly review; Core price up more than a set percentage; Core no longer processed in Singapore; translation coverage reaching 100% (which may allow routing changes); a request to let the assistant take actions such as reordering medicines.

### 3.3 Predictor · error figures per 10,000 appointments

| Option | Flagged | Precision | Recall | False alarm rate | Net · calls | Net per year · calls | Net per year · overbooking |
|---|---|---|---|---|---|---|---|
| Rule | 1,400 | 37.1% | 47.3% | 9.9% | 5,160 | 474,720 | −2,704,800 |
| Model, high | 1,000 | 45.0% | 40.9% | 6.2% | 5,100 | 469,200 | −1,173,000 |
| Model, low | 2,500 | 30.8% | 70.0% | 19.4% | 6,360 | 585,120 | −6,361,800 |
| Call everyone | 10,000 | 11.0% | 100% | 100% | −10,200 | −938,400 | −44,574,000 |

Calls: correct flags × 40% × S$45 − flagged × S$3. Overbooking: correct flags × S$45 − false alarms × S$60. Per year = × 92.

### 3.4 What a strong ADR-002 concludes

- **Calls:** a missed case costs about S$45; a false alarm costs about S$3 and is mostly welcome. Favour **recall**. The low threshold gives the most value.
- **Overbooking:** every option loses money in the pack's figures, and false alarms fall on patients who did attend. **Do not overbook on the model's say-so.**
- **Model versus rule (calls):** low threshold beats the rule by about S$110,000 a year. Against S$120,000 to build and S$15,000 a year, payback is a little over a year. Strong learners say so plainly and treat it as a marginal case, not an obvious win. Choosing the rule is defensible if argued from cost, simplicity and fairness.
- **Capacity:** the low threshold means about 230,000 calls a year. Strong learners ask whether staff can make them (this is a viva new fact, see 6.3).
- **Fairness:** at the low threshold, patients 65 and over get false alarms at 36% versus 15%. Acceptable for supportive calls, especially with the Director of Operations' view; unacceptable for overbooking. Safeguards: the model's flag can only trigger supportive contact; monitor false alarm rates by age group monthly; consider calling scripts that offer help (transport, rebooking) rather than warnings.

---

## 4. Marking the decision record (60%)

Score each criterion 0–4. Equal weights. Scale the total (out of 16) to a percentage for the dashboard. Any criterion at 0–1 → return for rewrite before grading.

| Criterion | 4 · Distinction | 3 · Merit | 2 · Pass | 0–1 · Rewrite |
|---|---|---|---|---|
| **Decision quality** | Specific design, model and threshold in each record; follows from ranked drivers; real reasons for each rejected option; a hybrid (routing some questions to a pharmacist) considered | Clear decisions; rejections reasoned but thin; no hybrid | Decision present but generic ("use RAG") or not linked to drivers | No decision, or a choice that breaks a fixed rule (Summit, or fine-tuning with no plan for the one-week rule) without acknowledging it |
| **Evidence** | Costs correct and shown, including one-off and retraining costs; pilot results by question type and language used; model compared with rule with the cost of the model counted; assumptions labelled | Costs mostly correct; main pilot figures used; rule mentioned | Some figures, some errors; mostly adjectives | Costs missing or badly wrong; no figures |
| **Risk handling** | ≥5 failure points with matching safeguards, rule versus person stated; harms and who bears them; fairness finding addressed with a concrete safeguard; measurable revisit triggers | ≥4 failure points; fairness mentioned; triggers present but vague | Risks listed without safeguards | Risks absent |
| **Communication** | CIO could act in five minutes; ≤3 pages; decisions up front; plain language; acronyms spelled out | Clear but long or buried decisions | Hard to follow | Unreadable or far over length |

Common errors to watch for:

- Calculating cost per question but forgetting to multiply by volume, or forgetting fixed monthly costs.
- Treating fine-tuning's low token price as its total cost.
- Confusing precision and recall, or reporting "accuracy".
- Choosing the low threshold for overbooking.
- Ignoring the data-location rule.

---

## 5. End-of-module test paper and marking guide (25%)

**Send learners only the "Paper" section.** 30 minutes, closed book, basic calculator allowed, taken once. 25 marks.

### 5.1 Paper

**Part 1 · Yes or No (1 mark each)**

1. Does a longer prompt always produce a better answer?
2. Is the cost of a large language model (LLM) request usually calculated separately for input tokens and output tokens?
3. Can a retrieval system give a wrong answer even when the correct document is in its library?
4. Is fine-tuning mainly useful for changing a model's style, format or behaviour, rather than adding facts that change often?
5. If only 1% of cases are positive, does a classifier with 99% accuracy necessarily perform well?
6. Is recall the share of flagged cases that turned out to be truly positive?
7. Should an architecture decision record list the options that were rejected?
8. Is response time affected by the size of the model and the amount of text it must read?
9. When a false alarm triggers a costly action, should you generally raise the threshold?
10. Is an agent that can act on its own appropriate whenever it saves staff time?

**Part 2 · Short answer (3 marks each)**

*Scenario.* Meridian Travel Insurance (fictional) handles 40,000 claims a year. It is considering two AI features. **Feature 1:** a claims-help assistant that answers customers' questions about what their policy covers. There are 12 policy versions in use, and the wording changes every year. **Feature 2:** a fraud-flagging model. 2% of claims are fraudulent. In testing, the model flagged 1,000 of the 40,000 claims, of which 500 were fraudulent. Flagged claims are held for investigation, which delays payment by about three weeks.

11. Which approach would you recommend for Feature 1: prompting only, retrieval, or fine-tuning? Give two reasons.
12. Calculate the fraud model's precision and recall. Show your working.
13. Who bears the cost of a false alarm in Feature 2, and who bears the cost of a missed fraud? Which matters more here, and what would you do about it?
14. Each Feature 1 question uses 2,500 input tokens and 300 output tokens. The model costs S$3 per million input tokens and S$15 per million output tokens. What is the cost per 1,000 questions? Show your working.
15. Name three points where Feature 1 could fail and one safeguard for each.

### 5.2 Answers and marking guide

**Part 1 key:** 1 No · 2 Yes · 3 Yes · 4 Yes · 5 No · 6 No · 7 Yes · 8 Yes · 9 Yes · 10 No

**Q11 (3 marks).** Retrieval. 1 mark for choosing retrieval. 1 mark each, up to 2, for reasons such as: wording changes yearly, so documents can be swapped without retraining; 12 versions mean the right version must be retrieved for each customer; customers and complaint handlers need to see the clause the answer came from; prompting only would answer from general insurance knowledge. A well-argued case for prompting only or fine-tuning scores at most 1.

**Q12 (3 marks).** Fraudulent claims = 2% × 40,000 = 800 (1 mark). Precision = 500 ÷ 1,000 = 50% (1 mark). Recall = 500 ÷ 800 = 62.5% (1 mark). Award method marks if the base-rate step is right but arithmetic slips.

**Q13 (3 marks).** False alarm: an honest customer waits three weeks for payment, possibly while abroad or out of pocket; also complaint and trust costs for Meridian (1 mark). Missed fraud: Meridian pays a false claim; cost spread across honest customers through premiums (1 mark). Judgement with an action (1 mark), for example: with 500 honest customers delayed for every 500 frauds caught, the false alarm cost is serious, so use the flag to trigger a quick check rather than a three-week hold, or raise the threshold, or fast-track low-value claims.

**Q14 (3 marks).** Input: 2,500 × 3 = 7,500 (1 mark). Output: 300 × 15 = 4,500 (1 mark). (7,500 + 4,500) ÷ 1,000,000 = S$0.012 per question, so **S$12 per 1,000 questions** (1 mark).

**Q15 (3 marks).** 1 mark per failure point with a matching safeguard, up to 3. Examples: wrong policy version retrieved → match the customer's policy number before search; outdated wording → document owner and review date; model overstates cover → answer check that cover statements quote the clause, and "this is not a claim decision" wording; out-of-scope question (for example, a claim dispute) → question check that hands over to staff; nobody reviews logs → named reviewer and weekly sample.

---

## 6. Viva guide (15%)

10 minutes. Learner has their decision record. Assessor has this guide and one new-fact card.

### 6.1 Running order

| Minutes | Assessor does | Listen for |
|---|---|---|
| 0–2 | "Explain both decisions in your own words, without reading." | Design, model, threshold and action named; reasons given in plain language |
| 2–7 | Probe questions (pick 3–4 from 6.2) | Evidence from the pack; correct use of precision, recall and cost; honest about assumptions |
| 7–10 | Read one new-fact card (6.3). "Does this change either decision? Why?" | Reasoned update, not a reflex; knows what stays the same |

### 6.2 Probe questions

1. Why not Summit? It scored highest.
2. Walk me through the monthly cost of your chosen design.
3. Your design costs S$X a month in tokens. Is that the number the board should worry about? What is?
4. The one harmful error came from an overdue leaflet. Whose problem is that, and who fixes it?
5. Explain precision and recall to me as if I were the Director of Operations.
6. Who bears a false alarm from the predictor, and does that change with the action?
7. Is the model worth S$120,000 over the rule? Convince me either way.
8. Which of your safeguards needs a person, and what happens on a busy day?

### 6.3 New-fact cards (use one per learner; rotate)

| Card | New fact | A strong response |
|---|---|---|
| **A1** | The Ministry of Health says every answer must show the approved leaflet it came from. | Confirms retrieval; rules out prompting only and fine-tuning if the learner had kept either open. Notes the "no source, no answer" check now becomes a compliance requirement. |
| **A2** | The vendor raises Core prices by 50% next quarter. | Recalculates roughly (about S$787 a month at 18,000) and says the design stands: tokens remain small next to people costs. May route simple questions to Swift. Does not switch to fine-tuning for price. |
| **A3** | Translating the remaining 30% of leaflets will take nine months. | Keeps the design; routes questions on untranslated leaflets to a pharmacist or answers in English with a clear offer of help; tracks translation coverage as a launch or widening condition. |
| **D1** | The call team can make at most 120,000 calls a year. | Recognises the low threshold needs about 230,000. At 120,000 calls (about 1,300 per 10,000), precision now matters because calls are scarce: the high threshold (1,000 per 10,000) fits and finds more no-shows per call than the rule, which needs 1,400 per 10,000. The model's case improves. |
| **D2** | The union and a patient group object to any overbooking based on predictions. | Agrees; the record should already exclude overbooking. Uses it to make "flags trigger supportive contact only" an explicit, published rule. |

### 6.4 Marking grid

Score each 0–4, then scale the total (out of 16) to a percentage.

| Criterion | 4 | 2 | 0 |
|---|---|---|---|
| Defends choices with evidence | Uses figures from the pack unprompted | Some figures when asked | Assertion only |
| Explains technical ideas plainly | Retrieval, precision, recall and cost explained accurately in plain words | Mostly right, some jargon or slips | Confused or wrong |
| Handles the new fact | Updates for a stated reason, or holds for a stated reason; knows what does not change | Updates or holds, reasoning thin | Ignores it or reverses everything |
| Clarity | Concise, structured, listens to the question | Understandable but rambling | Hard to follow |

Changing a decision for a good reason scores well. Defending a weak position stubbornly does not.

---

## 7. Setup notes

- **Files:** `module-02.html` sits alongside `module-01.html`. The dashboard entry for Module 2 now points to it.
- **Dashboard:** Module 2 writes `progress:m2` to the browser, which the dashboard already reads in preview mode. When you go live, each module page needs the same small addition planned for Module 1: write this summary to the `progress` table (see `dashboard-data-guide.md`).
- **Test paper:** copy section 5.1 into a separate document for each sitting. Do not publish it.
- **Prices are fictional by design**, so the case never goes out of date. If you later want a real-world exercise, add a lab step asking learners to look up one vendor's current prices and redo the cost table.
- **Lab:** the five leaflets describe invented medicines. Keep the "not medical advice" wording if you edit them.
- **Module 1:** this pack format can be reused for Module 1, which does not yet have a separate assessor pack with its test paper and viva cards.
