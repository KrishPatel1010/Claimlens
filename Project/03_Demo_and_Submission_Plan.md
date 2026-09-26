# Demo & Submission Plan

Companion document to 01_FRD.md and 02_Technical_Spec.md.

---

## 1. Demo Video Selection Criteria

Pick candidate YouTube videos that are:
- Publicly available, reasonably short (easier to transcript-process and to show on camera)
- Making specific, checkable claims — not just general commentary
- A mix across categories:
  - 3–4 health/wellness videos (home remedies, supplements, diet claims)
  - 3–4 personal-finance videos (stock predictions, "guaranteed returns," crypto claims)
  - 2–3 general-interest videos as a control group (expected to check out fine)

**Pre-screening step (cheap, do this before full processing):** run a 1-credit SerpApi search on 2–3 of the video's most confident-sounding claims to sanity-check that the topic is actually checkable and likely to produce an interesting result, before spending the full grounding budget on the whole video.

## 2. Target Outcome Mix for the Demo Set

To make a compelling demo, the final ~10-video / ~15–20-claim dataset should include:
- At least one claim that resolves **High Confidence** (agreement, well-grounded) — proves the tool isn't just a skeptic-generator
- At least one claim that resolves **Contested** — shows the disagreement-surfacing feature clearly
- At least one claim that resolves **Unverified** — shows the tool's honesty when it can't find support
- At least one claim resolved via the **Fact Check Tools API** path specifically
- At least one claim resolved via the **SerpApi grounding fallback** path specifically

## 3. Demo Video Script (under 3 minutes, per hackathon rules)

| Time | Content |
|---|---|
| 0:00–0:20 | One-sentence problem statement on screen/narration: viral videos make unverified health/finance claims, nobody checks them in real time |
| 0:20–0:50 | Paste a video URL live, show the transcript + extracted claims appearing with timestamps |
| 0:50–1:40 | Walk through one **High Confidence** claim (show the evidence/source) and one **Contested** claim (show the disagreement side by side) |
| 1:40–2:20 | Show the **Unverified** case — demonstrate the tool refusing to guess |
| 2:20–2:50 | Quick look at the underlying cached API responses / repo structure, to make the SerpApi + Fact Check API usage visible to judges |
| 2:50–3:00 | Close on the value statement: a viewer gets a verified answer in the time it used to take to read one claim |

**Reminder from the rules:** recording quality doesn't affect judging — clarity of functionality does. Narration is optional, and the video may be sped up to fit the time limit. Test the link in an incognito window before submitting.

## 4. Submission Checklist (from the official rules)

- [ ] Public GitHub repository with the project code and clear setup instructions
- [ ] `/data/cache/` included in the repo so judges can see raw SerpApi + Fact Check API responses
- [ ] `README.md` explains which SerpApi products are used and why (required field in the submission form too)
- [ ] Demo video under 3 minutes, publicly accessible (unlisted YouTube or shareable Drive link), tested in a private/incognito window
- [ ] Track selected: **Knowledge & Public Interest**
- [ ] Disclosure: state whether the project existed before the hackathon (per this build plan, it should be built fresh — confirm before submitting)
- [ ] Disclosure: list any AI development tools used (this conversation counts — note it honestly)
- [ ] Lead participant details ready: name, email, mobile, occupation, years of experience
- [ ] Team member names + emails ready, if applicable (max 4 additional members)
- [ ] Accept the Rules and Terms & Conditions before submitting
- [ ] Submit before **October 5, 2026, 23:59 IST** — save drafts along the way, but the project isn't entered until "Submit project" is explicitly clicked

## 5. Judging Criteria Self-Check (do this before submitting)

Run through each criterion honestly and confirm the repo/demo actually demonstrates it:

| Criterion | Where it shows up in this project |
|---|---|
| Idea strength | Problem statement in README + demo opening (§3) |
| Originality | No comparable project in the SerpApi gallery combines transcript claim-extraction with Fact Check API + multi-engine grounding |
| Technical complexity | Scoring pipeline (Technical Spec §4), caching architecture, claim-matching logic |
| Usefulness | Demo shows a real flagged claim from a real video — not a synthetic example |
| Meaningful SerpApi usage | Cached raw responses in repo + README explanation trace every verdict back to a specific SerpApi call |

## 6. Suggested Build Order (for the IDE / dev session)

1. Stage 1–3: transcript fetch → claim extraction → classification (get raw claims flowing first, no scoring yet)
2. Stage 4: Fact Check Tools API integration (cheapest to test, no SerpApi credits burned)
3. Stage 5: SerpApi grounding fallback (Scholar / Finance / Search) — build and test on 2–3 credits at a time
4. Stage 6: scoring formulas (Technical Spec §4)
5. Stage 7: output UI — timestamped ledger
6. Caching layer — retrofit if not built incrementally, but ideally build alongside Stage 4–5 from the start
7. Curate and process the final demo dataset (Technical Spec §6 budget)
8. Record demo video, write README, complete submission form
