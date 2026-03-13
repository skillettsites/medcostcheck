/**
 * Process CMS Medicare Fee Schedule data files into optimized JSON for the app.
 *
 * Input files (in data/):
 *   - PPRRVU2026_Apr_nonQPP.csv: RVU file with procedure codes, descriptions, RVUs
 *   - GPCI2026.csv: Geographic Practice Cost Indices by locality
 *   - ZIP5_APR2026.txt: ZIP code to carrier/locality mapping (fixed-width)
 *
 * Output files (in data/processed/):
 *   - procedures.json: All payable procedures with RVUs
 *   - gpci.json: GPCI values by carrier+locality key
 *   - zip-locality.json: ZIP code to carrier+locality mapping
 *   - popular-procedures.json: Curated list of commonly searched procedures
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, '..', 'data');
const outDir = join(dataDir, 'processed');

mkdirSync(outDir, { recursive: true });

// ── 1. Parse RVU file ──
console.log('Parsing RVU file...');
const rvuRaw = readFileSync(join(dataDir, 'PPRRVU2026_Apr_nonQPP.csv'), 'utf-8');
const rvuLines = rvuRaw.split('\n');

// Header is on line 10 (0-indexed line 9)
const procedures = {};
for (let i = 10; i < rvuLines.length; i++) {
  const line = rvuLines[i].trim();
  if (!line) continue;

  // CSV parse (simple, fields don't contain commas)
  const fields = line.split(',');
  const hcpcs = fields[0]?.trim();
  const mod = fields[1]?.trim();
  const desc = fields[2]?.trim();
  const status = fields[3]?.trim();

  // Only include payable procedures (status A=active, T=injections, R=restricted)
  // Skip modifiers (26=professional component, TC=technical component)
  if (!hcpcs || !['A', 'T', 'R'].includes(status)) continue;
  if (mod === '26' || mod === 'TC') continue;
  if (mod && mod !== '') continue; // Only global (no modifier) entries

  const workRvu = parseFloat(fields[5]) || 0;
  const nonFacPeRvu = parseFloat(fields[6]) || 0;
  const facPeRvu = parseFloat(fields[8]) || 0;
  const mpRvu = parseFloat(fields[10]) || 0;
  const nonFacTotal = parseFloat(fields[11]) || 0;
  const facTotal = parseFloat(fields[12]) || 0;

  // Skip if no RVUs at all
  if (nonFacTotal === 0 && facTotal === 0) continue;

  procedures[hcpcs] = {
    code: hcpcs,
    description: desc,
    workRvu,
    nonFacPeRvu,
    facPeRvu,
    mpRvu,
    nonFacTotal,
    facTotal,
  };
}

console.log(`  ${Object.keys(procedures).length} payable procedures parsed`);
writeFileSync(join(outDir, 'procedures.json'), JSON.stringify(procedures));

// ── 2. Parse GPCI file ──
console.log('Parsing GPCI file...');
const gpciRaw = readFileSync(join(dataDir, 'GPCI2026.csv'), 'utf-8');
const gpciLines = gpciRaw.split('\n');

const gpci = {};
for (let i = 3; i < gpciLines.length; i++) {
  const line = gpciLines[i].trim();
  if (!line) continue;

  const fields = line.split(',');
  const mac = fields[0]?.trim();
  const state = fields[1]?.trim();
  const locality = fields[2]?.trim();
  const localityName = fields[3]?.trim();
  const pwGpci = parseFloat(fields[5]) || 1.0; // Use floor version (with 1.0 floor)
  const peGpci = parseFloat(fields[6]) || 1.0;
  const mpGpci = parseFloat(fields[7]) || 1.0;

  if (!mac || !locality) continue;

  // Key: carrier (MAC) + locality number, matching ZIP5 file format
  const key = `${mac}_${locality}`;
  gpci[key] = {
    state,
    localityName: localityName.replace(/\*/g, ''),
    pwGpci,
    peGpci,
    mpGpci,
  };
}

console.log(`  ${Object.keys(gpci).length} localities parsed`);
writeFileSync(join(outDir, 'gpci.json'), JSON.stringify(gpci));

// ── 3. Parse ZIP5 file ──
console.log('Parsing ZIP5 file...');
const zipRaw = readFileSync(join(dataDir, 'ZIP5_APR2026.txt'), 'utf-8');
const zipLines = zipRaw.split('\n');

const zipLocality = {};
for (const line of zipLines) {
  if (line.length < 14) continue;

  // Fixed-width: State(1-2), ZIP(3-7), Carrier(8-12), Locality(13-14)
  const state = line.substring(0, 2).trim();
  const zip = line.substring(2, 7).trim();
  const carrier = line.substring(7, 12).trim();
  const locality = line.substring(12, 14).trim();

  if (!zip || !carrier || !locality) continue;

  zipLocality[zip] = {
    state,
    carrier,
    locality,
    key: `${carrier}_${locality}`,
  };
}

console.log(`  ${Object.keys(zipLocality).length} ZIP codes mapped`);
writeFileSync(join(outDir, 'zip-locality.json'), JSON.stringify(zipLocality));

// ── 4. Popular procedures (curated for consumer search) ──
console.log('Building popular procedures list...');

const popularCodes = {
  // Imaging
  '70553': 'MRI Brain',
  '70551': 'MRI Brain Without Contrast',
  '70552': 'MRI Brain With Contrast',
  '72148': 'MRI Lumbar Spine',
  '72141': 'MRI Cervical Spine',
  '73721': 'MRI Knee',
  '73221': 'MRI Shoulder',
  '74177': 'CT Abdomen & Pelvis With Contrast',
  '74176': 'CT Abdomen & Pelvis Without Contrast',
  '71260': 'CT Chest With Contrast',
  '71250': 'CT Chest Without Contrast',
  '70553': 'MRI Brain',
  '76700': 'Ultrasound Abdomen',
  '76856': 'Ultrasound Pelvis',
  '76830': 'Ultrasound Transvaginal',
  '77067': 'Screening Mammogram',
  '77066': 'Diagnostic Mammogram',
  '71046': 'Chest X-Ray',
  '73030': 'Shoulder X-Ray',
  '73560': 'Knee X-Ray',

  // Common procedures
  '45378': 'Colonoscopy (Diagnostic)',
  '45380': 'Colonoscopy With Biopsy',
  '45385': 'Colonoscopy With Polyp Removal',
  '43239': 'Upper Endoscopy (EGD) With Biopsy',
  '43235': 'Upper Endoscopy (EGD)',
  '29881': 'Knee Arthroscopy',
  '27447': 'Total Knee Replacement',
  '27130': 'Total Hip Replacement',
  '63030': 'Lumbar Discectomy',
  '66984': 'Cataract Surgery',
  '19301': 'Partial Mastectomy',
  '47562': 'Laparoscopic Cholecystectomy',
  '49650': 'Laparoscopic Inguinal Hernia Repair',
  '58661': 'Laparoscopic Removal of Ovarian Cyst',
  '59400': 'Vaginal Delivery (Global)',
  '59510': 'Cesarean Delivery (Global)',
  '11102': 'Skin Biopsy (Tangential)',
  '11104': 'Skin Biopsy (Punch)',
  '17000': 'Destruction of Skin Lesion',
  '10060': 'Incision & Drainage of Abscess',

  // Office visits
  '99213': 'Office Visit (Established, Moderate)',
  '99214': 'Office Visit (Established, Moderate-High)',
  '99215': 'Office Visit (Established, High)',
  '99203': 'Office Visit (New, Low)',
  '99204': 'Office Visit (New, Moderate-High)',
  '99205': 'Office Visit (New, High)',
  '99385': 'Preventive Visit (18-39, New)',
  '99386': 'Preventive Visit (40-64, New)',
  '99396': 'Preventive Visit (40-64, Established)',

  // Labs/diagnostics
  '93000': 'ECG/EKG',
  '93306': 'Echocardiogram',
  '93350': 'Stress Echocardiogram',
  '78452': 'Nuclear Stress Test',
  '93880': 'Carotid Ultrasound',
  '36415': 'Blood Draw',
  '80053': 'Comprehensive Metabolic Panel',
  '85025': 'Complete Blood Count (CBC)',
  '80061': 'Lipid Panel',
  '81001': 'Urinalysis',
  '87491': 'Chlamydia Test',
  '87591': 'Gonorrhea Test',

  // Physical therapy
  '97110': 'Physical Therapy (Therapeutic Exercise)',
  '97140': 'Physical Therapy (Manual Therapy)',
  '97161': 'PT Evaluation (Low Complexity)',
  '97162': 'PT Evaluation (Moderate Complexity)',

  // Mental health
  '90834': 'Psychotherapy (45 min)',
  '90837': 'Psychotherapy (60 min)',
  '90791': 'Psychiatric Evaluation',
  '90792': 'Psychiatric Evaluation With Medical Services',

  // Dental (if available)
  // Dermatology
  '96920': 'Laser Treatment for Skin',
};

const popularProcedures = [];
for (const [code, friendlyName] of Object.entries(popularCodes)) {
  const proc = procedures[code];
  if (proc) {
    popularProcedures.push({
      code,
      friendlyName,
      description: proc.description,
      workRvu: proc.workRvu,
      nonFacTotal: proc.nonFacTotal,
      facTotal: proc.facTotal,
      // Calculate national average price (using national GPCIs of 1.0)
      nationalNonFacPrice: Math.round(proc.nonFacTotal * 33.4009 * 100) / 100,
      nationalFacPrice: Math.round(proc.facTotal * 33.4009 * 100) / 100,
    });
  }
}

// Sort by category-ish (imaging, procedures, visits, labs, therapy, mental health)
console.log(`  ${popularProcedures.length} popular procedures curated`);
writeFileSync(join(outDir, 'popular-procedures.json'), JSON.stringify(popularProcedures, null, 2));

// ── 5. Build categories ──
const categories = [
  { slug: 'imaging', name: 'Imaging & Scans', icon: '🔬', codes: ['70553','70551','70552','72148','72141','73721','73221','74177','74176','71260','71250','76700','76856','76830','77067','77066','71046','73030','73560'] },
  { slug: 'surgery', name: 'Surgery', icon: '🏥', codes: ['27447','27130','66984','47562','49650','58661','63030','19301','29881'] },
  { slug: 'procedures', name: 'Procedures', icon: '⚕️', codes: ['45378','45380','45385','43239','43235','10060','11102','11104','17000','59400','59510'] },
  { slug: 'office-visits', name: 'Office Visits', icon: '🩺', codes: ['99213','99214','99215','99203','99204','99205','99385','99386','99396'] },
  { slug: 'heart', name: 'Heart & Cardiology', icon: '❤️', codes: ['93000','93306','93350','78452','93880'] },
  { slug: 'labs', name: 'Lab Tests', icon: '🧪', codes: ['36415','80053','85025','80061','81001','87491','87591'] },
  { slug: 'physical-therapy', name: 'Physical Therapy', icon: '🏋️', codes: ['97110','97140','97161','97162'] },
  { slug: 'mental-health', name: 'Mental Health', icon: '🧠', codes: ['90834','90837','90791','90792'] },
];

writeFileSync(join(outDir, 'categories.json'), JSON.stringify(categories, null, 2));

// ── Summary ──
console.log('\nDone! Files written to data/processed/:');
console.log(`  procedures.json (${Object.keys(procedures).length} procedures)`);
console.log(`  gpci.json (${Object.keys(gpci).length} localities)`);
console.log(`  zip-locality.json (${Object.keys(zipLocality).length} ZIP codes)`);
console.log(`  popular-procedures.json (${popularProcedures.length} popular)`);
console.log(`  categories.json (${categories.length} categories)`);
