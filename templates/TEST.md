This file tracks manual tests: things Claude can't verify itself (real browser/UI behavior it hasn't actually driven, hardware, external services, anything that needs a human's eyes or judgment) and that the user needs to run by hand. Not read in full by default, search it (or read the relevant section) when the user asks what's still open, or before touching an area that has open tests against it.

Every test follows this format:

## Section
- [ ] TEST-XXX [o:yyyy-mm-dd; c:yyyy-mm-dd/"-"] - **Test title** (refs: SECTIONID-XXX[, SECTIONID-YYY]): what to verify
  - [ ] step 1
  - [ ] step 2

"XXX" is a running number scoped to this file. `o:` is the date the test was opened, `c:` is the date it was closed (`-` while still open). `refs:` lists the BACKLOG.md/BACKLOG_HISTORY.md requirement ID(s) this test verifies, so a requirement and the way it gets checked stay linked.

Add a test here the moment you finish work you genuinely can't verify yourself, instead of just claiming it works. Ask the user which tests are still open whenever it's useful (before wrapping up, before a release, at the start of a session that touches a tested area), and take their answer as an instruction: mark a test closed (fill in `c:`), or open a bug back in BACKLOG.md that references the failing TEST-XXX. A test closed for more than a week is moved to TEST_HISTORY.md, same tree structure, same aging script as BACKLOG.md (see RULES.md rule 5 and the archival script in SKILL.md).

---

## General
<One-line description of what this section covers.>

**Open**

**Closed**
