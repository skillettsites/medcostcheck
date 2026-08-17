import { CONVERSION_FACTOR } from "@/lib/medicare";

export default function DataSourceNote() {
  return (
    <div className="text-xs text-gray-400 border-t border-gray-200 pt-5">
      Data source: 2026 Medicare Physician Fee Schedule (CMS PPRRVU26B,
      released March 2026). Conversion factor: ${CONVERSION_FACTOR}. Prices
      shown are Medicare allowed amounts for the physician service and may not
      match what you are billed. Private insurance and self-pay ranges, when
      shown, are labeled estimates (typical multiples of Medicare), not quotes.
      This site is an independent cost tool, not medical advice.
    </div>
  );
}
