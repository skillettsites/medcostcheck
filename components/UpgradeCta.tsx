"use client";

import { useState } from "react";

export default function UpgradeCta({ token }: { token: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upgrade() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: "bundle_upgrade", existing_token: token }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "checkout_failed");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start checkout");
      setBusy(false);
    }
  }

  return (
    <div className="panel mb-8">
      <h2 className="panel-title">Add letters and PDF for $2.00</h2>
      <p className="panel-sub">
        Same report link. Adds a filled Good Faith Estimate request, a bill-negotiation letter, 15 nearby hospitals, and a printable download.
      </p>
      <button type="button" onClick={upgrade} disabled={busy} className="btn btn-primary">
        {busy ? "Opening checkout…" : "Upgrade to Complete Bundle · $2.00"}
      </button>
      {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
    </div>
  );
}
