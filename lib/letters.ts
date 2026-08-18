import { formatPrice } from "@/lib/format";

export interface LetterInput {
  cpt: string;
  zip: string;
  procedureName: string;
  locality: string;
  state: string;
  episode: {
    office: number | null;
    hospitalOutpatient: number | null;
    asc: number | null;
  };
}

export function buildGfeLetter(report: LetterInput): string {
  const office = report.episode.office != null ? formatPrice(report.episode.office) : "n/a";
  const hospital =
    report.episode.hospitalOutpatient != null
      ? formatPrice(report.episode.hospitalOutpatient)
      : "not in OPPS for this code";
  const asc =
    report.episode.asc != null ? formatPrice(report.episode.asc) : "not an ASC-covered procedure";

  return `Subject: Good Faith Estimate request — CPT ${report.cpt} in ZIP ${report.zip}

Hello,

Please send a Good Faith Estimate under the No Surprises Act for CPT ${report.cpt} (${report.procedureName}) that I expect to receive in ZIP ${report.zip} (${report.locality}, ${report.state}).

I am asking you to itemise:
1. The CPT / HCPCS codes you will bill, including add-on codes.
2. The site of service (office, hospital outpatient, ASC, or inpatient).
3. The facility fee and the professional fee as separate lines.
4. Any implant, contrast, anesthesia, or pathology charges that typically accompany this code.
5. The cash / self-pay price if I am uninsured or going out of network.

For reference, 2026 Medicare allowed amounts for this code in this ZIP are approximately:
- Office / clinic professional episode: ${office}
- Hospital outpatient episode (physician + OPPS facility): ${hospital}
- ASC episode (physician + ASC facility): ${asc}

This is not a claim, not a guarantee of coverage, and not a request for anyone's medical record. I only need the estimate so I can compare sites of service before I schedule.

Thank you,
[Your name]
[Your phone]
`;
}

export function buildNegotiationLetter(report: LetterInput): string {
  const hospital =
    report.episode.hospitalOutpatient != null ? formatPrice(report.episode.hospitalOutpatient) : "n/a";
  const office = report.episode.office != null ? formatPrice(report.episode.office) : "n/a";

  return `Subject: Request to review charges for CPT ${report.cpt}

Hello billing department,

I am writing about charges for CPT ${report.cpt} (${report.procedureName}) related to care in ZIP ${report.zip}. I would like an itemised bill and a review of the allowed amounts.

2026 Medicare locality-adjusted figures for this code are approximately:
- Office / clinic: ${office}
- Hospital outpatient episode: ${hospital}

Please:
1. Send an itemised statement with each CPT, the billed amount, and the allowed amount.
2. Confirm the site of service and whether a facility fee was billed in addition to the professional fee.
3. Consider a prompt-pay or self-pay reduction if I am responsible for the balance.
4. Flag any codes that were unbundled from a comprehensive APC or that duplicate a professional component.

I am not sending medical records or insurance card images. I only want the numbers reconciled against the public Medicare schedule.

Thank you,
[Your name]
[Your phone]
[Account or statement number, if you have one]
`;
}
