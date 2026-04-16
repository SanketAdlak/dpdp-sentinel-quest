import Phaser from 'phaser';
import { ScoreSystem } from '../systems/ScoreSystem';
import { GAME_WIDTH, GAME_HEIGHT, COLORS, FONT_UI } from '../constants';

// ─── Public interfaces ────────────────────────────────────────────────────────

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizConfig {
  stageTitle: string;
  stageSummary: string;
  questions: QuizQuestion[];
  onComplete: (score: number, total: number) => void;
}

// ─── Quiz data ────────────────────────────────────────────────────────────────

export const STAGE_QUIZZES: Record<string, Omit<QuizConfig, 'onComplete'>> = {
  q_stage1_hq: {
    stageTitle: 'Stage 1 Complete: What Are We Dealing With?',
    stageSummary:
      'You learned what personal data is, why it needs protection, and why consent matters.',
    questions: [
      {
        question:
          'Someone signs up for IndiaScale and provides their name, email, and phone number. Which counts as "personal data"?',
        options: [
          'All of them — name, email, and phone number',
          'Only government IDs like Aadhaar',
          'Only financial information like bank details',
        ],
        correctIndex: 0,
        explanation:
          'Any information that can identify a specific person — name, email, phone — is personal data under the DPDP Act 2023. You do not need a government ID for it to count.',
      },
      {
        question:
          'IndiaScale wants to send marketing emails to existing users. What must happen FIRST?',
        options: [
          'Users must actively agree to receive marketing emails',
          'Just add an unsubscribe link at the bottom of every email',
          'Email them and wait to see who complains',
        ],
        correctIndex: 0,
        explanation:
          'Consent must be freely given, specific, informed, and unambiguous. Sending emails and hoping no one objects is the opposite of consent — it is a violation.',
      },
      {
        question:
          'A company keeps user data "just in case we need it someday." Is this acceptable under the DPDP Act?',
        options: [
          'No — data should only be kept as long as needed for a specific, stated purpose',
          'Yes — storage is cheap and more data might be useful later',
          'Yes — having more data always means better service for users',
        ],
        correctIndex: 0,
        explanation:
          'The DPDP Act requires data minimization. Collecting or storing data beyond its stated purpose is a violation, regardless of storage cost.',
      },
    ],
  },

  q_stage2_server: {
    stageTitle: 'Stage 2 Complete: The Data Detective',
    stageSummary: 'You explored what data IndiaScale stores, and why security and sensitivity matter.',
    questions: [
      {
        question: 'IndiaScale stores Aadhaar numbers alongside purchase history. What is special about Aadhaar data?',
        options: [
          'It is "sensitive personal data" — it requires a higher standard of protection and explicit consent',
          'It is treated the same as any other personal data like name or email',
          'It only needs protection if the user specifically asks for it',
        ],
        correctIndex: 0,
        explanation:
          'Government ID numbers like Aadhaar are classified as sensitive personal data. They require explicit (opt-in) consent and stronger technical safeguards than regular personal data.',
      },
      {
        question: 'IndiaScale shares data with Freshdesk (a customer support tool). What must exist before sharing?',
        options: [
          'A written Data Processing Agreement that limits what Freshdesk can do with the data',
          'Nothing — once a user signs up, IndiaScale can share data with any business partner',
          'A verbal agreement confirmed in an email thread',
        ],
        correctIndex: 0,
        explanation:
          "The DPDP Act requires a formal contract (Data Processing Agreement) with every third party that handles personal data on your behalf. Without it, the data principal's rights cannot be guaranteed.",
      },
      {
        question: 'A security gap exposes user data for 6 hours before being fixed. What must IndiaScale do?',
        options: [
          'Report the breach to the Data Protection Board within 72 hours',
          'Fix the gap quietly — no reporting is needed if it\'s fixed quickly',
          'Notify only the affected users, not the government',
        ],
        correctIndex: 0,
        explanation:
          'Any breach of personal data must be reported to the Data Protection Board within 72 hours, regardless of how quickly it was fixed or how many users were affected.',
      },
    ],
  },

  q_stage3_legal: {
    stageTitle: 'Stage 3 Complete: Users Have Rights',
    stageSummary: 'You learned the rights users have over their personal data — and what companies must do to honour them.',
    questions: [
      {
        question: 'A user asks IndiaScale to delete all their personal data. What should happen?',
        options: [
          'Delete personal details (name, email) but retain anonymized transaction records as required by law',
          'Delete absolutely everything — the user\'s right to erasure overrides all other laws',
          'Refuse the entire request because tax law means you cannot delete anything',
        ],
        correctIndex: 0,
        explanation:
          'The Right to Erasure is not absolute. Legal retention obligations (tax, audit, court orders) can override it. The correct approach is to erase what you can and anonymize what must be kept.',
      },
      {
        question: 'What is "pseudonymization"?',
        options: [
          'Replacing identifying fields (name, email) with a random code so records can be kept without identifying the person',
          'Encrypting data with a strong password so only authorized staff can read it',
          'Deleting personal data 90 days after the user\'s account is closed',
        ],
        correctIndex: 0,
        explanation:
          'Pseudonymization separates identity from data. Records still exist for analytical or legal purposes, but re-identification requires access to the mapping key, which is stored separately and securely.',
      },
      {
        question: 'Who should the Data Protection Officer (DPO) report to?',
        options: [
          'Directly to the Board of Directors — independently, bypassing the CEO and CTO',
          'The Chief Technology Officer, since data protection is a technical matter',
          'The marketing team, since they are the largest users of customer data',
        ],
        correctIndex: 0,
        explanation:
          'Independence is the cornerstone of an effective DPO. Reporting to the board prevents the DPO being overruled or silenced by operational leadership when raising compliance concerns.',
      },
    ],
  },

  q_stage4_deeper: {
    stageTitle: 'Stage 4 Complete: Consent, Children & Cross-Border',
    stageSummary:
      'You tackled bundled consent, children\'s data protections, and international data transfers.',
    questions: [
      {
        question:
          'A single checkbox says: "I agree to the terms of service, marketing emails, and sharing my data with partners." Is this valid consent?',
        options: [
          'No — each distinct purpose requires its own separate, specific consent',
          'Yes, as long as there is an unsubscribe link for marketing emails',
          'Yes, provided the checkbox is not pre-ticked by default',
        ],
        correctIndex: 0,
        explanation:
          'The DPDP Act requires consent to be specific and granular. Bundling unrelated purposes into one checkbox is not valid — users must be able to agree to each purpose independently.',
      },
      {
        question:
          'A 14-year-old wants to create an IndiaScale account. What is special about collecting their data?',
        options: [
          'A parent or guardian must give verifiable consent — the child\'s own agreement is not sufficient',
          'Treat them the same as adult users; anyone can give their own consent',
          'You cannot collect any data from anyone under 18 years old',
        ],
        correctIndex: 0,
        explanation:
          'The DPDP Act sets a higher bar for children\'s data. "Verifiable parental consent" is required, and companies must take reasonable steps to confirm the consenting adult is actually the child\'s guardian.',
      },
      {
        question:
          'IndiaScale uses analytics tools whose servers are in the United States. Do users need to be informed?',
        options: [
          'Yes — users should be informed when their data is transferred to servers in other countries',
          'No — it is purely a technical infrastructure detail that users need not know about',
          'Only if the US-based company suffers a data breach',
        ],
        correctIndex: 0,
        explanation:
          'Cross-border data transfers must be disclosed in the privacy notice. Users have a right to know where their data goes. The DPDP Act allows transfers only to countries approved by the Indian government.',
      },
    ],
  },
};

// ─── Layout constants (fixed — no dynamic text-height math) ──────────────────
// All Y values are relative to the panel center (container origin).

const PANEL_W = 800;
const PANEL_H = 580;
const HALF_H  = PANEL_H / 2;   // 290

// Fixed vertical zones (from panel top = -290)
const Y_HEADER_TOP    = -HALF_H;          // -290
const Y_HEADER_H      = 74;
const Y_SUMMARY_TOP   = Y_HEADER_TOP + Y_HEADER_H + 10;    // -206
const Y_DOTS          = Y_SUMMARY_TOP + 30;                 // -176
const Y_COUNTER       = Y_DOTS + 24;                        // -152
const Y_QUESTION_TOP  = Y_COUNTER + 18;                     // -134  (up to 60px → -74)
const Y_OPTIONS_TOP   = Y_QUESTION_TOP + 70;                // -64   (3 × 56px each)
const OPTION_H        = 52;
const OPTION_GAP      = 8;
const Y_DIVIDER       = Y_OPTIONS_TOP + 3 * (OPTION_H + OPTION_GAP) + 6;  // ≈ 122
const Y_EXPL_TOP      = Y_DIVIDER + 10;                     // ≈ 132  (≤ 66px → ≈ 198)
// Continue button always anchored 46px above panel bottom
const Y_CONT_CENTER   = HALF_H - 46;                        // 244

const BORDER_COLOR = 0x00ffcc;

const OPTION_COLORS = {
  default: { fill: 0x0d1e30, border: 0x2a4060, text: COLORS.TEXT_PRIMARY },
  correct: { fill: 0x0a2e1a, border: 0x00ff88, text: COLORS.TEXT_SUCCESS },
  wrong:   { fill: 0x2e0a0a, border: 0xff4444, text: COLORS.TEXT_DANGER },
} as const;

// ─── KnowledgeQuiz class ──────────────────────────────────────────────────────

export class KnowledgeQuiz {
  private scene: Phaser.Scene;

  // Persistent frame
  private overlay!: Phaser.GameObjects.Rectangle;
  private container!: Phaser.GameObjects.Container;

  // Per-question rebuilt elements — tracked so we can destroy them between questions
  private questionItems: Phaser.GameObjects.GameObject[] = [];

  // Dot graphics
  private dots: Phaser.GameObjects.Arc[] = [];

  // State
  private config!: QuizConfig;
  private currentIndex = 0;
  private score = 0;
  private answered = false;

  // Space key — registered once per Continue prompt, removed on advance
  private spaceKey: Phaser.Input.Keyboard.Key | null = null;
  private spaceHandler: (() => void) | null = null;

  // Scene-level pointer handler for click detection
  private activePointerHandler: ((p: Phaser.Input.Pointer) => void) | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  // ── Public API ──────────────────────────────────────────────────────────────

  show(config: QuizConfig): void {
    this.config = config;
    this.currentIndex = 0;
    this.score = 0;
    this.answered = false;
    this.questionItems = [];

    this.buildShell();
    this.buildDots();
    this.showQuestion();
    this.animateIn();
  }

  // ── Persistent frame ────────────────────────────────────────────────────────

  private buildShell(): void {
    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2;

    this.overlay = this.scene.add
      .rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.88)
      .setOrigin(0, 0).setScrollFactor(0).setDepth(499);

    this.container = this.scene.add
      .container(cx, cy).setScrollFactor(0).setDepth(500);

    // Panel bg + border
    const bg = this.scene.add
      .rectangle(0, 0, PANEL_W, PANEL_H, 0x060d1a, 1)
      .setStrokeStyle(2, BORDER_COLOR);

    // Header band
    const hBand = this.scene.add
      .rectangle(0, Y_HEADER_TOP, PANEL_W, Y_HEADER_H, 0x091828, 1)
      .setOrigin(0.5, 0);

    const titleText = this.scene.add
      .text(0, Y_HEADER_TOP + 12, this.config.stageTitle, {
        fontFamily: FONT_UI,
        fontSize: '18px',
        color: COLORS.TEXT_HIGHLIGHT,
        fontStyle: 'bold',
        align: 'center',
        wordWrap: { width: PANEL_W - 60 },
        resolution: 2,
      }).setOrigin(0.5, 0);

    const kbBadge = this.scene.add
      .text(0, Y_HEADER_TOP + 46, 'KNOWLEDGE  CHECK', {
        fontFamily: FONT_UI,
        fontSize: '11px',
        color: '#00ffcc',
        letterSpacing: 4,
        resolution: 2,
      }).setOrigin(0.5, 0);

    const hLine = this.scene.add.graphics();
    hLine.lineStyle(1, BORDER_COLOR, 0.4);
    hLine.lineBetween(-PANEL_W / 2, Y_HEADER_TOP + Y_HEADER_H,
                       PANEL_W / 2, Y_HEADER_TOP + Y_HEADER_H);

    const summaryText = this.scene.add
      .text(0, Y_SUMMARY_TOP, this.config.stageSummary, {
        fontFamily: FONT_UI,
        fontSize: '13px',
        color: COLORS.TEXT_SECONDARY,
        align: 'center',
        wordWrap: { width: PANEL_W - 80 },
        resolution: 2,
      }).setOrigin(0.5, 0);

    this.container.add([bg, hBand, titleText, kbBadge, hLine, summaryText]);
  }

  // ── Dot progress indicators (built once, updated each question) ─────────────

  private buildDots(): void {
    const total = this.config.questions.length;
    const DOT_R = 5;
    const GAP   = 18;
    const totalW = total * DOT_R * 2 + (total - 1) * (GAP - DOT_R * 2);
    const startX = -totalW / 2 + DOT_R;

    this.dots = [];
    for (let i = 0; i < total; i++) {
      const dot = this.scene.add.arc(startX + i * GAP, Y_DOTS, DOT_R, 0, 360, false, 0x334455);
      this.dots.push(dot);
      this.container.add(dot);
    }
    this.refreshDots();
  }

  private refreshDots(): void {
    this.dots.forEach((dot, i) => {
      if (i < this.currentIndex)      dot.setFillStyle(0x00ff88);
      else if (i === this.currentIndex) dot.setFillStyle(0x00ffcc);
      else                             dot.setFillStyle(0x334455);
    });
  }

  // ── Per-question screen ─────────────────────────────────────────────────────

  private showQuestion(): void {
    this.answered = false;
    this.clearSpace();

    // Destroy previous question elements
    this.questionItems.forEach(o => o.destroy());
    this.questionItems = [];

    this.refreshDots();

    const q     = this.config.questions[this.currentIndex];
    const total = this.config.questions.length;

    // Counter
    const counter = this.scene.add
      .text(0, Y_COUNTER, `Question ${this.currentIndex + 1} of ${total}`, {
        fontFamily: FONT_UI, fontSize: '12px', color: '#667788', resolution: 2,
      }).setOrigin(0.5, 0);

    // Question
    const qText = this.scene.add
      .text(0, Y_QUESTION_TOP, q.question, {
        fontFamily: FONT_UI,
        fontSize: '16px',
        color: COLORS.TEXT_PRIMARY,
        fontStyle: 'bold',
        align: 'center',
        wordWrap: { width: PANEL_W - 80 },
        resolution: 2,
      }).setOrigin(0.5, 0);

    this.container.add([counter, qText]);
    this.questionItems.push(counter, qText);

    // Option buttons — all at fixed Y positions, NOT inside sub-containers
    const OPTION_W = PANEL_W - 80;

    q.options.forEach((optLabel, idx) => {
      const optY = Y_OPTIONS_TOP + idx * (OPTION_H + OPTION_GAP);

      const optBg = this.scene.add
        .rectangle(0, optY, OPTION_W, OPTION_H, OPTION_COLORS.default.fill)
        .setStrokeStyle(1, OPTION_COLORS.default.border)
        .setOrigin(0.5, 0);

      const letter = String.fromCharCode(65 + idx);
      const prefix = this.scene.add
        .text(-OPTION_W / 2 + 16, optY + OPTION_H / 2, `${letter}.`, {
          fontFamily: FONT_UI, fontSize: '15px', color: '#00ffcc',
          fontStyle: 'bold', resolution: 2,
        }).setOrigin(0, 0.5);

      const labelTxt = this.scene.add
        .text(-OPTION_W / 2 + 42, optY + OPTION_H / 2, optLabel, {
          fontFamily: FONT_UI, fontSize: '14px', color: COLORS.TEXT_PRIMARY,
          wordWrap: { width: OPTION_W - 60 }, resolution: 2,
        }).setOrigin(0, 0.5);

      this.container.add([optBg, prefix, labelTxt]);
      this.questionItems.push(optBg, prefix, labelTxt);
    });

    // Register scene-level pointer handler for option clicks
    const CX = GAME_WIDTH / 2;
    const CY = GAME_HEIGHT / 2;
    const handler = (pointer: Phaser.Input.Pointer) => {
      if (this.answered) return;
      q.options.forEach((_, idx) => {
        const top = CY + Y_OPTIONS_TOP + idx * (OPTION_H + OPTION_GAP);
        if (pointer.x >= CX - OPTION_W / 2 && pointer.x <= CX + OPTION_W / 2 &&
            pointer.y >= top && pointer.y <= top + OPTION_H) {
          this.onAnswer(idx, q);
        }
      });
    };
    this.registerPointerHandler(handler);
  }

  private onAnswer(chosen: number, q: QuizQuestion): void {
    if (this.answered) return;
    this.answered = true;
    const correct = chosen === q.correctIndex;
    if (correct) this.score++;

    // Recolour all option backgrounds — find them by iterating questionItems
    // Option bgs are every 3rd item starting at index 2 (counter, qText, then triples)
    const optionStartIdx = 2;
    q.options.forEach((_, i) => {
      const bg  = this.questionItems[optionStartIdx + i * 3] as Phaser.GameObjects.Rectangle;
      const lbl = this.questionItems[optionStartIdx + i * 3 + 2] as Phaser.GameObjects.Text;
      bg.removeInteractive();
      if (i === q.correctIndex) {
        bg.setFillStyle(OPTION_COLORS.correct.fill).setStrokeStyle(2, OPTION_COLORS.correct.border);
        lbl.setColor(OPTION_COLORS.correct.text);
      } else if (i === chosen && !correct) {
        bg.setFillStyle(OPTION_COLORS.wrong.fill).setStrokeStyle(2, OPTION_COLORS.wrong.border);
        lbl.setColor(OPTION_COLORS.wrong.text);
      }
    });

    this.showExplanationAndContinue(q, correct);
  }

  // ── Explanation + Continue button (fixed positions, flat in container) ───────

  private showExplanationAndContinue(q: QuizQuestion, correct: boolean): void {
    const icon  = correct ? '✓  Correct!' : '✗  Incorrect';
    const color = correct ? COLORS.TEXT_SUCCESS : COLORS.TEXT_DANGER;

    const resultTxt = this.scene.add
      .text(0, Y_DIVIDER, icon, {
        fontFamily: FONT_UI, fontSize: '14px', color, fontStyle: 'bold', resolution: 2,
      }).setOrigin(0.5, 0);

    // Explanation — capped at 2 lines (clipped visually by panel boundary)
    const explTxt = this.scene.add
      .text(0, Y_EXPL_TOP, q.explanation, {
        fontFamily: FONT_UI, fontSize: '12px', color: COLORS.TEXT_SECONDARY,
        align: 'center', wordWrap: { width: PANEL_W - 80 }, resolution: 2,
      }).setOrigin(0.5, 0);

    // Continue button — ALWAYS at fixed Y_CONT_CENTER
    const CONT_W = 200;
    const CONT_H = 42;

    const contBg = this.scene.add
      .rectangle(0, Y_CONT_CENTER, CONT_W, CONT_H, 0x003322)
      .setStrokeStyle(2, BORDER_COLOR)
      .setOrigin(0.5, 0.5);

    const contLbl = this.scene.add
      .text(0, Y_CONT_CENTER, 'Continue  [Space]', {
        fontFamily: FONT_UI, fontSize: '14px', color: '#00ffcc', fontStyle: 'bold', resolution: 2,
      }).setOrigin(0.5, 0.5);

    this.container.add([resultTxt, explTxt, contBg, contLbl]);
    this.questionItems.push(resultTxt, explTxt, contBg, contLbl);

    // Register scene-level pointer handler for Continue button
    const CX = GAME_WIDTH / 2;
    const CY = GAME_HEIGHT / 2;
    const handler = (pointer: Phaser.Input.Pointer) => {
      if (pointer.x >= CX - 100 && pointer.x <= CX + 100 &&
          pointer.y >= CY + Y_CONT_CENTER - 21 && pointer.y <= CY + Y_CONT_CENTER + 21) {
        this.advance();
      }
    };
    this.registerPointerHandler(handler);

    this.registerSpace(() => this.advance());
  }

  private advance(): void {
    this.clearPointerHandler();
    this.clearSpace();
    this.currentIndex++;
    if (this.currentIndex < this.config.questions.length) {
      this.showQuestion();
    } else {
      this.showResult();
    }
  }

  // ── Result / score screen ───────────────────────────────────────────────────

  private showResult(): void {
    this.questionItems.forEach(o => o.destroy());
    this.questionItems = [];
    this.dots.forEach(d => d.destroy());
    this.dots = [];
    this.clearSpace();

    const total = this.score === this.config.questions.length
      ? this.config.questions.length
      : this.config.questions.length;
    const score = this.score;

    let coinsDelta = 0;
    let rewardMsg  = '';
    if (score === total)                         { coinsDelta = 50; rewardMsg = `Perfect score! +${coinsDelta} Privacy Coins awarded!`; }
    else if (score >= Math.ceil(total * 2 / 3)) { coinsDelta = 30; rewardMsg = `Good work! +${coinsDelta} Privacy Coins awarded.`; }
    else if (score >= 1)                         { coinsDelta = 10; rewardMsg = `Keep going! +${coinsDelta} Privacy Coins for the effort.`; }
    else                                         { rewardMsg = 'Review the stage conversations to understand the concepts better.'; }

    if (coinsDelta > 0) {
      ScoreSystem.applyDecision({
        id: `quiz_reward_${Date.now()}`,
        description: `Knowledge quiz: ${score}/${total} correct`,
        complianceDelta: 0, debtDelta: 0, trustDelta: 0, coinsDelta,
      });
    }

    const trophyEmoji = score === total ? '🏆' : score >= 1 ? '📋' : '📚';
    const scoreColor  = score === total ? COLORS.TEXT_SUCCESS
                      : score >= 1      ? COLORS.TEXT_HIGHLIGHT
                      : COLORS.TEXT_SECONDARY;

    const trophy = this.scene.add
      .text(0, -HALF_H + 120, trophyEmoji, { fontSize: '48px' })
      .setOrigin(0.5, 0);

    const scoreTxt = this.scene.add
      .text(0, -HALF_H + 178, `${score} / ${total}  Correct`, {
        fontFamily: FONT_UI, fontSize: '34px', color: scoreColor, fontStyle: 'bold', resolution: 2,
      }).setOrigin(0.5, 0);

    const rewardTxt = this.scene.add
      .text(0, -HALF_H + 226, rewardMsg, {
        fontFamily: FONT_UI, fontSize: '14px',
        color: coinsDelta > 0 ? '#00ffcc' : COLORS.TEXT_SECONDARY,
        align: 'center', wordWrap: { width: PANEL_W - 100 }, resolution: 2,
      }).setOrigin(0.5, 0);

    const divLine = this.scene.add.graphics();
    divLine.lineStyle(1, BORDER_COLOR, 0.3);
    divLine.lineBetween(-PANEL_W / 2 + 60, -HALF_H + 278, PANEL_W / 2 - 60, -HALF_H + 278);

    const gradeMsg = this.buildGradeMessage(score, total);
    const gradeTxt = this.scene.add
      .text(0, -HALF_H + 290, gradeMsg, {
        fontFamily: FONT_UI, fontSize: '13px', color: COLORS.TEXT_SECONDARY,
        align: 'center', wordWrap: { width: PANEL_W - 100 }, resolution: 2,
      }).setOrigin(0.5, 0);

    // Final Continue button
    const CONT_W = 240;
    const CONT_H = 46;
    const contBg = this.scene.add
      .rectangle(0, Y_CONT_CENTER, CONT_W, CONT_H, 0x003322)
      .setStrokeStyle(2, BORDER_COLOR)
      .setOrigin(0.5, 0.5);

    const contLbl = this.scene.add
      .text(0, Y_CONT_CENTER, 'Continue to Next Stage  [Space]', {
        fontFamily: FONT_UI, fontSize: '14px', color: '#00ffcc', fontStyle: 'bold', resolution: 2,
      }).setOrigin(0.5, 0.5);

    this.container.add([trophy, scoreTxt, rewardTxt, divLine, gradeTxt, contBg, contLbl]);
    this.questionItems.push(trophy, scoreTxt, rewardTxt, divLine, gradeTxt, contBg, contLbl);

    // Register scene-level pointer handler for the final Continue button
    const CX = GAME_WIDTH / 2;
    const CY = GAME_HEIGHT / 2;
    const handler = (pointer: Phaser.Input.Pointer) => {
      if (pointer.x >= CX - 120 && pointer.x <= CX + 120 &&
          pointer.y >= CY + Y_CONT_CENTER - 23 && pointer.y <= CY + Y_CONT_CENTER + 23) {
        this.dismiss(() => this.config.onComplete(score, total));
      }
    };
    this.registerPointerHandler(handler);

    this.registerSpace(() => this.dismiss(() => this.config.onComplete(score, total)));
  }

  private buildGradeMessage(score: number, total: number): string {
    if (score === total) return 'Outstanding! You have a thorough understanding of the DPDP Act 2023.';
    if (score >= Math.ceil(total * 2 / 3)) return 'Solid grasp of the fundamentals. Review the explanations to close the gaps.';
    if (score >= 1) return 'A good start! Re-read the stage dialogue and explanation texts before moving on.';
    return 'The DPDP Act has steep fines for violations — study each explanation carefully before continuing.';
  }

  // ── Pointer handler registration ─────────────────────────────────────────────

  private registerPointerHandler(fn: (p: Phaser.Input.Pointer) => void): void {
    this.clearPointerHandler();
    this.activePointerHandler = fn;
    this.scene.input.on('pointerdown', fn);
  }

  private clearPointerHandler(): void {
    if (this.activePointerHandler) {
      this.scene.input.off('pointerdown', this.activePointerHandler);
      this.activePointerHandler = null;
    }
  }

  // ── Space key registration ───────────────────────────────────────────────────

  private registerSpace(cb: () => void): void {
    this.clearSpace();
    this.spaceKey = this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.spaceHandler = () => cb();
    this.spaceKey.once('down', this.spaceHandler);
  }

  private clearSpace(): void {
    if (this.spaceKey && this.spaceHandler) {
      this.spaceKey.off('down', this.spaceHandler);
    }
    this.spaceKey = null;
    this.spaceHandler = null;
  }

  // ── Animate in / dismiss ────────────────────────────────────────────────────

  private animateIn(): void {
    this.container.setAlpha(0).setScale(0.92);
    this.overlay.setAlpha(0);
    this.scene.tweens.add({
      targets: this.container,
      alpha: 1, scaleX: 1, scaleY: 1,
      duration: 280, ease: 'Back.easeOut',
    });
    this.scene.tweens.add({
      targets: this.overlay,
      alpha: 0.88,
      duration: 220,
    });
  }

  private dismiss(onComplete: () => void): void {
    this.clearPointerHandler();
    this.clearSpace();
    this.scene.tweens.add({
      targets: [this.container, this.overlay],
      alpha: 0,
      duration: 220,
      ease: 'Power2.easeIn',
      onComplete: () => {
        this.container.destroy();
        this.overlay.destroy();
        this.questionItems = [];
        this.dots = [];
        onComplete();
      },
    });
  }
}
