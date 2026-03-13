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
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

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
    setShowResults(false);
    const zipParam = zipCode ? `?zip=${zipCode}` : "";
    router.push(`/procedure/${code}${zipParam}`);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (results.length > 0) {
      handleSelect(results[0].code);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1" ref={wrapperRef}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setShowResults(true)}
            placeholder="Search procedures (e.g. MRI, colonoscopy, knee replacement)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg search-glow focus:outline-none focus:border-blue-500"
          />
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              ...
            </div>
          )}
          {showResults && results.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
              {results.map((r) => (
                <button
                  key={r.code}
                  type="button"
                  onClick={() => handleSelect(r.code)}
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-0"
                >
                  <span className="font-mono text-sm text-blue-600 mr-2">
                    {r.code}
                  </span>
                  <span className="text-gray-900">
                    {r.friendlyName || r.description}
                  </span>
                  {r.friendlyName && (
                    <span className="text-gray-500 text-sm ml-2">
                      ({r.description})
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value.replace(/\D/g, "").slice(0, 5))}
            placeholder="ZIP code"
            className="w-28 px-3 py-3 border border-gray-300 rounded-lg text-lg text-center search-glow focus:outline-none focus:border-blue-500"
            maxLength={5}
          />
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            Check Cost
          </button>
        </div>
      </div>
    </form>
  );
}
