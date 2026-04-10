import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, SCENES, COLORS } from '../../constants';
import { ScoreSystem } from '../../systems/ScoreSystem';
import { InventorySystem } from '../../systems/InventorySystem';
import { QuestSystem } from '../../systems/QuestSystem';

export interface PIINode {
  id: string;
  x: number;
  y: number;
  type: 'violation' | 'compliant' | 'uncertain';
  label: string;
  detail: string;
  section?: string;
  penalty?: string;
  found: boolean;
}

// All nodes repositioned within RADAR_R=280 (using 240 max for safety)
// CX=540, CY=380
const PII_NODES: PIINode[] = [
  {
    id: 'pii_s3',
    x: 380, y: 280,   // dist = sqrt(160²+100²) ≈ 189
    type: 'violation',
    label: 'S3 Bucket — /exports/2022-users.csv',
    detail: '50,000 user records. Unencrypted. No retention policy. Publicly accessible.',
    section: '§8(5) — Security Safeguards',
    penalty: '₹250 Crore',
    found: false,
  },
  {
    id: 'pii_slack',
    x: 640, y: 210,   // dist = sqrt(100²+170²) ≈ 199
    type: 'violation',
    label: 'Slack Integration Logs',
    detail: 'User emails stored in plaintext in full-text search indexes.',
    section: '§8(5) — Security Safeguards',
    penalty: '₹250 Crore',
    found: false,
  },
  {
    id: 'pii_ab',
    x: 700, y: 360,   // dist = sqrt(160²+20²) ≈ 161
    type: 'violation',
    label: 'A/B Test Results Archive',
    detail: 'User IDs correlated to behavioral profiles. Retained beyond purpose.',
    section: '§8(7) — Storage Limitation',
    penalty: '₹150 Crore',
    found: false,
  },
  {
    id: 'pii_freshdesk',
    x: 460, y: 510,   // dist = sqrt(80²+130²) ≈ 152
    type: 'violation',
    label: 'Freshdesk Support Tool',
    detail: 'Full name, phone, and support history stored without DPA contract.',
    section: '§8(4) — Data Processor Contract',
    penalty: '₹250 Crore',
    found: false,
  },
  {
    id: 'pii_mixpanel',
    x: 340, y: 440,   // dist = sqrt(200²+60²) ≈ 209
    type: 'violation',
    label: 'Mixpanel Analytics',
    detail: 'Behavioral event data linked to email addresses. Cross-border transfer undocumented.',
    section: 'Rule 12 — Cross-Border Transfer',
    penalty: '₹250 Crore',
    found: false,
  },
  {
    id: 'pii_aadhaar',
    x: 630, y: 530,   // dist = sqrt(90²+150²) ≈ 175
    type: 'violation',
    label: 'Legacy Terminal — 2019',
    detail: 'Previous CTO approved storing Aadhaar numbers in plaintext "temporarily." Still there.',
    section: '§8(5) — Sensitive Personal Data',
    penalty: '₹250 Crore',
    found: false,
  },
  {
    id: 'pii_main_db',
    x: 480, y: 560,   // dist = sqrt(60²+180²) ≈ 190
    type: 'compliant',
    label: 'Main User DB (PostgreSQL)',
    detail: 'Encrypted at rest. Access logs enabled. Retention policy exists. Compliant.',
    found: false,
  },
  {
    id: 'pii_razorpay',
    x: 680, y: 240,   // dist = sqrt(140²+140²) ≈ 198
    type: 'compliant',
    label: 'Razorpay — Payment Records',
    detail: 'PCI-DSS compliant. DPA in place. Data minimized. Compliant.',
    found: false,
  },
  {
    id: 'pii_logs',
    x: 500, y: 230,   // dist = sqrt(40²+150²) ≈ 155
    type: 'uncertain',
    label: 'Application Logs (CloudWatch)',
    detail: 'Logs contain IP addresses and user IDs. Encrypted but no defined retention. Review needed.',
    section: '§8(7) — Storage Limitation',
    found: false,
  },
];

const TYPE_COLOR: Record<PIINode['type'], number> = {
  violation: 0xff3333,
  compliant:  0x00ff88,
  uncertain:  0xffcc00,
};

export class PIIRadarScene extends Phaser.Scene {
  private radarAngle = 0;
  private radarGraphics!: Phaser.GameObjects.Graphics;
  private nodeObjects: Map<string, Phaser.GameObjects.Arc> = new Map();
  private nodes: PIINode[] = PII_NODES.map(n => ({ ...n }));
  private infoPanel!: Phaser.GameObjects.Container;
  private infoPanelText!: Phaser.GameObjects.Text;
  private infoPanelTitle!: Phaser.GameObjects.Text;
  private infoPanelSection!: Phaser.GameObjects.Text;
  private scanLog: string[] = [];
  private logText!: Phaser.GameObjects.Text;
  private foundCount = 0;
  private scanComplete = false;
  private doneButton!: Phaser.GameObjects.Container;
  private resultText!: Phaser.GameObjects.Text;
  private progressText!: Phaser.GameObjects.Text;
  private sweepLine!: Phaser.GameObjects.Graphics;
  private bgOverlay!: Phaser.GameObjects.Rectangle;
  private forceCompleteButton!: Phaser.GameObjects.Container;
  private autoCompleteTimer!: Phaser.Time.TimerEvent;
  private forceCompleteTimer!: Phaser.Time.TimerEvent;
  private elapsedSeconds = 0;

  // Radar center
  private readonly CX = GAME_WIDTH / 2 - 100;
  private readonly CY = GAME_HEIGHT / 2 + 20;
  private readonly RADAR_R = 280;

  constructor() {
    super({ key: 'PIIRadarScene' });
  }

  create(): void {
    this.nodes = PII_NODES.map(n => ({ ...n }));
    this.foundCount = 0;
    this.scanLog = [];
    this.scanComplete = false;
    this.nodeObjects.clear();
    this.elapsedSeconds = 0;

    this.buildBackground();
    this.buildRadar();
    this.buildNodes();
    this.buildInfoPanel();
    this.buildLogPanel();
    this.buildHeader();
    this.startTimers();

    this.cameras.main.fadeIn(300, 0, 0, 0);
  }

  private startTimers(): void {
    // 45-second auto-complete: reveal remaining nodes then complete
    this.autoCompleteTimer = this.time.addEvent({
      delay: 45000,
      callback: () => {
        if (this.scanComplete) return;
        // Reveal all un-found nodes
        this.nodes.forEach(node => {
          if (!node.found) this.revealNode(node);
        });
        this.time.delayedCall(500, () => {
          if (!this.scanComplete) this.completeScan();
        });
      },
    });

    // 20-second timer: show Force Complete button
    this.forceCompleteTimer = this.time.addEvent({
      delay: 20000,
      callback: () => {
        if (!this.scanComplete) this.showForceCompleteButton();
      },
    });

    // Track elapsed seconds for display
    this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        if (!this.scanComplete) {
          this.elapsedSeconds++;
          const remaining = Math.max(0, 45 - this.elapsedSeconds);
          this.progressText?.setText(
            `Scanning... ${this.foundCount}/${this.nodes.length} nodes found  |  Auto-complete in ${remaining}s`
          );
        }
      },
    });
  }

  private showForceCompleteButton(): void {
    const bx = this.CX;
    const by = GAME_HEIGHT - 110;

    this.forceCompleteButton = this.add.container(bx, by).setDepth(25);

    const bg = this.add.rectangle(0, 0, 240, 36, 0x221100)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setStrokeStyle(2, 0xff8800);

    const label = this.add.text(0, 0, 'Force Complete Scan', {
      fontFamily: 'Courier New', fontSize: '13px', color: '#ff8800',
    }).setOrigin(0.5);

    this.forceCompleteButton.add([bg, label]);

    bg.on('pointerover', () => bg.setFillStyle(0x331100));
    bg.on('pointerout', () => bg.setFillStyle(0x221100));
    bg.on('pointerdown', () => {
      if (this.scanComplete) return;
      this.nodes.forEach(node => {
        if (!node.found) this.revealNode(node);
      });
      this.time.delayedCall(400, () => {
        if (!this.scanComplete) this.completeScan();
      });
    });

    // Bounce in
    this.forceCompleteButton.setScale(0);
    this.tweens.add({ targets: this.forceCompleteButton, scale: 1, duration: 280, ease: 'Back.easeOut' });
  }

  update(time: number): void {
    if (this.scanComplete) return;

    // Rotate sweep line
    this.radarAngle = (time * 0.0006) % (Math.PI * 2);
    this.drawSweep();

    // Reveal nodes when sweep passes over them
    this.nodes.forEach(node => {
      if (node.found) return;

      const dx = node.x - this.CX;
      const dy = node.y - this.CY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > this.RADAR_R) return;

      const nodeAngle = Math.atan2(dy, dx) + Math.PI / 2;
      const sweep = this.radarAngle;
      const diff = ((nodeAngle - sweep) + Math.PI * 4) % (Math.PI * 2);

      if (diff < 0.05) {
        this.revealNode(node);
      }
    });

    // Auto-complete after all revealed
    if (this.foundCount === this.nodes.length && !this.scanComplete) {
      this.completeScan();
    }
  }

  private buildBackground(): void {
    this.bgOverlay = this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000510, 0.97)
      .setOrigin(0, 0).setDepth(0);

    // Grid
    const g = this.add.graphics().setDepth(1);
    g.lineStyle(1, 0x112233, 0.3);
    for (let x = 0; x < GAME_WIDTH; x += 32) g.lineBetween(x, 0, x, GAME_HEIGHT);
    for (let y = 0; y < GAME_HEIGHT; y += 32) g.lineBetween(0, y, GAME_WIDTH, y);
  }

  private buildRadar(): void {
    this.radarGraphics = this.add.graphics().setDepth(3);
    this.sweepLine = this.add.graphics().setDepth(4);

    // Static radar rings
    const staticG = this.add.graphics().setDepth(2);
    staticG.lineStyle(1, 0x004488, 0.5);
    for (let r = 70; r <= this.RADAR_R; r += 70) {
      staticG.strokeCircle(this.CX, this.CY, r);
    }

    // Cross hairs
    staticG.lineStyle(1, 0x003366, 0.4);
    staticG.lineBetween(this.CX - this.RADAR_R, this.CY, this.CX + this.RADAR_R, this.CY);
    staticG.lineBetween(this.CX, this.CY - this.RADAR_R, this.CX, this.CY + this.RADAR_R);

    // Outer border
    staticG.lineStyle(2, 0x0066aa, 0.8);
    staticG.strokeCircle(this.CX, this.CY, this.RADAR_R);

    // Center dot
    staticG.fillStyle(0x00aaff, 1);
    staticG.fillCircle(this.CX, this.CY, 4);

    // Labels
    this.add.text(this.CX, this.CY - this.RADAR_R - 16, 'PII RADAR SCAN — SERVER DISTRICT', {
      fontFamily: 'Courier New', fontSize: '11px', color: '#0088cc',
    }).setOrigin(0.5).setDepth(5);
  }

  private drawSweep(): void {
    this.sweepLine.clear();

    const angle = this.radarAngle - Math.PI / 2;

    // Fading sweep trail (arc)
    for (let i = 0; i < 60; i++) {
      const trailAngle = angle - (i * 0.02);
      const alpha = (1 - i / 60) * 0.35;
      this.sweepLine.lineStyle(2, 0x00ff88, alpha);
      this.sweepLine.beginPath();
      this.sweepLine.arc(this.CX, this.CY, this.RADAR_R * 0.95, trailAngle - 0.02, trailAngle, false);
      this.sweepLine.strokePath();
    }

    // Leading sweep line
    this.sweepLine.lineStyle(2, 0x00ff88, 0.9);
    this.sweepLine.lineBetween(
      this.CX,
      this.CY,
      this.CX + Math.cos(angle) * this.RADAR_R,
      this.CY + Math.sin(angle) * this.RADAR_R,
    );
  }

  private buildNodes(): void {
    this.nodes.forEach(node => {
      const dot = this.add.circle(node.x, node.y, 8, TYPE_COLOR[node.type], 0)
        .setDepth(6).setInteractive({ useHandCursor: true });

      dot.on('pointerdown', () => this.selectNode(node));
      dot.on('pointerover', () => { if (node.found) dot.setStrokeStyle(2, 0xffffff); });
      dot.on('pointerout', () => dot.setStrokeStyle(0));

      this.nodeObjects.set(node.id, dot);
    });
  }

  private revealNode(node: PIINode): void {
    node.found = true;
    this.foundCount++;

    const dot = this.nodeObjects.get(node.id)!;

    // Animate reveal
    dot.setAlpha(0);
    this.tweens.add({
      targets: dot,
      alpha: 1,
      duration: 300,
      onStart: () => {
        dot.setFillStyle(TYPE_COLOR[node.type], 1);
        dot.setStrokeStyle(2, 0xffffff);
      },
    });

    // Blip effect
    const blip = this.add.circle(node.x, node.y, 8, TYPE_COLOR[node.type], 0.6).setDepth(7);
    this.tweens.add({
      targets: blip,
      radius: 28,
      alpha: 0,
      duration: 600,
      onComplete: () => blip.destroy(),
    });

    // Log it
    const icon = node.type === 'violation' ? '🔴' : node.type === 'compliant' ? '🟢' : '🟡';
    this.scanLog.unshift(`${icon} ${node.label}`);
    if (this.scanLog.length > 7) this.scanLog.pop();
    this.logText.setText(this.scanLog.join('\n'));

    // Update progress counter
    this.progressText?.setText(
      `Scanning... ${this.foundCount}/${this.nodes.length} nodes found  |  Auto-complete in ${Math.max(0, 45 - this.elapsedSeconds)}s`
    );
  }

  private selectNode(node: PIINode): void {
    if (!node.found) return;
    this.infoPanelTitle.setText(node.label);
    this.infoPanelText.setText(node.detail);
    this.infoPanelSection.setText(
      node.section
        ? `📌 ${node.section}${node.penalty ? `  |  Fine: ${node.penalty}` : ''}`
        : node.type === 'compliant' ? '✅ No violation found' : '⚠️ Review required'
    );
    this.infoPanelSection.setColor(
      node.type === 'violation' ? COLORS.TEXT_DANGER :
      node.type === 'compliant' ? COLORS.TEXT_SUCCESS : COLORS.TEXT_HIGHLIGHT
    );
    this.infoPanel.setVisible(true);
  }

  private buildInfoPanel(): void {
    const px = GAME_WIDTH - 340;
    const py = 60;
    const pw = 310;
    const ph = 200;

    this.infoPanel = this.add.container(px, py).setDepth(10).setVisible(false);

    const bg = this.add.rectangle(0, 0, pw, ph, 0x0a0f1a, 0.96)
      .setOrigin(0, 0).setStrokeStyle(1, 0x334466);

    const header = this.add.rectangle(0, 0, pw, 32, 0x112233).setOrigin(0, 0);

    const headerLabel = this.add.text(10, 8, 'INVESTIGATION REPORT', {
      fontFamily: 'Courier New', fontSize: '10px', color: COLORS.TEXT_SECONDARY,
    });

    this.infoPanelTitle = this.add.text(10, 40, '', {
      fontFamily: 'Courier New', fontSize: '12px', color: COLORS.TEXT_HIGHLIGHT,
      wordWrap: { width: pw - 20 },
    });

    this.infoPanelText = this.add.text(10, 74, '', {
      fontFamily: 'Courier New', fontSize: '11px', color: COLORS.TEXT_PRIMARY,
      wordWrap: { width: pw - 20 }, lineSpacing: 3,
    });

    this.infoPanelSection = this.add.text(10, ph - 20, '', {
      fontFamily: 'Courier New', fontSize: '10px', color: COLORS.TEXT_DANGER,
      wordWrap: { width: pw - 20 },
    }).setOrigin(0, 1);

    this.infoPanel.add([bg, header, headerLabel, this.infoPanelTitle, this.infoPanelText, this.infoPanelSection]);
  }

  private buildLogPanel(): void {
    const lx = GAME_WIDTH - 340;
    const ly = 290;

    const bg = this.add.rectangle(lx, ly, 310, 200, 0x060c12, 0.92)
      .setOrigin(0, 0).setDepth(9).setStrokeStyle(1, 0x223344);

    this.add.text(lx + 10, ly + 8, '📡 SCAN LOG', {
      fontFamily: 'Courier New', fontSize: '10px', color: COLORS.TEXT_SECONDARY,
    }).setDepth(10);

    this.logText = this.add.text(lx + 10, ly + 28, 'Scanning...', {
      fontFamily: 'Courier New', fontSize: '11px', color: '#446688',
      wordWrap: { width: 280 }, lineSpacing: 4,
    }).setDepth(10);

    // Legend
    const legendY = ly + 208;
    this.add.text(lx, legendY, '🔴 Violation   🟢 Compliant   🟡 Review', {
      fontFamily: 'Courier New', fontSize: '10px', color: '#445566',
    }).setDepth(10);
  }

  private buildHeader(): void {
    this.add.rectangle(0, 0, GAME_WIDTH, 44, 0x060c12, 0.95)
      .setOrigin(0, 0).setDepth(8);

    this.add.text(16, 12, '🔍 PII RADAR — QUEST: The PII Scavenger Hunt', {
      fontFamily: 'Courier New', fontSize: '13px', color: COLORS.TEXT_HIGHLIGHT,
    }).setDepth(9);

    this.resultText = this.add.text(GAME_WIDTH - 20, 12, '', {
      fontFamily: 'Courier New', fontSize: '12px', color: COLORS.TEXT_SECONDARY,
    }).setOrigin(1, 0).setDepth(9);

    // Progress counter
    this.progressText = this.add.text(GAME_WIDTH / 2, 12, `Scanning... 0/${this.nodes.length} nodes found  |  Auto-complete in 45s`, {
      fontFamily: 'Courier New', fontSize: '11px', color: '#44aaff',
    }).setOrigin(0.5, 0).setDepth(9);

    // Instructions
    this.add.text(this.CX, GAME_HEIGHT - 20,
      'Click revealed nodes to investigate  |  Wait for full sweep to complete', {
      fontFamily: 'Courier New', fontSize: '11px', color: '#334455',
    }).setOrigin(0.5).setDepth(9);
  }

  private completeScan(): void {
    this.scanComplete = true;
    this.autoCompleteTimer?.destroy();
    this.forceCompleteTimer?.destroy();

    const violations = this.nodes.filter(n => n.type === 'violation').length;
    const compliant  = this.nodes.filter(n => n.type === 'compliant').length;
    const uncertain  = this.nodes.filter(n => n.type === 'uncertain').length;

    this.resultText.setText(`Found: ${violations} violations | ${compliant} clean | ${uncertain} review`);
    this.resultText.setColor(violations > 0 ? COLORS.TEXT_DANGER : COLORS.TEXT_SUCCESS);

    this.progressText.setText(`SCAN COMPLETE — ${this.nodes.length}/${this.nodes.length} nodes found`);
    this.progressText.setColor(COLORS.TEXT_SUCCESS);

    this.logText.setText([
      `Scan complete.`,
      `🔴 ${violations} violations found`,
      `🟢 ${compliant} compliant stores`,
      `🟡 ${uncertain} require review`,
      ``,
      `Click each node for details.`,
    ].join('\n'));

    // Apply score
    ScoreSystem.applyDecision({
      id: 'pii_radar_scan',
      description: 'Completed PII Radar Scan — discovered all shadow PII locations',
      complianceDelta: violations > 0 ? 20 : 25,
      debtDelta: 0,
      trustDelta: 5,
      coinsDelta: 75,
      dpdpSection: '§8 — General Obligations of Data Fiduciary',
    });

    // Add evidence to inventory
    InventorySystem.addItem({
      id: 'pii_scan_report',
      name: 'PII Radar Scan Report',
      description: `Found ${violations} violations across Server District. Admissible as audit evidence.`,
      type: 'evidence',
      icon: '📊',
      dpdpSection: '§8(5)',
    });

    // Complete quest objectives with correct quest ID
    QuestSystem.completeObjective('q_m3_pii_hunt', 'find_s3');
    QuestSystem.completeObjective('q_m3_pii_hunt', 'find_slack');

    // Show done button
    this.showDoneButton(violations);
  }

  private showDoneButton(violations: number): void {
    const bx = this.CX;
    const by = GAME_HEIGHT - 68;

    this.doneButton = this.add.container(bx, by).setDepth(20);

    const bg = this.add.rectangle(0, 0, 280, 44, 0x112233)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setStrokeStyle(2, violations > 0 ? 0xff3333 : 0x00ff88);

    const label = this.add.text(0, 0,
      violations > 0 ? `Report ${violations} Violations & Exit` : 'All Clear — Exit Scan',
      {
        fontFamily: 'Courier New', fontSize: '14px',
        color: violations > 0 ? COLORS.TEXT_DANGER : COLORS.TEXT_SUCCESS,
      }
    ).setOrigin(0.5);

    this.doneButton.add([bg, label]);

    bg.on('pointerover', () => bg.setFillStyle(0x1a3355));
    bg.on('pointerout', () => bg.setFillStyle(0x112233));
    bg.on('pointerdown', () => this.exitScan());

    // Bounce-in
    this.doneButton.setScale(0);
    this.tweens.add({ targets: this.doneButton, scale: 1, duration: 300, ease: 'Back.easeOut' });
  }

  private exitScan(): void {
    this.cameras.main.fadeOut(300, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.stop('PIIRadarScene');
      this.scene.resume(SCENES.HUB_WORLD);
    });
  }
}
