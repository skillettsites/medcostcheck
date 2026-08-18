import type { CostReport } from "@/lib/cost-report";
import type { ReportProductId } from "@/lib/products";
import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET = "mcc-reports";

export interface StoredReport {
  stripeSessionId: string;
  product: ReportProductId;
  email: string | null;
  cpt: string;
  zip: string;
  createdAt: string;
  emailSent: boolean;
  report: CostReport;
}

let bucketReady: Promise<void> | null = null;

async function ensureBucket(): Promise<void> {
  if (!bucketReady) {
    bucketReady = (async () => {
      const admin = createAdminClient();
      const { data } = await admin.storage.getBucket(BUCKET);
      if (data) return;
      const { error } = await admin.storage.createBucket(BUCKET, {
        public: false,
        fileSizeLimit: 2_000_000,
      });
      if (error && !/already exists/i.test(error.message)) {
        throw new Error(`storage bucket: ${error.message}`);
      }
    })();
  }
  return bucketReady;
}

export async function saveStoredReport(token: string, payload: StoredReport): Promise<void> {
  await ensureBucket();
  const admin = createAdminClient();
  const { error } = await admin.storage.from(BUCKET).upload(`${token}.json`, JSON.stringify(payload), {
    upsert: true,
    contentType: "application/json",
  });
  if (error) throw new Error(`save report: ${error.message}`);
}

export async function loadStoredReport(token: string): Promise<StoredReport | null> {
  await ensureBucket();
  const admin = createAdminClient();
  const { data, error } = await admin.storage.from(BUCKET).download(`${token}.json`);
  if (error || !data) return null;
  const text = await data.text();
  return JSON.parse(text) as StoredReport;
}
