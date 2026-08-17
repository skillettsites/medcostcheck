"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface SearchResult {
  code: string;
  description: string;
  friendlyName?: string;
}

// Real, verified-to-exist searches so a first-time visitor never has to
// guess what to type. Clicking one runs the exact same search as typing it.
const QUICK_START_TERMS = [
  "93306",
  "Knee Replacement",
  "Cataract Surgery",
  "Echocardiogram",
  "MRI",
  "Colonoscopy",
];

export default function ProcedureSearch({ zip }: { zip?: string }) {
  const [query, setQuery] = useState("");
  const [zipCode, setZipCode] = useState(zip || "");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const hasValidZip = /^\d{5}$/.test(zipCode);
  const visibleResults = query.length < 2 ? [] : results;
  const visibleSuggestions = query.length < 2 ? [] : suggestions;

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
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
        setSuggestions(data.suggestions || []);
        setShowResults(true);
      } catch {
        setResults([]);
        setSuggestions([]);
        setShowResults(true);
      }
      setLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  function handleQuickStart(term: string) {
    setQuery(term);
  }

  function goToProcedure(code: string) {
    setShowResults(false);
    const dest = hasValidZip
      ? `/procedure/${code}?zip=${zipCode}`
      : `/procedure/${code}`;
    router.push(dest);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (visibleResults.length > 0) {
      goToProcedure(visibleResults[0].code);
    }
  }

  function handleZipChange(value: string) {
    setZipCode(value.replace(/\D/g, "").slice(0, 5));
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col gap-3">
        <div className="flex gap-3 items-start">
          <div className="flex-1 relative">
            <label className="block text-xs font-semibold text-blue-200/80 mb-1.5 uppercase tracking-wide">
              ZIP code (optional — for local rates)
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={zipCode}
              onChange={(e) => handleZipChange(e.target.value)}
              placeholder="e.g. 90210"
              className={`w-full px-4 py-3.5 rounded-xl text-lg font-semibold text-center tracking-widest transition-all focus:outline-none ${
                hasValidZip
                  ? "border-2 border-green-400 bg-green-50 text-green-800 focus:ring-2 focus:ring-green-300"
                  : "border-2 border-white/20 bg-white/10 text-white placeholder-white/40 focus:border-white/50 focus:ring-2 focus:ring-white/20"
              }`}
              maxLength={5}
            />
            {hasValidZip && (
              <div className="absolute right-3 top-[38px] text-green-500">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>

        <div className="relative" ref={wrapperRef}>
          <label className="block text-xs font-semibold text-blue-200/80 mb-1.5 uppercase tracking-wide">
            Procedure name or CPT code
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => visibleResults.length > 0 && setShowResults(true)}
                placeholder="e.g. 93306, echocardiogram, knee replacement"
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
              disabled={visibleResults.length === 0}
              className="px-6 py-3.5 bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50 transition-all whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
            >
              Check Cost
            </button>
          </div>

          {showResults && !loading && query.length >= 2 && visibleResults.length === 0 && (
            <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl p-5 text-center">
              <p className="text-gray-600 text-sm mb-3">
                No exact match for &ldquo;{query}&rdquo;. This tool covers
                Medicare-billed physician services, so dental, vision, and most
                routine lab panels are not in the fee schedule. Try a CPT code
                or one of these:
              </p>
              {visibleSuggestions.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {visibleSuggestions.map((s) => (
                    <button
                      key={s.code}
                      type="button"
                      onClick={() => goToProcedure(s.code)}
                      className="text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg px-3 py-1.5 transition-colors"
                    >
                      {s.friendlyName || s.description}
                    </button>
                  ))}
                </div>
              )}
              <a
                href="/procedures"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 underline"
              >
                Browse featured procedure pages
              </a>
            </div>
          )}

          {showResults && visibleResults.length > 0 && (
            <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-80 overflow-y-auto">
              {!hasValidZip && (
                <div className="px-4 py-2.5 bg-blue-50 border-b border-blue-100 text-blue-800 text-xs font-medium">
                  Add a ZIP above for a locality-adjusted rate, or open the
                  national Medicare figure now
                </div>
              )}
              {visibleResults.map((r) => (
                <button
                  key={r.code}
                  type="button"
                  onClick={() => goToProcedure(r.code)}
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

          {query.length === 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="text-xs text-blue-200/70 font-medium">Try:</span>
              {QUICK_START_TERMS.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => handleQuickStart(term)}
                  className="text-xs font-medium text-white/80 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full px-3 py-1 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
