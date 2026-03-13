# MedCostCheck (medcostcheck.com)

## What
US medical procedure cost lookup by ZIP code. Free cost estimates powered by 2026 Medicare Physician Fee Schedule data. 7,575 procedures, 43,000 ZIP codes, 112 pricing localities.

## Commands
- `npm run dev` - local dev server
- `npm run build` - production build
- `npm run lint` - lint
- `node scripts/process-data.mjs` - reprocess CMS data files into JSON

## Key Paths
- `lib/medicare.ts` - Medicare data access layer (procedures, pricing, ZIP-to-locality)
- `components/ProcedureSearch.tsx` - Client-side procedure search with autocomplete
- `app/page.tsx` - Homepage with search, categories, popular procedures
- `app/procedure/[code]/page.tsx` - Procedure cost detail page (ZIP-level pricing)
- `app/procedures/page.tsx` - All procedures listing by category
- `app/api/search/route.ts` - Search API endpoint
- `scripts/process-data.mjs` - CMS data processing script
- `data/processed/` - Pre-processed JSON files (committed to repo)
- `data/` - Raw CMS data files (gitignored)

## Architecture
- Next.js 16 App Router, TypeScript strict, Tailwind CSS v4
- All pricing calculated from RVU x GPCI x Conversion Factor ($33.4009)
- Pre-processed JSON data imported directly (no database needed)
- ZIP -> Carrier+Locality -> GPCI values -> price calculation
- Blue/indigo colour scheme

## Data Sources
- Medicare Physician Fee Schedule RVU file (PPRRVU2026_Apr_nonQPP.csv)
- GPCI file (GPCI2026.csv) with 112 payment localities
- ZIP5 crosswalk (ZIP5_APR2026.txt) mapping ZIPs to carriers/localities
- All from CMS: https://www.cms.gov/medicare/payment/fee-schedules/physician/
- Data is public domain, no API key needed

## Price Calculation
Payment = [(Work RVU x PW GPCI) + (PE RVU x PE GPCI) + (MP RVU x MP GPCI)] x $33.4009
- Non-facility (office): uses non-facility PE RVU
- Facility (hospital): uses facility PE RVU (lower, as hospital charges separately)

## TODO
- Buy medcostcheck.com domain on Cloudflare, add to Vercel
- Add Google Analytics
- Build state-level pages for programmatic SEO (procedure x state)
- Add insurance comparison features
- Add Stripe for premium reports
- Add AdSense (healthcare RPM $25-45)
- Investigate CMS Hospital Transparency data for real hospital-specific pricing
- Sign up for insurance lead gen affiliate programs
- Update data annually when CMS releases new fee schedule (typically late December)
