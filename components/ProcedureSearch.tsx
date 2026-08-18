"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface SearchResult {
  code: string;
  description: string;
  friendlyName?: string;
}

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
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-[11px] font-medium text-faint uppercase tracking-[0.08em] mb-1.5">
            ZIP code — optional, for local rates
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={zipCode}
            onChange={(e) => handleZipChange(e.target.value)}
            placeholder="90210"
            className={`field text-center tracking-[0.28em] font-medium ${hasValidZip ? "field-ok" : ""}`}
            maxLength={5}
          />
        </div>

        <div className="relative" ref={wrapperRef}>
          <label className="block text-[11px] font-medium text-faint uppercase tracking-[0.08em] mb-1.5">
            Procedure name or CPT code
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => visibleResults.length > 0 && setShowResults(true)}
                placeholder="93306, echocardiogram, knee replacement"
                className="field"
              />
              {loading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-black/10 border-t-ink rounded-full animate-spin" />
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={visibleResults.length === 0}
              className="btn btn-primary sm:self-stretch whitespace-nowrap"
            >
              Check cost
            </button>
          </div>

          {showResults && !loading && query.length >= 2 && visibleResults.length === 0 && (
            <div className="absolute z-50 w-full mt-2 surface shadow-[var(--shadow)] p-5 text-center anim-rise">
              <p className="text-muted text-sm mb-3">
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
                      className="chip"
                    >
                      {s.friendlyName || s.description}
                    </button>
                  ))}
                </div>
              )}
              <a href="/procedures" className="link text-sm">
                Browse featured procedure pages
              </a>
            </div>
          )}

          {showResults && visibleResults.length > 0 && (
            <div className="absolute z-50 w-full mt-2 surface shadow-[var(--shadow)] max-h-80 overflow-y-auto anim-rise">
              {!hasValidZip && (
                <div className="px-4 py-2.5 text-xs text-muted border-b border-[var(--hairline)]">
                  Add a ZIP above for a locality-adjusted rate, or open the
                  national Medicare figure now
                </div>
              )}
              {visibleResults.map((r) => (
                <button
                  key={r.code}
                  type="button"
                  onClick={() => goToProcedure(r.code)}
                  className="w-full text-left px-4 py-3 hover:bg-black/[0.03] border-b border-[var(--hairline)] last:border-0 transition-colors"
                >
                  <span className="font-mono text-[11px] font-medium text-muted bg-canvas px-1.5 py-0.5 rounded mr-2">
                    {r.code}
                  </span>
                  <span className="text-ink font-medium">
                    {r.friendlyName || r.description}
                  </span>
                  {r.friendlyName && (
                    <span className="text-faint text-sm ml-2 hidden sm:inline">
                      {r.description}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {query.length === 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="text-xs text-faint">Try</span>
              {QUICK_START_TERMS.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => handleQuickStart(term)}
                  className="chip"
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
