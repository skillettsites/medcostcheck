"use client";

import { useState } from "react";
import { PRODUCTS } from "@/lib/products";

export default function PaywallCard({
  code,
  initialZip,
  procedureName,
}: {
  code: string;
  initialZip?: string;
  procedureName: string;
}) {
  const [zip, setZip] = useState(initialZip || "");
  const [busy, setBusy] = useState<"premium" | "bundle" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const hasZip = /^\d{5}$/.test(zip);

  async function buy(product: "premium" | "bundle") {
    if (!hasZip) {
      setError("Enter a 5-digit ZIP first. The free physician fee stays on this page.");
      return;
    }
    setBusy(product);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, cpt: code, zip }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "checkout_failed");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start checkout");
      setBusy(null);
    }
  }

  return (
    <div className="panel mb-12">
      <h2 className="panel-title">Full episode report for this CPT</h2>
      <p className="panel-sub">
        The number above is the physician fee only. A paid report adds the hospital outpatient and ASC facility fees, nearby Hospital Compare facilities, and a link you can reopen. {procedureName} stays on the free page.
      </p>
      <label className="block text-[11px] font-medium text-faint uppercase tracking-[0.08em] mb-1.5">
        ZIP for the report
      </label>
      <input
        type="text"
        inputMode="numeric"
        value={zip}
        maxLength={5}
        onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
        placeholder="33101"
        className="field w-full sm:w-48 mb-5 text-center tracking-[0.28em] font-medium"
      />
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          type="button"
          onClick={() => buy("premium")}
          disabled={busy !== null}
          className="btn btn-primary flex-1"
        >
          {busy === "premium" ? "Opening…" : `${PRODUCTS.premium.name} · ${PRODUCTS.premium.priceFormatted}`}
        </button>
        <button
          type="button"
          onClick={() => buy("bundle")}
          disabled={busy !== null}
          className="btn btn-ghost flex-1"
        >
          {busy === "bundle" ? "Opening…" : `${PRODUCTS.bundle.name} · ${PRODUCTS.bundle.priceFormatted}`}
        </button>
      </div>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <p className="mt-4 text-xs text-faint">
        You get a noindex link at /r/… and an email. No medical records, no insurance card.
      </p>
    </div>
  );
}
