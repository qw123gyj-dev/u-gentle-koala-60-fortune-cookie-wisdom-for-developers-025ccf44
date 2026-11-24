// Fortune Cookie Wisdom for Developers — entry program (program/v1,
// Node 22, stdlib only). Writes the one fortune-cookie line to
// $MAKEFUN_OUTPUT_DIR/entry.txt (fallback /output/entry.txt), then reads
// it back and verifies the bytes. Gates enforced before writing: exactly
// one line, 1 to MAX_CHARS characters, not only white space, no
// leading/trailing space, and no control characters (so no tab or other
// invisible character can sneak into the line). A fortune-cookie line may
// end without a period, so no sentence or trailing-punctuation rule is
// enforced.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const MAX_CHARS = 120;

const LINE =
  "Legacy code is not a mess you inherited; it is a letter from someone who was as tired as you are now.";

// The entry must be exactly one line: no newline (or carriage return)
// anywhere, so the file is a single line of text.
if (LINE.includes("\n") || LINE.includes("\r")) {
  throw new Error("Line must be exactly one line with no newline character");
}

// A fortune-cookie line is plain printable text: reject tabs and any
// other control character before the line can reach the output file.
if (/[\u0000-\u001F\u007F]/.test(LINE)) {
  throw new Error("Line must not contain control characters");
}

const trimmed = LINE.trim();
if (trimmed.length === 0) {
  throw new Error("Line must not be empty or only white space");
}
if (trimmed.length > MAX_CHARS) {
  throw new Error(
    `Line must be at most ${MAX_CHARS} characters, got ${trimmed.length}`,
  );
}
if (trimmed !== LINE) {
  throw new Error("Line must not have leading or trailing white space");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");

const back = readFileSync(outPath, "utf8");
if (back !== LINE) {
  throw new Error("Verification failed: entry.txt does not match the line");
}

const wordCount = LINE.split(/\s+/).filter(Boolean).length;

console.log(`Wrote ${outPath}: ${LINE}`);
console.log(`Characters: ${LINE.length}, words: ${wordCount}`);
