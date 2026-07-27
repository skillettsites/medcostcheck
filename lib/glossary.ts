export interface GlossaryTerm {
  term: string;
  slug: string; // kebab-case of term
  definition: string[]; // 1-3 paragraphs, first is the core definition, later ones add practical consumer context
  related: string[]; // 2-4 slugs of related terms in this glossary
}

export const glossaryTerms: GlossaryTerm[] = [
  {
    term: "Advance Beneficiary Notice (ABN)",
    slug: "advance-beneficiary-notice-abn",
    definition: [
      "An Advance Beneficiary Notice is a form that doctors and suppliers who accept Medicare must give you before providing a service they believe Medicare probably will not pay for. By signing it, you acknowledge that you may have to pay the full cost yourself if Medicare denies the claim.",
      "Never sign an ABN on autopilot. Ask why the provider expects a denial, whether a different code or documentation would fix it, and what the cash price would be. The form also lets you choose whether the claim still gets submitted to Medicare, which preserves your right to appeal if it is denied."
    ],
    related: ["medicare", "denial", "medical-necessity", "self-pay"]
  },
  {
    term: "Allowed Amount",
    slug: "allowed-amount",
    definition: [
      "The allowed amount is the maximum your insurance plan will pay for a covered service, usually far below the provider's billed charge. In-network providers agree by contract to accept this amount as payment in full, writing off the difference.",
      "This number drives your real cost. Your deductible, coinsurance, and out-of-pocket maximum are all calculated from the allowed amount, not the sticker price on the bill. If you see a huge billed charge on your EOB, check the allowed amount column first; that is the figure that actually matters to your wallet."
    ],
    related: ["balance-billing", "fee-schedule", "in-network", "ucr-usual-customary-and-reasonable"]
  },
  {
    term: "Ambulatory Surgery Center",
    slug: "ambulatory-surgery-center",
    definition: [
      "An ambulatory surgery center (ASC) is a standalone facility that performs same-day surgical procedures, such as colonoscopies, cataract surgery, and many orthopedic operations, without an overnight hospital stay.",
      "For the same procedure with the same surgeon, an ASC is typically billed at a lower facility rate than a hospital outpatient department. If your doctor operates at both, asking to have the procedure scheduled at the ASC is one of the simplest ways to cut hundreds or thousands of dollars from your bill. Always confirm the ASC itself, the surgeon, and the anesthesiologist are all in-network."
    ],
    related: ["hospital-outpatient-department", "facility-fee", "non-facility-rate"]
  },
  {
    term: "Appeal",
    slug: "appeal",
    definition: [
      "An appeal is your formal request that an insurer reverse a decision, most often a denied claim or a refused prior authorization. Plans must offer an internal appeal reviewed by the insurer, and if that fails, most denials qualify for an independent external review by a third party.",
      "Appeals work more often than people assume, especially when a denial was triggered by a coding error or missing paperwork. Read the denial reason on your EOB, ask your doctor to write a letter of medical necessity, and watch the filing deadlines printed in the denial letter. Keep copies of everything you send."
    ],
    related: ["denial", "grievance", "eob", "medical-necessity"]
  },
  {
    term: "Assignment of Benefits",
    slug: "assignment-of-benefits",
    definition: [
      "Assignment of benefits is the authorization you sign, usually buried in intake paperwork, that tells your insurer to pay the provider directly instead of sending the check to you.",
      "In most cases this is convenient and harmless. It matters more with out-of-network care: without assignment, the insurer may send payment to you and leave you to pay the provider. In Medicare, a provider who accepts assignment agrees to take the Medicare-approved amount as full payment, which protects you from excess charges. Asking whether a provider accepts assignment is a legitimate cost question, not a rude one."
    ],
    related: ["claim", "provider", "medicare"]
  },
  {
    term: "Balance Billing",
    slug: "balance-billing",
    definition: [
      "Balance billing is when a provider bills you for the difference between their full charge and what your insurance allowed and paid. In-network providers cannot do this for covered services because their contract requires them to write off the difference.",
      "Out-of-network providers can balance bill in many situations, which is how patients end up owing thousands beyond their normal cost sharing. The No Surprises Act now bans balance billing for emergency care and for out-of-network clinicians working at in-network facilities. If a bill looks like a banned balance bill, do not pay it; dispute it and cite the law."
    ],
    related: ["allowed-amount", "out-of-network", "no-surprises-act", "surprise-billing"]
  },
  {
    term: "Bundled Payment",
    slug: "bundled-payment",
    definition: [
      "A bundled payment is a single combined price covering all the services in an episode of care, such as a joint replacement including the surgery, hospital stay, and follow-up, rather than a separate charge for every line item.",
      "For consumers, bundles can make prices dramatically easier to compare, and many cash-pay surgery programs advertise one all-inclusive number. The catch is knowing exactly what is inside the bundle. Ask in writing whether anesthesia, implants, facility fees, and complications are included, because anything outside the bundle gets billed separately on top."
    ],
    related: ["drg", "global-period", "unbundling"]
  },
  {
    term: "Capitation",
    slug: "capitation",
    definition: [
      "Capitation is a payment model where an insurer pays a doctor or medical group a fixed amount per patient per month to cover that patient's care, regardless of how many visits or services the patient actually uses.",
      "You will rarely see the word on a bill, but it shapes your experience in many HMOs and Medicare Advantage plans. Because the practice bears the financial risk, capitated groups have an incentive to keep you healthy and out of the hospital, but also, in poorly run groups, to limit referrals and testing. If you feel care is being rationed, you can appeal decisions and switch groups at enrollment time."
    ],
    related: ["hmo", "primary-care-physician", "fee-schedule"]
  },
  {
    term: "Chargemaster",
    slug: "chargemaster",
    definition: [
      "A chargemaster is a hospital's master list of prices for every service, supply, and drug it provides, often containing tens of thousands of line items. These are the inflated list prices that appear as billed charges before any insurance discount.",
      "Almost nobody with insurance pays chargemaster rates, because insurers negotiate them down to allowed amounts. The people most exposed to them are uninsured and self-pay patients, which is why you should always ask for the cash price or a self-pay discount rather than accepting a bill based on list prices. Hospitals are required to publish machine-readable price files, which cost-lookup tools use to compare real rates."
    ],
    related: ["itemized-bill", "allowed-amount", "self-pay"]
  },
  {
    term: "Claim",
    slug: "claim",
    definition: [
      "A claim is the formal request for payment that a provider (or sometimes you) submits to an insurance company after a service, listing the procedure codes, diagnosis codes, and charges.",
      "Every bill you receive traces back to a claim, and most billing problems are really claim problems: wrong codes, missing information, or a claim sent to the wrong insurer. If a bill looks wrong, compare it against the matching EOB for that claim before paying. You generally have the right to ask the provider to correct and resubmit a claim rather than paying for their error."
    ],
    related: ["eob", "denial", "superbill"]
  },
  {
    term: "CMS",
    slug: "cms",
    definition: [
      "CMS is the Centers for Medicare and Medicaid Services, the federal agency that runs Medicare, oversees Medicaid with the states, and administers the Affordable Care Act marketplaces.",
      "CMS matters to your bill even if you are privately insured, because its decisions ripple through the whole system. The Medicare fee schedule CMS publishes is the benchmark many private insurers price against, its coding rules shape how every claim is written, and its hospital price transparency rules are why sites like this one can show real negotiated rates. Complaints about Medicare plans and surprise billing violations ultimately land with CMS."
    ],
    related: ["medicare", "medicaid", "fee-schedule", "hcpcs-code"]
  },
  {
    term: "Coinsurance",
    slug: "coinsurance",
    definition: [
      "Coinsurance is the percentage of the allowed amount you pay for a covered service after you have met your deductible. With 20 percent coinsurance on a service allowed at $1,000, you owe $200 and the plan pays $800.",
      "Because coinsurance is a percentage rather than a flat fee, it is the cost-sharing type that hurts most on expensive care like surgery, imaging, and hospital stays. That makes the underlying price matter enormously: 20 percent of a $2,000 MRI is very different from 20 percent of a $600 MRI at another facility. Shopping the price directly cuts your coinsurance."
    ],
    related: ["deductible", "copayment", "out-of-pocket-maximum", "cost-sharing"]
  },
  {
    term: "Concierge Medicine",
    slug: "concierge-medicine",
    definition: [
      "Concierge medicine is a practice model where you pay a recurring membership fee, monthly or annually, for enhanced access to a physician: same-day appointments, longer visits, and direct messaging. Some concierge practices still bill your insurance for visits; direct primary care versions skip insurance entirely.",
      "Before joining, be clear on what the fee actually buys. It usually covers access and primary care only, not labs, imaging, specialists, or hospital care, so you still need insurance for anything serious. The membership fee generally does not count toward your deductible or out-of-pocket maximum."
    ],
    related: ["primary-care-physician", "self-pay", "premium"]
  },
  {
    term: "Coordination of Benefits",
    slug: "coordination-of-benefits",
    definition: [
      "Coordination of benefits (COB) is the process insurers use when you are covered by more than one plan, such as your own employer plan plus a spouse's, to decide which plan pays first (primary) and which pays second (secondary).",
      "COB is a common hidden cause of denied or stalled claims. Insurers periodically send questionnaires asking whether you have other coverage, and if you ignore them they can suspend payment on everything until you respond. If claims suddenly start denying with COB reason codes, call both insurers, confirm which is primary, and make sure the provider bills them in the right order."
    ],
    related: ["claim", "subrogation", "medicare"]
  },
  {
    term: "Copayment",
    slug: "copayment",
    definition: [
      "A copayment, or copay, is a fixed dollar amount you pay for a specific service, such as $25 for a primary care visit or $15 for a generic prescription, with the plan covering the rest.",
      "Copays are predictable, which is their advantage over coinsurance, but read your plan's fine print on when they apply. Some plans charge copays from day one, while others make you meet the deductible first for certain services. Also watch for visits that generate both a copay and a separate facility fee at hospital-owned clinics; the copay is not always the whole story."
    ],
    related: ["coinsurance", "deductible", "cost-sharing"]
  },
  {
    term: "Cost Sharing",
    slug: "cost-sharing",
    definition: [
      "Cost sharing is the umbrella term for the portion of covered medical costs you pay yourself: deductibles, copayments, and coinsurance. It does not include your monthly premium or charges for services the plan does not cover.",
      "When comparing plans, look at the whole cost-sharing picture rather than any single number. A plan with a low premium often shifts money onto you through a high deductible and coinsurance. The out-of-pocket maximum is the ceiling on your total in-network cost sharing for the year, which makes it one of the most important numbers on any plan summary."
    ],
    related: ["deductible", "coinsurance", "copayment", "out-of-pocket-maximum"]
  },
  {
    term: "CPT Code",
    slug: "cpt-code",
    definition: [
      "A CPT (Current Procedural Terminology) code is a five-digit code, maintained by the American Medical Association, that identifies exactly what procedure or service a provider performed, from an office visit (such as 99213) to a knee replacement.",
      "CPT codes are the language of every medical bill, and they are your best price-shopping tool. If you get the CPT code for a planned procedure from your doctor's office, you can look up what it costs at different facilities and ask insurers for the allowed amount before you commit. Checking the codes on an itemized bill against what actually happened is also how you catch upcoding and other errors."
    ],
    related: ["hcpcs-code", "modifier", "upcoding", "superbill"]
  },
  {
    term: "Credentialing",
    slug: "credentialing",
    definition: [
      "Credentialing is the process by which insurers and hospitals verify a provider's licenses, training, and history before adding them to a network or medical staff. It can take weeks to months for a new provider to complete.",
      "This back-office process can hit your bill directly. A doctor who has joined a practice but is not yet credentialed with your insurer may be billed as out-of-network even though the practice itself is in-network. When booking with a new provider, ask specifically whether that individual clinician is credentialed and in-network with your plan, not just the clinic."
    ],
    related: ["network", "in-network", "provider"]
  },
  {
    term: "Deductible",
    slug: "deductible",
    definition: [
      "Your deductible is the amount you must pay out of pocket for covered services each plan year before your insurance starts paying its share. With a $2,000 deductible, you pay the first $2,000 of allowed charges yourself.",
      "Key details people miss: you pay the negotiated allowed amount toward your deductible, not list price, so using in-network providers still saves money before the deductible is met. Many plans cover preventive care and sometimes copay-based services before the deductible. Timing matters too; if you have already met your deductible late in the year, scheduling planned procedures before the reset can save you the whole deductible again."
    ],
    related: ["coinsurance", "copayment", "out-of-pocket-maximum", "premium"]
  },
  {
    term: "Denial",
    slug: "denial",
    definition: [
      "A denial is an insurer's refusal to pay a claim or approve a service. The reason appears as a code and short explanation on your EOB or denial letter: not medically necessary, no prior authorization, out-of-network, coding error, or not a covered benefit.",
      "A denial is the start of a process, not the end of one. Many denials are administrative and get overturned once the provider fixes a code or submits records. You have a legal right to internal appeal and usually to independent external review. Never pay a large denied claim without understanding the denial reason and trying at least one appeal."
    ],
    related: ["appeal", "preauthorization-prior-authorization", "medical-necessity", "claim"]
  },
  {
    term: "Diagnosis Code (ICD-10)",
    slug: "diagnosis-code-icd-10",
    definition: [
      "An ICD-10 diagnosis code is the alphanumeric code (like E11.9 for type 2 diabetes) that describes why you received care. Every claim pairs diagnosis codes with procedure codes: the diagnosis justifies the procedure.",
      "The diagnosis code can change what you owe. The same blood test may be free as preventive screening under one code but billed to your deductible as diagnostic under another. If a service you expected to be covered was denied or cost more than expected, ask the provider's billing office whether a different, still accurate, diagnosis code applies. Miscoded diagnoses are among the most common and most fixable billing errors."
    ],
    related: ["cpt-code", "medical-necessity", "claim", "preventive-care"]
  },
  {
    term: "DRG",
    slug: "drg",
    definition: [
      "A DRG (Diagnosis Related Group) is the system Medicare and many insurers use to pay hospitals a single flat amount for an entire inpatient stay based on your diagnosis and treatment, rather than paying for each item used.",
      "If you are an inpatient paid under a DRG, the hospital receives the same amount whether you stay four days or six, which is why hospitals care about discharge timing. For you, the practical point is that inpatient stays are usually billed as one episode, while observation stays are billed item by item as outpatient care, sometimes with very different cost sharing. Your status matters as much as your treatment."
    ],
    related: ["bundled-payment", "observation-status", "medicare", "revenue-code"]
  },
  {
    term: "Durable Medical Equipment",
    slug: "durable-medical-equipment",
    definition: [
      "Durable medical equipment (DME) is reusable medical gear prescribed for home use: wheelchairs, walkers, hospital beds, CPAP machines, oxygen equipment, blood glucose monitors, and similar items.",
      "DME has its own billing quirks. Insurers often require prior authorization and documentation of medical necessity, may rent rather than buy expensive items, and typically pay only specific contracted suppliers. Buying from a non-contracted supplier can leave you paying full price. Before accepting equipment, especially anything handed to you at discharge, ask whether it is covered, whether the supplier is in-network, and what the rental-versus-purchase arrangement is. Retail prices for simple items are sometimes cheaper than your insurance cost share."
    ],
    related: ["hcpcs-code", "medicare", "preauthorization-prior-authorization"]
  },
  {
    term: "EOB",
    slug: "eob",
    definition: [
      "An EOB (Explanation of Benefits) is the statement your insurer sends after processing a claim. It shows the billed charge, the allowed amount, what the plan paid, and the patient responsibility. It always says some version of \"this is not a bill.\"",
      "The EOB is your most powerful bill-checking tool. Never pay a provider bill without matching it to the EOB for the same date of service; the amount you owe the provider should equal the patient responsibility on the EOB, nothing more. Mismatches usually mean the provider billed you before insurance finished, double-billed, or balance billed improperly."
    ],
    related: ["claim", "allowed-amount", "patient-responsibility", "explanation-of-payment"]
  },
  {
    term: "Explanation of Payment",
    slug: "explanation-of-payment",
    definition: [
      "An explanation of payment (EOP), also called a remittance advice, is the provider-side counterpart of your EOB: the document an insurer sends the provider showing how each claim line was paid, adjusted, or denied.",
      "You will not receive the EOP, but knowing it exists helps in disputes. When a provider's bill does not match your EOB, their billing office is working from the EOP, and asking them to reconcile the two documents often resolves the discrepancy. In a serious dispute you can ask the provider for a copy of the remittance for your claim."
    ],
    related: ["eob", "claim", "write-off"]
  },
  {
    term: "Facility Fee",
    slug: "facility-fee",
    definition: [
      "A facility fee is a separate charge for using a hospital-owned building or department, billed on top of the professional fee for the doctor's work. Hospital-owned clinics can charge facility fees even for routine office visits.",
      "This is one of the most common bill surprises: the same doctor visit costs more after a hospital buys the practice, because a facility fee appears. Before scheduling, ask directly whether a facility fee will be charged and how much it will be. Independent physician offices, freestanding imaging centers, and ambulatory surgery centers usually have no facility fee or a much smaller one."
    ],
    related: ["hospital-outpatient-department", "non-facility-rate", "itemized-bill"]
  },
  {
    term: "Fee Schedule",
    slug: "fee-schedule",
    definition: [
      "A fee schedule is a list of fixed payment rates for services, organized by procedure code. Medicare publishes its Physician Fee Schedule annually, and every insurer maintains fee schedules that set the allowed amounts for its contracted providers.",
      "Fee schedules explain why the same CPT code pays differently across insurers and locations. The Medicare rate is publicly searchable and is a useful benchmark when negotiating a self-pay price: offering somewhere between the Medicare rate and a modest multiple of it is a credible, informed starting point that billing offices recognize."
    ],
    related: ["allowed-amount", "relative-value-unit-rvu", "medicare", "cpt-code"]
  },
  {
    term: "Flexible Spending Account (FSA)",
    slug: "flexible-spending-account-fsa",
    definition: [
      "A flexible spending account is an employer-sponsored account that lets you set aside pre-tax money from your paycheck for eligible medical expenses like copays, deductibles, prescriptions, glasses, and dental work.",
      "The defining catch is \"use it or lose it\": FSA funds generally must be spent within the plan year, though some employers offer a short grace period or allow a limited carryover. The full amount you elect is available on day one of the year, which can be useful for a planned procedure. Unlike an HSA, the account belongs to the plan, not you, so unused funds do not follow you when you change jobs."
    ],
    related: ["health-savings-account-hsa", "deductible", "cost-sharing"]
  },
  {
    term: "Formulary",
    slug: "formulary",
    definition: [
      "A formulary is your plan's list of covered prescription drugs, organized into tiers that determine your cost: generics on the cheapest tier, preferred brands in the middle, and specialty drugs on the most expensive tiers.",
      "If a drug is not on the formulary, the plan may pay nothing, and formularies change every year, which is a key reason to recheck your medications during open enrollment. If your drug is excluded or on a high tier, you can ask your doctor about a covered alternative, request a formulary exception, or compare cash prices with discount programs, which sometimes beat your insurance copay."
    ],
    related: ["step-therapy", "preauthorization-prior-authorization", "open-enrollment"]
  },
  {
    term: "Global Period",
    slug: "global-period",
    definition: [
      "A global period is the window of time after a surgery, typically 0, 10, or 90 days depending on the procedure, during which routine follow-up care related to that surgery is included in the original surgical fee and cannot be billed separately.",
      "If you are charged for a normal post-op check within the global period, that is a billing error worth disputing. Providers can bill separately during the window only for unrelated problems or true complications requiring a return to the operating room, and those claims should carry a modifier explaining why. Ask the surgeon's office how long the global period is so you know which visits should be free."
    ],
    related: ["bundled-payment", "cpt-code", "modifier"]
  },
  {
    term: "Good Faith Estimate",
    slug: "good-faith-estimate",
    definition: [
      "A good faith estimate (GFE) is a written estimate of expected charges that providers must give uninsured and self-pay patients under the No Surprises Act, upon request or automatically when scheduling care.",
      "The GFE has teeth. If the final bill exceeds the estimate by $400 or more, you can challenge it through the federal patient-provider dispute resolution process, and while a dispute is pending the provider cannot send the bill to collections. Always get a GFE in writing before self-pay care, keep it, and compare it line by line against the final bill."
    ],
    related: ["no-surprises-act", "self-pay", "itemized-bill"]
  },
  {
    term: "Grievance",
    slug: "grievance",
    definition: [
      "A grievance is a formal complaint to your insurer about anything other than a payment decision: rude service, long waits for callbacks, quality-of-care concerns, or difficulty getting through to the plan. Payment disputes go through appeals instead.",
      "Filing a grievance creates a paper trail the plan must log, track, and respond to within set timeframes, and regulators review grievance data. In Medicare Advantage and Medicaid plans especially, grievances are taken seriously because they affect plan ratings. If a problem is both service and payment related, you can file a grievance and an appeal at the same time."
    ],
    related: ["appeal", "denial", "utilization-review"]
  },
  {
    term: "Guarantor",
    slug: "guarantor",
    definition: [
      "The guarantor is the person legally responsible for paying a medical bill, which is not always the patient. Parents are guarantors for their minor children, and whoever signs the financial responsibility agreement at registration typically becomes the guarantor.",
      "Be careful what you sign at check-in, especially for another adult. Signing as guarantor for a friend, sibling, or adult child can make their unpaid bill your legal debt. Hospitals sometimes ask a spouse or relative to sign paperwork during a stressful admission; you are generally not required to accept guarantor status for another adult's care in order for them to be treated."
    ],
    related: ["patient-responsibility", "itemized-bill", "self-pay"]
  },
  {
    term: "HCPCS Code",
    slug: "hcpcs-code",
    definition: [
      "HCPCS (Healthcare Common Procedure Coding System) codes are the codes used on claims for services and products. Level I is the CPT code set; Level II codes, which start with a letter (like E1130 for a wheelchair or J codes for injected drugs), cover equipment, supplies, ambulance services, and medications given in a clinical setting.",
      "You will meet HCPCS Level II codes on bills for durable medical equipment, infusions, and injections. As with CPT codes, getting the exact code lets you compare prices across suppliers and check whether your insurer covers the item before you accept it."
    ],
    related: ["cpt-code", "durable-medical-equipment", "cms"]
  },
  {
    term: "Health Savings Account (HSA)",
    slug: "health-savings-account-hsa",
    definition: [
      "A health savings account is a tax-advantaged account available only to people enrolled in a qualifying high-deductible health plan. Contributions are pre-tax, growth is tax-free, and withdrawals for qualified medical expenses are tax-free.",
      "Unlike an FSA, the money is yours forever: it rolls over every year, moves with you between jobs, and can be invested. Because there is no deadline to reimburse yourself, many people pay small bills out of pocket, keep receipts, and let the HSA grow as a medical retirement fund. Contribution limits are set by the IRS each year, so check the current figures before setting your payroll deduction."
    ],
    related: ["flexible-spending-account-fsa", "deductible", "out-of-pocket-maximum"]
  },
  {
    term: "HMO",
    slug: "hmo",
    definition: [
      "An HMO (Health Maintenance Organization) is a plan type that covers care only from its own network of providers, except in emergencies, and usually requires you to choose a primary care physician who provides referrals to specialists.",
      "HMOs typically have lower premiums and simpler copays than PPOs, and the tradeoff is flexibility. Going outside the network means paying the entire bill yourself, and skipping a required referral can turn a covered specialist visit into a denied claim. If you have established doctors you want to keep, check they are in the HMO's network before enrolling, and always confirm the referral is on file before a specialist appointment."
    ],
    related: ["ppo", "primary-care-physician", "network", "in-network"]
  },
  {
    term: "Hospital Outpatient Department",
    slug: "hospital-outpatient-department",
    definition: [
      "A hospital outpatient department (HOPD) is any clinic, imaging center, infusion suite, or procedure area that is owned by and billed as part of a hospital, even if it is located miles from the main campus and looks like an ordinary office.",
      "HOPDs are usually the most expensive place to receive routine outpatient care, because they bill hospital facility fees on top of professional fees. The same MRI, colonoscopy, or infusion is often far cheaper at a freestanding imaging center, ambulatory surgery center, or independent office. Before scheduling, ask whether the location bills as a hospital department; the answer can change your cost dramatically."
    ],
    related: ["facility-fee", "ambulatory-surgery-center", "non-facility-rate"]
  },
  {
    term: "In-Network",
    slug: "in-network",
    definition: [
      "In-network means a provider or facility has a contract with your insurance plan, agreeing to accept negotiated rates and to not bill you beyond your normal cost sharing for covered services.",
      "Staying in-network is the single biggest lever most people have over their medical costs. Verify network status for every piece of a planned service: the surgeon, the facility, the anesthesiologist, the lab, and the radiologist can each be networked separately. Do not rely on the insurer's online directory alone, since they are frequently out of date; call the provider's billing office and ask them to confirm they are contracted with your specific plan, not just your insurance company."
    ],
    related: ["out-of-network", "network", "allowed-amount", "credentialing"]
  },
  {
    term: "Itemized Bill",
    slug: "itemized-bill",
    definition: [
      "An itemized bill is a line-by-line statement listing every service, supply, and medication you were charged for, with its code and individual price, unlike a summary bill that shows only lump-sum totals.",
      "Always request an itemized bill for any hospital stay or large charge; you are entitled to one, and errors are common enough that reviewing it is worth the effort. Look for duplicate charges, services you never received, quantities that make no sense, and routine post-op care billed during a global period. Comparing the itemized bill against your EOB and questioning suspect lines in writing is the core of disputing any medical bill."
    ],
    related: ["chargemaster", "revenue-code", "eob", "upcoding"]
  },
  {
    term: "Lifetime Maximum",
    slug: "lifetime-maximum",
    definition: [
      "A lifetime maximum is a cap on the total amount a health plan will ever pay for your care. The Affordable Care Act banned lifetime dollar limits on essential health benefits, so ACA-compliant plans can no longer cut you off after a catastrophic illness.",
      "The concept still matters at the edges. Short-term health plans, some fixed-indemnity products, and certain non-ACA arrangements like health care sharing ministries can still impose lifetime or annual caps, and dental plans routinely have annual maximums. If you are considering any cheap non-marketplace coverage, look for caps in the fine print; they are a defining sign of thin coverage."
    ],
    related: ["out-of-pocket-maximum", "underinsured"]
  },
  {
    term: "Medicaid",
    slug: "medicaid",
    definition: [
      "Medicaid is the joint federal and state program that provides health coverage to people with limited income, including children, pregnant women, seniors needing long-term care, and people with disabilities. Each state runs its own version with its own name, rules, and income limits.",
      "Medicaid usually has little or no cost sharing, and providers who accept it generally cannot balance bill you for covered services. Eligibility is worth checking even if you assume you earn too much, especially in states that expanded Medicaid, and hospital financial counselors can often screen you and backdate coverage to recent bills. Losing and regaining eligibility mid-year is common, so keep renewal paperwork current."
    ],
    related: ["medicare", "cms", "sliding-scale"]
  },
  {
    term: "Medical Necessity",
    slug: "medical-necessity",
    definition: [
      "Medical necessity is the standard insurers use to decide whether a service is appropriate and therefore covered: care that is reasonable, evidence-based, and required to diagnose or treat a condition, per the plan's clinical criteria.",
      "\"Not medically necessary\" is one of the most common denial reasons, and it is frequently reversible. The insurer's criteria are written documents you can request, and a denial often just means the claim lacked documentation showing you met them. A letter of medical necessity from your doctor addressing the specific criteria, submitted with an appeal, overturns many of these denials."
    ],
    related: ["denial", "appeal", "utilization-review", "preauthorization-prior-authorization"]
  },
  {
    term: "Medicare",
    slug: "medicare",
    definition: [
      "Medicare is the federal health insurance program for people 65 and older and for younger people with certain disabilities. Part A covers hospital care, Part B covers doctor visits and outpatient services, and Part D covers prescription drugs.",
      "Original Medicare has no out-of-pocket maximum, and Part B generally pays 80 percent of approved amounts after the deductible, which is why most enrollees add either a Medigap supplement or switch to a Medicare Advantage plan. Enrollment timing matters: missing your initial window can trigger lifelong late penalties on Part B and Part D premiums, so mark the months around your 65th birthday."
    ],
    related: ["medicare-advantage", "medigap", "medicaid", "cms"]
  },
  {
    term: "Medicare Advantage",
    slug: "medicare-advantage",
    definition: [
      "Medicare Advantage (Part C) is the option to receive your Medicare benefits through a private insurance plan instead of Original Medicare. These plans often bundle drug coverage and extras like dental or vision, frequently with low or zero additional premiums.",
      "The tradeoffs are real: Advantage plans use provider networks, require prior authorization for many services, and can deny care Original Medicare would have paid for. They do include an annual out-of-pocket maximum, which Original Medicare lacks. Compare plans every year during open enrollment, because networks, formularies, and benefits change, and check that your doctors and hospitals remain in-network before renewing."
    ],
    related: ["medicare", "medigap", "preauthorization-prior-authorization", "network"]
  },
  {
    term: "Medigap",
    slug: "medigap",
    definition: [
      "Medigap, or Medicare Supplement insurance, is a private policy that pays the cost sharing Original Medicare leaves behind, such as the Part B coinsurance and hospital deductibles. Plans are standardized by letter, so a Plan G from one insurer covers the same things as a Plan G from another.",
      "The crucial timing rule: during the six months after you first enroll in Part B at 65, insurers must sell you any Medigap policy regardless of health. After that window, in most states, they can refuse you or charge more for pre-existing conditions, which can lock people into Medicare Advantage. Compare premiums across insurers since coverage within a letter is identical."
    ],
    related: ["medicare", "medicare-advantage", "coinsurance"]
  },
  {
    term: "Modifier",
    slug: "modifier",
    definition: [
      "A modifier is a two-character code attached to a CPT or HCPCS code to convey extra information: that a procedure was performed on the left side, that two distinct services really did occur on the same day, or that a visit during a global period was unrelated to the surgery.",
      "Modifiers matter to your bill because they change what gets paid. A missing modifier can cause a legitimate claim to deny, while a wrongly applied one (such as modifier 25 stacking an office visit fee onto a minor procedure) can inflate your bill. If a denial or odd charge involves same-day services, ask the billing office whether the correct modifier was used."
    ],
    related: ["cpt-code", "unbundling", "claim"]
  },
  {
    term: "Network",
    slug: "network",
    definition: [
      "A network is the set of doctors, hospitals, labs, and other providers that have contracted with an insurance plan to treat its members at negotiated rates. Plan types differ mainly in how they use the network: HMOs cover network care only, while PPOs pay reduced benefits outside it.",
      "Networks are plan-specific, not insurer-specific. A doctor can take one UnitedHealthcare plan and not another, which is why \"we accept your insurance\" is not the same as \"we are in your plan's network.\" Networks also change mid-year as contracts terminate, so re-verify before expensive planned care even with providers you have used before."
    ],
    related: ["in-network", "out-of-network", "hmo", "ppo"]
  },
  {
    term: "No Surprises Act",
    slug: "no-surprises-act",
    definition: [
      "The No Surprises Act is the federal law, effective January 2022, that bans most surprise medical bills. It protects you from balance billing for emergency care, for out-of-network clinicians (like anesthesiologists) working at in-network facilities, and for out-of-network air ambulances.",
      "In protected situations you owe only your normal in-network cost sharing, and the provider and insurer must settle the rest between themselves. The law also created the good faith estimate for self-pay patients. If you receive a bill that violates these protections, do not pay it: dispute it with the provider and insurer, and file a complaint through the federal No Surprises Help Desk."
    ],
    related: ["surprise-billing", "balance-billing", "good-faith-estimate", "out-of-network"]
  },
  {
    term: "Non-Facility Rate",
    slug: "non-facility-rate",
    definition: [
      "The non-facility rate is the payment rate for a procedure performed in a doctor's own office rather than in a hospital or surgery center. It is usually higher than the facility-setting professional fee because it includes the office's overhead, but the total cost is lower because no separate facility fee is charged.",
      "For you, this is the arithmetic behind \"site of service\" savings. A minor procedure done in an independent office generates one bill at the non-facility rate; the same procedure in a hospital outpatient department generates a professional fee plus a facility fee that together usually cost far more. When a procedure can safely be done in an office, asking for that setting is a legitimate money-saving request."
    ],
    related: ["facility-fee", "fee-schedule", "hospital-outpatient-department"]
  },
  {
    term: "Observation Status",
    slug: "observation-status",
    definition: [
      "Observation status means you are being monitored in a hospital bed but are classified as an outpatient rather than formally admitted as an inpatient. You can spend a night or more in the hospital, receiving what feels like inpatient care, while officially remaining under observation.",
      "The classification has major billing consequences, especially for Medicare patients: observation is billed under Part B outpatient rules, and observation days do not count toward the three-day inpatient stay that traditional Medicare requires before covering skilled nursing facility care. Hospitals must notify Medicare patients kept in observation. If you or a family member is hospitalized, ask directly: \"Am I admitted as an inpatient or under observation?\" and ask the doctor to reconsider if observation seems wrong."
    ],
    related: ["skilled-nursing-facility", "medicare", "drg"]
  },
  {
    term: "Open Enrollment",
    slug: "open-enrollment",
    definition: [
      "Open enrollment is the annual window when you can sign up for or change health insurance: the fall marketplace period for ACA plans, your employer's benefits election window, and the October to December period for Medicare plan changes.",
      "Outside these windows you generally cannot switch plans unless a qualifying life event (job loss, marriage, birth, moving) opens a special enrollment period. Treat open enrollment as an annual audit: plans change their premiums, networks, and formularies every year, so confirm your doctors are still in-network and your medications are still covered before letting your current plan auto-renew."
    ],
    related: ["premium", "formulary", "medicare-advantage", "network"]
  },
  {
    term: "Out-of-Network",
    slug: "out-of-network",
    definition: [
      "Out-of-network means a provider has no contract with your insurance plan. Depending on your plan type, out-of-network care is either not covered at all (most HMOs) or covered at a lower benefit level with higher cost sharing (PPOs).",
      "The real danger is not just higher coinsurance; it is that out-of-network providers have not agreed to any price, so they can balance bill you beyond what your insurer allows, except where the No Surprises Act forbids it. Out-of-network spending also usually accrues to a separate, larger deductible and out-of-pocket maximum, or to no maximum at all. Verify network status for every provider involved in planned care."
    ],
    related: ["in-network", "balance-billing", "no-surprises-act", "allowed-amount"]
  },
  {
    term: "Out-of-Pocket Maximum",
    slug: "out-of-pocket-maximum",
    definition: [
      "The out-of-pocket maximum is the most you will pay in deductibles, copays, and coinsurance for covered in-network care in a plan year. Once you hit it, the plan pays 100 percent of covered in-network services for the rest of the year.",
      "It is your true worst-case number and arguably the most important figure when comparing plans. Note what does not count toward it: premiums, out-of-network balance bills, and non-covered services. If you know a costly year is coming, such as a planned surgery or pregnancy, a plan with a higher premium but lower out-of-pocket maximum often wins the total-cost math."
    ],
    related: ["deductible", "coinsurance", "copayment", "cost-sharing"]
  },
  {
    term: "Patient Responsibility",
    slug: "patient-responsibility",
    definition: [
      "Patient responsibility is the portion of a processed claim that you owe after insurance has paid its share: your deductible, copay, and coinsurance amounts, as shown on the EOB.",
      "This figure on the EOB is the ceiling on what an in-network provider can legitimately bill you for a covered service. If a provider's bill exceeds the patient responsibility on the matching EOB, something is wrong: the claim may still be processing, insurance may have been billed incorrectly, or you are being balance billed. Call the billing office with the EOB in hand before paying anything above that number."
    ],
    related: ["eob", "cost-sharing", "guarantor", "balance-billing"]
  },
  {
    term: "PPO",
    slug: "ppo",
    definition: [
      "A PPO (Preferred Provider Organization) is a plan type that covers care both inside and outside its network, without requiring referrals to see specialists. In-network care costs less; out-of-network care is covered at a reduced rate with higher cost sharing.",
      "PPOs trade higher premiums for flexibility. Read the out-of-network fine print carefully: reimbursement is often based on a \"usual and customary\" rate rather than the provider's charge, leaving you exposed to balance billing for the difference, and out-of-network spending typically counts toward a separate, much higher deductible and out-of-pocket maximum. The freedom to go anywhere is real, but it is rarely cheap."
    ],
    related: ["hmo", "network", "out-of-network", "ucr-usual-customary-and-reasonable"]
  },
  {
    term: "Preauthorization (Prior Authorization)",
    slug: "preauthorization-prior-authorization",
    definition: [
      "Preauthorization, also called prior authorization or precertification, is your insurer's requirement that certain services, drugs, imaging, or procedures be approved in advance as medically necessary, or the plan will not pay.",
      "Providers usually handle the paperwork, but the financial risk of a missing authorization lands on you, so protect yourself: before any scheduled surgery, MRI, or specialty medication, ask both the provider and your insurer whether authorization is required and confirm the approval number is on file. Remember that an approval is not a guarantee of payment, and a denial of authorization can be appealed before the service, which is far easier than fighting a denied claim afterward."
    ],
    related: ["denial", "appeal", "medical-necessity", "utilization-review"]
  },
  {
    term: "Premium",
    slug: "premium",
    definition: [
      "The premium is the fixed amount you or your employer pays, usually monthly, to keep your health insurance active, regardless of whether you use any care.",
      "Premiums do not count toward your deductible or out-of-pocket maximum, so the cheapest premium is not automatically the cheapest plan. Estimate your total annual cost: premiums plus the cost sharing you realistically expect. Healthy people who rarely see doctors often come out ahead with low-premium, high-deductible plans (especially paired with an HSA), while anyone with chronic conditions or a planned procedure usually saves with a richer plan despite the higher monthly bill."
    ],
    related: ["deductible", "open-enrollment", "cost-sharing"]
  },
  {
    term: "Preventive Care",
    slug: "preventive-care",
    definition: [
      "Preventive care covers screenings, immunizations, and annual wellness visits intended to catch or prevent disease early. Under the Affordable Care Act, ACA-compliant plans must cover a defined list of preventive services at 100 percent when delivered in-network, with no copay or deductible.",
      "The billing trap is the line between preventive and diagnostic. Mention a symptom during a free annual physical and part of the visit may be coded as diagnostic and billed to you; a screening colonoscopy that finds and removes a polyp may be recoded. Ask up front how the visit will be coded, and if a preventive service generates a bill, challenge the coding before paying."
    ],
    related: ["in-network", "diagnosis-code-icd-10", "copayment"]
  },
  {
    term: "Primary Care Physician",
    slug: "primary-care-physician",
    definition: [
      "A primary care physician (PCP) is the generalist doctor (family medicine, internal medicine, or pediatrics) who manages your overall health, handles routine problems, and coordinates specialist care. HMO plans typically require you to designate a PCP and obtain referrals through them.",
      "Beyond the plan rules, a good PCP is a cost-control asset: they can treat many issues that would otherwise become expensive specialist or urgent care visits, steer you to in-network, fairly priced specialists and facilities, and prevent duplicate testing by keeping your records in one place. If your plan requires a PCP on file and you never chose one, claims for specialist visits can deny automatically."
    ],
    related: ["hmo", "network", "preventive-care"]
  },
  {
    term: "Provider",
    slug: "provider",
    definition: [
      "In insurance language, a provider is anyone who delivers health care and bills for it: physicians, nurse practitioners, therapists, labs, imaging centers, hospitals, and clinics. Contracts, networks, and claims all run at the provider level.",
      "The practical implication is that one visit can involve several providers billing separately. A single ER trip may produce claims from the hospital, the ER physician group, a radiologist, and a lab, each with its own network status and its own bill. When bills arrive from names you do not recognize, match each one to the encounter and to an EOB before assuming it is legitimate, and before assuming it is a scam."
    ],
    related: ["network", "credentialing", "claim"]
  },
  {
    term: "Relative Value Unit (RVU)",
    slug: "relative-value-unit-rvu",
    definition: [
      "A relative value unit is the measure Medicare uses to weight how much work, practice expense, and malpractice risk a procedure involves. Each CPT code carries an RVU total, which is multiplied by a national conversion factor and adjusted for geography to produce the Medicare payment.",
      "You will never see RVUs on a bill, but they quietly set the baseline for the whole pricing system, since many private insurers pay providers a percentage of the Medicare RVU-based rate. RVUs explain why a ten-minute procedure can pay more than a forty-minute consultation, and they are why the Medicare fee schedule is such a useful anchor when negotiating a fair cash price."
    ],
    related: ["fee-schedule", "cpt-code", "medicare"]
  },
  {
    term: "Revenue Code",
    slug: "revenue-code",
    definition: [
      "A revenue code is a four-digit code on hospital bills (the UB-04 claim form) that identifies which department or category a charge belongs to: room and board, pharmacy, operating room, emergency room, recovery room, and so on.",
      "On an itemized hospital bill, revenue codes help you group and sanity-check the charges. They are useful for spotting problems like being billed for a private room you did not request, recovery room time that seems implausibly long, or pharmacy charges on a day you received no medications. If a category total looks wrong, ask for the detailed charges behind that revenue code."
    ],
    related: ["itemized-bill", "chargemaster", "drg"]
  },
  {
    term: "Self-Pay",
    slug: "self-pay",
    definition: [
      "Self-pay means paying for care directly without billing insurance, either because you are uninsured or because you choose not to use your coverage for a particular service.",
      "Self-pay prices are negotiable and often surprisingly low. Many hospitals and imaging centers have self-pay discounts far below list price, and sometimes below what you would owe through insurance before meeting a high deductible. Always ask for the cash price up front, get a good faith estimate in writing as the law entitles you to, and compare it with your insurance cost estimate. Note that self-pay amounts do not count toward your deductible or out-of-pocket maximum."
    ],
    related: ["good-faith-estimate", "chargemaster", "sliding-scale"]
  },
  {
    term: "Skilled Nursing Facility",
    slug: "skilled-nursing-facility",
    definition: [
      "A skilled nursing facility (SNF) provides short-term rehabilitation and nursing care, typically after a hospital stay for surgery, stroke, or serious illness. It is medical care, distinct from long-term custodial care in a nursing home, which most health insurance does not cover.",
      "The Medicare rule that catches families off guard: traditional Medicare covers SNF care only after a qualifying inpatient hospital stay spanning at least three days, and days spent under observation status do not count. Before agreeing to a SNF discharge plan, confirm the hospital stay met the requirement and ask the facility for its daily rate and expected coverage in writing."
    ],
    related: ["observation-status", "medicare", "utilization-review"]
  },
  {
    term: "Sliding Scale",
    slug: "sliding-scale",
    definition: [
      "A sliding scale is a fee structure where what you pay is based on your income and household size, used by federally qualified health centers, community clinics, and many mental health providers.",
      "If you are uninsured or underinsured, sliding scale clinics are one of the best-kept secrets in American health care: federally funded health centers must see patients regardless of ability to pay and adjust fees down to nominal amounts for low incomes, covering primary care, dental, and often behavioral health. Hospital financial assistance (charity care) programs work similarly, discounting bills based on income. You usually need to apply and provide proof of income, so ask for the application; it is rarely offered unprompted."
    ],
    related: ["self-pay", "medicaid", "underinsured"]
  },
  {
    term: "Step Therapy",
    slug: "step-therapy",
    definition: [
      "Step therapy, sometimes called \"fail first,\" is an insurance rule requiring you to try a cheaper drug, usually a generic or preferred brand, and have it fail or cause problems before the plan will cover the more expensive medication your doctor originally prescribed.",
      "If a pharmacy tells you a prescription needs step therapy, you have options: your doctor can prescribe the preferred alternative if it is clinically reasonable, or file a step therapy exception documenting why you need the original drug, for example because you already tried and failed the alternative under a previous plan. Exception denials can be appealed like any other denial."
    ],
    related: ["formulary", "preauthorization-prior-authorization", "appeal", "denial"]
  },
  {
    term: "Subrogation",
    slug: "subrogation",
    definition: [
      "Subrogation is your health insurer's right to recover what it paid for your care from a third party who caused your injury, most commonly after a car accident or injury claim, by claiming part of your settlement.",
      "This is why you may receive letters or questionnaires from your insurer (or a recovery vendor working for it) asking whether an injury was accident-related. Answer them, because ignoring subrogation questionnaires can cause the plan to suspend or reverse payment on your claims. If you hire a personal injury attorney, tell them about the health plan's lien early; the subrogation amount is often negotiable as part of the settlement."
    ],
    related: ["coordination-of-benefits", "claim"]
  },
  {
    term: "Superbill",
    slug: "superbill",
    definition: [
      "A superbill is an itemized receipt from a provider, listing the CPT procedure codes, ICD-10 diagnosis codes, provider identifiers, and fees for a visit, formatted so you can submit it to your insurer yourself for reimbursement.",
      "Superbills matter most with out-of-network care, especially therapy and other specialties where many clinicians do not bill insurance directly. If your plan has out-of-network benefits, submitting superbills can recover a meaningful share of the cost after your out-of-network deductible. Ask any cash-pay provider whether they issue superbills, and check your plan's claim submission deadline, since plans limit how long after the service you can file."
    ],
    related: ["cpt-code", "diagnosis-code-icd-10", "out-of-network", "claim"]
  },
  {
    term: "Surprise Billing",
    slug: "surprise-billing",
    definition: [
      "Surprise billing is receiving an unexpected out-of-network bill in a situation where you reasonably believed you were covered: an emergency at the nearest hospital, or an in-network surgery where the anesthesiologist, assistant surgeon, or lab turned out to be out-of-network.",
      "The No Surprises Act now bans the classic forms of this practice, limiting you to in-network cost sharing for emergencies and for out-of-network clinicians at in-network facilities. Gaps remain, notably ground ambulances, which the federal law does not cover, though some states do. Treat any surprise out-of-network bill as presumptively challengeable: check whether the law applies before paying a cent."
    ],
    related: ["no-surprises-act", "balance-billing", "out-of-network"]
  },
  {
    term: "Telehealth Billing",
    slug: "telehealth-billing",
    definition: [
      "Telehealth billing covers how video and phone visits are coded and paid. Claims use the same visit codes as in-person care with telehealth modifiers and place-of-service codes, and coverage rules vary by insurer, state, and program.",
      "Do not assume a video visit is automatically cheaper or free. Some plans waive cost sharing for telehealth through preferred vendors while billing a regular office-visit rate when your own doctor does the video call, and a hospital-employed doctor's telehealth visit can still generate a facility fee in some cases. Before a virtual visit, ask what you will owe and whether your plan treats it the same as an office visit."
    ],
    related: ["cpt-code", "modifier", "copayment"]
  },
  {
    term: "Third-Party Administrator",
    slug: "third-party-administrator",
    definition: [
      "A third-party administrator (TPA) is a company hired to process claims and run the day-to-day administration of a health plan, most commonly for self-funded employer plans where the employer, not an insurance company, actually pays the medical bills.",
      "This is why your card can say a big insurer's name while your employer is the real payer: the insurer may only be renting out its network and claims processing. It matters for disputes. Self-funded plans are governed by federal ERISA law rather than state insurance rules, appeals go through the plan documents, and your employer's benefits team often has real power to overturn a decision, so escalate to HR when a TPA will not budge."
    ],
    related: ["claim", "network", "appeal"]
  },
  {
    term: "TRICARE",
    slug: "tricare",
    definition: [
      "TRICARE is the health care program for active duty service members, military retirees, and their families, run by the Department of Defense. It offers several plan types, including Prime (an HMO-style managed option) and Select (a PPO-style option), with costs that vary by sponsor status.",
      "TRICARE has its own network, authorization, and referral rules that differ from civilian insurance, and using non-network providers under some plans exposes you to higher cost shares and, within limits, extra charges. TRICARE For Life acts as secondary coverage for Medicare-enrolled retirees, picking up much of Medicare's cost sharing. Always confirm a civilian provider actually accepts your specific TRICARE plan before booking."
    ],
    related: ["medicare", "network", "hmo"]
  },
  {
    term: "UCR (Usual, Customary and Reasonable)",
    slug: "ucr-usual-customary-and-reasonable",
    definition: [
      "UCR (usual, customary and reasonable) is the method some insurers use to set the allowed amount for out-of-network care: an estimate of what providers in your area typically charge for the service, rather than a contracted rate.",
      "UCR is where out-of-network math gets ugly. If the provider charges $2,500, the insurer decides UCR is $1,200, and pays 60 percent of that, you can owe not just the coinsurance but also the entire $1,300 gap through balance billing. If a UCR-based payment seems unreasonably low, you can ask the insurer how it was calculated and appeal; some plans instead base out-of-network payments on a percentage of the Medicare rate, which is often even lower."
    ],
    related: ["allowed-amount", "out-of-network", "balance-billing"]
  },
  {
    term: "Unbundling",
    slug: "unbundling",
    definition: [
      "Unbundling is billing separately for services that are supposed to be included in a single comprehensive code, such as charging individually for each component of a lab panel or billing incision closure separately from the surgery that included it.",
      "Unbundling inflates bills, and it is against coding rules whether it happens by sloppiness or by design. On an itemized bill, warning signs include long lists of small related charges on the same date and separate fees for things that sound like parts of one procedure. If you suspect unbundling, ask the billing office to justify the coding, and raise it with your insurer, whose claim-editing software exists to catch exactly this."
    ],
    related: ["upcoding", "bundled-payment", "cpt-code", "itemized-bill"]
  },
  {
    term: "Underinsured",
    slug: "underinsured",
    definition: [
      "Underinsured describes people who have health insurance but whose deductibles and other cost sharing are so high relative to their income that they still cannot afford care, skip treatment, or take on medical debt despite paying premiums.",
      "If this is you, there are levers to pull: hospital financial assistance programs usually consider insured patients too, not just the uninsured; sliding scale clinics serve underinsured patients; cash prices sometimes beat your pre-deductible insurance rate; and manufacturer copay assistance can slash specialty drug costs. During open enrollment, run the math on whether a higher premium plan with lower cost sharing would actually cost you less overall."
    ],
    related: ["out-of-pocket-maximum", "deductible", "sliding-scale"]
  },
  {
    term: "Upcoding",
    slug: "upcoding",
    definition: [
      "Upcoding is billing a more complex, higher-paying code than the service actually provided justifies, such as coding a brief follow-up as a lengthy comprehensive visit or an ER visit at the highest severity level without documentation to support it.",
      "Upcoding is fraud when intentional, but it also happens through aggressive or careless coding, and either way it raises your bill. Red flags include every visit billing at the highest level and charges that do not match how long or involved your visit was. Request the itemized bill and visit notes, ask the billing office to justify the code level, and report suspected patterns to your insurer, which has strong incentives to investigate."
    ],
    related: ["unbundling", "cpt-code", "itemized-bill"]
  },
  {
    term: "Utilization Review",
    slug: "utilization-review",
    definition: [
      "Utilization review is the process insurers use to evaluate whether care is medically necessary and delivered in the right setting, before a service (prior authorization), during a hospital stay (concurrent review), or after the fact (retrospective review).",
      "This is the machinery behind authorization requirements, observation-versus-inpatient decisions, and denials for care already delivered. During a hospital stay, the plan's reviewers may pressure for earlier discharge or a status change, and after discharge they can retroactively deny days they deem unnecessary. If a utilization review decision goes against you, the hospital's case managers and physician advisors can fight it, and you retain your own appeal rights alongside theirs."
    ],
    related: ["medical-necessity", "preauthorization-prior-authorization", "denial", "observation-status"]
  },
  {
    term: "Write-Off",
    slug: "write-off",
    definition: [
      "A write-off, or contractual adjustment, is the portion of a billed charge that a provider erases and never collects from anyone. For in-network care it is the difference between the list price and the contracted allowed amount, and it appears on your EOB as an adjustment.",
      "Understanding write-offs stops you from being fooled by sticker prices: a $10,000 charge with a $7,000 contractual write-off was never really a $10,000 service. It also frames self-pay negotiation, since providers routinely accept far less than list price from insurers, asking them to extend a comparable discount to you as a cash patient is entirely reasonable. Charity care write-offs work the same way for patients who qualify for financial assistance."
    ],
    related: ["allowed-amount", "eob", "explanation-of-payment", "self-pay"]
  }
];

export function getAllTerms(): GlossaryTerm[] {
  return glossaryTerms;
}
