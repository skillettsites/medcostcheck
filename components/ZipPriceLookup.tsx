"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * ZIP-only lookup for a known CPT code. Used on featured procedure and
 * state×procedure pages so a visitor can get a locality rate without
 * searching again.
 */
export default function ZipPriceLookup({
  code,
  initialZip,
  label = "See the Medicare rate for your ZIP",
}: {
  code: string;
  initialZip?: string;
  label?: string;
}) {
  const [zipCode, setZipCode] = useState(initialZip || "");
  const [error, setError] = useState(false);
  const router = useRouter();
  const hasValidZip = /^\d{5}$/.test(zipCode);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!hasValidZip) {
      setError(true);
      return;
    }
    setError(false);
    router.push(`/procedure/${code}?zip=${zipCode}`);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <label className="block text-[11px] font-medium text-faint uppercase tracking-[0.08em] mb-1.5">
        {label}
      </label>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          inputMode="numeric"
          value={zipCode}
          onChange={(e) => {
            const clean = e.target.value.replace(/\D/g, "").slice(0, 5);
            setZipCode(clean);
            if (error && /^\d{5}$/.test(clean)) setError(false);
          }}
          placeholder="19103"
          maxLength={5}
          className={`field flex-1 text-center tracking-[0.28em] font-medium ${
            error ? "field-bad" : hasValidZip ? "field-ok" : ""
          }`}
        />
        <button type="submit" className="btn btn-primary whitespace-nowrap">
          Local price
        </button>
      </div>
      {error && (
        <p className="mt-2 text-xs text-red-600">
          Enter a 5-digit US ZIP code to apply the geographic adjustment.
        </p>
      )}
    </form>
  );
}
