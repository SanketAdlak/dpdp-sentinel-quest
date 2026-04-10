import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, SCENES, COLORS } from '../constants';
import { ScoreSystem } from '../systems/ScoreSystem';
import { QuestSystem } from '../systems/QuestSystem';
import { InventorySystem } from '../systems/InventorySystem';

// ─────────────────────────────────────────────────────────────────────────────
// Data types
// ─────────────────────────────────────────────────────────────────────────────

interface AuditChoice {
  text: string;
  compliance: number;
  debt: number;
  feedback: string;
  dpdpSection?: string;
  requiresEvidence?: string;   // evidence item ID that auto-boosts this choice
  evidenceBonus?: number;      // extra compliance if evidence present
}

interface AuditCharge {
  id: string;
  question: string;
  context: string;
  choices: AuditChoice[];
  usableEvidence?: string[];   // evidence IDs shown as clickable in this charge
}

interface AuditRound {
  title: string;
  subtitle: string;
  dpdpSection: string;
  charges: AuditCharge[];
}

// ─────────────────────────────────────────────────────────────────────────────
// The 3 rounds of the MeitY Tribunal
// ─────────────────────────────────────────────────────────────────────────────

const ROUNDS: AuditRound[] = [
  {
    title: 'ROUND 1',
    subtitle: 'Compliance Foundations',
    dpdpSection: '§5–6, §8, §10 — Notice, Consent, Fiduciary Obligations',
    charges: [
      {
        id: 'r1_notice',
        question: 'IndiaScale collects email, phone, DOB and UPI ID from 18 million users. Which categories require a §5 notice under DPDP Act 2023?',
        context: 'Officer Gupta slides a printout of IndiaScale\'s sign-up screen across the table.',
        usableEvidence: ['pii_scan_report', 'data_flow_map'],
        choices: [
          {
            text: 'Only sensitive personal data — UPI ID and DOB',
            compliance: -10, debt: 5,
            feedback: 'Incorrect. §5 requires notice for ALL personal data processed, not only sensitive categories.',
            dpdpSection: '§5 — Notice',
          },
          {
            text: 'All personal data — every category collected needs a §5 notice',
            compliance: 12, debt: 0,
            feedback: 'Correct. §5 mandates a notice for every category of personal data at or before collection.',
            dpdpSection: '§5 — Notice',
            evidenceBonus: 5,
            requiresEvidence: 'pii_scan_report',
          },
          {
            text: 'None — users agreed to our Terms of Service',
            compliance: -18, debt: 15,
            feedback: 'Wrong. Bundled ToS consent is explicitly invalid under §6(4). Dark patterns are prohibited.',
            dpdpSection: '§6(4) — Bundled Consent Void',
          },
        ],
      },
      {
        id: 'r1_withdrawal',
        question: 'A user opts out of marketing emails at 11:43 PM. IndiaScale queues the removal for the next weekly batch job (7 days later). Is this compliant?',
        context: 'A log screenshot shows the "marketing opt-out batch job" running every Sunday at 2 AM.',
        choices: [
          {
            text: 'Yes — weekly batching is standard practice and reasonable',
            compliance: -8, debt: 5,
            feedback: 'No. §7(3) requires consent withdrawal to be as easy as giving it and honored without delay.',
            dpdpSection: '§7(3) — Withdrawal Without Delay',
          },
          {
            text: 'No — withdrawal must be honored immediately or as soon as technically feasible',
            compliance: 10, debt: 0,
            feedback: 'Correct. Withdrawal must be acted upon without undue delay. 7-day queuing is unacceptable.',
            dpdpSection: '§7(3) — Withdrawal Without Delay',
          },
          {
            text: 'It depends — only if the user paid for a subscription',
            compliance: -5, debt: 3,
            feedback: 'Wrong. Consent rights are not conditional on payment status under DPDP.',
          },
        ],
      },
      {
        id: 'r1_sdf',
        question: 'IndiaScale serves 18M registered users across 12 states and processes behavioral data for its recommendation engine. Are you a Significant Data Fiduciary?',
        context: 'Gupta opens a Central Government gazette notification on the table.',
        usableEvidence: ['data_flow_map'],
        choices: [
          {
            text: 'Probably yes — volume + sensitivity + national impact criteria all apply',
            compliance: 8, debt: 0,
            feedback: 'Correct. §10 + Rule 10 use volume, sensitivity, national security and societal risk to classify SDF. You should self-assess and appoint a DPO.',
            dpdpSection: '§10, Rule 10 — SDF',
            evidenceBonus: 4,
            requiresEvidence: 'data_flow_map',
          },
          {
            text: 'No — only FAANG-scale companies qualify as SDF',
            compliance: -8, debt: 5,
            feedback: 'Wrong. The Government can classify any fiduciary as SDF based on criteria — scale alone is not the only factor.',
            dpdpSection: '§10 — Significant Data Fiduciary',
          },
          {
            text: 'We are not sure — we never read Rule 10',
            compliance: -3, debt: 0,
            feedback: 'Ignorance is not a defence. But honesty earns partial credit. File a self-assessment immediately.',
          },
        ],
      },
    ],
  },
  {
    title: 'ROUND 2',
    subtitle: 'User Rights',
    dpdpSection: '§11–15, Rule 8 — All Data Principal Rights',
    charges: [
      {
        id: 'r2_erasure',
        question: 'A journalist files a Right to Erasure request. You find their data in: main DB, S3 archive, Freshdesk tickets, Slack DMs, and RBI transaction logs. What is the correct action?',
        context: 'Gupta places a legal notice on the table. The clock shows T+18 hours since receipt.',
        usableEvidence: ['deletion_receipt'],
        choices: [
          {
            text: 'Delete from main DB and S3; leave Freshdesk and Slack as operational tools',
            compliance: -12, debt: 8,
            feedback: 'Partial compliance is non-compliance. All systems must be covered — including integrated SaaS tools.',
            dpdpSection: '§13 — Right to Erasure',
          },
          {
            text: 'Cascade delete all locations + pseudonymize RBI records (legal retention) + send deletion receipt',
            compliance: 18, debt: 0,
            feedback: 'Perfect. This is the complete response: cascade delete, pseudonymize where retention is legally required, and confirm completion.',
            dpdpSection: '§13, Rule 8 — Erasure + Retention',
            evidenceBonus: 8,
            requiresEvidence: 'deletion_receipt',
          },
          {
            text: 'Deny — journalists are public-interest exempt from erasure',
            compliance: -20, debt: 15,
            feedback: 'Wrong. The exemption applies to journalistic sources, not to the journalist as a Data Principal themselves.',
            dpdpSection: '§13 — Right to Erasure',
          },
        ],
      },
      {
        id: 'r2_access',
        question: 'A user submits a data access request under §11. Within what timeframe must IndiaScale respond?',
        context: 'Rule 12 of the DPDP Rules is projected on the wall behind Officer Gupta.',
        choices: [
          {
            text: '30 days from receipt of request',
            compliance: 8, debt: 0,
            feedback: 'Correct. Rule 12 specifies a 30-day response window for data access requests.',
            dpdpSection: 'Rule 12 — Data Access Timeline',
          },
          {
            text: '90 days — similar to Right to Information timelines',
            compliance: -5, debt: 3,
            feedback: 'Wrong. RTI timelines do not apply. DPDP Rule 12 sets a 30-day limit.',
            dpdpSection: 'Rule 12 — Data Access Timeline',
          },
          {
            text: 'There is no mandated timeline in the current Rules',
            compliance: -10, debt: 5,
            feedback: 'Incorrect. Rule 12 explicitly mandates the 30-day response window.',
          },
        ],
      },
      {
        id: 'r2_vpc',
        question: 'IndiaScale\'s app is used by 320,000 users under 18. Your current age gate is a checkbox: "I confirm I am above 18." Is this Verifiable Parental Consent?',
        context: 'A screenshot of IndiaScale\'s signup form — a single unchecked checkbox — is projected.',
        usableEvidence: ['vpc_flow'],
        choices: [
          {
            text: 'Yes — self-declaration is standard practice',
            compliance: -15, debt: 10,
            feedback: 'Completely wrong. §9 and Rule 5 require verifiable consent, not self-declaration by the child.',
            dpdpSection: '§9, Rule 5 — VPC',
          },
          {
            text: 'No — need government-ID verified parental consent via Digital Locker or equivalent',
            compliance: 15, debt: 0,
            feedback: 'Correct. VPC requires real identity verification of the parent — not just a checkbox.',
            dpdpSection: '§9, Rule 5 — Verifiable Parental Consent',
            evidenceBonus: 6,
            requiresEvidence: 'vpc_flow',
          },
          {
            text: 'Parent email confirmation is sufficient',
            compliance: -8, debt: 5,
            feedback: 'No — email is not verifiable identity. Government-issued ID verification is required.',
            dpdpSection: '§9, Rule 5 — VPC',
          },
        ],
      },
    ],
  },
  {
    title: 'ROUND 3',
    subtitle: 'Incident Response',
    dpdpSection: 'Rule 7 — Breach Notification, §22 — Voluntary Undertaking',
    charges: [
      {
        id: 'r3_timeline',
        question: 'At 9:00 AM, your S3 bucket is confirmed to have exposed 12,000 user records for 6 hours. When must you notify the Data Protection Board?',
        context: 'Gupta slides an incident timeline across the table. The breach was confirmed at T+0.',
        usableEvidence: ['pii_scan_report'],
        choices: [
          {
            text: 'Within 72 hours of becoming aware — and also notify affected users',
            compliance: 15, debt: 0,
            feedback: 'Correct. Rule 7 mandates Board notification within 72 hours and affected user notice without delay.',
            dpdpSection: 'Rule 7 — Breach Notification',
            evidenceBonus: 5,
            requiresEvidence: 'pii_scan_report',
          },
          {
            text: 'Within 30 days — we need time to assess impact first',
            compliance: -15, debt: 15,
            feedback: 'Wrong. 30 days is far beyond the 72-hour mandatory window. Delayed notification is itself a violation.',
            dpdpSection: 'Rule 7 — Breach Notification',
          },
          {
            text: 'Only if estimated damages exceed ₹10 Lakh',
            compliance: -20, debt: 20,
            feedback: 'Completely wrong. Notification is not conditional on financial threshold — any personal data breach triggers it.',
            dpdpSection: 'Rule 7 — Breach Notification',
          },
        ],
      },
      {
        id: 'r3_insider',
        question: 'Investigation reveals an employee downloaded 50,000 user records to a personal device before the S3 breach. What additional obligation does this trigger?',
        context: 'A DLP system log shows the download at 3:47 AM — two days before the external breach.',
        choices: [
          {
            text: 'This is an insider breach — report separately and immediately to the Board as a distinct incident',
            compliance: 12, debt: 0,
            feedback: 'Correct. An insider breach is a separate notifiable event. Both the external and internal incident must be reported.',
            dpdpSection: 'Rule 7 — Multiple Breach Events',
          },
          {
            text: 'Combine it with the S3 breach report — one incident, one notification',
            compliance: -5, debt: 3,
            feedback: 'Partial — they occurred separately and may have different timelines. Best practice: separate notifications.',
          },
          {
            text: 'Internal breaches are HR matters, not reportable data breaches',
            compliance: -15, debt: 10,
            feedback: 'Wrong. Any unauthorized access to personal data — internal or external — is a notifiable breach under DPDP.',
            dpdpSection: 'Rule 7 — Breach Notification',
          },
        ],
      },
      {
        id: 'r3_vcu',
        question: 'After reviewing all violations, the Board offers IndiaScale a Voluntary Undertaking under §22. What does this mean for IndiaScale?',
        context: 'Officer Gupta leans back. "Your score is borderline. We can proceed to adjudication... or you can offer an undertaking."',
        choices: [
          {
            text: 'Accept — a §22 Voluntary Commitment lets IndiaScale propose a reform plan instead of facing a formal order',
            compliance: 10, debt: -5,
            feedback: 'Correct. A Voluntary Undertaking under §22 allows you to commit to specific reforms — avoiding or reducing the formal penalty.',
            dpdpSection: '§22 — Voluntary Undertaking',
          },
          {
            text: 'Refuse — tribunals don\'t accept settlements in India',
            compliance: -8, debt: 5,
            feedback: 'Wrong. §22 explicitly creates the Voluntary Undertaking mechanism. Refusing it when offered is strategically poor.',
            dpdpSection: '§22 — Voluntary Undertaking',
          },
          {
            text: 'Counter-offer a lower fine — §22 is a fine negotiation tool',
            compliance: -5, debt: 2,
            feedback: 'Not quite. §22 is about committing to behavioural change, not negotiating fine amounts directly.',
            dpdpSection: '§22 — Voluntary Undertaking',
          },
        ],
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Endings
// ─────────────────────────────────────────────────────────────────────────────

interface Ending {
  grade: string;
  title: string;
  verdict: string;
  consequence: string;
  color: number;
  textColor: string;
}

function getEnding(compliance: number): Ending {
  if (compliance >= 90) return {
    grade: 'S',
    title: 'Privacy Champion',
    verdict: 'IndiaScale sets the gold standard for DPDP compliance in India.',
    consequence: 'Government issues a public commendation. No penalty. ₹500 Crore in new enterprise contracts.',
    color: 0x00ff88,
    textColor: '#00ff88',
  };
  if (compliance >= 80) return {
    grade: 'A',
    title: 'Compliant Founder',
    verdict: 'Full approval granted. Minor improvements noted in the audit report.',
    consequence: 'Audit passed. Annual review scheduled. No penalty.',
    color: 0x44ff88,
    textColor: '#44ff88',
  };
  if (compliance >= 70) return {
    grade: 'B',
    title: 'Voluntary Undertaking Accepted',
    verdict: 'IndiaScale demonstrates good-faith effort. §22 undertaking accepted.',
    consequence: '6-month reform plan accepted. ₹5 Crore administrative cost. Annual re-audit.',
    color: 0xffcc00,
    textColor: '#ffcc00',
  };
  if (compliance >= 60) return {
    grade: 'C',
    title: 'Warned But Walking',
    verdict: 'Significant violations found. Formal warning issued with corrective directions.',
    consequence: '₹10 Crore fine. 3-month improvement window. Non-compliance → ₹50 Crore.',
    color: 0xff8800,
    textColor: '#ff8800',
  };
  if (compliance >= 50) return {
    grade: 'D',
    title: 'Partial Business Freeze',
    verdict: 'Multiple systemic failures. IndiaScale cannot onboard new users until compliant.',
    consequence: '₹50 Crore fine. 6-month freeze on new user acquisition.',
    color: 0xff4444,
    textColor: '#ff4444',
  };
  return {
    grade: 'F',
    title: 'Enforcement Action',
    verdict: 'Egregious violations. The Board refers IndiaScale to the Adjudicating Officer.',
    consequence: '₹250 Crore fine. DPO faces personal liability. Criminal referral filed.',
    color: 0xff0000,
    textColor: '#ff4444',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Scene
// ─────────────────────────────────────────────────────────────────────────────

export class AuditPlazaScene extends Phaser.Scene {
  private roundIndex = 0;
  private chargeIndex = 0;
  private auditScore = 0;       // score earned within this scene

  private headerText!: Phaser.GameObjects.Text;
  private questionText!: Phaser.GameObjects.Text;
  private contextText!: Phaser.GameObjects.Text;
  private feedbackText!: Phaser.GameObjects.Text;
  private choiceButtons: Phaser.GameObjects.Container[] = [];
  private evidencePanelItems: Phaser.GameObjects.GameObject[] = [];
  private continueBtn!: Phaser.GameObjects.Container;
  private roundIndicators: Phaser.GameObjects.Rectangle[] = [];
  private scoreMeter!: Phaser.GameObjects.Rectangle;

  constructor() {
    super({ key: SCENES.AUDIT_PLAZA });
  }

  create(): void {
    this.roundIndex = 0;
    this.chargeIndex = 0;
    this.auditScore = 0;

    this.buildCourtroom();
    this.buildEvidencePanel();
    this.buildFeedbackPanel();
    this.buildContinueButton();
    this.buildRoundIndicators();
    this.showCharge();

    this.cameras.main.fadeIn(800, 0, 0, 0);
  }

  // ─── Layout ────────────────────────────────────────────────────────────────

  private buildCourtroom(): void {
    // Dark background
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x060810).setOrigin(0, 0);

    // Scanline overlay
    for (let y = 0; y < GAME_HEIGHT; y += 4) {
      this.add.rectangle(0, y, GAME_WIDTH, 1, 0x000000, 0.12).setOrigin(0, 0);
    }

    // Top bar — tribunal branding
    this.add.rectangle(0, 0, GAME_WIDTH, 56, 0x100508).setOrigin(0, 0);
    this.add.rectangle(0, 56, GAME_WIDTH, 2, 0xff3300, 1).setOrigin(0, 0);

    this.add.text(GAME_WIDTH / 2, 16, '⚖  DATA PROTECTION BOARD OF INDIA  •  MeitY TRIBUNAL  ⚖', {
      fontFamily: 'Courier New',
      fontSize: '13px',
      color: '#cc4422',
    }).setOrigin(0.5, 0);

    this.add.text(GAME_WIDTH / 2, 34, 'In the matter of: IndiaScale Technologies Pvt. Ltd.', {
      fontFamily: 'Courier New',
      fontSize: '10px',
      color: '#664433',
    }).setOrigin(0.5, 0);

    // Officer Gupta avatar area (left column)
    this.add.rectangle(0, 58, 200, GAME_HEIGHT - 58, 0x0c0810).setOrigin(0, 0);
    this.add.rectangle(200, 58, 1, GAME_HEIGHT - 58, 0x330011, 1).setOrigin(0, 0);

    // Gupta icon (generated)
    const g = this.make.graphics({ x: 0, y: 0 });
    g.fillStyle(0x2a1800, 1); g.fillRoundedRect(0, 0, 80, 80, 8);
    g.lineStyle(2, 0xff8800, 0.8); g.strokeRoundedRect(0, 0, 80, 80, 8);
    // Body
    g.fillStyle(0xff8800, 0.6); g.fillRect(20, 50, 40, 30);
    // Head
    g.fillStyle(0xffcc99, 1); g.fillRect(22, 18, 36, 34);
    // Eyes
    g.fillStyle(0x000000, 1); g.fillRect(28, 28, 5, 5); g.fillRect(47, 28, 5, 5);
    // Mouth
    g.fillStyle(0x663300, 1); g.fillRect(30, 40, 20, 3);
    g.generateTexture('gupta_avatar', 80, 80);
    g.destroy();

    this.add.image(60, 120, 'gupta_avatar').setDepth(10);
    this.add.text(100, 174, 'Officer Gupta', {
      fontFamily: 'Courier New', fontSize: '11px', color: '#ff8800',
    }).setOrigin(0.5);
    this.add.text(100, 188, 'MeitY • Adjudicating', {
      fontFamily: 'Courier New', fontSize: '9px', color: '#664433',
    }).setOrigin(0.5);

    // Audit score ticker (below avatar)
    this.add.text(18, 230, 'AUDIT', { fontFamily: 'Courier New', fontSize: '9px', color: '#664433' });
    this.add.text(18, 242, 'SCORE', { fontFamily: 'Courier New', fontSize: '9px', color: '#664433' });
    this.add.rectangle(18, 260, 164, 12, 0x1a0808).setOrigin(0, 0);
    this.scoreMeter = this.add.rectangle(18, 260, 0, 12, 0xff8800).setOrigin(0, 0);
    this.add.rectangle(18, 260, 164, 12, 0x000000, 0).setOrigin(0, 0)
      .setStrokeStyle(1, 0x441100);

    // Question area (center column)
    this.headerText = this.add.text(220, 72, '', {
      fontFamily: 'Courier New',
      fontSize: '10px',
      color: '#ff8800',
    });

    this.contextText = this.add.text(220, 92, '', {
      fontFamily: 'Courier New',
      fontSize: '11px',
      color: '#445566',
      wordWrap: { width: 760 },
      lineSpacing: 3,
    });

    this.questionText = this.add.text(220, 148, '', {
      fontFamily: 'Courier New',
      fontSize: '13px',
      color: COLORS.TEXT_PRIMARY,
      wordWrap: { width: 760 },
      lineSpacing: 5,
    }).setDepth(5);

    // Divider between question and choices
    this.add.rectangle(220, 270, 760, 1, 0x223344).setOrigin(0, 0);
  }

  private buildEvidencePanel(): void {
    // Right evidence panel
    const panelX = GAME_WIDTH - 210;
    this.add.rectangle(panelX, 58, 210, GAME_HEIGHT - 58, 0x060c10).setOrigin(0, 0);
    this.add.rectangle(panelX, 58, 1, GAME_HEIGHT - 58, 0x1a3344, 1).setOrigin(0, 0);

    this.add.text(panelX + 10, 68, '🗂  EVIDENCE VAULT', {
      fontFamily: 'Courier New', fontSize: '10px', color: '#334455',
    });
    this.add.rectangle(panelX + 10, 84, 188, 1, 0x1a3344).setOrigin(0, 0);
  }

  private buildFeedbackPanel(): void {
    // Feedback panel (bottom strip)
    this.add.rectangle(200, GAME_HEIGHT - 100, GAME_WIDTH - 410, 98, 0x0c0f14).setOrigin(0, 0);
    this.add.rectangle(200, GAME_HEIGHT - 102, GAME_WIDTH - 410, 2, 0x223344).setOrigin(0, 0);

    this.feedbackText = this.add.text(214, GAME_HEIGHT - 90, '', {
      fontFamily: 'Courier New',
      fontSize: '11px',
      color: '#aabbcc',
      wordWrap: { width: GAME_WIDTH - 440 },
      lineSpacing: 4,
    }).setDepth(5);
  }

  private buildContinueButton(): void {
    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT - 24;

    this.continueBtn = this.add.container(cx, cy).setDepth(20).setVisible(false);

    const bg = this.add.rectangle(0, 0, 200, 30, 0x112233)
      .setStrokeStyle(1, 0x334455)
      .setInteractive({ useHandCursor: true });

    const label = this.add.text(0, 0, '[ CONTINUE ]', {
      fontFamily: 'Courier New', fontSize: '12px', color: '#aabbcc',
    }).setOrigin(0.5);

    bg.on('pointerover', () => { bg.setFillStyle(0x1a3355); label.setColor('#ffffff'); });
    bg.on('pointerout', () => { bg.setFillStyle(0x112233); label.setColor('#aabbcc'); });
    bg.on('pointerdown', () => this.advance());

    // Space key also continues
    const space = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    space.on('down', () => { if (this.continueBtn.visible) this.advance(); });

    this.continueBtn.add([bg, label]);
  }

  private buildRoundIndicators(): void {
    // 3 round pips on left column
    for (let i = 0; i < 3; i++) {
      const r = this.add.rectangle(40 + i * 42, GAME_HEIGHT - 30, 36, 8, 0x1a1a1a)
        .setOrigin(0, 0.5);
      this.roundIndicators.push(r);
    }
  }

  // ─── Charge display ────────────────────────────────────────────────────────

  private showCharge(): void {
    this.clearChoices();
    this.clearEvidencePanelItems();
    this.feedbackText.setText('');
    this.continueBtn.setVisible(false);

    const round = ROUNDS[this.roundIndex];
    const charge = round.charges[this.chargeIndex];

    // Update header
    this.headerText.setText(
      `${round.title}: ${round.subtitle}  •  Charge ${this.chargeIndex + 1} of ${round.charges.length}`
    );
    this.contextText.setText(`"${charge.context}"`);
    this.questionText.setText(charge.question);

    // Update round indicator pips
    this.roundIndicators.forEach((r, i) => {
      r.setFillStyle(i < this.roundIndex ? 0x00ff88 : (i === this.roundIndex ? 0xff8800 : 0x1a1a1a));
    });

    // Show evidence items for this charge
    this.showEvidenceItems(charge.usableEvidence ?? []);

    // Build choice buttons
    this.buildChoices(charge.choices, charge);
  }

  private buildChoices(choices: AuditChoice[], charge: AuditCharge): void {
    const startY = 285;
    const choiceW = 756;

    choices.forEach((choice, i) => {
      const y = startY + i * 50;
      const container = this.add.container(220, y).setDepth(10);

      // Check if evidence is available for this choice
      const hasEvidence = choice.requiresEvidence
        ? InventorySystem.hasItem(choice.requiresEvidence)
        : false;

      const bgColor = hasEvidence ? 0x091a14 : 0x0d1220;
      const borderColor = hasEvidence ? 0x00aa55 : 0x223355;

      const bg = this.add.rectangle(0, 0, choiceW, 40, bgColor)
        .setOrigin(0, 0)
        .setStrokeStyle(1, borderColor)
        .setInteractive({ useHandCursor: true });

      const numLabel = this.add.text(10, 20, `${i + 1}.`, {
        fontFamily: 'Courier New', fontSize: '12px', color: '#445566',
      }).setOrigin(0, 0.5);

      const textLabel = this.add.text(28, 20, choice.text, {
        fontFamily: 'Courier New', fontSize: '12px', color: COLORS.TEXT_PRIMARY,
        wordWrap: { width: choiceW - 80 },
      }).setOrigin(0, 0.5);

      // Evidence badge
      if (hasEvidence && choice.requiresEvidence) {
        const badge = this.add.text(choiceW - 8, 20, `+${choice.evidenceBonus ?? 0} EVIDENCE`, {
          fontFamily: 'Courier New', fontSize: '9px', color: '#00ff88',
        }).setOrigin(1, 0.5);
        container.add(badge);
      }

      bg.on('pointerover', () => {
        bg.setFillStyle(hasEvidence ? 0x112a1e : 0x122040);
        bg.setStrokeStyle(1, hasEvidence ? 0x00ff88 : 0x4488ff);
        textLabel.setColor(COLORS.TEXT_HIGHLIGHT);
      });
      bg.on('pointerout', () => {
        bg.setFillStyle(bgColor);
        bg.setStrokeStyle(1, borderColor);
        textLabel.setColor(COLORS.TEXT_PRIMARY);
      });
      bg.on('pointerdown', () => this.resolveChoice(choice, charge));

      // Number key shortcut
      const numKey = this.input.keyboard!.addKey(`${i + 1}`);
      numKey.once('down', () => this.resolveChoice(choice, charge));

      container.add([bg, numLabel, textLabel]);
      this.choiceButtons.push(container);
    });
  }

  private resolveChoice(choice: AuditChoice, charge: AuditCharge): void {
    // Disable all choices
    this.clearChoices();

    // Calculate delta with evidence bonus
    let compDelta = choice.compliance;
    const hasEvidence = choice.requiresEvidence
      ? InventorySystem.hasItem(choice.requiresEvidence)
      : false;
    if (hasEvidence && choice.evidenceBonus) compDelta += choice.evidenceBonus;

    // Track for final verdict
    this.auditScore += compDelta;

    // Apply to ScoreSystem
    ScoreSystem.applyDecision({
      id: `audit-${charge.id}-${Date.now()}`,
      description: `Tribunal: ${charge.id}`,
      complianceDelta: compDelta,
      debtDelta: choice.debt,
      trustDelta: 0,
      coinsDelta: 0,
      dpdpSection: choice.dpdpSection,
    });

    // Update score meter
    const pct = Math.max(0, Math.min(100, ScoreSystem.getState().complianceScore));
    this.tweens.add({
      targets: this.scoreMeter,
      width: Math.round(164 * pct / 100),
      duration: 500,
      ease: 'Cubic.easeOut',
    });
    const meterColor = pct >= 70 ? 0x00ff88 : pct >= 50 ? 0xffcc00 : 0xff4444;
    this.scoreMeter.setFillStyle(meterColor);

    // Show feedback
    const isPositive = compDelta >= 0;
    const feedColor = isPositive ? COLORS.TEXT_SUCCESS : COLORS.TEXT_DANGER;
    const prefix = isPositive ? `✓  +${compDelta} Compliance` : `✗  ${compDelta} Compliance`;
    const lawTag = choice.dpdpSection ? `  [${choice.dpdpSection}]` : '';

    this.feedbackText.setText(`${prefix}${lawTag}\n${choice.feedback}`);
    this.feedbackText.setColor(isPositive ? '#aaffaa' : '#ffaaaa');

    // Flash effect
    const flashColor = isPositive ? 0x001a00 : 0x1a0000;
    const flash = this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, flashColor, 0.4)
      .setOrigin(0, 0).setDepth(50);
    this.tweens.add({
      targets: flash, alpha: 0, duration: 600,
      onComplete: () => flash.destroy(),
    });

    this.continueBtn.setVisible(true);
  }

  private advance(): void {
    const round = ROUNDS[this.roundIndex];
    this.chargeIndex++;

    if (this.chargeIndex < round.charges.length) {
      // Next charge in same round
      this.showCharge();
    } else {
      // Complete this round's objective in QuestSystem
      QuestSystem.completeObjective('q_m12_audit', `audit_round${this.roundIndex + 1}`);

      this.roundIndex++;
      this.chargeIndex = 0;

      if (this.roundIndex < ROUNDS.length) {
        // Animate round transition
        this.showRoundTransition(() => this.showCharge());
      } else {
        // All rounds done — show verdict
        this.showVerdict();
      }
    }
  }

  private showRoundTransition(onComplete: () => void): void {
    const round = ROUNDS[this.roundIndex];
    const overlay = this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0)
      .setOrigin(0, 0).setDepth(100);

    this.tweens.add({
      targets: overlay, alpha: 0.85, duration: 400, ease: 'Cubic.easeIn',
      onComplete: () => {
        const title = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 30, round.title, {
          fontFamily: 'Courier New', fontSize: '36px', color: '#ff8800',
        }).setOrigin(0.5).setDepth(110).setAlpha(0);

        const sub = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 14, round.subtitle, {
          fontFamily: 'Courier New', fontSize: '16px', color: '#aabbcc',
        }).setOrigin(0.5).setDepth(110).setAlpha(0);

        const section = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 36, round.dpdpSection, {
          fontFamily: 'Courier New', fontSize: '11px', color: '#445566',
        }).setOrigin(0.5).setDepth(110).setAlpha(0);

        this.tweens.add({
          targets: [title, sub, section], alpha: 1, duration: 400,
          onComplete: () => {
            this.time.delayedCall(1800, () => {
              this.tweens.add({
                targets: [overlay, title, sub, section], alpha: 0, duration: 400,
                onComplete: () => {
                  overlay.destroy(); title.destroy(); sub.destroy(); section.destroy();
                  onComplete();
                },
              });
            });
          },
        });
      },
    });
  }

  // ─── Evidence panel ────────────────────────────────────────────────────────

  private showEvidenceItems(relevantIds: string[]): void {
    this.clearEvidencePanelItems();
    const panelX = GAME_WIDTH - 200;
    let y = 92;

    const allItems = InventorySystem.getEvidenceItems();
    if (allItems.length === 0) {
      const none = this.add.text(panelX, y, 'No evidence collected.\nVisit PII Radar,\nComplete quests.', {
        fontFamily: 'Courier New', fontSize: '10px', color: '#223344', lineSpacing: 4,
      });
      this.evidencePanelItems.push(none);
      return;
    }

    allItems.forEach(item => {
      const isRelevant = relevantIds.includes(item.id);
      const color = isRelevant ? '#44cc88' : '#334455';
      const bgColor = isRelevant ? 0x091a12 : 0x0c0f14;

      const rowBg = this.add.rectangle(panelX - 10, y - 2, 198, 38, bgColor)
        .setOrigin(0, 0)
        .setStrokeStyle(1, isRelevant ? 0x225533 : 0x1a2a2a);

      const icon = this.add.text(panelX, y + 10, item.icon, {
        fontFamily: 'Courier New', fontSize: '14px',
      }).setOrigin(0, 0.5);

      const name = this.add.text(panelX + 22, y, item.name, {
        fontFamily: 'Courier New', fontSize: '10px', color,
        wordWrap: { width: 160 },
      });

      if (isRelevant) {
        const glow = this.add.text(panelX + 22, y + 16, '✓ relevant evidence', {
          fontFamily: 'Courier New', fontSize: '9px', color: '#225533',
        });
        this.evidencePanelItems.push(glow);
      }

      y += 46;
      this.evidencePanelItems.push(rowBg, icon, name);
    });
  }

  // ─── Verdict ───────────────────────────────────────────────────────────────

  private showVerdict(): void {
    // Complete the final quest
    QuestSystem.completeQuest('q_m12_audit');

    const state = ScoreSystem.getState();
    const ending = getEnding(state.complianceScore);

    // Full overlay
    const overlay = this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0)
      .setOrigin(0, 0).setDepth(200);

    this.tweens.add({
      targets: overlay, alpha: 0.95, duration: 800,
      onComplete: () => this.buildVerdictScreen(ending, state.complianceScore),
    });
  }

  private buildVerdictScreen(ending: Ending, compliance: number): void {
    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2;
    const depth = 210;

    // Background card
    const card = this.add.rectangle(cx, cy, 720, 440, 0x060c10)
      .setStrokeStyle(3, ending.color).setDepth(depth);

    // Grade (large)
    const gradeText = this.add.text(cx, cy - 170, ending.grade, {
      fontFamily: 'Courier New', fontSize: '80px', color: ending.textColor,
    }).setOrigin(0.5).setDepth(depth + 1).setAlpha(0);

    // Title
    const titleText = this.add.text(cx, cy - 90, ending.title.toUpperCase(), {
      fontFamily: 'Courier New', fontSize: '20px', color: ending.textColor,
    }).setOrigin(0.5).setDepth(depth + 1).setAlpha(0);

    // Divider
    this.add.rectangle(cx, cy - 64, 600, 1, ending.color, 0.6).setDepth(depth + 1);

    // Verdict text
    const verdictText = this.add.text(cx, cy - 38, ending.verdict, {
      fontFamily: 'Courier New', fontSize: '13px', color: '#aabbcc',
      wordWrap: { width: 620 }, align: 'center', lineSpacing: 4,
    }).setOrigin(0.5, 0).setDepth(depth + 1).setAlpha(0);

    // Consequence
    const consequenceText = this.add.text(cx, cy + 30, ending.consequence, {
      fontFamily: 'Courier New', fontSize: '12px', color: '#778899',
      wordWrap: { width: 620 }, align: 'center', lineSpacing: 4,
    }).setOrigin(0.5, 0).setDepth(depth + 1).setAlpha(0);

    // Final stats
    const statsText = this.add.text(cx, cy + 100,
      `Final Compliance: ${compliance}%   |   Grade: ${ending.grade}   |   Audit Score: ${this.auditScore > 0 ? '+' : ''}${this.auditScore}`,
      {
        fontFamily: 'Courier New', fontSize: '11px', color: '#445566',
      }).setOrigin(0.5).setDepth(depth + 1).setAlpha(0);

    // Grade reveal animation
    this.tweens.add({
      targets: gradeText,
      alpha: 1, scaleX: { from: 2, to: 1 }, scaleY: { from: 2, to: 1 },
      duration: 600, ease: 'Back.easeOut',
      onComplete: () => {
        this.tweens.add({
          targets: [titleText, verdictText, consequenceText, statsText],
          alpha: 1,
          duration: 500, delay: this.tweens.stagger(150, {}), ease: 'Cubic.easeOut',
          onComplete: () => this.buildReturnButton(cx, cy + 160, depth + 2),
        });
      },
    });
  }

  private buildReturnButton(cx: number, y: number, depth: number): void {
    const btn = this.add.container(cx, y).setDepth(depth).setAlpha(0);

    const bg = this.add.rectangle(0, 0, 260, 36, 0x112233)
      .setStrokeStyle(1, 0x334455)
      .setInteractive({ useHandCursor: true });

    const label = this.add.text(0, 0, '[ RETURN TO MAIN MENU ]', {
      fontFamily: 'Courier New', fontSize: '12px', color: '#aabbcc',
    }).setOrigin(0.5);

    bg.on('pointerover', () => { bg.setFillStyle(0x1a3355); label.setColor('#ffffff'); });
    bg.on('pointerout', () => { bg.setFillStyle(0x112233); label.setColor('#aabbcc'); });
    bg.on('pointerdown', () => {
      this.cameras.main.fadeOut(600, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.stop(SCENES.HUB_WORLD);
        this.scene.stop(SCENES.UI);
        this.scene.start(SCENES.MAIN_MENU);
      });
    });

    btn.add([bg, label]);

    this.tweens.add({ targets: btn, alpha: 1, duration: 400, ease: 'Cubic.easeOut' });
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────

  private clearChoices(): void {
    this.choiceButtons.forEach(c => c.destroy());
    this.choiceButtons = [];
    // Remove keyboard listeners to avoid stale handlers
    this.input.keyboard!.removeAllListeners();
    // Re-bind continue button space key
    const space = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    space.on('down', () => { if (this.continueBtn.visible) this.advance(); });
  }

  private clearEvidencePanelItems(): void {
    this.evidencePanelItems.forEach(o => o.destroy());
    this.evidencePanelItems = [];
  }
}
