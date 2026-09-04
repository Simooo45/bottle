This file holds every standing rule for how Claude should work in this project. Read it in full at the start of every session. Every rule here is always true and must always be followed, unless the user explicitly overrides it for the current session.

## 0. Session bootstrap
At the start of every session, before doing anything else: read this file (RULES.md) and MESSAGE_IN_A_BOTTLE.md in full, in that order (see rule 2 for the other always-read file, rule 1 for the files that never do). Then check BACKLOG.md's "To triage" section: if it holds any hand-written entries, rework them into the standard format right away, don't wait for a session that happens to "touch" that area. Then, if `.claude/scripts/age-backlog.mjs` exists, run it (`node .claude/scripts/age-backlog.mjs`, and again against TEST.md/TEST_HISTORY.md if TEST.md exists) so items closed past the cutoff actually move into the history files instead of piling up in BACKLOG.md/TEST.md waiting for someone to remember to run it by hand. Close the bootstrap with a short status line for the user (not a wall of text), confirming what was read, archived, and reminding them that new requirements can always be added by hand at the bottom of BACKLOG.md (handy when running low on tokens) — they get reworked automatically the next time this file is read, or immediately on request.

## 1. History files: never read in full
BACKLOG_HISTORY.md, TEST_HISTORY.md, and CHANGELOG.md are expected to grow large over the life of the project. Never read them end to end, that burns context for no benefit. If you need historical detail, search them for the specific keyword, date, or requirement/test ID instead.

## 2. Files that always get a full read
MESSAGE_IN_A_BOTTLE.md (enforced by rule 0) and PLAN.md (read in full whenever it becomes relevant to the task at hand) are the exception to rule 1. Because they're always read whole, keep them short: only what a future session genuinely needs, never a log of everything that happened. MESSAGE_IN_A_BOTTLE.md must never exceed 200 lines. The moment it would cross that, don't trim it line by line (the least-priority-line approach loses the thread and still leaves a bloated file) — do a full rewrite of the file that condenses it back down under 100 lines. The full historical detail already lives in CHANGELOG.md, so nothing is actually lost.

## 3. BACKLOG format
The format of BACKLOG.md (checklist with section ID, priority P0-P5, open/close dates) is described in that file's own header. Always follow it as written there.

## 4. Engineering discipline: keep files small
Think about this project in an engineering, scalable way, that's what keeps it from turning into spaghetti code. Source code files should not exceed 500 lines; split into modules well before that. This is a default for every project using this system, not something to ask about.

## 5. TEST format
The format of TEST.md (a TODO-list checklist per manual test, its own ID, a link to the requirement ID(s) it verifies, open/close dates) is described in that file's own header. Always follow it as written there. When you finish work you genuinely can't verify yourself (UI/browser behavior you haven't actually driven, hardware, external services, anything needing a human's judgment), add or update a TEST.md entry instead of just claiming it works. Tests closed for more than a week get moved to TEST_HISTORY.md, same as BACKLOG.md's aging rule.

<!--
Add project-specific rules below as they come up. Number them sequentially,
starting at 6. Good candidates: workflow constraints ("never start the dev
server yourself"), formatting/tone bans, privacy rules for sensitive source
material, anything you've had to correct Claude on more than once. Each rule
here should have been learned once, not guessed upfront, that's what keeps
this file short and worth reading in full every time.
-->
