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
    <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 rounded-2xl p-6 text-white mb-8">
      <h2 className="text-lg font-bold mb-1">Add letters and PDF for $2.00</h2>
      <p className="text-sm text-blue-100 mb-4">
        Same report link. Adds a filled Good Faith Estimate request, a bill-negotiation letter, 15 nearby hospitals, and a printable download.
      </p>
      <button
        type="button"
        onClick={upgrade}
        disabled={busy}
        className="px-5 py-3 bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50 disabled:opacity-60"
      >
        {busy ? "Opening checkout…" : "Upgrade to Complete Bundle · $2.00"}
      </button>
      {error && <p className="text-xs text-red-200 mt-3">{error}</p>}
    </div>
  );
}
