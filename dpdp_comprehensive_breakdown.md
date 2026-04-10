# Comprehensive Breakdown: India's Digital Personal Data Protection (DPDP) Act 2023 & DPDP Rules 2025
### For Educational Game Design — "The DPDP Sentinel Quest"

> **Compiled:** April 2026 | **Basis:** DPDP Act 2023 (No. 22 of 2023, gazetted August 11, 2023) + DPDP Rules 2025 (Draft notified January 3, 2025 by MeitY for public comment; references to final Rules reflect the draft as publicly available)

---

## PART 0: MASTER GLOSSARY OF KEY DEFINITIONS (Section 2, DPDP Act 2023)

| Term | Definition | Who / What It Is | Game Relevance |
|------|-----------|------------------|----------------|
| **Personal Data** | Any data about an identifiable individual | Name, phone, IP, device ID, location, health data, financial data, biometrics | Everything your startup collects |
| **Data Principal** | The individual to whom the personal data relates | The end user / customer | The "player character" in compliance — has rights |
| **Data Fiduciary** | Any person/entity that determines the purpose and means of processing personal data | Your startup, your company | Primary compliance burden carrier |
| **Significant Data Fiduciary (SDF)** | A Data Fiduciary notified by the Central Government based on volume/sensitivity of data or national security risk | Large platforms, social media, fintech giants | Higher obligations, heavier penalties |
| **Data Processor** | Any person who processes personal data on behalf of a Data Fiduciary | AWS, Google Cloud, Twilio, Razorpay (as vendors) | Contractual liability pass-through |
| **Consent Manager** | A Data Fiduciary registered with the Board, enabling Data Principals to manage, review, and withdraw consent via an interoperable platform | Like a "consent broker" or "privacy dashboard" platform | New regulated category |
| **Processing** | Collection, storage, use, sharing, disclosure, deletion of personal data — essentially anything done with data | Broad; covers entire data lifecycle | Almost everything your product does |
| **Purpose Limitation** | Data may only be used for the purpose for which consent was obtained | If you collected email for delivery updates, you can't use it for ads | Core constraint on product decisions |
| **Data Minimization** | Only collect data that is necessary for the stated purpose | Don't collect DOB if you only need age; don't collect full address for a newsletter | Affects feature design |
| **Storage Limitation** | Personal data must not be retained longer than necessary | Auto-delete after purpose is served; no indefinite retention | Requires retention policy & auto-purge |
| **Privacy by Design** | Build privacy safeguards into systems from the ground up, not as an afterthought | Architecture-level requirement for SDFs | Engineering culture change |
| **Data Breach** | Unauthorized processing or accidental access/disclosure/alteration/destruction of personal data | A database dump leak, accidental S3 public bucket | Triggers mandatory reporting |

---

## PART 1: DPDP ACT 2023 — SECTION-BY-SECTION BREAKDOWN

### CHAPTER I: PRELIMINARY (Sections 1–2)

---

#### Section 1 — Short Title, Extent, and Commencement
- **Core Obligation:** Establishes the Act's name, territorial scope, and effective date.
- **Applies To:** Everyone.
- **Key Point:** The Act applies to processing of digital personal data **within India**, AND to processing **outside India** if it involves offering goods/services to Data Principals **in India**. This is an extraterritorial reach (similar to GDPR's Article 3).
- **Penalty:** N/A (definitional).
- **Startup Scenario:** IndiaScale's SaaS product is hosted on AWS us-east-1, but serves Indian users — DPDP still fully applies.
- **Common Mistake:** Assuming that because servers are abroad (AWS, GCP, Azure), the company is outside DPDP's reach. Wrong — the law follows the **user**, not the server.
- **High-Risk for Startups:** YES — many cloud-native startups assume offshore hosting = no Indian compliance burden.

---

#### Section 2 — Definitions
- **Core Obligation:** Defines 22 key terms that form the legal vocabulary of the entire Act.
- **Applies To:** All covered entities.
- **Critical Definitions for Startups:**
  - `(i)` "child" = person under 18 years of age
  - `(j)` "consent" = free, specific, informed, unconditional, and unambiguous indication of the Data Principal's wishes
  - `(t)` "personal data" = any data about an identifiable individual
  - `(u)` "personal data breach" = unauthorized/accidental access, use, disclosure, alteration, or destruction
  - `(x)` "processing" = collection, recording, organization, structuring, storage, adaptation, retrieval, use, alignment, combination, indexing, sharing, disclosure by transmission, dissemination, restriction, erasure, or destruction
- **Penalty:** N/A.
- **Startup Scenario:** Your startup's analytics tool collects hashed user IDs + IP addresses. Are these "personal data"? Yes — if the hash can be reversed or correlated with other data, it is still personal data under this definition.
- **Common Mistake:** Thinking anonymized data is automatically safe. Pseudonymized data (reversible) is still personal data under DPDP.

---

### CHAPTER II: OBLIGATIONS OF DATA FIDUCIARY (Sections 3–16)

---

#### Section 3 — Application of Act
- **Core Obligation:** Defines the scope — applies to digital personal data processed within India AND to processing outside India for goods/services offered to Indian residents.
- **Applies To:** All Data Fiduciaries.
- **Exemptions Noted:** Data processed for personal/domestic purposes; data made publicly available by the Data Principal themselves.
- **Penalty:** N/A (scoping).
- **Startup Scenario:** A US-based EdTech startup offers a Hindi-language learning app to Indian school kids — fully covered by DPDP even with zero India offices.
- **Common Mistake:** Ignoring DPDP because the company is incorporated abroad. Jurisdiction follows the user's location, not the company's incorporation.

---

#### Section 4 — Grounds for Processing Personal Data
- **Core Obligation:** Personal data may only be processed for a **lawful purpose** under one of two grounds:
  1. **Consent** of the Data Principal (the primary ground)
  2. **Certain Legitimate Uses** (Section 7) — statutory obligations, state functions, medical emergencies, employment purposes, etc.
- **Applies To:** All Data Fiduciaries.
- **Penalty:** Violations of this section can cascade into Sections 5–8 penalties; Board can impose up to **₹250 Crore** for breach of consent obligations.
- **Startup Scenario:** Razorpay collects payment data — this is a legitimate use under a contract (processing necessary to fulfill a service the user signed up for). No separate consent needed for the transaction itself, but marketing re-use requires separate consent.
- **Common Mistake:** Treating a single "I Agree to Terms" checkbox as covering all future data uses. Each distinct purpose requires either specific consent or a legitimate use basis.

---

#### Section 5 — Notice
- **Core Obligation:** Before or at the time of seeking consent, the Data Fiduciary **must provide a clear and plain-language Notice** to the Data Principal containing:
  - What personal data is being collected
  - The **purpose** for which it is being collected
  - The manner in which the Data Principal can **withdraw consent** and **exercise rights**
  - How to make a **complaint** to the Data Protection Board
- **Applies To:** All Data Fiduciaries seeking consent.
- **Penalty:** Up to **₹200 Crore** (under Schedule item for breach of notice obligations — linked to Section 8 general data fiduciary duties).
- **Key Nuance:** The Notice must be in **clear and plain language** — no legalese. It must be available in English AND in any of the 22 languages listed in the Eighth Schedule of the Constitution (i.e., must be translatable on request).
- **Startup Scenario:** Swiggy's sign-up screen has a tiny hyperlink to a 40-page privacy policy. This does NOT satisfy the Notice requirement — the notice must be concise, prominent, and plain-language.
- **Common Mistake:** Burying notice obligations inside a Terms of Service or Privacy Policy. The Notice must be a **distinct, itemized communication** at the point of data collection.
- **High-Risk for Startups:** YES — almost every Indian startup's current consent flow violates this.

---

#### Section 6 — Consent
- **Core Obligation:** Consent must be:
  - **Free** (no coercion, no tying access to consent beyond what's strictly necessary)
  - **Specific** (for a defined purpose)
  - **Informed** (after proper Notice)
  - **Unconditional** (no bundled consent)
  - **Unambiguous** (explicit affirmative action — no pre-ticked boxes)
- **Consent must be as easy to withdraw as it is to give.**
- **Withdrawal of consent** must be honored by the Data Fiduciary without affecting the legality of processing done before withdrawal, but must stop further processing.
- **Applies To:** All Data Fiduciaries (for consent-based processing).
- **Penalty:** Up to **₹250 Crore** for breach of duty to obtain proper consent.
- **Key Sub-Provisions:**
  - **Section 6(3):** Consent request must not be bundled with other matters; must stand alone.
  - **Section 6(4):** Data Principal can withdraw consent at any time.
  - **Section 6(5):** Withdrawal of consent must be as easy to do as giving it.
  - **Section 6(6):** Withdrawal triggers an obligation on the Data Fiduciary to stop processing.
- **Startup Scenario:** Zomato's app pre-ticks a box saying "I consent to receive marketing emails." This is invalid — pre-ticked boxes are not unambiguous affirmative consent.
- **Common Mistake:** Using **dark patterns** in consent UI — making the "Yes" button large and green and the "No" button tiny and gray. The Act implicitly prohibits consent obtained through deceptive design.
- **High-Risk for Startups:** CRITICAL — most Indian apps violate granularity and unambiguity of consent.

---

#### Section 7 — Certain Legitimate Uses (Processing Without Consent)
- **Core Obligation:** Defines situations where personal data may be processed WITHOUT consent:
  1. **Voluntary provision** by Data Principal for a specific purpose they clearly know about
  2. **State/Government functions** — welfare schemes, subsidies, legal proceedings
  3. **Medical emergency** — life-threatening situations
  4. **Epidemic / public health** emergencies
  5. **Employment** — processing necessary for employment purposes (background checks, payroll)
  6. **Courts and legal proceedings** — ordered by a competent court/tribunal
- **Applies To:** Specific entities (government, employers, healthcare providers) for specific use cases.
- **Penalty:** If a Data Fiduciary wrongly claims a legitimate use basis, penalties under Section 33 (up to ₹250 Crore) apply.
- **Startup Scenario:** CRED processes employee financial data for payroll — this falls under the employment legitimate use. But CRED using that same data to market financial products to employees requires separate consent.
- **Common Mistake:** Over-relying on "legitimate use" to avoid building a consent management system. Legitimate uses are **narrow and specific**, not a general escape hatch.

---

#### Section 8 — General Obligations of Data Fiduciary
- **Core Obligation:** The most operationally significant section — sets out the **core compliance obligations** of every Data Fiduciary:
  1. **Accuracy:** Ensure personal data is **accurate and complete** where it is likely to be used to make decisions affecting the Data Principal, or likely to be shared with other Data Fiduciaries.
  2. **Security:** Implement **reasonable security safeguards** to prevent personal data breaches — encryption, access controls, etc.
  3. **Breach Notification:** Upon a personal data breach, notify:
     - The **Data Protection Board**
     - Each **affected Data Principal**
     - In the manner and within the time prescribed (DPDP Rules 2025 specify details)
  4. **Erasure:** When purpose is served, or when Data Principal withdraws consent, **erase personal data** (and direct Data Processors to do the same) unless retention is required by law.
  5. **Data Processor Contracts:** Must enter into **valid contracts** with Data Processors ensuring they process data only per the Fiduciary's instructions.
  6. **No Harmful Processing:** Must not process personal data in a manner that **adversely affects** the rights of the Data Principal.
- **Applies To:** All Data Fiduciaries.
- **Penalty:**
  - Failure to implement security safeguards: Up to **₹250 Crore**
  - Failure to notify Board/Data Principal of breach: Up to **₹200 Crore**
  - Failure to erase data: Up to **₹150 Crore**
- **Startup Scenario:** Ola stores driver location data indefinitely in S3 "just in case it's useful later." This violates the storage limitation principle under Section 8(7) — data must be erased once the purpose is served.
- **Common Mistake:** No documented **Data Retention Policy** and no automated **data purge pipelines**. Storing data forever because deletion is "complicated."
- **High-Risk for Startups:** CRITICAL — this is the highest-penalty section with the broadest operational impact.

---

#### Section 9 — Processing of Personal Data of Children
- **Core Obligation:** THE most stringent set of rules in the Act. Before processing a child's data, a Data Fiduciary must:
  1. Obtain **Verifiable Parental Consent (VPC)** — consent from a parent or legal guardian.
  2. **Not undertake processing that is detrimental to the well-being of a child.**
  3. **Not track or monitor children's behavior.**
  4. **Not target advertising** toward children.
  5. **Not create profiles** of children.
- **"Child" = anyone under 18 years old.**
- **Applies To:** All Data Fiduciaries whose services could be accessed by children. (Age of applicability cannot be lowered below 18 without government notification for specific categories.)
- **Penalty:** Up to **₹200 Crore** for violating children's data protections.
- **Key Nuance (Section 9(3)):** The Central Government MAY exempt certain Data Fiduciaries from the VPC requirement if their processing is **"verifiably safe"** for children (e.g., certain educational platforms). This is notified separately.
- **Startup Scenario:** BYJU's (an EdTech app) must verify that a user is 18+ OR obtain confirmed parental consent before collecting any personal data. Asking "Are you over 18? Yes/No" is NOT verifiable — it must be a robust mechanism.
- **Common Mistake:** Self-declaration age gates ("I confirm I am 18+"). These do NOT constitute Verifiable Parental Consent. The verification must be robust and defensible.
- **High-Risk for Startups:** CRITICAL for gaming, EdTech, social media, and entertainment startups.

---

#### Section 10 — Additional Obligations of Significant Data Fiduciaries
- **Core Obligation:** SDFs (notified by Government) must comply with **all Section 8 obligations PLUS**:
  1. **Data Protection Impact Assessment (DPIA):** Conduct periodic DPIAs and submit to the Board.
  2. **Periodic Audits:** Conduct periodic data audits by an independent data auditor.
  3. **Data Protection Officer (DPO):** Appoint a DPO (based in India) as a point of contact for grievances and Board communications.
  4. **Algorithmic Transparency:** If using algorithmic processing, demonstrate that it does not harm users.
  5. **Localization:** Follow any data localization requirements notified by the Government.
- **Applies To:** Only those notified as Significant Data Fiduciaries by the Central Government.
- **Penalty:** Violation of SDF obligations: Up to **₹150 Crore** (additional to general obligations).
- **Startup Scenario:** If Meesho is notified as an SDF due to scale, it must appoint an India-based DPO, conduct annual DPIAs, and get its data practices audited by a government-empanelled auditor.
- **Common Mistake:** Assuming only "big tech" will be notified as SDFs. Any rapidly growing startup with large user bases and sensitive data (fintech, healthtech) is at risk of SDF classification.

---

#### Section 11 — Right of Data Principal to Information About Grievance Redressal
- **Core Obligation:** Establishes the Data Principal's right to get information from the Data Fiduciary. (Note: the substantive rights are detailed in Sections 12–14; Section 11 sets the general framework.)
- **Applies To:** All Data Fiduciaries.
- **Penalty:** Failure to provide information / process grievances: Up to **₹10,000** per individual complaint (relatively low, but class action equivalent can scale).
- **Startup Scenario:** A user asks IndiaScale "What data do you hold about me?" — the company must respond with specifics.
- **Common Mistake:** No internal process for handling Data Principal requests — no team designated, no SLA defined, no ticketing system.

---

#### Section 12 — Right to Access Information About Personal Data
- **Core Obligation:** Every Data Principal has the right to obtain from the Data Fiduciary:
  1. A **summary of personal data** being processed and the processing activities.
  2. **Identities of all Data Fiduciaries and Processors** with whom data has been shared.
  3. Any **other information** related to their personal data as prescribed.
- **Applies To:** All Data Fiduciaries.
- **Response Timeframe:** To be specified in DPDP Rules (Rules 2025 indicate a reasonable timeframe, likely 30 days, consistent with IT Act grievance redressal norms).
- **Penalty:** Up to **₹10,000** per unfulfilled request (Board can compound penalties for systematic violations).
- **Startup Scenario:** A Paytm user asks for all data held about them — Paytm must provide: transaction history, KYC data, device identifiers, behavioral data, and names of all third-party processors (AWS, analytics vendors, etc.).
- **Common Mistake:** Only providing the data in the "main database" and ignoring data in analytics tools (Mixpanel, Segment), support systems (Freshdesk), and marketing platforms (Clevertap).

---

#### Section 13 — Right to Correction and Erasure of Personal Data
- **Core Obligation:** Data Principal has the right to:
  1. **Correct** inaccurate or misleading personal data.
  2. **Complete** incomplete personal data.
  3. **Update** personal data.
  4. **Erase** personal data where it is no longer necessary for the purpose for which it was collected, **or** where consent has been withdrawn.
- **Applies To:** All Data Fiduciaries.
- **Key Nuance:** Erasure requests must be fulfilled unless retention is required by law (e.g., RBI's 7-year financial record retention, SEBI regulations, income tax law). In such cases, PII must be **redacted** from the records while the records themselves are retained.
- **Penalty:** Up to **₹150 Crore** for systematic failure to process correction/erasure requests.
- **Startup Scenario:** A user deletes their Swiggy account. Swiggy must erase personal data (name, address, payment info) but may retain transaction records for GST compliance (5 years) — but those records should have PII redacted wherever possible.
- **Common Mistake:** Treating account deletion (flipping `is_deleted = true` in DB) as actual erasure. Real erasure means the data cannot be retrieved; a soft-delete is NOT compliant.
- **High-Risk for Startups:** YES — technically complex; requires coordinated deletion across microservices, third-party vendors, backup systems, and analytics platforms.

---

#### Section 14 — Right to Grievance Redressal
- **Core Obligation:** Every Data Principal has the right to have their **grievances addressed** by the Data Fiduciary. The Data Fiduciary MUST:
  1. Establish a **grievance redressal mechanism**.
  2. Respond to grievances within a prescribed period.
  3. Have a designated **Grievance Officer** (for SDFs: the DPO serves this role).
- **Applies To:** All Data Fiduciaries.
- **Escalation Path:** If the Data Fiduciary does not resolve the grievance, the Data Principal can approach the **Data Protection Board of India**.
- **Penalty:** Failure to establish or operate grievance mechanism: Fines per the Board's direction.
- **Startup Scenario:** A user complains that their data is being used for purposes they didn't consent to. The startup must have a named Grievance Officer, a response process, and must resolve within 30 days (per Rules).
- **Common Mistake:** Listing a generic `privacy@company.com` with no SLA, no ownership, and no resolution process. Must be an actual operational mechanism.

---

#### Section 15 — Right to Nominate
- **Core Obligation:** Every Data Principal has the right to **nominate another individual** who shall, in the event of the Data Principal's death or incapacity, exercise the rights of the Data Principal under this Act.
- **Applies To:** All Data Fiduciaries.
- **Penalty:** Failure to honor nominee: Part of grievance/right enforcement penalties.
- **Startup Scenario:** A Zerodha investor dies. Their nominated family member should be able to invoke rights (access, correction, closure) on the deceased's account data.
- **Common Mistake:** No nomination feature in the product; no process to handle death/incapacity scenarios. This is a net-new concept unique to India's DPDP.

---

#### Section 16 — Duties of Data Principal
- **Core Obligation:** Data Principals also have **duties** — they must:
  1. **Not impersonate** another person while providing personal data.
  2. **Not suppress material information** or furnish false particulars.
  3. **Not register false/frivolous grievances** or complaints.
- **Penalty for Data Principal misconduct:** A Data Principal who files frivolous complaints can be fined up to **₹10,000** by the Board.
- **Why It Matters:** Provides a defense mechanism for Data Fiduciaries against bad-faith users.
- **Startup Scenario:** A user provides a fake age to bypass an age gate and then files a grievance claiming their child's data was processed — the Data Principal duties clause provides a defense.
- **Common Mistake (for Data Fiduciaries):** Not documenting the data provided by users (timestamped, with evidence of the user's own representation) — you need this evidence to invoke Section 16 as a defense.

---

### CHAPTER III: DATA PROTECTION BOARD OF INDIA (Sections 17–27)

---

#### Section 17 — Establishment of the Data Protection Board of India
- **Core Obligation:** Establishes the **Data Protection Board of India (DPBI)** as the regulatory authority. It is a **digital-first adjudicatory body** — proceedings will be conducted online.
- **Composition:** Chairperson + such number of Members as prescribed, appointed by the Central Government.
- **Nature:** Not a court, but has powers of a civil court for certain purposes. Decisions are binding but appealable to the **Appellate Tribunal** (Telecom Disputes Settlement and Appellate Tribunal — TDSAT).
- **Penalty:** N/A (structural).
- **Startup Scenario:** The Board is the entity that will receive breach notifications, hear Data Principal complaints, investigate violations, and impose penalties.
- **Common Mistake:** Treating the Board as a distant regulator. From Day 1, startups should designate a **Board communication point-of-contact** in their compliance team.

---

#### Section 18 — Composition of the Board
- **Core Obligation:** Chairperson and Members appointed by the Central Government on recommendations of a Selection Committee (headed by Cabinet Secretary). Members serve 2-year terms.
- **Applies To:** Government (structural); startups must understand who they are regulated by.

---

#### Section 19 — Functions of the Board
- **Core Obligation:** The Board's functions include:
  1. Receiving and inquiring into **complaints** from Data Principals.
  2. Taking **suo motu** cognizance of data breaches or violations.
  3. Conducting **inquiries** into alleged violations of the Act.
  4. Imposing **penalties** (as per the Schedule).
  5. Directing Data Fiduciaries to **remediate** violations.
  6. **Referencing matters** to the Central Government for policy decisions.
- **Startup Scenario:** If a major data breach at a fintech startup is reported in the media, the Board can take suo motu notice and initiate an inquiry even without a formal complaint.
- **Common Mistake:** Only worrying about the Board when a complaint is filed. The Board can act proactively.

---

#### Section 20 — Powers of the Board in Relation to Inquiries
- **Core Obligation:** During an inquiry, the Board has powers equivalent to a civil court:
  - Summon and examine any person (witnesses, executives, engineers)
  - Require **discovery and production** of documents
  - Require **affidavits**
  - Issue **commissions** for examination of witnesses
  - Receive evidence electronically
- **Applies To:** All entities under inquiry.
- **Startup Scenario:** The Board subpoenas your CTO to testify about your data deletion practices after a breach notification.
- **Common Mistake:** Assuming the Board only sends letters. It can compel document production and testimony — treat it like a court proceeding.

---

#### Section 21 — Call for Information
- **Core Obligation:** The Board can call for **any information** from any Data Fiduciary or person as part of an inquiry.
- **Applies To:** All Data Fiduciaries.
- **Penalty:** Willful non-compliance with Board's information requests = contempt-equivalent penalties.
- **Common Mistake:** Slow-walking or deflecting Board information requests. You must respond promptly and completely.

---

#### Section 22 — Voluntary Undertaking
- **Core Obligation:** A Data Fiduciary can voluntarily offer an **undertaking** to the Board to remedy a violation. If the Board accepts, the inquiry is closed.
- **Applies To:** All Data Fiduciaries under inquiry.
- **Why It Matters:** This is the DPDP equivalent of a "consent decree" — a way to avoid a full inquiry and penalty by proactively remedying.
- **Startup Scenario:** After a minor breach, your startup proactively notifies the Board and offers a written undertaking to implement specific security improvements within 60 days. The Board may close the inquiry on that basis.
- **Common Mistake:** Not knowing this option exists — startups often assume that once an inquiry starts, penalties are inevitable.

---

#### Section 23 — Alternate Dispute Resolution
- **Core Obligation:** The Board may refer disputes between Data Principals and Data Fiduciaries to **mediation** (Lok Adalat or similar mechanisms) as prescribed.
- **Applies To:** Complaints before the Board.
- **Why It Matters:** An avenue to resolve complaints without formal penalties — relevant for customer-service-type privacy disputes.

---

#### Section 24 — Penalties
*(See the full Penalty Schedule in Part 3 of this document)*
- **Core Obligation:** Establishes the Board's power to impose penalties as listed in the **First Schedule** of the Act.
- **Key Principle:** Penalties are **per violation category**, not per affected individual. However, the Board considers:
  - Nature, gravity, and duration of the breach
  - Number of Data Principals affected
  - Repetitive nature of violations
  - Measures taken by the Data Fiduciary after the breach
  - Whether the violation was intentional or negligent
- **Penalty (maximum across all violations):** Up to **₹500 Crore** for the most severe category (failure to notify breach — but this is the theoretical maximum per the First Schedule's highest-tier).

---

#### Section 25 — Voluntary Breach Disclosure
- **Core Obligation:** A Data Fiduciary may voluntarily disclose a breach to the Board before being investigated. Early voluntary disclosure may be considered as a **mitigating factor** in penalty calculation.
- **Startup Scenario:** You discover a misconfigured database exposed 10,000 user records for 6 hours. You notify the Board proactively within 72 hours before any user complaint. This mitigation can significantly reduce the penalty.
- **Common Mistake:** Not disclosing because of fear of penalty — the penalty for non-disclosure is FAR higher than for proactive disclosure.

---

#### Section 26 — Inquiry Process
- **Core Obligation:** Establishes the due process for Board inquiries:
  1. Notice to the Data Fiduciary
  2. Opportunity to be heard
  3. Board issues a decision
  4. Decision is appealable to TDSAT
- **Applies To:** All entities subject to inquiry.

---

#### Section 27 — Appeals
- **Core Obligation:** Any decision of the Board can be appealed to the **Telecom Disputes Settlement and Appellate Tribunal (TDSAT)** within 60 days of the decision. TDSAT decisions can be further appealed to the **High Court** and then the **Supreme Court**.
- **Applies To:** Any aggrieved party (Data Fiduciary or Data Principal).
- **Startup Scenario:** Your startup is hit with a ₹50 Crore penalty. You have 60 days to file an appeal with TDSAT, where you can challenge both the finding and the quantum of penalty.
- **Common Mistake:** Missing the 60-day window for appeal due to lack of legal monitoring.

---

### CHAPTER IV: EXEMPTIONS (Sections 17 is referenced; Sections 36–38 cover exemptions properly)

*(Note: The Act consolidates exemptions in Sections 36–38)*

---

#### Section 36 — Exemption for State Instrumentalities and National Security
- **Core Obligation:** The Central Government may, by notification, **exempt any instrumentality of the State** (government agencies, law enforcement) from all or any provisions of this Act, **in the interest of:**
  - Sovereignty and integrity of India
  - Security of the State
  - Friendly relations with foreign states
  - Public order
  - Prevention of incitement to offences
- **Applies To:** Government agencies and their partners.
- **Penalty:** N/A (exemption provision).
- **Startup Scenario:** If your startup is contracted by the government for a national security project, data processed for that project may be exempt. But your commercial operations remain covered.
- **Common Mistake:** Thinking that any government contract exempts you from DPDP. Only the **specific data** processed for the **specific government purpose** may be exempt.

---

#### Section 37 — Exemption for Research, Archiving, and Statistical Purposes
- **Core Obligation:** Personal data may be processed for **research, archiving, and statistical purposes** without consent **if**:
  - Processed in accordance with standards specified by the Government
  - Not used to take **decisions specific to individual Data Principals**
  - The personal data is not shared publicly in identifiable form
- **Applies To:** Researchers, academic institutions, government statistical bodies.
- **Startup Scenario:** A healthtech startup conducting anonymized population health research may invoke this exemption, provided the data is truly de-identified and not used for individual user decisions.
- **Common Mistake:** Using "research" as a blanket excuse to process data without consent. The research must be genuine, the data must be anonymized, and no individual-specific decisions can be made from it.

---

#### Section 38 — Other Exemptions
- **Core Obligation:** Additional exemptions for:
  - Data processed for **personal or domestic purposes** by the Data Principal themselves
  - Data made **publicly available** by the Data Principal themselves (e.g., a public social media post) — but this exemption is narrow; you cannot process publicly available data for any purpose
  - **Small businesses** — the Central Government may exempt certain categories of Data Fiduciaries based on volume of data processed (to be notified)
- **Startup Scenario:** A tiny 2-person startup processing data of fewer than 500 users may eventually be exempt if the Government notifies a small business threshold.
- **Common Mistake:** Assuming you qualify for a small business exemption before it is formally notified. Until notified, all Data Fiduciaries are covered.

---

### CHAPTER V: MISCELLANEOUS (Sections 39–44)

---

#### Section 39 — Sharing of Information with Foreign Governments
- **Core Obligation:** Personal data may be shared with foreign governments only under **bilateral agreements** or **treaties** with India — the Central Government may prescribe conditions.
- **Applies To:** Any entity sharing Indian personal data internationally.

---

#### Section 40 — Power to Make Rules
- **Core Obligation:** Empowers the Central Government to make Rules for implementing the Act. This is the source of authority for the **DPDP Rules 2025**.
- **Key Topics Delegated to Rules:**
  - Form and manner of Notice
  - Consent Manager registration and operation
  - Verifiable Parental Consent mechanism
  - Data breach notification timelines
  - Data Protection Board procedures
  - Significant Data Fiduciary criteria and obligations
  - Cross-border data transfer restrictions

---

#### Section 41 — Power to Issue Directions
- **Core Obligation:** The Central Government can issue **directions** to the Data Protection Board and to Data Fiduciaries on any matter consistent with the Act.
- **Applies To:** All entities.

---

#### Section 42 — Act to Have Effect in Addition to and Not in Derogation of Other Laws
- **Core Obligation:** DPDP **does not replace** other laws like the IT Act, RBI regulations, SEBI regulations, IRDAI rules, etc. It **supplements** them. Where there is a conflict, the Act specifically addressing the subject matter prevails.
- **Startup Scenario:** RBI's requirement to retain financial records for 7 years overrides DPDP's erasure mandate for those specific records. But DPDP's notice and consent rules still apply to how that financial data is collected.
- **Common Mistake:** Thinking DPDP compliance means you can ignore sector-specific regulations. You need to comply with BOTH.

---

#### Section 43 — Protection of Action Taken in Good Faith
- **Core Obligation:** Provides limited immunity for Board members and government officials acting in good faith under this Act.

---

#### Section 44 — Repeal and Amendments
- **Core Obligation:** Amends the **Information Technology Act, 2000** — specifically:
  - **Section 43A** of the IT Act (compensation for failure to protect data) is **repealed** — replaced by the DPDP Act's penalty regime.
  - **Section 72A** of the IT Act (punishment for disclosure of information in breach of lawful contract) is also amended.
- **Why It Matters:** Companies that were using Section 43A of the IT Act as their data protection compliance reference must now switch to the DPDP Act framework.

---

## PART 2: DPDP RULES 2025 — COMPREHENSIVE BREAKDOWN

> The DPDP Rules 2025 were notified in draft form on January 3, 2025 by MeitY. These Rules operationalize the Act's requirements with specific mechanisms, timelines, and technical standards.

---

### Rule 1 — Short Title and Commencement
- **Core Obligation:** Titles the Rules as "Digital Personal Data Protection Rules, 2025" and specifies they come into force on a date to be notified.
- **Startup Note:** Monitor MeitY notifications — compliance deadlines start from the Rules' commencement date.

---

### Rule 2 — Definitions
- **Core Obligation:** Defines terms specific to the Rules that supplement the Act's definitions:
  - **"Consent artefact"** = A digitally signed record capturing the details of consent given by a Data Principal
  - **"Consent Manager"** = A registered platform that facilitates management of consents
  - **"Notice"** = The communication under Section 5 of the Act
- **Startup Relevance:** The "consent artefact" concept means consent must be **technically recorded, timestamped, and tamper-proof** — not just a checkbox in a database.

---

### Rule 3 — Notice to Data Principal (Operationalizing Section 5)
- **Core Obligation:** Specifies the **form and content** of the Notice that Data Fiduciaries must provide:
  - Must be in **plain language** — no legal jargon
  - Must clearly state: (a) personal data collected, (b) purpose of processing, (c) how to exercise rights, (d) how to file complaints with the Board, (e) contact details of the Data Fiduciary/DPO
  - Must be available in **English and any scheduled language** requested by the Data Principal
  - If previously collected data (before the Act's commencement) was processed without proper notice, the Data Fiduciary must issue a **retrospective notice** to those Data Principals
- **Applies To:** All Data Fiduciaries.
- **Penalty:** Up to **₹200 Crore** (linked to Section 8 general obligations).
- **Startup Scenario:** IndiaScale has 2 million users acquired before the Rules' commencement. It must send a retroactive privacy notice to all of them explaining what data it holds and why.
- **Common Mistake:** Not having a multi-language notice capability. Many startups only have English privacy policies.
- **High-Risk:** YES — retroactive notice obligation is operationally massive.

---

### Rule 4 — Consent Manager (Operationalizing Section 6)
- **Core Obligation:** Establishes the framework for **Consent Managers**:
  - A Consent Manager must register with the **Data Protection Board**
  - Minimum **net worth of ₹12 Crore**
  - Must maintain **interoperability** — any user should be able to manage consents across multiple Data Fiduciaries through one Consent Manager
  - Must provide an **accessible, user-friendly dashboard** for Data Principals to view, manage, and withdraw consents
  - Must maintain **consent artefacts** (digitally signed records of each consent)
  - Data Fiduciaries can work WITH a Consent Manager or build their own consent recording mechanism
- **Applies To:** Entities wishing to operate as Consent Managers; ALL Data Fiduciaries for their consent recording obligations.
- **Startup Scenario:** DigiLocker-like platform could register as a Consent Manager. Alternatively, a startup like OneTrust could enter India as a Consent Manager. IndiaScale integrates with this Consent Manager so users can see all their consents on one dashboard.
- **Common Mistake:** Not maintaining tamper-proof, time-stamped consent records. If challenged, you must be able to prove the exact consent obtained, when, and for what purpose.

---

### Rule 5 — Processing of Personal Data of Children and Persons with Disabilities (Operationalizing Section 9)
- **Core Obligation:** The most detailed and technically demanding Rule. Specifies:

  **Age Verification Mechanism:**
  - The Data Fiduciary must implement a mechanism to **reliably establish** that a user is not a child (under 18)
  - Acceptable methods (as per the draft Rules):
    - Verification through a **Digital Locker** (DigiLocker) — where parents/guardians store age documents
    - Verification via **trusted third-party verification services** (Aadhaar-based, but Aadhaar number itself cannot be stored)
    - Use of **parental consent tokens** issued by a government-recognized system
  - Self-declaration ("Are you 18+? Click Yes") is **explicitly insufficient**

  **Verifiable Parental Consent (VPC):**
  - Parent/guardian must provide consent **through a verifiable mechanism** — not just a checkbox
  - The parent/guardian's identity must itself be verifiable (e.g., via DigiLocker, mobile OTP linked to a verified adult account)
  - Consent must be specific to the platform and the data processing activities

  **Exempt Categories (Section 9(3) application):**
  - Government may notify certain EdTech or health platforms as exempt from VPC if they are deemed "verifiably safe" for children (criteria TBD)

  **Prohibition on Harmful Processing:**
  - Even WITH parental consent, Data Fiduciaries CANNOT:
    - Track children's behavior
    - Target behavioral advertising at children
    - Build detailed profiles of children
    - Use addictive design patterns (infinite scroll, intermittent rewards) that exploit children
- **Applies To:** All Data Fiduciaries who may have child users.
- **Penalty:** Up to **₹200 Crore**.
- **Startup Scenario:** A gaming startup's new battle royale game is viral among school kids. The startup must:
  1. Implement age verification (not just self-declaration)
  2. For users under 18: obtain VPC from a verified parent
  3. Disable behavioral ad targeting for verified child accounts
  4. Remove dark patterns (loot boxes, FOMO mechanics) for children
- **Common Mistake:** Building an age gate that says "You must be 18 to use this app. Are you 18? YES / NO" — this is not verifiable. You need actual ID verification tied to a government-recognized system.
- **High-Risk:** CRITICAL — the most technically complex compliance requirement and the one most startups (gaming, EdTech, social) are furthest from meeting.

---

### Rule 6 — Obligations of Data Fiduciary (Additional Operational Requirements)
- **Core Obligation:** Operationalizes Section 8 with specific requirements:

  **Security Standards:**
  - Data Fiduciaries must implement security practices consistent with **IS/ISO/IEC 27001** (or equivalent)
  - Encryption of personal data at rest and in transit
  - Access controls on a **need-to-know basis**
  - Regular **penetration testing and vulnerability assessments**
  - Specific additional measures for **sensitive categories** of personal data (health, financial, biometric)

  **Data Breach Response:**
  - The Data Fiduciary must notify the **Data Protection Board within 72 hours** of becoming aware of a breach (specific timelines per Rule 7)
  - Notification must include: nature of breach, categories and volume of data affected, likely consequences, measures taken
  - Data Principals must be notified in a **manner that allows them to protect themselves** (e.g., SMS/email with specific steps to take)

  **Data Processor Agreements:**
  - Must be in writing (including electronically)
  - Must specify: purposes of processing, categories of data, security obligations, breach notification obligations, deletion obligations upon contract termination
  - Data Fiduciary remains **fully liable** for a Data Processor's violations if the Fiduciary did not conduct adequate due diligence

  **Erasure Automation:**
  - Must have **technical mechanisms** for data erasure upon: consent withdrawal, purpose completion, account deletion request
  - "Erasure" means permanent deletion — not just deactivation or soft-delete
- **Applies To:** All Data Fiduciaries.
- **Penalty:** Up to **₹250 Crore** for security failures; **₹200 Crore** for breach notification failures.
- **Startup Scenario:** IndiaScale must update ALL vendor contracts (AWS, Twilio, Razorpay, Segment, Intercom) to include DPDP-compliant data processing clauses before the Rules' effective date.
- **Common Mistake:** Not having written DPA (Data Processing Agreements) with SaaS vendors. Many startups use off-the-shelf SaaS tools without any contractual privacy protections.

---

### Rule 7 — Personal Data Breach Notification (Operationalizing Section 8(6))
- **Core Obligation:** The **critical breach notification rule** — the "48-hour race" in your game design.

  **Timeline:**
  - **Immediate notification** to the **Data Protection Board** upon becoming aware of a personal data breach — the Rules specify **72 hours** for initial notification to the Board (consistent with global standards like GDPR)
  - Notification to **affected Data Principals** must happen simultaneously or as soon as practically possible — designed to be **prompt** (the 48-hour reference in your game document appears to relate to the Data Principal notification, not the Board notification)

  **Content of Board Notification:**
  - Nature and categories of personal data breached
  - Approximate number of Data Principals affected
  - Likely consequences of the breach
  - Steps taken or proposed to address the breach
  - Contact details of the Data Fiduciary/DPO

  **Content of Data Principal Notification:**
  - Plain-language description of what happened
  - What data was affected
  - Steps the Data Principal should take to protect themselves
  - Contact details for further queries
  - Complaint mechanism information

  **When Notification is NOT required:**
  - If the breached data was encrypted with **state-of-the-art encryption** and the keys were not compromised (the breach of encrypted data alone does not require notification)
- **Applies To:** All Data Fiduciaries.
- **Penalty:** Failure to notify: Up to **₹200 Crore**.
- **Startup Scenario:** At 11 PM on a Friday, IndiaScale's engineer discovers that an S3 bucket was publicly accessible for 6 hours, exposing 50,000 user records. The clock starts NOW — the board must be notified within 72 hours, and affected users must be notified simultaneously.
- **Common Mistake:** Spending too long internally investigating to confirm the breach before notifying. You must notify upon **becoming aware** — not upon completing a full investigation. You can supplement with more information later.
- **High-Risk:** CRITICAL — this is the rule your game's Level 2 is built around.

---

### Rule 8 — Data Retention and Erasure (Operationalizing Sections 8(7) and 13)
- **Core Obligation:** Specifies the **data retention and erasure obligations**:

  **Retention:**
  - Personal data must be **erased as soon as** the purpose for which it was collected is served
  - OR when the Data Principal withdraws consent
  - OR when the Data Principal exercises the right to erasure (Section 13)
  - **Exception:** Retention required by any law in force (e.g., IT Act, RBI, Income Tax, Company Law)

  **Erasure Standards:**
  - Must be a **permanent, irrecoverable deletion** — not a soft-delete
  - Must extend to ALL systems including: primary databases, backups, archives, analytics platforms, third-party processors, email/CRM systems, logs
  - Data Fiduciary must **issue a direction to all Data Processors** to erase the data simultaneously

  **Deemed Erasure (if no interaction):**
  - If a Data Principal has NOT interacted with the Data Fiduciary for a period prescribed by the Government (likely 3 years — to be notified), the Data Fiduciary must:
    1. Send a **notice** to the Data Principal asking them to confirm continued use
    2. If no response, **erase the data**
  - This is colloquially called the "Zombie Account" rule — inactive accounts must be cleaned up

  **The 48-Hour Reference (in your game):**
  - Rule 8 in the context of your game likely refers to the **48-hour notice window** before erasure — giving the Data Principal an opportunity to confirm they want erasure vs. giving them time to intervene before deletion is permanent. This is an operationally important step before irreversible deletion.
- **Applies To:** All Data Fiduciaries.
- **Penalty:** Up to **₹150 Crore** for failure to erase.
- **Startup Scenario:** A user deletes their Ola account. Ola must: erase profile data, mask PII in trip logs (keep logs for GST), erase from analytics tools, notify Twilio to delete the user's SMS history, notify AWS to purge from all regions including backup snapshots.
- **Common Mistake:** Backup systems — everyone deletes from the primary DB but forgets that nightly backups contain the data too. If the backup is restored, the "deleted" data reappears.
- **High-Risk:** YES — technically the most complex compliance implementation.

---

### Rule 9 — Rights of Data Principal (Operationalizing Sections 11–15)
- **Core Obligation:** Prescribes the **mechanism** for Data Principals to exercise rights:
  - Request must be made in a **specified manner** (online, through a form/interface provided by the Data Fiduciary)
  - Data Fiduciary must provide a **response within a prescribed period** (likely 30 days for standard requests, 72 hours for breach-related requests)
  - **Free of charge** — Data Fiduciaries cannot charge fees for fulfilling rights requests (beyond what is reasonable)
  - **Identity verification** — Data Fiduciary can verify the requester's identity before fulfilling requests (to prevent unauthorized access)
- **Applies To:** All Data Fiduciaries.
- **Startup Scenario:** IndiaScale must build a "Privacy Dashboard" in its app where users can: view their data, download it, request correction, request deletion, withdraw consent, and file grievances — all within a single interface.
- **Common Mistake:** No self-service privacy dashboard — forcing users to email a generic mailbox. The mechanism must be digital and efficient.

---

### Rule 10 — Significant Data Fiduciary Obligations (Operationalizing Section 10)
- **Core Obligation:** Prescribes the **criteria and additional obligations** for SDFs:

  **Criteria for SDF Classification (to be assessed by Government):**
  - Volume and sensitivity of personal data processed
  - Risk to rights of Data Principals
  - National security implications
  - Impact on sovereignty and integrity of India
  - Risk to electoral democracy
  - Security of the State
  - Public order

  **Additional SDF Obligations:**
  - **Data Protection Officer (DPO):** Must be a senior official based in India; responsible for compliance; point of contact for the Board; must be accessible to Data Principals
  - **Independent Data Auditor:** Periodic audits by a Board-empanelled auditor; audit covers: consent mechanisms, breach history, security measures, DPIA findings
  - **Data Protection Impact Assessment (DPIA):** Must be conducted before:
    - Launching new products/features involving sensitive data
    - Significant changes to data processing operations
    - Deploying new AI/ML models on personal data
    Results must be shared with the Board on request
  - **Algorithmic Accountability:** Must demonstrate that algorithms processing personal data do not cause systematic harm to Data Principals; must maintain explainability of automated decisions
  - **Localization (if notified):** Government can mandate that certain categories of data must be stored in India
- **Applies To:** SDFs only (to be notified by Government).
- **Penalty:** Up to **₹150 Crore** for SDF-specific violations.
- **Startup Scenario:** If Meesho (100M+ users) is classified as SDF, it must appoint an India-based DPO (likely a senior legal/compliance officer), conduct annual DPIAs before launching new recommendation algorithms, and get audited by an approved auditor.
- **Common Mistake:** Startups that expect to be classified as SDF (due to growth trajectory) not building SDF-ready compliance infrastructure early. SDF obligations kick in IMMEDIATELY upon notification — no grace period.

---

### Rule 11 — Consent Manager Registration and Operations
- **Core Obligation:** Prescribes the registration process for Consent Managers:
  - **Application to the Board** with proof of net worth (₹12 Crore minimum), technical infrastructure, governance structure
  - **Technical Standards:** Must use government-specified APIs and interoperability standards
  - **Audit Requirements:** Annual audit of Consent Manager's operations
  - **Obligations to Data Principals:** Must provide 24x7 access to consent management interface; must process withdrawal requests instantly; must maintain 5-year record of consent artefacts
  - **Obligations to Data Fiduciaries:** Must provide real-time consent status APIs; must handle consent conflicts; must support consent delegation (for nominees)
- **Applies To:** Entities operating as Consent Managers.
- **Startup Opportunity:** This creates a new market category — "Consent Manager as a Service" platforms (similar to how DigiLocker serves as a document management utility).

---

### Rule 12 — Cross-Border Data Transfers (Operationalizing Section 16 equivalent)
- **Core Obligation:** Specifies the regime for transferring personal data **outside India**:
  - By default, transfer of personal data outside India is **ALLOWED** (India took a permissive approach, unlike GDPR's restrictive default)
  - **EXCEPT** where the Central Government **specifically restricts** transfer to certain countries (a "blacklist" approach)
  - The Government may also require that **certain categories** of personal data (sensitive, critical personal data) be stored **only in India**
  - Transfers to restricted countries are prohibited even if the Data Principal has consented

  **Mechanism:**
  - Data Fiduciary must assess whether the destination country is on the Government's restricted list
  - Must ensure data transferred abroad receives **equivalent protection** to India (adequacy standard)
  - Must include cross-border transfer terms in Data Processor Agreements
- **Applies To:** All Data Fiduciaries transferring data internationally.
- **Penalty:** Violation of cross-border restrictions: Up to **₹250 Crore**.
- **Startup Scenario:** IndiaScale uses a US-based data analytics tool (Amplitude). If the US is not on the restricted list, this is permissible. But if the Government later restricts certain categories of health data from being processed abroad, IndiaScale must migrate health data to India-based infrastructure.
- **Common Mistake:** Not maintaining a **data flow map** showing where data goes, including to which countries. Without this map, you cannot assess cross-border compliance.
- **High-Risk:** YES — especially for startups using US/EU-based SaaS tools for sensitive data.

---

### Rule 13 — Data Protection Board Procedures (Operationalizing Chapter III)
- **Core Obligation:** Prescribes the Board's procedural rules:
  - **Complaint filing:** Online portal; complainant must first attempt grievance redressal with the Data Fiduciary and wait 30 days before filing with the Board
  - **Acknowledgment:** Board must acknowledge within 48 hours
  - **Inquiry notice:** Board issues notice to Data Fiduciary with 30 days to respond
  - **Hearing:** Conducted digitally; both parties present
  - **Decision:** Within a prescribed period after hearing
  - **Penalty payment:** Within 30 days of Board's order
- **Startup Scenario:** A user files a complaint with the Board that IndiaScale didn't respond to their erasure request. The Board sends IndiaScale a notice — IndiaScale has 30 days to respond with evidence of its grievance mechanism.
- **Common Mistake:** Not maintaining logs of all grievance interactions — when the Board sends a notice, you need evidence of your responses to the user.

---

### Rule 14 — Exemptions for Startups and Small Entities (If Notified)
- **Core Obligation:** The Government has authority to exempt certain categories of Data Fiduciaries from specific obligations based on:
  - Volume of personal data processed (small businesses)
  - Nature of personal data (not sensitive)
  - Nature of the entity (non-commercial, research, etc.)
- **Status:** As of early 2026, specific startup exemptions have NOT been notified. All Data Fiduciaries are subject to full compliance until exemptions are announced.
- **Startup Note:** Watch MeitY notifications closely — startup exemptions could be a significant relief.

---

## PART 3: PENALTY SCHEDULE (First Schedule, DPDP Act 2023)

| # | Violation | Maximum Penalty |
|---|-----------|----------------|
| 1 | Failure to take reasonable security safeguards to prevent personal data breach (Section 8(5)) | **₹250 Crore** |
| 2 | Failure to notify the Board and affected Data Principals in the event of a personal data breach (Section 8(6)) | **₹200 Crore** |
| 3 | Failure to erase personal data when required (Section 8(7) / Section 13) | **₹150 Crore** |
| 4 | Processing personal data of children in violation of Section 9 (no VPC, harmful processing, behavioral tracking) | **₹200 Crore** |
| 5 | Failure of a Significant Data Fiduciary to comply with additional obligations (Section 10) | **₹150 Crore** |
| 6 | Non-compliance with any provision of the Act or Rules for which no specific penalty is prescribed | **₹50 Crore** |
| 7 | Failure to comply with a Board direction or order | **₹50 Crore per contravention** |
| 8 | Furnishing false/misleading information to the Board | **₹10,000** per instance (individual Data Principal bad-faith) |
| **MAXIMUM CUMULATIVE** | **Single entity, multiple violations** | **Up to ₹500 Crore** (theoretical aggregate cap per the Act's Schedule) |

> **Important Note:** Penalties are PER CATEGORY OF VIOLATION, not per affected individual. The Board determines quantum based on the factors in Section 24 (gravity, duration, number affected, repetition, mitigation measures).

---

## PART 4: CHILDREN'S DATA — DEEP DIVE

### The Three-Layer Protection Framework

**Layer 1: Age Verification**
- Must establish the user is NOT a child (under 18) BEFORE collecting any personal data
- Acceptable: DigiLocker-based verification, government ID verification services, Aadhaar-linked verification (without storing Aadhaar number)
- NOT Acceptable: Self-declaration ("I am over 18"), birth year selection, honor system

**Layer 2: Verifiable Parental Consent (VPC)**
- If user IS or MIGHT BE a child, must obtain consent from parent/guardian
- Parent/guardian must be verifiably an adult (itself requires identity verification)
- Consent must be specific to the platform and the processing activities
- Parent must be able to withdraw consent at any time and have child's data erased

**Layer 3: Content/Feature Restrictions**
- Even with VPC, PROHIBITED for child users:
  - Behavioral advertising targeting
  - Behavioral tracking/profiling
  - Addictive design patterns (infinite scroll, variable reward loops, FOMO mechanics, loot boxes)
  - Location tracking beyond what is strictly necessary
  - Sharing data with third-party advertisers

### Implementation Architecture for Startups
```
User visits app
     ↓
Age Gate Screen (frictionless design)
     ↓
[If user claims 18+] → Verification via DigiLocker/Aadhaar token → Proceed
     ↓
[If user claims under 18 or verification fails]
     ↓
VPC Flow: Send parent/guardian verification request
     ↓
Parent verifies identity (DigiLocker / OTP on verified adult number)
     ↓
Parent reviews and approves child's usage
     ↓
Child account created with restrictions: no behavioral ads, no profiling, no dark patterns
     ↓
Parent can revoke anytime → triggers immediate child data erasure
```

### The Tension: UX vs. Compliance
- **Drop-off Risk:** Every friction point in the VPC flow loses users. Aadhaar-based verification has ~30% drop-off in typical Indian flows.
- **Solution:** Silent age estimation (device signals, behavioral signals) to identify likely adults pre-emptively, reserving VPC flow only for flagged cases — BUT this must be done WITHOUT processing children's data, which creates a paradox. The Rule implicitly requires verification BEFORE processing, not after.
- **Best Practice:** Minimum data collection at signup, defer detailed profiling until age is confirmed.

---

## PART 5: RIGHTS OF DATA PRINCIPAL — OPERATIONAL GUIDE

| Right | Section | What the User Can Do | Startup's Obligation | Response Window | Penalty for Failure |
|-------|---------|---------------------|---------------------|-----------------|---------------------|
| **Right to Information** | Sec 12 | Ask: "What data do you hold about me?" | Provide a summary of all data held + all processors who have the data | As prescribed (est. 30 days) | ₹10,000 per violation |
| **Right to Correction** | Sec 13 | Ask: "Fix my incorrect data" | Correct, complete, or update the data within prescribed time | As prescribed (est. 30 days) | ₹150 Crore (systematic) |
| **Right to Erasure** | Sec 13 | Ask: "Delete all my data" | Permanently erase from all systems; direct all processors to erase | As prescribed (est. 30 days) | ₹150 Crore (systematic) |
| **Right to Grievance** | Sec 14 | File a complaint about any violation | Designated Grievance Officer must respond; internal resolution within 30 days | 30 days | Board-determined fine |
| **Right to Nominate** | Sec 15 | Nominate someone to exercise rights after death/incapacity | Build nomination mechanism; honor nominee's requests | N/A (setup-time obligation) | Grievance enforcement |
| **Right to Withdraw Consent** | Sec 6(4) | Say: "Stop processing my data" | Cease processing immediately; cannot penalize user for withdrawal | Immediately upon withdrawal | ₹250 Crore (consent violations) |

---

## PART 6: SIGNIFICANT DATA FIDUCIARY (SDF) — ADDITIONAL OBLIGATIONS CHECKLIST

### Who Will Be Classified as SDF?
Criteria (Rule 10) — the Government will consider:
- Processing data of **millions of users** (volume threshold TBD)
- Processing **sensitive data** (financial, health, biometric, location at scale)
- **Strategic importance** to India's digital economy
- **National security** implications of the data

**Likely SDF Candidates (when notified):** Meta, Google, Amazon, Flipkart, Paytm, Ola, PhonePe, BYJU's, Zomato, Swiggy, Dream11, Meesho, Jio Platforms.

**Startups at risk of SDF classification as they scale:** Any Series B+ startup with 5M+ users processing financial or health data.

### SDF Compliance Checklist
- [ ] **Data Protection Officer (India-based):** Senior officer; contact details published; accessible to all Data Principals
- [ ] **DPIA:** Conducted before every major product launch; findings documented; shared with Board on request
- [ ] **Independent Audit:** Annual audit by Board-empanelled auditor covering all data practices
- [ ] **Algorithmic Accountability:** Maintain records of all algorithmic decisions; demonstrate no systematic harm; explainability reports
- [ ] **Data Localization:** Comply with any Government notification requiring India storage of specific data categories
- [ ] **Privacy by Design:** Formal PbD framework documented; engineering processes evidence this
- [ ] **Enhanced Security:** ISO 27001 or equivalent; annual pen tests; red team exercises

---

## PART 7: CROSS-BORDER DATA TRANSFERS — DECISION TREE

```
Q1: Are you transferring personal data of Indian residents outside India?
     |
     YES → Q2: Is the destination country on the Government's RESTRICTED list?
               |
               YES → PROHIBITED. Keep data in India. No exceptions.
               |
               NO → Q3: Is this a category of "critical personal data" 
                        mandated to be stored in India?
                        |
                        YES → Must store in India; processing abroad may be 
                              permitted but storage must have Indian copy
                        |
                        NO → Transfer is PERMITTED. Ensure adequate 
                             contractual protections in Data Processor 
                             Agreement. Maintain data flow records.
     |
     NO → No cross-border obligations (but all other DPDP rules apply)
```

### Key Principles
- India's approach is **permissive-by-default** (unlike GDPR's restrictive default)
- Government maintains power to restrict specific countries (national security, reciprocity)
- No "adequacy decision" framework (like GDPR) — India uses a blacklist approach
- Sensitive data categories may have localization requirements separately notified

### Common Startup Data Flows That Need Review
| SaaS Tool | Data Type | Risk Level |
|-----------|-----------|-----------|
| AWS (US-East) | All user data | Monitor restricted list |
| Google Analytics | Behavioral data | Monitor restricted list |
| Stripe / Razorpay (global) | Financial data | HIGH — likely sensitive category |
| Twilio (US) | Communication data | Monitor |
| Intercom / Zendesk | Support conversations | Contains PII |
| Mixpanel / Amplitude | Behavioral analytics | Pseudonymized but still personal data |
| HubSpot / Salesforce | CRM / marketing data | Contains PII |
| OpenAI API | Any user-generated content sent | HIGH risk — check contracts |

---

## PART 8: EXEMPTIONS — SUMMARY TABLE

| Exemption | Scope | Conditions | Who Can Claim |
|-----------|-------|-----------|---------------|
| **National Security** (Sec 36) | Full or partial exemption from Act | Government notification required; narrow application | State instrumentalities, intelligence agencies |
| **Research & Statistics** (Sec 37) | Exemption from consent for research purposes | Anonymized data; no individual-specific decisions; Government-approved standards | Researchers, academic institutions |
| **Personal/Domestic Use** (Sec 38) | Full exemption | Processing by an individual for purely personal purposes | Individuals (not businesses) |
| **Publicly Available Data** (Sec 38) | Exemption if Data Principal made data public | Only for data the user themselves made public; cannot be used for any purpose | Limited; Data Fiduciary still cannot misuse |
| **Small Business** (Sec 38 / Sec 40) | Exemption from specific obligations | Government notification required; volume threshold TBD | Small/micro businesses (criteria TBD) |
| **Startup Safe Harbor** | Not yet notified | TBD | Watch MeitY notifications |

---

## PART 9: COMPLIANCE RISK MATRIX FOR INDIAN STARTUPS

### Risk Tier 1 — CRITICAL (Immediate Action Required)

| Rule/Section | Risk | Why Startups Fail | Fix |
|-------------|------|-------------------|-----|
| **Section 5 + Rule 3 — Notice** | ₹200 Crore | Privacy policies are legal documents, not plain-language notices; no retroactive notice sent | Redesign consent flows; send retroactive notice to existing users |
| **Section 6 — Consent** | ₹250 Crore | Pre-ticked boxes, bundled consent, no granular purpose-specific consent, no easy withdrawal | Build granular consent management system with withdrawal dashboard |
| **Section 8(5) — Security** | ₹250 Crore | No ISO 27001; no pen testing; plaintext PII in logs; misconfigured S3 buckets | Security audit; encryption everywhere; access controls |
| **Section 9 + Rule 5 — Children's Data** | ₹200 Crore | Self-declaration age gates; no VPC mechanism; behavioral ads reaching minors | Implement ID-verified age gate; build VPC flow; restrict child account features |
| **Section 8(6) + Rule 7 — Breach Notification** | ₹200 Crore | No breach detection system; no Board notification process; no user communication templates | Build breach detection; prepare notification templates; run breach simulation |

### Risk Tier 2 — HIGH (Action Within 6 Months)

| Rule/Section | Risk | Why Startups Fail | Fix |
|-------------|------|-------------------|-----|
| **Section 13 + Rule 8 — Erasure** | ₹150 Crore | Soft-delete only; backups not purged; third-party vendors not notified; regulatory conflicts not mapped | Build hard-delete pipeline; vendor notification system; PII redaction for legally-retained records |
| **Section 12 — Right to Access** | ₹10,000/violation (scales) | No privacy dashboard; data spread across 20+ microservices | Build data access portal; federate data retrieval |
| **Section 10 + Rule 10 — SDF Obligations** | ₹150 Crore | No DPO; no DPIA process; growing into SDF without realizing it | If scaling fast: appoint DPO; start DPIA practice |
| **Rule 6 — Processor Agreements** | ₹250 Crore (liable for processor) | No DPAs with SaaS vendors | Audit all vendor contracts; add DPA clauses |

### Risk Tier 3 — MEDIUM (Action Within 12 Months)

| Rule/Section | Risk | Why Startups Fail | Fix |
|-------------|------|-------------------|-----|
| **Section 14 — Grievance Mechanism** | Board fine | Generic `privacy@` email; no SLA; no Grievance Officer named | Appoint Grievance Officer; build ticketing system; set 30-day SLA |
| **Section 15 — Nomination** | Grievance enforcement | Feature doesn't exist in any Indian startup's product | Add nomination feature to account settings |
| **Rule 12 — Cross-Border Transfers** | ₹250 Crore | No data flow map; no vendor country audit | Create data flow map; audit vendor locations |
| **Section 16 — Data Principal Duties** | N/A (defense) | No documentation of user-provided data representations | Log and timestamp all user self-declarations |

---

## PART 10: GAME DESIGN SCENARIOS — ACT/RULE MAPPING

Each game scenario should reference the specific Section/Rule for the "Real-World Pop-up" cards:

| Game Event | Act/Rule Reference | Penalty Pop-up Text |
|-----------|-------------------|---------------------|
| Player collects email without notice | Section 5 + Rule 3 | "No prior notice given. Section 5 violation. Fine: up to ₹200 Crore." |
| Pre-ticked consent checkbox | Section 6(2) | "Consent must be unambiguous. Pre-ticked boxes don't count. Section 6 violation. Fine: up to ₹250 Crore." |
| 13-year-old signs up with fake age | Section 9 + Rule 5 | "No Verifiable Parental Consent. Section 9 violation. Fine: up to ₹200 Crore." |
| Database breach not notified within 72 hours | Section 8(6) + Rule 7 | "Breach notification missed. Section 8(6) violation. Fine: up to ₹200 Crore." |
| User deletes account, data soft-deleted only | Section 13 + Rule 8 | "Soft-delete isn't erasure. Section 13 violation. Fine: up to ₹150 Crore." |
| User requests their data — no response | Section 12 | "Right to Access ignored. Section 12 violation. Board can fine per unfulfilled request." |
| Indian user data sent to a restricted country | Rule 12 | "Cross-border transfer to restricted country. Fine: up to ₹250 Crore." |
| Marketing emails sent after consent withdrawal | Section 6(4) | "Consent was withdrawn. Further processing is illegal. Section 6(4) violation. Fine: up to ₹250 Crore." |
| No Grievance Officer named | Section 14 | "No grievance mechanism. Section 14 violation. Board-determined fine." |
| SDF launches new AI feature without DPIA | Section 10 + Rule 10 | "No DPIA conducted. Section 10 violation. Fine: up to ₹150 Crore." |
| Behavioral ads shown to child users | Section 9(3) | "Behavioral advertising targeting minors is prohibited even with parental consent. Fine: up to ₹200 Crore." |
| RBI data retained but PII not redacted | Sec 13 + Sec 42 | "Legally retained records must have PII redacted where possible. Conflict resolution required." |
| S3 bucket misconfigured, data exposed | Section 8(5) + Rule 6 | "Inadequate security safeguards. Section 8(5) violation. Fine: up to ₹250 Crore." |

---

## PART 11: KEY CONCEPTS — PLAIN-LANGUAGE DEFINITIONS FOR GAME TOOLTIPS

### Notice (Section 5)
**What it is:** A clear, plain-language message you give to users BEFORE collecting their data, telling them: what you're collecting, why, and how they can stop you.
**Analogy:** Like a food label — you must declare ALL ingredients before someone eats it, not after.
**Game tooltip:** "You can't collect data in the dark. Turn on the lights first — that's what a Notice does."

### Consent (Section 6)
**What it is:** A genuine "Yes, go ahead" from the user — specific to each purpose, freely given, and easy to take back.
**Analogy:** Asking someone to dance — each song requires a new ask; "yes for the first song" doesn't mean yes to the whole evening.
**Game tooltip:** "A pre-ticked box is like forging a signature. Invalid."

### Purpose Limitation (Core Principle)
**What it is:** You can ONLY use data for the specific reason you collected it for. Email collected for OTP? Can't use it for marketing.
**Analogy:** If someone gives you their spare key for emergencies, you can't use it to move furniture.
**Game tooltip:** "Data has a passport — it can only go where it was invited."

### Data Minimization (Core Principle)
**What it is:** Only collect data you actually need. Don't collect a user's full address if you only need their city.
**Analogy:** You don't need a forklift to move a paperweight.
**Game tooltip:** "Less data = less liability. Collect only what you need."

### Storage Limitation (Section 8(7))
**What it is:** Delete data when you're done with it. No indefinite storage "just in case."
**Analogy:** Don't keep mail from 10 years ago that you'll never read again. Shred it.
**Game tooltip:** "Data is milk, not wine. It doesn't get better with age — it becomes a liability."

### Privacy by Design (Section 10 for SDFs, best practice for all)
**What it is:** Build privacy into your system from the first line of code, not as a patch after launch.
**Analogy:** Fire exits must be designed into the building from the blueprint stage — you can't add them after construction.
**Game tooltip:** "Privacy is an architecture decision, not a settings toggle."

### Data Fiduciary
**What it is:** Any company or person who decides WHY and HOW personal data is processed. If you're building an app that collects user data, YOU are the Data Fiduciary.
**Analogy:** The chef who decides the recipe and cooking method, not just the kitchen porter who does the washing up.
**Game tooltip:** "You decide how data is used. That makes you the Data Fiduciary — and fully responsible."

### Data Processor
**What it is:** A service provider who handles data ON YOUR BEHALF and under YOUR INSTRUCTIONS. AWS, Twilio, Razorpay (for payment processing) — these are your Data Processors.
**Analogy:** A laundry service — they clean your clothes (your data), but they follow your washing instructions (your policy). If they mess up your shirt (a breach), you're still responsible for hiring them.
**Game tooltip:** "Your vendors are your Data Processors. Their mistakes are your legal problem."

### Significant Data Fiduciary (SDF)
**What it is:** A Data Fiduciary so large or important that the Government designates it as needing extra oversight — like a "supervised systemic risk" category in banking.
**Analogy:** Like how SEBI treats large listed companies with more disclosure requirements than small unlisted firms.
**Game tooltip:** "Scale brings scrutiny. If you're big enough, the Government watches closer."

### Verifiable Parental Consent (VPC)
**What it is:** Actual, confirmed approval from a parent or guardian before processing a child's (under 18) data — not just a checkbox.
**Analogy:** A theme park requiring both a parent's signature AND physical presence to put a child on a scary ride — not just the child's word that "Mom said it's okay."
**Game tooltip:** "A child saying 'my parents are okay with it' isn't consent. You need to verify the parent, not just trust the child."

---

## PART 12: TIMELINE OF KEY DPDP MILESTONES

| Date | Event |
|------|-------|
| August 11, 2023 | DPDP Act 2023 receives Presidential assent and is gazetted |
| August 2023 | Section 44 (IT Act amendments) comes into force immediately |
| January 3, 2025 | DPDP Rules 2025 draft published by MeitY for public comment (60-day comment period) |
| March 2025 | Public comment period closes |
| Mid-2025 (est.) | Rules finalized and notified in Official Gazette |
| TBD (6-12 months after Rules notification) | Act's remaining provisions come into force (compliance deadline) |
| TBD | Government begins notifying SDFs |
| TBD | Board established and fully operational |

> **For Game Design:** The "compliance countdown clock" in your game could be based on the actual compliance timeline — creating real urgency for players.

---

## PART 13: THE REGULATORY CONFLICT MAP (For Game Level 2)

One of the most complex real-world scenarios for Indian startups: when DPDP's erasure mandate conflicts with sector-specific retention requirements.

| Sector Regulation | Retention Requirement | Conflicts With DPDP | Resolution |
|-------------------|----------------------|---------------------|-----------|
| **RBI (Payments)** | 7 years for transaction records | Section 13 (Right to Erasure) | Retain records; **redact PII** wherever possible in the retained records |
| **Income Tax Act** | 6 years for financial records | Section 13 | Same — retain for tax but redact identifying details if not needed for tax audit |
| **Companies Act** | 8 years for statutory registers | Section 13 | Retain for corporate law compliance; minimize PII in the retained data |
| **IT Act (amended)** | Varies by service type | Section 8(7) | DPDP Section 42 states sector law prevails in conflict; apply minimum retention |
| **SEBI** | 5 years for investor records | Section 13 | Retain; anonymize where possible |
| **IRDAI** | 10 years for insurance records | Section 13 | Retain; apply PII minimization to retained records |
| **TRAI** | 2 years for call records | Section 13 | Retain only the regulatory minimum; purge the rest |
| **FSSAI** | Food business records | Section 13 | Retain business records; purge customer PII after legitimate retention period |

**The Golden Rule:** When a legal retention obligation conflicts with an erasure request, **retain the record but redact (pseudonymize) the personal data** to the maximum extent permitted by the retention law. The record exists for compliance; the PII should be minimized.

---

## PART 14: DPDP COMPLIANCE STACK FOR STARTUPS (Technical Implementation Guide)

### Minimum Viable Compliance Architecture

```
LAYER 1: CONSENT MANAGEMENT
├── Consent Collection: Purpose-specific checkboxes, no pre-ticking
├── Consent Storage: Timestamped consent artefacts (immutable log)
├── Consent Dashboard: User self-service portal for viewing/withdrawing consent
└── Consent Withdrawal: Automated pipeline triggered on withdrawal

LAYER 2: DATA INVENTORY & MAPPING  
├── Data Discovery: Catalog all PII across all systems (DBs, S3, SaaS tools, logs)
├── Data Flow Map: Document where data goes (processors, countries, purposes)
├── Classification: Tag data by sensitivity (PII, sensitive PII, anonymous)
└── Retention Labels: Tag data with retention period and legal basis

LAYER 3: RIGHTS MANAGEMENT
├── Access Request Portal: User-facing dashboard to request data export
├── Correction Request: Workflow to update data across all systems
├── Erasure Pipeline: Hard-delete orchestrator across all data stores
├── Nomination System: Feature to designate account nominee
└── Grievance Ticketing: Named Grievance Officer + SLA-bound ticket system

LAYER 4: SECURITY & BREACH RESPONSE
├── Encryption: TLS in transit; AES-256 at rest; key management
├── Access Controls: RBAC; least privilege; MFA for data access
├── Monitoring: SIEM; DLP; anomaly detection for breach signals
├── Breach Response Playbook: Notification templates; Board contact; 72hr protocol
└── Pen Testing: Quarterly vulnerability scans; annual pen test

LAYER 5: CHILDREN'S DATA
├── Age Gate: ID-verified age check (DigiLocker integration)
├── VPC Flow: Parent identity verification → consent capture
├── Child Account Restrictions: Feature flags disabling ads, tracking, dark patterns
└── Parent Dashboard: Parent can view, manage, and revoke child account

LAYER 6: VENDOR MANAGEMENT
├── DPA Review: All vendors must sign DPDP-compliant Data Processing Agreements
├── Vendor Audit: Annual review of vendor compliance
├── Cross-Border Map: Track which vendors are in which countries
└── Deletion Notification: Automated vendor notification on erasure requests

LAYER 7: GOVERNANCE (MANDATORY FOR SDFs)
├── DPO: Appointed, India-based, publicly named
├── DPIA: Pre-launch impact assessment process
├── Audit: Annual independent data audit
└── Privacy by Design: Review process before any new data collection
```

---

## APPENDIX A: QUICK-REFERENCE PENALTY CARD (For In-Game Pop-ups)

| Shortcode | Violation | Fine |
|-----------|-----------|------|
| SEC5 | No / inadequate Notice | ₹200 Cr |
| SEC6 | Consent violation (invalid, no withdrawal, bundled) | ₹250 Cr |
| SEC8-SEC | No security safeguards (breach due to negligence) | ₹250 Cr |
| SEC8-BRN | No breach notification (Board + users) | ₹200 Cr |
| SEC8-ERA | Failure to erase | ₹150 Cr |
| SEC9 | Children's data violation (no VPC, behavioral tracking) | ₹200 Cr |
| SEC10 | SDF additional obligation violation | ₹150 Cr |
| SEC-GEN | Any other DPDP violation | ₹50 Cr |
| BOARD | Defying Board order | ₹50 Cr/incident |
| DP-FRAUD | Data Principal files false complaint | ₹10,000 |

---

## APPENDIX B: DPDP ACT SECTION INDEX

| Section | Title / Subject |
|---------|----------------|
| 1 | Short title, extent, commencement |
| 2 | Definitions (22 key terms) |
| 3 | Application of Act (scope) |
| 4 | Grounds for processing personal data |
| 5 | Notice to Data Principal |
| 6 | Consent (requirements + withdrawal) |
| 7 | Certain legitimate uses (processing without consent) |
| 8 | General obligations of Data Fiduciary |
| 9 | Processing of personal data of children |
| 10 | Additional obligations of Significant Data Fiduciaries |
| 11 | Right to information about grievance redressal |
| 12 | Right to access information about personal data |
| 13 | Right to correction and erasure |
| 14 | Right to grievance redressal |
| 15 | Right to nominate |
| 16 | Duties of Data Principal |
| 17 | Establishment of Data Protection Board of India |
| 18 | Composition of the Board |
| 19 | Functions of the Board |
| 20 | Powers of the Board in inquiries |
| 21 | Call for information |
| 22 | Voluntary undertaking |
| 23 | Alternate dispute resolution |
| 24 | Penalties |
| 25 | Voluntary breach disclosure |
| 26 | Inquiry process |
| 27 | Appeals (to TDSAT) |
| 28–35 | Board governance, finances, staff, and administration |
| 36 | Exemption — national security and state instrumentalities |
| 37 | Exemption — research, archiving, statistics |
| 38 | Other exemptions (personal use, publicly available data, small entities) |
| 39 | Sharing with foreign governments |
| 40 | Power to make Rules |
| 41 | Power to issue directions |
| 42 | Act supplementary to other laws (sector laws prevail in conflict) |
| 43 | Protection of good faith actions |
| 44 | Repeal and amendments (IT Act Section 43A repealed) |

---

## APPENDIX C: DPDP RULES 2025 INDEX

| Rule | Subject |
|------|---------|
| Rule 1 | Short title and commencement |
| Rule 2 | Definitions (consent artefact, Consent Manager, Notice) |
| Rule 3 | Form and content of Notice (operationalizes Section 5) |
| Rule 4 | Consent Manager: registration, obligations, standards (operationalizes Section 6) |
| Rule 5 | Children's data: age verification mechanism and VPC (operationalizes Section 9) |
| Rule 6 | Data Fiduciary obligations: security standards, DPA requirements, erasure (operationalizes Section 8) |
| Rule 7 | Personal data breach notification: timelines and content (operationalizes Section 8(6)) |
| Rule 8 | Data retention and erasure: standards, "zombie account" rule (operationalizes Sections 8(7) and 13) |
| Rule 9 | Rights of Data Principal: mechanism for exercising rights (operationalizes Sections 11–15) |
| Rule 10 | Significant Data Fiduciary: criteria, DPO, DPIA, audit (operationalizes Section 10) |
| Rule 11 | Consent Manager registration and operational standards |
| Rule 12 | Cross-border data transfers: restricted country mechanism (operationalizes Section 16 equivalent) |
| Rule 13 | Data Protection Board procedures: complaint filing, inquiry, appeals |
| Rule 14 | Exemptions for specific categories of Data Fiduciaries |

---

*Document compiled from: Digital Personal Data Protection Act, 2023 (No. 22 of 2023); Digital Personal Data Protection Rules, 2025 (Draft, notified January 3, 2025 by MeitY); IT Act 2000 (as amended); Supplementary regulatory guidance from RBI, SEBI, IRDAI as applicable to DPDP conflict scenarios.*

*For game design use — GramYaGram / The DPDP Sentinel Quest project.*
