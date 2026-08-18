/**
 * Ingest CMS OPPS Addendum B, ASC addenda, and Hospital Compare general
 * information into compact JSON under data/processed/.
 *
 * Run: node scripts/ingest-facility-data.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const rawDir = path.join(root, "data", "raw");
const outDir = path.join(root, "data", "processed");
fs.mkdirSync(rawDir, { recursive: true });
fs.mkdirSync(outDir, { recursive: true });

function download(url, dest) {
  console.log("GET", url);
  execSync(`curl.exe -L --fail --retry 3 -A "MedCostCheck/1.0 (contact@medcostcheck.com)" -o "${dest}" "${url}"`, {
    stdio: "inherit",
  });
  const size = fs.statSync(dest).size;
  console.log("  saved", dest, size, "bytes");
  if (size < 500) {
    const head = fs.readFileSync(dest, "utf8").slice(0, 200);
    throw new Error(`Download too small, probably HTML: ${head}`);
  }
}

function unzip(zipPath, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  execSync(
    `powershell -NoProfile -Command "Expand-Archive -Force -Path '${zipPath.replace(/'/g, "''")}' -DestinationPath '${destDir.replace(/'/g, "''")}'"`,
    { stdio: "inherit" }
  );
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

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cell += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(cell);
      cell = "";
    } else if (c === "\n") {
      row.push(cell.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += c;
    }
  }
  if (cell.length || row.length) {
    row.push(cell.replace(/\r$/, ""));
    rows.push(row);
  }
  return rows;
}

function money(v) {
  if (v == null) return null;
  const n = Number(String(v).replace(/[$,\s]/g, ""));
  return Number.isFinite(n) && n > 0 ? Math.round(n * 100) / 100 : null;
}

function compactRates(files, kind) {
  const rates = {};
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (ext !== ".csv" && ext !== ".txt") continue;
    const text = fs.readFileSync(file, "utf8");
    const rows = parseCsv(text);
    if (rows.length < 2) continue;
    const headerRow = rows.findIndex((r) =>
      r.some((c) => /^hcpcs(\s+code)?$/i.test(String(c).replace(/^\uFEFF/, "").trim()))
    );
    if (headerRow < 0) {
      console.warn("skip", file, "no HCPCS header");
      continue;
    }
    const header = rows[headerRow].map((h) => h.replace(/^\uFEFF/, "").trim().toLowerCase());
    const idx = (preds) => header.findIndex((h) => preds.some((p) => p.test(h)));
    const codeI = idx([/^hcpcs/, /^code$/, /cpt/]);
    const rateI = idx([/payment[\s_]*rate/]);
    const siI = idx([/^si$/, /status[\s_]*indicator/, /payment[\s_]*indicator/, /^pi$/]);
    const apcI = idx([/^apc$/]);
    if (codeI < 0 || rateI < 0) {
      console.warn("skip", file, "headers", header.slice(0, 12));
      continue;
    }
    const dataRows = rows.slice(headerRow + 1);
    let kept = 0;
    for (const row of dataRows) {
      const code = String(row[codeI] || "").trim().toUpperCase();
      if (!/^[A-Z0-9]{4,5}$/.test(code)) continue;
      const rate = money(row[rateI]);
      if (!rate) continue;
      rates[code] = {
        rate,
        si: siI >= 0 ? String(row[siI] || "").trim() : "",
        ...(apcI >= 0 && row[apcI] ? { apc: String(row[apcI]).trim() } : {}),
      };
      kept++;
    }
    console.log(kind, path.basename(file), "kept", kept);
  }
  return rates;
}

async function ingestHospitals() {
  const csvPath = path.join(rawDir, "Hospital_General_Information.csv");
  if (!fs.existsSync(csvPath)) {
    const metaRes = await fetch(
      "https://data.cms.gov/provider-data/api/1/metastore/schemas/dataset/items/xubh-q36u?show-reference-ids=true"
    );
    if (!metaRes.ok) throw new Error(`hospital meta ${metaRes.status}`);
    const meta = await metaRes.json();
    const url = meta?.distribution?.[0]?.data?.downloadURL;
    if (!url) throw new Error("hospital dataset has no downloadURL");
    download(url, csvPath);
  }
  const text = fs.readFileSync(csvPath, "utf8");
  const rows = parseCsv(text);
  const headerRow = rows.findIndex((r) =>
    r.some((c) => /facility name/i.test(String(c)))
  );
  if (headerRow < 0) throw new Error("hospital csv missing Facility Name header");
  const header = rows[headerRow].map((h) => h.replace(/^\uFEFF/, "").trim().toLowerCase());
  const col = (re) => header.findIndex((h) => re.test(h));
  const nameI = col(/facility name/);
  const cityI = col(/^city/);
  const stateI = col(/^state$/);
  const zipI = col(/zip/);
  const ratingI = col(/overall rating$/);
  const typeI = col(/hospital type/);
  const ownI = col(/ownership/);
  const emergI = col(/emergency services/);
  const hospitals = [];
  for (const row of rows.slice(headerRow + 1)) {
    const name = String(row[nameI] || "").trim();
    const zip = String(row[zipI] || "").replace(/\D/g, "").slice(0, 5);
    const state = String(row[stateI] || "").toUpperCase();
    if (!name || zip.length !== 5 || state.length !== 2) continue;
    hospitals.push({
      name,
      city: String(row[cityI] || "").trim(),
      state,
      zip,
      rating: String(row[ratingI] || "Not Available").trim(),
      type: String(typeI >= 0 ? row[typeI] || "" : "").trim(),
      ownership: String(ownI >= 0 ? row[ownI] || "" : "").trim(),
      emergency: String(emergI >= 0 ? row[emergI] || "" : "").toLowerCase().startsWith("yes"),
    });
  }
  fs.writeFileSync(path.join(outDir, "hospitals.json"), JSON.stringify(hospitals));
  console.log("hospitals", hospitals.length);
}

async function main() {
  const oppsZip = path.join(rawDir, "opps-addendum-b.zip");
  const oppsDir = path.join(rawDir, "opps");
  const ascZip = path.join(rawDir, "asc-addenda.zip");
  const ascDir = path.join(rawDir, "asc");

  const oppsUrls = [
    "https://www.cms.gov/files/zip/july-2026-opps-addendum-b.zip",
    "https://www.cms.gov/files/zip/cy-2026-july-opps-addendum-b.zip",
    "https://www.cms.gov/files/zip/july-2026-opps-addendum-b-updated-july-21-2026.zip",
  ];
  let oppsOk = fs.existsSync(oppsZip);
  if (!oppsOk) {
    for (const url of oppsUrls) {
      try {
        download(url, oppsZip);
        oppsOk = true;
        break;
      } catch (err) {
        console.warn(String(err.message || err));
      }
    }
  }
  if (oppsOk) {
    if (!fs.existsSync(oppsDir) || findFiles(oppsDir, /\.csv$/i).length === 0) unzip(oppsZip, oppsDir);
    const oppsFiles = findFiles(oppsDir, /\.(csv|txt)$/i);
    console.log("opps files", oppsFiles.map((f) => path.basename(f)));
    const opps = compactRates(oppsFiles, "opps");
    fs.writeFileSync(path.join(outDir, "opps-rates.json"), JSON.stringify(opps));
    console.log("opps codes", Object.keys(opps).length);
  }

  const ascUrls = [
    "https://www.cms.gov/files/zip/july-2026-asc-approved-hcpcs-code-and-payment-rates.zip",
    "https://www.cms.gov/files/zip/july-2026-asc-addenda.zip",
    "https://www.cms.gov/medicare/payment/prospective-payment-systems/ambulatory-surgical-center-asc/asc-payment-rates-addenda",
  ];
  let ascOk = fs.existsSync(ascZip);
  if (!ascOk) {
    for (const url of ascUrls.slice(0, 2)) {
      try {
        download(url, ascZip);
        ascOk = true;
        break;
      } catch (err) {
        console.warn(String(err.message || err));
      }
    }
  }
  if (ascOk) {
    if (!fs.existsSync(ascDir) || findFiles(ascDir, /\.csv$/i).length === 0) unzip(ascZip, ascDir);
    const ascFiles = findFiles(ascDir, /\.(csv|txt)$/i).filter((f) =>
      /addendum aa|addendum bb/i.test(path.basename(f))
    );
    console.log("asc files", ascFiles.map((f) => path.basename(f)));
    const asc = compactRates(ascFiles, "asc");
    fs.writeFileSync(path.join(outDir, "asc-rates.json"), JSON.stringify(asc));
    console.log("asc codes", Object.keys(asc).length);
  }

  await ingestHospitals();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
