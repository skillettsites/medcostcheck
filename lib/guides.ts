export interface GuideSection {
  heading: string;
  paragraphs: string[];
}

export interface Guide {
  slug: string;
  title: string;
  description: string;
  readingTime: string;
  updated: string;
  intro: string[];
  sections: GuideSection[];
  keyTakeaways: string[];
}

export const guides: Guide[] = [
  {
    slug: "how-medical-billing-works",
    title: "How Medical Billing Actually Works",
    description:
      "A plain-English walkthrough of CPT codes, charges vs. allowed amounts, how a claim moves through the system, and why your first bill is often wrong.",
    readingTime: "6 min read",
    updated: "July 2026",
    intro: [
      "If you have ever opened a medical bill and felt like you were reading a document written in another language, you are not imagining things. Medical billing in the United States runs on a coding system built for insurers and providers, not for patients. The numbers on your bill often bear little relationship to what anyone actually pays, and the first statement you receive is frequently not the final word.",
      "Understanding the machinery behind a bill changes how you deal with it. Once you know what a CPT code is, why the sticker price is mostly fiction, and how a claim travels from the exam room to your mailbox, you can spot errors, ask sharper questions, and avoid paying amounts you never owed in the first place.",
      "This guide walks through the whole pipeline step by step. It is billing education, not medical or legal advice, but it should leave you far better equipped the next time an envelope from a hospital shows up.",
    ],
    sections: [
      {
        heading: "CPT codes: the language of every bill",
        paragraphs: [
          "Almost every service a doctor, hospital, or lab performs is translated into a five-digit code from the Current Procedural Terminology system, maintained by the American Medical Association. A routine office visit, a knee MRI, a blood panel, a colonoscopy: each has its own CPT code, and that code is what gets sent to your insurer, not a written description of what happened.",
          "Codes matter because payment is attached to codes, not to the care itself. Two office visits that felt identical to you can be billed at different levels depending on how the visit was documented. Alongside CPT codes, providers submit diagnosis codes from the ICD-10 system that explain why the service was performed. If the diagnosis code does not justify the procedure code in the insurer's rules, the claim can be denied even though the care was perfectly appropriate.",
          "When you request an itemized bill, what you are really asking for is the list of CPT codes you were charged under. That list is the starting point for checking whether the bill describes what actually happened to you.",
        ],
      },
      {
        heading: "The chargemaster: why the sticker price is not real",
        paragraphs: [
          "Every hospital maintains a master list of prices called the chargemaster. These are the amounts that appear as \"charges\" on your bill, and they are typically far higher than what any insurer, or Medicare, actually pays. Chargemaster prices grew out of decades of negotiation dynamics between hospitals and insurers; the higher the list price, the bigger the discount an insurer can claim to have won.",
          "Almost nobody pays chargemaster rates in full. Insurers pay negotiated rates, Medicare pays rates set by formula, and uninsured patients who ask are usually offered discounts. The one group historically stuck closest to full charges was uninsured patients who did not know to ask. That is why the single most important thing to understand about a hospital bill is that the starting number is an opening position, not a fixed debt.",
        ],
      },
      {
        heading: "Charges, allowed amounts, and what you actually owe",
        paragraphs: [
          "Three different numbers show up in the billing process and they are easy to confuse. The billed charge is the provider's list price. The allowed amount is what your insurance plan has agreed the service is worth under its contract with that provider. Your responsibility is calculated from the allowed amount, never from the billed charge, as long as the provider is in your network.",
          "Say a provider bills a large charge for a procedure, but your plan's allowed amount is much lower. The difference between the two is written off by the in-network provider as a contractual adjustment; it simply disappears. Your deductible, coinsurance, or copay then applies to the allowed amount. This is why having insurance can save you money even before the plan pays a dime: you get access to negotiated prices.",
          "Out of network, the protection weakens. A non-contracted provider has not agreed to any allowed amount and may try to bill you for the gap, a practice called balance billing. Federal law now blocks this in specific situations, which we cover in our No Surprises Act guide, but it does not block it everywhere.",
        ],
      },
      {
        heading: "How a claim actually flows",
        paragraphs: [
          "The journey starts at registration, when the front desk captures your insurance details. After your visit, a coder or the physician translates the encounter into CPT and ICD-10 codes. The provider's billing system packages those codes into an electronic claim and sends it to your insurer, often through an intermediary called a clearinghouse that checks for formatting errors.",
          "The insurer then adjudicates the claim: it verifies you were covered on the date of service, checks that the service was a covered benefit, applies network rules and prior authorization requirements, calculates the allowed amount, and splits the cost between the plan and you. The result comes back to the provider as a remittance and to you as an explanation of benefits, or EOB.",
          "Only after adjudication does the provider know what to bill you. Any statement you receive before your insurer has finished processing the claim is provisional, which leads directly to the next point.",
        ],
      },
      {
        heading: "Why the first bill is often wrong",
        paragraphs: [
          "Providers commonly send statements before insurance has fully processed a claim, especially when a claim is denied on a technicality and resubmitted. If you pay the first bill immediately, you can end up paying amounts the insurer would have covered. A good habit is to hold any bill until you have the matching EOB from your insurer and the two documents agree.",
          "Bills also contain plain errors more often than most people expect: duplicate line items, services that were canceled but still charged, incorrect patient or insurance information that caused a denial, and coding mistakes that inflate the visit level. None of these fix themselves. They get corrected when a patient, or an insurer's auditor, notices.",
          "If a bill and an EOB do not match, call the provider's billing office and ask them to explain the discrepancy line by line. Billing offices deal with insurers all day; a patient who calls with an EOB in hand and specific questions is taken seriously.",
        ],
      },
      {
        heading: "Where Medicare rates fit into all this",
        paragraphs: [
          "Underneath the private negotiation layer sits a public benchmark: the Medicare Physician Fee Schedule, which sets what Medicare pays for each CPT code in each part of the country. Because those rates are published and formula-driven, they are the closest thing American health care has to a reference price. Researchers, employers, and increasingly patients use them to judge whether a charge is reasonable.",
          "That is the data this site is built on. When you look up a procedure on MedCostCheck, you are seeing the Medicare rate for that code in your area. It will not tell you exactly what your insurer allows, but it anchors the conversation: a charge that is many multiples of the Medicare rate deserves questions, and a cash price near the Medicare rate is generally a fair deal.",
        ],
      },
    ],
    keyTakeaways: [
      "Every service is billed under a CPT code; the codes, not the descriptions, determine what you are charged.",
      "The billed charge is a list price almost nobody pays; your share is calculated from the insurer's allowed amount.",
      "Never pay a bill until you have the matching EOB from your insurer and the numbers agree.",
      "Duplicate charges, canceled services, and coding errors are common; an itemized bill is how you find them.",
      "Medicare fee schedule rates are a published benchmark you can use to judge whether any charge is reasonable.",
    ],
  },
  {
    slug: "negotiate-medical-bills",
    title: "How to Negotiate a Medical Bill",
    description:
      "Step-by-step tactics for lowering a medical bill: itemized bill audits, common errors, cash discounts, charity care, payment plans, and appeals.",
    readingTime: "7 min read",
    updated: "July 2026",
    intro: [
      "Medical bills are negotiable. That sentence surprises a lot of people, because nothing about a hospital statement looks negotiable; it arrives formatted like a tax bill, with due dates and account numbers and threats of collections. But behind the formatting is a price that was often never designed to be paid in full, a billing process that produces frequent errors, and a set of legally required assistance programs that many patients never hear about.",
      "The patients who pay the least are usually not the ones with the best lawyers. They are the ones who ask for an itemized bill, check it, ask about financial assistance, and make a reasonable counteroffer in writing. None of that requires special expertise; it requires knowing the sequence and being politely persistent.",
      "Here is the sequence, in the order that tends to work best. This is general billing education, not legal advice, and hospital policies vary, so always confirm specifics with the billing office in writing.",
    ],
    sections: [
      {
        heading: "Step one: get the itemized bill",
        paragraphs: [
          "The summary statement most providers mail out shows totals by category, which is useless for finding errors. You are entitled to request an itemized bill listing every charge with its CPT or revenue code. Call the billing office, ask for it, and do not discuss payment until you have it. This single request signals that you are paying attention, and billing departments treat attentive patients differently.",
          "While you are on the phone, ask two more questions: has the claim been fully processed by your insurance, and does the hospital have a financial assistance policy. Write down the date, the representative's name, and what they said. A simple log of every call becomes powerful if the account is ever disputed or sent to collections.",
        ],
      },
      {
        heading: "Step two: audit it for common errors",
        paragraphs: [
          "With the itemized bill in hand, compare it against what you remember and against your EOB. The most common problems are duplicate charges for the same service, charges for services or medications that were ordered and then canceled, quantities that do not make sense, and room or facility charges for time you were not there, such as a full day billed on your discharge date when the policy says otherwise.",
          "Two coding problems are worth knowing by name. Upcoding is billing a more intensive service than was performed, such as the highest-level emergency visit for a minor issue. Unbundling is billing separately for components that are supposed to be included in a single bundled code. You do not have to prove either one definitively; you only have to ask the billing office to justify the code, and ask your insurer to review it if the answer is unsatisfying.",
          "Also verify the boring details: correct name, correct insurance ID, correct dates of service. A surprising share of denied claims fail on data entry, and a denial caused by the provider's typo is not your debt to eat. Ask them to correct and resubmit.",
        ],
      },
      {
        heading: "Step three: ask about financial assistance before negotiating",
        paragraphs: [
          "Nonprofit hospitals are required under federal tax rules to maintain a written financial assistance policy, sometimes called charity care, and to make it available to patients. These policies commonly provide free or discounted care to patients below certain income thresholds, and the thresholds are often higher than people assume; families with solid middle incomes can qualify for partial discounts at many hospitals.",
          "Ask the billing office directly: \"Do you have a financial assistance policy, and can you send me the application?\" Apply even if you are unsure you qualify. Many hospitals will pause collection activity while an application is pending, and a denial costs you nothing. If you were eligible at the time of service, some policies apply retroactively, so it is worth asking even about older bills.",
        ],
      },
      {
        heading: "Step four: negotiate the balance",
        paragraphs: [
          "Once errors are fixed and assistance has been explored, negotiate what remains. If you are uninsured or the service was out of network, ask for the cash-pay or self-pay rate; most providers maintain one, and it is often dramatically lower than billed charges. A useful anchor is the Medicare rate for the same procedure, which you can look up on this site: offering to pay promptly at or somewhat above the Medicare rate is a credible, defensible position.",
          "If you can pay a lump sum, say so. Billing offices frequently accept a reduced amount in exchange for immediate payment because it beats the cost and uncertainty of collections. Get any agreement in writing before you pay, with language that the payment settles the account in full. A verbal discount that is not documented has a way of evaporating.",
        ],
      },
      {
        heading: "Step five: use payment plans instead of credit cards",
        paragraphs: [
          "If you cannot settle the bill outright, nearly every hospital offers payment plans, and many are interest free. A modest monthly payment you actually make keeps the account in good standing. By contrast, moving a medical bill onto a regular credit card converts a flexible, often interest-free debt into rigid consumer debt and can forfeit your eligibility for financial assistance on that balance.",
          "Be equally careful with medical credit cards and financing products offered in provider offices. Some carry deferred interest terms under which the full interest from day one is charged if the balance is not cleared by the end of the promotional period. Read the terms before signing anything in a waiting room.",
        ],
      },
      {
        heading: "Step six: appeal insurance denials, and know the collections rules",
        paragraphs: [
          "If part of the bill exists because your insurer denied a claim, do not accept the denial as final. You have the right to an internal appeal, and if the plan upholds its denial, generally a right to an independent external review for medical judgment denials. Denial letters must state the reason; many denials are overturned when the provider supplies missing documentation or corrects a code, so loop the provider's office into the appeal.",
          "Finally, know that time is more on your side than collection notices suggest. Credit reporting practices have shifted in recent years so that medical debt does far less immediate damage than it once did, and hospitals generally must make reasonable efforts to determine financial assistance eligibility before taking aggressive collection actions. Do not let urgency pressure you into paying an unverified bill. Verify first, negotiate second, and put everything in writing.",
        ],
      },
    ],
    keyTakeaways: [
      "Always request an itemized bill with codes before paying or negotiating anything.",
      "Check for duplicates, canceled services, upcoding, and unbundling; billing errors are common and correctable.",
      "Nonprofit hospitals must have financial assistance policies; apply even if you doubt you qualify.",
      "Negotiate using the Medicare rate as an anchor, and get any settlement or discount in writing.",
      "Prefer hospital payment plans over credit cards, and appeal insurance denials rather than absorbing them.",
    ],
  },
  {
    slug: "facility-fees-explained",
    title: "Facility Fees: Why the Same Procedure Costs More at a Hospital",
    description:
      "Why identical care can cost far more in a hospital outpatient department: provider-based billing, facility fees, and how to ask where you will be treated.",
    readingTime: "6 min read",
    updated: "July 2026",
    intro: [
      "Imagine seeing the same doctor, in the same exam room, for the same fifteen-minute visit, and paying twice: once for the doctor and once for the building. That is not a hypothetical. It is how hospital outpatient billing works, and it is one of the most common sources of sticker shock in American health care.",
      "The charge for the building is called a facility fee, and it appears when care is delivered in a location that bills as part of a hospital rather than as an independent physician office. Patients rarely see it coming, because the location often looks exactly like a normal doctor's office, sometimes because it was a normal doctor's office until a hospital bought the practice.",
      "This guide explains where facility fees come from, why the same CPT code can produce wildly different totals depending on the address, and the exact questions to ask before an appointment so the answer never surprises you.",
    ],
    sections: [
      {
        heading: "Two bills for one visit",
        paragraphs: [
          "When you receive care in a hospital outpatient department, the encounter is typically split into two claims. The professional fee pays the physician for their work. The facility fee pays the hospital for the room, equipment, nursing, and overhead. In an independent physician office, there is no facility fee; the office visit charge covers everything.",
          "The result is that the total for a hospital-based visit is commonly much higher than for the identical service in a private office, and your share rises with it. Facility fees often land on your deductible or coinsurance rather than being covered by a flat copay, so the difference comes straight out of your pocket even with good insurance.",
        ],
      },
      {
        heading: "Provider-based billing, in plain English",
        paragraphs: [
          "The mechanism behind this is called provider-based billing. Medicare and most insurers allow a hospital to designate off-campus clinics and physician practices it owns as departments of the hospital. Once designated, those locations bill like the hospital does: professional fee plus facility fee, at hospital rates.",
          "Nothing about the care has to change for the billing to change. When a hospital system acquires an independent cardiology practice, the same doctors in the same building can begin billing as a hospital outpatient department. Patients who had been paying an office-visit rate for years suddenly see a facility fee appear, and unless they read the fine print of the notice they were handed at check-in, they will not understand why.",
          "There are rules requiring certain hospital-based clinics to notify patients that facility fees may apply, and some states have moved to restrict facility fees in specific settings. But disclosure practices vary, and the notice is often a form buried in intake paperwork.",
        ],
      },
      {
        heading: "Site of service: the biggest hidden price variable",
        paragraphs: [
          "For many procedures, where the service happens is a bigger driver of your cost than what the service is. The same colonoscopy, MRI, or minor surgery is generally cheapest at an independent office or freestanding imaging center, more expensive at an ambulatory surgery center, and most expensive at a hospital outpatient department. Emergency departments sit at the top of the scale.",
          "Even Medicare pays differently by site. The Medicare Physician Fee Schedule publishes separate rates for the same CPT code depending on whether it is performed in a facility or a non-facility setting; the physician's payment is lower in a facility precisely because the hospital is billing separately for overhead. When you look up a procedure on this site and see facility and non-facility rates, that split is what you are seeing.",
          "The practical takeaway: for planned, shoppable services like imaging, labs, and routine procedures, choosing a freestanding location can lower the total cost dramatically without changing the quality of the test.",
        ],
      },
      {
        heading: "Why hospitals defend facility fees",
        paragraphs: [
          "Hospitals argue that facility fees are not padding; they fund standby capacity that offices do not maintain: emergency readiness, 24-hour staffing, charity care, and the ability to handle complications on site. There is truth in that for genuinely hospital-based care. A chemotherapy infusion suite inside a cancer center is not the same operation as a strip-mall clinic.",
          "The controversy is sharpest at the margins: routine office visits and basic imaging billed at hospital rates simply because of who owns the building. Policymakers have debated site-neutral payment, meaning paying the same amount for the same service regardless of setting, for years, and some steps in that direction exist in Medicare. But broad site-neutral payment has not arrived, so for now the burden of noticing the difference falls on patients.",
        ],
      },
      {
        heading: "The questions to ask before your appointment",
        paragraphs: [
          "Before any scheduled visit, imaging study, or procedure, ask the scheduler three questions. First: \"Is this location billed as a hospital outpatient department, and will there be a separate facility fee?\" Second: \"What are the CPT codes for what is planned?\" Third: \"Can this be done at an independent office or freestanding center instead?\"",
          "If you have insurance, call the member line with those CPT codes and ask what your estimated share would be at each location. If you are self-pay, ask each location for its cash price. The differences you find will often be large enough to justify a longer drive.",
          "Watch for clues that a location is hospital-based: the hospital system's name on the building, billing paperwork listing the hospital rather than the practice, or a check-in form mentioning provider-based or hospital outpatient billing. When in doubt, ask directly; staff must tell you.",
        ],
      },
      {
        heading: "What to do if a facility fee blindsides you",
        paragraphs: [
          "If a facility fee shows up on a bill you did not expect, start by asking whether you were given clear written notice that the location billed as a hospital department. If notice was missing or buried, say so when you dispute the charge; hospitals have discretion to reduce or waive fees, and they exercise it more often for patients who push back with a specific complaint.",
          "Then run the normal playbook from our negotiation guide: itemized bill, financial assistance application if the amount is significant, and a settlement offer anchored to a reasonable benchmark. And for next time, make the site-of-service question a standard part of booking any appointment. It is the single highest-value question in outpatient health care shopping.",
        ],
      },
    ],
    keyTakeaways: [
      "Hospital outpatient departments bill twice: a professional fee for the doctor and a facility fee for the building.",
      "Provider-based billing lets hospital-owned clinics charge facility fees even when they look like ordinary offices.",
      "The same CPT code is usually cheapest at an independent office, higher at a surgery center, highest at a hospital.",
      "Always ask whether a location bills as a hospital outpatient department before you book.",
      "Unexpected facility fees can be disputed, especially where notice was unclear, and hospitals can reduce or waive them.",
    ],
  },
  {
    slug: "no-surprises-act",
    title: "The No Surprises Act: What It Protects You From (and What It Does Not)",
    description:
      "How the No Surprises Act blocks balance billing for emergency and out-of-network care, what good faith estimates cover, and the gaps that remain.",
    readingTime: "7 min read",
    updated: "July 2026",
    intro: [
      "For years, one of the ugliest experiences in American health care went like this: you carefully chose an in-network hospital, had surgery, and then received a massive bill from an out-of-network anesthesiologist you never chose and never met. The practice was called balance billing, and until 2022 it was mostly legal.",
      "The No Surprises Act, which took effect in January 2022, was built to end the worst of it. It is a genuinely strong consumer protection law, but its protections have precise boundaries, and knowing where they stop matters just as much as knowing they exist. Some of the most financially dangerous bills in health care still fall outside it.",
      "This guide covers what the law protects, how the good faith estimate process works for uninsured and self-pay patients, what to do when a provider breaks the rules, and the gaps, ground ambulances chief among them, that can still hit your wallet.",
    ],
    sections: [
      {
        heading: "The core protection: no balance billing in situations you cannot control",
        paragraphs: [
          "The law targets situations where patients have no realistic ability to choose an in-network provider. The first is emergency care: if you receive emergency services, including at an out-of-network hospital or freestanding emergency department, you can only be charged your plan's in-network cost sharing. The providers cannot bill you for the difference between their charge and what your plan pays.",
          "The second is out-of-network providers working inside in-network facilities. If your hospital is in network, the anesthesiologists, radiologists, pathologists, emergency physicians, assistant surgeons, and similar clinicians who treat you there generally cannot balance bill you, whether or not they individually participate in your plan. Your cost sharing is calculated as if they were in network, and it counts toward your in-network deductible.",
          "Air ambulance transports are also covered: out-of-network air ambulance providers cannot balance bill you and your cost sharing is limited to in-network levels. Disputes over what the plan owes the provider go to an arbitration process between them; the point of the law is that you are removed from that fight.",
        ],
      },
      {
        heading: "The consent exception, and who can never ask for it",
        paragraphs: [
          "For some non-emergency situations, an out-of-network provider can ask you to waive your protections by signing a notice-and-consent form, generally required to be given to you in advance of the service. If you sign, they may balance bill you. You are never obligated to sign, and for scheduled care you can use the request as a prompt to find an in-network alternative.",
          "Crucially, certain providers are barred from using the consent exception at all. Anesthesiologists, radiologists, pathologists, neonatologists, assistant surgeons, hospitalists, and intensivists cannot ask you to waive protections, and neither can providers of diagnostic services like labs and imaging connected to your visit, or any provider when there is no in-network alternative available at the facility. These are exactly the specialties behind the classic surprise bill, and the law closed that door on purpose.",
          "If you are handed a consent form at check-in for a scheduled procedure, read it carefully. It should name the provider, estimate the cost, and be separate from the general intake paperwork. A waiver buried in a stack of admission forms is a red flag worth questioning on the spot.",
        ],
      },
      {
        heading: "Good faith estimates for uninsured and self-pay patients",
        paragraphs: [
          "The law also created a right that has nothing to do with insurance. If you are uninsured, or insured but choosing to self-pay, providers must give you a good faith estimate of expected charges for scheduled services, in writing, before the care. For care scheduled a few days or more in advance, the estimate is supposed to arrive automatically; you can also request one at any time while shopping.",
          "The estimate should itemize expected services with their codes and expected charges. Keep it. It is not just a courtesy document; it is the trigger for a formal dispute right if the final bill comes in substantially higher.",
        ],
      },
      {
        heading: "The patient-provider dispute process",
        paragraphs: [
          "If you received a good faith estimate and the final bill from that provider exceeds it by four hundred dollars or more, you can initiate the federal patient-provider dispute resolution process. An independent reviewer examines the estimate and the bill and determines what you owe. There is a modest administrative fee to file, and while the dispute is pending, the provider is restricted from sending the bill to collections.",
          "Deadlines apply, so act promptly when a bill lands; the window to file is measured in days from the bill date, not months. Even short of a formal dispute, the existence of the process gives you leverage: a billing office that knows you have a qualifying estimate and know your rights will often simply honor the estimate rather than defend the overage.",
        ],
      },
      {
        heading: "The gaps: where surprise bills still live",
        paragraphs: [
          "The most important gap is ground ambulances. The No Surprises Act does not cover them, and ground ambulance rides are frequently out of network because patients cannot choose the company that responds. A federal advisory committee has studied the problem and a number of states have passed their own protections, but coverage is a patchwork. If you get a balance bill for a ground ambulance, check whether your state has its own law before assuming you owe it.",
          "Other boundaries matter too. The law does not make out-of-network care cheap when you knowingly choose it; it does not apply to care that is simply not covered by your plan; and urgent care centers and regular office visits are outside the emergency protections. The law also does not cap in-network cost sharing itself. A perfectly legal bill can still be a large bill; the Act removes ambush pricing, not high prices.",
        ],
      },
      {
        heading: "What to do if you get a bill that looks illegal",
        paragraphs: [
          "First, compare the bill to your EOB. If an out-of-network provider at an in-network facility is charging you more than the in-network cost sharing shown by your plan, that is the signature of an unlawful balance bill. Call the provider, state that you believe the bill violates the No Surprises Act, and ask them to rebill correctly. Many of these bills are automation errors that get corrected when challenged.",
          "If the provider will not budge, call your insurer and ask them to intervene, and file a complaint through the federal No Surprises Help Desk, which accepts consumer complaints about balance billing violations and good faith estimate failures. Do not pay a bill you believe is unlawful just to make it stop; payment can complicate getting the money back. Document everything and escalate. The enforcement mechanisms exist precisely for this.",
        ],
      },
    ],
    keyTakeaways: [
      "Since January 2022, emergency care and out-of-network providers at in-network facilities generally cannot balance bill you.",
      "Anesthesiologists, radiologists, pathologists, and similar specialists cannot ask you to waive these protections.",
      "Uninsured and self-pay patients are entitled to a written good faith estimate before scheduled care.",
      "A bill four hundred dollars or more above your estimate can be taken to a federal dispute process.",
      "Ground ambulances are the big gap: not covered federally, though some states have their own rules.",
    ],
  },
  {
    slug: "uninsured-options",
    title: "Paying for Care Without Insurance",
    description:
      "Practical options for uninsured patients: cash prices, community health centers, hospital financial assistance, marketplace subsidies, and drug discounts.",
    readingTime: "7 min read",
    updated: "July 2026",
    intro: [
      "Being uninsured in the American health system feels like walking into a store where none of the prices are posted and every shopper pays a different amount. But uninsured does not have to mean unprotected or overcharged. There is an entire layer of the system, cash prices, sliding-scale clinics, mandated hospital assistance programs, and subsidized coverage you may not know you qualify for, that exists specifically for people paying their own way.",
      "The key mental shift is this: the list price is not your price. Self-pay patients who ask for cash rates, apply for assistance, and use the right venues for routine care routinely pay a fraction of the amounts printed on first-draft bills.",
      "This guide maps the options in rough order of usefulness, from getting today's care affordably to fixing the underlying coverage gap. It is billing and cost education, not medical, legal, or insurance advice; programs vary by state and by institution, so verify details locally.",
    ],
    sections: [
      {
        heading: "Ask for the cash price, always",
        paragraphs: [
          "Nearly every provider maintains a self-pay or cash rate that is far below billed charges, and hospitals have been required since 2021 to publish their prices, including cash prices, under the federal hospital price transparency rule. Before any scheduled service, ask directly: \"What is your self-pay price for this, paid at time of service?\" Then compare across providers; the spread for the same test in the same city can be enormous.",
          "Cash prices are sometimes lower than what insured patients pay through their plans, particularly for imaging and labs. Freestanding imaging centers and independent labs are usually the cheapest venues. A useful sanity check for any quote is the Medicare rate for the procedure, which you can look up on this site: a cash price in the neighborhood of the Medicare rate is generally reasonable, and one that is several times higher is worth shopping around.",
        ],
      },
      {
        heading: "Community health centers and sliding-scale care",
        paragraphs: [
          "For primary care, the single best resource for uninsured patients is the network of federally qualified health centers, or FQHCs. These community clinics receive federal funding on the condition that they treat everyone regardless of ability to pay, charging on a sliding scale based on income and family size. Services typically include primary care, preventive care, and often dental, behavioral health, and low-cost medications.",
          "You can find nearby centers through the federal health center locator run by the Health Resources and Services Administration. Free and charitable clinics, often volunteer-run, fill similar gaps in many communities. Using these venues for routine needs keeps small problems from becoming emergency-room problems, which is the most expensive way to receive care in the entire system.",
        ],
      },
      {
        heading: "Hospital financial assistance is not optional for them",
        paragraphs: [
          "If you do end up with hospital care, remember that nonprofit hospitals are required by federal tax rules to maintain financial assistance policies, and many state laws add further requirements. These policies commonly provide free care below certain income levels and steep discounts above them. Eligibility often reaches well into middle incomes, and some hospitals must limit what they charge assistance-eligible uninsured patients to amounts tied to what insurers pay, not chargemaster rates.",
          "The catch is that assistance rarely applies itself automatically. Ask every hospital, before or after care, for its financial assistance application, and submit it even if you are unsure. Keep copies. If a bill goes to collections while your application is pending, say so in writing; hospitals are generally expected to make reasonable efforts to determine eligibility before extraordinary collection actions.",
        ],
      },
      {
        heading: "You may be able to fix the coverage gap itself",
        paragraphs: [
          "Many uninsured Americans qualify for coverage they have not claimed. Health insurance marketplace plans come with income-based premium subsidies that can make coverage far cheaper than the sticker premium, and in some cases very low cost. Open enrollment runs late in the calendar year for most states, but losing a job, losing other coverage, moving, getting married, or having a child typically opens a special enrollment period during the year.",
          "Separately, Medicaid and the Children's Health Insurance Program cover adults and children at low incomes, with eligibility rules that vary by state; in states that expanded Medicaid, eligibility is based on income alone for most adults. Medicaid enrollment is open year-round. Before assuming coverage is unaffordable, spend thirty minutes on the marketplace application or with a local enrollment navigator, who assists for free. The worst case is a confirmed answer.",
        ],
      },
      {
        heading: "Prescriptions: never pay the first quoted price",
        paragraphs: [
          "Drug prices for cash payers are wildly inconsistent between pharmacies, so treat prescriptions as a shopping exercise. Free discount programs and cards can cut generic prices dramatically, and some large pharmacies and retailers maintain low-cost generic lists. Online cash pharmacies have also pushed prices down for many common generics. It is worth checking whether the cash-discount price beats what you would pay even with coverage.",
          "For brand-name drugs, check the manufacturer's patient assistance program; many offer free or reduced-cost medication to patients under income thresholds, and copay support where applicable. Your prescriber can also help: ask whether a cheaper generic or therapeutic alternative exists, and whether a larger-quantity fill lowers the per-dose cost. Pharmacists will often tell you the cheapest route if you ask directly.",
        ],
      },
      {
        heading: "Handle medical debt carefully, and avoid the traps",
        paragraphs: [
          "If a balance remains after discounts and assistance, use the provider's own payment plan, which is often interest free, rather than a credit card. Be especially wary of medical credit cards and point-of-sale financing offered in provider offices; deferred-interest terms can retroactively apply steep interest if the balance is not fully paid by the end of the promotional window, turning a manageable bill into an expensive loan.",
          "Know also that the credit-reporting landscape for medical debt has softened in recent years: the major bureaus have stopped reporting many smaller and paid medical collections, and rules in this area have continued to evolve. That does not make debt disappear, but it does mean collection-notice scare tactics often overstate the immediate consequences. Verify every bill, negotiate before paying, get agreements in writing, and never let urgency make the decision for you.",
        ],
      },
    ],
    keyTakeaways: [
      "Always ask for the self-pay cash price; it is often a fraction of billed charges and sometimes beats insurance rates.",
      "Community health centers treat everyone on a sliding income scale and are the best venue for routine care.",
      "Nonprofit hospitals must offer financial assistance; apply for it every time, even retroactively.",
      "Check marketplace subsidies and Medicaid before assuming coverage is out of reach; enrollment help is free.",
      "Shop pharmacies with discount programs, and avoid deferred-interest medical financing products.",
    ],
  },
  {
    slug: "understanding-eob",
    title: "How to Read an EOB (Explanation of Benefits)",
    description:
      "What every field on an explanation of benefits means, how EOBs differ from bills, and how to match the two documents to catch costly errors.",
    readingTime: "6 min read",
    updated: "July 2026",
    intro: [
      "A few weeks after any medical visit, a document arrives from your insurance company covered in numbers and stamped with the reassuring phrase \"This is not a bill.\" Most people glance at it and file it, or recycle it. That is a mistake. The explanation of benefits, or EOB, is the single most useful document in your entire billing paper trail, because it shows what your insurer actually decided, which is the only math that determines what you owe.",
      "Every billing error, every improper balance bill, and every claim denial reveals itself in the gap between an EOB and the provider's bill. Learning to read one takes about ten minutes, and it converts you from someone who pays whatever arrives into someone who verifies before paying.",
      "Here is a field-by-field tour, the underlying cost-sharing mechanics, and a simple matching routine that catches most problems.",
    ],
    sections: [
      {
        heading: "What an EOB is, and what it is not",
        paragraphs: [
          "An EOB is your insurer's report of how it processed a claim: what the provider billed, what the plan allowed, what the plan paid, and what portion is yours. It is generated by the insurance company, not the provider, and it is not a request for payment. You never pay an EOB; you pay the provider's bill, and only after confirming it agrees with the EOB.",
          "Because EOBs and bills come from different organizations on different schedules, they rarely arrive together. The correct habit is to hold every provider bill until the matching EOB arrives, then compare them line by line. If a provider bill arrives before the EOB, that is often a sign the claim has not finished processing, and paying at that moment is premature.",
        ],
      },
      {
        heading: "The fields, decoded",
        paragraphs: [
          "Most EOBs share the same anatomy regardless of insurer. You will find the patient and member ID, the provider name, the claim number, and the date of service; then, for each line item, a service description or CPT code, the amount billed, the allowed amount, any contractual adjustment or discount, the amount the plan paid, and the amount assigned to you, usually broken into deductible, copay, and coinsurance columns.",
          "Two fields deserve special attention. The allowed amount is the negotiated price your plan and the provider agreed to; everything is calculated from it. The remark or reason codes, usually small alphanumeric codes with a legend somewhere on the document, explain anything unusual: why a line was denied, reduced, or bundled into another. When an EOB confuses you, the reason codes are almost always where the answer lives.",
          "Also check the running totals many EOBs include: how much of your annual deductible you have met and where you stand against your out-of-pocket maximum. Tracking these two numbers tells you when your costs for the year should drop sharply, and errors in them are worth correcting promptly.",
        ],
      },
      {
        heading: "Billed vs. allowed: where the money disappears",
        paragraphs: [
          "The most eye-catching feature of any EOB is the gulf between the billed amount and the allowed amount. A provider may bill a number several times what the plan allows. For in-network care, the difference is a contractual write-off: the provider agreed to the plan's rates and simply cannot collect the gap from you. If an in-network provider's bill tries to charge you more than the EOB's patient responsibility figure, the bill is wrong.",
          "For out-of-network care the picture changes: absent legal protections like the No Surprises Act, an out-of-network provider may bill you the difference. This is why the network status shown on the EOB matters so much, and why an EOB that processed an in-network provider as out-of-network, which happens, is worth an immediate phone call. Directory errors and claim-routing mistakes do get corrected when challenged.",
        ],
      },
      {
        heading: "Deductibles, coinsurance, and copays in practice",
        paragraphs: [
          "The patient responsibility section is where the plan's cost-sharing rules play out. Amounts applied to your deductible are yours to pay in full until the annual deductible is met; the EOB will show the allowed amount flowing into the deductible column early in the plan year. Copays are flat fees for certain visit types and usually appear as a fixed number regardless of the allowed amount.",
          "Coinsurance is a percentage split of the allowed amount that begins after the deductible is met; a plan might pay most of the allowed amount while you pay the rest, in whatever proportions your plan documents specify. All of your in-network deductible, copay, and coinsurance payments should accumulate toward the out-of-pocket maximum, after which the plan pays covered in-network services in full for the rest of the year. If late-year EOBs still assign you coinsurance after you believe you hit the maximum, investigate; accumulator errors happen.",
        ],
      },
      {
        heading: "The five-minute matching routine",
        paragraphs: [
          "When a provider bill arrives, pull the EOB for the same date of service and run four checks. One: do the service lines match, or is the bill charging for something the EOB never processed? Two: does the bill's amount due equal the EOB's total patient responsibility? Three: were any lines denied, and if so, does the reason code suggest a fixable problem like a coding error or missing information? Four: is the provider shown as in network as you expected?",
          "Any mismatch gets a phone call before any payment. If the bill is higher than the EOB's patient responsibility for in-network care, tell the billing office the amounts do not match your EOB and ask them to rebill. If a line was denied for a technicality, ask the provider to correct and resubmit the claim rather than accepting the charge. Keep notes of every call: date, name, and what was promised.",
        ],
      },
      {
        heading: "When the EOB itself reveals a denial worth fighting",
        paragraphs: [
          "Sometimes the problem is not a mismatch but the insurer's decision itself: a service processed as not covered, not medically necessary, or out of network. The EOB, together with the formal denial letter, is your evidence package. You generally have the right to an internal appeal with your plan, and for denials involving medical judgment, an external review by an independent third party after that.",
          "Appeals succeed more often than people assume, particularly when the provider's office supplies supporting documentation or corrects a code. Deadlines for appeals are stated in the denial paperwork, so start early. And keep every EOB, at least until the matching bill is resolved and the plan year is closed; in any billing dispute, the patient with a complete EOB file is the patient who wins.",
        ],
      },
    ],
    keyTakeaways: [
      "An EOB is the insurer's decision record, not a bill; never pay a provider bill that contradicts it.",
      "The allowed amount, not the billed charge, is the number all of your cost sharing is calculated from.",
      "In-network providers cannot collect more than the EOB's patient responsibility figure.",
      "Match every bill to its EOB: same services, same amount due, expected network status, no unexplained denials.",
      "Denials shown on an EOB can be appealed internally and then externally; deadlines are in the denial letter.",
    ],
  },
  {
    slug: "medicare-vs-private-prices",
    title: "Why Medicare Rates Are the Benchmark for Medical Prices",
    description:
      "How the Medicare Physician Fee Schedule sets prices with RVUs, GPCIs, and a conversion factor, and how to use Medicare rates as a negotiation anchor.",
    readingTime: "7 min read",
    updated: "July 2026",
    intro: [
      "American health care has thousands of prices for the same service: one for each insurance contract, one for cash payers who ask, one absurd list price for those who do not, and underneath them all, one price set in public by formula. That last one is the Medicare rate, and it is the closest thing the system has to a true reference price.",
      "Medicare's physician payment rates are not negotiated in secret. They are computed from published inputs, adjusted for local costs, updated annually through public rulemaking, and applied identically to every participating provider in a given area. That transparency is exactly why researchers, employers, benefit designers, and savvy patients use Medicare rates as the yardstick against which every other price is measured.",
      "This guide explains how the Medicare Physician Fee Schedule actually works, why private insurance pays more, and how you can use the Medicare rate as a practical anchor when checking or negotiating a bill. It also explains the methodology behind this site, because MedCostCheck is built directly on this data.",
    ],
    sections: [
      {
        heading: "The building blocks: relative value units",
        paragraphs: [
          "Every service in the fee schedule, identified by its CPT or HCPCS code, is assigned relative value units, or RVUs, that express how resource-intensive it is compared with every other service. The RVU total has three components: physician work, covering time, skill, and intensity; practice expense, covering staff, equipment, rent, and supplies; and malpractice expense, covering liability insurance costs.",
          "A complex surgery carries far more total RVUs than a routine office visit, and that ratio, not a dollar figure, is the fee schedule's core statement about value. The relative weights are reviewed and updated through a public process, with input from a physician committee convened by the American Medical Association, and the results are published for anyone to inspect. Practice expense RVUs also differ by setting: a procedure performed in a physician's own office carries higher practice expense than the same procedure in a hospital, where the facility bills separately for overhead. That is why this site shows facility and non-facility rates.",
        ],
      },
      {
        heading: "Local adjustment: GPCIs",
        paragraphs: [
          "It costs more to run a practice in Manhattan than in rural Mississippi, so Medicare adjusts each RVU component by a geographic practice cost index, or GPCI. Each of Medicare's payment localities has three GPCIs, one each for work, practice expense, and malpractice, reflecting local wages, rents, and liability premiums.",
          "The adjustment is deliberately moderate; it narrows geographic differences rather than mirroring them fully, and the work GPCI in particular is compressed by policy. But it means the same CPT code pays somewhat different amounts in San Francisco, Houston, and Des Moines. When MedCostCheck asks for your ZIP code, this is why: it maps you to a Medicare locality and applies that locality's GPCIs so the rate you see is the one that actually applies where you live.",
        ],
      },
      {
        heading: "The conversion factor turns points into dollars",
        paragraphs: [
          "After RVUs are geographically adjusted, they are multiplied by a single national dollar amount called the conversion factor. That one number converts the entire relative value scale into actual payments, and it is updated each year through rulemaking, subject to statutory formulas and periodic congressional intervention.",
          "The complete formula is simple to state: payment equals the geographically adjusted RVU total times the conversion factor. Everything on this site flows from that arithmetic, using the current year's published RVU file, GPCI file, and conversion factor from the Centers for Medicare and Medicaid Services. There is no estimation or modeling in the rates you see here; they are the computed fee schedule amounts. Note that the fee schedule is the payment for the service itself; a Medicare patient's share, typically 20 percent coinsurance under Part B after the deductible, is a separate matter of benefit design.",
        ],
      },
      {
        heading: "Why private insurers pay more than Medicare",
        paragraphs: [
          "Private insurance rates are set by negotiation between insurers and providers, and negotiating power varies enormously. A dominant hospital system that an insurer cannot exclude from its network can command high rates; a small independent practice cannot. The consistent research finding is that commercial insurance pays more than Medicare for the same services, often substantially more, with hospital care showing a wider gap than physician services and enormous variation from market to market and contract to contract.",
          "Several forces sustain the gap. Providers argue Medicare rates sit below their costs for some services, making commercial payers the margin that keeps the doors open. Consolidation among hospitals and physician groups has strengthened provider leverage. And prices for specific services stayed opaque for decades, though federal transparency rules for hospitals and insurers have begun exposing negotiated rates to daylight. None of this changes the practical point: the Medicare rate is the stable floor from which every other price is a markup.",
        ],
      },
      {
        heading: "Using Medicare rates as a negotiation anchor",
        paragraphs: [
          "Because commercial prices are multiples of Medicare, the Medicare rate gives you an instant reasonableness test for any bill or quote. Look up the CPT code on this site for your ZIP code, then compare. A cash price at or modestly above the Medicare rate is generally a fair deal. A charge that is many multiples of Medicare deserves scrutiny and, for shoppable services, comparison shopping.",
          "In a negotiation, the anchor works best stated plainly: \"Medicare pays about this amount for this procedure in this area. I can pay that amount, or close to it, promptly. Can we settle at that figure?\" Billing offices know exactly what Medicare pays; you are not introducing an exotic concept, you are signaling that you know the reference price. Many hospitals also tie their financial assistance discounts to amounts derived from what Medicare or insurers pay, so the benchmark carries weight inside their own policies too.",
          "Be fair with the tool. Some services genuinely cost more to deliver than Medicare pays, and a small practice accepting Medicare-level cash from you is giving you a good price, not a windfall. The goal is not to demand the floor everywhere; it is to recognize when a price is defensible and when it is unmoored.",
        ],
      },
      {
        heading: "What Medicare rates do not tell you",
        paragraphs: [
          "The fee schedule covers professional services: physician visits, procedures, imaging interpretation, and similar work. It does not by itself capture hospital facility payments, which run through separate Medicare payment systems, or drug prices, or your specific insurance plan's negotiated rate, deductible position, and coverage rules. A Medicare rate is a benchmark for the service, not a prediction of your exact out-of-pocket cost.",
          "Used with that understanding, it is the most powerful single number in health care shopping. Before any scheduled procedure: get the CPT codes, look up the Medicare rates here, ask providers for their price, and judge the quotes against the benchmark. Ten minutes of arithmetic puts you in a stronger position than the vast majority of patients ever occupy.",
        ],
      },
    ],
    keyTakeaways: [
      "Medicare pays by formula: relative value units, adjusted by local cost indexes, times an annual conversion factor.",
      "The rates are public and identical for every participating provider in a locality, making them the natural benchmark.",
      "Commercial insurers consistently pay more than Medicare, with wide variation by market and service.",
      "A cash price near the Medicare rate is generally fair; a charge at many multiples of it deserves scrutiny.",
      "MedCostCheck computes rates directly from the published CMS fee schedule files for your ZIP code's locality.",
      "Fee schedule rates cover professional services and benchmark value; they are not a prediction of your exact bill.",
    ],
  },
  {
    slug: "prior-authorization",
    title: "Prior Authorization: How to Keep It from Derailing Your Care and Your Wallet",
    description:
      "What needs prior authorization, what happens when it is skipped, how to verify approval before care, and how to win an appeal after a denial.",
    readingTime: "7 min read",
    updated: "July 2026",
    intro: [
      "Prior authorization is the health insurance requirement that certain services be approved by your plan before you receive them. Insurers describe it as a safeguard against unnecessary care; patients and physicians mostly experience it as a bureaucratic obstacle course. Whatever your view, one fact is not in dispute: when prior authorization is mishandled, the financial consequences land on you.",
      "A scan performed without a required approval can be denied entirely. A surgery scheduled on the assumption that someone else handled the paperwork can leave you arguing about a five-figure claim. The system's failures are common enough that you should never assume authorization exists; you should verify it the way you would verify a flight reservation.",
      "This guide covers what typically requires prior authorization, exactly what to confirm before any significant service, what happens when the process is skipped, and how to fight a denial, a fight patients win more often than they expect.",
    ],
    sections: [
      {
        heading: "What usually requires prior authorization",
        paragraphs: [
          "Requirements vary by plan, but the pattern is consistent: the more expensive or discretionary the service, the more likely it needs approval. Advanced imaging such as MRI, CT, and PET scans is a classic trigger. So are elective surgeries, planned hospital admissions, specialty medications, physical therapy beyond an initial allotment, durable medical equipment, sleep studies, and non-emergency use of out-of-network providers.",
          "Emergency care is the standard exception: plans cannot require prior authorization for emergency services. But the boundary matters; care that begins in an emergency can shade into planned follow-up care that does require approval, such as a post-discharge procedure or rehabilitation stay. Your plan's documents list the categories requiring authorization, and the customer service line can confirm any specific CPT code. When in doubt, ask; the call costs minutes, and the alternative can cost thousands.",
        ],
      },
      {
        heading: "Whose job it is, and why you should still check",
        paragraphs: [
          "For in-network care, the provider's office typically submits the authorization request, supplying clinical notes that justify the service under the insurer's criteria. Most offices have staff who do this all day. The problem is volume and handoffs: requests go in late, get pended for missing records, or are approved for different codes than what is ultimately performed, and nobody calls to tell you.",
          "The consequences of those misfires flow to the patient, so the verification burden effectively sits with you. Treat any service on the usual-suspects list as unauthorized until you have seen evidence otherwise. This is not paranoia; it is the same discipline as confirming a hotel booking, applied to a transaction that can cost as much as a car.",
        ],
      },
      {
        heading: "How to verify authorization before you show up",
        paragraphs: [
          "A few days before the service, call your insurer's member line and ask four questions. Is prior authorization required for this service? Has an authorization been approved, and what is the authorization number? Exactly which CPT codes, provider, facility, and date range does it cover? And is everyone involved, including the facility and any separate physicians such as anesthesiologists or radiologists, in network?",
          "Write down the authorization number and the reference number for the call. Then call the provider's office and confirm their records show the same approval for the same codes at the same location. Mismatches between the authorized codes and the performed codes, or between the authorized facility and the actual one, are among the most common reasons approved care still gets denied. If plans change, a different procedure, a different site, a rescheduled date outside the window, the authorization usually needs updating, so repeat the check.",
        ],
      },
      {
        heading: "What happens when authorization is skipped",
        paragraphs: [
          "If a required authorization was never obtained, the claim is typically denied, and what follows depends on whose failure it was. For in-network care, provider contracts commonly make obtaining authorization the provider's responsibility, and many contracts bar the provider from billing the patient when the claim is denied purely for the provider's failure to get one. If you receive such a bill, ask the provider, in writing, why their office did not secure the required authorization, and ask your insurer whether the network contract permits billing you in that situation.",
          "Insurers can also grant retroactive authorization in some circumstances, particularly when the service was urgent or the failure was administrative, so the provider should be pushed to request one and to appeal the denial with clinical documentation. The critical thing is not to simply pay. A denial for missing authorization is the beginning of a process, not a final judgment that you owe the money.",
        ],
      },
      {
        heading: "When the request itself is denied",
        paragraphs: [
          "Sometimes the insurer reviews the request and says no: not medically necessary, criteria not met, try something cheaper first. Step therapy requirements, which demand you fail a lower-cost treatment before a more expensive one is approved, are a common form. A denial must come with a stated reason and instructions for appealing, and you are entitled to request the specific clinical criteria the decision was based on.",
          "Read the reason carefully, because many denials are mundane failures rather than genuine disagreements: missing chart notes, a mismatched diagnosis code, or a form completed incompletely. Your physician's office is your key ally here; a peer-to-peer review, in which your doctor speaks directly with the plan's medical reviewer, resolves many denials quickly. Ask the office to request one before escalating further.",
        ],
      },
      {
        heading: "Appeals: the fight is winnable",
        paragraphs: [
          "If the denial stands, you have formal appeal rights. The first stage is an internal appeal, decided by the plan itself under deadlines set by law, with an expedited track when your health would be jeopardized by waiting; expedited decisions come back in days rather than weeks. Submit the strongest file you can: a letter of medical necessity from your physician, relevant records, and a point-by-point response to the plan's stated criteria.",
          "If the internal appeal fails, denials involving medical judgment can generally go to external review by an independent review organization whose decision binds the plan. Appeals succeed often enough, especially with physician involvement, that declining to appeal is usually leaving money and care on the table. Insurers count on attrition; most denied patients never appeal at all.",
          "Meanwhile, prior authorization itself is under regulatory pressure: federal rules now push plans in government programs toward faster electronic decisions, and many states have enacted reforms, including gold-carding laws that exempt physicians with strong approval track records. The trend is toward less friction, but for now, verify everything, document everything, and appeal anything that matters.",
        ],
      },
    ],
    keyTakeaways: [
      "Imaging, elective surgery, specialty drugs, and planned admissions commonly require prior authorization; emergencies do not.",
      "Never assume approval exists: get the authorization number and confirm the exact codes, provider, facility, and dates.",
      "If an in-network provider skipped a required authorization, their contract often bars billing you for the denial.",
      "Many denials are paperwork failures; a peer-to-peer review between your doctor and the plan resolves a lot of them.",
      "Use internal appeals, expedited timelines when urgent, and independent external review; unappealed denials are the insurer's win by default.",
    ],
  },
];

export function getAllGuides(): Guide[] {
  return guides;
}

export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}
