import { deriveReportToken } from "@/lib/report-token";
import CheckoutProgress from "./CheckoutProgress";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Payment received",
  robots: { index: false, follow: false },
};

export default async function CheckoutSuccess({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; product?: string; upgrade_token?: string }>;
}) {
  const params = await searchParams;
  const isUpgrade = params.product === "bundle_upgrade";
  const token = isUpgrade ? params.upgrade_token ?? null : deriveReportToken(params.session_id);

  return (
    <CheckoutProgress token={token} sessionId={params.session_id} isUpgrade={isUpgrade} />
  );
}
