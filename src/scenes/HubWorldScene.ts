import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, SCENES, EVENTS } from '../constants';
import { Player } from '../entities/Player';
import { NPC, NPCConfig } from '../entities/NPC';
import { HUD } from '../ui/HUD';
import { NotificationToast } from '../ui/NotificationToast';
import { ScoreSystem } from '../systems/ScoreSystem';
import { QuestSystem } from '../systems/QuestSystem';
import { ScoreSummary, ScoreSnapshot } from '../ui/ScoreSummary';
import { RoomBuilder } from '../world/RoomBuilder';
import { QuestArrow } from '../ui/QuestArrow';
import { SaveSystem } from '../systems/SaveSystem';

const NPC_CONFIGS: NPCConfig[] = [
  {
    id: 'auditor',
    name: 'Rakesh Sharma',
    role: 'Grumpy Auditor',
    spriteKey: 'npc_auditor',
    dialogue: 'auditor_intro',
    x: 200, y: 180,
  },
  {
    id: 'dev',
    name: 'Priya Singh',
    role: 'Lead Developer',
    spriteKey: 'npc_dev',
    dialogue: 'dev_intro',
    x: 808, y: 200,
  },
  {
    id: 'ceo',
    name: 'Vikram Malhotra',
    role: 'CEO / Founder',
    spriteKey: 'npc_ceo',
    dialogue: 'ceo_intro',
    x: 350, y: 300,
  },
  {
    id: 'lawyer',
    name: 'Anjali Mehta',
    role: 'Privacy Lawyer',
    spriteKey: 'npc_lawyer',
    dialogue: 'lawyer_intro',
    x: 200, y: 720,
  },
  {
    id: 'meity',
    name: 'Officer Gupta',
    role: 'MeitY Representative',
    spriteKey: 'npc_meity',
    dialogue: 'meity_intro',
    x: 808, y: 1200,
  },
];

// ── Day Events System ────────────────────────────────────────────────────────

interface DayEvent {
  day: number;
  id: string;
  title: string;
  message: string;
  type: 'breach' | 'complaint' | 'erasure' | 'regulatory' | 'vc' | 'internal' | 'warning';
  complianceDelta?: number;
  debtDelta?: number;
  trustDelta?: number;
  dpdpSection?: string;
  penalty?: string;
  startQuestId?: string;
  triggered?: boolean;
}

const DAY_EVENTS: DayEvent[] = [
  {
    day: 3,
    id: 'ev_complaint_day3',
    title: 'COMPLAINT FILED',
    message: 'User Priya Krishnamurthy has filed a complaint with the Data Protection Board. She alleges IndiaScale shared her contact details with 3 marketing partners without her consent. The Board has given you 15 days to respond.',
    type: 'complaint',
    debtDelta: 10,
    trustDelta: -5,
    dpdpSection: '§6 — Consent / §13 — Grievance Redressal',
    penalty: '₹50 Crore if unresolved',
    triggered: false,
  },
  {
    day: 6,
    id: 'ev_breach_day6',
    title: 'SECURITY BREACH DETECTED',
    message: 'CRITICAL: An automated scraper exploited an unsecured API endpoint and extracted 2,400 user records including names, emails, and partial Aadhaar numbers. The 72-hour notification clock has started.',
    type: 'breach',
    debtDelta: 20,
    trustDelta: -15,
    dpdpSection: 'Rule 7 — Breach Notification',
    penalty: '₹200 Crore if unreported within 72 hours',
    startQuestId: 'q_m6_breach',
    triggered: false,
  },
  {
    day: 10,
    id: 'ev_erasure_day10',
    title: 'ERASURE REQUEST: OVERDUE',
    message: 'Journalist Rahul Nair submitted a Right to Erasure request 10 days ago. IndiaScale has no deletion pipeline — the request is sitting unanswered. The 30-day response window is 33% expired.',
    type: 'erasure',
    debtDelta: 15,
    trustDelta: -10,
    dpdpSection: '§13 — Right to Erasure',
    penalty: '₹150 Crore + individual liability for DPO',
    triggered: false,
  },
  {
    day: 14,
    id: 'ev_techdebt_day14',
    title: 'TECHNICAL DEBT ALERT',
    message: 'Lead Dev Priya reports: the team has been asked to implement DPDP compliance features but the product backlog has 127 pending items. Privacy features keep getting deprioritized. 3 critical security patches are overdue by 60+ days.',
    type: 'internal',
    debtDelta: 10,
    dpdpSection: '§8 — Security Safeguards',
    triggered: false,
  },
  {
    day: 18,
    id: 'ev_spotcheck_day18',
    title: 'REGULATORY INSPECTION',
    message: 'Officer Gupta has arrived for an unannounced spot check. He has requested: (1) Your current Privacy Policy URL, (2) Your Consent Manager registration number, (3) Your Grievance Officer\'s contact details. You have 30 minutes.',
    type: 'regulatory',
    complianceDelta: 5,
    debtDelta: 10,
    dpdpSection: '§5 Notice, §6 Consent, §13 Grievance',
    penalty: '₹250 Crore if no documentation provided',
    triggered: false,
  },
  {
    day: 21,
    id: 'ev_vc_day21',
    title: 'SERIES C DUE DILIGENCE CRISIS',
    message: 'Sequoia\'s legal team has sent a 47-point DPDP compliance questionnaire as part of due diligence for the Series C. The CEO is threatening to fire the compliance team if the round falls through. You have 7 days to complete the assessment.',
    type: 'vc',
    trustDelta: -5,
    complianceDelta: 0,
    triggered: false,
  },
  {
    day: 24,
    id: 'ev_insider_day24',
    title: 'INSIDER THREAT DISCOVERED',
    message: 'Security audit reveals a former employee downloaded 18,000 customer records to a personal Dropbox account before their exit 2 months ago. This is a separate breach that must be reported independently to the Board.',
    type: 'internal',
    debtDelta: 25,
    trustDelta: -20,
    dpdpSection: 'Rule 7 — Breach Notification (Insider Breach)',
    penalty: '₹200 Crore per unreported breach event',
    triggered: false,
  },
  {
    day: 27,
    id: 'ev_preaudit_day27',
    title: '3 DAYS TO AUDIT',
    message: 'The Data Protection Board has confirmed: your MeitY audit begins in 3 days. Officer Gupta will conduct a full systems audit. Prepare: Privacy Policy, Consent records, Deletion pipeline, Breach logs, DPO appointment letter, and Cross-border transfer documentation.',
    type: 'warning',
    complianceDelta: 0,
    dpdpSection: 'All Sections',
    triggered: false,
  },
];

export class HubWorldScene extends Phaser.Scene {
  private player!: Player;
  private npcs: NPC[] = [];
  private toast!: NotificationToast;
  private hud!: HUD;
  private dayTimer!: Phaser.Time.TimerEvent;
  private scoreBeforeDialogue: ScoreSnapshot | null = null;
  private currentDialogueNPC: { name: string; role: string } | null = null;
  private scoreSummary!: ScoreSummary;
  private roomBuilder!: RoomBuilder;
  private questArrow!: QuestArrow;
  private talkedNPCs: Set<string> = new Set();

  constructor() {
    super({ key: SCENES.HUB_WORLD });
  }

  create(): void {
    this.buildWorld();
    this.spawnPlayer();

    // Grid movement: inject walkable-area + furniture collision check.
    // Physics colliders for walls are intentionally removed — grid movement
    // handles collision via canMoveTo before each tile step.
    this.setupGridCollision();

    this.addZoneTriggers();
    this.spawnNPCs();
    this.buildHUD();
    this.setupEventListeners();
    this.registerQuests();
    this.startDayCycle();

    // Quest arrow guide
    this.questArrow = new QuestArrow(this);

    this.cameras.main.fadeIn(600, 0, 0, 0);
    this.showWelcomeToast();
    this.showTutorialOverlay();

    // Try to restore from auto-save
    this.tryLoadAutoSave();
  }

  update(): void {
    this.player.update();
    this.checkNPCProximity();
    this.questArrow.update(this.player.x, this.player.y);
  }

  private buildWorld(): void {
    // Dark background for outside rooms
    this.add.rectangle(0, 0, 1728, 1440, 0x111122).setOrigin(0, 0);

    // Use RoomBuilder for all room/wall/furniture
    this.roomBuilder = new RoomBuilder(this);
    this.roomBuilder.build();

    // World bounds are set inside RoomBuilder.build(), but ensure cameras are also set
    this.physics.world.setBounds(0, 0, 1728, 1440);
    this.cameras.main.setBounds(0, 0, 1728, 1440);

    this.buildMinimap();
  }

  private buildMinimap(): void {
    const mmX = 8;
    const mmY = GAME_HEIGHT - 180;
    const mmW = 120;
    const mmH = 170;

    const mmBg = this.add.rectangle(mmX, mmY, mmW, mmH, 0x000000, 0.75)
      .setOrigin(0, 0).setScrollFactor(0).setDepth(60);
    void mmBg;

    const mmBorder = this.add.graphics().setScrollFactor(0).setDepth(61);
    mmBorder.lineStyle(1, 0x00ffcc, 0.8);
    mmBorder.strokeRect(mmX, mmY, mmW, mmH);

    this.add.text(mmX + 4, mmY + 3, 'ROOMS', {
      fontFamily: 'Courier New', fontSize: '8px', color: '#00ffcc',
    }).setScrollFactor(0).setDepth(62);

    const mmZones = [
      { label: 'HQ',       color: 0xC8A870 },
      { label: 'Server',   color: 0x4466AA },
      { label: 'RBI Vlt',  color: 0xAA8833 },
      { label: 'Legal',    color: 0x9977CC },
      { label: 'Mktg',     color: 0x44BB77 },
      { label: 'SafeHbr',  color: 0x77CC55 },
      { label: 'Cloud',    color: 0x5555BB },
      { label: 'Audit',    color: 0x882222 },
    ];

    const mmG = this.add.graphics().setScrollFactor(0).setDepth(62);
    mmZones.forEach((z, i) => {
      const ry = mmY + 16 + i * 18;
      mmG.fillStyle(z.color, 1);
      mmG.fillRect(mmX + 4, ry + 2, 12, 10);
      this.add.text(mmX + 20, ry + 2, z.label, {
        fontFamily: 'Courier New', fontSize: '8px', color: '#ffffff',
      }).setScrollFactor(0).setDepth(63);
    });
  }

  private spawnPlayer(): void {
    // Spawn at a grid-aligned position inside HQ room floor (32..480, 32..384)
    this.player = new Player(this, 192, 192);
    this.cameras.main.startFollow(this.player, true, 0.15, 0.15);
    this.cameras.main.setDeadzone(80, 60);
  }

  /**
   * Sets up the grid-movement collision callback on the player.
   * The callback checks two things:
   *   1. Is the target tile inside a walkable area (room floor, door gap, or corridor)?
   *   2. Does the target overlap any furniture physics body?
   */
  private setupGridCollision(): void {
    const walkable = this.roomBuilder.getWalkableRects();
    const furnitureChildren = this.roomBuilder.furnitureGroup.getChildren();

    this.player.setCollisionCallback((tx: number, ty: number) => {
      // ── World-bounds guard ────────────────────────────────────────────────
      if (tx < 0 || tx > 1727 || ty < 0 || ty > 1439) return false;

      // ── Walkable-area check ───────────────────────────────────────────────
      // The player sprite center (tx, ty) must lie inside at least one
      // walkable rect (room inner floor, door gap, or corridor).
      const inWalkable = walkable.some(
        r => tx >= r.x && tx < r.x + r.w && ty >= r.y && ty < r.y + r.h
      );
      if (!inWalkable) return false;

      // ── Furniture body check ──────────────────────────────────────────────
      // Player hitbox at target: body top-left = (tx-10, ty), size = 20×24
      for (const child of furnitureChildren) {
        const b = (child as Phaser.Physics.Arcade.Sprite)
          .body as Phaser.Physics.Arcade.StaticBody;
        if (b && b.enable) {
          // Overlap test (strict — touching edges are NOT overlapping)
          if (
            tx - 10 < b.x + b.width  &&
            tx + 10 > b.x            &&
            ty      < b.y + b.height &&
            ty + 24 > b.y
          ) {
            return false;
          }
        }
      }

      return true;
    });
  }

  private addZoneTriggers(): void {
    // ── Server District ── PII Radar mini-game
    // Inner floor: (640, 32) to (1088, 384), center = (864, 208), size = 448 x 352
    const serverZone = this.add.zone(864, 208, 448, 352).setDepth(0);
    this.physics.world.enable(serverZone);

    const serverLabel = this.add.text(640 + 16, 32 + 50, '[ F ] PII Radar Scan', {
      fontFamily: 'Courier New', fontSize: '11px', color: '#0066aa',
    }).setVisible(false);

    this.physics.add.overlap(this.player, serverZone, () => {
      if (!serverLabel.visible) {
        serverLabel.setVisible(true);
        this.time.delayedCall(3000, () => serverLabel.setVisible(false));
      }
    });

    const fKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    fKey.on('down', () => {
      const inServerZone = Phaser.Geom.Rectangle.Contains(
        new Phaser.Geom.Rectangle(640, 32, 448, 352),
        this.player.x, this.player.y
      );
      if (inServerZone) this.launchPIIRadar();
    });

    // ── Audit Plaza ── Final boss entry
    // Inner floor: (640, 1056) to (1088, 1408), center = (864, 1232), size = 448 x 352
    const auditZone = this.add.zone(864, 1232, 448, 352).setDepth(0);
    this.physics.world.enable(auditZone);

    const auditLabel = this.add.text(640 + 16, 1056 + 50, '[ ENTER ] Enter MeitY Tribunal', {
      fontFamily: 'Courier New', fontSize: '11px', color: '#ff4400',
    }).setVisible(false);

    this.physics.add.overlap(this.player, auditZone, () => {
      const auditQuest = QuestSystem.getQuest('q_m12_audit');
      if (auditQuest?.status === 'active' && !auditLabel.visible) {
        auditLabel.setVisible(true);
        this.time.delayedCall(4000, () => auditLabel.setVisible(false));
      }
    });

    const enterKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    enterKey.on('down', () => {
      const inAuditZone = Phaser.Geom.Rectangle.Contains(
        new Phaser.Geom.Rectangle(640, 1056, 448, 352),
        this.player.x, this.player.y
      );
      const auditQuest = QuestSystem.getQuest('q_m12_audit');
      if (inAuditZone && auditQuest?.status === 'active') {
        this.launchAuditPlaza();
      }
    });

    // P key = manual save
    const saveKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    saveKey.on('down', () => {
      const ok = SaveSystem.save('slot1',
        Array.from(this.talkedNPCs),
        DAY_EVENTS.filter(ev => ev.triggered).map(ev => ev.id)
      );
      this.toast.show({
        type: ok ? 'success' : 'warning',
        message: ok ? 'Game saved! (Slot 1)' : 'Save failed — storage unavailable',
        duration: 2500,
      });
    });
  }

  launchPIIRadar(): void {
    this.scene.pause(SCENES.HUB_WORLD);
    this.scene.launch('PIIRadarScene');
  }

  launchAuditPlaza(): void {
    this.dayTimer?.destroy();
    this.cameras.main.fadeOut(600, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.stop(SCENES.UI);
      this.scene.start(SCENES.AUDIT_PLAZA);
    });
  }

  private spawnNPCs(): void {
    NPC_CONFIGS.forEach(config => {
      const npc = new NPC(this, config);
      this.npcs.push(npc);
    });
  }

  private buildHUD(): void {
    this.hud = new HUD(this);
    this.toast = new NotificationToast(this);
    this.scoreSummary = new ScoreSummary(this);
  }

  private checkNPCProximity(): void {
    let nearestNPC: NPC | null = null;
    let minDist = Infinity;

    for (const npc of this.npcs) {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, npc.x, npc.y);
      if (dist < minDist) {
        minDist = dist;
        nearestNPC = npc;
      }
      npc.checkPlayerProximity(this.player.x, this.player.y);
    }

    if (nearestNPC !== null && (nearestNPC as NPC).isNearPlayer()) {
      this.player.setNearNPC((nearestNPC as NPC).npcId);
    } else {
      this.player.setNearNPC(null);
    }
  }

  private setupEventListeners(): void {
    this.events.on('player-interact', (npcId: string) => {
      const npc = this.npcs.find(n => n.npcId === npcId);
      if (!npc) return;

      // If already talked to this NPC, show a greeting instead
      if (this.talkedNPCs.has(npcId)) {
        this.showNPCGreeting(npcId, npc.x, npc.y);
        return; // don't relaunch dialogue
      }

      // Snapshot score before dialogue
      const state = ScoreSystem.getState();
      this.scoreBeforeDialogue = {
        complianceScore: state.complianceScore,
        privacyDebt: state.privacyDebt,
        trustRating: state.trustRating,
        privacyCoins: state.privacyCoins,
      };
      this.currentDialogueNPC = { name: npc.npcName, role: npc.dialogueKnot };

      this.player.setInteracting(true);
      this.scene.launch(SCENES.DIALOGUE, {
        npcId: npc.npcId,
        npcName: npc.npcName,
        dialogueKnot: npc.dialogueKnot,
        sourceScene: SCENES.HUB_WORLD,
      });
    });

    this.events.on(EVENTS.DIALOGUE_END, (npcId?: string) => {
      if (npcId) this.talkedNPCs.add(npcId);

      // Show score summary, then release player on dismiss
      const before = this.scoreBeforeDialogue;
      const npcInfo = this.currentDialogueNPC;
      if (before && npcInfo) {
        this.scoreSummary.show(
          npcInfo.name,
          npcInfo.role,
          before,
          () => {
            this.player.setInteracting(false);
          }
        );
      } else {
        this.player.setInteracting(false);
      }
      this.scoreBeforeDialogue = null;
      this.currentDialogueNPC = null;

      // Also handle quest objective completion from dialogue end
      if (npcId) {
        const objMap: Record<string, { questId: string; objId: string }> = {
          auditor: { questId: 'q_m1_onboarding', objId: 'talk_rakesh' },
          dev:     { questId: 'q_m1_onboarding', objId: 'talk_priya'  },
          lawyer:  { questId: 'q_m1_onboarding', objId: 'talk_anjali' },
        };
        const mapping = objMap[npcId];
        if (mapping) QuestSystem.completeObjective(mapping.questId, mapping.objId);
      }
    });

    this.game.events.on(EVENTS.SHOW_NOTIFICATION, (config: Parameters<NotificationToast['show']>[0]) => {
      this.toast.show(config);
    });

    ScoreSystem.on('change', () => {
      if (ScoreSystem.isGameOver()) this.triggerGameOver();
    });

    // Quest completion → toast + banner
    QuestSystem.on('quest-completed', (quest) => {
      this.showQuestCompleteBanner(quest.title, quest.rewardCompliance, quest.rewardCoins);
    });

    // Quest start → info toast
    QuestSystem.on('quest-started', (quest) => {
      this.toast.show({
        type: 'info',
        message: `New Quest: ${quest.title}\n${quest.description}`,
        dpdpSection: quest.dpdpSection,
        duration: 5000,
      });
    });

    // Objective completed → small toast
    QuestSystem.on('objective-completed', (quest, objectiveId) => {
      const obj = quest.objectives.find(o => o.id === objectiveId);
      if (obj) {
        this.toast.show({
          type: 'success',
          message: `Objective: ${obj.description}`,
          duration: 3000,
        });
      }
    });
  }

  private showQuestCompleteBanner(title: string, compliance: number, coins: number): void {
    const cx = GAME_WIDTH / 2;

    const container = this.add.container(cx, -80).setDepth(200).setScrollFactor(0);

    const bg = this.add.rectangle(0, 0, 480, 70, 0x001a00, 0.97)
      .setOrigin(0.5).setStrokeStyle(2, 0x00ff88);

    const titleText = this.add.text(0, -12, `QUEST COMPLETE`, {
      fontFamily: 'Courier New', fontSize: '11px', color: '#00ff88',
    }).setOrigin(0.5);

    const nameText = this.add.text(0, 6, title, {
      fontFamily: 'Courier New', fontSize: '15px', color: '#ffffff',
    }).setOrigin(0.5);

    const rewardText = this.add.text(0, 24, `+${compliance} Compliance   +${coins} Coins`, {
      fontFamily: 'Courier New', fontSize: '11px', color: '#aaffaa',
    }).setOrigin(0.5);

    container.add([bg, titleText, nameText, rewardText]);

    this.tweens.add({
      targets: container,
      y: 80,
      duration: 400,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.time.delayedCall(2500, () => {
          this.tweens.add({
            targets: container,
            y: -120,
            alpha: 0,
            duration: 400,
            ease: 'Back.easeIn',
            onComplete: () => container.destroy(),
          });
        });
      },
    });
  }

  private registerQuests(): void {
    QuestSystem.registerQuest({
      id: 'q_m1_onboarding',
      title: 'The Onboarding from Hell',
      description: "Understand the full scope of IndiaScale's DPDP violations.",
      dpdpSection: '§1–4 — Scope & Grounds for Processing',
      status: 'active',
      rewardCompliance: 10,
      rewardCoins: 100,
      rewardTrust: 10,
      penaltyDebt: 0,
      unlocks: ['marketing', 'q_m2_notice'],
      objectives: [
        { id: 'talk_rakesh', description: 'Get the violation list from Rakesh Sharma', completed: false },
        { id: 'talk_priya',  description: "Understand IndiaScale's data flows with Priya", completed: false },
        { id: 'talk_anjali', description: 'Assess legal exposure with Anjali Mehta', completed: false },
      ],
    });

    QuestSystem.registerQuest({
      id: 'q_m2_notice',
      title: 'Notice Me, Senpai',
      description: 'Overhaul the privacy notice and fix dark patterns in consent.',
      dpdpSection: '§5 Notice, §6 Consent',
      status: 'inactive',
      rewardCompliance: 20,
      rewardCoins: 150,
      rewardTrust: 10,
      penaltyDebt: 0,
      unlocks: ['legal', 'q_m3_pii_hunt'],
      objectives: [
        { id: 'find_notice',   description: 'Locate the current privacy notice', completed: false },
        { id: 'fix_notice',    description: 'Draft a plain-language compliant notice', completed: false },
        { id: 'fix_consent',   description: 'Replace pre-ticked consent with opt-in', completed: false },
        { id: 'dark_patterns', description: 'Identify and remove 3 dark patterns', completed: false },
      ],
    });

    QuestSystem.registerQuest({
      id: 'q_m3_pii_hunt',
      title: 'The PII Scavenger Hunt',
      description: "Find all hidden PII across IndiaScale's infrastructure.",
      dpdpSection: '§8 — Obligations of Data Fiduciary',
      status: 'inactive',
      rewardCompliance: 20,
      rewardCoins: 150,
      rewardTrust: 5,
      penaltyDebt: 0,
      unlocks: ['q_m4_consent_mgr'],
      objectives: [
        { id: 'find_s3',          description: 'Scan the S3 bucket exports for PII', completed: false },
        { id: 'find_slack',       description: 'Check Slack integration logs', completed: false },
        { id: 'find_csv',         description: 'Locate old CSV exports with user data', completed: false },
        { id: 'find_third_party', description: 'Audit third-party tools (Freshdesk, Mixpanel)', completed: false },
      ],
    });

    QuestSystem.registerQuest({
      id: 'q_m4_consent_mgr',
      title: 'Consent Manager, Assemble',
      description: 'Integrate a Consent Manager so users can manage all their consents.',
      dpdpSection: 'Rule 4 — Consent Manager',
      status: 'inactive',
      rewardCompliance: 20,
      rewardCoins: 200,
      rewardTrust: 15,
      penaltyDebt: 0,
      unlocks: ['safe_harbor', 'q_m5_children'],
      objectives: [
        { id: 'design_dashboard',  description: 'Design the consent dashboard UI', completed: false },
        { id: 'add_withdrawal',    description: 'Ensure withdrawal is as easy as consent', completed: false },
        { id: 'integrate_manager', description: 'Integrate or build Consent Manager', completed: false },
      ],
    });

    QuestSystem.registerQuest({
      id: 'q_m5_children',
      title: 'Children of the Algorithm',
      description: 'Fix age verification and implement Verifiable Parental Consent.',
      dpdpSection: "§9, Rule 5 — Children's Data & VPC",
      status: 'inactive',
      rewardCompliance: 25,
      rewardCoins: 200,
      rewardTrust: 10,
      penaltyDebt: 0,
      unlocks: ['q_m6_breach'],
      objectives: [
        { id: 'age_gate',       description: 'Replace self-declaration with real age verification', completed: false },
        { id: 'vpc_flow',       description: 'Build the Verifiable Parental Consent flow', completed: false },
        { id: 'child_features', description: 'Disable behavioral ads and dark patterns for children', completed: false },
      ],
    });

    QuestSystem.registerQuest({
      id: 'q_m6_breach',
      title: 'The 72-Hour Breach Sprint',
      description: 'A data breach! Notify the Board within 72 hours.',
      dpdpSection: 'Rule 7 — Breach Notification',
      status: 'inactive',
      rewardCompliance: 25,
      rewardCoins: 150,
      rewardTrust: 15,
      penaltyDebt: 30,
      unlocks: ['rbi_vault', 'q_m7_erasure'],
      objectives: [
        { id: 'confirm_breach',      description: 'Confirm scope — how many users affected?', completed: false },
        { id: 'notify_board',        description: 'Notify the Data Protection Board within 72hr', completed: false },
        { id: 'notify_users',        description: 'Send plain-language breach notice to users', completed: false },
        { id: 'notify_processors',   description: 'Notify all data sub-processors', completed: false },
        { id: 'rbi_conflict_breach', description: 'Resolve RBI transaction log conflict', completed: false },
      ],
    });

    QuestSystem.registerQuest({
      id: 'q_m7_erasure',
      title: 'The Erasure Paradox',
      description: "Handle a journalist's erasure request across all systems.",
      dpdpSection: '§13, Rule 8 — Right to Erasure',
      status: 'inactive',
      rewardCompliance: 25,
      rewardCoins: 200,
      rewardTrust: 10,
      penaltyDebt: 0,
      unlocks: ['q_m8_rights_portal'],
      objectives: [
        { id: 'map_data_stores',  description: "Map all systems containing this user's data", completed: false },
        { id: 'cascade_delete',   description: 'Execute cascading deletion across all systems', completed: false },
        { id: 'pseudonymize_rbi', description: 'Pseudonymize RBI transaction records (not delete)', completed: false },
        { id: 'deletion_receipt', description: 'Generate and send deletion receipt to user', completed: false },
      ],
    });

    QuestSystem.registerQuest({
      id: 'q_m8_rights_portal',
      title: 'Right There in Plain Sight',
      description: 'Build a Privacy Dashboard covering all 6 Data Principal rights.',
      dpdpSection: '§11–15 — All Data Principal Rights',
      status: 'inactive',
      rewardCompliance: 20,
      rewardCoins: 150,
      rewardTrust: 20,
      penaltyDebt: 0,
      unlocks: ['q_m9_sdf'],
      objectives: [
        { id: 'right_access',     description: 'Add data access / export feature', completed: false },
        { id: 'right_correction', description: 'Add data correction feature', completed: false },
        { id: 'right_erasure',    description: 'Add self-service erasure request', completed: false },
        { id: 'right_grievance',  description: 'Add grievance mechanism with SLA', completed: false },
        { id: 'right_nomination', description: 'Add Data Principal Nomination feature (§15)', completed: false },
        { id: 'right_withdrawal', description: 'Add consent withdrawal equal to consent giving', completed: false },
      ],
    });

    QuestSystem.registerQuest({
      id: 'q_m9_sdf',
      title: 'Significant or Not?',
      description: 'Assess if IndiaScale qualifies as a Significant Data Fiduciary.',
      dpdpSection: '§10, Rule 10 — SDF Obligations',
      status: 'inactive',
      rewardCompliance: 20,
      rewardCoins: 100,
      rewardTrust: 10,
      penaltyDebt: 0,
      unlocks: ['cloud_frontier', 'q_m10_cross_border'],
      objectives: [
        { id: 'sdf_assessment', description: 'Complete the SDF self-assessment questionnaire', completed: false },
        { id: 'appoint_dpo',    description: 'Appoint a Data Protection Officer', completed: false },
        { id: 'conduct_dpia',   description: 'Conduct a DPIA for the recommendation engine', completed: false },
        { id: 'schedule_audit', description: 'Schedule an independent data audit', completed: false },
      ],
    });

    QuestSystem.registerQuest({
      id: 'q_m10_cross_border',
      title: 'The Cloud Frontier',
      description: 'Map all cross-border data flows and build a migration plan.',
      dpdpSection: 'Rule 12 — Cross-Border Transfer',
      status: 'inactive',
      rewardCompliance: 15,
      rewardCoins: 100,
      rewardTrust: 5,
      penaltyDebt: 0,
      unlocks: ['q_m11_zombie'],
      objectives: [
        { id: 'data_flow_map',   description: 'Build a complete data flow map (all SaaS tools)', completed: false },
        { id: 'risk_assessment', description: 'Assess cross-border risk for each tool', completed: false },
        { id: 'migration_plan',  description: 'Create a data localization contingency plan', completed: false },
      ],
    });

    QuestSystem.registerQuest({
      id: 'q_m11_zombie',
      title: 'The Zombie Accounts Apocalypse',
      description: "Clean up 2.3M inactive accounts per Rule 8's retention rules.",
      dpdpSection: "Rule 8 — Storage Limitation / Zombie Accounts",
      status: 'inactive',
      rewardCompliance: 20,
      rewardCoins: 150,
      rewardTrust: 5,
      penaltyDebt: 0,
      unlocks: ['q_m12_audit'],
      objectives: [
        { id: 'define_inactive', description: 'Define the inactivity threshold (3 years)', completed: false },
        { id: 'send_notices',    description: 'Send re-confirmation notices to inactive users', completed: false },
        { id: 'execute_purge',   description: 'Execute batch deletion of non-responding accounts', completed: false },
      ],
    });

    QuestSystem.registerQuest({
      id: 'q_m12_audit',
      title: 'The MeitY Tribunal',
      description: 'Face the Data Protection Board in the final audit.',
      dpdpSection: 'All Sections — Final Synthesis',
      status: 'inactive',
      rewardCompliance: 30,
      rewardCoins: 500,
      rewardTrust: 30,
      penaltyDebt: 0,
      unlocks: [],
      objectives: [
        { id: 'audit_round1', description: 'Pass Round 1: Compliance Foundations', completed: false },
        { id: 'audit_round2', description: 'Pass Round 2: User Rights', completed: false },
        { id: 'audit_round3', description: 'Pass Round 3: Incident Response', completed: false },
      ],
    });

    // Start the first quest immediately
    QuestSystem.startQuest('q_m1_onboarding');
  }

  private startDayCycle(): void {
    // Every 60 seconds = 1 in-game day
    this.dayTimer = this.time.addEvent({
      delay: 60000,
      loop: true,
      callback: () => {
        ScoreSystem.advanceDay();
        const day = ScoreSystem.getState().inGameDay;

        // Auto-save on every day advance
        SaveSystem.autoSave(
          Array.from(this.talkedNPCs),
          DAY_EVENTS.filter(ev => ev.triggered).map(ev => ev.id)
        );
        this.showAutoSaveIndicator();

        this.toast.show({
          type: 'info',
          message: `Day ${day} begins. MeitY audit in ${30 - day} days.`,
          duration: 3000,
        });

        // Check for scripted day events
        DAY_EVENTS.filter(ev => ev.day === day && !ev.triggered).forEach(ev => {
          ev.triggered = true;
          this.showDayEvent(ev);
          // Apply score deltas
          if (ev.complianceDelta || ev.debtDelta || ev.trustDelta) {
            ScoreSystem.applyDecision({
              id: ev.id,
              description: ev.title,
              complianceDelta: ev.complianceDelta ?? 0,
              debtDelta: ev.debtDelta ?? 0,
              trustDelta: ev.trustDelta ?? 0,
              coinsDelta: 0,
              dpdpSection: ev.dpdpSection,
            });
          }
          // Start related quest
          if (ev.startQuestId) {
            QuestSystem.startQuest(ev.startQuestId);
          }
        });

        // Legacy day 8 breach event (kept for backward compatibility)
        if (day === 8) {
          this.triggerBreachEvent();
        }
        if (day >= 30) {
          this.triggerFinalAudit();
        }
      },
    });
  }

  private showDayEvent(event: DayEvent): void {
    const cx = GAME_WIDTH / 2;
    const panelW = 560;
    const panelH = event.penalty ? 220 : 190;

    // Choose panel color based on type
    const colorMap: Record<DayEvent['type'], number> = {
      breach:     0x330000,
      warning:    0x332200,
      complaint:  0x220e00,
      erasure:    0x1a1500,
      regulatory: 0x001233,
      vc:         0x101830,
      internal:   0x101010,
    };
    const borderMap: Record<DayEvent['type'], number> = {
      breach:     0xff0000,
      warning:    0xff8800,
      complaint:  0xff6600,
      erasure:    0xffaa00,
      regulatory: 0x4488ff,
      vc:         0x6688cc,
      internal:   0x888888,
    };

    const bgColor = colorMap[event.type];
    const borderColor = borderMap[event.type];

    // Red flash overlay for breach events
    if (event.type === 'breach') {
      const flash = this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0xff0000, 0.35)
        .setOrigin(0, 0).setDepth(290).setScrollFactor(0);
      this.tweens.add({
        targets: flash, alpha: 0, duration: 700, yoyo: true, repeat: 2,
        onComplete: () => flash.destroy(),
      });
    }

    // Build panel container (starts above screen, slides in)
    const panel = this.add.container(cx, -panelH).setDepth(295).setScrollFactor(0);

    const panelBg = this.add.rectangle(0, 0, panelW, panelH, bgColor, 0.97)
      .setOrigin(0.5).setStrokeStyle(2, borderColor);

    // Header bar
    const headerBg = this.add.rectangle(0, -panelH / 2 + 22, panelW, 44, borderColor, 0.25).setOrigin(0.5);

    const titleText = this.add.text(0, -panelH / 2 + 22, event.title, {
      fontFamily: 'Courier New', fontSize: '15px', color: '#ffffff', fontStyle: 'bold',
    }).setOrigin(0.5);

    const messageText = this.add.text(0, -panelH / 2 + 65, event.message, {
      fontFamily: 'Courier New', fontSize: '11px', color: '#dddddd',
      wordWrap: { width: panelW - 40 }, lineSpacing: 4,
      align: 'center',
    }).setOrigin(0.5, 0);

    const sectionY = panelH / 2 - (event.penalty ? 52 : 30);
    let sectionText: Phaser.GameObjects.Text | null = null;
    if (event.dpdpSection) {
      sectionText = this.add.text(0, sectionY, `DPDP: ${event.dpdpSection}`, {
        fontFamily: 'Courier New', fontSize: '10px', color: '#aabbff',
      }).setOrigin(0.5);
    }

    let penaltyText: Phaser.GameObjects.Text | null = null;
    if (event.penalty) {
      penaltyText = this.add.text(0, panelH / 2 - 28, `Fine: ${event.penalty}`, {
        fontFamily: 'Courier New', fontSize: '11px', color: '#ff6666', fontStyle: 'bold',
      }).setOrigin(0.5);
    }

    const items: Phaser.GameObjects.GameObject[] = [panelBg, headerBg, titleText, messageText];
    if (sectionText) items.push(sectionText);
    if (penaltyText) items.push(penaltyText);
    panel.add(items);

    // Slide in from top
    const targetY = 80 + panelH / 2;
    this.tweens.add({
      targets: panel,
      y: targetY,
      duration: 500,
      ease: 'Back.easeOut',
    });

    // Pulsing border for warning type
    if (event.type === 'warning') {
      this.tweens.add({
        targets: panelBg,
        alpha: 0.85,
        duration: 800,
        yoyo: true,
        repeat: -1,
      });
    }

    const dismiss = () => {
      this.tweens.add({
        targets: panel,
        y: -panelH - 20,
        alpha: 0,
        duration: 400,
        ease: 'Quad.easeIn',
        onComplete: () => panel.destroy(),
      });
      panel.removeInteractive();
    };

    // Click to dismiss
    panelBg.setInteractive({ useHandCursor: true });
    panelBg.on('pointerdown', dismiss);

    // Auto-dismiss after 12 seconds
    this.time.delayedCall(12000, () => {
      if (panel.active) dismiss();
    });
  }

  private showTutorialOverlay(): void {
    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2;
    const overlayW = 580;
    const overlayH = 380;

    // Full-screen dark backdrop (NOT inside container)
    const backdrop = this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.85)
      .setOrigin(0, 0).setDepth(498).setScrollFactor(0);

    const overlay = this.add.container(cx, cy)
      .setDepth(500)
      .setScrollFactor(0);

    // Fully opaque dark bg
    const bg = this.add.rectangle(0, 0, overlayW, overlayH, 0x0a1020, 1.0)
      .setOrigin(0.5)
      .setStrokeStyle(2, 0x00ffcc);

    const title = this.add.text(0, -overlayH / 2 + 26, 'WELCOME, PRIVACY CHAMPION', {
      fontFamily: 'Courier New',
      fontSize: '18px',
      color: '#ffdd44',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const mission = this.add.text(0, -overlayH / 2 + 58, 'You are the new Privacy Champion at IndiaScale.\nFix DPDP compliance before the MeitY audit in 30 days\nor face \u20B9250 Crore fines.', {
      fontFamily: 'Courier New',
      fontSize: '13px',
      color: '#ffffff',
      wordWrap: { width: 520 },
      align: 'center',
      lineSpacing: 4,
    }).setOrigin(0.5, 0);

    const controlsHeader = this.add.text(0, -overlayH / 2 + 116, 'CONTROLS', {
      fontFamily: 'Courier New',
      fontSize: '12px',
      color: '#00ffcc',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    const controlLines = [
      '[WASD] or [Arrows]   Move around IndiaScale HQ',
      '[E]                  Talk to NPCs when the ! bubble appears',
      '[SPACE]              Advance dialogue / Skip typewriter effect',
      '[1] [2] [3]          Select dialogue choices',
      '[F]                  Activate PII Radar Scan (in Server District)',
      '[ENTER]              Enter Audit Plaza when unlocked',
    ].join('\n');

    const controlsText = this.add.text(-overlayW / 2 + 30, -overlayH / 2 + 134, controlLines, {
      fontFamily: 'Courier New',
      fontSize: '12px',
      color: '#ffffff',
      lineSpacing: 8,
      wordWrap: { width: overlayW - 60 },
    });

    const hint = this.add.text(0, overlayH / 2 - 22, 'Click anywhere to dismiss', {
      fontFamily: 'Courier New',
      fontSize: '11px',
      color: '#667788',
    }).setOrigin(0.5);

    // Blinking dismiss hint
    this.tweens.add({ targets: hint, alpha: 0.3, duration: 700, yoyo: true, repeat: -1 });

    overlay.add([bg, title, mission, controlsHeader, controlsText, hint]);

    // Animate in
    overlay.setAlpha(0).setScale(0.9);
    backdrop.setAlpha(0);
    this.tweens.add({
      targets: [overlay],
      alpha: 1,
      scale: 1,
      duration: 300,
      ease: 'Back.easeOut',
    });
    this.tweens.add({
      targets: backdrop,
      alpha: 0.85,
      duration: 300,
    });

    const dismiss = () => {
      this.tweens.add({
        targets: overlay,
        alpha: 0,
        scale: 0.95,
        duration: 250,
        ease: 'Quad.easeIn',
        onComplete: () => overlay.destroy(),
      });
      this.tweens.add({
        targets: backdrop,
        alpha: 0,
        duration: 250,
        onComplete: () => backdrop.destroy(),
      });
      this.input.off('pointerdown', dismiss);
    };

    // Click backdrop or overlay to dismiss
    backdrop.setInteractive();
    backdrop.on('pointerdown', dismiss);
    this.input.once('pointerdown', dismiss);

    // Auto-dismiss after 10 seconds
    this.time.delayedCall(10000, () => {
      if (overlay.active) dismiss();
    });
  }

  private showWelcomeToast(): void {
    this.time.delayedCall(800, () => {
      this.toast.show({
        type: 'info',
        message: 'Welcome to IndiaScale. MeitY audit in 30 days. Fix our DPDP compliance — or face \u20B9250 Crore fines.',
        duration: 6000,
      });
    });

    this.time.delayedCall(3000, () => {
      this.toast.showLawViolation(
        'DPDP Act 2023 — Status Check',
        "IndiaScale currently has a Compliance Score of 20%. This is CRITICAL.",
        '\u20B9250 Crore max fine'
      );
    });
  }

  private triggerGameOver(): void {
    this.dayTimer?.destroy();
    this.cameras.main.fadeOut(600, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start(SCENES.MAIN_MENU);
    });
  }

  private triggerBreachEvent(): void {
    QuestSystem.startQuest('q_m6_breach');

    this.toast.show({
      type: 'warning',
      message: 'BREACH ALERT: S3 bucket exposed 12,000 user records for 6 hours. The 72-hour clock is ticking.',
      dpdpSection: 'Rule 7 — Breach Notification',
      penalty: '\u20B9200 Crore if unreported',
      duration: 10000,
    });

    const flash = this.add.rectangle(0, 0, GAME_WIDTH * 2, GAME_HEIGHT * 2, 0xff0000, 0.3)
      .setOrigin(0, 0).setDepth(300).setScrollFactor(0);
    this.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 800,
      onComplete: () => flash.destroy(),
    });
  }

  private triggerFinalAudit(): void {
    this.dayTimer?.destroy();
    QuestSystem.startQuest('q_m12_audit');
    this.toast.show({
      type: 'warning',
      message: 'MeitY Audit has begun! Head south to Audit Plaza and press [ E ] to face the Tribunal.',
      dpdpSection: 'All Sections — Final Synthesis',
      penalty: 'Up to \u20B9250 Crore',
      duration: 10000,
    });

    const arrow = this.add.text(640, 620, 'V AUDIT PLAZA', {
      fontFamily: 'Courier New', fontSize: '14px', color: '#ff4400',
    }).setOrigin(0.5).setDepth(100).setScrollFactor(0);
    this.tweens.add({
      targets: arrow, alpha: 0.1, duration: 600, yoyo: true, repeat: 8,
      onComplete: () => arrow.destroy(),
    });
  }

  private showNPCGreeting(npcId: string, npcX: number, npcY: number): void {
    const greetings: Record<string, string[]> = {
      auditor:  [
        'Those compliance reports better be on my desk by Friday.',
        'I\'m watching IndiaScale\'s data practices. Every day.',
        '§8(4) — Data Protection by Design. Have you read it?',
        'Our audit window is shrinking. Fix the consent flows.',
      ],
      dev:      [
        'Pushed another privacy patch. Sleep is optional.',
        'Did you check the S3 bucket permissions yet?',
        'Our consent manager still needs a rework. Ask me later.',
        'Server logs are interesting today... very interesting.',
      ],
      ceo:      [
        'The VCs are watching our compliance score very closely.',
        'Privacy is good business. Never forget that.',
        'Series C won\'t close itself. Get us compliant.',
        'Legal just pinged me. We need to talk about the DPA.',
      ],
      lawyer:   [
        'The 72-hour breach clock never stops ticking.',
        'Have you filed that grievance response yet?',
        'DPO appointment letter is on my desk. Have you signed it?',
        '§13 says 30 days. We\'re at day 10. Move faster.',
      ],
      meity:    [
        'The Board meets quarterly. Are you prepared?',
        'Rule 7 is not optional, Sentinel.',
        'We\'ve received your Section 5 notice. We\'re reviewing it.',
        'Non-compliance fines start at ₹10,000. They go much higher.',
      ],
    };

    const lines = greetings[npcId] ?? ['...'];
    const text = lines[Math.floor(Math.random() * lines.length)];

    // Show floating speech bubble above NPC
    const bubble = this.add.container(npcX, npcY - 56).setDepth(25);
    const bg = this.add.rectangle(0, 0, Math.min(340, text.length * 7.5 + 24), 38, 0x0d1829, 0.95)
      .setOrigin(0.5).setStrokeStyle(1, 0x2a4060);
    const txt = this.add.text(0, 0, text, {
      fontFamily: "'Inter', system-ui, Arial, sans-serif",
      fontSize: '13px',
      color: '#ccddee',
      wordWrap: { width: 320 },
    }).setOrigin(0.5);
    bubble.add([bg, txt]);

    // Resize bg to fit wrapped text
    this.time.delayedCall(10, () => {
      bg.setSize(txt.width + 24, txt.height + 16);
    });

    // Float up and fade
    this.tweens.add({
      targets: bubble,
      y: npcY - 80,
      alpha: 0,
      duration: 2800,
      ease: 'Quad.easeIn',
      delay: 1200,
      onComplete: () => bubble.destroy(),
    });
  }

  private tryLoadAutoSave(): void {
    if (!SaveSystem.hasAutoSave()) return;
    const data = SaveSystem.loadAutoSave();
    if (!data) return;

    const restored = SaveSystem.restoreState(data);
    this.talkedNPCs = new Set(restored.talkedNPCs);
    // Mark already-triggered events
    DAY_EVENTS.forEach(ev => {
      if (restored.triggeredEventIds.includes(ev.id)) ev.triggered = true;
    });
    // Re-register quests with restored state (quests already registered in registerQuests)
    this.toast.show({
      type: 'success',
      message: `Game resumed from Day ${data.inGameDay}`,
      duration: 3000,
    });
  }

  private showAutoSaveIndicator(): void {
    const indicator = this.add.text(GAME_WIDTH - 16, GAME_HEIGHT - 60, '💾 Auto-saved', {
      fontFamily: "'Inter', system-ui, Arial, sans-serif",
      fontSize: '12px',
      color: '#00cc88',
      backgroundColor: '#00000088',
      padding: { x: 6, y: 4 },
    }).setOrigin(1, 1).setScrollFactor(0).setDepth(80).setAlpha(0);

    this.tweens.add({
      targets: indicator,
      alpha: 1,
      duration: 200,
      yoyo: true,
      hold: 1500,
      onComplete: () => indicator.destroy(),
    });
  }
}
