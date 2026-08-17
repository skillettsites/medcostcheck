/**
 * Honest scope of the Medicare physician fee. Repeated generic "ways to
 * save" copy was the thin-template problem; this is the actual limitation
 * readers need on every pricing page.
 */
export default function ScopeNote({ extra }: { extra?: string }) {
  return (
    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 mb-12 text-sm text-amber-900 leading-relaxed">
      <p className="font-bold mb-1">What this number is</p>
      <p>
        The figures on this page are 2026 Medicare <em>physician</em> allowed
        amounts for a specific CPT code: the professional fee, adjusted by
        geographic practice-cost indices. They are not a hospital chargemaster
        price, not your insurer&apos;s contracted rate, and not a quote.
        Hospital facility fees, anesthesia, implants, imaging reads, and
        pathology are billed separately when they apply.
        {extra ? ` ${extra}` : ""}
      </p>
    </div>
  );
}
