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
    <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm mb-12">
      <h2 className="text-xl font-bold text-gray-900 mb-1">Full episode report for this CPT</h2>
      <p className="text-sm text-gray-500 mb-5">
        The number above is the physician fee only. A paid report adds the hospital outpatient and ASC facility fees, nearby Hospital Compare facilities, and a link you can reopen. {procedureName} stays on the free page.
      </p>
      <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
        ZIP for the report
      </label>
      <input
        type="text"
        inputMode="numeric"
        value={zip}
        maxLength={5}
        onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
        placeholder="33101"
        className="w-full sm:w-48 mb-4 px-4 py-3 rounded-xl border-2 border-gray-200 font-semibold tracking-widest text-center focus:outline-none focus:border-blue-500"
      />
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => buy("premium")}
          disabled={busy !== null}
          className="flex-1 px-5 py-3.5 bg-blue-700 text-white rounded-xl font-bold hover:bg-blue-800 disabled:opacity-60"
        >
          {busy === "premium" ? "Opening…" : `${PRODUCTS.premium.name} · ${PRODUCTS.premium.priceFormatted}`}
        </button>
        <button
          type="button"
          onClick={() => buy("bundle")}
          disabled={busy !== null}
          className="flex-1 px-5 py-3.5 bg-indigo-700 text-white rounded-xl font-bold hover:bg-indigo-800 disabled:opacity-60"
        >
          {busy === "bundle" ? "Opening…" : `${PRODUCTS.bundle.name} · ${PRODUCTS.bundle.priceFormatted}`}
        </button>
      </div>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <p className="mt-3 text-xs text-gray-400">
        You get a noindex link at /r/… and an email. No medical records, no insurance card.
      </p>
    </div>
  );
}
