import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, FONT_UI, FONT_MONO } from '../constants';
import { ScoreSystem } from '../systems/ScoreSystem';

export interface ScoreSnapshot {
  complianceScore: number;
  privacyDebt: number;
  trustRating: number;
  privacyCoins: number;
}

export class ScoreSummary {
  private scene: Phaser.Scene;
  private panel: Phaser.GameObjects.Container | null = null;
  private clickHandler: ((p: Phaser.Input.Pointer) => void) | null = null;
  private moveHandler: ((p: Phaser.Input.Pointer) => void) | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  show(
    npcName: string,
    npcRole: string,
    before: ScoreSnapshot,
    onDismiss: () => void
  ): void {
    // Clean up any existing panel and handlers
    this.cleanup();

    const after = ScoreSystem.getState();
    const s = this.scene;
    const cx = GAME_WIDTH / 2;
    const panelW = 500;
    const panelH = 340;
    const targetY = GAME_HEIGHT / 2;

    // Build container off-screen (below)
    const container = s.add.container(cx, GAME_HEIGHT + panelH).setDepth(200).setScrollFactor(0);
    this.panel = container;

    // Background
    const bg = s.add.rectangle(0, 0, panelW, panelH, 0x050a14, 0.97)
      .setOrigin(0.5).setStrokeStyle(2, 0x00ffcc);

    // Header
    const headerBg = s.add.rectangle(0, -panelH / 2 + 28, panelW, 56, 0x001a33, 1).setOrigin(0.5);
    const headerText = s.add.text(0, -panelH / 2 + 14, 'CONVERSATION IMPACT', {
      fontFamily: FONT_UI, fontSize: '15px', color: '#00ffcc', fontStyle: 'bold',
    }).setOrigin(0.5);
    const npcLabel = s.add.text(0, -panelH / 2 + 36, `${npcName}  ·  ${npcRole}`, {
      fontFamily: FONT_UI, fontSize: '13px', color: '#aabbcc',
    }).setOrigin(0.5);

    container.add([bg, headerBg, headerText, npcLabel]);

    // Metrics
    const metrics: Array<{
      icon: string;
      label: string;
      beforeVal: number;
      afterVal: number;
      higherIsBetter: boolean;
      barColor: number;
      trackColor: number;
      isCoins?: boolean;
    }> = [
      { icon: 'COMPLY', label: 'Compliance',  beforeVal: before.complianceScore, afterVal: after.complianceScore, higherIsBetter: true,  barColor: 0x00FF88, trackColor: 0x003311 },
      { icon: 'DEBT',   label: 'Privacy Debt', beforeVal: before.privacyDebt,    afterVal: after.privacyDebt,    higherIsBetter: false, barColor: 0xFF3344, trackColor: 0x330011 },
      { icon: 'TRUST',  label: 'Trust Rating', beforeVal: before.trustRating,    afterVal: after.trustRating,    higherIsBetter: true,  barColor: 0xFFCC00, trackColor: 0x332200 },
      { icon: 'COINS',  label: 'Coins',        beforeVal: before.privacyCoins,   afterVal: after.privacyCoins,   higherIsBetter: true,  barColor: 0xFFDD44, trackColor: 0x332200, isCoins: true },
    ];

    const rowStartY = -panelH / 2 + 80;
    const rowH = 52;
    const barW = 140;
    const barH = 10;
    const leftX = -panelW / 2 + 18;

    metrics.forEach((m, idx) => {
      const ry = rowStartY + idx * rowH;
      const delta = m.afterVal - m.beforeVal;

      const iconText = s.add.text(leftX, ry, m.icon, {
        fontFamily: FONT_MONO, fontSize: '11px', color: '#556677',
      }).setOrigin(0, 0.5);

      const labelText = s.add.text(leftX + 58, ry, m.label, {
        fontFamily: FONT_UI, fontSize: '13px', color: '#ffffff',
      }).setOrigin(0, 0.5);

      const max = m.isCoins ? 9999 : 100;
      const unit = m.isCoins ? '' : '%';
      const arrowText = s.add.text(leftX + 165, ry, `${m.beforeVal}${unit} → ${m.afterVal}${unit}`, {
        fontFamily: FONT_UI, fontSize: '13px', color: '#aabbcc',
      }).setOrigin(0, 0.5);

      let deltaColor = '#667788';
      if (delta !== 0) {
        const isGood = m.higherIsBetter ? delta > 0 : delta < 0;
        deltaColor = isGood ? '#00ff88' : '#ff4444';
      }
      const sign = delta > 0 ? '+' : '';
      const deltaText = s.add.text(leftX + 302, ry, `${sign}${delta}${unit}`, {
        fontFamily: FONT_UI, fontSize: '14px', color: deltaColor, fontStyle: 'bold',
      }).setOrigin(0, 0.5);

      const barX = leftX + 360;
      const barG = s.add.graphics();
      barG.fillStyle(m.trackColor, 1);
      barG.fillRoundedRect(barX, ry - barH / 2, barW, barH, 3);
      const fillPct = Math.min(1, Math.max(0, m.afterVal / max));
      barG.fillStyle(m.barColor, 1);
      barG.fillRoundedRect(barX, ry - barH / 2, barW * fillPct, barH, 3);

      container.add([iconText, labelText, arrowText, deltaText, barG]);
    });

    // Continue button (visual only — click handled via scene.input)
    const btnY = panelH / 2 - 30;
    const btnBg = s.add.rectangle(0, btnY, 200, 38, 0x112233)
      .setOrigin(0.5).setStrokeStyle(1, 0x00ffcc);
    const btnLabel = s.add.text(0, btnY, '  Continue  [Space]', {
      fontFamily: FONT_UI, fontSize: '14px', color: '#00ffcc', fontStyle: '500',
    }).setOrigin(0.5);
    const hintText = s.add.text(0, panelH / 2 - 8, 'or press Space', {
      fontFamily: FONT_UI, fontSize: '11px', color: '#445566',
    }).setOrigin(0.5);

    container.add([btnBg, btnLabel, hintText]);

    // ── Input handling — use scene.input directly (bypasses scrollFactor/camera issue) ──
    // Button screen bounds (game-space coords, which is what pointer.x/y give us)
    // container screen position = (cx, targetY) [scrollFactor 0]
    // button center within container = (0, btnY)
    // => button screen center = (cx + 0, targetY + btnY) = (cx, targetY + btnY)
    const btnScrX = cx;
    const btnScrY = targetY + btnY;
    const btnHW = 100; // half-width
    const btnHH = 19;  // half-height

    let ready = false;
    let dismissed = false;

    const dismiss = () => {
      if (dismissed) return;
      dismissed = true;
      ready = false;
      this.cleanup();
      s.tweens.add({
        targets: container,
        y: GAME_HEIGHT + panelH + 20,
        alpha: 0,
        duration: 300,
        ease: 'Quad.easeIn',
        onComplete: () => {
          container.destroy();
          this.panel = null;
          onDismiss();
        },
      });
    };

    // Hover highlight via pointermove
    const moveHandler = (pointer: Phaser.Input.Pointer) => {
      const over = Math.abs(pointer.x - btnScrX) <= btnHW && Math.abs(pointer.y - btnScrY) <= btnHH;
      btnBg.setFillStyle(over ? 0x1a3355 : 0x112233);
    };

    const clickHandler = (pointer: Phaser.Input.Pointer) => {
      if (!ready) return;
      if (Math.abs(pointer.x - btnScrX) <= btnHW && Math.abs(pointer.y - btnScrY) <= btnHH) {
        dismiss();
      }
    };

    this.clickHandler = clickHandler;
    this.moveHandler = moveHandler;
    s.input.on('pointerdown', clickHandler);
    s.input.on('pointermove', moveHandler);

    // Space key dismiss
    const spaceKey = s.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    const spaceHandler = () => { if (ready) dismiss(); };
    spaceKey?.once('down', spaceHandler);

    // Slide in from bottom
    s.tweens.add({
      targets: container,
      y: targetY,
      duration: 400,
      ease: 'Back.easeOut',
      onComplete: () => { ready = true; },
    });
  }

  private cleanup(): void {
    if (this.panel) {
      this.panel.destroy();
      this.panel = null;
    }
    if (this.clickHandler) {
      this.scene.input.off('pointerdown', this.clickHandler);
      this.clickHandler = null;
    }
    if (this.moveHandler) {
      this.scene.input.off('pointermove', this.moveHandler);
      this.moveHandler = null;
    }
  }
}
