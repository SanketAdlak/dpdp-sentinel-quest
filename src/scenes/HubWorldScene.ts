import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, SCENES, EVENTS, FONT_UI } from '../constants';
import { Player } from '../entities/Player';
import { NPC, NPCConfig } from '../entities/NPC';
import { HUD } from '../ui/HUD';
import { NotificationToast } from '../ui/NotificationToast';
import { ScoreSystem } from '../systems/ScoreSystem';
import { QuestSystem } from '../systems/QuestSystem';
import { ScoreSummary, ScoreSnapshot } from '../ui/ScoreSummary';
import { RoomBuilder } from '../world/RoomBuilder';
import { QuestArrow } from '../ui/QuestArrow';
import { KnowledgeQuiz, STAGE_QUIZZES, QuizConfig } from '../ui/KnowledgeQuiz';
import { InventoryPanel } from '../ui/InventoryPanel';
import { SaveSystem } from '../systems/SaveSystem';

const NPC_CONFIGS: NPCConfig[] = [
  {
    id: 'auditor',
    name: 'Rakesh Sharma',
    role: 'Compliance Guide',
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
    role: 'Data Protection Board',
    spriteKey: 'npc_meity',
    dialogue: 'meity_intro',
    x: 808, y: 1200,
  },
  {
    id: 'marketing',
    name: 'Meena Kapoor',
    role: 'Marketing Manager',
    spriteKey: 'npc_ceo',
    dialogue: 'marketing_intro',
    x: 700, y: 650,
  },
  {
    id: 'rbi',
    name: 'Suresh Bajaj',
    role: 'Compliance Officer',
    spriteKey: 'npc_auditor',
    dialogue: 'rbi_intro',
    x: 1350, y: 200,
  },
  {
    id: 'safeharbor',
    name: 'Dr. Pooja Nair',
    role: 'Child Safety Lead',
    spriteKey: 'npc_lawyer',
    dialogue: 'safeharbor_intro',
    x: 1350, y: 650,
  },
  {
    id: 'cloud',
    name: 'Arjun Shah',
    role: 'Cloud Architect',
    spriteKey: 'npc_dev',
    dialogue: 'cloud_intro',
    x: 250, y: 1200,
  },
];

// ── District friendly names for locked-room messages ───────────────────────
const DISTRICT_NAMES: Record<string, string> = {
  server:     'Server District',
  rbi:        'RBI Vault',
  legal:      'Legal Tower',
  marketing:  'Marketing Floor',
  safeharbor: 'Safe Harbor',
  cloud:      'Cloud Frontier',
  audit:      'Audit Plaza',
};

// ── District locking zones ──────────────────────────────────────────────────
// Each zone defines the pixel area that belongs to a district.
// If the district is locked, the player cannot enter this area.
const DISTRICT_ZONES: Record<string, { x: number; y: number; w: number; h: number }[]> = {
  server:     [{ x: 570, y:   0, w: 610, h: 450 }],  // Server + corridor
  rbi:        [{ x: 1160, y:  0, w: 570, h: 450 }],  // RBI Vault
  legal:      [{ x:   0, y: 450, w: 570, h: 510 }],  // Legal Tower + corridor
  marketing:  [{ x: 570, y: 450, w: 610, h: 510 }],  // Marketing Floor + corridor
  safeharbor: [{ x: 1160, y: 450, w: 570, h: 510 }], // Safe Harbor
  cloud:      [{ x:   0, y: 970, w: 570, h: 470 }],  // Cloud Frontier + corridor
  audit:      [{ x: 570, y: 970, w: 610, h: 470 }],  // Audit Plaza + corridor
};

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
    title: 'USER COMPLAINT RECEIVED',
    message: 'A user named Priya Krishnamurthy has complained to the government\'s Data Protection Board. She says IndiaScale shared her contact details with marketing companies without asking her permission. The Board wants a response within 15 days.',
    type: 'complaint',
    debtDelta: 10,
    trustDelta: -5,
    dpdpSection: 'Consent & Grievance Rules',
    penalty: 'Fine possible if ignored',
    triggered: false,
  },
  {
    day: 6,
    id: 'ev_breach_day6',
    title: 'DATA LEAK DETECTED',
    message: 'URGENT: A security gap in one of our APIs exposed 2,400 user accounts — names, emails, and partial ID numbers. When user data is leaked like this, we are legally required to notify the government within 72 hours. The clock has started.',
    type: 'breach',
    debtDelta: 20,
    trustDelta: -15,
    dpdpSection: 'Breach Notification Rule',
    penalty: 'Large fine if not reported within 72 hours',
    startQuestId: 'q_stage4_deeper',
    triggered: false,
  },
  {
    day: 10,
    id: 'ev_erasure_day10',
    title: 'DELETION REQUEST OVERDUE',
    message: 'Journalist Rahul Nair asked us to delete his personal data 10 days ago. We haven\'t responded yet. Users have the legal right to have their data deleted. We have 30 days total — and we\'ve already used up 10 of them.',
    type: 'erasure',
    debtDelta: 15,
    trustDelta: -10,
    dpdpSection: 'User Right to Erasure',
    penalty: 'Fine for ignoring deletion requests',
    triggered: false,
  },
  {
    day: 14,
    id: 'ev_techdebt_day14',
    title: 'PRIVACY FEATURES DEPRIORITIZED',
    message: 'Priya reports: the engineering team keeps pushing privacy-related work to the bottom of the backlog. Three important security fixes are now 60 days overdue. This isn\'t just a compliance risk — it\'s a real security vulnerability.',
    type: 'internal',
    debtDelta: 10,
    dpdpSection: 'Data Security Rules',
    triggered: false,
  },
  {
    day: 18,
    id: 'ev_spotcheck_day18',
    title: 'GOVERNMENT INSPECTOR ARRIVING',
    message: 'Officer Gupta from the Data Protection Board is stopping by for a routine check. He\'ll want to see: your Privacy Notice (what you tell users about their data), how you handle user consent, and how users can raise concerns. You have 30 minutes to prepare.',
    type: 'regulatory',
    complianceDelta: 5,
    debtDelta: 10,
    dpdpSection: 'Privacy Notice, Consent & Grievance',
    penalty: 'Fine if documentation is missing',
    triggered: false,
  },
  {
    day: 21,
    id: 'ev_vc_day21',
    title: 'INVESTORS ASKING ABOUT PRIVACY',
    message: 'The venture capital team for our Series C has sent a detailed questionnaire about our privacy practices. This is now standard for large funding rounds — investors don\'t want to back companies with hidden compliance risks. We have 7 days to respond.',
    type: 'vc',
    trustDelta: -5,
    complianceDelta: 0,
    triggered: false,
  },
  {
    day: 24,
    id: 'ev_insider_day24',
    title: 'FORMER EMPLOYEE DATA INCIDENT',
    message: 'A security review found that a former team member copied 18,000 customer records to their personal Dropbox before leaving the company 2 months ago. This is a data breach — even if unintentional — and must be reported to the government.',
    type: 'internal',
    debtDelta: 25,
    trustDelta: -20,
    dpdpSection: 'Breach Notification Rule',
    penalty: 'Fine for each unreported breach',
    triggered: false,
  },
  {
    day: 27,
    id: 'ev_preaudit_day27',
    title: '3 DAYS TO THE AUDIT',
    message: 'The government audit begins in 3 days. Officer Gupta will review everything. Make sure you have: an up-to-date Privacy Notice, clear consent records, a process for handling deletion requests, a record of any data leaks, and contact details for your Privacy Officer.',
    type: 'warning',
    complianceDelta: 0,
    dpdpSection: 'All Privacy Rules',
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
  private knowledgeQuiz!: KnowledgeQuiz;
  private inventoryPanel!: InventoryPanel;
  private talkedNPCs: Set<string> = new Set();
  private lockedRoomToastLastShown: number = 0;
  private pendingQuiz: Omit<QuizConfig, 'onComplete'> | null = null;

  // External (singleton) listener references for cleanup
  private _scoreChangeHandler!: () => void;
  private _questCompletedHandler!: (quest: import('../systems/QuestSystem').Quest) => void;
  private _questStartedHandler!: (quest: import('../systems/QuestSystem').Quest) => void;
  private _objectiveCompletedHandler!: (quest: import('../systems/QuestSystem').Quest, objectiveId?: string) => void;

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

    // Prevent world content from appearing behind the HUD bar (56px tall)
    if (this.cameras.main.scrollY < 56) {
      this.cameras.main.scrollY = 56;
    }
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
    this.buildLockedDoorOverlays();
  }

  // Door positions for each district (approximate centre of the entrance gap)
  private readonly DOOR_SIGNS: Array<{ districtId: string; x: number; y: number; label: string }> = [
    { districtId: 'server',     x: 592,  y: 208,  label: 'Server District' },
    { districtId: 'rbi',        x: 1200, y: 208,  label: 'RBI Vault' },
    { districtId: 'legal',      x: 256,  y: 468,  label: 'Legal Tower' },
    { districtId: 'marketing',  x: 800,  y: 468,  label: 'Marketing Floor' },
    { districtId: 'safeharbor', x: 1410, y: 468,  label: 'Safe Harbor' },
    { districtId: 'cloud',      x: 256,  y: 980,  label: 'Cloud Frontier' },
    { districtId: 'audit',      x: 800,  y: 980,  label: 'Audit Plaza' },
  ];

  private lockedOverlays: Map<string, Phaser.GameObjects.Container> = new Map();

  private buildLockedDoorOverlays(): void {
    for (const door of this.DOOR_SIGNS) {
      const container = this.add.container(door.x, door.y).setDepth(30);

      const bg = this.add.rectangle(0, 0, 140, 36, 0x000000, 0.78)
        .setOrigin(0.5)
        .setStrokeStyle(1, 0x666666);

      const lockIcon = this.add.text(-50, 0, '🔒', {
        fontFamily: 'Courier New', fontSize: '13px',
      }).setOrigin(0.5);

      const label = this.add.text(8, 0, door.label, {
        fontFamily: 'Courier New', fontSize: '10px', color: '#aaaaaa',
      }).setOrigin(0.5);

      container.add([bg, lockIcon, label]);

      // Hide if already unlocked (e.g. restored from save)
      if (QuestSystem.isDistrictUnlocked(door.districtId)) {
        container.setVisible(false);
      }

      this.lockedOverlays.set(door.districtId, container);
    }

    // Listen for district unlocks to destroy the overlay
    QuestSystem.on('quest-completed', () => {
      for (const door of this.DOOR_SIGNS) {
        if (QuestSystem.isDistrictUnlocked(door.districtId)) {
          const overlay = this.lockedOverlays.get(door.districtId);
          if (overlay) {
            overlay.destroy();
            this.lockedOverlays.delete(door.districtId);
          }
        }
      }
    });

    QuestSystem.on('quest-started', () => {
      for (const door of this.DOOR_SIGNS) {
        if (QuestSystem.isDistrictUnlocked(door.districtId)) {
          const overlay = this.lockedOverlays.get(door.districtId);
          if (overlay) {
            overlay.destroy();
            this.lockedOverlays.delete(door.districtId);
          }
        }
      }
    });
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

      // ── Locked district check ─────────────────────────────────────────────
      // Block movement into districts that haven't been unlocked yet.
      for (const [districtId, zones] of Object.entries(DISTRICT_ZONES)) {
        if (!QuestSystem.isDistrictUnlocked(districtId)) {
          const blocked = zones.some(
            z => tx >= z.x && tx < z.x + z.w && ty >= z.y && ty < z.y + z.h
          );
          if (blocked) {
            // Debounce the toast — show at most once every 3 seconds
            const now = Date.now();
            if (now - this.lockedRoomToastLastShown > 3000) {
              this.lockedRoomToastLastShown = now;
              const label = DISTRICT_NAMES[districtId] ?? districtId;
              this.toast?.show({
                type: 'warning',
                message: `🔒 ${label} is locked. Complete your current quest to unlock this area.`,
                duration: 3000,
              });
            }
            return false;
          }
        }
      }

      // ── Walkable-area check ───────────────────────────────────────────────
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

    const serverLabel = this.add.text(640 + 16, 32 + 50, '[ F ]  Run PII Radar Scan', {
      fontFamily: "'Inter', system-ui, Arial, sans-serif", fontSize: '13px',
      color: '#ffffff', backgroundColor: '#0055aa', padding: { x: 8, y: 4 },
    }).setDepth(20).setVisible(false);

    // Track whether player is in server zone — show hint while inside, hide when leaving
    let inServerZone = false;
    this.physics.add.overlap(this.player, serverZone, () => {
      if (!inServerZone) {
        inServerZone = true;
        serverLabel.setVisible(true);
      }
    });

    // Hide hint when player leaves server zone
    this.time.addEvent({
      delay: 200,
      loop: true,
      callback: () => {
        const nowInZone = Phaser.Geom.Rectangle.Contains(
          new Phaser.Geom.Rectangle(640, 32, 448, 352),
          this.player.x, this.player.y
        );
        if (inServerZone && !nowInZone) {
          inServerZone = false;
          serverLabel.setVisible(false);
        }
      },
    });

    const fKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    fKey.on('down', () => {
      const nowInZone = Phaser.Geom.Rectangle.Contains(
        new Phaser.Geom.Rectangle(640, 32, 448, 352),
        this.player.x, this.player.y
      );
      if (nowInZone) this.launchPIIRadar();
    });

    // ── Audit Plaza ── Final boss entry
    // Inner floor: (640, 1056) to (1088, 1408), center = (864, 1232), size = 448 x 352
    const auditZone = this.add.zone(864, 1232, 448, 352).setDepth(0);
    this.physics.world.enable(auditZone);

    const auditLabel = this.add.text(640 + 16, 1056 + 50, '[ ENTER ] Enter MeitY Tribunal', {
      fontFamily: 'Courier New', fontSize: '11px', color: '#ff4400',
    }).setVisible(false);

    this.physics.add.overlap(this.player, auditZone, () => {
      const auditQuest = QuestSystem.getQuest('q_stage5_audit');
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
      const auditQuest = QuestSystem.getQuest('q_stage5_audit');
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
      if (this.scene.isActive(SCENES.UI)) this.scene.stop(SCENES.UI);
      // Route to ending after audit — AuditPlazaScene should emit audit-result
      // For now, go directly to EndingScene (AuditPlazaScene can be integrated later)
      this.scene.start(SCENES.ENDING);
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
    this.knowledgeQuiz = new KnowledgeQuiz(this);
    this.inventoryPanel = new InventoryPanel(this);

    // [I] key toggles the inventory panel
    this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.I).on('down', () => {
      this.inventoryPanel.toggle();
    });
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
    // ── Scene (Phaser) events — auto-cleaned by Phaser on scene shutdown ───────

    this.events.on('player-interact', (npcId: string) => {
      const npc = this.npcs.find(n => n.npcId === npcId);
      if (!npc) return;

      // If already talked to this NPC, show a greeting instead
      if (this.talkedNPCs.has(npcId)) {
        this.showNPCGreeting(npcId, npc.x, npc.y);
        return;
      }

      // Snapshot score before dialogue
      const state = ScoreSystem.getState();
      this.scoreBeforeDialogue = {
        complianceScore: state.complianceScore,
        privacyDebt: state.privacyDebt,
        trustRating: state.trustRating,
        privacyCoins: state.privacyCoins,
      };
      this.currentDialogueNPC = { name: npc.npcName, role: npc.role };

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

      // If debt crossed 100% during the dialogue, handle game over now
      if (ScoreSystem.isGameOver()) {
        this.triggerGameOver();
        return;
      }

      // Complete quest objectives for this NPC BEFORE showing the score summary
      // so the summary reflects any quest-reward score changes too.
      if (npcId) {
        const objMap: Record<string, { questId: string; objId: string }> = {
          auditor:    { questId: 'q_stage1_hq',    objId: 'talk_rakesh'        },
          ceo:        { questId: 'q_stage1_hq',    objId: 'talk_ceo'           },
          dev:        { questId: 'q_stage2_server', objId: 'talk_priya'         },
          lawyer:     { questId: 'q_stage3_legal',  objId: 'talk_anjali'        },
          marketing:  { questId: 'q_stage4_deeper', objId: 'review_consent'     },
          rbi:        { questId: 'q_stage4_deeper', objId: 'check_retention'    },
          safeharbor: { questId: 'q_stage4_deeper', objId: 'safeguard_children' },
          meity:      { questId: 'q_stage5_audit',  objId: 'talk_gupta'         },
        };
        const mapping = objMap[npcId];
        if (mapping) QuestSystem.completeObjective(mapping.questId, mapping.objId);
      }

      // Show score summary — on dismiss, check if a quiz was deferred during dialogue
      const before = this.scoreBeforeDialogue;
      const npcInfo = this.currentDialogueNPC;
      if (before && npcInfo) {
        this.scoreSummary.show(
          npcInfo.name,
          npcInfo.role,
          before,
          () => {
            // After score summary: show pending quiz if one was queued while dialogue ran
            if (this.pendingQuiz) {
              this.showQuizNow(this.pendingQuiz);
              this.pendingQuiz = null;
            } else {
              this.player.setInteracting(false);
            }
          }
        );
      } else {
        if (this.pendingQuiz) {
          this.showQuizNow(this.pendingQuiz);
          this.pendingQuiz = null;
        } else {
          this.player.setInteracting(false);
        }
      }
      this.scoreBeforeDialogue = null;
      this.currentDialogueNPC = null;
    });

    this.game.events.on(EVENTS.SHOW_NOTIFICATION, (config: Parameters<NotificationToast['show']>[0]) => {
      this.toast.show(config);
    });

    // ── Singleton listeners — must be stored and removed on scene shutdown ─────

    this._scoreChangeHandler = () => {
      // Never interrupt an active dialogue with a game-over transition.
      if (ScoreSystem.isGameOver() && !this.scene.isActive(SCENES.DIALOGUE)) {
        this.triggerGameOver();
      }
    };
    ScoreSystem.on('change', this._scoreChangeHandler);

    // Quest completion → banner + optional knowledge quiz
    this._questCompletedHandler = (quest) => {
      this.showQuestCompleteBanner(quest.title, quest.rewardCompliance, quest.rewardCoins);

      const quizData = STAGE_QUIZZES[quest.id];
      if (!quizData) return;

      if (this.scene.isActive(SCENES.DIALOGUE)) {
        // Dialogue still running — defer the quiz until after dialogue + score summary
        this.pendingQuiz = quizData;
      } else {
        // No dialogue active — show quiz after a short banner-display delay
        this.showQuizNow(quizData);
      }
    };
    QuestSystem.on('quest-completed', this._questCompletedHandler);

    // Quest start → info toast
    this._questStartedHandler = (quest) => {
      this.toast.show({
        type: 'info',
        message: `New Area Unlocked: ${quest.title}\n${quest.description}`,
        duration: 5000,
      });
    };
    QuestSystem.on('quest-started', this._questStartedHandler);

    // Objective completed → small toast
    this._objectiveCompletedHandler = (quest, objectiveId) => {
      const obj = quest.objectives.find(o => o.id === objectiveId);
      if (obj) {
        this.toast.show({
          type: 'success',
          message: `Objective: ${obj.description}`,
          duration: 3000,
        });
      }
    };
    QuestSystem.on('objective-completed', this._objectiveCompletedHandler);

    // ── Cleanup external listeners when this scene shuts down ─────────────────
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      ScoreSystem.off('change', this._scoreChangeHandler);
      QuestSystem.off('quest-completed', this._questCompletedHandler);
      QuestSystem.off('quest-started',   this._questStartedHandler);
      QuestSystem.off('objective-completed', this._objectiveCompletedHandler);
      this.game.events.off(EVENTS.SHOW_NOTIFICATION);
    });
  }

  /** Show a quiz immediately (with a short delay for banner to appear first). */
  private showQuizNow(quizData: Omit<QuizConfig, 'onComplete'>): void {
    this.player.setInteracting(true);
    this.time.delayedCall(2800, () => {
      this.knowledgeQuiz.show({
        ...quizData,
        onComplete: (score, total) => {
          this.player.setInteracting(false);
          const pct = Math.round((score / total) * 100);
          this.toast.show({
            type: score >= total * 0.67 ? 'success' : 'warning',
            message: pct === 100
              ? 'Perfect score! You really understand this topic.'
              : `Quiz done — ${score}/${total} correct. Keep going!`,
            duration: 4000,
          });
        },
      });
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
    // ── STAGE 1: HQ Introduction ─────────────────────────────────────────────
    // Learn what personal data is and why it matters.
    // Only HQ is accessible. Completing this unlocks Server District.
    QuestSystem.registerQuest({
      id: 'q_stage1_hq',
      title: 'Day 1: What Are We Dealing With?',
      description: 'Talk to Rakesh and the CEO to understand the privacy situation at IndiaScale.',
      dpdpSection: 'What is Personal Data? Why does it matter?',
      status: 'active',
      rewardCompliance: 10,
      rewardCoins: 100,
      rewardTrust: 10,
      penaltyDebt: 0,
      unlocks: ['server', 'q_stage2_server'],
      objectives: [
        { id: 'talk_rakesh', description: 'Speak with Rakesh — the compliance guide in HQ', completed: false },
        { id: 'talk_ceo',    description: 'Speak with Vikram (CEO) about the business case for privacy', completed: false },
      ],
    });

    // ── STAGE 2: Server District ─────────────────────────────────────────────
    // Learn about data security and sensitive information.
    // Unlocked after Stage 1. Completing this unlocks Legal Tower.
    QuestSystem.registerQuest({
      id: 'q_stage2_server',
      title: 'The Data Detective',
      description: "Explore the Server District with Priya and discover what data IndiaScale is actually storing.",
      dpdpSection: 'Data Security — Protecting User Information',
      status: 'inactive',
      rewardCompliance: 15,
      rewardCoins: 120,
      rewardTrust: 10,
      penaltyDebt: 0,
      unlocks: ['legal', 'q_stage3_legal'],
      objectives: [
        { id: 'talk_priya',      description: 'Talk to Priya in the Server District', completed: false },
        { id: 'complete_pii_scan', description: 'Run the PII Radar scan (Press F in Server District)', completed: false },
      ],
    });

    // ── STAGE 3: Legal Tower ─────────────────────────────────────────────────
    // Learn that users have rights over their own data.
    // Unlocked after Stage 2. Completing this unlocks Marketing, RBI, Safe Harbor.
    QuestSystem.registerQuest({
      id: 'q_stage3_legal',
      title: 'Users Have Rights',
      description: 'Visit the Legal Tower and learn about the rights users have over their personal information.',
      dpdpSection: 'User Rights — Deletion, Correction, Access',
      status: 'inactive',
      rewardCompliance: 20,
      rewardCoins: 150,
      rewardTrust: 15,
      penaltyDebt: 0,
      unlocks: ['marketing', 'rbi', 'safeharbor', 'q_stage4_deeper'],
      objectives: [
        { id: 'talk_anjali', description: 'Meet with Anjali (Privacy Lawyer) in the Legal Tower', completed: false },
      ],
    });

    // ── STAGE 4: Wider Building ──────────────────────────────────────────────
    // Marketing Floor, RBI Vault, and Safe Harbor now accessible.
    // Learn about consent, data retention conflicts, and children's data.
    // Completing this unlocks Cloud Frontier and Audit Plaza.
    QuestSystem.registerQuest({
      id: 'q_stage4_deeper',
      title: 'Putting It All Together',
      description: 'Explore the Marketing Floor, RBI Vault, and Safe Harbor to understand consent, retention rules, and vulnerable users.',
      dpdpSection: 'Consent, Retention Conflicts, Children\'s Data',
      status: 'inactive',
      rewardCompliance: 25,
      rewardCoins: 200,
      rewardTrust: 15,
      penaltyDebt: 0,
      unlocks: ['cloud', 'audit', 'q_stage5_audit'],
      objectives: [
        { id: 'review_consent',     description: 'Review the consent process on the Marketing Floor', completed: false },
        { id: 'check_retention',    description: 'Understand the data retention conflict in the RBI Vault', completed: false },
        { id: 'safeguard_children', description: 'Review children\'s data protections in Safe Harbor', completed: false },
      ],
    });

    // ── STAGE 5: Final Audit ─────────────────────────────────────────────────
    // The government audit. Face Officer Gupta and apply everything learned.
    QuestSystem.registerQuest({
      id: 'q_stage5_audit',
      title: 'The Government Audit',
      description: 'Head to Audit Plaza and face the Data Protection Board inspector. Apply everything you\'ve learned.',
      dpdpSection: 'All Privacy Principles — Final Assessment',
      status: 'inactive',
      rewardCompliance: 30,
      rewardCoins: 500,
      rewardTrust: 30,
      penaltyDebt: 0,
      unlocks: [],
      objectives: [
        { id: 'talk_gupta',    description: 'Meet Officer Gupta in the Audit Plaza', completed: false },
        { id: 'audit_round1',  description: 'Answer the Privacy Notice questions correctly', completed: false },
        { id: 'audit_round2',  description: 'Demonstrate your consent mechanism', completed: false },
      ],
    });

    // Start Stage 1
    QuestSystem.startQuest('q_stage1_hq');
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
    const overlayH = 420;

    // Full-screen dark backdrop (NOT inside container)
    const backdrop = this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.85)
      .setOrigin(0, 0).setDepth(498).setScrollFactor(0);

    const overlay = this.add.container(cx, cy)
      .setDepth(500)
      .setScrollFactor(0);

    // Lighter panel — not pitch black
    const bg = this.add.rectangle(0, 0, overlayW, overlayH, 0x0f2035, 1.0)
      .setOrigin(0.5)
      .setStrokeStyle(2, 0x00ffcc);

    const title = this.add.text(0, -overlayH / 2 + 26, 'WELCOME, PRIVACY CHAMPION', {
      fontFamily: FONT_UI,
      fontSize: '20px',
      color: '#ffdd44',
      fontStyle: 'bold',
      resolution: 2,
    }).setOrigin(0.5);

    const mission = this.add.text(0, -overlayH / 2 + 62, 'You are the new Privacy Champion at IndiaScale.\nA government audit arrives in 30 days.\nExplore the building, talk to the team, and learn\nhow to protect users\' personal information.', {
      fontFamily: FONT_UI,
      fontSize: '14px',
      color: '#d8eef8',
      wordWrap: { width: 520 },
      align: 'center',
      lineSpacing: 5,
      resolution: 2,
    }).setOrigin(0.5, 0);

    const controlsHeader = this.add.text(0, -overlayH / 2 + 152, 'CONTROLS', {
      fontFamily: FONT_UI,
      fontSize: '13px',
      color: '#00ffcc',
      fontStyle: 'bold',
      resolution: 2,
    }).setOrigin(0.5);

    const controlLines = [
      'WASD / Arrows        Move around IndiaScale HQ',
      'E                    Talk to NPCs when the ! bubble appears',
      'SPACE                Advance dialogue / skip typewriter',
      '1   2   3            Select dialogue choices',
      'F                    PII Radar Scan (in Server District)',
      'ENTER                Enter Audit Plaza when unlocked',
      'I                    Open / close Evidence Vault',
    ].join('\n');

    const controlsText = this.add.text(-overlayW / 2 + 30, -overlayH / 2 + 172, controlLines, {
      fontFamily: FONT_UI,
      fontSize: '12px',
      color: '#c0d8ee',
      lineSpacing: 7,
      wordWrap: { width: overlayW - 60 },
      resolution: 2,
    });

    const hint = this.add.text(0, overlayH / 2 - 16, 'Click anywhere to dismiss', {
      fontFamily: FONT_UI,
      fontSize: '12px',
      color: '#7aa0bb',
      resolution: 2,
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
        message: 'Welcome to IndiaScale! You\'re the new Privacy Champion. Talk to Rakesh in HQ to get started.',
        duration: 6000,
      });
    });

    this.time.delayedCall(4000, () => {
      this.toast.show({
        type: 'warning',
        message: 'A government audit is coming in 30 days. IndiaScale needs to learn how to protect users\' data properly. Start by exploring HQ.',
        duration: 6000,
      });
    });
  }

  private triggerGameOver(): void {
    this.dayTimer?.destroy();
    if (this.scene.isActive(SCENES.DIALOGUE)) this.scene.stop(SCENES.DIALOGUE);
    if (this.scene.isActive(SCENES.UI))       this.scene.stop(SCENES.UI);
    this.cameras.main.fadeOut(600, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start(SCENES.GAME_OVER);
    });
  }

  private triggerEnding(): void {
    this.dayTimer?.destroy();
    if (this.scene.isActive(SCENES.DIALOGUE)) this.scene.stop(SCENES.DIALOGUE);
    if (this.scene.isActive(SCENES.UI))       this.scene.stop(SCENES.UI);
    this.cameras.main.fadeOut(600, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start(SCENES.ENDING);
    });
  }

  private triggerBreachEvent(): void {
    QuestSystem.startQuest('q_stage4_deeper');

    this.toast.show({
      type: 'warning',
      message: 'DATA LEAK: A storage misconfiguration exposed 12,000 user records for 6 hours. When this happens, you MUST notify the government within 72 hours. The clock is ticking.',
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
    QuestSystem.startQuest('q_stage5_audit');

    // If player has enough compliance to pass, send them to the ending directly
    if (ScoreSystem.passedAudit()) {
      this.time.delayedCall(3000, () => this.triggerEnding());
      this.toast.show({
        type: 'success',
        message: 'The MeitY audit is here! Your compliance score is strong — heading to final assessment.',
        duration: 5000,
      });
      return;
    }

    // Otherwise: let player try the audit plaza one last time
    this.toast.show({
      type: 'warning',
      message: 'The government audit has begun! Head south to Audit Plaza and press [ E ] to meet Officer Gupta.',
      duration: 10000,
    });

    const arrow = this.add.text(640, 620, 'V AUDIT PLAZA', {
      fontFamily: FONT_UI, fontSize: '14px', color: '#ff4400',
    }).setOrigin(0.5).setDepth(100).setScrollFactor(0);
    this.tweens.add({
      targets: arrow, alpha: 0.1, duration: 600, yoyo: true, repeat: 8,
      onComplete: () => arrow.destroy(),
    });
  }

  private showNPCGreeting(npcId: string, npcX: number, npcY: number): void {
    const greetings: Record<string, string[]> = {
      auditor:  [
        'Remember — users trust you with their information. Treat it like you\'d treat your own.',
        'Any new areas of the building you\'ve been able to explore?',
        'The key question: do your users know what you\'re collecting, and did they agree to it?',
        'Every day we don\'t fix this, the risk grows. Keep pushing forward.',
      ],
      dev:      [
        'Just found another old export file. The data hygiene issue runs deep.',
        'Good security is like a good lock — it only matters if you actually use it.',
        'Our agreement with Freshdesk still isn\'t signed. I keep reminding them.',
        'Server logs are very interesting today... in a concerning way.',
      ],
      ceo:      [
        'Privacy done right is actually a competitive advantage. Users notice.',
        'Investors are paying attention. Let\'s show them we\'re serious.',
        'How\'s the consent cleanup going? I want to tell the board we\'ve made progress.',
        'Every user who trusts us is worth more than any short-term growth hack.',
      ],
      lawyer:   [
        'Has Meera\'s deletion request been fully processed yet?',
        'The Privacy Officer role needs filling. Independence is non-negotiable.',
        'Pseudonymization is an elegant solution — financial records intact, privacy protected.',
        'Users have more rights over their data than most companies realize.',
      ],
      meity:    [
        'We\'re here to help companies get this right, not just catch them out.',
        'A good Privacy Notice is one a regular person can actually understand.',
        'Withdrawing consent should be exactly as easy as giving it.',
        'The goal is for your users to be able to trust you. Everything else follows from that.',
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
