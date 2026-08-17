/**
 * State names and URL slugs. Kept separate from medicare.ts so sitemap
 * generation does not load the 4MB ZIP/procedure JSON files.
 */

export const STATE_NAMES: Record<string, string> = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
  DC: "District of Columbia",
  PR: "Puerto Rico",
  VI: "Virgin Islands",
};

/** 50 states + DC. Matches the public /state/{slug} set we already publish. */
export function getIndexableStateAbbrs(): string[] {
  return Object.keys(STATE_NAMES)
    .filter((abbr) => abbr !== "PR" && abbr !== "VI")
    .sort();
}

export function getStateName(abbr: string): string {
  return STATE_NAMES[abbr] || abbr;
}

export function stateToSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

export function slugToStateAbbr(slug: string): string | null {
  const target = slug.toLowerCase().replace(/-/g, " ");
  for (const [abbr, name] of Object.entries(STATE_NAMES)) {
    if (name.toLowerCase() === target) return abbr;
  }
  return null;
}

export function procedureToSlug(friendlyName: string): string {
  return friendlyName
    .toLowerCase()
    .replace(/[()]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
