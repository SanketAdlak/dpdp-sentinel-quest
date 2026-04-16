import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, SCENES, FONT_UI } from '../constants';
import { ScoreSystem } from '../systems/ScoreSystem';
import { QuestSystem } from '../systems/QuestSystem';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.GAME_OVER });
  }

  create(): void {
    const cx = GAME_WIDTH / 2;
    const state = ScoreSystem.getState();

    // Dark red background
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x0a0000).setOrigin(0, 0);

    // Grid overlay
    const g = this.add.graphics();
    g.lineStyle(1, 0x330000, 0.6);
    for (let x = 0; x < GAME_WIDTH; x += 80) g.lineBetween(x, 0, x, GAME_HEIGHT);
    for (let y = 0; y < GAME_HEIGHT; y += 80) g.lineBetween(0, y, GAME_WIDTH, y);

    // Floating particles (red)
    for (let i = 0; i < 18; i++) {
      const x = Phaser.Math.Between(0, GAME_WIDTH);
      const y = Phaser.Math.Between(0, GAME_HEIGHT);
      const dot = this.add.rectangle(x, y, 3, 3, 0xff2222, 0.5);
      this.tweens.add({
        targets: dot, y: y - Phaser.Math.Between(60, 150), alpha: 0,
        duration: Phaser.Math.Between(2500, 5000), repeat: -1, delay: Phaser.Math.Between(0, 2500),
        onRepeat: () => { dot.x = Phaser.Math.Between(0, GAME_WIDTH); dot.y = y; dot.alpha = 0.5; },
      });
    }

    // Icon
    this.add.text(cx, 110, '💔', { fontSize: '48px' }).setOrigin(0.5);

    // Title
    this.add.text(cx, 185, 'PRIVACY DEBT EXCEEDED', {
      fontFamily: FONT_UI, fontSize: '38px', color: '#ff3333', fontStyle: 'bold',
      stroke: '#660000', strokeThickness: 2, resolution: 2,
    }).setOrigin(0.5);

    this.add.text(cx, 235, 'The Data Protection Board has issued an immediate shutdown notice.', {
      fontFamily: FONT_UI, fontSize: '16px', color: '#cc8888', resolution: 2,
    }).setOrigin(0.5);

    // Stats panel
    const panelW = 480;
    const panelY = 290;
    this.add.rectangle(cx, panelY + 80, panelW, 160, 0x1a0000, 0.9)
      .setOrigin(0.5).setStrokeStyle(2, 0xff3333);

    const stats: Array<{ label: string; value: string; color: string }> = [
      { label: 'Final Compliance',  value: `${state.complianceScore}%`,      color: '#00ff88' },
      { label: 'Privacy Debt',      value: `${state.privacyDebt}% (MAX)`,    color: '#ff3333' },
      { label: 'Trust Rating',      value: `${state.trustRating}%`,          color: '#ffcc00' },
      { label: 'Days Survived',     value: `${state.inGameDay} of 30`,       color: '#44aaff' },
    ];

    stats.forEach((s, i) => {
      const row = panelY + 30 + i * 34;
      this.add.text(cx - panelW / 2 + 24, row, s.label, {
        fontFamily: FONT_UI, fontSize: '14px', color: '#aaaaaa', resolution: 2,
      });
      this.add.text(cx + panelW / 2 - 24, row, s.value, {
        fontFamily: FONT_UI, fontSize: '14px', color: s.color, fontStyle: 'bold', resolution: 2,
      }).setOrigin(1, 0);
    });

    // DPDP lesson
    this.add.text(cx, 490, 'WHAT WENT WRONG?', {
      fontFamily: FONT_UI, fontSize: '13px', color: '#ff8888', fontStyle: 'bold',
      letterSpacing: 2, resolution: 2,
    }).setOrigin(0.5);

    this.add.text(cx, 525, [
      'Under the DPDP Act 2023, organisations with high uncorrected privacy violations',
      'face regulatory shutdown, unlimited fines, and public disclosure.',
      'Focus on consent (§6), security (§8), and grievance redressal (§13).',
    ].join('\n'), {
      fontFamily: FONT_UI, fontSize: '13px', color: '#cc7777',
      align: 'center', lineSpacing: 5, resolution: 2,
    }).setOrigin(0.5);

    // Buttons
    this.buildButton(cx - 110, 630, 'Try Again', 0x331111, 0xff3333, () => {
      ScoreSystem.reset();
      QuestSystem.reset();
      this.cameras.main.fadeOut(400, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start(SCENES.HUB_WORLD);
      });
    });

    this.buildButton(cx + 110, 630, 'Main Menu', 0x111122, 0x44aaff, () => {
      ScoreSystem.reset();
      QuestSystem.reset();
      this.cameras.main.fadeOut(400, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start(SCENES.MAIN_MENU);
      });
    });

    this.cameras.main.fadeIn(500, 0, 0, 0);
  }

  private buildButton(x: number, y: number, label: string, fill: number, border: number, action: () => void): void {
    const btn = this.add.rectangle(x, y, 180, 44, fill)
      .setStrokeStyle(2, border).setInteractive({ useHandCursor: true });
    const txt = this.add.text(x, y, label, {
      fontFamily: FONT_UI, fontSize: '16px', color: '#ffffff', fontStyle: 'bold', resolution: 2,
    }).setOrigin(0.5);
    btn.on('pointerover', () => { btn.setFillStyle(fill + 0x111111); txt.setColor('#ffffcc'); });
    btn.on('pointerout',  () => { btn.setFillStyle(fill); txt.setColor('#ffffff'); });
    btn.on('pointerdown', action);
  }
}
