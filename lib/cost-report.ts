import { getAddOns } from "@/lib/addons";
import { getAscRate, getOppsRate, wageAdjust } from "@/lib/facility";
import { getNearbyHospitals, type NearbyHospital } from "@/lib/hospitals";
import { buildGfeLetter, buildNegotiationLetter } from "@/lib/letters";
import {
  getPopularProcedures,
  getProcedure,
  getProcedurePrice,
  getStateName,
  getZipGpci,
} from "@/lib/medicare";
import { PRODUCTS, type ReportProductId } from "@/lib/products";

export interface CostReport {
  version: 1;
  product: ReportProductId;
  generatedAt: string;
  cpt: string;
  zip: string;
  procedureName: string;
  cmsDescription: string;
  locality: string;
  state: string;
  stateName: string;
  peGpci: number;
  physician: {
    office: number;
    hospital: number;
    nationalOffice: number;
    nationalHospital: number;
  };
  facility: {
    oppsNational: number | null;
    oppsAdjusted: number | null;
    oppsStatus: string | null;
    oppsApc: string | null;
    ascNational: number | null;
    ascAdjusted: number | null;
    ascStatus: string | null;
    note: string;
  };
  episode: {
    office: number | null;
    hospitalOutpatient: number | null;
    asc: number | null;
  };
  addOns: ReturnType<typeof getAddOns>;
  hospitals: NearbyHospital[];
  schedulerScript: string;
  letters: { gfe: string; negotiation: string } | null;
  scope: string;
}

function friendlyName(code: string, fallback: string): string {
  return getPopularProcedures().find((p) => p.code === code)?.friendlyName || fallback;
}

function roundMoney(n: number): number {
  return Math.round(n * 100) / 100;
}

export function buildCostReport(input: {
  code: string;
  zip: string;
  product: ReportProductId;
}): CostReport {
  const code = input.code.trim().toUpperCase();
  const zip = input.zip.trim();
  const proc = getProcedure(code);
  const price = getProcedurePrice(code, zip);
  const gpci = getZipGpci(zip);
  if (!proc || !price || !gpci) {
    throw new Error("unknown_code_or_zip");
  }

  const product = PRODUCTS[input.product];
  const opps = getOppsRate(code);
  const asc = getAscRate(code);
  const oppsAdjusted = opps ? wageAdjust(opps.rate, gpci.peGpci) : null;
  const ascAdjusted = asc ? wageAdjust(asc.rate, gpci.peGpci) : null;
  const officeOnly = Math.abs(proc.nonFacTotal - proc.facTotal) > 0.05;

  const episodeOffice = officeOnly ? price.nonFacPrice : null;
  const episodeHospital =
    oppsAdjusted != null ? roundMoney(price.facPrice + oppsAdjusted) : null;
  const episodeAsc = ascAdjusted != null ? roundMoney(price.facPrice + ascAdjusted) : null;

  const name = friendlyName(code, proc.description);
  const schedulerScript = [
    `I need a good-faith estimate for CPT ${code} (${name}) in ZIP ${zip}.`,
    `Please split the professional fee and the facility fee, and tell me the site of service: office, hospital outpatient, or ASC.`,
    oppsAdjusted != null
      ? `Medicare's hospital outpatient facility rate for this code is about $${oppsAdjusted.toFixed(0)} in this locality, plus about $${price.facPrice.toFixed(0)} for the physician.`
      : `This code does not have a separate OPPS facility rate in the July 2026 Addendum B extract.`,
    `Please also list add-on codes you expect to bill (contrast, anesthesia, pathology, implants).`,
  ].join(" ");

  const report: CostReport = {
    version: 1,
    product: input.product,
    generatedAt: new Date().toISOString(),
    cpt: code,
    zip,
    procedureName: name,
    cmsDescription: proc.description,
    locality: gpci.locality,
    state: gpci.state,
    stateName: getStateName(gpci.state),
    peGpci: gpci.peGpci,
    physician: {
      office: price.nonFacPrice,
      hospital: price.facPrice,
      nationalOffice: price.nationalNonFacPrice,
      nationalHospital: price.nationalFacPrice,
    },
    facility: {
      oppsNational: opps?.rate ?? null,
      oppsAdjusted,
      oppsStatus: opps?.si ?? null,
      oppsApc: opps?.apc ?? null,
      ascNational: asc?.rate ?? null,
      ascAdjusted,
      ascStatus: asc?.si ?? null,
      note:
        "Facility figures are July 2026 CMS national OPPS/ASC rates, wage-adjusted with this ZIP's physician PE GPCI as a proxy for the hospital wage index. They are Medicare allowed amounts, not chargemaster or insurer-contracted rates.",
    },
    episode: {
      office: episodeOffice,
      hospitalOutpatient: episodeHospital,
      asc: episodeAsc,
    },
    addOns: getAddOns(code, zip),
    hospitals: getNearbyHospitals(zip, product.nearbyHospitalCount),
    schedulerScript,
    letters: null,
    scope:
      "This report uses public CMS files only: 2026 Medicare Physician Fee Schedule, July 2026 OPPS Addendum B, July 2026 ASC Addenda AA/BB, and Hospital Compare general information. It is not a quote, not insurance advice, and not a medical record.",
  };

  if (product.includesLetters) {
    report.letters = {
      gfe: buildGfeLetter(report),
      negotiation: buildNegotiationLetter(report),
    };
  }

  return report;
}
