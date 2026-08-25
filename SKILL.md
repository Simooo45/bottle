---
name: bottle
description: >
  Bootstrap a new or existing project with a small, file-based documentation
  system so Claude Code keeps context, lessons, and decisions across session
  restarts instead of starting cold every time. Sets up a handful of
  markdown files under .claude/ (standing rules, a free-form note to your
  next session, a phased roadmap, a prioritized backlog, and searchable
  history/changelog archives) sized and split so the files read every
  session stay small while the archives grow without ever costing context.
  Use this whenever someone is starting a new project and asks how to
  structure it for long-running AI-assisted work, wants Claude to "remember"
  things between sessions without relying on chat history, asks for a
  CLAUDE.md + backlog + changelog setup, mentions "session continuity",
  "persistent context", "project memory system", or is retrofitting an
  existing codebase that has no such system yet. Also use to explain or
  extend an already-bootstrapped bottle system (add a rule, start the
  archival script, add a new backlog section).
license: MIT
---

# Bottle

A message in a bottle: something you write for a future reader you'll never
meet in person, because by the time they read it you'll have no memory of
writing it. That's exactly the situation every new Claude Code session is
in. This skill sets up a small, plain-markdown system so each session can
read a short, cheap briefing and pick up real continuity, without either
side needing to reread the whole project history.

## The problem this solves

A coding session has two things in tension: it needs the context window to
stay small (long context costs money and attention), and it needs to
remember what past sessions learned (or it repeats the same mistakes and
re-asks the same questions). Chat history alone doesn't survive a restart.
A single giant NOTES.md doesn't survive success either, it just grows until
reading it in full is too expensive to keep doing every session.

The fix is a **two-tier split**:

- A **small set of files, capped in size, read in full every session.**
  These carry only what a future session actually needs: standing rules,
  a short free-form note, the current roadmap. Because they're small and
  read every time, they can be trusted without re-deriving anything.
- **Archive files that grow without bound and are never read in full.**
  Full history lives here, searchable by keyword/ID/date. Nobody pays the
  cost of that size except the rare session that actually needs to dig up
  one old detail.

Everything else in this skill, the specific files, the backlog format, the
archival script, is just one working implementation of that split. Explain
the "why" above to the user before diving into file names, it's what makes
the rest make sense instead of feeling like arbitrary bureaucracy.

**This whole system works without Claude, not just with it, and that's one
of the main reasons it exists, not a footnote.** BACKLOG.md is plain
markdown in the user's own repo, not a Claude-only format. When credits run
out, the subscription lapses, or Claude just isn't open, the user can still
open BACKLOG.md in any editor and add new requirements by hand in the "To
triage" section, in whatever shorthand they want, no need to match the
ID/priority/date format themselves. The next time Claude reads RULES.md
(rule 0), it reworks whatever piled up into the standard format and picks
the project back up exactly where the user left it. Say this to the user
explicitly during setup, don't let it land as a side detail buried in a
bullet list.

## The file set

| File | Tier | Purpose |
|---|---|---|
| `RULES.md` | small, full read every session | Standing rules that are always true: workflow constraints, formatting bans, privacy rules, anything learned once that should never be relearned. Includes the bootstrap rule that makes this whole system self-enforcing (see below), plus two defaults baked into every project: a 500-line cap on source files and the MESSAGE_IN_A_BOTTLE.md rewrite rule below. |
| `MESSAGE_IN_A_BOTTLE.md` | small, full read every session | Free-form note from one session to the next: lessons that would otherwise get rediscovered, and a short map of the state of open work. Not a diary, a living summary, capped at 200 lines. If a new entry would cross that cap, the whole file gets rewritten into a condensed version under 100 lines rather than trimmed line by line. |
| `PLAN.md` | small, full read when relevant | Long-term roadmap in phases. Updated rarely (every few sessions, or at a real milestone), so it stays a stable map of direction rather than a changelog. |
| `BACKLOG.md` | small-ish, full read before new work | Current requirements as a checklist, grouped by section, each with an ID, priority, and open/close dates. Has an open part and a closed part per section, plus a "To triage" scratch area the user writes into by hand. A bundled entry (several pieces of work in one note) gets split into separate, simpler requirements when filed, each with its own ID. |
| `BACKLOG_HISTORY.md` | archive, never full read | Closed requirements older than a cutoff (default one week), moved out of BACKLOG.md to keep it short. Same tree structure, so a search still lands in context. |
| `TEST.md` | small-ish, read before touching a tested area or on request | Manual tests Claude can't verify itself (real UI/browser behavior, hardware, external services), each a TODO checklist with its own ID, linked to the requirement ID(s) it verifies, with open/close dates like BACKLOG.md. Pairs with BACKLOG.md, don't create it standalone. |
| `TEST_HISTORY.md` | archive, never full read | Tests closed more than a cutoff (default one week) ago, moved out of TEST.md the same way BACKLOG_HISTORY.md works. |
| `CHANGELOG.md` | archive, never full read | Full change history, most recent first. |
| optional domain "bible" (e.g. `FRONTEND.md`, `API.md`, `SCHEMA.md`) | small, full read before touching that domain | Only for a domain that's genuinely large, stable, and revisited often (a design system, a data contract). Don't create one speculatively, see the interview below. |

`CLAUDE.md` (or the project's existing instructions file) is what ties it
together: it must state the bootstrap rule and hold a short table pointing
to each file with when to read it, so every session, without being told,
knows to read RULES.md and MESSAGE_IN_A_BOTTLE.md first.

## Setting this up: guide, don't just generate

**This is the most important instruction in this skill.** Most people
invoking this have never seen this pattern before, and the file set above
is unfamiliar and easy to misjudge on a first read. Never generate the
files silently. Go step by step, in order, explain in one or two plain
sentences what a file is for and why it exists *before* you create it
(the table above and the "problem this solves" section are your source),
and check that the user is following before moving to the next step. A
user who ends up with six files they don't understand has been let down by
this skill, even if every file is individually correct. Keep the interview
itself short: infer what you can from context (an existing codebase, what
the user already said about the project) instead of asking about
everything, but never skip the explaining.

Ask in plain conversational text by default. Only reach for a structured
multiple-choice question tool when a step is a genuine small closed set,
like the long-running-vs-short/bounded call in step 2. Project
descriptions, standing rules, and anything else open-ended have no fixed
option list, forcing them through a choice-tool schema either errors
outright or produces a meaningless "Other" catch-all, just ask and read
the reply like the rest of the conversation.

### 1. Where and what

Confirm the project root and whether `.claude/` (or wherever the user keeps
project docs) already has any of these files, don't clobber existing rules
or backlog items, offer to fold the new structure around what's there.

**These are real, versioned project files, not session memory.** Write
them with a file-write tool to `<project-root>/.claude/<file>` (an absolute
path resolved from the confirmed project root), the same directory that
holds `.claude/settings.json` when the plugin is installed. Never use a
separate cross-session "memory" feature the harness may offer for this,
and never write to a home/user-level config directory, bottle's whole point
is files that live *in the repo*, get committed, and are readable by anyone
who clones it, not a store private to one machine or one assistant. If
after generating the files they don't show up under the project's own
`.claude/`, that's a bug in this run, not an alternate valid location.

If the project already has code and history (retrofitting, not a blank
folder), read around before asking: README, package manifest, lint/CI
config, CONTRIBUTING-style docs, `git log`. Draft the project description,
candidate RULES.md entries (conventions already enforced by tooling or CI,
not invented ones), and a first CHANGELOG.md entry or two from recent
commits, from that instead of interviewing blind. Still show the user what
you inferred and let them correct it rather than asking from scratch, that
keeps the "guide, don't just generate" spirit, it just moves the starting
point from "empty" to "draft". If you don't already have a project
description after that pass, ask for one, it seeds `PLAN.md` Phase 0 and the
top of `CLAUDE.md`.

### 2. Scope check: does this project even need the whole set?

A throwaway script or a single-session task doesn't need a roadmap. Ask (or
infer): is this long-running, multi-session work, or a short, bounded task?

- **Long-running**: create the full set.
- **Short/bounded**: `RULES.md` and `MESSAGE_IN_A_BOTTLE.md` are still
  worth having if there's any chance of a second session; skip `PLAN.md`
  and `CHANGELOG.md` until the project actually outgrows a single session.
  Easy to add later, nothing here is a one-way door.

This is the same YAGNI instinct that governs the rest of the setup: create
what the project's actual shape calls for, not the maximal template.

### 3. Language

Write the generated files in whatever language the user is talking to you
in, unless they say otherwise. Keep it consistent across all files in the
set.

### 4. Standing rules to seed RULES.md

Ask if there's anything Claude should always do or never do in this
project, project-specific conventions, a "never touch this without asking"
area, formatting rules, privacy-sensitive source material. It's completely
fine if the answer is "nothing yet", RULES.md starts with just the baked-in
defaults (rules 0-5 in the template: bootstrap, history files, always-read
files, BACKLOG format, the 500-line source-file cap, TEST format) and grows
the first time a correction actually happens. The 500-line cap and the
MESSAGE_IN_A_BOTTLE.md rewrite rule are unconditional, always true for every
project this system is set up in, don't ask about them, don't offer to drop
them. Don't invent other rules the user hasn't asked for.

### 5. Sub-areas (optional)

If the project has clearly distinct areas that will accumulate their own
backlog items (e.g. a monorepo with several sub-projects, a site with
several independently-built sections), it's fine to give BACKLOG.md more
than one section from the start, with a shared ID-prefix-per-section
convention. If it's not obvious yet, don't force it, start with one
`## General` section and split later when a second area actually appears,
BACKLOG.md sections are cheap to add and free to leave alone.

### 6. Domain bibles (optional, resist the urge)

Only propose a dedicated always-read reference file (a `FRONTEND.md`-style
design bible, an `API.md` contract doc, a `SCHEMA.md`) if the interview
surfaces a real, concrete, recurring need, large enough that repeating it
inline in RULES.md would bloat that file, and stable enough to be worth
maintaining as its own source of truth. If nothing like that comes up,
don't create one preemptively. It's easy to add later and a wrong guess now
just becomes one more empty file nobody maintains.

### 7. Confirm the thresholds

State the defaults, don't make the user ask for them: `MESSAGE_IN_A_BOTTLE.md`
capped at 200 lines (full rewrite under 100 lines on overflow, not
line-by-line trimming), source files capped at 500 lines, requirements
archived from BACKLOG.md to BACKLOG_HISTORY.md one week after closing, and
(if TEST.md exists) closed tests archived to TEST_HISTORY.md on the same
one-week cutoff. All arbitrary but battle-tested starting points, adjust
only if the user has a reason to.

## Generating the files

Copy each template from `${CLAUDE_SKILL_DIR}/templates/` into the
project's `.claude/` directory (or wherever the user's docs live) and adapt
it:

- Fill in the placeholders (`<...>` sections) with real content from the
  interview: the actual first BACKLOG section and any requirements already
  known, the actual PLAN.md Phase 0, any rules already gathered.
- If the user wants different file names, rename freely, the content
  doesn't depend on the literal name, just keep cross-references between
  files (RULES.md mentions the others by name) in sync with whatever you
  picked.
- Skip files the scope check in step 2 said to skip. Don't create
  `BACKLOG_HISTORY.md` without `BACKLOG.md`, they're a pair. Same for
  `TEST.md`/`TEST_HISTORY.md`, its entries reference BACKLOG.md requirement
  IDs, only offer it alongside BACKLOG.md, and only when the project has
  some kind of surface Claude genuinely can't verify itself (a UI, hardware,
  an external integration), not by default for every project.
- RULES.md's baked-in rules 1, 3, and 5 name BACKLOG.md/BACKLOG_HISTORY.md/
  TEST.md/TEST_HISTORY.md directly. When any of those files gets skipped,
  edit or drop the matching rule instead of leaving a reference to a file
  that doesn't exist in this project.

Then update (or create) `CLAUDE.md`:

- Add a short "mandatory bootstrap" note stating the session-start rule.
- Add the file-map table, but only the rows for files that actually exist
  in this project, don't list a file you didn't create.

If `CLAUDE.md` already has unrelated content, add these as new sections,
don't rewrite what's already there.

## The archival script

`${CLAUDE_SKILL_DIR}/scripts/age-backlog.mjs` moves `[x]` items from
BACKLOG.md into BACKLOG_HISTORY.md once they've been closed for at least
the cutoff (default 7 days), preserving the section/closed tree structure.
It's a plain Node script with no dependencies, copy it into the project
(e.g. `.claude/scripts/age-backlog.mjs`) if the project has BACKLOG.md at
all. Usage:

```
node .claude/scripts/age-backlog.mjs [backlogPath] [historyPath] [cutoffDays]
```

Defaults match the standard layout (`.claude/BACKLOG.md`,
`.claude/BACKLOG_HISTORY.md`, `7`), so `node .claude/scripts/age-backlog.mjs`
with no arguments works out of the box for a project that used the default
names. Mention to the user that running it occasionally (or wiring it into
a periodic task, if their setup supports that) is what keeps BACKLOG.md
from growing back into a wall of closed items.

The same script ages TEST.md the same way, its item shape is identical
minus the priority field, just point it at the other pair of files:

```
node .claude/scripts/age-backlog.mjs .claude/TEST.md .claude/TEST_HISTORY.md
```

Only mention this if the project actually has TEST.md.

## After setup: explain the ritual going forward

Once the files exist, tell the user plainly what happens next, this is the
part that makes the system self-sustaining instead of a one-time favor:

- Every new session reads RULES.md and MESSAGE_IN_A_BOTTLE.md in full,
  automatically, because CLAUDE.md now says to, then gives the user a short
  status line confirming the bootstrap happened (see RULES.md rule 0).
  Nobody has to remember to ask for that again, and the user always gets a
  quick reminder that this system is running.
- **The user can keep working by hand even when Claude isn't available**,
  out of credits, subscription lapsed, or just offline: write new
  requirements in BACKLOG.md's "To triage" section, in whatever shorthand
  they want. Claude reworks whatever piled up into the standard format at
  the start of the next session (rule 0 guarantees this happens, not just
  "eventually"), or immediately if asked. An entry that bundles several
  pieces of work gets split into separate, simpler requirements instead of
  being filed as one big item, each with its own ID.
- Before ending a session (or when it's clearly wrapping up a chunk of
  work), Claude should update MESSAGE_IN_A_BOTTLE.md with anything a future
  session would genuinely need, and log closed requirements in
  CHANGELOG.md/BACKLOG.md. Don't wait for the user to ask.
- PLAN.md gets touched occasionally, not every session, when there's a real
  shift in direction or a milestone lands.
- If TEST.md exists: the moment Claude finishes work it can't verify
  itself, it logs a test there instead of just asserting it works. Claude
  should offer to report open tests whenever it's useful, and treat the
  user's answer as an instruction, closing a test or opening a bug back in
  BACKLOG.md that references the failing TEST-XXX.

Offer to seed the first real content right away (the project description
into PLAN.md Phase 0, anything the user already mentioned wanting to build
as the first BACKLOG items) rather than leaving the templates empty, an
empty scaffold is much less convincing than one with real, current content
in it already.

## Guardrails

- Don't rename the metaphor away just because it's whimsical, but don't
  fight for it either, if the user wants plainer file names
  (`NOTES.md` instead of `MESSAGE_IN_A_BOTTLE.md`), that's a fine trade,
  the mechanism matters, not the label.
- Don't create every optional file "to be safe". An unused `FRONTEND.md`
  or an empty `PLAN.md` nobody updates is worse than not having it, it's a
  file future sessions will read expecting signal and find none.
- Don't retrofit an existing project's established docs into this shape
  uninvited. If a project already has a working system that isn't this
  one, that's not this skill's problem to fix.
