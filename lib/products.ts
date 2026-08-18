/**
 * Product definitions for MedCostCheck.
 * Mirrors CarCostCheck: free lookup on the public page, then two paid
 * reports delivered as a noindex /r/{token} link (last 12 chars of the
 * Stripe session id), same as CCC and HomeBuyerCheck.
 *
 * There is no $2.99 third SKU. CCC's valuation SKU exists because it
 * buys a separate paid data feed. Every MedCostCheck data source is a
 * free CMS file, so Premium and Bundle are the whole ladder.
 */

export type ProductId = "premium" | "bundle" | "bundle_upgrade";
export type ReportProductId = "premium" | "bundle";

export interface Product {
  id: ProductId;
  name: string;
  description: string;
  priceInCents: number;
  priceFormatted: string;
  includesLetters: boolean;
  includesExtraHospitals: boolean;
  nearbyHospitalCount: number;
  reportProduct: ReportProductId;
}

export const PRODUCTS: Record<ProductId, Product> = {
  premium: {
    id: "premium",
    name: "Premium Cost Report",
    description:
      "Full episode cost for one CPT in one ZIP: physician fee, hospital outpatient and ASC facility fees, typical add-ons, five nearby hospitals, and a scheduler script. Shareable report link.",
    priceInCents: 499,
    priceFormatted: "$4.99",
    includesLetters: false,
    includesExtraHospitals: false,
    nearbyHospitalCount: 5,
    reportProduct: "premium",
  },
  bundle: {
    id: "bundle",
    name: "Complete Cost Report + Letters",
    description:
      "Everything in Premium, plus 15 nearby hospitals, good-faith-estimate and bill-negotiation letters, and a printable PDF.",
    priceInCents: 699,
    priceFormatted: "$6.99",
    includesLetters: true,
    includesExtraHospitals: true,
    nearbyHospitalCount: 15,
    reportProduct: "bundle",
  },
  bundle_upgrade: {
    id: "bundle_upgrade",
    name: "Upgrade to Complete Bundle",
    description:
      "Add letters, extra hospitals, and PDF download to an existing Premium Cost Report. Same report link.",
    priceInCents: 200,
    priceFormatted: "$2.00",
    includesLetters: true,
    includesExtraHospitals: true,
    nearbyHospitalCount: 15,
    reportProduct: "bundle",
  },
};

export const UPGRADE_TO_BUNDLE_CENTS = 200;
export const UPGRADE_TO_BUNDLE_FORMATTED = "$2.00";

export function getProduct(id: string): Product | null {
  if (id in PRODUCTS) return PRODUCTS[id as ProductId];
  return null;
}
