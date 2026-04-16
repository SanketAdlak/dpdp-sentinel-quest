import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, SCENES, FONT_UI } from '../constants';
import { ScoreSystem } from '../systems/ScoreSystem';
import { QuestSystem } from '../systems/QuestSystem';

export class EndingScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.ENDING });
  }

  create(): void {
    const cx = GAME_WIDTH / 2;
    const state = ScoreSystem.getState();
    const grade = ScoreSystem.getGrade();
    const passed = ScoreSystem.passedAudit();

    // Background — teal/dark blue for victory, orange for marginal
    const bgColor = passed ? 0x001a14 : 0x1a1000;
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, bgColor).setOrigin(0, 0);

    // Grid
    const g = this.add.graphics();
    g.lineStyle(1, passed ? 0x003322 : 0x221100, 0.6);
    for (let x = 0; x < GAME_WIDTH; x += 80) g.lineBetween(x, 0, x, GAME_HEIGHT);
    for (let y = 0; y < GAME_HEIGHT; y += 80) g.lineBetween(0, y, GAME_WIDTH, y);

    // Floating particles
    const particleColor = passed ? 0x00ffcc : 0xffaa00;
    for (let i = 0; i < 24; i++) {
      const x = Phaser.Math.Between(0, GAME_WIDTH);
      const y = Phaser.Math.Between(0, GAME_HEIGHT);
      const dot = this.add.rectangle(x, y, 3, 3, particleColor, 0.5);
      this.tweens.add({
        targets: dot, y: y - Phaser.Math.Between(60, 160), alpha: 0,
        duration: Phaser.Math.Between(2500, 5500), repeat: -1, delay: Phaser.Math.Between(0, 3000),
        onRepeat: () => { dot.x = Phaser.Math.Between(0, GAME_WIDTH); dot.y = y; dot.alpha = 0.5; },
      });
    }

    // Icon
    this.add.text(cx, 90, passed ? '🏆' : '⚠️', { fontSize: '52px' }).setOrigin(0.5);

    // Title
    const titleColor = passed ? '#00ffcc' : '#ffaa00';
    this.add.text(cx, 168, passed ? 'AUDIT COMPLETE — PASSED!' : 'AUDIT COMPLETE — NEEDS WORK', {
      fontFamily: FONT_UI, fontSize: '34px', color: titleColor, fontStyle: 'bold',
      stroke: passed ? '#00443a' : '#443300', strokeThickness: 2, resolution: 2,
    }).setOrigin(0.5);

    const subtitle = passed
      ? 'IndiaScale is now a model of data privacy under the DPDP Act 2023.'
      : 'IndiaScale passed the audit — but there are still significant gaps to close.';
    this.add.text(cx, 215, subtitle, {
      fontFamily: FONT_UI, fontSize: '15px', color: '#aaccbb', resolution: 2,
    }).setOrigin(0.5);

    // Grade badge
    this.add.rectangle(cx, 262, 300, 44, 0x0a1a14, 0.95)
      .setOrigin(0.5).setStrokeStyle(2, passed ? 0x00ffcc : 0xffaa00);
    this.add.text(cx, 262, `GRADE: ${grade}`, {
      fontFamily: FONT_UI, fontSize: '16px', color: titleColor, fontStyle: 'bold', resolution: 2,
    }).setOrigin(0.5);

    // Stats panel
    const panelW = 520;
    const panelY = 300;
    this.add.rectangle(cx, panelY + 95, panelW, 190, 0x0a1a14, 0.9)
      .setOrigin(0.5).setStrokeStyle(2, 0x334455);

    const stats: Array<{ label: string; value: string; color: string }> = [
      { label: 'Compliance Score', value: `${state.complianceScore}%`,   color: '#00ff88' },
      { label: 'Privacy Debt',     value: `${state.privacyDebt}%`,       color: state.privacyDebt > 60 ? '#ff3333' : '#ffcc00' },
      { label: 'User Trust',       value: `${state.trustRating}%`,       color: '#ffcc00' },
      { label: 'Privacy Coins',    value: `${state.privacyCoins}`,       color: '#44aaff' },
      { label: 'Days Taken',       value: `${state.inGameDay} of 30`,    color: '#aabbcc' },
    ];

    stats.forEach((s, i) => {
      const row = panelY + 25 + i * 34;
      this.add.text(cx - panelW / 2 + 28, row, s.label, {
        fontFamily: FONT_UI, fontSize: '14px', color: '#aabbcc', resolution: 2,
      });
      this.add.text(cx + panelW / 2 - 28, row, s.value, {
        fontFamily: FONT_UI, fontSize: '14px', color: s.color, fontStyle: 'bold', resolution: 2,
      }).setOrigin(1, 0);
    });

    // DPDP takeaway
    this.add.text(cx, 514, 'KEY DPDP ACT 2023 TAKEAWAY', {
      fontFamily: FONT_UI, fontSize: '12px', color: '#667788',
      letterSpacing: 2, resolution: 2,
    }).setOrigin(0.5);

    const lesson = passed
      ? 'Strong consent mechanisms (§6), secure data handling (§8), and\n' +
        'a functioning grievance redressal process (§13) protect users AND your organisation.'
      : 'Before the next audit, strengthen your Privacy Notice (§5),\n' +
        'review consent flows (§6), and appoint a Data Protection Officer.';

    this.add.text(cx, 546, lesson, {
      fontFamily: FONT_UI, fontSize: '13px', color: '#8aaabb',
      align: 'center', lineSpacing: 5, resolution: 2,
    }).setOrigin(0.5);

    // Buttons
    this.buildButton(cx - 110, 640, 'Play Again', 0x001a14, 0x00ffcc, () => {
      ScoreSystem.reset();
      QuestSystem.reset();
      this.cameras.main.fadeOut(400, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start(SCENES.HUB_WORLD);
      });
    });

    this.buildButton(cx + 110, 640, 'Main Menu', 0x111122, 0x44aaff, () => {
      ScoreSystem.reset();
      QuestSystem.reset();
      this.cameras.main.fadeOut(400, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start(SCENES.MAIN_MENU);
      });
    });

    this.cameras.main.fadeIn(600, 0, 0, 0);
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
