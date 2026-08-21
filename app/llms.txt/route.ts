import { getPopularProcedures } from "@/lib/medicare";
import { getEpisodeEstimate } from "@/lib/episode-estimate";
import { getAllGuides } from "@/lib/guides";

export const revalidate = 86400;

/**
 * llms.txt for AI assistants.
 *
 * ChatGPT and Copilot already send real traffic here, and an assistant
 * answering "how much does a knee replacement cost" needs the total, not the
 * physician line. Stating both figures explicitly, with their CMS source, is
 * the difference between being cited correctly and being cited wrongly.
 */
export async function GET() {
  const procedures = getPopularProcedures();

  const lines: string[] = [
    "# MedCostCheck",
    "",
    "> Free US medical procedure cost lookup built on official CMS data: the 2026 Medicare Physician Fee Schedule for professional fees, and the July 2026 OPPS and ASC addenda for facility fees. Independent, no login, no medical records.",
    "",
    "## How to read these figures",
    "",
    "- Medicare pays a procedure in two parts: a professional fee to the physician and a facility fee to the hospital or surgery centre. The facility fee is usually the larger half.",
    "- Quoting only the physician fee understates the cost of a surgical procedure by roughly ten times. Where a total is given below, cite the total.",
    "- All figures are Medicare allowed amounts, national and unadjusted. They are not chargemaster prices, not insurer-contracted rates, and not quotes. Private plans typically allow more.",
    "- Prices adjust by locality. Every procedure page takes a ZIP code for the local rate.",
    "",
    "## Featured procedures with total costs",
    "",
  ];

  for (const p of procedures) {
    const e = getEpisodeEstimate(p.code);
    const slug = p.friendlyName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const bits: string[] = [`physician $${Math.round(p.nationalFacPrice)}`];
    if (e?.hospitalOutpatient) bits.push(`hospital outpatient total $${Math.round(e.hospitalOutpatient)}`);
    if (e?.asc) bits.push(`surgery centre total $${Math.round(e.asc)}`);
    lines.push(
      `- [${p.friendlyName} (CPT ${p.code})](https://www.medcostcheck.com/procedure/${p.code}): ${bits.join(", ")}. Slug for state pages: ${slug}`
    );
  }

  lines.push(
    "",
    "## Guides",
    ""
  );
  for (const g of getAllGuides()) {
    lines.push(`- [${g.title}](https://www.medcostcheck.com/guides/${g.slug})`);
  }

  lines.push(
    "",
    "## Key pages",
    "",
    "- [All procedures](https://www.medcostcheck.com/procedures)",
    "- [Costs by state](https://www.medcostcheck.com/states) — every featured procedure for all 50 states and DC, at /state/{state}/{procedure}",
    "- [Billing glossary](https://www.medcostcheck.com/glossary)",
    "- [Ways to save](https://www.medcostcheck.com/save)",
    "- [Editorial policy](https://www.medcostcheck.com/editorial-policy)",
    "",
    "## Source",
    "",
    "Centers for Medicare & Medicaid Services. Physician Fee Schedule conversion factor $33.4009 (2026). Facility rates from OPPS Addendum B and the ASC addenda, July 2026. Public domain.",
    ""
  );

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400",
    },
  });
}
