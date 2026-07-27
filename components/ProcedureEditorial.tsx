import type { ProcedureContent } from "@/lib/procedure-content";

/**
 * Renders the hand-written editorial content for a curated procedure:
 * what it is, cost drivers, billing notes, insurance notes, questions to ask.
 * `compact` shows a reduced set (used on state pages, where pricing tables
 * already dominate); the full set renders on /procedure/[code].
 */
export default function ProcedureEditorial({
  name,
  content,
  compact,
}: {
  name: string;
  content: ProcedureContent;
  compact?: boolean;
}) {
  return (
    <div className="mb-12 space-y-6">
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          What Is {name}?
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">{content.whatItIs}</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500"><path d="M3 3v18h18" /><path d="M7 15l4-4 3 3 5-6" /></svg>
          What Affects the Cost
        </h2>
        <ul className="space-y-2.5">
          {content.costFactors.map((f, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600 leading-relaxed">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-blue-500 shrink-0 mt-0.5"><path d="M9 18l6-6-6-6" /></svg>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>

      {!compact && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              How It Is Billed
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">{content.billingNotes}</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              Insurance &amp; Coverage Notes
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">{content.insuranceNotes}</p>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" /></svg>
          Questions to Ask Before Booking
        </h2>
        <ul className="space-y-2.5">
          {content.questionsToAsk.map((q, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700 leading-relaxed">
              <span className="font-bold text-blue-600 shrink-0">{i + 1}.</span>
              <span>{q}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
