import { Metadata } from "next";
import { notFound } from "next/navigation";
import CostReportView from "@/components/CostReportView";
import { isValidReportToken } from "@/lib/report-token";
import { loadStoredReport } from "@/lib/reports-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Your Cost Report",
  robots: { index: false, follow: false },
};

export default async function ReportByTokenPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  if (!isValidReportToken(token)) notFound();

  const stored = await loadStoredReport(token);
  if (!stored) {
    return (
      <div className="max-w-xl mx-auto px-5 py-16">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Report still being prepared</h1>
        <p className="mt-3 text-sm text-muted">
          Your report should be ready within a minute of payment. Refresh this page shortly.
        </p>
      </div>
    );
  }

  return <CostReportView report={stored.report} token={token} />;
}
