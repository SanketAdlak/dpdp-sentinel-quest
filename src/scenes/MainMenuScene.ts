import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, SCENES, COLORS } from '../constants';
import { ScoreSystem } from '../systems/ScoreSystem';

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
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x050510).setOrigin(0, 0);

    // Animated grid lines (city-like feel)
    const graphics = this.add.graphics();
    graphics.lineStyle(1, 0x112233, 0.3);
    for (let x = 0; x < GAME_WIDTH; x += 64) {
      graphics.lineBetween(x, 0, x, GAME_HEIGHT);
    }
    for (let y = 0; y < GAME_HEIGHT; y += 64) {
      graphics.lineBetween(0, y, GAME_WIDTH, y);
    }

    // Floating data particles
    for (let i = 0; i < 30; i++) {
      const x = Phaser.Math.Between(0, GAME_WIDTH);
      const y = Phaser.Math.Between(0, GAME_HEIGHT);
      const size = Phaser.Math.Between(1, 3);
      const dot = this.add.rectangle(x, y, size, size, 0x004488, 0.6);
      this.tweens.add({
        targets: dot,
        y: y - Phaser.Math.Between(40, 120),
        alpha: 0,
        duration: Phaser.Math.Between(2000, 5000),
        repeat: -1,
        delay: Phaser.Math.Between(0, 3000),
        onRepeat: () => {
          dot.x = Phaser.Math.Between(0, GAME_WIDTH);
          dot.y = Phaser.Math.Between(GAME_HEIGHT - 50, GAME_HEIGHT);
          dot.alpha = 0.6;
        },
      });
    }
  }

  private buildTitle(): void {
    const cx = GAME_WIDTH / 2;

    // Sentinel icon placeholder
    this.add.rectangle(cx, 120, 64, 64, 0x00ffcc, 0.2)
      .setStrokeStyle(2, 0x00ffcc);
    this.add.text(cx, 120, '🛡', { fontSize: '32px' }).setOrigin(0.5);

    this.add.text(cx, 180, 'DPDP SENTINEL QUEST', {
      fontFamily: 'Courier New',
      fontSize: '36px',
      color: '#ffffff',
      stroke: '#00ffcc',
      strokeThickness: 2,
    }).setOrigin(0.5);

    this.add.text(cx, 218, "India's Data Privacy Crisis — Can You Fix It?", {
      fontFamily: 'Courier New',
      fontSize: '14px',
      color: COLORS.TEXT_SECONDARY,
    }).setOrigin(0.5);

    // Blinking subtitle
    const blink = this.add.text(cx, 248, '[ DPDP Act 2023 · Interactive Training ]', {
      fontFamily: 'Courier New',
      fontSize: '11px',
      color: '#334455',
    }).setOrigin(0.5);
    this.tweens.add({
      targets: blink,
      alpha: 0,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });
  }

  private buildMenu(): void {
    const cx = GAME_WIDTH / 2;
    const items = [
      { label: '▶  START GAME', action: () => this.startGame() },
      { label: '📋  HOW TO PLAY', action: () => this.showHowToPlay() },
      { label: '🏆  LEADERBOARD', action: () => this.showLeaderboard() },
    ];

    items.forEach((item, i) => {
      const y = 320 + i * 56;
      const btn = this.add.rectangle(cx, y, 320, 44, 0x112233)
        .setInteractive({ useHandCursor: true })
        .setStrokeStyle(1, 0x334455);

      const label = this.add.text(cx, y, item.label, {
        fontFamily: 'Courier New',
        fontSize: '16px',
        color: COLORS.TEXT_PRIMARY,
      }).setOrigin(0.5);

      btn.on('pointerover', () => {
        btn.setFillStyle(0x224466);
        btn.setStrokeStyle(2, 0x00ffcc);
        label.setColor(COLORS.TEXT_HIGHLIGHT);
      });
      btn.on('pointerout', () => {
        btn.setFillStyle(0x112233);
        btn.setStrokeStyle(1, 0x334455);
        label.setColor(COLORS.TEXT_PRIMARY);
      });
      btn.on('pointerdown', item.action);
    });
  }

  private buildFooter(): void {
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 24, 'MeitY Audit in 30 Days. Are You Ready?', {
      fontFamily: 'Courier New',
      fontSize: '11px',
      color: '#ff4444',
    }).setOrigin(0.5);
  }

  private startGame(): void {
    ScoreSystem.reset();
    this.cameras.main.fadeOut(400, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start(SCENES.HUB_WORLD);
    });
  }

  private showHowToPlay(): void {
    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2;
    const W = 680;
    const H = 480;

    const overlay = this.add.container(cx, cy).setDepth(200);

    // Background
    const bg = this.add.rectangle(0, 0, W, H, 0x050a14, 0.98)
      .setOrigin(0.5)
      .setStrokeStyle(2, 0x00ffcc);

    // Title
    const title = this.add.text(0, -H / 2 + 24, 'HOW TO PLAY', {
      fontFamily: 'Courier New',
      fontSize: '22px',
      color: '#00ffcc',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Game overview
    const overview = this.add.text(0, -H / 2 + 58, [
      'You are the Privacy Champion at IndiaScale — a fast-growing Indian startup.',
      'Fix DPDP Act 2023 compliance violations before the MeitY audit arrives in 30 days.',
      'Every decision you make adds Compliance or Privacy Debt. Choose wisely.',
    ].join('\n'), {
      fontFamily: 'Courier New',
      fontSize: '11px',
      color: '#aabbcc',
      align: 'center',
      lineSpacing: 4,
      wordWrap: { width: W - 48 },
    }).setOrigin(0.5);

    // Controls section
    const controlsHeader = this.add.text(-W / 2 + 24, -H / 2 + 120, '— CONTROLS —', {
      fontFamily: 'Courier New', fontSize: '12px', color: '#ffdd44',
    });

    const controlsText = this.add.text(-W / 2 + 24, -H / 2 + 138, [
      'WASD / Arrow Keys   Move around the world',
      'E                   Talk to an NPC when nearby',
      'SPACE               Advance dialogue / skip typewriter',
      '1 / 2 / 3           Select dialogue choice',
      'F                   PII Radar scan (Server District only)',
      'ENTER               Enter Audit Plaza (when unlocked)',
    ].join('\n'), {
      fontFamily: 'Courier New',
      fontSize: '12px',
      color: '#ffffff',
      lineSpacing: 5,
    });

    // Meters section
    const metersHeader = this.add.text(-W / 2 + 24, -H / 2 + 240, '— YOUR FOUR METERS —', {
      fontFamily: 'Courier New', fontSize: '12px', color: '#ffdd44',
    });

    const metersText = this.add.text(-W / 2 + 24, -H / 2 + 258, [
      'Compliance Score    How compliant IndiaScale is with the DPDP Act. Reach 100% to win.',
      'Privacy Debt        Violations accumulate here. If it hits 100%, you face game over.',
      'Trust Rating        User and regulator trust. Low trust = press coverage + complaints.',
      'Privacy Coins       Earn coins for correct decisions. Spend them on compliance fixes.',
    ].join('\n'), {
      fontFamily: 'Courier New',
      fontSize: '11px',
      color: '#ccddee',
      lineSpacing: 4,
      wordWrap: { width: W - 48 },
    });

    // Key sections
    const sectionsHeader = this.add.text(-W / 2 + 24, -H / 2 + 338, '— KEY DPDP SECTIONS YOU WILL ENCOUNTER —', {
      fontFamily: 'Courier New', fontSize: '12px', color: '#ffdd44',
    });

    const sectionsText = this.add.text(-W / 2 + 24, -H / 2 + 356, [
      '§5 Notice · §6 Consent · §8 Security · §9 Children · §10 SDF · §12 Erasure · §13 Grievance',
    ].join('\n'), {
      fontFamily: 'Courier New',
      fontSize: '11px',
      color: '#88aacc',
      lineSpacing: 4,
    });

    // Close button
    const closeBtnBg = this.add.rectangle(0, H / 2 - 30, 160, 36, 0x00ffcc, 0.15)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setStrokeStyle(1, 0x00ffcc);

    const closeBtnLabel = this.add.text(0, H / 2 - 30, 'Got it!', {
      fontFamily: 'Courier New',
      fontSize: '14px',
      color: '#00ffcc',
    }).setOrigin(0.5);

    closeBtnBg.on('pointerover', () => closeBtnBg.setFillStyle(0x00ffcc, 0.3));
    closeBtnBg.on('pointerout', () => closeBtnBg.setFillStyle(0x00ffcc, 0.15));
    closeBtnBg.on('pointerdown', () => {
      this.tweens.add({
        targets: overlay,
        alpha: 0,
        scale: 0.95,
        duration: 200,
        ease: 'Quad.easeIn',
        onComplete: () => overlay.destroy(),
      });
    });

    overlay.add([
      bg, title, overview,
      controlsHeader, controlsText,
      metersHeader, metersText,
      sectionsHeader, sectionsText,
      closeBtnBg, closeBtnLabel,
    ]);

    // Animate in
    overlay.setAlpha(0).setScale(0.92);
    this.tweens.add({
      targets: overlay,
      alpha: 1,
      scale: 1,
      duration: 250,
      ease: 'Back.easeOut',
    });
  }

  private showLeaderboard(): void {
    // TODO: Show leaderboard overlay
    console.log('Leaderboard coming soon');
  }
}
