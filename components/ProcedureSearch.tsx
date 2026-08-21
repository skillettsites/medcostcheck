"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { logSearch } from "@/lib/search-log";

type PriceScope = "pfs" | "facility" | "lab" | "drug" | "dental" | "unpriced";

interface SearchResult {
  code: string;
  description: string;
  friendlyName?: string;
  scope?: PriceScope;
}

const QUICK_START_TERMS = [
  "93306",
  "Knee Replacement",
  "Cataract Surgery",
  "Echocardiogram",
  "MRI",
  "Colonoscopy",
];

/**
 * Short label shown next to a result whose price does not come from the
 * Physician Fee Schedule, so nobody mistakes a per-unit drug rate or a
 * hospital-only rate for the price of the procedure itself.
 */
const SCOPE_LABEL: Partial<Record<PriceScope, string>> = {
  facility: "hospital rate",
  lab: "lab test",
  drug: "drug code",
  dental: "dental code",
  unpriced: "not priced",
};

export default function ProcedureSearch({ zip }: { zip?: string }) {
  const [query, setQuery] = useState("");
  const [zipCode, setZipCode] = useState(zip || "");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Queries already logged this session, so a settled search and a later click
  // on the same query do not both count.
  const loggedRef = useRef<Set<string>>(new Set());

  const hasValidZip = /^\d{5}$/.test(zipCode);
  const visibleResults = query.length < 2 ? [] : results;
  const visibleSuggestions = query.length < 2 ? [] : suggestions;

  const logOnce = useCallback(
    (raw: string, found: boolean, hits: SearchResult[], durationMs?: number) => {
      const key = raw.trim().toLowerCase();
      if (!key || loggedRef.current.has(key)) return;
      loggedRef.current.add(key);
      // A hit we can price is a 'procedure'; a real code Medicare pays under
      // another schedule is a 'reference'. Both are correct answers.
      const top = hits[0];
      const priced = !top || top.scope === "pfs" || top.scope === "facility";
      logSearch({
        query: raw.trim(),
        resultFound: found,
        searchType: found && !priced ? "reference" : "procedure",
        durationMs: durationMs ?? null,
      });
    },
    []
  );

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
    if (query.trim().length < 2) return;

    let cancelled = false;
    let settleTimer: ReturnType<typeof setTimeout> | undefined;

    const timer = setTimeout(async () => {
      setLoading(true);
      const started = Date.now();
      let hits: SearchResult[] = [];
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (cancelled) return;
        hits = data.results || [];
        setResults(hits);
        setSuggestions(data.suggestions || []);
        setShowResults(true);
      } catch {
        if (cancelled) return;
        setResults([]);
        setSuggestions([]);
        setShowResults(true);
      }
      setLoading(false);

      // Log only once the user has stopped typing long enough for this to be a
      // real search rather than a keystroke on the way to one. Changing the
      // query clears this timer, so partial words never reach the log.
      const elapsed = Date.now() - started;
      settleTimer = setTimeout(() => {
        logOnce(query, hits.length > 0, hits, elapsed);
      }, 1500);
    }, 200);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      if (settleTimer) clearTimeout(settleTimer);
    };
  }, [query, logOnce]);

  function handleQuickStart(term: string) {
    setQuery(term);
  }

  function goToProcedure(code: string) {
    setShowResults(false);
    logOnce(query.trim() || code, true, results);
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
            <div className="menu-popover p-5 text-center">
              <p className="text-muted text-sm mb-3">
                No match for &ldquo;{query}&rdquo;. Try the CPT code from your
                bill, a different wording, or one of these:
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
            <div className="menu-popover menu-popover-list">
              {!hasValidZip && (
                <div className="px-4 py-2.5 text-xs text-muted border-b border-[var(--hairline)] bg-white">
                  Add a ZIP above for a locality-adjusted rate, or open the
                  national Medicare figure now
                </div>
              )}
              {visibleResults.map((r) => {
                const label = r.scope ? SCOPE_LABEL[r.scope] : undefined;
                return (
                  <button
                    key={r.code}
                    type="button"
                    onClick={() => goToProcedure(r.code)}
                    className="w-full text-left px-4 py-3 bg-white hover:bg-[#f5f5f7] border-b border-[var(--hairline)] last:border-0 transition-colors"
                  >
                    <span className="flex items-start gap-2">
                      <span className="font-mono text-[11px] font-medium text-muted bg-canvas px-1.5 py-0.5 rounded shrink-0">
                        {r.code}
                      </span>
                      <span className="min-w-0">
                        <span className="text-ink font-medium">
                          {r.friendlyName || r.description}
                        </span>
                        {r.friendlyName && (
                          <span className="text-faint text-sm sm:ml-2 block sm:inline">
                            {r.description}
                          </span>
                        )}
                        {label && (
                          <span className="ml-2 text-[10px] uppercase tracking-[0.06em] text-faint border border-[var(--hairline)] rounded px-1.5 py-0.5 align-middle">
                            {label}
                          </span>
                        )}
                      </span>
                    </span>
                  </button>
                );
              })}
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
