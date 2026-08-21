/**
 * Build data/processed/code-catalogue.json: every HCPCS/CPT code the site has a
 * short descriptor for, from all three CMS sources already downloaded.
 *
 * procedures.json (PFS) only covers 7,575 physician-fee-schedule codes, so the
 * search box could never find labs, drugs, or Category III codes even though
 * the OPPS Addendum B and ASC addenda we already ingest list them by name.
 * That was the single biggest cause of dead-end searches.
 *
 * Run: node scripts/build-search-catalogue.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const rawDir = path.join(root, "data", "raw");
const outDir = path.join(root, "data", "processed");

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { cell += '"'; i++; }
        else inQuotes = false;
      } else cell += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n") { row.push(cell); rows.push(row); row = []; cell = ""; }
    else if (c !== "\r") cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

function findFiles(dir, re) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir, { recursive: true })) {
    const p = path.join(dir, String(name));
    if (fs.statSync(p).isFile() && re.test(p)) out.push(p);
  }
  return out;
}

const catalogue = {};

// 1. PFS is authoritative: it is the schedule the site actually prices from.
const pfs = JSON.parse(fs.readFileSync(path.join(outDir, "procedures.json"), "utf8"));
for (const [code, p] of Object.entries(pfs)) {
  catalogue[code] = { d: p.description, s: "pfs" };
}
console.log("pfs codes", Object.keys(catalogue).length);

// 2. OPPS Addendum B + ASC addenda: descriptor for every other code, including
//    the ones with no payment rate (status-indicator-only rows), which the
//    rates ingest deliberately drops.
function harvest(files, source) {
  let added = 0;
  for (const file of files) {
    const rows = parseCsv(fs.readFileSync(file, "utf8"));
    const headerRow = rows.findIndex((r) =>
      r.some((c) => /^hcpcs(\s+code)?$/i.test(String(c).replace(/^﻿/, "").trim()))
    );
    if (headerRow < 0) continue;
    const header = rows[headerRow].map((h) => h.replace(/^﻿/, "").trim().toLowerCase());
    const codeI = header.findIndex((h) => /^hcpcs/.test(h));
    const descI = header.findIndex((h) => /short\s*descriptor/.test(h));
    const siI = header.findIndex((h) => /payment\s*indicator|^si$/.test(h));
    if (codeI < 0 || descI < 0) continue;
    for (const row of rows.slice(headerRow + 1)) {
      const code = String(row[codeI] || "").trim().toUpperCase();
      const desc = String(row[descI] || "").trim();
      if (!/^[A-Z0-9]{4,5}$/.test(code) || !desc) continue;
      if (catalogue[code]) continue; // PFS wins, then first source wins
      catalogue[code] = {
        d: desc,
        s: source,
        ...(siI >= 0 && row[siI] ? { si: String(row[siI]).trim() } : {}),
      };
      added++;
    }
  }
  console.log(source, "added", added);
}

harvest(findFiles(path.join(rawDir, "opps"), /\.csv$/i), "opps");
harvest(findFiles(path.join(rawDir, "asc"), /\.csv$/i), "asc");

fs.writeFileSync(path.join(outDir, "code-catalogue.json"), JSON.stringify(catalogue));
console.log("catalogue total", Object.keys(catalogue).length);
