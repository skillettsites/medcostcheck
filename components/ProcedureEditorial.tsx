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
      <div className="surface p-6">
        <h2 className="text-lg font-semibold tracking-tight text-ink mb-3">
          What Is {name}?
        </h2>
        <p className="text-sm text-muted leading-relaxed">{content.whatItIs}</p>
      </div>

      <div className="surface p-6">
        <h2 className="text-lg font-semibold tracking-tight text-ink mb-4">
          What Affects the Cost
        </h2>
        <ul className="space-y-2.5">
          {content.costFactors.map((f, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-muted leading-relaxed">
              <span className="text-faint shrink-0 mt-0.5">–</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>

      {!compact && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="surface p-6">
            <h2 className="text-lg font-semibold tracking-tight text-ink mb-3">
              How It Is Billed
            </h2>
            <p className="text-sm text-muted leading-relaxed">{content.billingNotes}</p>
          </div>
          <div className="surface p-6">
            <h2 className="text-lg font-semibold tracking-tight text-ink mb-3">
              Insurance &amp; Coverage Notes
            </h2>
            <p className="text-sm text-muted leading-relaxed">{content.insuranceNotes}</p>
          </div>
        </div>
      )}

      <div className="surface p-6">
        <h2 className="text-lg font-semibold tracking-tight text-ink mb-4">
          Questions to Ask Before Booking
        </h2>
        <ul className="space-y-2.5">
          {content.questionsToAsk.map((q, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-muted leading-relaxed">
              <span className="font-medium text-faint shrink-0 tabular-nums">{i + 1}.</span>
              <span>{q}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
