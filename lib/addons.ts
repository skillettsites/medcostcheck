import { getProcedure, getProcedurePrice } from "@/lib/medicare";

export interface AddOnLine {
  code: string;
  name: string;
  physicianOffice: number | null;
  note: string;
}

const ADDONS: Record<string, { code: string; name: string; note: string }[]> = {
  "93306": [
    { code: "93320", name: "Doppler echo, complete", note: "Often billed with a complete TTE when flow is assessed separately." },
    { code: "93325", name: "Color flow Doppler", note: "Color mapping is commonly added to a complete echo." },
  ],
  "93350": [
    { code: "93015", name: "Cardiovascular stress test", note: "The treadmill/pharmacologic stress portion is a separate code." },
  ],
  "70553": [
    { code: "70552", name: "MRI brain with contrast only", note: "Ask whether contrast is included; a with-and-without study is already 70553." },
  ],
  "27447": [
    { code: "0191T", name: "Implant / device line (example)", note: "Knee implants are usually packaged into the hospital APC, but commercial bills still itemise them." },
    { code: "99223", name: "Initial hospital visit", note: "Inpatient professional visits are extra if this is an admission." },
  ],
  "27130": [
    { code: "99223", name: "Initial hospital visit", note: "Hip replacement is typically inpatient; professional visits stack on the surgeon fee." },
  ],
  "45380": [
    { code: "88305", name: "Surgical pathology, level IV", note: "Each biopsy jar is often a separate pathology charge." },
  ],
  "45385": [
    { code: "88305", name: "Surgical pathology, level IV", note: "Removed polyps go to pathology; count the specimens." },
  ],
  "43239": [
    { code: "88305", name: "Surgical pathology, level IV", note: "EGD with biopsy usually adds at least one pathology line." },
  ],
  "77067": [
    { code: "77063", name: "Screening digital breast tomosynthesis", note: "3D/tomosynthesis is often billed with a 2D screening mammogram." },
  ],
};

const DEFAULT_NOTES = [
  { code: "", name: "Anesthesia", note: "If this is a procedure under sedation or general, anesthesia is a separate professional + facility line." },
  { code: "", name: "Contrast / drugs", note: "Imaging contrast and facility-administered drugs are often billed on top of the CPT you searched." },
];

export function getAddOns(code: string, zip: string): AddOnLine[] {
  const specific = ADDONS[code] || [];
  const lines: AddOnLine[] = specific.map((item) => {
    const price = item.code ? getProcedurePrice(item.code, zip) : null;
    const proc = item.code ? getProcedure(item.code) : null;
    return {
      code: item.code,
      name: item.name || proc?.description || item.code,
      physicianOffice: price ? price.nonFacPrice : null,
      note: item.note,
    };
  });
  for (const extra of DEFAULT_NOTES) {
    lines.push({
      code: extra.code,
      name: extra.name,
      physicianOffice: null,
      note: extra.note,
    });
  }
  return lines;
}
