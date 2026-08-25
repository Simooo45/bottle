// Moves [x] items from BACKLOG.md into BACKLOG_HISTORY.md once they've been
// closed for at least CUTOFF_DAYS, preserving the same tree structure
// (section -> Closed -> items), per the rule written at the top of both
// files. Usage:
//
//   node age-backlog.mjs [backlogPath] [historyPath] [cutoffDays]
//
// Defaults: .claude/BACKLOG.md, .claude/BACKLOG_HISTORY.md, 7. Run from
// wherever those relative paths resolve correctly (usually the repo root).
//
// Same script ages TEST.md -> TEST_HISTORY.md, item shape is identical
// minus the priority field:
//
//   node age-backlog.mjs .claude/TEST.md .claude/TEST_HISTORY.md
import { readFileSync, writeFileSync } from "fs";

const BACKLOG_PATH = process.argv[2] || ".claude/BACKLOG.md";
const HISTORY_PATH = process.argv[3] || ".claude/BACKLOG_HISTORY.md";
const CUTOFF_DAYS = Number(process.argv[4] || 7);

function isoDateDaysAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}
const CUTOFF = isoDateDaysAgo(CUTOFF_DAYS);

// A block boundary: another item line, a section/subsection header, an
// **Open**/**Closed** marker, or a "---" separator. Just "starts with **" is
// NOT a boundary on its own, an addendum paragraph can start with a bold
// lead-in like "**Addendum**: ..." and still belongs to the item above it.
function isBoundary(line) {
  const t = line.trim();
  return (
    /^(## |### )/.test(line) ||
    line.startsWith("- [") ||
    t === "**Open**" ||
    t === "**Closed**" ||
    t === "---"
  );
}

const lines = readFileSync(BACKLOG_PATH, "utf8").split("\n");

// Single pass over the document: every line becomes either a "structural"
// line (header/marker/separator/open-item, kept as-is) or an "item" block (a
// closed item plus every line up to the next boundary, blank lines included,
// since addendums are often separate paragraphs). One parse feeds both
// output files so they can never disagree with each other.
const blocks = []; // { type: "structural", line } | { type: "item", section, id, closeDate, text }
let currentSection = null;
let i = 0;
while (i < lines.length) {
  const line = lines[i];
  if (/^(## |### )/.test(line)) {
    currentSection = line.trim();
    blocks.push({ type: "structural", line });
    i++;
    continue;
  }
  const itemMatch = line.match(/^- \[x\] ([A-Z]+-\d+) \[(?:P\d; )?o:[\d-]+; c:([\d-]+)\]/);
  if (itemMatch) {
    const itemLines = [line];
    i++;
    while (i < lines.length && !isBoundary(lines[i])) {
      itemLines.push(lines[i]);
      i++;
    }
    while (itemLines.length > 1 && itemLines[itemLines.length - 1].trim() === "") itemLines.pop();
    blocks.push({
      type: "item",
      section: currentSection,
      id: itemMatch[1],
      closeDate: itemMatch[2],
      text: itemLines.join("\n"),
    });
    continue;
  }
  blocks.push({ type: "structural", line });
  i++;
}

const moved = blocks.filter((b) => b.type === "item" && b.closeDate <= CUTOFF);
if (!moved.length) {
  console.log(`No requirement closed on or before ${CUTOFF} to archive.`);
  process.exit(0);
}

// Rebuild BACKLOG.md: every block verbatim except the moved items are
// dropped. Collapse a blank line that becomes doubled up where an item used
// to sit, so gaps don't grow across repeated runs, and make sure exactly one
// blank line remains before the next "---"/"##"/"###" (removing an item can
// otherwise eat its own trailing blank line and glue two sections together).
const outLines = [];
for (const b of blocks) {
  if (b.type === "item" && b.closeDate <= CUTOFF) continue;
  const text = b.type === "item" ? b.text : b.line;
  const last = outLines[outLines.length - 1];
  if (text === "" && last === "") continue;
  const t = text.trim();
  if ((t === "---" || /^(## |### )/.test(t)) && last !== undefined && last.trim() !== "") {
    outLines.push("");
  }
  outLines.push(...text.split("\n"));
}
writeFileSync(BACKLOG_PATH, outLines.join("\n"));

// Build the BACKLOG_HISTORY.md addition: same tree structure (section ->
// Closed -> items).
const bySection = new Map();
const sectionOrder = [];
for (const b of moved) {
  if (!bySection.has(b.section)) {
    bySection.set(b.section, []);
    sectionOrder.push(b.section);
  }
  bySection.get(b.section).push(b.text);
}
let historyBody = "";
for (const section of sectionOrder) {
  historyBody += `${section}\n\n**Closed**\n${bySection.get(section).join("\n")}\n\n---\n\n`;
}
historyBody = historyBody.replace(/\n---\n\n$/, "\n");

const existingHistory = readFileSync(HISTORY_PATH, "utf8");
const isEmpty = /\(empty, no .+ archived yet\)/.test(existingHistory);
const newHistory = isEmpty
  ? existingHistory.split("---\n\n")[0] + "---\n\n" + historyBody
  : existingHistory.replace(/\n$/, "") + "\n\n" + historyBody;
writeFileSync(HISTORY_PATH, newHistory);

console.log(`Archived ${moved.length} item(s) (closed on or before ${CUTOFF}): ${moved.map((b) => b.id).join(", ")}`);
