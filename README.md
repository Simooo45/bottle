<p align="center">
  <img src="bottle.png" width="200" alt="Bottle logo: a message in a bottle">
</p>

<h1 align="center">Bottle</h1>

<p align="center">
  <em>A message in a bottle: something you write for a future reader you'll never meet in person.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/github/license/Simooo45/bottle?style=flat-square&color=111111&cacheSeconds=3600" alt="License">
  <img src="https://img.shields.io/badge/claude%20code-plugin-111111?style=flat-square" alt="Claude Code plugin">
</p>

Every [Claude Code](https://claude.com/claude-code) session starts from zero. It can read your whole codebase in seconds, but it has no memory of what an earlier session already tried, fixed, or learned the hard way — so the same bugs get rediscovered and the same questions get asked twice. Bottle fixes that with a handful of small markdown files that every new session reads first: short enough to read in full, so nothing important gets lost or has to be explained again.

That's what makes it possible to build something big through plain conversation, not just quick one-off edits. You describe what you want in everyday language, and Claude can carry a real, multi-step project forward across many sessions — while you still stay in charge: you see the plan, you approve the direction, you decide what happens next, instead of losing track of what's being built or having to re-explain the whole project each time. Jot down a big, tangled request and Claude splits it into separate, simpler requirements on its own, so nothing gets lost inside one oversized item.

That's the line between vibecoding and actual engineering: not just prompting your way to something that happens to work and hoping you remember why, but real tracked requirements, a real changelog, and a real roadmap — a paper trail you can check the project against instead of just a feeling that it's fine.

## Get started in one minute

```
/plugin marketplace add Simooo45/bottle
```
```
/plugin install bottle@bottle
```

Send these as **two separate messages** — the install only sees the marketplace once the first one has landed. Then just say what you want:

> "Set up session continuity for this project"

and Claude reaches for the skill on its own — or invoke it directly with `/bottle:bottle`. Prefer not to touch the plugin system at all? Jump to [manual install](#manual-install-no-plugin-system), it's one `cp`.

## Before / after

**Without Bottle**
> Session 40 re-implements the payment webhook's retry logic — again without idempotency keys, the exact bug session 23 already fixed and explained in a chat log nobody will ever reopen.

**With Bottle**
> Session 40 opens by reading two small files, a few hundred lines total, and picks up exactly where session 39 left off, including the line that says *"webhook retries need idempotency keys, see PAY-014."*

## The problem

A coding session needs the context window to stay small, but it also needs to remember what past sessions learned, or it repeats the same mistakes and re-asks the same questions. Chat history doesn't survive a restart. One giant `NOTES.md` doesn't survive success either: it just grows until reading it in full costs more than it's worth.

Bottle splits project documentation into two tiers: a handful of files, capped in size, read in full every session; and archive files that grow without bound and are only ever searched, never read whole. Full reasoning and file-by-file detail lives in [SKILL.md](SKILL.md).

## Works even when Claude doesn't

**BACKLOG.md is plain markdown in your own repo, not a Claude-only format.** When your credits run out, your subscription lapses, or you just don't have Claude open, you don't have to stop: open `BACKLOG.md` in any text editor and add new requirements by hand in the "To triage" section, in whatever shorthand you want, no need to match the ID/priority/date format yourself. The next time Claude reads `RULES.md` (rule 0, every session), it reworks whatever piled up into the standard format and picks the project back up exactly where you left it. This is one of the main reasons this system exists: your project's memory is never locked behind Claude being available.

## What to expect

This isn't a "generate six files and walk away" skill. The file set is unfamiliar on a first read, so Claude interviews you briefly — project scope, language, any standing rules — and explains what each file is for *before* creating it, checking in as it goes instead of dumping everything at once. Expect a short guided back-and-forth the first time you run it in a project, not a silent file drop.

## The file set

| File | Tier | Purpose |
|---|---|---|
| `RULES.md` | small, full read every session | Standing rules that are always true |
| `MESSAGE_IN_A_BOTTLE.md` | small, full read every session | Free-form note from one session to the next |
| `PLAN.md` | small, full read when relevant | Long-term roadmap, in phases |
| `BACKLOG.md` | small-ish, full read before new work | Current requirements as a checklist |
| `BACKLOG_HISTORY.md` | archive, never read in full | Requirements closed more than a week ago |
| `TEST.md` | small-ish, read before touching a tested area | Manual tests Claude can't verify itself, TODO-style, linked to a requirement |
| `TEST_HISTORY.md` | archive, never read in full | Tests closed more than a week ago |
| `CHANGELOG.md` | archive, never read in full | Full change history, most recent first |

A small, dependency-free archival script (`scripts/age-backlog.mjs`) keeps `BACKLOG.md` (and, if present, `TEST.md`) from filling back up with closed items — Claude offers to copy it into your project during setup.

Two defaults ship in every generated `RULES.md`, not just suggestions: source files are capped at 500 lines, and `MESSAGE_IN_A_BOTTLE.md` gets a full rewrite (down to under 100 lines) the moment it would cross 200, instead of being trimmed line by line. Both exist for the same reason the rest of Bottle does: a file nobody can read in full stops being useful, whether it's docs or code.

## Manual install, no plugin system

Skills work the same whether they come from a plugin or sit directly in a skills folder:

```bash
git clone https://github.com/Simooo45/bottle.git
cp -r bottle ~/.claude/skills/bottle   # available in every project
# or
cp -r bottle .claude/skills/bottle     # this project only
```

Invoke it as `/bottle`.

## License

MIT — see [LICENSE](LICENSE).
