// Normalizes a raw thiagobodruk-format KJV JSON into public/kjv.json.
//
// Raw shape:  [{ abbrev, name, chapters: [[ "verse text", ... ], ...] }, ...]
// Output:     { translation: "KJV", books: [{ name, chapters: [[ "clean verse", ... ], ...] }, ...] }
//
// Usage: node scripts/build-kjv.mjs /tmp/kjv-tb.json
//
// The raw text encodes two things in braces:
//   - translator-supplied (italic) words, e.g. {was}, {it was}  -> keep the inner words
//   - marginal notes / cross references, e.g. {firmament: Heb. expansion} -> drop entirely
// Epistle subscriptions are wrapped in guillemets «...» -> drop entirely.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const inputPath = process.argv[2] ?? "/tmp/kjv-tb.json";
const outputPath = resolve(__dirname, "../public/kjv.json");

// A brace span is kept (as a supplied word) only if it is short and contains
// nothing but letters, spaces, apostrophes and hyphens. Anything else is a note.
const SUPPLIED = /^[A-Za-z' -]+$/;
const MAX_SUPPLIED = 30;

function normalizeVerse(raw) {
  let s = raw;
  s = s.replace(/«[^»]*»/g, " "); // drop subscriptions
  s = s.replace(/[«»]/g, " "); // drop any stray guillemets
  s = s.replace(/\{([^}]*)\}/g, (_, inner) =>
    SUPPLIED.test(inner) && inner.length <= MAX_SUPPLIED ? inner : " ",
  );
  s = s.replace(/[{}]/g, " "); // drop any unbalanced brace
  s = s.replace(/\s+([,.;:!?])/g, "$1"); // no space before punctuation
  s = s.replace(/\s+/g, " ").trim(); // collapse whitespace
  return s;
}

const raw = JSON.parse(readFileSync(inputPath, "utf-8").replace(/^﻿/, ""));

const books = raw.map((b) => ({
  name: b.name,
  chapters: b.chapters.map((ch) => ch.map(normalizeVerse)),
}));

const out = { translation: "KJV", books };
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, JSON.stringify(out));

const verses = books.reduce(
  (n, b) => n + b.chapters.reduce((m, ch) => m + ch.length, 0),
  0,
);
console.log(
  `Wrote ${books.length} books, ${verses} verses -> ${outputPath} ` +
    `(${(JSON.stringify(out).length / 1e6).toFixed(2)} MB)`,
);
