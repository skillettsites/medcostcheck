"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface SearchResult {
  code: string;
  description: string;
  friendlyName?: string;
}

export default function ProcedureSearch({ zip }: { zip?: string }) {
  const [query, setQuery] = useState("");
  const [zipCode, setZipCode] = useState(zip || "");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [zipError, setZipError] = useState(false);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const zipRef = useRef<HTMLInputElement>(null);

  const hasValidZip = /^\d{5}$/.test(zipCode);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
        setShowResults(true);
      } catch {
        setResults([]);
      }
      setLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  function handleSelect(code: string) {
    if (!hasValidZip) {
      setZipError(true);
      zipRef.current?.focus();
      return;
    }
    setZipError(false);
    setShowResults(false);
    router.push(`/procedure/${code}?zip=${zipCode}`);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!hasValidZip) {
      setZipError(true);
      zipRef.current?.focus();
      return;
    }
    setZipError(false);
    if (results.length > 0) {
      handleSelect(results[0].code);
    }
  }

  function handleZipChange(value: string) {
    const clean = value.replace(/\D/g, "").slice(0, 5);
    setZipCode(clean);
    if (zipError && /^\d{5}$/.test(clean)) {
      setZipError(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col gap-3">
        {/* ZIP code row */}
        <div className="flex gap-3 items-start">
          <div className="flex-1 relative">
            <label className="block text-xs font-semibold text-blue-200/80 mb-1.5 uppercase tracking-wide">
              Your ZIP Code
            </label>
            <input
              ref={zipRef}
              type="text"
              inputMode="numeric"
              value={zipCode}
              onChange={(e) => handleZipChange(e.target.value)}
              placeholder="e.g. 90210"
              className={`w-full px-4 py-3.5 rounded-xl text-lg font-semibold text-center tracking-widest transition-all focus:outline-none ${
                zipError
                  ? "border-2 border-red-400 bg-red-50 text-red-700 focus:ring-2 focus:ring-red-300"
                  : hasValidZip
                  ? "border-2 border-green-400 bg-green-50 text-green-800 focus:ring-2 focus:ring-green-300"
                  : "border-2 border-white/20 bg-white/10 text-white placeholder-white/40 focus:border-white/50 focus:ring-2 focus:ring-white/20"
              }`}
              maxLength={5}
            />
            {zipError && (
              <p className="absolute -bottom-5 left-0 text-xs text-red-300 font-medium">
                Enter a 5-digit ZIP code first
              </p>
            )}
            {hasValidZip && (
              <div className="absolute right-3 top-[38px] text-green-500">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Procedure search row */}
        <div className="relative" ref={wrapperRef}>
          <label className="block text-xs font-semibold text-blue-200/80 mb-1.5 uppercase tracking-wide">
            Search Procedure
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => results.length > 0 && setShowResults(true)}
                placeholder="e.g. MRI, colonoscopy, knee replacement"
                className="w-full px-4 py-3.5 rounded-xl text-lg border-2 border-white/20 bg-white/10 text-white placeholder-white/40 focus:outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all"
              />
              {loading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={!hasValidZip || results.length === 0}
              className="px-6 py-3.5 bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50 transition-all whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
            >
              Check Cost
            </button>
          </div>

          {showResults && results.length > 0 && (
            <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-80 overflow-y-auto">
              {!hasValidZip && (
                <div className="px-4 py-2.5 bg-amber-50 border-b border-amber-100 text-amber-700 text-xs font-medium">
                  Enter your ZIP code above to see local pricing
                </div>
              )}
              {results.map((r) => (
                <button
                  key={r.code}
                  type="button"
                  onClick={() => handleSelect(r.code)}
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-0 transition-colors"
                >
                  <span className="font-mono text-xs font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded mr-2">
                    {r.code}
                  </span>
                  <span className="text-gray-900 font-medium">
                    {r.friendlyName || r.description}
                  </span>
                  {r.friendlyName && (
                    <span className="text-gray-400 text-sm ml-2">
                      {r.description}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
