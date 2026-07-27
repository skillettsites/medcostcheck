/**
 * Hand-written editorial content for the 59 curated popular procedures.
 * One entry per CPT code: what the procedure is, what drives its cost,
 * how it is billed, insurance nuances, and questions to ask.
 */

import procedureContentData from "@/data/processed/procedure-content.json";

export interface ProcedureContent {
  whatItIs: string;
  costFactors: string[];
  billingNotes: string;
  insuranceNotes: string;
  questionsToAsk: string[];
}

const procedureContent = procedureContentData as Record<string, ProcedureContent>;

export function getProcedureContent(code: string): ProcedureContent | undefined {
  return procedureContent[code];
}
