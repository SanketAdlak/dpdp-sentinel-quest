import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, SCENES, FONT_UI } from '../constants';
import { ScoreSystem } from '../systems/ScoreSystem';
import { QuestSystem } from '../systems/QuestSystem';

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.MAIN_MENU });
  }

  create(): void {
    this.buildBackground();
    this.buildTitle();
    this.buildMenu();
    this.buildFooter();
  }

  private buildBackground(): void {
    // Lighter deep-blue background instead of near-black
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x0d1f38).setOrigin(0, 0);

    // Subtle grid lines
    const g = this.add.graphics();
    g.lineStyle(1, 0x1e3a5a, 0.5);
    for (let x = 0; x < GAME_WIDTH; x += 80) g.lineBetween(x, 0, x, GAME_HEIGHT);
    for (let y = 0; y < GAME_HEIGHT; y += 80) g.lineBetween(0, y, GAME_WIDTH, y);

    // Brighter floating particles
    for (let i = 0; i < 28; i++) {
      const x    = Phaser.Math.Between(0, GAME_WIDTH);
      const y    = Phaser.Math.Between(0, GAME_HEIGHT);
      const size = Phaser.Math.Between(2, 4);
      const dot  = this.add.rectangle(x, y, size, size, 0x00aaff, 0.5);
      this.tweens.add({
        targets:  dot,
        y:        y - Phaser.Math.Between(50, 130),
        alpha:    0,
        duration: Phaser.Math.Between(2500, 5500),
        repeat:   -1,
        delay:    Phaser.Math.Between(0, 3000),
        onRepeat: () => {
          dot.x     = Phaser.Math.Between(0, GAME_WIDTH);
          dot.y     = Phaser.Math.Between(GAME_HEIGHT - 60, GAME_HEIGHT);
          dot.alpha = 0.5;
        },
      });
    }
  }

  private buildTitle(): void {
    const cx = GAME_WIDTH / 2;

    // Shield icon
    const iconRing = this.add.rectangle(cx, 108, 72, 72, 0x00ffcc, 0.15)
      .setStrokeStyle(2, 0x00ffcc);
    void iconRing;
    this.add.text(cx, 108, '🛡', { fontSize: '34px' }).setOrigin(0.5);

    // Game title — Inter, not Courier New, so it's crisp at all sizes
    this.add.text(cx, 168, 'DPDP SENTINEL QUEST', {
      fontFamily: FONT_UI,
      fontSize: '38px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#00ffcc',
      strokeThickness: 1,
      resolution: 2,
    }).setOrigin(0.5);

    // Subtitle — large enough to read, bright enough to see
    this.add.text(cx, 214, "India's Data Privacy Crisis — Can You Fix It?", {
      fontFamily: FONT_UI,
      fontSize: '18px',
      color: '#a8d8f0',
      resolution: 2,
    }).setOrigin(0.5);

    // Badge line — visible, no blinking
    this.add.text(cx, 244, 'DPDP Act 2023  ·  Interactive Training Game', {
      fontFamily: FONT_UI,
      fontSize: '13px',
      color: '#5ab4d6',
      letterSpacing: 1,
      resolution: 2,
    }).setOrigin(0.5);
  }

  private buildMenu(): void {
    const cx = GAME_WIDTH / 2;

    const items: Array<{ label: string; color: number; action: () => void }> = [
      { label: '▶   START GAME',    color: 0x00ffcc, action: () => this.startGame()      },
      { label: '📋  HOW TO PLAY',   color: 0x44aaff, action: () => this.showHowToPlay()  },
      { label: '🏆  LEADERBOARD',   color: 0xffdd44, action: () => this.showLeaderboard() },
    ];

    items.forEach((item, i) => {
      const y = 308 + i * 58;

      // Lighter button background
      const btn = this.add
        .rectangle(cx, y, 340, 46, 0x1a3455)
        .setStrokeStyle(1, 0x3a6688)
        .setInteractive({ useHandCursor: true });

      const label = this.add.text(cx, y, item.label, {
        fontFamily: FONT_UI,
        fontSize: '17px',
        color: '#e8f4ff',
        fontStyle: '500',
        resolution: 2,
      }).setOrigin(0.5);

      btn.on('pointerover', () => {
        btn.setFillStyle(0x2a5070).setStrokeStyle(2, item.color);
        label.setColor('#ffffff');
      });
      btn.on('pointerout', () => {
        btn.setFillStyle(0x1a3455).setStrokeStyle(1, 0x3a6688);
        label.setColor('#e8f4ff');
      });
      btn.on('pointerdown', item.action);
    });
  }

  private buildFooter(): void {
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 22,
      'MeitY Audit in 30 Days. Are You Ready?', {
        fontFamily: FONT_UI,
        fontSize: '13px',
        color: '#ff6655',
        fontStyle: 'bold',
        resolution: 2,
      }).setOrigin(0.5);
  }

  private startGame(): void {
    ScoreSystem.reset();
    QuestSystem.reset();
    this.cameras.main.fadeOut(400, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start(SCENES.HUB_WORLD);
    });
  }

  private showHowToPlay(): void {
    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2;
    const W  = 700;
    const H  = 500;

    // Full-screen backdrop
    const backdrop = this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.7)
      .setOrigin(0, 0).setDepth(199)
      .setInteractive();   // blocks clicks beneath

    const overlay = this.add.container(cx, cy).setDepth(200);

    // Lighter panel background
    const bg = this.add.rectangle(0, 0, W, H, 0x0f2035, 1)
      .setOrigin(0.5)
      .setStrokeStyle(2, 0x00ffcc);

    const title = this.add.text(0, -H / 2 + 26, 'HOW TO PLAY', {
      fontFamily: FONT_UI, fontSize: '22px', color: '#00ffcc', fontStyle: 'bold', resolution: 2,
    }).setOrigin(0.5);

    const overview = this.add.text(0, -H / 2 + 62, [
      'You are the Privacy Champion at IndiaScale — a fast-growing Indian startup.',
      'Fix DPDP Act 2023 violations before the MeitY audit arrives in 30 days.',
      'Every decision affects Compliance, Privacy Debt, and User Trust.',
    ].join('\n'), {
      fontFamily: FONT_UI, fontSize: '13px', color: '#c8ddf0',
      align: 'center', lineSpacing: 5, wordWrap: { width: W - 60 }, resolution: 2,
    }).setOrigin(0.5);

    const makeHeader = (text: string, y: number) =>
      this.add.text(-W / 2 + 28, y, text, {
        fontFamily: FONT_UI, fontSize: '12px', color: '#ffdd44', fontStyle: 'bold', resolution: 2,
      });

    const makeBody = (lines: string[], y: number) =>
      this.add.text(-W / 2 + 28, y, lines.join('\n'), {
        fontFamily: FONT_UI, fontSize: '12px', color: '#d0e8f8',
        lineSpacing: 5, wordWrap: { width: W - 56 }, resolution: 2,
      });

    const h1 = makeHeader('— CONTROLS —', -H / 2 + 126);
    const b1 = makeBody([
      'WASD / Arrows   Move around the building',
      'E               Talk to an NPC when nearby',
      'SPACE           Advance dialogue / skip text',
      '1 / 2 / 3       Select dialogue choice',
      'F               PII Radar scan (Server District)',
      'ENTER           Enter Audit Plaza when unlocked',
      'I               Open / close Evidence Vault',
    ], -H / 2 + 144);

    const h2 = makeHeader('— YOUR FOUR METERS —', -H / 2 + 258);
    const b2 = makeBody([
      'Compliance     How compliant IndiaScale is — reach 100% to win.',
      'Privacy Debt   Violations accumulate here. 100% = game over.',
      'Trust Rating   User & regulator trust. Low trust = complaints.',
      'Coins          Earn for correct decisions. Used for compliance fixes.',
    ], -H / 2 + 276);

    const h3 = makeHeader('— KEY DPDP SECTIONS —', -H / 2 + 374);
    const b3 = makeBody([
      '§5 Notice · §6 Consent · §8 Security · §9 Children · §12 Erasure · §13 Grievance',
    ], -H / 2 + 392);

    // Close button — use scene.input for reliable click (no container scrollFactor issue)
    const closeBg = this.add.rectangle(cx, cy + H / 2 - 30, 170, 38, 0x004433)
      .setStrokeStyle(1, 0x00ffcc).setDepth(201)
      .setInteractive({ useHandCursor: true });
    const closeLbl = this.add.text(cx, cy + H / 2 - 30, 'Got it!', {
      fontFamily: FONT_UI, fontSize: '15px', color: '#00ffcc', resolution: 2,
    }).setOrigin(0.5).setDepth(201);

    const dismiss = () => {
      this.tweens.add({
        targets: [overlay, backdrop, closeBg, closeLbl],
        alpha: 0, duration: 200, ease: 'Quad.easeIn',
        onComplete: () => { overlay.destroy(); backdrop.destroy(); closeBg.destroy(); closeLbl.destroy(); },
      });
    };

    closeBg.on('pointerover', () => closeBg.setFillStyle(0x006655));
    closeBg.on('pointerout',  () => closeBg.setFillStyle(0x004433));
    closeBg.on('pointerdown', dismiss);
    backdrop.on('pointerdown', dismiss);

    overlay.add([bg, title, overview, h1, b1, h2, b2, h3, b3]);

    overlay.setAlpha(0).setScale(0.93);
    backdrop.setAlpha(0);
    this.tweens.add({ targets: overlay, alpha: 1, scaleX: 1, scaleY: 1, duration: 250, ease: 'Back.easeOut' });
    this.tweens.add({ targets: backdrop, alpha: 0.7, duration: 220 });
  }

  private showLeaderboard(): void {
    // Placeholder
    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2;
    const pop = this.add.container(cx, cy).setDepth(200);
    const bg  = this.add.rectangle(0, 0, 400, 180, 0x0f2035).setOrigin(0.5).setStrokeStyle(2, 0x00ffcc);
    const txt = this.add.text(0, -28, 'Leaderboard', {
      fontFamily: FONT_UI, fontSize: '20px', color: '#00ffcc', fontStyle: 'bold', resolution: 2,
    }).setOrigin(0.5);
    const sub = this.add.text(0, 10, 'Coming soon — play through and\nsubmit your score!', {
      fontFamily: FONT_UI, fontSize: '14px', color: '#a8d8f0', align: 'center', resolution: 2,
    }).setOrigin(0.5);
    const btn = this.add.rectangle(0, 62, 120, 36, 0x004433)
      .setOrigin(0.5).setStrokeStyle(1, 0x00ffcc).setInteractive({ useHandCursor: true });
    const btnLbl = this.add.text(0, 62, 'Close', {
      fontFamily: FONT_UI, fontSize: '14px', color: '#00ffcc', resolution: 2,
    }).setOrigin(0.5);
    pop.add([bg, txt, sub, btn, btnLbl]);
    btn.on('pointerdown', () => { pop.destroy(); });
    pop.setAlpha(0).setScale(0.9);
    this.tweens.add({ targets: pop, alpha: 1, scaleX: 1, scaleY: 1, duration: 220, ease: 'Back.easeOut' });
  }
}
