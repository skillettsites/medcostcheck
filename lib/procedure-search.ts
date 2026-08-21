/**
 * Procedure search over the full CMS code catalogue.
 *
 * Why this exists: the old search substring-matched the raw query against the
 * 7,575 PFS short descriptors only. Two structural problems made most real
 * searches dead-end:
 *
 *   1. It searched the wrong universe. Labs, drugs and Category III codes live
 *      in the OPPS/ASC addenda we already ingest, so "metabolic panel" (80053),
 *      "shockwave" (0101T) and "knee gel" (J7325) could never be found even
 *      though CMS names them in files sitting in data/raw.
 *   2. CMS short descriptors are heavily abbreviated ("Inj paravert f jnt c/t
 *      1 lev", "Ct hrt w/o dye w/ca test"). A whole-phrase substring match can
 *      only succeed if the user happens to type the abbreviation, so
 *      "cervical facet injection" and "coronary calcium score" both returned
 *      nothing while the codes sat right there.
 *
 * Everything below is token-based, and every abbreviation and synonym in the
 * maps was verified to hit a real code in the catalogue before being added.
 */

import catalogueData from "@/data/processed/code-catalogue.json";
import popularData from "@/data/processed/popular-procedures.json";
import oppsData from "@/data/processed/opps-rates.json";
import ascData from "@/data/processed/asc-rates.json";

type CatalogueEntry = { d: string; s: "pfs" | "opps" | "asc"; si?: string };

const catalogue = catalogueData as Record<string, CatalogueEntry>;
const popular = popularData as Array<{ code: string; friendlyName: string; description: string }>;
const oppsRates = oppsData as Record<string, { rate: number }>;
const ascRates = ascData as Record<string, { rate: number }>;

const popularNames = new Map(popular.map((p) => [p.code, p.friendlyName]));

/** What kind of price, if any, this site can show for a code. */
export type PriceScope =
  | "pfs"        // physician fee schedule: full ZIP-level pricing
  | "facility"   // OPPS/ASC rate only: hospital or surgery-centre price
  | "lab"        // clinical lab fee schedule, not priced here
  | "drug"       // HCPCS J-code drug, priced per billing unit not per dose
  | "dental"     // ADA D-code, only payable in narrow hospital circumstances
  | "unpriced";  // in the catalogue but Medicare bundles or does not pay it

export interface SearchHit {
  code: string;
  description: string;
  friendlyName?: string;
  scope: PriceScope;
}

/**
 * Order matters. A J-code drug and an ADA dental code can both carry an OPPS
 * rate, but presenting either as a plain procedure price would mislead: a
 * J-code rate is per billing unit (J7325 Synvisc is $6.02 per mg, not per
 * injection), and Medicare only pays a D-code in narrow hospital
 * circumstances. Classify those first, then fall through to facility pricing.
 */
export function priceScope(code: string): PriceScope {
  const entry = catalogue[code];
  if (!entry) return "unpriced";
  if (entry.s === "pfs") return "pfs";
  if (/^J/.test(code)) return "drug";
  if (/^D/.test(code)) return "dental";
  if (/^8[0-9]{4}$/.test(code) || /^0[0-9]{3}U$/.test(code)) return "lab";
  if (oppsRates[code]?.rate || ascRates[code]?.rate) return "facility";
  return "unpriced";
}

/** Descriptor and source for any code in the catalogue, PFS or not. */
export function getCatalogueEntry(
  code: string
): { code: string; description: string; scope: PriceScope; oppsRate?: number; ascRate?: number } | null {
  const entry = catalogue[code.toUpperCase()];
  if (!entry) return null;
  const upper = code.toUpperCase();
  return {
    code: upper,
    description: entry.d,
    scope: priceScope(upper),
    oppsRate: oppsRates[upper]?.rate,
    ascRate: ascRates[upper]?.rate,
  };
}

/**
 * Normalise a raw query. The old route passed the query through untouched,
 * so a trailing space from a mobile keyboard or a paste out of an EOB turned
 * "99285 " into zero results while logging the trimmed "99285" as a miss.
 */
export function normaliseQuery(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9/&+.-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Split a descriptor or query into tokens, also exposing the parts of a/b forms. */
function tokenise(text: string): string[] {
  const out: string[] = [];
  for (const raw of text.toLowerCase().split(/[^a-z0-9/&+]+/).filter(Boolean)) {
    out.push(raw);
    if (raw.includes("/")) {
      for (const part of raw.split("/").filter(Boolean)) out.push(part);
    }
  }
  return out;
}

// Words that carry no signal in a procedure query.
const STOPWORDS = new Set([
  "a", "an", "the", "of", "for", "and", "or", "to", "in", "on", "with", "without",
  "my", "me", "i", "cost", "costs", "price", "prices", "pricing", "how", "much",
  "does", "do", "is", "it", "near", "average", "typical", "medicare", "what",
  "procedure", "fee", "charge", "bill",
  // Who does it, not what it is. "spine surgeon" should still find spine work.
  "surgeon", "doctor", "dr", "specialist", "clinic", "hospital", "consultant",
]);

/**
 * CMS short-descriptor abbreviations mapped to the everyday word. Each entry
 * was checked against the catalogue: the abbreviation on the right genuinely
 * appears in real descriptors.
 */
const ABBREVIATIONS: Record<string, string[]> = {
  biopsy: ["bx"],
  injection: ["inj", "njx", "insj"],
  inject: ["inj", "njx"],
  removal: ["rmvl", "rmv", "exc"],
  remove: ["rmvl", "rmv", "exc"],
  excision: ["exc"],
  repair: ["rpr"],
  fracture: ["fx"],
  treatment: ["tx", "treat"],
  diagnostic: ["dx"],
  diagnosis: ["dx"],
  nerve: ["nrv"],
  joint: ["jnt"],
  heart: ["hrt", "card", "cardiac"],
  cardiac: ["hrt", "card"],
  coronary: ["hrt", "card", "cardiac", "coronar"],
  artery: ["art", "arterial"],
  vessel: ["vsl", "blvsl"],
  calcium: ["ca"],
  level: ["lev"],
  each: ["ea"],
  additional: ["addl"],
  percutaneous: ["perq"],
  laparoscopic: ["lap"],
  laparoscopy: ["lap"],
  fusion: ["arthrd", "arthrodesis"],
  arthrodesis: ["fusion"],
  bypass: ["byp"],
  graft: ["grft"],
  management: ["mgmt"],
  endovascular: ["evasc", "evsc"],
  shockwave: ["esw"],
  lithotripsy: ["esw", "litho"],
  stimulation: ["stimj", "stim"],
  transcutaneous: ["tc"],
  ultrasound: ["us"],
  echocardiogram: ["tte", "echo"],
  echo: ["tte"],
  panel: ["pnl"],
  metabolic: ["metablc", "metab"],
  outpatient: ["o/p"],
  established: ["est"],
  replacement: ["rplcmt", "arthroplasty", "arthrp"],
  lesion: ["les"],
  drainage: ["drain", "drng"],
  cervical: ["c/t", "cerv"],
  thoracic: ["c/t", "thrc"],
  lumbar: ["l/s", "lmbr"],
  sacral: ["l/s"],
  facet: ["paravert"],
  paravertebral: ["paravert"],
  imaging: ["img", "imag"],
  image: ["img", "imag"],
  contrast: ["dye"],
  colon: ["colonoscopy"],
  kidney: ["renal"],
  abdomen: ["abd", "abdominal"],
  spine: ["spinal", "vertebral"],
};

/**
 * Everyday phrases mapped onto the CMS wording. Multi-word entries are applied
 * to the whole query before tokenising. Every target was confirmed to return
 * the intended code.
 */
const LAY_PHRASES: Record<string, string> = {
  "mri scan": "mri",
  "ct scan": "ct",
  "cat scan": "ct",
  "c-section": "cesarean delivery",
  "c section": "cesarean delivery",
  "csection": "cesarean delivery",
  "childbirth": "delivery",
  "giving birth": "delivery",
  "flu shot": "immunization admin",
  "vaccine": "immunization admin",
  "vaccination": "immunization admin",
  "checkup": "office o/p",
  "check up": "office o/p",
  "annual checkup": "office o/p",
  "annual physical": "office o/p",
  "physical exam": "office o/p",
  "wellness visit": "office o/p",
  "doctor visit": "office o/p",
  "office visit": "office o/p",
  "er visit": "emergency dept visit",
  "emergency room": "emergency dept visit",
  "coronary calcium": "ct hrt ca test",
  "calcium score": "ct hrt ca test",
  "cardiac calcium": "ct hrt ca test",
  "cardiac score": "ct hrt ca test",
  "calcium scoring": "ct hrt ca test",
  "heart scan": "ct hrt ca test",
  "facet injection": "inj paravert f jnt",
  "facet joint injection": "inj paravert f jnt",
  "cervical facet": "inj paravert f jnt c/t",
  "lumbar facet": "inj paravert f jnt l/s",
  "gel injection": "synvisc hyaluronan",
  "knee gel": "synvisc hyaluronan",
  "knee gel injection": "synvisc",
  "gel shot": "synvisc",
  "spine eval": "spine",
  "spine surgery": "arthrd spine",
  "knee injection": "drain/inj joint bursa",
  "cortisone shot": "drain/inj joint bursa",
  "steroid injection": "drain/inj joint bursa",
  "colonoscopy screening": "colonoscopy",
  "knee replacement": "total knee arthroplasty",
  "hip replacement": "total hip arthroplasty",
  "cataract surgery": "cataract",
  "shockwave therapy": "esw",
  "back surgery": "arthrd spine",
  "spinal fusion": "arthrd",
  "metabolic panel": "metabolic pnl",
  "comprehensive metabolic panel": "comprehen metabolic panel",
  "basic metabolic panel": "basic metabolic pnl",
  "physical therapy": "therapeutic exercise",
};

/** Expand one query token into every form worth matching. */
function expand(token: string): Set<string> {
  const forms = new Set<string>([token]);
  for (const alt of ABBREVIATIONS[token] ?? []) forms.add(alt);
  // Reverse direction: user typed the abbreviation, descriptor has the word.
  for (const [word, abbrs] of Object.entries(ABBREVIATIONS)) {
    if (abbrs.includes(token)) forms.add(word);
  }
  // Light singularisation so "injections" matches "injection".
  if (token.endsWith("s") && token.length > 3) forms.add(token.slice(0, -1));
  return forms;
}

// ---------------------------------------------------------------------------
// Inverted index, built once at module load.
// ---------------------------------------------------------------------------

const tokenIndex = new Map<string, string[]>();
const codeTokenCount = new Map<string, number>();

for (const [code, entry] of Object.entries(catalogue)) {
  const friendly = popularNames.get(code);
  const text = friendly ? entry.d + " " + friendly : entry.d;
  const tokens = new Set(tokenise(text));
  codeTokenCount.set(code, tokens.size);
  for (const t of tokens) {
    let list = tokenIndex.get(t);
    if (!list) tokenIndex.set(t, (list = []));
    list.push(code);
  }
}

// Sorted token list so prefix lookups can binary-search instead of scanning
// all ~13k distinct tokens on every keystroke.
const sortedTokens = [...tokenIndex.keys()].sort();

function tokensWithPrefix(prefix: string): string[] {
  let lo = 0;
  let hi = sortedTokens.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (sortedTokens[mid] < prefix) lo = mid + 1;
    else hi = mid;
  }
  const out: string[] = [];
  for (let i = lo; i < sortedTokens.length && sortedTokens[i].startsWith(prefix); i++) {
    out.push(sortedTokens[i]);
  }
  return out;
}

const CODE_PATTERN = /^[a-z0-9]{4,5}$/;
const CODE_ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * Catalogue codes one substitution away from `code`. Generating the ~180
 * variants and looking each up beats scanning all 19,000 codes.
 */
function codesWithinOneEdit(code: string, limit = 5): string[] {
  const out: string[] = [];
  for (let i = 0; i < code.length; i++) {
    for (const ch of CODE_ALPHABET) {
      if (ch === code[i]) continue;
      const variant = code.slice(0, i) + ch + code.slice(i + 1);
      if (catalogue[variant] && !out.includes(variant)) {
        out.push(variant);
        if (out.length >= limit) return out;
      }
    }
  }
  return out;
}

function applyLayPhrases(query: string): string {
  let q = query;
  // Longest phrase first so "cervical facet" beats "facet".
  const phrases = Object.keys(LAY_PHRASES).sort((a, b) => b.length - a.length);
  for (const phrase of phrases) {
    if (q.includes(phrase)) {
      q = q.replace(phrase, LAY_PHRASES[phrase]);
    }
  }
  return q;
}

function toHit(code: string): SearchHit {
  const entry = catalogue[code];
  return {
    code,
    description: entry.d,
    friendlyName: popularNames.get(code),
    scope: priceScope(code),
  };
}

/**
 * Search the catalogue. Returns ranked hits, best first.
 */
export function searchCatalogue(rawQuery: string, limit = 15): SearchHit[] {
  const normalised = normaliseQuery(rawQuery);
  if (normalised.length < 2) return [];

  // 1. Exact code. Normalisation is what makes "99285 " and " 99285" work.
  const asCode = normalised.replace(/\s+/g, "").toUpperCase();
  const exact: SearchHit[] = [];
  const looksLikeCode = CODE_PATTERN.test(asCode.toLowerCase());
  if (looksLikeCode && catalogue[asCode]) {
    exact.push(toHit(asCode));
  } else if (looksLikeCode) {
    // Code-shaped but unknown. People copy these off an itemised bill or an
    // EOB and mistype a digit, so offer the near misses instead of nothing.
    for (const near of codesWithinOneEdit(asCode)) exact.push(toHit(near));
  }

  const expanded = applyLayPhrases(normalised);
  const queryTokens = tokenise(expanded).filter((t) => !STOPWORDS.has(t));
  if (queryTokens.length === 0) return exact.slice(0, limit);

  // 2. Gather candidates from the inverted index.
  const scores = new Map<string, { score: number; matched: Set<number> }>();
  const bump = (code: string, points: number, tokenIdx: number) => {
    const s = scores.get(code) ?? { score: 0, matched: new Set<number>() };
    s.score += points;
    s.matched.add(tokenIdx);
    scores.set(code, s);
  };

  queryTokens.forEach((token, i) => {
    for (const form of expand(token)) {
      const isOriginal = form === token;
      for (const code of tokenIndex.get(form) ?? []) {
        bump(code, isOriginal ? 6 : 4, i);
      }
      // Prefix match, so a partly-typed word still ranks.
      if (form.length >= 3) {
        for (const indexed of tokensWithPrefix(form)) {
          if (indexed === form) continue;
          for (const code of tokenIndex.get(indexed) ?? []) bump(code, 1, i);
        }
      }
    }
  });

  // 3. Require most of the query to be accounted for, so unrelated codes that
  //    share one common word ("repair", "removal") do not surface. If that is
  //    too strict to return anything, step the requirement down rather than
  //    dead-end: a clinical paste like "Cervical Facet: Bilateral Levels
  //    C4/5,5/6" carries several tokens no descriptor will ever contain.
  const strictest =
    queryTokens.length <= 2 ? queryTokens.length : Math.ceil(queryTokens.length * 0.6);

  let required = strictest;
  let candidates = [...scores.entries()].filter(([, s]) => s.matched.size >= required);
  while (candidates.length === 0 && required > 1) {
    required--;
    candidates = [...scores.entries()].filter(([, s]) => s.matched.size >= required);
  }

  const ranked = candidates
    .map(([code, s]) => {
      const entry = catalogue[code];
      let score = s.score + s.matched.size * 4;
      // Prefer codes the site can actually price, and curated popular ones.
      if (entry.s === "pfs") score += 5;
      if (popularNames.has(code)) score += 8;
      // Prefer concise descriptors: they are usually the primary code.
      score -= (codeTokenCount.get(code) ?? 0) * 0.15;
      return { code, score };
    })
    .sort((a, b) => b.score - a.score);

  const seen = new Set(exact.map((h) => h.code));
  const results = [...exact];
  for (const { code } of ranked) {
    if (results.length >= limit) break;
    if (seen.has(code)) continue;
    seen.add(code);
    results.push(toHit(code));
  }
  return results;
}
