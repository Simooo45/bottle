Every requirement in this file follows this format:

## Section
[ ] - SECTIONID-XXX [PX; o:yyyy-mm-dd; c:yyyy-mm-dd/"-"] - **Requirement title**: explanation

"XXX" is a running number and PX is the priority: P1 = blocking/highest priority, P5 = no rush. P0 is a special code meaning "drop whatever you're doing and focus on this." `o:` is the date the requirement was opened, `c:` is the date it was closed (`-` while still open).

At the bottom of this file there's a section where the user jots down new requirements by hand, in whatever shorthand they want. As soon as you read one, rework it into the standard format above, enough detail to solve it well without over-specifying the implementation, and file it under the right section, assigning a priority yourself if none was given. If an entry actually bundles more than one piece of work, split it into separate requirements instead of filing one large item, each gets its own ID so it can be prioritized, worked, and closed independently. Each section has an open `[ ]` part and a closed `[x]` part. One week after closing, move a requirement into BACKLOG_HISTORY.md, keeping the same tree structure (see that file, and the archival script if this project has one). Add new sections whenever a real new area of work shows up.

---

## General
<One-line description of what this section covers.>

**Open**

**Closed**

---

## To triage
<Space for the user to write new requirements by hand, unstructured. Claude
rewrites and files these under the right section above, then clears this
section, at the start of every session (see RULES.md rule 0), or immediately
on request.>
