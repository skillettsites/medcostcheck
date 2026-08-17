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
    <form onSubmit={handleSubmit} className="w-full max-w-xl">
      <label className="block text-xs font-semibold text-blue-200/80 mb-1.5 uppercase tracking-wide">
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
          placeholder="5-digit ZIP, e.g. 19103"
          maxLength={5}
          className={`flex-1 px-4 py-3.5 rounded-xl text-lg font-semibold text-center tracking-widest transition-all focus:outline-none ${
            error
              ? "border-2 border-red-400 bg-red-50 text-red-700"
              : hasValidZip
                ? "border-2 border-green-400 bg-green-50 text-green-800"
                : "border-2 border-white/20 bg-white/10 text-white placeholder-white/40 focus:border-white/50"
          }`}
        />
        <button
          type="submit"
          className="px-6 py-3.5 bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50 transition-all whitespace-nowrap"
        >
          Local price
        </button>
      </div>
      {error && (
        <p className="mt-2 text-xs text-red-200 font-medium">
          Enter a 5-digit US ZIP code to apply the geographic adjustment.
        </p>
      )}
    </form>
  );
}
