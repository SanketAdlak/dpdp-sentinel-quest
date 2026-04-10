// DPDP Sentinel Quest — Master Ink Story
// Compile with: inklecate -o main.ink.json main.ink
// Place main.ink.json in /public/assets/ink/

VAR compliance_score = 20
VAR privacy_debt = 30
VAR trust_rating = 50

// ============================================================
// AUDITOR: Rakesh Sharma — First encounter
// ============================================================
=== auditor_intro ===
Rakesh Sharma adjusts his glasses and pulls out a thick folder.

Rakesh: Ah, the new Privacy Champion! Finally. Do you know IndiaScale's current compliance score under the DPDP Act 2023?

Rakesh: The Digital Personal Data Protection Act applies to every company that processes personal data of Indian citizens — that is you. And right now, you are in violation of at least four sections.

    + [It's fine, we're compliant enough.]
        Rakesh: Fine?! You have shadow PII in THREE S3 buckets, no Consent Manager registered, and your privacy notice has not been updated since 2021. Under Section 5 of the DPDP Act, a data principal MUST receive a notice BEFORE you process their data.
        # debt:15
        # law:Section 5 — Notice Requirement:Notice must be given before processing personal data.:₹200 Crore fine
        Rakesh: You have been collecting emails for 2 years without a valid notice. That alone is a reportable violation to the Data Protection Board.
        Rakesh: And if the Board finds wilful non-compliance, they can impose fines on individual officers — not just the company. That means YOU personally could face liability under Section 33.
        -> auditor_quest_offer
    + [I know it's bad. What do we fix first?]
        Rakesh: Good. At least you are honest. Start with your data map — you need to know WHERE all the PII lives before you can protect it. Section 8 of the DPDP Act requires you to maintain accuracy AND security of data. You cannot protect what you have not found.
        # compliance:5
        Rakesh: PII stands for Personally Identifiable Information — names, emails, phone numbers, Aadhaar, financial data. All of it is personal data under the Act. Even an IP address combined with a username can be personal data.
        -> auditor_quest_offer
    + [What exactly does the DPDP Act require?]
        Rakesh: The Digital Personal Data Protection Act 2023 came into force to protect Data Principals — that is your users. Every company processing personal data is a Data Fiduciary. You have five core obligations: lawful basis, notice, consent, security safeguards, and erasure rights.
        # compliance:5
        # coins:20
        Rakesh: Fail any of these and the Data Protection Board can fine you up to 250 Crore rupees per violation category. The Board has investigative powers — they can audit your systems directly.
        Rakesh: Additionally, under Section 10, if you are notified as a Significant Data Fiduciary, you must appoint a Data Protection Officer who reports directly to your Board. That DPO must be India-based and independently reachable by your users.
        -> auditor_quest_offer

= auditor_quest_offer
Rakesh: I will give you a priority list of violations. Fix them before the MeitY audit or I will be forced to file a report to the Data Protection Board.

Rakesh: The audit will cover: your privacy notice, consent mechanism, PII data mapping, breach notification procedures, user rights implementation, and your cross-border transfer documentation.

He hands you the DPDP Audit Checklist — a laminated card with 12 compliance items.
# item:audit_checklist:add
# quest:q_m1_onboarding:objective:talk_rakesh
# success:Rakesh Audit Checklist received

    + [What happens if we fail the audit?]
        -> auditor_violations_detail
    + [Start with the PII Hunt. Got it.]
        Rakesh: Use the F key when you are in the Server District to activate PII Radar. Find all shadow data stores before the sweep timer expires.
        -> END

= auditor_violations_detail
Rakesh: If the audit fails? Let me spell out the top five violations IndiaScale currently faces.

Rakesh: One — Notice Failure under Section 5. Your 2021 privacy notice does not disclose all the purposes for which you process data. Fine: up to 200 Crore rupees.

Rakesh: Two — Consent Dark Patterns under Section 6. Pre-ticked consent boxes, forced bundled consent, and confusing withdrawal flows are explicitly illegal. Fine: up to 150 Crore rupees.

Rakesh: Three — Security Safeguards under Section 8. That unencrypted S3 bucket alone qualifies as a prima facie breach of reasonable security standards. Fine: up to 250 Crore rupees.

Rakesh: Four — No DPO Appointment under Section 10. If IndiaScale is designated a Significant Data Fiduciary — which given your user base is likely — you need a Board-level DPO immediately. Fine: up to 150 Crore rupees.

Rakesh: Five — Breach Notification Failure under Rule 7. If a breach occurs and you do not notify the Data Protection Board within 72 hours, the penalty can reach 200 Crore rupees per incident.

Rakesh: That is 1,050 Crore rupees in potential fines — on top of reputational damage that no funding round can fix.

Rakesh: Start with the PII Hunt. The radar is in the Server District. Press F when you are inside.
-> END

// ============================================================
// DEV: Priya Singh — Tech perspective
// ============================================================
=== dev_intro ===
Priya Singh is typing furiously at her workstation, three browser tabs open simultaneously.

Priya: Oh thank god, someone who might actually understand what I am saying. The CEO wants me to add a "Remember Me" feature that stores the user's government ID in plaintext localStorage.

Priya: That means Aadhaar card numbers sitting unencrypted in every user's browser. Any XSS attack, any malware, and those IDs are leaked. It is not just bad practice — it is a DPDP Act violation.

    + [That's a massive DPDP violation. Refuse.]
        Priya: I KNOW! But he will not listen. Under Section 8(4) of the DPDP Act, we are required to implement "reasonable security safeguards" appropriate to the sensitivity of the data. Storing Aadhaar numbers in plaintext is the OPPOSITE of that.
        # compliance:10
        # trust:10
        # law:Section 8(4) — Security Safeguard:Personal data must be protected by reasonable security safeguards.:₹250 Crore fine
        Priya: Tell the CEO I have your backing. I will implement a proper encrypted server-side token instead. The user never sees their Aadhaar number after enrollment.
        Priya: Here are 50 Privacy Coins for being the first person in this company to say the right thing.
        # coins:50
        -> dev_pii_task
    + [Can we anonymize it somehow?]
        Priya: Pseudonymization! Yes, that is a valid approach — but be careful. Under the DPDP Act, pseudonymized data is STILL personal data unless the anonymization is truly irreversible and the key is destroyed. Just hashing Aadhaar numbers without destroying the key does not count as anonymization.
        # compliance:5
        # coins:25
        Priya: Let me propose a secure token approach instead — a random UUID linked server-side to the Aadhaar, with the Aadhaar stored encrypted at rest. That satisfies Section 8(4).
        -> dev_pii_task
    + [The CEO's the boss. Just implement it.]
        Priya: You are the Privacy Champion and you are telling me to store Aadhaar numbers in localStorage?!
        # debt:20
        # trust:-15
        # law:Section 8(4) — Security Safeguard:Inadequate security measures for sensitive personal data.:₹250 Crore fine
        Priya: I am putting this decision in writing. When the Data Protection Board comes knocking, this decision is on record — and on you.
        -> dev_pii_task

= dev_pii_task
Priya: Anyway — I found something while cleaning up old branches. There are CSV exports from 2022 sitting in our /exports S3 bucket. Unencrypted. With names, emails, and phone numbers of 50,000 users. No retention policy. No access logs.

Priya: Under Section 8(3) of the DPDP Act, personal data must not be retained beyond the purpose for which it was collected. These exports have no purpose anymore — they are pure liability.
# quest:q_m1_onboarding:objective:talk_priya

    + [Lock down the bucket immediately.]
        # compliance:10
        Priya: On it! And I will set up a 90-day auto-delete policy going forward. I will add the deletion confirmation to our evidence folder for the audit.
        -> dev_third_party
    + [Document it first, then delete.]
        # compliance:8
        # coins:15
        Priya: Smart. Create an audit trail first. Good compliance requires you to demonstrate you KNEW about an issue and ACTED on it. I will generate a deletion report with timestamps.
        -> dev_third_party
    + [What should I do about Mixpanel and Freshdesk?]
        -> dev_dpa_education

= dev_dpa_education
Priya: Great question — those two are a bigger problem than people realize. Both Mixpanel and Freshdesk are "Data Processors" under the DPDP Act. They process data ON BEHALF of IndiaScale.

Priya: Section 8(4) of the DPDP Act requires every Data Fiduciary to have a formal written contract with each Data Processor. This is called a Data Processing Agreement, or DPA.

Priya: A DPA must specify: what data is shared, for what purpose, for how long, what security measures the processor must follow, and what happens to the data when the contract ends.

Priya: Right now we have NO DPA with Freshdesk. That means every support ticket that contains a user's name, email, or phone number is an unlawful transfer to a third party — potentially worth 250 Crore rupees in fines.

Priya: Mixpanel is worse — they are processing behavioral data in the United States. That is a cross-border transfer under Rule 12. We need to verify that the US meets India's adequacy standard, or get explicit user consent for the transfer.

Priya: The fix: draft DPAs for both tools this week, add cross-border transfer disclosure to the privacy notice, and set up quarterly audits of what data each processor holds.

# compliance:8
# coins:20
-> dev_third_party

= dev_third_party
Priya: I will flag Freshdesk and Mixpanel for the DPA review queue. One step at a time.
-> END

// ============================================================
// CEO: Vikram Malhotra — Business vs Compliance tension
// ============================================================
=== ceo_intro ===
Vikram Malhotra is on three phones simultaneously, pacing the glass office.

Vikram: Ah, you. The compliance person. Listen — I need this new growth feature shipped by Friday. It auto-emails inactive users with their account data "to remind them we care." Marketing loves it.

Vikram: We would be pulling their email history, profile data, purchase records — all in one personalized re-engagement email. Great ROI, right?

    + [This violates Purpose Limitation — Section 6.]
        Vikram: Pur-pose Limi-ta-what now?

        Under Section 6 of the DPDP Act, you can only process personal data for the specific purpose the user originally consented to. If they signed up for shopping and did not consent to re-engagement campaigns using their full transaction history, this is an unlawful purpose extension.
        # compliance:15
        # law:Section 6 — Purpose Limitation:Data can only be processed for the purpose originally consented to.:₹150 Crore fine
        Vikram: Fine, fine. Can we at least send them a new consent form?

        + + [Yes — a proper re-consent flow with clear opt-in.]
            # compliance:10
            # coins:30
            Vikram: You are killing my growth metrics but okay. At least make the consent form look good.
            -> ceo_vc_audit
        + + [Just get their permission through the app first.]
            # compliance:8
            Vikram: One notification popup? Fine. Can it be pre-ticked by default?

            + + + [No. Pre-ticked consent is a dark pattern — Section 6(4).]
                # compliance:12
                # trust:10
                # law:Section 6(4) — Dark Patterns:Consent obtained through deceptive design is invalid under DPDP.:₹150 Crore fine
                Vikram: You are no fun. Fine, opt-in only. Happy?
                -> ceo_vc_audit
            + + + [Yes, pre-ticked is fine, users can uncheck it.]
                # debt:20
                # law:Section 6(4) — Dark Patterns:Pre-ticked consent boxes are explicitly invalid under DPDP Act.:₹150 Crore fine
                -> ceo_vc_audit

    + [Let me check with our lawyer first — this is complex.]
        # trust:5
        Vikram: Fine, but Friday is a hard deadline. Get me an answer by end of day.
        -> ceo_vc_audit

    + [What happens if we ignore compliance entirely?]
        Vikram: Good question, actually. Hypothetically.

        Ignore compliance entirely, and here is what happens. Year one: a user complaint reaches the Data Protection Board. They open an investigation. Year two: the Board conducts a site audit. They find the unencrypted S3 bucket, the missing DPAs, the dark pattern consent flows.

        The Board issues notices for each violation category. Maximum fine per category: 250 Crore rupees. Multiple categories means multiple fines. The total can exceed 1,000 Crore rupees.

        Beyond fines: the Board can ORDER us to stop processing personal data until we are compliant. That means shutting down our core product. Revenue goes to zero. The Series C investors pull out. The company folds.
        # debt:5
        # trust:-5
        Vikram: I did not realize it was that serious. Let us talk about the VC situation.
        -> ceo_vc_audit

= ceo_vc_audit
Vikram: Oh — also, our Series C VC just said their due diligence team flagged us for DPDP non-compliance. They are threatening to pull the term sheet unless we can show a compliance roadmap by next week.

Vikram: The term sheet is for 180 Crore rupees. The round values us at 1,200 Crore. We cannot lose this.

Vikram: Their legal team wants: a DPO appointment letter, a data flow map, a list of all third-party processors and DPAs, our breach notification policy, and our user rights portal URL. We have seven days.

    + [We are critical — but I have a 30-day plan.]
        # trust:15
        # compliance:5
        Vikram: Good. Send me a two-slide deck. I will handle the VC conversation — just give me the numbers.
        -> END
    + [We could face up to ₹250 Crore in fines if audited today.]
        Vikram: That is... more than our entire Series B valuation.
        # trust:10
        Vikram: What is the minimum spend to get us to a defensible position? Give me a number I can take to the board.
        -> END

// ============================================================
// LAWYER: Anjali Mehta — Legal deep dives
// ============================================================
=== lawyer_intro ===
Anjali Mehta is surrounded by printed DPDP Act texts, RBI circulars, and sticky notes covering every surface.

Anjali: You must be the new Privacy Champion. Good timing — I need to walk you through a regulatory conflict that has been keeping me up at night.

Anjali: We have a user — let us call her User A — who submitted a Right to Erasure request under Section 12 of the DPDP Act. She wants ALL her personal data deleted from IndiaScale's systems.

Anjali: The problem is a direct conflict between two laws.
# quest:q_m1_onboarding:objective:talk_anjali

    + [What is the conflict exactly?]
        Anjali: User A made 47 transactions on our platform. Under RBI's Payment Aggregator Guidelines, we are legally required to retain financial transaction records for 7 years. But DPDP Act Section 12 says we must delete upon a valid erasure request. These two legal obligations directly contradict each other.

        + + [Use pseudonymization — keep transaction records, remove identifying PII.]
            # compliance:20
            # coins:50
            Anjali: EXACTLY. This is the legally defensible answer. We retain the transaction amounts, dates, and internal transaction IDs — all of which RBI requires — but we REPLACE the user's name, email, phone, and PAN with an irreversible cryptographic hash. The key is then destroyed.
            # law:Section 12 — Right to Erasure:Erasure must be completed; legal conflicts resolved by data minimization and pseudonymization.:Correct approach avoids fine
            Anjali: The RBI record technically survives intact from a financial standpoint. The personal data does not. Both laws are satisfied. I will draft the legal memo now.
            -> lawyer_dpo
        + + [Just ignore the erasure request — RBI compliance comes first.]
            # debt:25
            # trust:-20
            # law:Section 12 — Right to Erasure:Ignoring a valid erasure request is a direct DPDP violation.:₹150 Crore fine
            Anjali: I cannot advise that and I will not. Ignoring a valid Section 12 request is a textbook violation. The user can escalate to the Data Protection Board within 30 days, and the Board can levy up to 150 Crore rupees for this specific offense.
            -> lawyer_dpo
        + + [Delete everything — we cannot risk DPDP non-compliance.]
            # compliance:5
            # debt:15
            Anjali: That creates a different problem — destroying RBI-mandated financial records could expose us to FEMA violations and potential criminal liability for our directors. There is a middle path — pseudonymization. Let me explain.
            -> lawyer_erasure_detail

= lawyer_erasure_detail
Anjali: Here is the step-by-step erasure process we need to follow for every Right to Erasure request.

Anjali: Step one — Verify the request. Confirm the requestor's identity. Under DPDP Rules, identity verification must be proportionate — do not ask for more data than needed to verify.

Anjali: Step two — Data mapping. Query every system for data linked to this user: main database, S3 buckets, third-party processors, analytics tools, backups, email marketing platforms, and CRM tools.

Anjali: Step three — Legal hold check. Flag records that cannot be deleted due to legal obligations: RBI records, GST records, court orders, active legal disputes.

Anjali: Step four — Execute deletion. Delete all records that are not under legal hold. For held records, pseudonymize: replace PII with a cryptographic hash, destroy the key.

Anjali: Step five — Notify sub-processors. Send deletion instructions to all Data Processors — Freshdesk, Mixpanel, AWS — so they cascade the deletion in their systems.

Anjali: Step six — Send confirmation. Within 30 days of receiving the request, send the user a deletion receipt confirming what was deleted, what was pseudonymized, and why.

Anjali: Step seven — Audit log. Maintain an internal record of the entire process for regulatory evidence. The Board may ask to see this during an audit.

# compliance:10
# coins:30
-> lawyer_dpo

= lawyer_dpo
Anjali: One more urgent matter. Have you appointed a Data Protection Officer yet?

    + [We do not have one — do we need one?]
        Anjali: It depends on your classification. Under Section 10 of the DPDP Act, companies designated as Significant Data Fiduciaries — based on volume of data processed, sensitivity, and national security implications — must appoint a DPO. Given IndiaScale's user base, you almost certainly qualify.

        Anjali: The DPO must be India-based and report directly to your Board of Directors — not to the CTO or CEO. The Board-level reporting is non-negotiable. It ensures the DPO has organizational independence to raise compliance concerns without fear of retaliation.

        Anjali: The DPO's contact information must appear in your privacy policy, your app settings, and be reachable by any user who wants to file a grievance. An email buried in footnotes does not count.
        # law:Section 10 — Significant Data Fiduciary:SDFs must appoint a DPO based in India who reports to the Board.:₹150 Crore fine for non-compliance

        + + [I will initiate the DPO appointment process immediately.]
            # compliance:15
            # coins:40
            Anjali: Good. The DPO must have an independent grievance redressal mechanism — users should be able to file complaints directly with the DPO. I will send you a template board resolution and DPO charter.
            -> END
        + + [We will address this after the audit.]
            # debt:10
            Anjali: That is what every company says. Until the audit reveals non-compliance and the Board issues a notice. The fine for non-appointment starts at 150 Crore rupees.
            -> END
    + [Yes — Priya, our Lead Developer, is listed as DPO.]
        Anjali: Is Priya a Board-level appointee? Does she have an independent grievance channel that users can access directly? Is her contact information in your Privacy Policy and app settings?
        + + [Yes, all of that is properly set up.]
            # compliance:10
            Anjali: Good. Make sure the DPO contact is prominently displayed — not buried in footnotes. The Board looks for accessibility of the grievance mechanism, and they will test it during the audit.
            -> END
        + + [Not exactly — she has the title but not the formal structure.]
            # debt:10
            # law:Section 10 — DPO Requirements:DPO must be independent, Board-appointed, with a formal grievance channel.:₹150 Crore fine
            Anjali: Then she is a developer with a title — not a DPO in the legal sense. We need to fix this before the audit. I will send you the requirements checklist and a board resolution template.
            -> END

// ============================================================
// MEITY: Officer Gupta — Surprise mini-audit
// ============================================================
=== meity_intro ===
An official-looking person in a white kurta approaches your workstation and places a Government of India identification card on the desk.

Officer Gupta: Namaskar. I am Officer Gupta from the Data Protection Board of India. We have received a complaint from a data principal regarding IndiaScale. I need to review three items: your Privacy Policy, your Consent Mechanism, and your Grievance Officer contact details.

    + [Here is our updated privacy policy — reviewed last week.]
        # compliance:10
        Officer Gupta: Hmm. This is technically acceptable as a document. But I notice your grievance mechanism requires users to email a generic support inbox with no SLA. Under Section 13 of the DPDP Act, grievance resolution must happen within a defined and published period. What is your current SLA?
        + + [48 hours for acknowledgement, 30 days for full resolution.]
            # compliance:15
            # coins:60
            Officer Gupta: That meets the standard. I will note this as a positive finding in my site visit report. However — please ensure the Grievance Officer's name and contact are directly accessible from your app, not just your website.
            -> gupta_consent_check
        + + [We do not have a defined SLA at this time.]
            # debt:15
            # law:Section 13 — Grievance Redressal:A formal grievance mechanism with published SLA is mandatory.:₹50 Crore fine
            Officer Gupta: This is non-compliant. I am issuing a formal notice. You have 30 days to establish and publish a grievance SLA before the Board files a formal report.
            -> gupta_consent_check

    + [Our policy is currently being updated — can you return next week?]
        # debt:20
        # trust:-20
        # law:Section 5 — Notice:A valid and accessible Privacy Notice is a baseline legal requirement.:₹200 Crore fine
        Officer Gupta: This is not acceptable. You are an active platform processing personal data of Indian citizens without an accessible privacy notice. That is a prima facie violation of Section 5. I am filing an interim report to the Board.
        -> gupta_consent_check

    + [Let me contact our Privacy Lawyer before responding formally.]
        # trust:5
        Officer Gupta: You have exactly 10 minutes. I will wait.
        -> gupta_consent_check

= gupta_consent_check
Officer Gupta: Now — show me your consent mechanism. Specifically: how do you obtain, record, and allow withdrawal of consent from data principals?

    + [We use a registered Consent Manager integrated with our app.]
        # compliance:20
        # coins:80
        Officer Gupta: Excellent. Under the DPDP Rules, Consent Managers must be registered with the Data Protection Board and maintain a verifiable consent record for each data principal. Is yours registered?
        + + [Yes — registration number is on file.]
            # compliance:15
            Officer Gupta: Very good. You are one of the few compliant platforms I have visited this quarter. I will reflect this positively in my report. Please keep your registration certificate accessible.
            -> gupta_summary
        + + [Not yet — the process is pending. We will complete it this week.]
            # compliance:5
            # debt:10
            Officer Gupta: Registration of Consent Managers is mandatory before deployment — not after. Operating an unregistered Consent Manager is still a violation. Complete registration within 7 days and send me confirmation.
            -> gupta_summary
    + [We use a consent checkbox on the signup form.]
        # debt:15
        Officer Gupta: Is this checkbox pre-ticked by default, or does the user actively select it?
        + + [The user must actively check it — no pre-ticking.]
            # compliance:5
            Officer Gupta: That is the minimum required standard. However, for a platform of your scale, the Board strongly recommends implementing a full Consent Manager that allows users to manage, modify, and withdraw consent for each processing purpose individually. A single signup checkbox is insufficient for multi-purpose processing.
            -> gupta_summary
        + + [It was pre-ticked, but we removed that last week.]
            # debt:20
            # law:Section 6 — Consent:Consent must be freely given, specific, informed, and unambiguous — pre-ticking violates all four conditions.:₹150 Crore fine
            Officer Gupta: I need to see the change logs with timestamps. Any personal data collected under a pre-ticked consent box was collected unlawfully. You may need to re-obtain consent from all users enrolled under the old mechanism.
            -> gupta_summary
    + [What about our biometric data collection?]
        Officer Gupta: Biometric data? Please explain immediately. Biometric data — fingerprints, facial recognition, iris scans, voice prints — is classified as Sensitive Personal Data under the DPDP Act and requires an even higher standard of care.
        Officer Gupta: For biometric data, you must have explicit, purpose-specific, freely revocable consent. You cannot bundle biometric consent with general terms of service. The data must be encrypted with state-of-the-art cryptography and stored only as long as strictly necessary.
        Officer Gupta: If you are collecting biometric data and have not notified the Board, that is a reportable incident. I will need a full technical breakdown of your biometric pipeline before I leave today.
        # debt:15
        # law:Section 8 — Sensitive Personal Data:Biometric data requires explicit separate consent and enhanced security safeguards.:₹250 Crore fine
        -> gupta_summary

= gupta_summary
Officer Gupta: Based on my review today, I will submit a compliance assessment score to the Board.

Officer Gupta: Positive findings: you have a privacy policy in place, you showed willingness to cooperate, and your team is responsive.

Officer Gupta: Areas requiring immediate action: your grievance mechanism SLA needs to be published, your Consent Manager registration must be completed, and your third-party processor agreements need verification.

Officer Gupta: I am giving IndiaScale a provisional compliance score of 35 out of 100 for today's visit. This is below the Board's threshold of 70 for "satisfactory" compliance.

Officer Gupta: I will return in 30 days for a follow-up inspection. If your score has not improved to at least 60, I will recommend formal enforcement proceedings. Good day.
# compliance:5
-> END
