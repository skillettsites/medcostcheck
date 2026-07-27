/**
 * Hand-written editorial content for all 51 states (50 + DC),
 * keyed by two-letter abbreviation: how Medicare pricing is structured
 * in that state, consumer cost context, and a ZIP-lookup note.
 */

import stateContentData from "@/data/processed/state-content.json";

export interface StateContent {
  overview: string;
  costContext: string;
  zipNote: string;
}

const stateContent = stateContentData as Record<string, StateContent>;

export function getStateContent(abbr: string): StateContent | undefined {
  return stateContent[abbr];
}
