"use client";

import { useState } from "react";
import { PRODUCTS } from "@/lib/products";

/**
 * The paid-report offer.
 *
 * The old copy sold "a full episode report for this CPT", which meant nothing
 * to a visitor and asked for money before the page had explained that the big
 * number on screen was only the surgeon's fee. It also placeholder-ed a Miami
 * ZIP on every page regardless of which state the visitor was reading about.
 *
 * The offer now leads with what the buyer cannot get for free: their own
 * locality's rate, named nearby hospitals with CMS ratings, the add-on codes
 * that land on the bill, and the letters. `placeholderZip` lets the page pass
 * a ZIP that actually belongs to the state being read.
 */
export default function PaywallCard({
  code,
  initialZip,
  placeholderZip,
  procedureName,
  stateName,
}: {
  code: string;
  initialZip?: string;
  placeholderZip?: string;
  procedureName: string;
  stateName?: string;
}) {
  const [zip, setZip] = useState(initialZip || "");
  const [busy, setBusy] = useState<"premium" | "bundle" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const hasZip = /^\d{5}$/.test(zip);

  async function buy(product: "premium" | "bundle") {
    if (!hasZip) {
      setError("Enter your 5-digit ZIP so the report uses your local rates.");
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

  const where = stateName ? `in ${stateName}` : "in your area";

  return (
    <div className="panel mb-12">
      <h2 className="panel-title">
        What will {procedureName.toLowerCase()} cost at hospitals near you?
      </h2>
      <p className="panel-sub">
        The figures above are national. Facility payments swing widely by
        locality, and the hospital you pick {where} changes the bill more than
        anything else you control.
      </p>

      <ul className="text-sm text-muted mb-6 space-y-2">
        <li>
          &middot; Your ZIP&rsquo;s wage-adjusted hospital outpatient and surgery
          centre rates, not the national average
        </li>
        <li>
          &middot; Nearby hospitals by name, with their CMS star ratings and
          whether they run an emergency department
        </li>
        <li>
          &middot; The add-on codes that typically appear on the bill for CPT{" "}
          {code}, so nothing is a surprise
        </li>
        <li>
          &middot; A word-for-word script for asking the scheduler for a
          good-faith estimate
        </li>
        <li>
          &middot; A link you can reopen and share with a partner or a billing
          advocate
        </li>
      </ul>

      <label className="block text-[11px] font-medium text-faint uppercase tracking-[0.08em] mb-1.5">
        Your ZIP code
      </label>
      <input
        type="text"
        inputMode="numeric"
        value={zip}
        maxLength={5}
        onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
        placeholder={placeholderZip || "ZIP"}
        className="field w-full sm:w-48 mb-5 text-center tracking-[0.28em] font-medium"
      />
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          type="button"
          onClick={() => buy("premium")}
          disabled={busy !== null}
          className="btn btn-primary flex-1"
        >
          {busy === "premium"
            ? "Opening…"
            : `${PRODUCTS.premium.name} · ${PRODUCTS.premium.priceFormatted}`}
        </button>
        <button
          type="button"
          onClick={() => buy("bundle")}
          disabled={busy !== null}
          className="btn btn-ghost flex-1"
        >
          {busy === "bundle"
            ? "Opening…"
            : `Add negotiation letters · ${PRODUCTS.bundle.priceFormatted}`}
        </button>
      </div>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <p className="mt-4 text-xs text-faint">
        One-off payment, no account and no subscription. You get a private link
        and an email. No medical records and no insurance card, ever.
      </p>
    </div>
  );
}
