# DPDP Sentinel Quest — Full Game Design Document
**Version 1.0 | April 2026**

> An open-world browser RPG where you play as India's newest Privacy Champion, racing to fix IndiaScale's data compliance disasters before a MeitY audit in 30 in-game days.

---

## TABLE OF CONTENTS
1. [Core Concept & Tone](#1-core-concept--tone)
2. [The World: IndiaScale City](#2-the-world-indiacale-city)
3. [Player Role & Character](#3-player-role--character)
4. [Point System](#4-point-system)
5. [The 5 Core NPCs](#5-the-5-core-npcs)
6. [All Quests — Mapped to DPDP Sections](#6-all-quests--mapped-to-dpdp-sections)
7. [Mini-Games](#7-mini-games)
8. [Random Events System](#8-random-events-system)
9. [Screen Descriptions](#9-screen-descriptions)
10. [Full Dialogue Scripts (Ink)](#10-full-dialogue-scripts-ink)
11. [Penalty Pop-up Cards](#11-penalty-pop-up-cards)
12. [Game Flow & Endings](#12-game-flow--endings)

---

## 1. CORE CONCEPT & TONE

### Logline
*"You're IndiaScale's freshly hired Privacy Champion. The company is a compliance disaster — shadow PII everywhere, no consent mechanism, children's data unprotected. MeitY is auditing in 30 days. Fix it, or ₹250 Crore walks out the door."*

### Tone
- **Not boring.** No quiz-bowl questions. No slideshow PDFs with a "Next" button.
- **Absurdly funny.** The CEO sends WhatsApp forwards about DPDP compliance. The auditor quotes penalty figures to intimidate you. The lead dev has seen things that can't be unseen.
- **Actually stressful.** The clock is real. Random events interrupt your plans. Trade-offs are hard.
- **Educational through doing.** You learn DPDP by making mistakes and seeing the consequences — not by reading definitions.

### The Core Loop
```
Explore a district → Find a problem → Talk to NPCs → 
Make a choice → See the consequence (compliance ↑ or debt ↑) → 
Receive a DPDP Pop-up → Feel smarter → Next problem
```

### Pacing
- **Session length:** 15–25 minutes for a full run
- **One-sitting design:** Can complete in one lunch break
- **Replayability:** Different dialogue choices → different compliance score → different ending
- **Difficulty:** Decisions are hard enough to feel meaningful but clear enough to teach the right answer

---

## 2. THE WORLD: INDIACALE CITY

IndiaScale City is a top-down pixel art open world with 8 districts. The player can explore freely, but some districts unlock only after completing earlier quests.

```
╔══════════════════════════════════════════════════════╗
║  🏢 INDIACALE HQ      │  📡 SERVER DISTRICT          ║
║  [Starting zone]       │  [Unlocked: Day 1]           ║
║  CEO's Office,         │  S3 Buckets, Database Room,  ║
║  Meeting Rooms,        │  Backup Servers, Cloud Panel  ║
║  Reception             │                              ║
║─────────────────────────────────────────────────────║
║  ⚖️  LEGAL TOWER       │  📣 MARKETING FLOOR          ║
║  [Unlocked: Day 4]     │  [Unlocked: Day 3]           ║
║  Lawyer's Office,      │  Ads Dashboard, CRM Systems, ║
║  Grievance Box,        │  Email Campaign Tool,        ║
║  Nomination Desk       │  Dark Pattern Gallery        ║
║─────────────────────────────────────────────────────║
║  🧒 SAFE HARBOR ZONE   │  🏦 RBI VAULT                ║
║  [Unlocked: Day 6]     │  [Unlocked: Day 8]           ║
║  Age Gate Lab,         │  Financial Records Archive,  ║
║  Parent Consent Flow,  │  Regulatory Conflict Room,   ║
║  Kids Feature Lab      │  7-Year Retention Vault      ║
║─────────────────────────────────────────────────────║
║  🌐 CLOUD FRONTIER     │  🔍 AUDIT PLAZA              ║
║  [Unlocked: Day 10]    │  [Unlocked: Day 29]          ║
║  SaaS Vendor Map,      │  *** FINAL BOSS ZONE ***     ║
║  Data Flow Diagram,    │  Board Room, Evidence Wall,  ║
║  Cross-Border Room     │  The MeitY Tribunal          ║
╚══════════════════════════════════════════════════════╝
```

### District Atmospheres

| District | Visual Vibe | Background Music | Key Objects |
|---|---|---|---|
| IndiaScale HQ | Bright, busy startup office | Upbeat lo-fi hip-hop | Whiteboards, post-its, startup swag |
| Server District | Dark, blinking LEDs, blue glow | Low electronic drone | Server racks, glowing data streams |
| Legal Tower | Formal, wood paneling, file stacks | Classical sitar + modern | Legal binders, court gavel |
| Marketing Floor | Loud colors, banner walls | Punchy pop | Screens showing ad campaigns |
| Safe Harbor Zone | Soft colors, child-like elements | Gentle, playful tune | Toys mixed with legal documents |
| RBI Vault | Very formal, gold trim, heavy doors | Slow, ominous | Massive filing cabinets, stamp machines |
| Cloud Frontier | Sci-fi, floating holographic maps | Ambient electronic | Server globes, data flow animations |
| Audit Plaza | Tense, clean, official | Silence broken by clock ticks | Audit table, official seals, evidence board |

---

## 3. PLAYER ROLE & CHARACTER

### Who You Are
**"The Privacy Champion"** — title given to you on Day 1 by the CEO, who clearly doesn't understand what it means.

### Character Creation (brief — at game start)
Player picks their background. This affects starting stats only, not major story branches:
- **🔧 The Engineer:** Start with +10 Compliance, -5 Coins (you understand the tech but not the business)
- **⚖️ The Lawyer:** Start with +10 Trust, +20 Coins (you know the law but developers won't listen to you)
- **📊 The Founder:** Start with +10 Coins, +5 Trust (you have business instincts but compliance blind spots)

### The Sentinel Device
Your in-game tool. Think: a glowing tablet/device that can:
- **Scan areas** for PII leaks (used in mini-game 1)
- **Run compliance checks** on NPC proposals
- **Show your current score metrics**
- **Access the DPDP Knowledge Base** (in-game reference to real Act sections)
- **Earn Sentinel Upgrades** with Privacy Coins (faster scan, better detection)

---

## 4. POINT SYSTEM

### The 4 Meters

#### 🛡 Compliance Score (0–100)
- **What it is:** Your overall DPDP compliance posture.
- **Starts at:** 20 (IndiaScale is already in bad shape)
- **Win condition:** Must hit 80+ before Day 30 to pass the audit
- **Grows from:** Correct decisions, completed quests, proper consent flows, correct breach responses
- **Falls from:** Skipping quests, wrong choices in dialogue, ignoring violations

#### 💀 Privacy Debt (0–100)
- **What it is:** Accumulated violations and compliance shortcuts
- **Starts at:** 30 (IndiaScale already has legacy debt)
- **Game over:** Hits 100 = catastrophic breach or pre-audit shutdown notice
- **Grows from:** Bad decisions, ignoring NPC warnings, fast-but-wrong solutions
- **Falls from:** Fixing known violations, completing compliance upgrades

#### ⭐ Trust Rating (0–100)
- **What it is:** How much employees, users, and investors trust you
- **Starts at:** 50 (neutral — nobody knows you yet)
- **Effect:** High Trust unlocks secret NPC quests and better dialogue options
- **Low Trust:** NPCs become harder to deal with; CEO overrides your decisions
- **Grows from:** Honest decisions, protecting user rights, transparent actions
- **Falls from:** Cutting corners, lying to NPCs, ignoring user rights

#### 🪙 Privacy Coins (0–9999)
- **What it is:** In-game currency earned by completing quests and making good choices
- **Spent on:** Sentinel Device upgrades, hiring DPO, buying legal templates, unlocking fast-track solutions
- **Earned from:** Correct quiz answers, quest completions, exploration bonus (finding hidden DPDP violations)

### Score Events Table

| Action | Compliance Δ | Debt Δ | Trust Δ | Coins Δ |
|---|---|---|---|---|
| Complete a major quest (correct) | +15 to +25 | -5 to -10 | +10 | +100–200 |
| Make a bad choice in dialogue | -5 to -10 | +10 to +20 | -10 to -20 | 0 |
| Discover a hidden PII stash | +5 | 0 | +5 | +30 |
| Ignore a random event | -5 | +15 | -10 | 0 |
| Respond correctly to breach | +20 | -15 | +15 | +100 |
| Respond late to breach | +5 | +10 | -10 | 0 |
| CEO overrides your decision | -10 | +15 | -5 | 0 |
| Hire a DPO (correct) | +15 | -10 | +10 | -300 |
| Register a Consent Manager | +20 | -15 | +15 | -500 |
| Pass a mini-game perfectly | +10 | -5 | +5 | +75 |
| Fail a mini-game | 0 | +5 | 0 | 0 |
| Find an Easter egg | 0 | 0 | +5 | +50 |
| Per in-game day passing | 0 | +1 | 0 | 0 |

### Compliance Grade at End
| Final Score | Grade | Ending Unlocked |
|---|---|---|
| 90–100 | S — Privacy by Design | "Gold Standard" ending |
| 80–89 | A — Compliant | "Passed Audit" ending |
| 65–79 | B — Mostly Safe | "Conditional Pass" ending |
| 50–64 | C — At Risk | "Warning Notice" ending |
| 30–49 | D — Non-Compliant | "Heavy Fine" ending |
| 0–29 | F — MeitY Shutdown | "Game Over" ending |

---

## 5. THE 5 CORE NPCS

### 🔴 Rakesh Sharma — The Grumpy Auditor
- **Role:** External DPDP auditor hired by IndiaScale's VC
- **Personality:** Formally dressed, never smiles, quotes penalty figures at you constantly, secretly respects people who know the law
- **Location:** Walks between IndiaScale HQ and Server District; appears at Audit Plaza for final boss
- **Function:** Main quest-giver; explains compliance gaps; gives hints during boss battle
- **Quirk:** Has a running "Fine Counter" display on his tablet that updates every time you make a mistake. It starts at ₹0 and you want to keep it that way.
- **Hidden depth:** If Trust is high enough, he reveals that IndiaScale is one of the BETTER companies he's audited. This is terrifying.

### 🟢 Priya Singh — The Lead Developer
- **Role:** IndiaScale's best engineer who's been screaming about compliance for 2 years and nobody listened
- **Personality:** Frantic, brilliant, uses technical jargon, deeply relieved you exist, occasionally drops "I told them so" 
- **Location:** Server District and occasionally HQ (coffee in hand, always)
- **Function:** Technical quest-giver; explains the engineering side of compliance; helps implement fixes
- **Quirk:** Has a "Tech Debt vs Privacy Debt" whiteboard she's been updating for 18 months
- **Hidden depth:** She already has a half-built data deletion pipeline — she just needs your authority to activate it

### 🟡 Vikram Malhotra — The WhatsApp-Forward CEO
- **Role:** Founder and CEO who read a Medium post about DPDP once and considers himself informed
- **Personality:** Optimistic, disconnected from reality, sends audio messages at midnight, quotes his Stanford MBA constantly
- **Location:** CEO's corner office in HQ; also appears at VC meetings via video call
- **Function:** Business tension creator; sometimes overrides your decisions; has the budget authority you need
- **Quirk:** Every conversation starts with "yaar, what's the worst that could happen?" Your job is to show him.
- **Hidden depth:** He's genuinely scared of the VC pulling funding. Use this to get budget for compliance.

### 🟣 Anjali Mehta — The Privacy Lawyer
- **Role:** External privacy counsel that IndiaScale hired 6 months ago but never properly briefed
- **Personality:** Calm, extremely precise, annotates everything, slightly exasperated, brilliant at finding the middle path
- **Location:** Legal Tower
- **Function:** Deep legal explanations; helps navigate regulatory conflicts; drafts legal templates you can use
- **Quirk:** She has a bookshelf with every DPDP-related document, cross-referenced and color-coded. It's beautiful.
- **Hidden depth:** She can argue your case before the Board if you have enough evidence. She's expensive (costs Privacy Coins) but can reduce a fine to zero.

### 🟠 Officer Gupta — The MeitY Representative
- **Role:** Data Protection Board officer who appears for surprise mini-audits and the final exam
- **Personality:** Bureaucratically correct, neither friendly nor hostile, completely unpredictable in timing
- **Location:** Appears randomly in any district (random event); boss in Audit Plaza
- **Function:** Surprise auditor for random events; final boss in Day 29 Audit Plaza
- **Quirk:** Always appears right when you're in the middle of something else
- **Hidden depth:** If your Compliance Score is 80+ when he appears, he actually gives you a compliance certificate you can display on the "Most Compliant Unicorns" leaderboard

---

## 6. ALL QUESTS — MAPPED TO DPDP SECTIONS

### MAIN STORY QUESTS (unlocks sequentially)

---

#### QUEST M1: "The Onboarding from Hell"
**Unlocks:** Day 1 (game start)
**District:** IndiaScale HQ
**DPDP Sections:** §1–4 (Scope, Definitions, Grounds for Processing)
**Learning:** DPDP applies to ALL Indian user data regardless of server location; you need a lawful basis for EVERY processing activity

**Scenario:**
CEO Vikram hands you a "Compliance Checklist" from 2019 and says "we're probably fine." Rakesh shows up 10 minutes later with a tablet showing 14 active violations.

**Objectives:**
1. Talk to Rakesh to get the full violation list
2. Talk to Priya to understand what data IndiaScale actually processes
3. Talk to Anjali to understand your legal exposure
4. Decision: Do you tell Vikram the truth or soften the numbers?

**Key Decision:**
- **Tell Vikram the full truth** → Trust +15, Compliance +5 (CEO unlocks the budget grudgingly)
- **Soften the numbers** → Trust -10, Coins +50 (CEO thinks it's manageable; he's wrong)

**Reward:** Compliance +10, Coins +100, unlock Server District and Marketing Floor
**Pop-up:** "Under §3 of the DPDP Act 2023, IndiaScale's AWS us-east-1 hosting does NOT exempt it from DPDP. The law follows the user, not the server."

---

#### QUEST M2: "Notice Me, Senpai" — The Privacy Notice Overhaul
**Unlocks:** Day 2
**District:** HQ + Marketing Floor
**DPDP Sections:** §5 (Notice), §6 (Consent)
**Learning:** Notice must be plain-language, specific, given BEFORE data collection; consent must be unambiguous

**Scenario:**
Priya discovers IndiaScale's current privacy notice is a copy-pasted 40-page document from 2018 with the previous company's name still in it. Marketing Floor has been using pre-ticked consent boxes for the email list.

**Objectives:**
1. Find the current privacy notice (it's buried 3 menus deep on the website — NPC tells you where)
2. Identify 4 violations in the current notice (mini-puzzle: spot the problems)
3. Work with Anjali to draft a compliant notice
4. Fix the consent mechanism on Marketing Floor

**Key Decisions:**
- **Draft a proper notice (costs 2 Coins per word of legalese removed):** Compliance +20, Debt -10
- **Repurpose the old one with minimal edits:** Compliance +5, Debt +10, Anjali refuses to certify it
- **For consent: replace pre-ticked boxes with opt-in:** Compliance +15, Trust +10
- **Keep pre-ticked (CEO's idea — "more conversions"):** Debt +20, pop-up triggers immediately

**The Dark Pattern Sub-Quest:**
Marketing Manager Ranjit (new NPC) shows you 5 consent UI designs. You must identify the dark patterns:
1. Pre-ticked consent → ❌ Violation
2. "Green Yes / tiny gray No" button → ❌ Dark pattern (even if opt-in)
3. Bundled consent ("consent to terms AND marketing") → ❌ §6(3) violation
4. Separate, equal-size Yes/No with clear purpose → ✅ Compliant
5. "We'll improve your experience" as purpose description → ❌ Not specific enough

**Reward:** Compliance +20, Coins +150, unlock Legal Tower
**Pop-up:** "§5 requires notice to be in clear, plain language — not a 40-page PDF with another company's name on it. The fine for missing notice: ₹200 Crore."

---

#### QUEST M3: "The PII Scavenger Hunt"
**Unlocks:** Day 3
**District:** Server District
**DPDP Sections:** §8 (Obligations), §2 (Definitions — what IS personal data)
**Learning:** PII is everywhere; you can't protect what you haven't found; shadow PII is the biggest compliance risk

**Scenario:**
Priya says "we know where most of our user data is." She says this confidently. She is wrong.

**Objectives:**
1. Use the Sentinel Device's **PII Radar mini-game** to scan Server District
2. Find PII in unexpected locations:
   - S3 bucket `/exports/2022-users.csv` — 50,000 users, unencrypted, no retention policy
   - Slack integration logs — user emails in plaintext in search indexes
   - Old A/B test results — user IDs correlated to behavioral data
   - Customer support tool (Freshdesk) — stores full name + phone + issue history
   - Analytics platform (Mixpanel) — behavioral data tied to email addresses
3. For each one found: decide how to handle it (delete / encrypt / retain legally)

**Key Decision for each discovery:**
- **Delete immediately:** Compliance +5, risk of disrupting old analytics (CEO unhappy)
- **Encrypt and set retention policy:** Compliance +8, Coins -20 (needs engineering time)
- **"We'll deal with it later":** Debt +10, Trust -5, Rakesh adds it to his report

**The Hidden PII Discovery (Easter Egg):**
In the Server District there's an old terminal. Interacting with it shows an email thread from 2019 where the previous CTO approved storing unencrypted Aadhaar numbers "temporarily." This costs Debt +20 immediately but gives Compliance +15 for finding and reporting it.

**Reward:** Compliance +20, Coins +150, Sentinel Device upgrade (Level 2 — detects pseudonymized data)
**Pop-up:** "Under §8(5), failure to secure personal data can result in fines up to ₹250 Crore. The S3 bucket you found was publicly accessible. The data of 50,000 users was exposed."

---

#### QUEST M4: "Consent Manager, Assemble"
**Unlocks:** Day 5
**District:** HQ + Legal Tower
**DPDP Sections:** Rule 4 (Consent Manager registration and operations)
**Learning:** A Consent Manager is a new regulated category; startups must integrate with one or build their own

**Scenario:**
Anjali tells you that IndiaScale needs a proper Consent Manager integration. Right now, there's no centralized place where users can see, modify, or withdraw their consents. Vikram thinks "a checkbox is enough."

**Objectives:**
1. Talk to Anjali about Consent Manager requirements (Rule 4)
2. Mini-decision: Build internal vs. integrate with external Consent Manager
   - **Build internal:** Costs ₹500 Coins, takes 7 in-game days, gives higher Trust
   - **Integrate external:** Costs ₹200 Coins, takes 2 in-game days, less control
3. Design the Consent Dashboard (mini-game: drag-and-drop UI builder)
4. Ensure the consent withdrawal flow is as easy as consent was given (§6(5))

**The Consent Dashboard Mini-Game:**
You're given a set of UI elements and must build a compliant consent dashboard:
- ✅ Must have: "View my consents", "Withdraw consent", "Download my data"
- ✅ Must have: separate toggle for each consent purpose
- ❌ Cannot have: bundled withdrawal (only option = withdraw ALL)
- ❌ Cannot have: withdrawal flow that requires more clicks than consent flow
- ❌ Cannot have: dark background + red warning text on withdrawal button

**Reward:** Compliance +20, Coins +200, unlock Safe Harbor Zone
**Pop-up:** "Under Rule 4, Consent Managers must maintain 5-year records of consent artifacts. Under §6(5), withdrawal must be as easy as giving consent — if sign-up takes 3 taps, withdrawal must take ≤3 taps."

---

#### QUEST M5: "Children of the Algorithm" — VPC Challenge
**Unlocks:** Day 6
**District:** Safe Harbor Zone
**DPDP Sections:** §9 (Children's data), Rule 5 (VPC mechanisms)
**Learning:** Self-declaration age gates are illegal; VPC requires actual verification; dark patterns targeting children are prohibited even WITH parental consent

**Scenario:**
Priya found that 38% of IndiaScale's users are showing behavioral patterns of users under 18. The current age gate asks "Are you 18 or older? YES / NO." This is exactly as legally defensible as a "Pinky Promise."

**The Age Gate Maze (Main Mini-Game):**
A visual puzzle where you're designing IndiaScale's age verification flow. You must balance:
- **Compliance Meter:** Goes up with more robust verification
- **Drop-off Meter:** Goes up with more friction (too much friction = CEO crisis)
- **UX Score:** How good the experience is

Three rounds:
1. **Design the age verification mechanism** — choose from options:
   - Self-declaration only → Compliance ↓↓, Drop-off ↓ (illegal)
   - DigiLocker verification → Compliance ↑↑, Drop-off ↑↑
   - Aadhaar-linked (without storing Aadhaar) → Compliance ↑↑↑, Drop-off ↑↑↑ (legally correct)
   - "I'm-over-18" checkbox + birth year → Compliance ↓, Drop-off ↓ (insufficient per Rule 5)

2. **Design the VPC flow for detected child users:**
   - Send parent verification link via phone + OTP → Compliance ↑↑
   - Ask child to show the phone to a parent → ❌ Not verifiable
   - Require parent to create separate account → Compliance ↑↑↑, Drop-off ↑↑↑

3. **Design the restricted child account features:**
   - Remove behavioral ad targeting → Compliance ↑↑ (required)
   - Remove infinite scroll → Compliance ↑↑ (required for under-18)
   - Remove loot box mechanics → Compliance ↑↑ (required)
   - Remove leaderboard (optional) → Compliance ↑, Trust +5

**CEO Intervention:** After round 2, Vikram calls and says "38% of our users can't sign up now, the board is calling." You must navigate this conversation:
- "The fine for violating §9 is ₹200 Crore. The VPC flow takes 45 seconds." → Compliance path
- "Let's launch and fix it later" → Privacy Debt +25

**Reward:** Compliance +25, Coins +200, Sentinel Device upgrade (Level 3 — detects behavioral dark patterns)
**Pop-up:** "§9 prohibits tracking, profiling, and behavioral advertising for children under 18. Even WITH Verifiable Parental Consent, these activities are prohibited. Your loot boxes were visible to 35,000 child users."

---

#### QUEST M6: "The 72-Hour Breach Sprint"
**Unlocks:** Day 8 (triggers as a surprise event — CANNOT be skipped)
**District:** Server District → all districts
**DPDP Sections:** Rule 7 (Breach Notification), §8(6) (Breach obligations)
**Learning:** Breach notification = 72 hours to Board, simultaneous to affected users; encrypted data may not require notification; voluntary disclosure reduces penalties

**Scenario:**
At Day 8, a random event triggers: Priya messages you at 11:47 PM — an S3 bucket was misconfigured and publicly accessible for 6 hours. 12,000 user records exposed (names, emails, phone numbers). The internal security team just found it.

**The Clock Starts Now:** A visible countdown timer appears: 72:00:00

**Objectives (time-pressured):**
1. **Confirm the breach scope** (Server District) — how many users, what data
2. **Contain the breach** (fix the misconfiguration)
3. **Draft the Board notification** — must include all required fields (Rule 7):
   - Nature of breach ✓
   - Categories and volume of data ✓
   - Likely consequences ✓
   - Steps taken ✓
   - Contact details ✓
4. **Notify affected users** — draft the user notification in plain language
5. **Notify all sub-processors** (Anjali's checklist: AWS, Twilio, Freshdesk, Segment)
6. **The RBI Conflict:** Among the 12,000 affected users, 3,000 have active transaction records. These must be retained per RBI for 7 years. Solution: redact PII from transaction logs, not delete them.

**Key Decisions:**
- **Notify Board at Hour 4:** Compliance +20, Debt -15, Trust +10 (proactive)
- **Notify Board at Hour 48:** Compliance +10, Debt -5, fine reduced but not eliminated
- **Notify Board at Hour 73 (late):** Compliance -10, Debt +25, penalty triggered
- **Don't notify:** Debt +40, game over risk

**The Volunteer Disclosure Bonus:**
If you notify before Hour 24 AND your Compliance Score is above 60: Officer Gupta appears and says IndiaScale's proactive response will be noted as a mitigating factor. Fine reduction: 40%.

**Reward:** Compliance +25, Coins +150 (if completed correctly), unlock RBI Vault
**Pop-up:** "Under Rule 7, breach notification to the Board is due within 72 hours of becoming aware. 'Investigating' is not an excuse for delay — notify first, update later. Failure: ₹200 Crore."

---

#### QUEST M7: "The Erasure Paradox"
**Unlocks:** Day 10
**District:** Legal Tower + Server District + RBI Vault
**DPDP Sections:** §13 (Right to Erasure), Rule 8 (Erasure standards), §7 (Legitimate use)
**Learning:** Erasure ≠ `is_deleted = true`; regulatory conflicts require pseudonymization not deletion; erasure must cascade to ALL systems

**Scenario:**
A prominent journalist submits a formal Right to Erasure request. She wants ALL of her data deleted. IndiaScale's CTO's plan: flip a boolean in the users table. Anjali nearly faints.

**The Erasure Cascade Puzzle:**
A visual flow diagram of all the places this user's data lives. You must route deletion through each one:

```
User Record (Main DB)       → [Delete] ✓
Payment Records (Stripe)    → [Cannot delete — PCI DSS; redact name/email]
Transaction Logs (RBI)      → [Cannot delete — 7yr rule; pseudonymize PII]
Email History (SendGrid)    → [Delete from campaigns] ✓
Support Tickets (Freshdesk) → [Anonymize ticket, delete PII] ✓
Analytics Events (Mixpanel) → [Delete user profile + events] ✓
Marketing Lists (Clevertap) → [Remove from all lists] ✓
Backup Snapshots (AWS S3)   → [Flag for purge on next backup cycle] ✓
Audit Logs (Internal)       → [Pseudonymize — keep logs for security] ✓
```

**The Key Insight (teaches Rule 8):**
There are 3 categories of records:
1. **Must delete:** Social profile, email list, analytics
2. **Must pseudonymize:** RBI transaction logs, audit logs (retain structure, remove PII)
3. **Cannot touch:** Legally mandated records (but PII must be redacted)

**Soft Delete vs Real Delete Education:**
Priya shows you IndiaScale's "delete" code: `UPDATE users SET is_deleted = true`. This is NOT compliant. She shows what real erasure looks like — a cascade job that hits every microservice and returns a deletion receipt.

**The Journalist's Follow-up:** She asks for a "deletion confirmation receipt." This must be generated and provided. If you can't provide it → Trust -20.

**Reward:** Compliance +25, Coins +200, "Deletion Pipeline" tool added to Sentinel Device
**Pop-up:** "Under §13, erasure must be permanent and extend to ALL systems — including backups, analytics tools, and third-party processors. A soft-delete (`is_deleted=true`) is a compliance violation. Fine: ₹150 Crore."

---

#### QUEST M8: "Right There in Plain Sight" — User Rights Portal
**Unlocks:** Day 12
**District:** HQ + all connected systems
**DPDP Sections:** §11–§15 (All Data Principal Rights)
**Learning:** Users have 6 rights; you need a self-service portal for all of them; Nomination is unique to India's DPDP

**The 6 Rights Users Have:**
| Right | Section | What it requires | SLA |
|---|---|---|---|
| Access/Information | §12 | Summary of data + list of processors | 30 days |
| Correction | §13 | Fix inaccurate data | 30 days |
| Erasure | §13 | Delete all data (with legal exceptions) | 30 days |
| Grievance Redressal | §14 | Named officer + response process | 30 days |
| Nomination | §15 | Allow user to appoint someone for death/incapacity | On account setup |
| Consent Withdrawal | §6(4) | Stop all processing immediately | Immediate |

**The Portal Builder Mini-Game:**
Design IndiaScale's Privacy Dashboard using a drag-and-drop interface. You must include all 6 rights with compliant UX. Points deducted for:
- Missing any right
- Making withdrawal harder than consent
- No Nomination feature (unique to India, most companies miss this)
- Grievance contact is just `privacy@indiacale.com` with no SLA

**The Nomination Feature (Special Moment):**
This is a teaching moment. Most startups have never heard of §15. When you add the Nomination feature, the in-game news feed shows: *"IndiaScale becomes one of the first Indian startups to implement Data Principal Nomination — the only country in the world with this privacy law."*

**Reward:** Compliance +20, Coins +150, Trust +15
**Pop-up:** "§15 of the DPDP Act gives every user the right to nominate a family member who can exercise their data rights if the user dies or becomes incapacitated. Almost no Indian startup has implemented this. If you have, you're ahead of 99% of your peers."

---

#### QUEST M9: "Significant or Not?" — The SDF Classification
**Unlocks:** Day 14
**District:** Legal Tower + HQ
**DPDP Sections:** §10 (SDF obligations), Rule 10
**Learning:** SDF classification is based on data volume + sensitivity, not just company size; SDF obligations are significantly heavier

**Scenario:**
Rakesh delivers news: MeitY is reviewing IndiaScale for Significant Data Fiduciary classification. If classified, IndiaScale must immediately appoint a DPO, conduct a DPIA, and schedule annual audits.

**Decision Tree:**
First: Answer 5 questions to assess SDF likelihood:
1. How many users does IndiaScale process data for? (>1 million = high risk)
2. Does IndiaScale process sensitive personal data? (financial, health, biometric)
3. Does IndiaScale's algorithm make decisions that affect users?
4. Does IndiaScale have data localization requirements?
5. Does IndiaScale cross-border transfer data?

**If SDF Likely:**
Must complete 4 sub-tasks:
1. **Hire DPO** (costs 300 Coins — hire internally or externally)
   - Internal DPO: cheaper, lower Trust (seen as not independent)
   - External DPO: expensive, higher Trust, Board-credible
2. **Conduct DPIA** (mini-game: assess your new recommendation algorithm)
3. **Schedule independent audit** (costs 200 Coins, unlocks "Audit Trail" evidence)
4. **Algorithmic accountability** — ensure the recommendation engine can explain its decisions

**The DPIA Mini-Game:**
Assess IndiaScale's new AI recommendation feature against a checklist:
- Does it process sensitive data? → If yes, higher risk
- Can the recommendation be explained? → Must implement explainability
- Can users opt out of algorithmic decisions? → Must provide manual override
- Is the data minimized? → Only process what's needed for recommendations

**Reward:** Compliance +20, Coins +100 (net after costs), unlock Cloud Frontier
**Pop-up:** "§10 of the DPDP Act requires Significant Data Fiduciaries to conduct Data Protection Impact Assessments before launching new AI features. This is similar to GDPR Article 35 — India is now at the global frontier of AI governance."

---

#### QUEST M10: "The Cloud Frontier" — Cross-Border Data
**Unlocks:** Day 16
**District:** Cloud Frontier
**DPDP Sections:** Rule 12 (Cross-border transfers)
**Learning:** India takes a permissive approach (allow unless restricted); startups must maintain data flow maps; watch for restricted country lists

**Scenario:**
Priya pulls up a list of all the SaaS tools IndiaScale uses. She asks: "Do any of these store Indian user data abroad? Because... yes. All of them."

**The Data Flow Map Mini-Game:**
A world map. You must trace where each SaaS tool sends IndiaScale's user data and rate the risk:

| Tool | Country | Data Type | Risk Level |
|---|---|---|---|
| AWS (us-east-1) | USA | All user data | HIGH (if restricted) |
| Twilio | USA | Phone numbers | MEDIUM |
| Stripe | USA | Payment data | MEDIUM (covered by PCI) |
| OpenAI API | USA | Query data | HIGH (if sensitive) |
| Amplitude | USA | Behavioral data | MEDIUM |
| Freshdesk | USA/India | Support tickets | MEDIUM |
| Razorpay | India | Payments | LOW ✓ |

**The Restricted Country Check:**
India has not yet published a restricted country list (as of early 2026). But the Government can do so at any time. Your job: build a **data localization plan** so IndiaScale can migrate critical data to India quickly if needed.

**Key Decision:**
- **Move all data to Indian AWS region immediately:** Compliance +15, Coins -500 (expensive)
- **Build migration plan + document current transfers:** Compliance +10, Coins -100
- **Do nothing:** Compliance +0, Debt +5 (no current violation, but exposed if restrictions come)

**Reward:** Compliance +15, Coins +100, unlock Audit Plaza (available but not open until Day 29)
**Pop-up:** "Under Rule 12, India takes a permissive approach to cross-border data transfers — transfers are allowed unless the Government restricts them. But you must maintain a data flow map showing where data goes. When restrictions come, you need to migrate fast."

---

#### QUEST M11: "The Zombie Accounts Apocalypse"
**Unlocks:** Day 18
**District:** Server District + HQ
**DPDP Sections:** Rule 8 (Storage limitation / Zombie Account rule)
**Learning:** Inactive accounts must be cleaned up; data cannot be stored indefinitely; auto-purge pipelines required

**Scenario:**
Priya has found 2.3 million accounts that haven't been accessed in 3+ years. Under Rule 8's "Zombie Account" provision, IndiaScale must notify them and delete if no response.

**The Zombie Account Cleanup:**
A batch processing mini-game. You must:
1. Define "inactive" threshold (game recommends: 3 years per Rule 8's likely standard)
2. Design the notification flow (email? SMS? in-app?)
3. Set the response window (how long to wait before deletion)
4. Execute the batch delete (with confirmation from Priya and Anjali)

**The Complication:**
Among the 2.3 million zombie accounts:
- 40,000 have active subscriptions (cannot delete without notice)
- 15,000 are government accounts (require special handling)
- 8,000 have pending refund claims (must retain financial data)
- 2,237,000 are truly dormant (delete)

**CEO Panic:**
Vikram sees the deletion plan and calls: "You're deleting 2 million users from our database! That's our MAU metric! The board will never understand!"

**Your response options:**
- "MAU from accounts that haven't logged in for 3 years is ghost metrics." → Trust +10, CEO unhappy but compliant
- "We can anonymize them for analytics but still delete PII." → Compliance +10, CEO relieved, Trust +5
- "Let me delay until after the next fundraise." → Debt +15, privacy violation accumulates

**Reward:** Compliance +20, Coins +150
**Pop-up:** "Rule 8's 'Zombie Account' provision requires Data Fiduciaries to notify inactive users and delete their data if there's no response. Inactive = no interaction for a period prescribed by the Government (likely 3 years). 2.3 million zombie accounts = ₹150 Crore exposure."

---

#### QUEST M12 (FINAL): "The MeitY Tribunal" — Audit Boss Battle
**Unlocks:** Day 29
**District:** Audit Plaza
**DPDP Sections:** All (synthesis)
**Learning:** Summary of everything; seeing how the pieces fit; your compliance score determines the outcome

**The Setup:**
Officer Gupta arrives with two colleagues and a printed copy of everything Rakesh has reported. He has 3 rounds of questions. Each round you choose between 2–3 answers. Your evidence (collected throughout the game) can be used to support your answers.

**Round 1: Compliance Foundations**
*"Show me your lawful basis for processing personal data."*
- If you have: Updated Privacy Notice → Compliance proven
- If you have: Consent Manager → Extra credit
- If missing: Debt +20, round 1 failed

*"Where does your users' data go outside India?"*
- If you have: Data Flow Map → Compliance proven
- If missing: ₹50 Crore notice issued

**Round 2: User Rights**
*"A user filed an erasure request 28 days ago. Show me the deletion receipt."*
- If you have: Deletion Pipeline tool → Show receipt → Compliant
- If you completed Quest M7 incorrectly → No receipt → Debt +25

*"How do you handle data of users under 18?"*
- If Safe Harbor Zone quest completed → VPC flow demonstrated → Compliant
- If not → ₹200 Crore fine triggered, game continues but grade capped at C

**Round 3: Incident Response**
*"Walk me through your breach response from Day 8."*
- If you notified within 72 hours → Compliance proven, voluntary disclosure credit
- If late → Penalty calculated based on how late
- If Compliance Score is 80+: Officer Gupta: "IndiaScale is now in the Top 10% of compliant companies I've audited. That is simultaneously impressive and deeply concerning about the rest."

**The Voluntary Undertaking Option (§22):**
Before Round 3, if your Compliance Score is 70–80, Anjali (if you hired her) can offer a Voluntary Undertaking to the Board: "We acknowledge 3 remaining violations and commit to resolving them in 60 days." Officer Gupta can accept, reducing penalties significantly.

**Reward:** Based on final Compliance Score → see Endings
**Final Pop-up:** Full DPDP Compliance Scorecard with specific sections you passed/failed + "What to fix first in the real world"

---

### SIDE QUESTS (optional, unlock by exploring)

#### SIDE-1: "The Grievance Ghost"
**District:** Legal Tower
**DPDP Section:** §14 (Grievance Redressal)
**Trigger:** Find a printed email on the floor of Legal Tower — a user complaint sent 6 months ago, never answered

**Quest:** Set up a proper grievance mechanism with:
- Named Grievance Officer (must not be a generic email)
- Defined 30-day SLA
- Escalation path to the Board

**Reward:** Compliance +10, Trust +15, Coins +100

---

#### SIDE-2: "Duties of Data Principal" — The Bad Actor
**District:** HQ Reception
**DPDP Section:** §16 (Duties of Data Principal)
**Trigger:** Someone files a grievance claiming their child's data was processed, but they provided a fake age themselves

**Quest:** Navigate this using §16 (Data Principals cannot impersonate or provide false information). Requires: documentation of the original age representation, evidence of your VPC flow

**Reward:** Compliance +5, Trust +10, Coins +50, unlock §16 as a "defense card" in the final boss

---

#### SIDE-3: "The Research Exemption"
**District:** Server District
**DPDP Section:** §37 (Research exemption)
**Trigger:** Priya says IndiaScale's data science team wants to use user data for "research" without consent

**Quest:** Assess whether the research is genuinely exempt:
- Is it anonymized? → If yes, exempt
- Is it used to make decisions about individual users? → If yes, NOT exempt
- Will it be published in identifiable form? → If yes, NOT exempt

**Reward:** Compliance +10, Coins +80

---

#### SIDE-4: "The Voluntary Disclosure"
**District:** HQ + Legal Tower
**DPDP Section:** §25 (Voluntary breach disclosure)
**Trigger:** Priya finds a second smaller breach (5,000 records exposed 2 months ago that nobody reported)

**Quest:** Decide whether to proactively disclose to the Board:
- **Disclose now:** Compliance +15, Debt -10 (mitigation factor)
- **Hope nobody notices:** Debt +20 (if discovered, full penalty)

**Reward:** Compliance +15, Coins +100

---

#### SIDE-5: "The Nomination Nobody Built"
**District:** HQ Product Team area
**DPDP Section:** §15 (Right to Nominate)
**Trigger:** A user emails asking how to nominate her husband to manage her account if she's incapacitated

**Quest:** Build the Nomination feature (simplified mini-game):
- Design nomination form
- Decide verification requirements for nominee
- Decide how data rights transfer to nominee

**Reward:** Compliance +10, Trust +20, Coins +75
**Special:** Unlocks the "Privacy by Design" badge on the leaderboard

---

## 7. MINI-GAMES

### Mini-Game 1: PII Radar Scan
**Used in:** Quest M3, various discovery moments
**Mechanic:** A radar-style scanner sweeps across a visual representation of a server room / codebase. PII "signatures" appear as glowing dots. Click to investigate — some are violations, some are compliant storage, some are false positives.
**Scoring:** Perfect scan = all violations found, no false positives = max coins
**Teaches:** PII is not just in your main database; it hides in logs, analytics, support tools

### Mini-Game 2: Consent Flow Designer
**Used in:** Quest M2 (Notice/Consent), Quest M4 (Consent Manager)
**Mechanic:** Drag-and-drop UI builder. You're given a set of UI components and must build a compliant consent screen. A "Compliance Checker" panel on the right updates in real time as you add/remove elements.
**Red flags that trigger penalty:** Pre-ticked boxes, bundled consent, unequal button sizes, vague purpose descriptions
**Teaches:** Good consent UX is good UX; dark patterns are both illegal and bad design

### Mini-Game 3: The Erasure Cascade
**Used in:** Quest M7
**Mechanic:** A visual flow diagram. You must route a deletion command through all systems connected to IndiaScale's infrastructure. Each system either: accepts delete, requires pseudonymization, or throws an exception (legal hold required).
**Scoring:** Complete cascade with correct handling for each system = max compliance
**Teaches:** Real erasure is a systems engineering problem, not a database flag

### Mini-Game 4: The Age Gate Maze
**Used in:** Quest M5
**Mechanic:** A balance slider showing Compliance vs. Drop-off. You choose from verification mechanisms and see both meters respond in real time. Then design the VPC flow. Then audit the child account feature list.
**Teaches:** Compliance is a design challenge; the best solutions minimize friction while being legally defensible

### Mini-Game 5: The DPIA Checklist
**Used in:** Quest M9 (SDF)
**Mechanic:** A new product feature is being launched (IndiaScale's recommendation engine). You must assess it against a DPIA checklist, flagging risks. For each risk, choose a mitigation.
**Teaches:** Privacy impact assessments are a regular engineering activity, not a one-time legal event

### Mini-Game 6: The Dark Pattern Gallery
**Used in:** Marketing Floor exploration (optional)
**Mechanic:** You walk through a gallery of 10 real-world (anonymized) UI screenshots. Click on dark patterns to identify them. Some patterns are from actual Indian apps (heavily anonymized). Points for each correct identification.
**Patterns included:** Roach motel, pre-ticked boxes, hidden opt-outs, confirm-shaming, misdirection, trick questions, disguised ads
**Teaches:** Dark patterns aren't just annoying — under DPDP, they invalidate consent

---

## 8. RANDOM EVENTS SYSTEM

Every 3–5 in-game days, one of the following fires (randomized, weighted by current state):

### Event Pool

| Event | Trigger Condition | Effect if handled well | Effect if mishandled |
|---|---|---|---|
| "VC Due Diligence Call" | Any time | Compliance +15, Coins +200 | Compliance -10, Debt +10 |
| "TechCrunch Data Breach Article" | Privacy Debt > 60 | Compliance +10 if you respond publicly | Debt +20, Trust -20 |
| "User Rights Flash Mob" (100 simultaneous erasure requests) | Day 10+ | Compliance +20 if portal handles it | Debt +20, Trust -20 |
| "Officer Gupta Surprise Visit" | Any time | Compliance +10 if score > 70 | Debt +15 |
| "CEO WhatsApp Forward" (fake DPDP advice) | Day 5+ | Trust +5 if you correct it nicely | Trust -10 if you ignore it |
| "Rogue S3 Bucket" (new breach) | Any time | Compliance +20 if reported in time | Debt +25 |
| "New Hire Data Request" | Day 8+ | Compliance +5 if handled right | Trust -10 |
| "Zombie Account Complaint" (user gets re-marketing email after deletion) | Day 15+ | Debt -10 if you fix fast | Debt +20 |
| "Board Meeting — Compliance Report" | Day 20 | Compliance +15 if score > 75 | Compliance -5 |
| "Competitor Data Breach" (news) | Day 12+ | Use it to justify compliance budget to CEO | Missed opportunity |

---

## 9. SCREEN DESCRIPTIONS

### Screen 1: Main Menu
**Visual:** Dark background with a subtle animated grid (city outline). The IndiaScale logo glows at center. A countdown timer in the corner: "MeitY Audit: 30 Days."

**Elements:**
- Title: "DPDP SENTINEL QUEST" in glowing pixel font
- Subtitle: "India's Data Privacy Crisis — Can You Fix It?"
- Buttons: START GAME / HOW TO PLAY / LEADERBOARD / ABOUT DPDP ACT
- Background: Floating data packets drifting upward, occasional "PII LEAK" warning flashes
- Footer: "Based on the Digital Personal Data Protection Act 2023 & DPDP Rules 2025"

---

### Screen 2: Character Select
**Visual:** Three character cards with pixel art portraits

**Cards:**
- The Engineer (pixel art: person at laptop with code on screen)
- The Lawyer (pixel art: person holding thick binder)
- The Founder (pixel art: person on three phones simultaneously)

**Each card shows:** Starting stats as meters, a one-line personality description, a starting quirk

---

### Screen 3: The Hub World
**Visual:** Top-down pixel art city, slightly zoomed out to show 3–4 districts at once. Player character is visible in starting zone. NPCs wander their zones.

**HUD Elements (always visible):**
- Top bar: 🛡 Compliance | 💀 Privacy Debt | ⭐ Trust | 🪙 Coins
- Top right: DAY X / 30 | Current Grade
- Bottom right: Quest tracker (active quests + progress)
- Bottom left: Sentinel Device icon (click to open)
- When near NPC: "[E] Talk to Rakesh Sharma"

**District Label Overlay:** Each district has a small label floating above it. Locked districts show a padlock icon with unlock condition.

---

### Screen 4: Dialogue Panel
**Visual:** Lower third of screen. Dark panel with NPC name header, dialogue text (typewriter effect), and choice buttons.

**Elements:**
- NPC name + role in header (colored by NPC: Rakesh = red, Priya = green, Vikram = yellow, Anjali = purple, Gupta = orange)
- Dialogue body: typewriter effect, 2–3 sentences max per screen
- Choice buttons: 2–3 options in distinct rows, hover highlight
- At bottom: "Impact Preview" — small icons showing what score will change (only appears after 1st run as tutorial)
- SPACE to continue non-choice dialogue

---

### Screen 5: Mini-Game Screen (PII Radar)
**Visual:** Dark server room. A circular radar sweep in the center, with colored dots appearing on the scan.

**Elements:**
- Radar circle with sweep animation
- Blue dots = compliant data storage (properly encrypted, with policy)
- Red dots = violations (unencrypted PII, no retention policy)
- Yellow dots = uncertain (needs investigation — click to assess)
- Timer: how long the scan has been running
- Findings panel: list of what you've found so far
- "SCAN COMPLETE" button appears when all dots investigated

---

### Screen 6: DPDP Knowledge Base (Sentinel Device overlay)
**Visual:** A tablet overlay that slides in from the right. Dark theme, organized by section.

**Structure:**
- Quick reference cards for each DPDP section
- "Currently Relevant" section (shows sections relevant to active quest)
- Penalty calculator: enter violation type → shows maximum fine
- "Real Cases" panel: anonymized examples from Indian companies

---

### Screen 7: Notification Toast (Law Violation Pop-up)
**Visual:** Slides in from top-right. Red border for violations, green for successes.

**Structure:**
```
╔═══════════════════════════════════╗
║ ⚖️  DPDP Act Alert                ║
║                                   ║
║ [Message about what just happened]║
║                                   ║
║ 📌 Section 8(5) — Security Duty  ║
║ Fine: ₹250 Crore maximum          ║
╚═══════════════════════════════════╝
```

---

### Screen 8: End of Game — Compliance Scorecard
**Visual:** Full-screen certificate-style layout. Color-coded by grade.

**Sections:**
- Header: Grade + "MeitY Audit Verdict"
- Overall Compliance Score (animated counter)
- Section-by-section breakdown (which DPDP sections you passed/failed)
- Key decisions you made (the 5 most impactful)
- "In the real world, this would mean..." — real fine amount based on failures
- "What to fix first" — 3 actionable recommendations
- Share button: "I scored X on the DPDP Sentinel Quest. Can you beat me? #PrivacyChampion"
- Download: "Your DPDP Readiness Checklist" (PDF based on your performance)

---

## 10. FULL DIALOGUE SCRIPTS (INK)

*(The main.ink file in /assets/ink/ contains the full dialogue trees for all 5 NPCs with tag-based score tracking. Additional quest-specific .ink files will be created per quest.)*

### Tag System Reference
All Ink dialogue uses tags to trigger game events:
```
# compliance:+15      → Add 15 to compliance score
# compliance:-10      → Subtract 10 from compliance score  
# debt:+20            → Add 20 to privacy debt
# trust:+10           → Add 10 to trust rating
# coins:+100          → Add 100 privacy coins
# law:§8(5):Fine ₹250 Crore:Unencrypted S3 bucket exposed 50K users
# quest:q1_pii_hunt:complete    → Complete quest objective
# item:deletion_receipt:add     → Add item to inventory
# unlock:rbi_vault              → Unlock district
# event:breach_sprint:trigger   → Trigger timed event
```

---

## 11. PENALTY POP-UP CARDS

Pre-written pop-up cards for every DPDP section:

| Section | Trigger | Pop-up Message |
|---|---|---|
| §1 (Scope) | Wrong answer about server location | "DPDP applies because your USERS are in India — not because your servers are. AWS us-east-1 doesn't protect you. Fine: ₹50 Crore." |
| §4 (Lawful Basis) | Processing without consent | "You processed data without a lawful basis. Consent must be SPECIFIC — one checkbox doesn't cover all future uses. Fine: ₹250 Crore." |
| §5 (Notice) | Missing/incomplete notice | "Your privacy notice must be plain-language, accessible, and given BEFORE data collection. A 40-page PDF link doesn't count. Fine: ₹200 Crore." |
| §6 (Consent) | Dark pattern in consent | "Pre-ticked boxes are invalid consent under §6. Consent must be an unambiguous affirmative action. Fine: ₹250 Crore." |
| §6(5) (Withdrawal) | Withdrawal harder than consent | "Withdrawing consent must be as easy as giving it. If signup takes 3 taps, deletion must also take ≤3 taps. Fine: ₹250 Crore." |
| §8(5) (Security) | Unencrypted data found | "Reasonable security safeguards are required for ALL personal data. An unencrypted S3 bucket with 50,000 user records is the opposite. Fine: ₹250 Crore." |
| §8(6) (Breach Notification) | Late breach notification | "You must notify the Board within 72 hours of becoming aware of a breach. 'Investigating first' is not an exception. Fine: ₹200 Crore." |
| §9 (Children) | VPC violation | "Self-declaration age gates are legally insufficient under §9. Even WITH parental consent, behavioral tracking of children is prohibited. Fine: ₹200 Crore." |
| §10 (SDF) | Missing DPO | "As a likely Significant Data Fiduciary, you need an India-based DPO answerable to your Board. Not just a developer with a title. Fine: ₹150 Crore." |
| §13 (Erasure) | Soft-delete only | "Flipping `is_deleted=true` is NOT erasure under DPDP. You need permanent, cascading deletion across all systems including backups. Fine: ₹150 Crore." |
| §14 (Grievance) | No grievance mechanism | "A generic email inbox is not a grievance mechanism. You need a named officer, an SLA, and an escalation path to the Board. Fine: ₹50 Crore." |
| §15 (Nomination) | Missing nomination | "§15 gives every user the right to nominate someone to exercise their data rights after death/incapacity. This is unique to India's DPDP and almost nobody has built it." |
| Rule 7 (Breach) | Breach response failure | "Under Rule 7, breach notification must include: nature of breach, volume, consequences, steps taken, contact details. Your notification was missing 3 of 5 required fields." |
| Rule 8 (Zombie) | No retention policy | "You cannot store user data indefinitely. Inactive accounts must be notified and purged. 2.3 million zombie accounts = ₹150 Crore exposure." |
| Rule 12 (Cross-border) | No data flow map | "You must know where your data goes — including which SaaS tools transfer it abroad. Without a data flow map, you cannot assess cross-border compliance." |

---

## 12. GAME FLOW & ENDINGS

### Full Game Timeline
```
DAY 1-2:   Onboarding + Notice Quest → learn basics
DAY 3-4:   PII Hunt + Marketing Floor fixes
DAY 5-6:   Consent Manager + Safe Harbor Zone unlocks
DAY 7:     Side quests open
DAY 8:     *** BREACH EVENT (forced) — 72-hour countdown ***
DAY 10-12: Erasure + User Rights Portal quests
DAY 14-16: SDF Quest + Cloud Frontier
DAY 18-20: Zombie Accounts + Random events intensify
DAY 22-24: Random events peak / final prep
DAY 29:    Audit Plaza unlocks
DAY 30:    Final boss + ending
```

### The 6 Endings

#### ENDING S — "Privacy by Design" (Score 90–100)
Officer Gupta: *"In 30 years of public service, I have never written the words 'exceptional compliance' in an audit report. I am writing them today."*
Vikram gets a call from Softbank's India fund wanting to invest, specifically because of IndiaScale's DPDP posture. The game ends with the "Most Compliant Unicorn in India 🇮🇳" certificate animation.

#### ENDING A — "Passed Audit" (Score 80–89)
Officer Gupta: *"You have met the minimum requirements of the Act. Maintain this. Don't slide back."*
The VC confirms funding. Rakesh shakes your hand for the first time. Priya says she can finally sleep.

#### ENDING B — "Conditional Pass" (Score 65–79)
Officer Gupta: *"I am issuing a Conditional Clearance. You have 90 days to resolve 3 outstanding violations or face a formal inquiry."*
The VC issues a term sheet contingent on compliance certification. Anjali is still drafting documents.

#### ENDING C — "Warning Notice" (Score 50–64)
Officer Gupta: *"You have received a formal Warning Notice. Any further violations within 12 months will result in automatic inquiry and penalty proceedings."*
The VC pulls the term sheet. Vikram calls a "strategy session." Rakesh's Fine Counter shows ₹85 Crore potential exposure.

#### ENDING D — "Heavy Fine" (Score 30–49)
The Board issues a penalty of ₹47 Crore. Vikram faints. The media picks it up. IndiaScale is trending on Twitter for the wrong reasons.

#### ENDING F — "MeitY Shutdown" (Score 0–29 OR Privacy Debt hits 100)
*"This is what ₹250 Crore feels like."* The game shows a newspaper headline: "IndiaScale Faces Maximum DPDP Penalty." Final message: *"You can do better. Try again — this time with better data hygiene."*

### The Leaderboard
**"Most Compliant Unicorns in India"**
- Shows top scores globally
- Filters: by company size, by industry, by role
- Special badge for achieving S-rank on first attempt: "Privacy Champion — First Try"
- Special badge for §15 Nomination implementation: "Privacy by Design"
- Social sharing: Score card image + Twitter/LinkedIn one-click share

---

*Document Version 1.0 — Based on DPDP Act 2023 (No. 22 of 2023) and DPDP Rules 2025 (Draft). For educational purposes. Always consult a qualified privacy lawyer for actual compliance.*
