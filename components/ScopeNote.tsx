/**
 * Honest scope of what the page's figures are and are not.
 *
 * Updated when the free pages started showing the full episode cost as well as
 * the physician line: the old wording said everything on the page was a
 * physician allowed amount, which stopped being true once the hospital
 * outpatient and surgery centre totals appeared above it.
 */
export default function ScopeNote({ extra }: { extra?: string }) {
  return (
    <div className="surface p-5 mb-12 text-sm text-muted leading-relaxed">
      <p className="font-semibold text-ink mb-1">What these numbers are</p>
      <p>
        Every figure on this page is a 2026 Medicare <em>allowed amount</em>:
        the physician line comes from the Physician Fee Schedule adjusted by
        geographic practice-cost indices, and the facility totals come from the
        CMS hospital outpatient (OPPS) and ambulatory surgery centre rates.
        None of them is a hospital chargemaster price, your insurer&apos;s
        contracted rate, or a quote. Anesthesia, pathology, imaging reads and
        follow-up care are billed under their own codes when they apply, and an
        inpatient stay is paid a different way again.
        {extra ? ` ${extra}` : ""}
      </p>
    </div>
  );
}
